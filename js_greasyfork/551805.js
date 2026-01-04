// ==UserScript==
// @name         LaTeX Suite Snippets
// @namespace    https://nekko-obsidian-latex-suite
// @version      0.7.1
// @description  LaTeX snippets with full options, visual snippets, matrix shortcuts, brace-args jump (\frac{x}{y} -> Tab selects x/y), env switch, smart fraction, tabout, auto-enlarge, robust CE range replacement. Circle toggle.
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551805/LaTeX%20Suite%20Snippets.user.js
// @updateURL https://update.greasyfork.org/scripts/551805/LaTeX%20Suite%20Snippets.meta.js
// ==/UserScript==
(() => {
  'use strict';

  /*************************************************************************
   * 配置
   *************************************************************************/
  const NON_AUTO_TRIGGER_KEY = 'Tab';
  const FRACTION_CMD = "\\frac";
  const EXCLUDED_ENVIRONMENTS = [ ["^{", "}"], ["\\pu{", "}"] ];
  const BREAKING_CHARS = "+-=";
  const TABOUT_ENABLED = true;
  const AUTO_ENLARGE_ENABLED = true;
  const AUTO_ENLARGE_TRIGGERS = ["\\sum", "\\int", "\\frac", "\\prod"];

  const MATRIX_ENV_NAMES = [
    "matrix", "pmatrix", "bmatrix", "Bmatrix", "vmatrix", "Vmatrix",
    "array", "aligned", "align", "align*", "cases"
  ];
  const ENV_CYCLES = [
    ["matrix", "pmatrix", "bmatrix", "Bmatrix", "vmatrix", "Vmatrix"],
    ["align", "align*", "aligned"],
    ["array"],
    ["cases"]
  ];

  /*************************************************************************
   * 你的 snippets（把你的数组粘贴到这里）
   *************************************************************************/
const SNIPPETS = [
  // Math mode
  {trigger: "mk", replacement: "$$0$", options: "tA"},
  {trigger: "dm", replacement: "$$\n$0\n$$", options: "tAw"},
  {trigger: "beg", replacement: "\\begin{$0}\n$1\n\\end{$0}", options: "mA"},


  // Dashes
  // {trigger: "--", replacement: "–", options: "tA"},
  // {trigger: "–-", replacement: "—", options: "tA"},
  // {trigger: "—-", replacement: "---", options: "tA"},


  // Greek letters
  {trigger: "@a", replacement: "\\alpha", options: "mA"},
  {trigger: "@A", replacement: "\\alpha", options: "mA"},
  {trigger: "@b", replacement: "\\beta", options: "mA"},
  {trigger: "@B", replacement: "\\beta", options: "mA"},
  {trigger: "@c", replacement: "\\chi", options: "mA"},
  {trigger: "@C", replacement: "\\chi", options: "mA"},
  {trigger: "@g", replacement: "\\gamma", options: "mA"},
  {trigger: "@G", replacement: "\\Gamma", options: "mA"},
  {trigger: "@d", replacement: "\\delta", options: "mA"},
  {trigger: "@D", replacement: "\\Delta", options: "mA"},
  {trigger: "@e", replacement: "\\epsilon", options: "mA"},
  {trigger: "@E", replacement: "\\epsilon", options: "mA"},
  {trigger: ":e", replacement: "\\varepsilon", options: "mA"},
  {trigger: ":E", replacement: "\\varepsilon", options: "mA"},
  {trigger: "@z", replacement: "\\zeta", options: "mA"},
  {trigger: "@Z", replacement: "\\zeta", options: "mA"},
  {trigger: "@t", replacement: "\\theta", options: "mA"},
  {trigger: "@T", replacement: "\\Theta", options: "mA"},
  {trigger: "@k", replacement: "\\kappa", options: "mA"},
  {trigger: "@K", replacement: "\\kappa", options: "mA"},
  {trigger: "@l", replacement: "\\lambda", options: "mA"},
  {trigger: "@L", replacement: "\\Lambda", options: "mA"},
  {trigger: "@m", replacement: "\\mu", options: "mA"},
  {trigger: "@M", replacement: "\\mu", options: "mA"},
  {trigger: "@r", replacement: "\\rho", options: "mA"},
  {trigger: "@R", replacement: "\\rho", options: "mA"},
  {trigger: "@s", replacement: "\\sigma", options: "mA"},
  {trigger: "@S", replacement: "\\Sigma", options: "mA"},
  {trigger: "ome", replacement: "\\omega", options: "mA"},
  {trigger: "@o", replacement: "\\omega", options: "mA"},
  {trigger: "@O", replacement: "\\Omega", options: "mA"},
  {trigger: "([^\\\\])(${GREEK}|${SYMBOL})", replacement: "[[0]]\\[[1]]", options: "rmA", description: "Add backslash before greek letters and symbols"},


  // Insert space after greek letters and symbols, etc
  {trigger: "\\\\(${GREEK}|${SYMBOL}|${SHORT_SYMBOL})([A-Za-z])", replacement: "\\[[0]] [[1]]", options: "rmA"},
  {trigger: "\\\\(${GREEK}|${SYMBOL}) sr", replacement: "\\[[0]]^{2}", options: "rmA"},
  {trigger: "\\\\(${GREEK}|${SYMBOL}) cb", replacement: "\\[[0]]^{3}", options: "rmA"},
  {trigger: "\\\\(${GREEK}|${SYMBOL}) rd", replacement: "\\[[0]]^{$0}$1", options: "rmA"},
  {trigger: "\\\\(${GREEK}|${SYMBOL}) hat", replacement: "\\hat{\\[[0]]}", options: "rmA"},
  {trigger: "\\\\(${GREEK}|${SYMBOL}) dot", replacement: "\\dot{\\[[0]]}", options: "rmA"},
  {trigger: "\\\\(${GREEK}|${SYMBOL}) bar", replacement: "\\bar{\\[[0]]}", options: "rmA"},
  {trigger: "\\\\(${GREEK}|${SYMBOL}) vec", replacement: "\\vec{\\[[0]]}", options: "rmA"},
  {trigger: "\\\\(${GREEK}|${SYMBOL}) tilde", replacement: "\\tilde{\\[[0]]}", options: "rmA"},
  {trigger: "\\\\(${GREEK}|${SYMBOL}) und", replacement: "\\underline{\\[[0]]}", options: "rmA"},
  {trigger: "\\\\(${GREEK}),\\.", replacement: "\\boldsymbol{\\[[0]]}", options: "rmA"},
  {trigger: "\\\\(${GREEK})\\.,", replacement: "\\boldsymbol{\\[[0]]}", options: "rmA"},


  // Operations
  {trigger: "te", replacement: "\\text{$0}", options: "m"},
  {trigger: "text", replacement: "\\text{$0}", options: "mA"},
  {trigger: "bf", replacement: "\\mathbf{$0}", options: "mA"},
  {trigger: "sr", replacement: "^{2}", options: "mA"},
  {trigger: "cb", replacement: "^{3}", options: "mA"},
  {trigger: "rd", replacement: "^{$0}$1", options: "mA"},
  {trigger: "_", replacement: "_{$0}$1", options: "mA"},
  {trigger: "sts", replacement: "_\\text{$0}", options: "rmA"},
  {trigger: "sq", replacement: "\\sqrt{ $0 }$1", options: "mA"},
  {trigger: "//", replacement: "\\frac{$0}{$1}$2", options: "mA"},
  {trigger: "ee", replacement: "e^{ $0 }$1", options: "mA"},
  {trigger: "rm", replacement: "\\mathrm{$0}$1", options: "mA"},
  {trigger: "conj", replacement: "^{*}", options: "mA"},
  {trigger: "trace", replacement: "\\mathrm{Tr}", options: "mA"},
  {trigger: "det", replacement: "\\det", options: "mA"},
  {trigger: "re", replacement: "\\mathrm{Re}", options: "mA"},
  {trigger: "im", replacement: "\\mathrm{Im}", options: "mA"},

  {trigger: "([a-zA-Z]),\\.", replacement: "\\mathbf{[[0]]}", options: "rmA"},
  {trigger: "([a-zA-Z])\\.,", replacement: "\\mathbf{[[0]]}", options: "rmA"},
  {trigger: "([A-Za-z])(\\d)", replacement: "[[0]]_{[[1]]}", options: "rmA", description: "Auto letter subscript", priority: -1},
  {trigger: "([A-Za-z])_(\\d\\d)", replacement: "[[0]]_{[[1]]}", options: "rmA"},
  {trigger: "\\hat{([A-Za-z])}(\\d)", replacement: "hat{[[0]]}_{[[1]]}", options: "rmA"},
  {trigger: "\\\\mathbf{([A-Za-z])}(\\d)", replacement: "\\mathbf{[[0]]}_{[[1]]}", options: "rmA"},
  {trigger: "\\\\vec{([A-Za-z])}(\\d)", replacement: "\\vec{[[0]]}_{[[1]]}", options: "rmA"},
  {trigger: "([a-zA-Z])bar", replacement: "\\bar{[[0]]}", options: "rmA"},
  {trigger: "([a-zA-Z])hat", replacement: "\\hat{[[0]]}", options: "rmA"},
  {trigger: "([a-zA-Z])ddot", replacement: "\\ddot{[[0]]}", options: "rmA", priority: 3},
  {trigger: "([a-zA-Z])dot", replacement: "\\dot{[[0]]}", options: "rmA", priority: 1},
  {trigger: "([a-zA-Z])vec", replacement: "\\vec{[[0]]}", options: "rmA"},
  {trigger: "([a-zA-Z])tilde", replacement: "\\tilde{[[0]]}", options: "rmA"},
  {trigger: "([a-zA-Z])und", replacement: "\\underline{[[0]]}", options: "rmA"},
  {trigger: "bar", replacement: "\\bar{$0}$1", options: "mA"},
  {trigger: "hat", replacement: "\\hat{$0}$1", options: "mA"},
  {trigger: "dot", replacement: "\\dot{$0}$1", options: "mA"},
  {trigger: "ddot", replacement: "\\ddot{$0}$1", options: "mA", priority: 2},
  {trigger: "cdot", replacement: "\\cdot", options: "mA", priority: 2},
  {trigger: "vec", replacement: "\\vec{$0}$1", options: "mA"},
  {trigger: "tilde", replacement: "\\tilde{$0}$1", options: "mA"},
  {trigger: "und", replacement: "\\underline{$0}$1", options: "mA"},

  {trigger: "([^\\\\])(arcsin|arccos|arctan|arccot|arccsc|arcsec|sin|cos|tan|cot|csc|sec)", replacement: "[[0]]\\[[1]]", options: "rmA"},
  {trigger: "\\\\(arcsin|arccos|arctan|arccot|arccsc|arcsec|sin|cos|tan|cot|csc|sec)([A-Za-gi-z])", replacement: "\\[[0]] [[1]]", options: "rmA"}, // Insert space after trig funcs. Skips letter "h" to allow sinh, cosh, etc.
  {trigger: "\\\\(arcsinh|arccosh|arctanh|arccoth|arcsch|arcsech|sinh|cosh|tanh|coth|csch|sech)([A-Za-z])", replacement: "\\[[0]] [[1]]", options: "rmA"}, // Insert space after trig funcs
  {trigger: "\\\\(neq|geq|leq|gg|ll|sim)([0-9]+)", replacement: "\\[[0]] [[1]]", options: "rmA"}, // Insert space after inequality symbols


  // Visual operations
  {trigger: "U", replacement: "\\underbrace{ ${VISUAL} }_{ $0 }", options: "mA"},
  {trigger: "B", replacement: "\\underset{ $0 }{ ${VISUAL} }", options: "mA"},
  {trigger: "C", replacement: "\\cancel{ ${VISUAL} }", options: "mA"},
  {trigger: "K", replacement: "\\cancelto{ $0 }{ ${VISUAL} }", options: "mA"},
  {trigger: "S", replacement: "\\sqrt{ ${VISUAL} }", options: "mA"},



  // Symbols
  {trigger: "ooo", replacement: "\\infty", options: "mA"},
  {trigger: "sum", replacement: "\\sum", options: "mA"},
  {trigger: "prod", replacement: "\\prod", options: "mA"},
  {trigger: "lim", replacement: "\\lim_{ ${0:n} \\to ${1:\\infty} } $2", options: "mA"},
  {trigger: "([^\\\\])pm", replacement: "[[0]]\\pm", options: "rm"},
  {trigger: "([^\\\\])mp", replacement: "[[0]]\\mp", options: "rm"},
  {trigger: "+-", replacement: "\\pm", options: "mA"},
  {trigger: "-+", replacement: "\\mp", options: "mA"},
  {trigger: "...", replacement: "\\dots", options: "mA"},
  {trigger: "<->", replacement: "\\leftrightarrow ", options: "mA"},
  {trigger: "->", replacement: "\\to", options: "mA"},
  {trigger: "!>", replacement: "\\mapsto", options: "mA"},
  {trigger: "invs", replacement: "^{-1}", options: "mA"},
  {trigger: "\\\\\\", replacement: "\\setminus", options: "mA"},
  {trigger: "||", replacement: "\\mid", options: "mA"},
  {trigger: "and", replacement: "\\cap", options: "mA"},
  {trigger: "orr", replacement: "\\cup", options: "mA"},
  {trigger: "inn", replacement: "\\in", options: "mA"},
  {trigger: "\\subset eq", replacement: "\\subseteq", options: "mA"},
  {trigger: "set", replacement: "\\{ $0 \\}$1", options: "mA"},
  {trigger: "=>", replacement: "\\implies", options: "mA"},
  {trigger: "=<", replacement: "\\impliedby", options: "mA"},
  {trigger: "iff", replacement: "\\iff", options: "mA"},
  {trigger: "e\\xi sts", replacement: "\\exists", options: "mA", priority: 1},
  {trigger: "===", replacement: "\\equiv", options: "mA"},
  {trigger: "Sq", replacement: "\\square", options: "mA"},
  {trigger: "!=", replacement: "\\neq", options: "mA"},
  {trigger: ">=", replacement: "\\geq", options: "mA"},
  {trigger: "<=", replacement: "\\leq", options: "mA"},
  {trigger: ">>", replacement: "\\gg", options: "mA"},
  {trigger: "<<", replacement: "\\ll", options: "mA"},
  {trigger: "~~", replacement: "\\sim", options: "mA"},
  {trigger: "\\sim ~", replacement: "\\approx", options: "mA"},
  {trigger: "prop", replacement: "\\propto", options: "mA"},
  {trigger: "nabl", replacement: "\\nabla", options: "mA"},
  {trigger: "del", replacement: "\\nabla", options: "mA"},
  {trigger: "xx", replacement: "\\times", options: "mA"},
  {trigger: "**", replacement: "\\cdot", options: "mA"},
  {trigger: "para", replacement: "\\parallel", options: "mA"},


  {trigger: "xnn", replacement: "x_{n}", options: "mA"},
  {trigger: "xii", replacement: "x_{i}", options: "mA"},
  {trigger: "xjj", replacement: "x_{j}", options: "mA"},
  {trigger: "xp1", replacement: "x_{n+1}", options: "mA"},
  {trigger: "ynn", replacement: "y_{n}", options: "mA"},
  {trigger: "yii", replacement: "y_{i}", options: "mA"},
  {trigger: "yjj", replacement: "y_{j}", options: "mA"},


  {trigger: "mcal", replacement: "\\mathcal{$0}$1", options: "mA"},
  {trigger: "mbb", replacement: "\\mathbb{$0}$1", options: "mA"},
  {trigger: "ell", replacement: "\\ell", options: "mA"},
  {trigger: "lll", replacement: "\\ell", options: "mA"},
  {trigger: "LL", replacement: "\\mathcal{L}", options: "mA"},
  {trigger: "HH", replacement: "\\mathcal{H}", options: "mA"},
  {trigger: "CC", replacement: "\\mathbb{C}", options: "mA"},
  {trigger: "RR", replacement: "\\mathbb{R}", options: "mA"},
  {trigger: "ZZ", replacement: "\\mathbb{Z}", options: "mA"},
  {trigger: "NN", replacement: "\\mathbb{N}", options: "mA"},
  {trigger: "II", replacement: "\\mathbb{1}", options: "mA"},
  {trigger: "\\mathbb{1}I", replacement: "\\hat{\\mathbb{1}}", options: "mA"},
  {trigger: "AA", replacement: "\\mathcal{A}", options: "mA"},
  {trigger: "BB", replacement: "\\mathbf{B}", options: "mA"},
  {trigger: "EE", replacement: "\\mathbf{E}", options: "mA"},



  // Unit vectors
  {trigger: ":i", replacement: "\\mathbf{i}", options: "mA"},
  {trigger: ":j", replacement: "\\mathbf{j}", options: "mA"},
  {trigger: ":k", replacement: "\\mathbf{k}", options: "mA"},
  {trigger: ":x", replacement: "\\hat{\\mathbf{x}}", options: "mA"},
  {trigger: ":y", replacement: "\\hat{\\mathbf{y}}", options: "mA"},
  {trigger: ":z", replacement: "\\hat{\\mathbf{z}}", options: "mA"},



  // Derivatives
  {trigger: "par", replacement: "\\frac{ \\partial ${0:y} }{ \\partial ${1:x} } $2", options: "m"},
  {trigger: "pa2", replacement: "\\frac{ \\partial^{2} ${0:y} }{ \\partial ${1:x}^{2} } $2", options: "mA"},
  {trigger: "pa3", replacement: "\\frac{ \\partial^{3} ${0:y} }{ \\partial ${1:x}^{3} } $2", options: "mA"},
  {trigger: "pa([A-Za-z])([A-Za-z])", replacement: "\\frac{ \\partial [[0]] }{ \\partial [[1]] } ", options: "rm"},
  {trigger: "pa([A-Za-z])([A-Za-z])([A-Za-z])", replacement: "\\frac{ \\partial^{2} [[0]] }{ \\partial [[1]] \\partial [[2]] } ", options: "rm"},
  {trigger: "pa([A-Za-z])([A-Za-z])2", replacement: "\\frac{ \\partial^{2} [[0]] }{ \\partial [[1]]^{2} } ", options: "rmA"},
  {trigger: "de([A-Za-z])([A-Za-z])", replacement: "\\frac{ d[[0]] }{ d[[1]] } ", options: "rm"},
  {trigger: "de([A-Za-z])([A-Za-z])2", replacement: "\\frac{ d^{2}[[0]] }{ d[[1]]^{2} } ", options: "rmA"},
  {trigger: "ddt", replacement: "\\frac{d}{dt} ", options: "mA"},



  // Integrals
  {trigger: "oinf", replacement: "\\int_{0}^{\\infty} $0 \\, d${1:x} $2", options: "mA"},
  {trigger: "infi", replacement: "\\int_{-\\infty}^{\\infty} $0 \\, d${1:x} $2", options: "mA"},
  {trigger: "dint", replacement: "\\int_{${0:0}}^{${1:\\infty}} $2 \\, d${3:x} $4", options: "mA"},
  {trigger: "oint", replacement: "\\oint", options: "mA"},
  {trigger: "iiint", replacement: "\\iiint", options: "mA"},
  {trigger: "iint", replacement: "\\iint", options: "mA"},
  {trigger: "int", replacement: "\\int $0 \\, d${1:x} $2", options: "mA"},



  // Physics
  {trigger: "kbt", replacement: "k_{B}T", options: "mA"},


  // Quantum mechanics
  {trigger: "hba", replacement: "\\hbar", options: "mA"},
  {trigger: "dag", replacement: "^{\\dagger}", options: "mA"},
  {trigger: "o+", replacement: "\\oplus ", options: "mA"},
  {trigger: "ox", replacement: "\\otimes ", options: "mA"},
  {trigger: "ot\\mathrm{Im}es", replacement: "\\otimes ", options: "mA"}, // Handle conflict with "im" snippet
  {trigger: "bra", replacement: "\\bra{$0} $1", options: "mA"},
  {trigger: "ket", replacement: "\\ket{$0} $1", options: "mA"},
  {trigger: "brk", replacement: "\\braket{ $0 | $1 } $2", options: "mA"},
  {trigger: "\\\\bra{([^|]+)\\|", replacement: "\\braket{ [[0]] | $0 ", options: "rmA", description: "Convert bra into braket"},
  {trigger: "\\\\bra{(.+)}([^ ]+)>", replacement: "\\braket{ [[0]] | $0 ", options: "rmA", description: "Convert bra into braket (alternate)"},
  {trigger: "outp", replacement: "\\ket{${0:\\psi}} \\bra{${0:\\psi}} $1", options: "mA"},



  // Chemistry
  {trigger: "pu", replacement: "\\pu{ $0 }", options: "mA"},
  {trigger: "msun", replacement: "M_{\\odot}", options: "mA"},
  {trigger: "solm", replacement: "M_{\\odot}", options: "mA"},
  {trigger: "ce", replacement: "\\ce{ $0 }", options: "mA"},
  {trigger: "iso", replacement: "{}^{${0:4}}_{${1:2}}${2:He}", options: "mA"},
  {trigger: "hel4", replacement: "{}^{4}_{2}He ", options: "mA"},
  {trigger: "hel3", replacement: "{}^{3}_{2}He ", options: "mA"},



  // Environments
  {trigger: "pmat", replacement: "\\begin{pmatrix}\n$0\n\\end{pmatrix}", options: "mA"},
  {trigger: "bmat", replacement: "\\begin{bmatrix}\n$0\n\\end{bmatrix}", options: "mA"},
  {trigger: "Bmat", replacement: "\\begin{Bmatrix}\n$0\n\\end{Bmatrix}", options: "mA"},
  {trigger: "vmat", replacement: "\\begin{vmatrix}\n$0\n\\end{vmatrix}", options: "mA"},
  {trigger: "Vmat", replacement: "\\begin{Vmatrix}\n$0\n\\end{Vmatrix}", options: "mA"},
  {trigger: "case", replacement: "\\begin{cases}\n$0\n\\end{cases}", options: "mA"},
  {trigger: "align", replacement: "\\begin{align}\n$0\n\\end{align}", options: "mA"},
  {trigger: "array", replacement: "\\begin{array}\n$0\n\\end{array}", options: "mA"},
  {trigger: "matrix", replacement: "\\begin{matrix}\n$0\n\\end{matrix}", options: "mA"},



  // Brackets
  {trigger: "avg", replacement: "\\langle $0 \\rangle $1", options: "mA"},
  {trigger: "norm", replacement: "\\lvert $0 \\rvert $1", options: "mA", priority: 1},
  {trigger: "mod", replacement: "|$0|$1", options: "mA"},
  {trigger: "(", replacement: "(${VISUAL})", options: "mA"},
  {trigger: "[", replacement: "[${VISUAL}]", options: "mA"},
  {trigger: "{", replacement: "{${VISUAL}}", options: "mA"},
  {trigger: "(", replacement: "($0)$1", options: "mA"},
  {trigger: "{", replacement: "{$0}$1", options: "mA"},
  {trigger: "[", replacement: "[$0]$1", options: "mA"},
  {trigger: "lr(", replacement: "\\left( $0 \\right) $1", options: "mA"},
  {trigger: "lr|", replacement: "\\left| $0 \\right| $1", options: "mA"},
  {trigger: "lr{", replacement: "\\left\\{ $0 \\right\\} $1", options: "mA"},
  {trigger: "lr[", replacement: "\\left[ $0 \\right] $1", options: "mA"},
  {trigger: "lra", replacement: "\\left< $0 \\right> $1", options: "mA"},



  // Misc
  {trigger: "tayl", replacement: "${0:f}(${1:x} + ${2:h}) = ${0:f}(${1:x}) + ${0:f}'(${1:x})${2:h} + ${0:f}''(${1:x}) \\frac{${2:h}^{2}}{2!} + \\dots$3", options: "mA"},
];

  /*************************************************************************
   * 状态
   *************************************************************************/
  const MAX_LOOKBEHIND = 256;
  const CARET_TOKEN = '\uFFF9';
  const FIELD_START = '\uFFF0';
  const FIELD_END   = '\uFFF1';
  const STORE_KEY_ENABLED = 'latex_suite_enabled';
  const STORE_KEY_BTN_POS = 'latex_suite_button_pos';

  // 默认 OFF
  let enabled = !!GM_getValue(STORE_KEY_ENABLED, false);
  let _latexSuiteBusy = false;
  let _isComposing = false;
  let _allowOnceAfterComposition = false;

  /*************************************************************************
   * 圆形小球按钮（右上角，拖动，ON=不透明，OFF=0.5）
   *************************************************************************/
  GM_addStyle(`
    .latex-suite-toggle {
      position: fixed; top: 12px; right: 12px; z-index: 2147483647;
      width: 44px; height: 44px; border-radius: 50%;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      cursor: move; user-select: none;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 12px; font-family: system-ui,-apple-system,"Segoe UI",Roboto,Arial,"Noto Sans","Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
      background: #22c55e;
      opacity: ${enabled ? '1' : '0.5'};
    }
    .latex-suite-off { background: #ef4444; }
  `);
  const btn = document.createElement('div');
  btn.className = `latex-suite-toggle ${enabled ? '' : 'latex-suite-off'}`;
  btn.textContent = 'La';
  document.documentElement.appendChild(btn);

  (function restoreBtnPos() {
    const pos = GM_getValue(STORE_KEY_BTN_POS);
    if (!pos) return;
    const { top, left } = pos;
    btn.style.top = top + 'px';
    btn.style.left = left + 'px';
    btn.style.right = 'unset';
  })();
  (function initDragAndToggle() {
    let dragging = false, moved = false, startX = 0, startY = 0, startTop = 0, startLeft = 0;
    btn.addEventListener('mousedown', (e) => {
      dragging = true; moved = false; btn.style.cursor = 'grabbing';
      startX = e.clientX; startY = e.clientY;
      const r = btn.getBoundingClientRect(); startTop = r.top; startLeft = r.left;
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
      btn.style.top = Math.max(0, startTop + dy) + 'px';
      btn.style.left = Math.max(0, startLeft + dx) + 'px';
      btn.style.right = 'unset';
    }, true);
    window.addEventListener('mouseup', () => {
      if (!dragging) return; dragging = false; btn.style.cursor = 'move';
      if (!moved) {
        enabled = !enabled;
        GM_setValue(STORE_KEY_ENABLED, enabled);
        btn.classList.toggle('latex-suite-off', !enabled);
        btn.style.opacity = enabled ? '1' : '0.5';
      } else {
        const r = btn.getBoundingClientRect();
        GM_setValue(STORE_KEY_BTN_POS, { top: r.top, left: r.left });
      }
    }, true);
  })();

  /*************************************************************************
   * 编辑区/CE 工具
   *************************************************************************/
  function getActiveEditable() {
    const el = document.activeElement;
    if (!el) return null;
    const isTextarea = el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.type === 'text');
    const isCE = el.isContentEditable;
    if (isTextarea || isCE) return el;
    return null;
  }
  function getSelectionInCE(root) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    if (!root.contains(range.startContainer)) return null;
    return range;
  }
  function getTextAndCaret(el) {
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      return { type: 'textarea', text: el.value, start: el.selectionStart, end: el.selectionEnd };
    } else {
      const range = getSelectionInCE(el); if (!range) return null;
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      let text = '', startOff = -1, endOff = -1, cur = 0;
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node === range.startContainer) startOff = cur + range.startOffset;
        if (node === range.endContainer)   endOff = cur + range.endOffset;
        text += node.nodeValue; cur += node.nodeValue.length;
      }
      return { type: 'contenteditable', text, start: Math.min(startOff, endOff), end: Math.max(startOff, endOff), root: el };
    }
  }
  function locateNodeByOffset(root, targetOffset) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let offset = 0;
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const next = offset + node.nodeValue.length;
      if (targetOffset <= next) return { node, local: targetOffset - offset };
      offset = next;
    }
    return { node: root, local: root.childNodes.length };
  }
  function setCaretOnly(ed, sel, newPos) {
    if (sel.type === 'textarea') {
      ed.setSelectionRange(newPos, newPos);
      ed.dispatchEvent(new InputEvent('input', { bubbles: true }));
    } else {
      const range = document.createRange();
      const { node, local } = locateNodeByOffset(ed, newPos);
      if (node.nodeType === Node.TEXT_NODE) range.setStart(node, local);
      else range.setStart(ed, ed.childNodes.length);
      range.collapse(true);
      const s = window.getSelection(); s.removeAllRanges(); s.addRange(range);
      ed.dispatchEvent(new InputEvent('input', { bubbles: true }));
    }
  }
  function setSelectionInEditor(ed, sel, start, end) {
    if (sel.type === 'textarea') {
      ed.setSelectionRange(start, end);
      ed.dispatchEvent(new InputEvent('input', { bubbles: true }));
    } else {
      const a = locateNodeByOffset(ed, start);
      const b = locateNodeByOffset(ed, end);
      const range = document.createRange();
      if (a.node.nodeType === Node.TEXT_NODE) range.setStart(a.node, a.local);
      else range.setStart(ed, ed.childNodes.length);
      if (b.node.nodeType === Node.TEXT_NODE) range.setEnd(b.node, b.local);
      else range.setEnd(ed, ed.childNodes.length);
      const s = window.getSelection(); s.removeAllRanges(); s.addRange(range);
      ed.dispatchEvent(new InputEvent('input', { bubbles: true }));
    }
  }
  function replaceRangeInEditor(ed, sel, start, end, replacement, newCaret) {
    if (sel.type === 'textarea') {
      ed.setSelectionRange(start, end);
      ed.setRangeText(replacement, start, end, 'end');
      ed.setSelectionRange(newCaret, newCaret);
      ed.dispatchEvent(new InputEvent('input', { bubbles: true }));
    } else {
      const range = document.createRange();
      const a = locateNodeByOffset(ed, start);
      const b = locateNodeByOffset(ed, end);
      if (a.node.nodeType === Node.TEXT_NODE) range.setStart(a.node, a.local);
      else range.setStart(ed, ed.childNodes.length);
      if (b.node.nodeType === Node.TEXT_NODE) range.setEnd(b.node, b.local);
      else range.setEnd(ed, ed.childNodes.length);
      range.deleteContents();
      const textNode = document.createTextNode(replacement);
      range.insertNode(textNode);
      const caretRange = document.createRange();
      const caretLocal = Math.max(0, Math.min(replacement.length, newCaret - start));
      caretRange.setStart(textNode, caretLocal);
      caretRange.collapse(true);
      const s = window.getSelection(); s.removeAllRanges(); s.addRange(caretRange);
      ed.dispatchEvent(new InputEvent('input', { bubbles: true }));
    }
  }

  /*************************************************************************
   * 组合输入保护
   *************************************************************************/
  window.addEventListener('compositionstart', () => { _isComposing = true; }, true);
  window.addEventListener('compositionend',   () => {
    _isComposing = false; _allowOnceAfterComposition = true;
    setTimeout(() => { _allowOnceAfterComposition = false; }, 0);
  }, true);
  function isCharacterInsertion(e) {
    if (!(e instanceof InputEvent)) return false;
    if (_isComposing) return false;
    const t = e.inputType || '';
    if (t === 'insertText' || t === 'insertCompositionText') return true;
    if (_allowOnceAfterComposition) return true;
    return false;
  }

  /*************************************************************************
   * 模式与数学判断
   *************************************************************************/
  function isInsideCodeFence(text, pos) {
    const fence = /```/g; let count = 0, m;
    while ((m = fence.exec(text)) && m.index < pos) count++;
    return (count % 2) === 1;
  }
  function isEscaped(text, idx) {
    let backslashes = 0; for (let i = idx - 1; i >= 0 && text[i] === '\\'; i--) backslashes++;
    return (backslashes % 2) === 1;
  }
  function nearestUnescapedPairPositions(text, pos, token) {
    const re = token === '$$' ? /\$\$/g : /\$/g;
    const idxs = []; let m;
    while ((m = re.exec(text))) { if (!isEscaped(text, m.index)) idxs.push(m.index); }
    let left = -1, right = -1;
    for (let i = 0; i < idxs.length; i++) {
      const a = idxs[i], b = idxs[i + 1];
      if (a < pos && b !== undefined && b > pos) { left = a; right = b; break; }
    }
    return { left, right };
  }
  function inBlockMath(text, pos) {
    const { left, right } = nearestUnescapedPairPositions(text, pos, '$$');
    return left !== -1 && right !== -1;
  }
  function inInlineMath(text, pos) {
    if (inBlockMath(text, pos)) return false;
    const { left, right } = nearestUnescapedPairPositions(text, pos, '$');
    return left !== -1 && right !== -1;
  }
  function inMath(text, pos) { return inInlineMath(text, pos) || inBlockMath(text, pos); }

  /*************************************************************************
   * 词边界 / 模式过滤
   *************************************************************************/
  function passesModeOptions(options, fullText, caretPos) {
    if (!options) return true;
    const inCode = isInsideCodeFence(fullText, caretPos);
    const inBlk  = inBlockMath(fullText, caretPos);
    const inInl  = inInlineMath(fullText, caretPos);
    const inM    = inBlk || inInl;
    if (options.includes('c') && !inCode) return false;
    if (options.includes('t') && inM) return false;
    if (options.includes('m') && !inM) return false;
    if (options.includes('M') && !inBlk) return false;
    if (options.includes('n') && !inInl) return false;
    return true;
  }
  function passesWordBoundary(options, fullText, from, to) {
    if (!options || !options.includes('w')) return true;
    const isDelim = (ch) => { if (!ch) return true; return /\s|[.,;:!?()\[\]{}<>\-+*/=|\\]/.test(ch); };
    const prev = fullText[from - 1];
    const next = fullText[to];
    return isDelim(prev) && isDelim(next);
  }

  /*************************************************************************
   * 触发匹配
   *************************************************************************/
  function matchSnippet(beforeText, fullText, caretPos, snippet) {
    const { trigger, options = '' } = snippet;
    const hay = beforeText.slice(-MAX_LOOKBEHIND);
    if (!passesModeOptions(options, fullText, caretPos)) return null;
    function prevCharIsBackslash(globalBefore, fromIndex) {
      const prevIdx = fromIndex - 1; if (prevIdx < 0) return false;
      return globalBefore[prevIdx] === '\\';
    }
    if (options.includes('r')) {
      let re; try { re = new RegExp(trigger + '$', options.includes('m') ? 'm' : ''); } catch { return null; }
      const m = hay.match(re); if (!m) return null;
      const from = beforeText.length - m[0].length;
      const globalFrom = caretPos - m[0].length, globalTo = caretPos;
      if (!passesWordBoundary(options, fullText, globalFrom, globalTo)) return null;
      if (prevCharIsBackslash(fullText, globalFrom)) return null;
      return { from: globalFrom, to: globalTo, match: m };
    } else {
      if (!hay.endsWith(trigger)) return null;
      const globalFrom = caretPos - trigger.length, globalTo = caretPos;
      if (!passesWordBoundary(options, fullText, globalFrom, globalTo)) return null;
      if (prevCharIsBackslash(fullText, globalFrom)) return null;
      return { from: globalFrom, to: globalTo, match: null };
    }
  }

  /*************************************************************************
   * expand（就地）
   *************************************************************************/
  function parseSnippetTemplate(tpl, visualText = '') {
    tpl = tpl.replace(/\$\{?VISUAL\}?/g, visualText);
    const fields = [];
    tpl = tpl.replace(/\$\{(\d+):([^}]*)\}/g, (m, nStr, def) => FIELD_START + parseInt(nStr, 10) + ':' + def + FIELD_END);
    tpl = tpl.replace(/\$(\d+)/g, (m, nStr) => FIELD_START + parseInt(nStr, 10) + ':' + '' + FIELD_END);
    tpl = tpl.replace(/\$0/g, CARET_TOKEN);
    let out = '', i = 0;
    while (i < tpl.length) {
      if (tpl[i] === FIELD_START) {
        let j = i + 1, buf = '';
        while (j < tpl.length && tpl[j] !== FIELD_END) buf += tpl[j++];
        const m = buf.match(/^(\d+):(.*)$/s);
        const n = parseInt(m[1], 10), def = m[2];
        const start = out.length; out += def; const end = out.length;
        fields.push({ n, start, end }); i = j + 1;
      } else { out += tpl[i++]; }
    }
    const caretIndex = out.indexOf(CARET_TOKEN);
    const text = out.replace(CARET_TOKEN, '');
    fields.sort((a, b) => a.n - b.n);
    return { text, fields, caret: (caretIndex === -1 ? null : caretIndex) };
  }
  function expandWithSnippet(ed, sel, snip, m, visualText = '') {
    let replTpl = snip.replacement;
    if (m && m.match && m.match.length && /\[\[\d+\]\]/.test(replTpl)) {
      replTpl = replTpl.replace(/\[\[(\d+)\]\]/g, (mm, k) => m.match[parseInt(k, 10)] ?? '');
    }
    const { text: replaced, fields, caret } = parseSnippetTemplate(replTpl, visualText);
    const start = m ? m.from : sel.start;
    const end   = m ? m.to   : sel.end;
    let newCaret = start + replaced.length;
    if (caret !== null) newCaret = start + caret;
    else if (fields.length > 0) newCaret = start + fields[0].start;
    _latexSuiteBusy = true;
    replaceRangeInEditor(ed, sel, start, end, replaced, newCaret);
    setTimeout(() => { _latexSuiteBusy = false; }, 0);
    return true;
  }

  /*************************************************************************
   * 自动片段
   *************************************************************************/
  const autoSnipsByLastChar = new Map(), autoRegexSnips = [];
  (function prepareAutoIndex() {
    for (const s of SNIPPETS) {
      const hasA = (s.options || '').includes('A');
      const auto = (s.auto !== undefined) ? !!s.auto : !!hasA;
      if (!auto) continue;
      if ((s.options || '').includes('r')) autoRegexSnips.push(s);
      else if (typeof s.trigger === 'string' && s.trigger.length > 0) {
        const last = s.trigger.slice(-1);
        if (!autoSnipsByLastChar.has(last)) autoSnipsByLastChar.set(last, []);
        autoSnipsByLastChar.get(last).push(s);
      }
    }
  })();
  function tryAutoExpand(e) {
    if (!enabled) return;
    if (_latexSuiteBusy) return;
    if (!isCharacterInsertion(e)) return;
    const ed = getActiveEditable(); if (!ed) return;
    const sel = getTextAndCaret(ed); if (!sel) return;
    if (sel.start !== sel.end) return;
    const full = sel.text;
    const before = full.slice(0, sel.start);
    const lastChar = (e && typeof e.data === 'string' && e.data.length === 1) ? e.data : null;
    if (lastChar && autoSnipsByLastChar.has(lastChar)) {
      for (const snip of autoSnipsByLastChar.get(lastChar)) {
        const m = matchSnippet(before, full, sel.start, snip); if (!m) continue;
        expandWithSnippet(ed, sel, snip, m); return;
      }
    }
    for (const snip of autoRegexSnips) {
      const m = matchSnippet(before, full, sel.start, snip); if (!m) continue;
      expandWithSnippet(ed, sel, snip, m); return;
    }
  }
  window.addEventListener('input', tryAutoExpand, true);

  /*************************************************************************
   * Visual snippets：选区 + 单字符触发
   *************************************************************************/
  window.addEventListener('keydown', (e) => {
    if (!enabled) return;
    const ed = getActiveEditable(); if (!ed) return;
    const sel = getTextAndCaret(ed); if (!sel) return;
    if (sel.start === sel.end) return;
    if (e.key && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const visualText = sel.text.slice(sel.start, sel.end);
      for (const snip of SNIPPETS) {
        const opts = snip.options || '';
        if (!opts.includes('v')) continue;
        if (opts.includes('r')) continue;
        if (snip.trigger !== e.key) continue;
        if (!passesModeOptions(opts, sel.text, sel.start)) continue;
        e.preventDefault();
        expandWithSnippet(ed, sel, snip, null, visualText);
        return;
      }
    }
  }, true);

  /*************************************************************************
   * 环境定位/切换 与 花括号参数跳转
   *************************************************************************/
  function findEnvAtPos(fullText, pos) {
    const beginRe = /\\begin\{([a-zA-Z*]+)\}/g;
    let beginMatch, begins = [];
    while ((beginMatch = beginRe.exec(fullText))) {
      const name = beginMatch[1];
      begins.push({
        name,
        beginNameStart: beginMatch.index + "\\begin{".length,
        beginNameEnd:   beginMatch.index + "\\begin{".length + name.length,
        beginTokenStart: beginMatch.index,
        beginTokenEnd:   beginMatch.index + beginMatch[0].length
      });
    }
    let cand = null;
    for (const b of begins) if (b.beginTokenStart <= pos && (!cand || b.beginTokenStart > cand.beginTokenStart)) cand = b;
    if (!cand) return null;
    const name = cand.name;
    const endRe = new RegExp(String.raw`\\(begin|end)\{(${name.replace('*','\\*')})\}`, 'g');
    endRe.lastIndex = cand.beginTokenEnd;
    let depth = 1, m, endTokenStart=-1, endNameStart=-1, endNameEnd=-1, endTokenEnd=-1;
    while ((m = endRe.exec(fullText))) {
      const kind = m[1];
      if (kind === 'begin') depth++; else depth--;
      if (depth === 0) {
        endTokenStart = m.index;
        endNameStart  = m.index + "\\end{".length;
        endNameEnd    = endNameStart + name.length;
        endTokenEnd   = m.index + m[0].length;
        break;
      }
    }
    if (depth !== 0) return null;
    if (!(cand.beginTokenStart <= pos && pos <= endTokenEnd)) return null;
    return { name,
      beginNameStart: cand.beginNameStart, beginNameEnd: cand.beginNameEnd,
      endNameStart, endNameEnd,
      beginTokenStart: cand.beginTokenStart, beginTokenEnd: cand.beginTokenEnd,
      endTokenStart, endTokenEnd
    };
  }
  function nextEnvName(current, dir) {
    for (const cycle of ENV_CYCLES) {
      const idx = cycle.indexOf(current);
      if (idx !== -1) {
        if (cycle.length <= 1) return current;
        const n = (idx + (dir > 0 ? 1 : -1) + cycle.length) % cycle.length;
        return cycle[n];
      }
    }
    return current;
  }

  // 找到以命令为中心的连续 {…} 参数，并返回各参数内部区间
  function findBraceArgsNear(fullText, pos) {
    let i = pos - 1;
    while (i >= 0 && /\s/.test(fullText[i])) i--;
    while (i >= 0 && /[a-zA-Z*]/.test(fullText[i])) i--;
    if (i < 0 || fullText[i] !== '\\') return null;
    const cmdStart = i;
    let j = i + 1;
    while (j < fullText.length && /[a-zA-Z*]/.test(fullText[j])) j++;
    const cmdEnd = j;
    const args = [];
    let k = j;
    while (k < fullText.length) {
      while (k < fullText.length && /\s/.test(fullText[k])) k++;
      if (fullText[k] !== '{') break;
      let depth = 0, a = k, b = k;
      while (b < fullText.length) {
        if (fullText[b] === '{') depth++;
        else if (fullText[b] === '}') { depth--; if (depth === 0) break; }
        b++;
      }
      if (depth !== 0) break;
      args.push({ innerStart: a + 1, innerEnd: b });
      k = b + 1;
    }
    if (args.length === 0) return null;
    return { cmdStart, cmdEnd, args };
  }

  // 关键：在参数内部按 Tab，直接跳到“下一个”；已选中某参数时继续跳到下一/上一
  function pickArgIndex(args, selStart, selEnd, dir) {
    const step = (dir > 0 ? 1 : -1);
    const L = args.length;
    for (let idx = 0; idx < L; idx++) {
      const a = args[idx];
      if (selStart === a.innerStart && selEnd === a.innerEnd) {
        return (idx + step + L) % L;
      }
    }
    for (let idx = 0; idx < L; idx++) {
      const a = args[idx];
      if (selStart >= a.innerStart && selStart <= a.innerEnd) {
        return (idx + step + L) % L;
      }
    }
    return dir > 0 ? 0 : L - 1;
  }

  /*************************************************************************
   * 键盘：环境切换 / 花括号参数跳转 / matrix 快捷 / Tabout / 非自动片段
   *************************************************************************/
  function onKeyDown(e) {
    const ed = getActiveEditable(); if (!ed) return;
    const sel = getTextAndCaret(ed); if (!sel) return;
    if (!enabled) return;

    // 1) 花括号参数跳转：Tab / Shift+Tab（设置“选区”，让后续输入覆盖选中文本）
    if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const full = sel.text;
      const brace = findBraceArgsNear(full, sel.start);
      if (brace && inMath(full, sel.start)) {
        e.preventDefault();
        const dir = e.shiftKey ? -1 : +1;
        const idx = pickArgIndex(brace.args, sel.start, sel.end, dir);
        const target = brace.args[idx];
        setSelectionInEditor(ed, sel, target.innerStart, target.innerEnd);
        return;
      }
    }

    // 2) 环境切换：Tab / Shift+Tab（光标在 begin..end 范围内）
    if ((e.key === 'Tab') && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const full = sel.text;
      if (sel.start === sel.end) {
        const env = findEnvAtPos(full, sel.start);
        if (env) {
          const dir = e.shiftKey ? -1 : +1;
          const newName = nextEnvName(env.name, dir);
          if (newName !== env.name) {
            e.preventDefault();
            _latexSuiteBusy = true;
            replaceRangeInEditor(ed, sel, env.endNameStart,   env.endNameEnd,   newName, sel.start);
            replaceRangeInEditor(ed, getTextAndCaret(ed), env.beginNameStart, env.beginNameEnd, newName, sel.start);
            setTimeout(() => { _latexSuiteBusy = false; }, 0);
            return;
          }
        }
      }
    }

    // 3) Matrix 快捷
    if (e.key === 'Tab' || e.key === 'Enter') {
      const full = sel.text;
      if (inMatrixLikeEnv(full, sel.start)) {
        if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          _latexSuiteBusy = true;
          replaceRangeInEditor(ed, sel, sel.start, sel.end, '&', sel.start + 1);
          setTimeout(() => { _latexSuiteBusy = false; }, 0);
          return;
        }
        if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          if (!e.shiftKey) {
            const rep = '\\\\\n';
            _latexSuiteBusy = true;
            replaceRangeInEditor(ed, sel, sel.start, sel.end, rep, sel.start + rep.length);
            setTimeout(() => { _latexSuiteBusy = false; }, 0);
            return;
          } else {
            const after = full.slice(sel.end);
            const nIdx = after.indexOf('\n');
            const jumpPos = (nIdx === -1) ? full.length : (sel.end + nIdx);
            setCaretOnly(ed, sel, jumpPos);
            e.preventDefault();
            return;
          }
        }
      }
    }

    // 4) Tabout
    if (TABOUT_ENABLED && e.key === NON_AUTO_TRIGGER_KEY && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const after = sel.text.slice(sel.end);
      if (after.startsWith('$$')) { e.preventDefault(); setCaretOnly(ed, sel, sel.start + 2); return; }
      if (after.startsWith('$'))  { e.preventDefault(); setCaretOnly(ed, sel, sel.start + 1); return; }
      const first = after[0];
      if (')]}>|'.includes(first)) { e.preventDefault(); setCaretOnly(ed, sel, sel.start + 1); return; }
    }

    // 5) 非自动片段（Tab 触发）
    if (e.key === NON_AUTO_TRIGGER_KEY && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if (_latexSuiteBusy) return;
      if (sel.start !== sel.end) return;
      const before = sel.text.slice(0, sel.start);
      for (const snip of SNIPPETS) {
        const opts = snip.options || '';
        const hasA = opts.includes('A');
        const auto = (snip.auto !== undefined) ? !!snip.auto : !!hasA;
        if (auto) continue;
        const m = matchSnippet(before, sel.text, sel.start, snip); if (!m) continue;
        e.preventDefault();
        expandWithSnippet(ed, sel, snip, m);
        return;
      }
    }
  }
  window.addEventListener('keydown', onKeyDown, true);

  function inMatrixLikeEnv(text, pos) {
    const left = text.lastIndexOf('\\begin{', pos);
    if (left === -1) return false;
    const right = text.indexOf('}', left + 7);
    if (right === -1 || right > pos) return false;
    const env = text.slice(left + 7, right);
    return MATRIX_ENV_NAMES.includes(env);
  }

  /*************************************************************************
   * Auto-fraction（仅字符输入、数学环境，“/”）
   *************************************************************************/
  window.addEventListener('input', function onSlashAutoFrac(e) {
    if (!enabled) return; if (_latexSuiteBusy) return; if (!isCharacterInsertion(e)) return;
    const ed = getActiveEditable(); if (!ed) return;
    const sel = getTextAndCaret(ed); if (!sel) return;
    if (sel.start !== sel.end) return;
    const full = sel.text;
    const before = full.slice(0, sel.start);
    const after  = full.slice(sel.end);
    if (!before.endsWith('/')) return;
    if (!inMath(full, sel.start)) return;
    if (inExcludedEnvironment(before, after, EXCLUDED_ENVIRONMENTS)) return;
    const leftBound = findNumeratorStart(before.slice(0, -1), BREAKING_CHARS);
    const rightBound = findDenominatorEnd(after, BREAKING_CHARS);
    const numerator   = before.slice(leftBound, -1);
    const denominator = after.slice(0, rightBound);
    if (!numerator.trim() || !denominator.trim()) return;
    const globalStart = leftBound;
    const globalEnd   = sel.start + rightBound;
    const replacement = `${FRACTION_CMD}{${numerator}}{${denominator}}`;
    const newCaret = globalStart + FRACTION_CMD.length + 2;
    _latexSuiteBusy = true;
    replaceRangeInEditor(ed, sel, globalStart, globalEnd, replacement, newCaret);
    setTimeout(() => { _latexSuiteBusy = false; }, 0);
  }, true);
  function isBreakingChar(ch, breakingStr) { return breakingStr.includes(ch); }
  function findNumeratorStart(leftText, breakingStr) {
    let i = leftText.length - 1, depth = 0;
    while (i >= 0) {
      const ch = leftText[i];
      if (ch === ')' || ch === ']' || ch === '}') depth++;
      else if (ch === '(' || ch === '[' || ch === '{') { if (depth === 0) break; depth--; }
      if (depth === 0 && (isBreakingChar(ch, breakingStr) || /\s/.test(ch))) break;
      i--;
    }
    return i + 1;
  }
  function findDenominatorEnd(rightText, breakingStr) {
    let i = 0, depth = 0;
    while (i < rightText.length) {
      const ch = rightText[i];
      if (ch === '(' || ch === '[' || ch === '{') depth++;
      else if (ch === ')' || ch === ']' || ch === '}') { if (depth === 0) break; depth--; }
      if (depth === 0 && (isBreakingChar(ch, breakingStr) || /\s/.test(ch))) break;
      i++;
    }
    return i;
  }
  function inExcludedEnvironment(before, _after, envs) {
    for (const [startTok, _endTok] of envs) {
      const idx = before.lastIndexOf(startTok); if (idx === -1) continue;
      const segment = before.slice(idx + startTok.length);
      let balance = 0;
      for (const ch of segment) { if (ch === '{') balance++; else if (ch === '}') balance--; }
      if (balance > 0) return true;
    }
    return false;
  }

  /*************************************************************************
   * Auto-enlarge：右括号时放大（数学环境）
   *************************************************************************/
  window.addEventListener('input', function onAutoEnlarge(e) {
    if (!enabled) return; if (!AUTO_ENLARGE_ENABLED) return;
    if (_latexSuiteBusy) return; if (!isCharacterInsertion(e)) return;
    const ed = getActiveEditable(); if (!ed) return;
    const sel = getTextAndCaret(ed); if (!sel) return;
    if (sel.start !== sel.end) return;
    const full = sel.text;
    const before = full.slice(0, sel.start);
    const after  = full.slice(sel.end);
    const lastCh = before.slice(-1);
    if (!')]}'.includes(lastCh)) return;
    if (!inMath(full, sel.start)) return;
    const matchOpen = (ch) => ch === ')' ? '(' : (ch === ']' ? '[' : '{');
    const openCh = matchOpen(lastCh);
    const openPos = findMatchingOpen(before.slice(0, -1), openCh, lastCh);
    if (openPos === -1) return;
    const inner = before.slice(openPos + 1, -1);
    if (!AUTO_ENLARGE_TRIGGERS.some(t => inner.includes(t))) return;
    const alreadyLeft  = before.slice(Math.max(0, openPos - 6), openPos + 1).includes('\\left');
    const alreadyRight = after.startsWith('\\right' + lastCh);
    if (alreadyLeft || alreadyRight) return;
    const openChar  = before[openPos];
    const closeChar = lastCh;
    const enlarged = `\\left${openChar}${inner}\\right${closeChar}`;
    const globalStart = openPos;
    const globalEnd   = sel.start;
    const newCaret    = globalStart + enlarged.length;
    _latexSuiteBusy = true;
    replaceRangeInEditor(ed, sel, globalStart, globalEnd, enlarged, newCaret);
    setTimeout(() => { _latexSuiteBusy = false; }, 0);
  }, true);
  function findMatchingOpen(text, openCh, closeCh) {
    let depth = 1;
    for (let i = text.length - 1; i >= 0; i--) {
      const ch = text[i];
      if (ch === closeCh) depth++;
      else if (ch === openCh) { depth--; if (depth === 0) return i; }
    }
    return -1;
  }

})();
