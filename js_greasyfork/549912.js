// ==UserScript==
// @name         Pastebin Shiki Highlighter Codeblocks for Markdown
// @namespace    https://pastebin.com/
// @version      1.4.1
// @description  Replace Pastebin code blocks in markdown mode with Shiki syntax highlighting and copy button
// @match        https://pastebin.com/*
// @author       BourbonCrow
// @icon         https://raw.githubusercontent.com/shikijs/shiki/main/docs/public/logo.svg
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549912/Pastebin%20Shiki%20Highlighter%20Codeblocks%20for%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/549912/Pastebin%20Shiki%20Highlighter%20Codeblocks%20for%20Markdown.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Hide raw markdown code instantly — only original (non-shiki) <pre><code> blocks
  if (typeof GM_addStyle === "function") {
    GM_addStyle(`
      /* Only hide the site's original code nodes; do NOT hide pre.shiki generated content */
      .source.markdown pre:not(.shiki) > code,
      .source.markdown code[class^="language-"]:not(.shiki) {
        display: none !important;
      }
    `);
  }

  function getHeaderHeight() {
    const header = document.querySelector(".header");
    return header ? header.offsetHeight || 0 : 0;
  }

  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
      return;
    }

    // Load Devicons CSS (optional icons)
    const devicons = document.createElement("link");
    devicons.rel = "stylesheet";
    devicons.href = "https://cdn.jsdelivr.net/gh/devicons/devicon/devicon.min.css";
    document.head.appendChild(devicons);

    // Inject ESM module into the page so it runs in page context
    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      const SHOW_DEVICONS = true;
      import { codeToHtml } from 'https://esm.sh/shiki';

      // --- inline language table (display, optional aliases, optional devicon) ---
      const languages = {
        abap: { display: "ABAP" },
        actionscript: { display: "ActionScript", aliases: ["actionscript-3"] },
        ada: { display: "Ada" },
        "angular-html": { display: "Angular HTML" },
        "angular-ts": { display:"Angular TypeScript" },
        apache: { display: "Apache Conf" },
        ansi: { display: "ANSI" },
        apex: { display: "Apex" },
        apl: { display: "APL" },
        applescript: { display: "AppleScript" },
        ara: { display: "Ara" },
        asciidoc: { display: "AsciiDoc", aliases: ["adoc"] },
        asm: { display: "Assembly" },
        astro: { display: "Astro" },
        awk: { display: "AWK" },
        ballerina: { display: "Ballerina" },
        bat: { display: "Batch File", aliases: ["batch"] },
        beancount: { display: "Beancount" },
        berry: { display: "Berry", aliases: ["be"] },
        bibtex: { display: "BibTeX" },
        bicep: { display: "Bicep" },
        blade: { display: "Blade" },
        bsl: { display: "1C (Enterprise)", aliases: ["1c"] },
        c: { display: "C", devicon: "c-plain" },
        cadence: { display: "Cadence", aliases: ["cdc"] },
        cairo: { display: "Cairo" },
        clarity: { display: "Clarity" },
        clojure: { display: "Clojure", aliases: ["clj"], devicon: "clojure-line" },
        cmake: { display: "CMake" },
        cobol: { display: "COBOL" },
        codeowners: { display: "CODEOWNERS" },
        codeql: { display: "CodeQL", aliases: ["ql"] },
        coffee: { display: "CoffeeScript", aliases: ["coffeescript"], devicon: "coffeescript-original" },
        "common-lisp": { display: "Common Lisp", aliases: ["lisp"] },
        coq: { display: "Coq" },
        cpp: { display: "C++", aliases: ["c++"], devicon: "cplusplus-plain" },
        crystal: { display: "Crystal" },
        csharp: { display: "C#", aliases: ["cs","c#"], devicon: "csharp-plain" },
        css: { display: "CSS", devicon: "css3-plain" },
        csv: { display: "CSV" },
        cue: { display: "CUE" },
        cypher: { display:"Cypher", aliases: ["cql"] },
        d: { display:"D" },
        dart: { display: "Dart" },
        dax: { display: "DAX" },
        desktop: { display: "Desktop" },
        diff: { display: "Diff" },
        docker: { display: "Dockerfile", aliases: ["dockerfile"], devicon: "docker-plain" },
        dotenv: { display: "dotEnv" },
        "dream-maker": { display: "Dream Maker" },
        edge: { display:"Edge" },
        elixir: { display: "Elixir", devicon: "elixir-plain" },
        elm: { display: "Elm", devicon: "elm-plain" },
        "emacs-lisp": { display: "Emacs Lisp", aliases: ["elisp"] },
        erb: { display: "ERB" },
        erlang: { display: "Erlang", aliases: ["erl"], devicon: "erlang-plain" },
        fennel: { display: "Fennel" },
        fish: { display: "Fish" },
        fluent: { display: "Fluent", aliases: ["ftl"] },
        "fortran-fixed-form": { display: "Fortran (Fixed Form)", aliases: ["f77"] },
        "fortran-free-form": { display: "Fortran (Free Form)", aliases: ["f90","f95","f03","f08","f18"] },
        fsharp: { display: "F#", aliases: ["fs","f#"], devicon: "fsharp-plain" },
        gdresource: { display: "GDResource" },
        gdscript: { display: "GDScript" },
        gdshader: { display: "GDShader" },
        genie: { display: "Genie" },
        gherkin: { display: "Gherkin" },
        "git-commit": { display: "Git Commit Message" },
        "git-rebase": { display: "Git Rebase Message" },
        gleam: { display:"Gleam" },
        "glimmer-js": { display: "Glimmer JS", aliases: ["gjs"] },
        "glimmer-ts": { display: "Glimmer TS", aliases: ["gts"] },
        glsl: { display: "GLSL" },
        gnuplot: { display: "Gnuplot" },
        go: { display: "Go", devicon: "go-plain" },
        graphql: { display: "GraphQL", aliases: ["gql"] },
        groovy: { display: "Groovy", devicon: "groovy-plain" },
        hack: { display: "Hack" },
        haml: { display: "Ruby Haml" },
        handlebars: { display: "Handlebars", aliases: ["hbs"], devicon: "handlebars-plain" },
        haskell: { display: "Haskell", aliases: ["hs"], devicon: "haskell-plain" },
        haxe: { display: "Haxe" },
        hcl: { display: "HashiCorp HCL" },
        hjson: { display:"Hjson" },
        hlsl: { display: "HLSL" },
        html: { display: "HTML", devicon: "html5-plain" },
        "html-derivative": { display: "HTML (Derivative)" },
        http: { display: "HTTP" },
        hxml: { display: "HXML" },
        hy: { display: "Hy" },
        imba: { display: "Imba" },
        ini: { display: "INI", aliases: ["properties"] },
        java: { display: "Java", devicon: "java-plain" },
        javascript: { display: "JavaScript", aliases: ["js"], devicon: "javascript-plain" },
        jinja: { display: "Jinja" },
        jison: { display: "Jison" },
        json: { display: "JSON", devicon: "json-plain" },
        json5: { display: "JSON5" },
        jsonc: { display: "JSON with Comments" },
        jsonl: { display: "JSON Lines" },
        jsonnet: { display: "Jsonnet" },
        jssm: { display: "JSSM", aliases: ["fsl"] },
        jsx: { display: "JSX", devicon: "react-original" },
        julia: { display: "Julia", aliases: ["jl"] },
        kotlin: { display: "Kotlin", aliases: ["kt","kts"], devicon: "kotlin-plain" },
        kusto: { display: "Kusto", aliases: ["kql"] },
        latex: { display: "LaTeX", devicon: "latex-original" },
        lean: { display: "Lean 4", aliases: ["lean4"] },
        less: { display:"Less", devicon: "less-plain-wordmark" },
        liquid: { display: "Liquid" },
        llvm: { display: "LLVM IR" },
        log: { display :"Log file" },
        logo: { display: "Logo" },
        lua: { display: "Lua", devicon: "lua-plain" },
        luau: { display: "Luau" },
        make: { display: "Makefile", aliases: ["makefile"] },
        markdown: { display: "Markdown", aliases: ["md"], devicon: "markdown-original" },
        marko: { display: "Marko" },
        matlab: { display: "MATLAB", devicon: "matlab-plain" },
        mdc: { display: "MDC" },
        mdx: { display: "MDX" },
        mermaid: { display: "Mermaid", aliases: ["mmd"] },
        mipsasm: { display: "MIPS Assembly", aliases: ["mips"] },
        mojo: { display: "Mojo" },
        move: { display: "Move" },
        narrat: { display: "Narrat Language", aliases: ["nar"] },
        nextflow:{display:"Nextflow",aliases:["nf"]},
        nginx: { display: "Nginx" },
        nim: { display: "Nim" },
        nix: { display: "Nix" },
        nushell: {display: "nushell", aliases: ["nu"] },
        "objective-c": { display: "Objective-C", aliases: ["objc"], devicon: "objectivec-plain" },
        "objective-cpp": { display: "Objective-C++" },
        ocaml: { display: "OCaml", devicon: "ocaml-plain" },
        pascal: { display: "Pascal" },
        perl: { display: "Perl" },
        php: { display: "PHP", devicon: "php-plain" },
        plsql: { display: "PL/SQL" },
        po: { display: "Gettext PO", aliases: ["pot","potx"] },
        polar: { display: "Polar" },
        postcss: { display: "PostCSS" },
        powerquery: { display: "PowerQuery" },
        powershell: {display: "PowerShell", aliases:["ps","ps1"], devicon: "powershell-plain" },
        prisma: { display: "Prisma" },
        prolog: { display: "Prolog" },
        proto: { display: "Protocol Buffer 3", aliases: ["protobuf"] },
        pug: { display: "Pug", aliases:["jade"] },
        puppet: { display: "Puppet" },
        purescript: { display: "PureScript" },
        python: { display: "Python", aliases: ["py"], devicon: "python-plain" },
        qml: { display: "QML" },
        qmldir: { display: "QML Directory" },
        qss: { display: "Qt Style Sheets" },
        r: { display: "R", devicon: "r-original" },
        racket: { display: "Racket" },
        raku: { display: "Raku", aliases: ["perl6"] },
        razor: { display: "ASP.NET Razor", aliases: ["cshtml"], devicon: "dot-net-plain" },
        reg: { display: "Windows Registry Script" },
        regexp: { display: "RegExp", aliases: ["regex"] },
        rel: { display: "Rel" },
        riscv: { display: "RISC-V" },
        rst: { display: "reStructuredText" },
        ruby: { display: "Ruby", aliases: ["rb"], devicon: "ruby-plain" },
        rust: { display: "Rust", aliases: ["rs"], devicon: "rust-plain" },
        sas: { display: "SAS", devicon: "sass-original" },
        sass: { display: "Sass" },
        scala: { display: "Scala", devicon: "scala-plain" },
        scheme: { display: "Scheme" },
        scss: { display: "SCSS", devicon: "sass-original" },
        sdbl: { display: "1C (Query)", aliases: ["1c-query"] },
        shaderlab: { display: "ShaderLab", aliases: ["shader"] },
        shellscript: { display: "Shell", aliases: ["bash","sh","zsh"], devicon: "bash-plain" },
        shellsession: { display: "Shell Session", aliases: ["console"] },
        smalltalk: { display: "Smalltalk" },
        solidity: { display: "Solidity" },
        soy: { display: "Closure Templates", aliases: ["closure-templates"] },
        sparql: { display: "SPARQL" },
        splunk: { display: "Splunk Query Language", aliases: ["spl"] },
        sql: { display: "SQL", devicon: "azuresqldatabase-plain" },
        "ssh-config": { display: "SSH Config" },
        stata: { display: "Stata" },
        stylus: { display: "Stylus", aliases: ["styl"], devicon: "stylus-original" },
        svelte: { display: "Svelte" },
        swift: { display: "Swift", devicon: "swift-plain" },
        "system-verilog": { display: "SystemVerilog" },
        systemd: { display: "Systemd Units" },
        talonscript: { display: "TalonScript", aliases: ["talon"] },
        tasl: { display: "Tasl" },
        tcl: { display: "Tcl" },
        templ: { display: "Templ" },
        terraform: { display: "Terraform", aliases: ["tf","tfvars"] },
        tex: { display: "TeX" },
        toml: { display: "TOML" },
        "ts-tags": { display: "TypeScript with Tags", aliases: ["lit"], devicon: "typescript-plain" },
        tsv: { display: "TSV" },
        tsx: { display: "TSX", devicon: "react-original" },
        turtle: { display: "Turtle" },
        twig: { display: "Twig" },
        typescript: { display: "TypeScript", aliases: ["ts"], devicon: "typescript-plain" },
        typespec: {display: "TypeSpec", aliases: ["tsp"] },
        typst: { display: "Typst", aliases: ["typ"] },
        v: { display: "V" },
        vala: { display: "Vala" },
        vb: { display: "Visual Basic", aliases: ["cmd"], devicon: "dot-net-plain" },
        verilog: { display: "Verilog" },
        vhdl: { display: "VHDL" },
        viml: { display: "Vim Script", aliases: ["vim","vimscript"], devicon:"vim-plain" },
        vue: { display: "Vue", devicon: "vuejs-plain" },
        "vue-html": { display: "Vue HTML", devicon: "vuejs-plain" },
        "vue-vine": { display: "Vue Vine" },
        vyper: { display: "Vyper", aliases:["vy"] },
        wasm: { display: "WebAssembly" },
        wenyan: { display: "Wenyan", aliases:["文言"] },
        wgsl: { display: "WGSL" },
        wikitext: { display: "Wikitext", aliases: ["mediawiki","wiki"] },
        wit: { display: "WebAssembly Interface Types" },
        wolfram: { display: "Wolfram", aliases: ["wl"] },
        xml: { display: "XML" },
        xsl: { display: "XSL" },
        yaml: { display: "YAML", aliases: ["yml"] },
        zenscript: { display: "ZenScript" },
        zig: { display: "Zig" },
        plaintext: { display: "Plain Text", aliases: ["text","txt"] }
      };


      // Build alias lookup (aliases optional)
      const aliasMap = {};
      for (const [id, data] of Object.entries(languages)) {
        if (Array.isArray(data.aliases)) {
          for (const alias of data.aliases) {
            aliasMap[alias.toLowerCase()] = id;
          }
        }
      }

      function resolveLang(lang) {
        if (!lang) return { name: "Plain Text", devicon: null };
        const key = lang.toLowerCase();
        const canonicalId = languages[key] ? key : (aliasMap[key] || "plaintext");
        const data = languages[canonicalId] || { display: "Plain Text" };
        return { name: data.display, devicon: data.devicon || null };
      }

      async function highlight() {
        const markdownSource = document.querySelector(".source.markdown");
        if (!markdownSource) return;

        // Grab all pre > code blocks (with or without language class)
        const codeBlocks = markdownSource.querySelectorAll("pre > code");
        for (const block of codeBlocks) {
          try {
            const rawCode = block.textContent;
            // detect language from class, fallback to plaintext
            const match = block.className.match(/language-([^\\s]+)/);
            const lang = match ? match[1] : "plaintext";
            const { name, devicon } = resolveLang(lang);

            // Render with shiki
            const html = await codeToHtml(rawCode, {
              lang,
              theme: "github-dark"
            });

            // Wrap and replace
            const wrapper = document.createElement("div");
            wrapper.className = "shiki-wrapper";
            wrapper.innerHTML = \`
              <div class="shiki-header">
                \${SHOW_DEVICONS && devicon ? \`<i class="devicon-\${devicon}"></i>\` : ""}
                <span class="shiki-lang">\${name}</span>
                <button class="shiki-copy">
                  <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M12.668 10.667c0-.71 0-1.204-.031-1.588a2.422 2.422 0 0 0-.113-.615l-.055-.13a1.838 1.838 0 0 0-.676-.731l-.127-.072c-.158-.08-.37-.137-.745-.168-.384-.031-.877-.031-1.588-.031H6.5c-.711 0-1.204 0-1.588.031a2.42 2.42 0 0 0-.615.113l-.13.055a1.837 1.837 0 0 0-.731.676l-.07.127c-.081.158-.138.37-.169.745-.031.384-.032.877-.032 1.588V13.5c0 .711 0 1.204.032 1.588.031.376.088.587.168.745l.07.126c.177.288.43.522.732.676l.13.056c.144.052.333.089.615.112.384.031.877.032 1.588.032h2.833c.71 0 1.204 0 1.588-.032.376-.031.587-.088.745-.168l.127-.07c.287-.177.522-.43.676-.732l.055-.13c.052-.144.09-.333.113-.615.031-.384.031-.877.031-1.588v-2.833Zm1.33 1.998c.455-.002.803-.005 1.09-.028.376-.031.587-.088.745-.168l.126-.071c.288-.177.522-.43.676-.732l.056-.13a2.43 2.43 0 0 0 .112-.615c.031-.384.032-.877.032-1.588V6.5c0-.711 0-1.204-.032-1.588a2.43 2.43 0 0 0-.112-.615l-.056-.13a1.836 1.836 0 0 0-.676-.731l-.126-.07c-.158-.081-.37-.138-.745-.169-.384-.031-.877-.032-1.588-.032h-2.833c-.71 0-1.204.001-1.588.032-.282.023-.471.06-.615.112l-.13.056a1.835 1.835 0 0 0-.731.676l-.072.126c-.08.158-.137.37-.168.745-.023.287-.027.635-.029 1.09h1.999c.689 0 1.246 0 1.696.036.458.038.865.117 1.242.309l.217.122c.496.304.9.74 1.165 1.26l.067.143c.144.337.21.698.242 1.099.037.45.036 1.007.036 1.696v1.998Zm4.167-3.332c0 .689 0 1.246-.036 1.696-.033.401-.098.762-.242 1.099l-.067.143c-.265.52-.67.956-1.165 1.26l-.219.122c-.376.192-.782.271-1.24.309-.337.027-.734.031-1.2.033-.003.467-.007.864-.034 1.201-.033.401-.098.762-.242 1.098l-.067.142c-.265.522-.669.958-1.165 1.262l-.217.122c-.377.192-.784.271-1.242.309-.45.037-1.007.036-1.696.036H6.5c-.69 0-1.246 0-1.696-.036-.4-.033-.762-.098-1.098-.242l-.143-.067a3.167 3.167 0 0 1-1.261-1.165l-.122-.219c-.192-.376-.271-.782-.309-1.24-.037-.45-.036-1.007-.036-1.696v-2.833c0-.689 0-1.246.036-1.696.038-.458.117-.865.309-1.242l.122-.217c.304-.496.74-.9 1.261-1.165l.143-.067c.336-.144.697-.21 1.098-.242.337-.027.733-.032 1.2-.034.002-.467.007-.863.034-1.2.037-.458.117-.864.309-1.24l.122-.22c.304-.495.74-.899 1.26-1.164l.143-.067c.337-.144.698-.21 1.099-.242.45-.037 1.007-.036 1.696-.036H13.5c.69 0 1.246 0 1.696.036.458.038.864.117 1.24.309l.22.122c.495.304.899.74 1.164 1.261l.067.143c.144.336.21.697.242 1.098.037.45.036 1.007.036 1.696v2.833Z"/></svg>
                  Copy code
                </button>
              </div>
              \${html}
            \`;

            const pre = block.closest("pre") || block.parentElement;
            pre.replaceWith(wrapper);

            // Floating copy button logic
            const copyBtn = wrapper.querySelector(".shiki-copy");

            function updatePosition() {
              const headerHeight = (${getHeaderHeight.toString()})();
              const wrapperRect = wrapper.getBoundingClientRect();
              const btnHeight = copyBtn.offsetHeight;
              const margin = 7;

              const shouldFloat = wrapperRect.top < headerHeight + margin &&
                                  wrapperRect.bottom > headerHeight + btnHeight + margin;

              if (shouldFloat) {
                if (!copyBtn.classList.contains("floating")) {
                  copyBtn.classList.add("floating");
                  copyBtn.style.position = "fixed";
                  copyBtn.style.zIndex = "999";
                }
                const targetTop = Math.min(
                  Math.max(headerHeight + margin, wrapperRect.top + margin),
                  wrapperRect.bottom - btnHeight - margin
                );
                const targetRight = window.innerWidth - wrapperRect.right + 8;
                copyBtn.style.top = targetTop + "px";
                copyBtn.style.right = targetRight + "px";
                copyBtn.style.left = "auto";
              } else {
                if (copyBtn.classList.contains("floating")) {
                  copyBtn.classList.remove("floating");
                  copyBtn.style.position = "absolute";
                  copyBtn.style.zIndex = "1";
                }
                copyBtn.style.top = margin + "px";
                copyBtn.style.right = "8px";
                copyBtn.style.left = "auto";
              }
            }

            // Throttle with rAF
            let ticking = false;
            const requestTick = () => {
              if (!ticking) {
                requestAnimationFrame(() => {
                  updatePosition();
                  ticking = false;
                });
                ticking = true;
              }
            };

            window.addEventListener("scroll", requestTick, { passive: true });
            window.addEventListener("resize", requestTick, { passive: true });
            // initial
            setTimeout(updatePosition, 100);
          } catch (err) {
            console.warn("Highlight failed:", err);
          }
        }
      }

      // Start highlighting
      highlight();

      // Copy button handler (module scope)
      document.addEventListener("click", (e) => {
        const btn = e.target.closest && e.target.closest(".shiki-copy");
        if (!btn || btn.disabled) return;

        const code = btn.closest(".shiki-wrapper").querySelector("code").innerText;
        btn.disabled = true; // Disable button during cooldown

        navigator.clipboard.writeText(code).then(() => {
          const copyIcon = btn.querySelector(".copy-icon");
          const checkIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          checkIcon.setAttribute("class", "check-icon");
          checkIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          checkIcon.setAttribute("width", "16");
          checkIcon.setAttribute("height", "16");
          checkIcon.setAttribute("viewBox", "0 0 20 20");
          checkIcon.setAttribute("stroke", "currentColor");
          checkIcon.setAttribute("stroke-width", "1.5");
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", "M15.483 4.146a.626.626 0 1 1 1.034.708l-7.548 11a.628.628 0 0 1-.964.086l-4.451-4.518.446-.44.446-.44 3.918 3.976 7.12-10.372ZM3.56 10.536a.627.627 0 0 1 .886.006l-.892.88a.627.627 0 0 1 .006-.887Z");
          checkIcon.appendChild(path);

          const prevText = btn.textContent;
          btn.innerHTML = "";
          btn.appendChild(checkIcon);
          btn.append(" Copied");

          setTimeout(() => {
            btn.innerHTML = "";
            btn.appendChild(copyIcon.cloneNode(true));
            btn.append(" Copy code");
            btn.disabled = false; // Re-enable button after cooldown
          }, 1500);
        }).catch(() => {
          // fallback: still try to show UI
          btn.textContent = "Copied";
          setTimeout(() => {
            btn.innerHTML = "";
            btn.appendChild(copyIcon.cloneNode(true));
            btn.append(" Copy code");
            btn.disabled = false; // Re-enable button after cooldown
          }, 1500);
        });
      });
    `;
    document.head.appendChild(script);

    // Styles for wrapper and header (generated content)
    GM_addStyle(`
      .shiki-wrapper {
        margin: 1em 0;
        border: 1px solid #171717;
        border-radius: 8px;
        overflow: hidden;
        background: #171717;
        position: relative;
      }
      .shiki-header {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #171717;
        color: #ccc;
        font-size: 12px;
        font-family: sans-serif;
        padding: 0.3em 1.5em;
        position: relative;
      }
      .shiki-header .shiki-lang {
        user-select: none;
        font-weight: bold;
        color: #bbb;
        flex: 1;
      }
      .shiki-header i[class^="devicon-"] {
        font-size: 16px;
        margin-right: 2px;
        color: #bbb;
      }
      .shiki-header .shiki-copy {
        background: #171717;
        border-radius: 3px;
        border: none;
        color: #bbb;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
        padding: 1px 10px;
        position: absolute;
        top: 7px;
        right: 8px;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .shiki-header .shiki-copy:hover {
        color: white;
      }
      .shiki-header .shiki-copy:hover svg {
        stroke: currentColor;
      }
      .shiki-header .shiki-copy svg {
        margin-top: -3px;
        stroke: #bbb;
      }
      pre.shiki {
        margin: 0;
        padding: 1em;
        overflow-x: auto;
        font-size: 14px;
        line-height: 1.5;
        border: 1px solid #171717;
        background: none !important;
      }
      pre.shiki code {
        background: none !important;
      }
    `);
  }

  init();
})();
