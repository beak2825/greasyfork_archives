// ==UserScript==
// @name               Starter Monkey
// @name:en            Starter Monkey
// @name:zh-CN         Starter Monkey
// @namespace          yuns
// @version            0.1.0
// @description        Starter template for userscript engine like Tampermonkey and Violentmonkey, Greasemonkey, ScriptCat, powered by vite-plugin-monkey.
// @description:en     Starter template for userscript engine like Tampermonkey and Violentmonkey, Greasemonkey, ScriptCat, powered by vite-plugin-monkey.
// @description:zh-CN  适用于 Tampermonkey、Violentmonkey、Greasemonkey、ScriptCat 等 userscript 引擎的起始模板，由 vite-plugin-monkey 强力驱动。
// @license            MIT
// @icon               https://vitejs.dev/logo.svg
// @match              https://www.google.com/
// @match              https://www.v2ex.com/
// @require            https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
// @require            https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
// @require            https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/system.min.js
// @require            https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/extras/named-register.min.js
// @require            data:application/javascript,%3B(typeof%20System!%3D'undefined')%26%26(System%3Dnew%20System.constructor())%3B
// @grant              GM_addStyle
// @grant              unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/554420/Starter%20Monkey.user.js
// @updateURL https://update.greasyfork.org/scripts/554420/Starter%20Monkey.meta.js
// ==/UserScript==

System.addImportMap({ imports: {"react":"user:react","react-dom":"user:react-dom"} });
System.set("user:react", (()=>{const _=React;('default' in _)||(_.default=_);return _})());
System.set("user:react-dom", (()=>{const _=ReactDOM;('default' in _)||(_.default=_);return _})());

System.register("./__entry.js", ['./__monkey.entry-CICLkIwt.js'], (function (exports, module) {
	'use strict';
	return {
		setters: [null],
		execute: (function () {



		})
	};
}));

System.register("./__monkey.entry-CICLkIwt.js", [], (function (exports, module) {
  'use strict';
  return {
    execute: (function () {

      function print(method, ...args) {
        {
          return;
        }
      }
      const logger = exports("l", {
        debug: (...args) => print(console.debug, ...args),
        log: (...args) => print(console.log, ...args),
        warn: (...args) => print(console.warn, ...args),
        error: (...args) => print(console.error, ...args)
      });
      const scriptRel = /* @__PURE__ */ (function detectScriptRel() {
        const relList = typeof document !== "undefined" && document.createElement("link").relList;
        return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
      })();
      const assetsURL = function(dep) {
        return "/" + dep;
      };
      const seen = {};
      const __vitePreload = exports("_", function preload(baseModule, deps, importerUrl) {
        let promise = Promise.resolve();
        if (deps && deps.length > 0) {
          let allSettled = function(promises$2) {
            return Promise.all(promises$2.map((p) => Promise.resolve(p).then((value$1) => ({
              status: "fulfilled",
              value: value$1
            }), (reason) => ({
              status: "rejected",
              reason
            }))));
          };
          document.getElementsByTagName("link");
          const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
          const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
          promise = allSettled(deps.map((dep) => {
            dep = assetsURL(dep);
            if (dep in seen) return;
            seen[dep] = true;
            const isCss = dep.endsWith(".css");
            const cssSelector = isCss ? '[rel="stylesheet"]' : "";
            if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
            const link = document.createElement("link");
            link.rel = isCss ? "stylesheet" : scriptRel;
            if (!isCss) link.as = "script";
            link.crossOrigin = "";
            link.href = dep;
            if (cspNonce) link.setAttribute("nonce", cspNonce);
            document.head.appendChild(link);
            if (isCss) return new Promise((res, rej) => {
              link.addEventListener("load", res);
              link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
            });
          }));
        }
        function handlePreloadError(err$2) {
          const e$1 = new Event("vite:preloadError", { cancelable: true });
          e$1.payload = err$2;
          window.dispatchEvent(e$1);
          if (!e$1.defaultPrevented) throw err$2;
        }
        return promise.then((res) => {
          for (const item of res || []) {
            if (item.status !== "rejected") continue;
            handlePreloadError(item.reason);
          }
          return baseModule().catch(handlePreloadError);
        });
      });
      var dist$1 = {};
      var matchPattern = {};
      var config = {};
      var hasRequiredConfig;
      function requireConfig() {
        if (hasRequiredConfig) return config;
        hasRequiredConfig = 1;
        Object.defineProperty(config, "__esModule", {
          value: true
        });
        config.presets = config.defaultOptions = void 0;
        const presets = {
          chrome: {
            supportedSchemes: [
              "http",
              "https",
              "file",
              "ftp"
              // 'urn',
            ],
            schemeStarMatchesWs: false
          },
          firefox: {
            supportedSchemes: [
              "http",
              "https",
              "ws",
              "wss",
              "ftp",
              "file"
              // 'ftps',
              // 'data',
            ],
            schemeStarMatchesWs: true
          }
        };
        config.presets = presets;
        const defaultOptions = Object.assign(Object.assign({}, presets.chrome), {
          strict: true
        });
        config.defaultOptions = defaultOptions;
        return config;
      }
      var getExampleUrls = {};
      var getDummyUrl = {};
      var dist = {};
      var regex = {};
      var escaping = {};
      var hasRequiredEscaping;
      function requireEscaping() {
        if (hasRequiredEscaping) return escaping;
        hasRequiredEscaping = 1;
        Object.defineProperty(escaping, "__esModule", {
          value: true
        });
        escaping.regexEscape = regexEscape;
        escaping.exact = exact;
        escaping.regexLength = regexLength;
        escaping.getContextAgnosticMap = void 0;
        var _regex = requireRegex();
        const asciis = Array.from({
          length: 128
        }, (_, i) => String.fromCodePoint(i));
        const getChars = (flags) => {
          const flagSet = new Set(flags);
          flagSet.delete("i");
          flags = [...flagSet].join("");
          return asciis.map((ch) => {
            const escaped = `\\x${ch.codePointAt(0).toString(16).padStart(2, "0")}`;
            let inClass = escaped;
            let outsideClass = escaped;
            let agnostic = escaped;
            try {
              const inClassRe = new RegExp(`[${ch}]`, flags);
              new RegExp(`[${ch}${ch}]`, flags);
              new RegExp(`[${ch}${ch}\0]`, flags);
              if (inClassRe.test(ch) && !asciis.filter((x) => x !== ch).some((x) => inClassRe.test(x))) {
                inClass = ch;
              } else {
                new RegExp(`[\\${ch}]`, flags);
                inClass = `\\${ch}`;
              }
            } catch (_a) {
              try {
                new RegExp(`[\\${ch}]`, flags);
                inClass = `\\${ch}`;
              } catch (_b) {
              }
            }
            try {
              const outsideClassRe = new RegExp(`^${ch}$`, flags);
              if (outsideClassRe.test(ch) && !asciis.filter((x) => x !== ch).some((x) => outsideClassRe.test(x))) {
                outsideClass = ch;
              } else {
                new RegExp(`\\${ch}`, flags);
                outsideClass = `\\${ch}`;
              }
            } catch (_c) {
              try {
                new RegExp(`\\${ch}`, flags);
                outsideClass = `\\${ch}`;
              } catch (_d) {
              }
            }
            if (inClass !== outsideClass) {
              try {
                new RegExp(`\\${ch}`, flags);
                new RegExp(`\\${ch}`, flags);
                agnostic = `\\${ch}`;
              } catch (_e) {
              }
            } else {
              agnostic = [inClass, outsideClass].sort((a, b) => b.length - a.length)[0];
            }
            return {
              ch,
              agnostic,
              inClass,
              outsideClass
            };
          }).filter((x) => x.inClass !== x.ch || x.outsideClass !== x.ch);
        };
        const cache = /* @__PURE__ */ new Map();
        const getContextAgnosticMap = (flags) => {
          const cached = cache.get(flags);
          if (cached) {
            return cached;
          }
          const obj = Object.fromEntries(getChars(flags).map((x) => [x.ch, x.agnostic]));
          cache.set(flags, obj);
          return obj;
        };
        escaping.getContextAgnosticMap = getContextAgnosticMap;
        function regexEscape(input, flags = "u") {
          const contextAgnosticMap = getContextAgnosticMap(flags);
          const chars = Object.values(contextAgnosticMap);
          const replacer = (str) => str.replace(new RegExp(`[${chars.join("")}]`, [.../* @__PURE__ */ new Set([...flags, ..."g"])].join("")), (m) => contextAgnosticMap[m]);
          return new _regex.RegexFragment(replacer(input));
        }
        function exact(input, flags) {
          return (0, _regex.regex)(flags)`${input}`;
        }
        function regexLength(input) {
          return (
            // TODO?
            // .replace(/\[[^\]]+\]/g, '.')
            input.replace(/\\(?:\w\{[^}]+\}|u[0-9a-f]{4}|x[0-9a-f]{2}|[0-8]{3}|c[A-Z]|.)/gi, ".").length
          );
        }
        return escaping;
      }
      var hasRequiredRegex;
      function requireRegex() {
        if (hasRequiredRegex) return regex;
        hasRequiredRegex = 1;
        Object.defineProperty(regex, "__esModule", {
          value: true
        });
        regex.regex = regex$1;
        regex.LazyAlternation = regex.RegexFragment = void 0;
        var _escaping = requireEscaping();
        class RegexFragment extends String {
        }
        regex.RegexFragment = RegexFragment;
        class LazyAlternation extends Array {
          constructor(...args) {
            super(...Array.isArray(args[0]) ? args[0] : args);
          }
        }
        regex.LazyAlternation = LazyAlternation;
        const flagMap = {
          global: "g",
          ignoreCase: "i",
          multiline: "m",
          dotAll: "s",
          sticky: "y",
          unicode: "u"
        };
        const commentRegex = /(\\*)#(.*)/g;
        const isContentful = (x) => x !== false && x != null;
        const commentReplacer = (_m, slashes, after) => {
          if (slashes.length % 2) {
            return slashes.slice(1) + "#" + after.replace(commentRegex, commentReplacer);
          }
          return slashes;
        };
        const processSub = (flags) => (sub) => {
          if (sub instanceof RegExp) {
            if (sub.flags === flags) {
              return sub.source;
            } else {
              const mapIn = (0, _escaping.getContextAgnosticMap)(sub.flags);
              const mapOut = (0, _escaping.getContextAgnosticMap)(flags);
              const diff = [];
              for (const ch of Object.keys(mapIn)) {
                if (mapIn[ch] !== mapOut[ch]) {
                  diff.push(mapIn[ch]);
                }
              }
              for (const ch of Object.keys(mapOut)) {
                if (mapIn[ch] !== mapOut[ch]) {
                  diff.push(ch);
                }
              }
              const re = new RegExp(`(?:${diff.map((x) => (0, _escaping.regexEscape)(x, "i")).join("|")})`, "gi");
              return !diff.length ? sub.source : sub.source.replace(re, (m) => {
                var _a;
                return (_a = mapOut[m.startsWith("\\") ? m.slice(1) : m]) !== null && _a !== void 0 ? _a : m;
              });
            }
          } else if (typeof sub === "string") {
            return (0, _escaping.regexEscape)(sub, flags);
          } else {
            return String(isContentful(sub) ? sub : "");
          }
        };
        const _regex = (options = {}) => (template, ...substitutions) => {
          let source = "";
          let flagArr = [];
          if (typeof options === "string") {
            flagArr = [...options];
          } else {
            Object.entries(flagMap).forEach(([k, v]) => {
              if (options[k]) {
                flagArr.push(v);
              }
            });
          }
          const flags = flagArr.sort((a, b) => a.localeCompare(b)).join("");
          template.raw.forEach((segment, idx) => {
            source += segment.replace(commentRegex, commentReplacer).replace(/\\`/g, "`").replace(/(\\*)(\s+)/g, (_m, slashes, space) => {
              if (space[0] === " " && slashes.length % 2) {
                return slashes.slice(1) + space[0];
              }
              return slashes;
            });
            const sub = substitutions[idx];
            if (Array.isArray(sub)) {
              const mult = sub instanceof LazyAlternation ? -1 : 1;
              source += `(?:${[.../* @__PURE__ */ new Set([...sub.filter(isContentful).map((x) => String(processSub(flags)(x)))])].sort((a, b) => mult * ((0, _escaping.regexLength)(b) - (0, _escaping.regexLength)(a))).join("|")})`;
            } else {
              source += processSub(flags)(sub);
            }
          });
          return new RegExp(source, flags);
        };
        function regex$1(...args) {
          if (Array.isArray(args[0])) {
            const [template, ...substitutions] = args;
            return _regex("")(template, ...substitutions);
          } else {
            const [flags] = args;
            return _regex(flags);
          }
        }
        return regex;
      }
      var unwrap = {};
      var hasRequiredUnwrap;
      function requireUnwrap() {
        if (hasRequiredUnwrap) return unwrap;
        hasRequiredUnwrap = 1;
        Object.defineProperty(unwrap, "__esModule", {
          value: true
        });
        unwrap.unwrap = unwrap$1;
        var _regex = requireRegex();
        function unwrap$1(re, flags) {
          const fragment = re.source.replace(/^\^?([\s\S]*?)\$?$/, "$1");
          return (0, _regex.regex)(flags !== null && flags !== void 0 ? flags : re.flags)`${new _regex.RegexFragment(fragment)}`;
        }
        return unwrap;
      }
      var proxy = {};
      var hasRequiredProxy;
      function requireProxy() {
        if (hasRequiredProxy) return proxy;
        hasRequiredProxy = 1;
        Object.defineProperty(proxy, "__esModule", {
          value: true
        });
        proxy.proxy = void 0;
        var _regex = requireRegex();
        const proxy$1 = new Proxy(_regex.regex, {
          get(target, flags) {
            return target(flags === "_" ? "" : flags);
          },
          apply(target, _thisArg, args) {
            return target(...args);
          }
        });
        proxy.proxy = proxy$1;
        return proxy;
      }
      var hasRequiredDist$1;
      function requireDist$1() {
        if (hasRequiredDist$1) return dist;
        hasRequiredDist$1 = 1;
        (function(exports) {
          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          Object.defineProperty(exports, "regex", {
            enumerable: true,
            get: function() {
              return _regex.regex;
            }
          });
          Object.defineProperty(exports, "RegexFragment", {
            enumerable: true,
            get: function() {
              return _regex.RegexFragment;
            }
          });
          Object.defineProperty(exports, "LazyAlternation", {
            enumerable: true,
            get: function() {
              return _regex.LazyAlternation;
            }
          });
          Object.defineProperty(exports, "exact", {
            enumerable: true,
            get: function() {
              return _escaping.exact;
            }
          });
          Object.defineProperty(exports, "regexEscape", {
            enumerable: true,
            get: function() {
              return _escaping.regexEscape;
            }
          });
          Object.defineProperty(exports, "unwrap", {
            enumerable: true,
            get: function() {
              return _unwrap.unwrap;
            }
          });
          Object.defineProperty(exports, "proxy", {
            enumerable: true,
            get: function() {
              return _proxy.proxy;
            }
          });
          var _regex = requireRegex();
          var _escaping = requireEscaping();
          var _unwrap = requireUnwrap();
          var _proxy = requireProxy();
        })(dist);
        return dist;
      }
      var hasRequiredGetDummyUrl;
      function requireGetDummyUrl() {
        if (hasRequiredGetDummyUrl) return getDummyUrl;
        hasRequiredGetDummyUrl = 1;
        Object.defineProperty(getDummyUrl, "__esModule", {
          value: true
        });
        getDummyUrl.getDummyUrl = getDummyUrl$1;
        var _fancyRegex = requireDist$1();
        const DELIMS = /^|$|[/?=&\-]/;
        function getDummyUrl$1(patternSegments, replacements = {}) {
          const {
            rawHost,
            rawPathAndQuery
          } = patternSegments;
          const {
            defaultScheme = "https",
            subdomain = "",
            pathAndQueryReplacer = "",
            rootDomain = "example.com",
            strict = true
          } = replacements;
          let host;
          const scheme = patternSegments.scheme === "*" ? defaultScheme : patternSegments.scheme;
          if (scheme === "file") {
            host = "";
          } else if (rawHost === "*") {
            host = [subdomain, rootDomain].filter(Boolean).join(".");
          } else {
            host = rawHost.replace(/^\*./, subdomain ? `${subdomain}.` : "");
          }
          const pathAndQuery = (strict ? rawPathAndQuery : "/*").replace(/\*/g, `-${pathAndQueryReplacer}-`).replace((0, _fancyRegex.regex)("g")`-+(${DELIMS})`, "$1").replace((0, _fancyRegex.regex)("g")`(${DELIMS})-+`, "$1").replace(/\/+/g, "/");
          try {
            return new URL(`${scheme}://${host}${pathAndQuery}`);
          } catch (_e) {
            return null;
          }
        }
        return getDummyUrl;
      }
      var getPatternSegments = {};
      var constants = {};
      var hasRequiredConstants;
      function requireConstants() {
        if (hasRequiredConstants) return constants;
        hasRequiredConstants = 1;
        Object.defineProperty(constants, "__esModule", {
          value: true
        });
        constants.ALL_URLS = void 0;
        const ALL_URLS = "<all_urls>";
        constants.ALL_URLS = ALL_URLS;
        return constants;
      }
      var hasRequiredGetPatternSegments;
      function requireGetPatternSegments() {
        if (hasRequiredGetPatternSegments) return getPatternSegments;
        hasRequiredGetPatternSegments = 1;
        Object.defineProperty(getPatternSegments, "__esModule", {
          value: true
        });
        getPatternSegments.getPatternSegments = getPatternSegments$1;
        var _fancyRegex = requireDist$1();
        var _constants = requireConstants();
        const patternRegex = (0, _fancyRegex.regex)()`
	^
		(\*|\w+)      # scheme
		://
		(
			\*     |  # Any host
			[^/\#]*     # Only the given host (optional only if scheme is file)
		)
		(/[^\r\n\#]*) # path
	$
`;
        function getPatternSegments$1(pattern) {
          if (pattern === _constants.ALL_URLS) {
            return {
              pattern,
              scheme: "*",
              rawHost: "*",
              rawPathAndQuery: "/*"
            };
          }
          const m = pattern.match(patternRegex);
          if (!m) return null;
          const [
            ,
            /* fullMatch */
            scheme,
            rawHost,
            rawPathAndQuery
          ] = m;
          return {
            pattern,
            scheme,
            rawHost,
            rawPathAndQuery
          };
        }
        return getPatternSegments;
      }
      var hasRequiredGetExampleUrls;
      function requireGetExampleUrls() {
        if (hasRequiredGetExampleUrls) return getExampleUrls;
        hasRequiredGetExampleUrls = 1;
        Object.defineProperty(getExampleUrls, "__esModule", {
          value: true
        });
        getExampleUrls.getExampleUrls = getExampleUrls$1;
        var _getDummyUrl = requireGetDummyUrl();
        var _getPatternSegments = requireGetPatternSegments();
        function getExampleUrls$1(pattern, options) {
          const patternSegments = (0, _getPatternSegments.getPatternSegments)(pattern);
          const {
            supportedSchemes,
            strict
          } = options;
          const subdomains = ["", "www", "foo.bar"];
          const rootDomains = ["example.com"];
          const pathAndQueryReplacers = ["", "foo", "/bar/baz/"];
          const all = supportedSchemes.flatMap((defaultScheme) => subdomains.flatMap((subdomain) => rootDomains.flatMap((rootDomain) => pathAndQueryReplacers.flatMap((pathAndQueryReplacer) => (0, _getDummyUrl.getDummyUrl)(patternSegments, {
            defaultScheme,
            subdomain,
            rootDomain,
            pathAndQueryReplacer,
            strict
          })))));
          return [...new Set(all.filter(Boolean).map((url) => url.href))];
        }
        return getExampleUrls;
      }
      var toMatcherOrError = {};
      var getHostRegex = {};
      var hasRequiredGetHostRegex;
      function requireGetHostRegex() {
        if (hasRequiredGetHostRegex) return getHostRegex;
        hasRequiredGetHostRegex = 1;
        Object.defineProperty(getHostRegex, "__esModule", {
          value: true
        });
        getHostRegex.getHostRegex = getHostRegex$1;
        var _fancyRegex = requireDist$1();
        var _getDummyUrl = requireGetDummyUrl();
        function getHostRegex$1(patternSegments) {
          const {
            pattern,
            scheme,
            rawHost
          } = patternSegments;
          if (!rawHost && scheme !== "file") {
            return new TypeError('Host is optional only if the scheme is "file".');
          }
          const isStarHost = rawHost.includes("*");
          if (isStarHost) {
            const segments = rawHost.split("*.");
            if (rawHost.length > 1 && (segments.length !== 2 || segments[0] || !segments[1])) {
              return new TypeError('Host can contain only one wildcard at the start, in the form "*.<host segments>"');
            }
          }
          const dummyUrl = (0, _getDummyUrl.getDummyUrl)(patternSegments, {
            subdomain: ""
          });
          if (!dummyUrl) {
            return new TypeError(`Pattern "${pattern}" cannot be used to construct a valid URL.`);
          }
          const dummyHost = dummyUrl.host;
          if (/:\d+$/.test(dummyHost)) {
            return new TypeError(`Host "${rawHost}" cannot include a port number. All ports are matched by default.`);
          }
          if (/[^.a-z0-9\-]/.test(dummyHost)) {
            return new TypeError(`Host "${rawHost}" contains invalid characters.`);
          }
          const host = isStarHost ? "*." + dummyHost : dummyHost;
          if (rawHost === "*") {
            return /.+/;
          } else if (host.startsWith("*.")) {
            return (0, _fancyRegex.regex)()`
			^
				(?:[^.]+\.)*     # any number of dot-terminated segments
				${host.slice(2)}   # rest after leading *.
			$
		`;
          } else {
            return (0, _fancyRegex.regex)()`^${host}$`;
          }
        }
        return getHostRegex;
      }
      var utils = {};
      var hasRequiredUtils;
      function requireUtils() {
        if (hasRequiredUtils) return utils;
        hasRequiredUtils = 1;
        Object.defineProperty(utils, "__esModule", {
          value: true
        });
        utils.createMatchFn = createMatchFn;
        utils.normalizeUrlFragment = void 0;
        const normalizeUrlFragment = (urlFragent) => {
          try {
            return encodeURI(decodeURI(urlFragent));
          } catch (e) {
            return e;
          }
        };
        utils.normalizeUrlFragment = normalizeUrlFragment;
        function createMatchFn(fn) {
          return (url) => {
            let normalizedUrl;
            try {
              const urlStr = url instanceof URL ? url.href : url;
              normalizedUrl = new URL(urlStr);
              const normalizedPathname = normalizeUrlFragment(normalizedUrl.pathname);
              const normalizedSearch = normalizeUrlFragment(normalizedUrl.search);
              if (normalizedPathname instanceof Error || normalizedSearch instanceof Error) {
                return false;
              }
              normalizedUrl.pathname = normalizedPathname;
              if (!normalizedUrl.href.endsWith("?")) {
                normalizedUrl.search = normalizedSearch;
              }
            } catch (_e) {
              return false;
            }
            return fn(normalizedUrl);
          };
        }
        return utils;
      }
      var hasRequiredToMatcherOrError;
      function requireToMatcherOrError() {
        if (hasRequiredToMatcherOrError) return toMatcherOrError;
        hasRequiredToMatcherOrError = 1;
        Object.defineProperty(toMatcherOrError, "__esModule", {
          value: true
        });
        toMatcherOrError.toMatchFnOrError = toMatchFnOrError;
        var _fancyRegex = requireDist$1();
        var _constants = requireConstants();
        var _getHostRegex = requireGetHostRegex();
        var _getPatternSegments = requireGetPatternSegments();
        var _utils = requireUtils();
        function toMatchFnOrError(pattern, options) {
          var _a;
          const {
            supportedSchemes,
            schemeStarMatchesWs,
            strict
          } = options;
          if (pattern === _constants.ALL_URLS) {
            return (0, _utils.createMatchFn)((url) => {
              return (0, _fancyRegex.regex)()`
				^
					(?:${supportedSchemes})
					:
				$
			`.test(url.protocol);
            });
          }
          const unsupportedScheme = (_a = pattern.match(/^(urn|data):/)) === null || _a === void 0 ? void 0 : _a[1];
          if (unsupportedScheme) {
            return new TypeError(`browser-extension-url-match does not currently support scheme "${unsupportedScheme}"`);
          }
          const patternSegments = (0, _getPatternSegments.getPatternSegments)(pattern);
          if (!patternSegments) {
            try {
              const url = new URL(pattern);
              if (url.hash || url.href.endsWith("#")) {
                return new TypeError(`Pattern cannot contain a hash: "${pattern}" contains hash "${url.hash || "#"}"`);
              }
              if (!pattern.slice(url.origin.length).startsWith("/")) {
                return new TypeError(`Pattern "${pattern}" does not contain a path. Use "${pattern}/*" to match any paths with that origin or "${pattern}/" to match that URL alone`);
              }
            } catch (_b) {
            }
            return new TypeError(`Pattern "${pattern}" is invalid`);
          }
          const {
            scheme,
            rawPathAndQuery
          } = patternSegments;
          if (scheme !== "*" && !supportedSchemes.includes(scheme)) {
            return new TypeError(`Scheme "${scheme}" is not supported`);
          }
          const schemeRegex = (0, _fancyRegex.regex)()`${scheme === "*" ? new _fancyRegex.RegexFragment(["https?", schemeStarMatchesWs && "wss?"].filter(Boolean).join("|")) : scheme}:`;
          const hostRegex = (0, _getHostRegex.getHostRegex)(patternSegments);
          if (hostRegex instanceof Error) {
            return hostRegex;
          }
          const pathAndQuery = strict ? (0, _utils.normalizeUrlFragment)(rawPathAndQuery) : "/*";
          if (pathAndQuery instanceof Error) {
            return pathAndQuery;
          }
          const pathAndQueryRegex = (0, _fancyRegex.regex)()`^${new _fancyRegex.RegexFragment(pathAndQuery.split("*").map((x) => (0, _fancyRegex.regexEscape)(x)).join(".*"))}$`;
          return (0, _utils.createMatchFn)((url) => {
            const pathAndQuery2 = url.pathname + (url.href.endsWith("?") ? "?" : url.search);
            return schemeRegex.test(url.protocol) && // test against `url.hostname`, not `url.host`, as port is ignored
            hostRegex.test(url.hostname) && pathAndQueryRegex.test(pathAndQuery2);
          });
        }
        return toMatcherOrError;
      }
      var hasRequiredMatchPattern;
      function requireMatchPattern() {
        if (hasRequiredMatchPattern) return matchPattern;
        hasRequiredMatchPattern = 1;
        Object.defineProperty(matchPattern, "__esModule", {
          value: true
        });
        matchPattern.matchPattern = matchPattern$1;
        var _config = requireConfig();
        var _getExampleUrls = requireGetExampleUrls();
        var _toMatcherOrError = requireToMatcherOrError();
        function assertValid() {
          if (!this.valid) {
            throw new TypeError(this.error.message);
          }
          return this;
        }
        function _matchPattern(options) {
          return (pattern) => {
            const combinedOptions = Object.assign(Object.assign({}, _config.defaultOptions), options);
            const val = (0, _toMatcherOrError.toMatchFnOrError)(pattern, combinedOptions);
            return val instanceof Error ? {
              valid: false,
              error: val,
              assertValid
            } : {
              valid: true,
              match: val,
              get examples() {
                return (0, _getExampleUrls.getExampleUrls)(pattern, combinedOptions).filter((url) => val(url)).slice(0, 100);
              },
              patterns: [pattern],
              config: combinedOptions,
              assertValid
            };
          };
        }
        function allValid(matchers) {
          return matchers.every((m) => m.valid);
        }
        function matchPattern$1(pattern, options = {}) {
          const patterns = typeof pattern === "string" ? [pattern] : [...new Set(pattern)];
          if (patterns.length === 1) return _matchPattern(options)(patterns[0]);
          const matchers = patterns.map(_matchPattern(options));
          if (allValid(matchers)) {
            return {
              valid: true,
              get examples() {
                return [...new Set(matchers.flatMap((m) => m.examples))];
              },
              match: (url) => matchers.some((m) => m.match(url)),
              patterns,
              config: options,
              assertValid
            };
          } else {
            const invalid = matchers.find((m) => !m.valid);
            return {
              valid: false,
              error: invalid.error,
              assertValid
            };
          }
        }
        return matchPattern;
      }
      var hasRequiredDist;
      function requireDist() {
        if (hasRequiredDist) return dist$1;
        hasRequiredDist = 1;
        (function(exports) {
          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          Object.defineProperty(exports, "matchPattern", {
            enumerable: true,
            get: function() {
              return _matchPattern.matchPattern;
            }
          });
          Object.defineProperty(exports, "presets", {
            enumerable: true,
            get: function() {
              return _config.presets;
            }
          });
          var _matchPattern = requireMatchPattern();
          var _config = requireConfig();
        })(dist$1);
        return dist$1;
      }
      var distExports = requireDist();
      function interopDefault(module) {
        const internalModule = module;
        if ("default" in internalModule) {
          return internalModule.default;
        }
        return internalModule;
      }
      async function getUserscripts() {
        const modules = /* @__PURE__ */ Object.assign({ "../scripts/google/demo/index.tsx": () => __vitePreload(() => module.import('./index-Dk0RNgm0-DIfxDK-M.js'), void 0 ), "../scripts/v2ex/demo/index.tsx": () => __vitePreload(() => module.import('./index-CDgRVA6H-DNPsWUMh.js'), void 0 ) });
        const userscripts = await Promise.all(Object.values(modules).map((item) => item()));
        return userscripts.map((UserscriptItem, index) => {
          const userscript = interopDefault(UserscriptItem);
          return {
            key: Object.keys(modules)[index],
            script: userscript,
            matched: userscript.matches.map((item) => {
              return distExports.matchPattern(item).assertValid();
            }).some((item) => {
              return item.match(window.location.href);
            })
          };
        });
      }
      getUserscripts().then((userscripts) => {
        const matchedUserscripts = userscripts.filter((item) => item.matched);
        const scriptLines = userscripts.map((item) => {
          const status = item.matched ? "🟢" : "🔴";
          const name = item.script.displayName;
          return `${status} ${name}`;
        });
        const printInfo = [
          "",
          ...scriptLines
        ].join("\n");
        logger.debug(printInfo);
        matchedUserscripts.forEach((item) => {
          item.script();
        });
      });

    })
  };
}));

System.register("./index-Dk0RNgm0-DIfxDK-M.js", ['./__monkey.entry-CICLkIwt.js', './shadow-root-ntA_Bf4v-uyLa-4OP.js', 'react', 'react-dom'], (function (exports, module) {
  'use strict';
  var __vitePreload, createShadowRootUi, reactRenderInShadowRoot;
  return {
    setters: [module => {
      __vitePreload = module._;
    }, module => {
      createShadowRootUi = module.c;
      reactRenderInShadowRoot = module.r;
    }, null, null],
    execute: (function () {

      const Script = exports("default", async () => {
        const ui = await createShadowRootUi(
          {
            name: "google-demo",
            position: "inline",
            anchor: "body",
            onMount: (container, shadowRoot, shadowHost) => {
              return reactRenderInShadowRoot(
                { uiContainer: container, shadow: shadowRoot, shadowHost },
                () => __vitePreload(() => module.import('./app-CTkZu6Dc-SKZY4rEH.js'), void 0 )
              );
            }
          }
        );
        ui.mount();
      });
      Script.displayName = "google-demo";
      Script.matches = ["https://www.google.com/"];

    })
  };
}));

System.register("./index-CDgRVA6H-DNPsWUMh.js", ['./__monkey.entry-CICLkIwt.js', './shadow-root-ntA_Bf4v-uyLa-4OP.js', 'react', 'react-dom'], (function (exports, module) {
  'use strict';
  var __vitePreload, createShadowRootUi, reactRenderInShadowRoot;
  return {
    setters: [module => {
      __vitePreload = module._;
    }, module => {
      createShadowRootUi = module.c;
      reactRenderInShadowRoot = module.r;
    }, null, null],
    execute: (function () {

      const Script = exports("default", async () => {
        const ui = await createShadowRootUi(
          {
            name: "v2ex-demo",
            position: "inline",
            onMount: (container, shadowRoot, shadowHost) => {
              return reactRenderInShadowRoot(
                { uiContainer: container, shadow: shadowRoot, shadowHost },
                () => __vitePreload(() => module.import('./app-DTbN8Da9-oZpMwbeO.js'), void 0 )
              );
            }
          }
        );
        ui.mount();
      });
      Script.displayName = "v2ex-demo";
      Script.matches = ["https://www.v2ex.com/"];

    })
  };
}));

System.register("./shadow-root-ntA_Bf4v-uyLa-4OP.js", ['react', 'react-dom', './__monkey.entry-CICLkIwt.js'], (function (exports, module) {
  'use strict';
  var React__default, React__default__default, useEffect, require$$0, createPortal, logger;
  return {
    setters: [module => {
      React__default = module;
      React__default__default = module.default;
      useEffect = module.useEffect;
    }, module => {
      require$$0 = module.default;
      createPortal = module.createPortal;
    }, module => {
      logger = module.l;
    }],
    execute: (function () {

      exports({
        c: createShadowRootUi,
        r: reactRenderInShadowRoot
      });

      function getDefaultExportFromCjs(x) {
        return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
      }
      var jsxRuntime = { exports: {} };
      var reactJsxRuntime_production_min = {};
      /**
       * @license React
       * react-jsx-runtime.production.min.js
       *
       * Copyright (c) Facebook, Inc. and its affiliates.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */
      var hasRequiredReactJsxRuntime_production_min;
      function requireReactJsxRuntime_production_min() {
        if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
        hasRequiredReactJsxRuntime_production_min = 1;
        var f = React__default__default, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
        function q(c, a, g) {
          var b, d = {}, e = null, h = null;
          void 0 !== g && (e = "" + g);
          void 0 !== a.key && (e = "" + a.key);
          void 0 !== a.ref && (h = a.ref);
          for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
          if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
          return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
        }
        reactJsxRuntime_production_min.Fragment = l;
        reactJsxRuntime_production_min.jsx = q;
        reactJsxRuntime_production_min.jsxs = q;
        return reactJsxRuntime_production_min;
      }
      var hasRequiredJsxRuntime;
      function requireJsxRuntime() {
        if (hasRequiredJsxRuntime) return jsxRuntime.exports;
        hasRequiredJsxRuntime = 1;
        {
          jsxRuntime.exports = requireReactJsxRuntime_production_min();
        }
        return jsxRuntime.exports;
      }
      var jsxRuntimeExports = exports("j", requireJsxRuntime());
      var client = {};
      var hasRequiredClient;
      function requireClient() {
        if (hasRequiredClient) return client;
        hasRequiredClient = 1;
        var m = require$$0;
        {
          client.createRoot = m.createRoot;
          client.hydrateRoot = m.hydrateRoot;
        }
        return client;
      }
      var clientExports = requireClient();
      const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(clientExports);
      const inlineTailwindCSS = `/*! tailwindcss v4.1.12 | MIT License | https://tailwindcss.com */@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-border-style:solid;--tw-font-weight:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-red-400:oklch(70.4% .191 22.216);--color-blue-300:oklch(80.9% .105 251.813);--color-indigo-400:oklch(67.3% .182 276.935);--color-gray-800:oklch(27.8% .033 256.848);--color-white:#fff;--spacing:.25rem;--text-lg:1.125rem;--text-lg--line-height:calc(1.75/1.125);--font-weight-bold:700;--drop-shadow-xl:0 9px 7px #0000001a;--blur-lg:16px;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.visible{visibility:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.inset-0{inset:calc(var(--spacing)*0)}.isolate{isolation:isolate}.container{width:100%}@media (min-width:40rem){.container{max-width:40rem}}@media (min-width:48rem){.container{max-width:48rem}}@media (min-width:64rem){.container{max-width:64rem}}@media (min-width:80rem){.container{max-width:80rem}}@media (min-width:96rem){.container{max-width:96rem}}.i-bx--bx-edit{width:1em;height:1em;-webkit-mask-image:var(--svg);mask-image:var(--svg);--svg:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='black' d='m7 17.013l4.413-.015l9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583zM18.045 4.458l1.589 1.583l-1.597 1.582l-1.586-1.585zM9 13.417l6.03-5.973l1.586 1.586l-6.029 5.971L9 15.006z'/%3E%3Cpath fill='black' d='M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2'/%3E%3C/svg%3E");background-color:currentColor;display:inline-block;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}.block{display:block}.contents{display:contents}.flex{display:flex}.inline{display:inline}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.h-10{height:calc(var(--spacing)*10)}.max-h-\\[80vh\\]{max-height:80vh}.min-h-20{min-height:calc(var(--spacing)*20)}.w-130{width:calc(var(--spacing)*130)}.max-w-\\[80vw\\]{max-width:80vw}.cursor-pointer{cursor:pointer}.items-center{align-items:center}.justify-center{justify-content:center}.gap-1{gap:calc(var(--spacing)*1)}.border{border-style:var(--tw-border-style);border-width:1px}.bg-white{background-color:var(--color-white)}.p-1{padding:calc(var(--spacing)*1)}.p-2{padding:calc(var(--spacing)*2)}.px-1{padding-inline:calc(var(--spacing)*1)}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.text-gray-800{color:var(--color-gray-800)}.text-red-400{color:var(--color-red-400)}.italic{font-style:italic}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.backdrop-blur-lg{--tw-backdrop-blur:blur(var(--blur-lg));-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.will-change-\\[filter\\]{will-change:filter}@media (hover:hover){.hover\\:drop-shadow-xl:hover{--tw-drop-shadow-size:drop-shadow(0 9px 7px var(--tw-drop-shadow-color,#0000001a));--tw-drop-shadow:drop-shadow(var(--drop-shadow-xl));filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.hover\\:drop-shadow-blue-300:hover{--tw-drop-shadow-color:oklch(80.9% .105 251.813)}@supports (color:color-mix(in lab,red,red)){.hover\\:drop-shadow-blue-300:hover{--tw-drop-shadow-color:color-mix(in oklab,var(--color-blue-300)var(--tw-drop-shadow-alpha),transparent)}}.hover\\:drop-shadow-blue-300:hover{--tw-drop-shadow:var(--tw-drop-shadow-size)}.hover\\:drop-shadow-indigo-400:hover{--tw-drop-shadow-color:oklch(67.3% .182 276.935)}@supports (color:color-mix(in lab,red,red)){.hover\\:drop-shadow-indigo-400:hover{--tw-drop-shadow-color:color-mix(in oklab,var(--color-indigo-400)var(--tw-drop-shadow-alpha),transparent)}}.hover\\:drop-shadow-indigo-400:hover{--tw-drop-shadow:var(--tw-drop-shadow-size)}}}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}`;
      function InlineTailwindCSS() {
        useEffect(() => {
          if (document.querySelector("style[data-tailwind-at-properties]")) {
            return;
          }
          const atProperties = inlineTailwindCSS.slice(inlineTailwindCSS.indexOf("@property"));
          const style = document.createElement("style");
          style.textContent = atProperties;
          style.setAttribute("data-tailwind-at-properties", "");
          document.head.appendChild(style);
          return () => {
            document.head.removeChild(style);
          };
        }, []);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: inlineTailwindCSS });
      }
      function createContext(rootComponentName, defaultContext) {
        const Context = React__default.createContext(
          defaultContext
        );
        const Provider = (props) => {
          const { children, ...context } = props;
          const value = React__default.useMemo(
            () => context,
            // eslint-disable-next-line react-hooks/exhaustive-deps
            Object.values(context)
          );
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
        };
        function useContext() {
          const context = React__default.useContext(Context);
          if (context) {
            return context;
          }
          throw new Error(
            `the component must be used within \`${rootComponentName}\``
          );
        }
        return [Provider, useContext];
      }
      const [MountContextProvider, useMountContext] = createContext(
        "MountContext"
      ); exports("u", useMountContext);
      function reactRenderInShadowRoot(mountContext, app) {
        const { uiContainer, shadow } = mountContext;
        const _app = typeof app === "function" ? React__default__default.createElement(React__default__default.lazy(app)) : app;
        const rootContext = document.createElement("div");
        rootContext.id = "starter-monkey-root";
        uiContainer.appendChild(rootContext);
        const root = ReactDOM.createRoot(rootContext);
        const targetHead = shadow.querySelector("head");
        if (!targetHead) {
          console.error("No head element found in shadow root");
          return;
        }
        const portal = createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx(InlineTailwindCSS, {}), targetHead);
        root.render(
          /* @__PURE__ */ jsxRuntimeExports.jsxs(React__default__default.StrictMode, { children: [
            portal,
            /* @__PURE__ */ jsxRuntimeExports.jsx(MountContextProvider, { ...mountContext, children: _app })
          ] })
        );
        return root;
      }
      var isPotentialCustomElementName_1;
      var hasRequiredIsPotentialCustomElementName;
      function requireIsPotentialCustomElementName() {
        if (hasRequiredIsPotentialCustomElementName) return isPotentialCustomElementName_1;
        hasRequiredIsPotentialCustomElementName = 1;
        var regex = /^[a-z](?:[\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-(?:[\x2D\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
        var isPotentialCustomElementName2 = function(string) {
          return regex.test(string);
        };
        isPotentialCustomElementName_1 = isPotentialCustomElementName2;
        return isPotentialCustomElementName_1;
      }
      var isPotentialCustomElementNameExports = requireIsPotentialCustomElementName();
      const isPotentialCustomElementName = /* @__PURE__ */ getDefaultExportFromCjs(isPotentialCustomElementNameExports);
      var __async = (__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
          var fulfilled = (value) => {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          };
          var rejected = (value) => {
            try {
              step(generator.throw(value));
            } catch (e) {
              reject(e);
            }
          };
          var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
          step((generator = generator.apply(__this, __arguments)).next());
        });
      };
      function createIsolatedElement(options) {
        return __async(this, null, function* () {
          const { name, mode = "closed", css, isolateEvents = false } = options;
          if (!isPotentialCustomElementName(name)) {
            throw Error(
              `"${name}" is not a valid custom element name. It must be two words and kebab-case, with a few exceptions. See spec for more details: https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name`
            );
          }
          const parentElement = document.createElement(name);
          const shadow = parentElement.attachShadow({ mode });
          const isolatedElement = document.createElement("html");
          const body = document.createElement("body");
          const head = document.createElement("head");
          if (css) {
            const style = document.createElement("style");
            if ("url" in css) {
              style.textContent = yield fetch(css.url).then((res) => res.text());
            } else {
              style.textContent = css.textContent;
            }
            head.appendChild(style);
          }
          isolatedElement.appendChild(head);
          isolatedElement.appendChild(body);
          shadow.appendChild(isolatedElement);
          if (isolateEvents) {
            const eventTypes = Array.isArray(isolateEvents) ? isolateEvents : ["keydown", "keyup", "keypress"];
            eventTypes.forEach((eventType) => {
              body.addEventListener(eventType, (e) => e.stopPropagation());
            });
          }
          return {
            parentElement,
            shadow,
            isolatedElement: body
          };
        });
      }
      const nullKey = Symbol("null");
      let keyCounter = 0;
      class ManyKeysMap extends Map {
        constructor() {
          super();
          this._objectHashes = /* @__PURE__ */ new WeakMap();
          this._symbolHashes = /* @__PURE__ */ new Map();
          this._publicKeys = /* @__PURE__ */ new Map();
          const [pairs] = arguments;
          if (pairs === null || pairs === void 0) {
            return;
          }
          if (typeof pairs[Symbol.iterator] !== "function") {
            throw new TypeError(typeof pairs + " is not iterable (cannot read property Symbol(Symbol.iterator))");
          }
          for (const [keys, value] of pairs) {
            this.set(keys, value);
          }
        }
        _getPublicKeys(keys, create = false) {
          if (!Array.isArray(keys)) {
            throw new TypeError("The keys parameter must be an array");
          }
          const privateKey = this._getPrivateKey(keys, create);
          let publicKey;
          if (privateKey && this._publicKeys.has(privateKey)) {
            publicKey = this._publicKeys.get(privateKey);
          } else if (create) {
            publicKey = [...keys];
            this._publicKeys.set(privateKey, publicKey);
          }
          return { privateKey, publicKey };
        }
        _getPrivateKey(keys, create = false) {
          const privateKeys = [];
          for (let key of keys) {
            if (key === null) {
              key = nullKey;
            }
            const hashes = typeof key === "object" || typeof key === "function" ? "_objectHashes" : typeof key === "symbol" ? "_symbolHashes" : false;
            if (!hashes) {
              privateKeys.push(key);
            } else if (this[hashes].has(key)) {
              privateKeys.push(this[hashes].get(key));
            } else if (create) {
              const privateKey = `@@mkm-ref-${keyCounter++}@@`;
              this[hashes].set(key, privateKey);
              privateKeys.push(privateKey);
            } else {
              return false;
            }
          }
          return JSON.stringify(privateKeys);
        }
        set(keys, value) {
          const { publicKey } = this._getPublicKeys(keys, true);
          return super.set(publicKey, value);
        }
        get(keys) {
          const { publicKey } = this._getPublicKeys(keys);
          return super.get(publicKey);
        }
        has(keys) {
          const { publicKey } = this._getPublicKeys(keys);
          return super.has(publicKey);
        }
        delete(keys) {
          const { publicKey, privateKey } = this._getPublicKeys(keys);
          return Boolean(publicKey && super.delete(publicKey) && this._publicKeys.delete(privateKey));
        }
        clear() {
          super.clear();
          this._symbolHashes.clear();
          this._publicKeys.clear();
        }
        get [Symbol.toStringTag]() {
          return "ManyKeysMap";
        }
        get size() {
          return super.size;
        }
      }
      function isPlainObject(value) {
        if (value === null || typeof value !== "object") {
          return false;
        }
        const prototype = Object.getPrototypeOf(value);
        if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
          return false;
        }
        if (Symbol.iterator in value) {
          return false;
        }
        if (Symbol.toStringTag in value) {
          return Object.prototype.toString.call(value) === "[object Module]";
        }
        return true;
      }
      function _defu(baseObject, defaults, namespace = ".", merger) {
        if (!isPlainObject(defaults)) {
          return _defu(baseObject, {}, namespace);
        }
        const object = Object.assign({}, defaults);
        for (const key in baseObject) {
          if (key === "__proto__" || key === "constructor") {
            continue;
          }
          const value = baseObject[key];
          if (value === null || value === void 0) {
            continue;
          }
          if (Array.isArray(value) && Array.isArray(object[key])) {
            object[key] = [...value, ...object[key]];
          } else if (isPlainObject(value) && isPlainObject(object[key])) {
            object[key] = _defu(
              value,
              object[key],
              (namespace ? `${namespace}.` : "") + key.toString());
          } else {
            object[key] = value;
          }
        }
        return object;
      }
      function createDefu(merger) {
        return (...arguments_) => (
          // eslint-disable-next-line unicorn/no-array-reduce
          arguments_.reduce((p, c) => _defu(p, c, ""), {})
        );
      }
      const defu = createDefu();
      const isExist = (element) => {
        return element !== null ? { isDetected: true, result: element } : { isDetected: false };
      };
      const isNotExist = (element) => {
        return element === null ? { isDetected: true, result: null } : { isDetected: false };
      };
      const getDefaultOptions = () => ({
        target: globalThis.document,
        unifyProcess: true,
        detector: isExist,
        observeConfigs: {
          childList: true,
          subtree: true,
          attributes: true
        },
        signal: void 0,
        customMatcher: void 0
      });
      const mergeOptions = (userSideOptions, defaultOptions) => {
        return defu(userSideOptions, defaultOptions);
      };
      const unifyCache = new ManyKeysMap();
      function createWaitElement(instanceOptions) {
        const { defaultOptions } = instanceOptions;
        return (selector, options) => {
          const {
            target,
            unifyProcess,
            observeConfigs,
            detector,
            signal,
            customMatcher
          } = mergeOptions(options, defaultOptions);
          const unifyPromiseKey = [
            selector,
            target,
            unifyProcess,
            observeConfigs,
            detector,
            signal,
            customMatcher
          ];
          const cachedPromise = unifyCache.get(unifyPromiseKey);
          if (unifyProcess && cachedPromise) {
            return cachedPromise;
          }
          const detectPromise = new Promise(
            // biome-ignore lint/suspicious/noAsyncPromiseExecutor: avoid nesting promise
            async (resolve, reject) => {
              if (signal?.aborted) {
                return reject(signal.reason);
              }
              const observer = new MutationObserver(
                async (mutations) => {
                  for (const _ of mutations) {
                    if (signal?.aborted) {
                      observer.disconnect();
                      break;
                    }
                    const detectResult2 = await detectElement({
                      selector,
                      target,
                      detector,
                      customMatcher
                    });
                    if (detectResult2.isDetected) {
                      observer.disconnect();
                      resolve(detectResult2.result);
                      break;
                    }
                  }
                }
              );
              signal?.addEventListener(
                "abort",
                () => {
                  observer.disconnect();
                  return reject(signal.reason);
                },
                { once: true }
              );
              const detectResult = await detectElement({
                selector,
                target,
                detector,
                customMatcher
              });
              if (detectResult.isDetected) {
                return resolve(detectResult.result);
              }
              observer.observe(target, observeConfigs);
            }
          ).finally(() => {
            unifyCache.delete(unifyPromiseKey);
          });
          unifyCache.set(unifyPromiseKey, detectPromise);
          return detectPromise;
        };
      }
      async function detectElement({
        target,
        selector,
        detector,
        customMatcher
      }) {
        const element = customMatcher ? customMatcher(selector) : target.querySelector(selector);
        return await detector(element);
      }
      const waitElement = createWaitElement({
        defaultOptions: getDefaultOptions()
      });
      function applyPosition(root, positionedElement, options) {
        if (options.position === "inline") {
          return;
        }
        if (options.zIndex != null) {
          root.style.zIndex = String(options.zIndex);
        }
        root.style.overflow = "visible";
        root.style.position = "relative";
        root.style.width = "0";
        root.style.height = "0";
        root.style.display = "block";
        if (positionedElement) {
          if (options.position === "overlay") {
            positionedElement.style.position = "absolute";
            if (options.alignment?.startsWith("bottom-")) {
              positionedElement.style.bottom = "0";
            } else {
              positionedElement.style.top = "0";
            }
            if (options.alignment?.endsWith("-right")) {
              positionedElement.style.right = "0";
            } else {
              positionedElement.style.left = "0";
            }
          } else {
            positionedElement.style.position = "fixed";
            positionedElement.style.top = "0";
            positionedElement.style.bottom = "0";
            positionedElement.style.left = "0";
            positionedElement.style.right = "0";
          }
        }
      }
      function getAnchor(options) {
        if (options.anchor == null) {
          return document.body;
        }
        const resolved = typeof options.anchor === "function" ? options.anchor() : options.anchor;
        if (typeof resolved === "string") {
          if (resolved.startsWith("/")) {
            const result = document.evaluate(
              resolved,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            );
            return result.singleNodeValue ?? void 0;
          } else {
            return document.querySelector(resolved) ?? void 0;
          }
        }
        return resolved ?? void 0;
      }
      function mountUi(root, options) {
        const anchor = getAnchor(options);
        if (anchor == null) {
          throw new Error(
            "Failed to mount content script UI: could not find anchor element"
          );
        }
        switch (options.append) {
          case void 0:
          case "last":
            anchor.append(root);
            break;
          case "first":
            anchor.prepend(root);
            break;
          case "replace":
            anchor.replaceWith(root);
            break;
          case "after":
            anchor.parentElement?.insertBefore(root, anchor.nextElementSibling);
            break;
          case "before":
            anchor.parentElement?.insertBefore(root, anchor);
            break;
          default:
            options.append(anchor, root);
            break;
        }
      }
      function createMountFunctions(baseFunctions, options) {
        let autoMountInstance;
        const stopAutoMount = () => {
          autoMountInstance?.stopAutoMount();
          autoMountInstance = void 0;
        };
        const mount = () => {
          baseFunctions.mount();
        };
        const unmount = baseFunctions.remove;
        const remove = () => {
          stopAutoMount();
          baseFunctions.remove();
        };
        const autoMount = (autoMountOptions) => {
          if (autoMountInstance) {
            logger.warn("autoMount is already set.");
          }
          autoMountInstance = autoMountUi(
            { mount, unmount, stopAutoMount },
            {
              ...options,
              ...autoMountOptions
            }
          );
        };
        return {
          mount,
          remove,
          autoMount
        };
      }
      function autoMountUi(uiCallbacks, options) {
        const abortController = new AbortController();
        const EXPLICIT_STOP_REASON = "explicit_stop_auto_mount";
        const _stopAutoMount = () => {
          abortController.abort(EXPLICIT_STOP_REASON);
          options.onStop?.();
        };
        const resolvedAnchor = typeof options.anchor === "function" ? options.anchor() : options.anchor;
        if (resolvedAnchor instanceof Element) {
          throw new TypeError(
            "autoMount and Element anchor option cannot be combined. Avoid passing `Element` directly or `() => Element` to the anchor."
          );
        }
        async function observeElement(selector) {
          let isAnchorExist = !!getAnchor(options);
          if (isAnchorExist) {
            uiCallbacks.mount();
          }
          while (!abortController.signal.aborted) {
            try {
              const changedAnchor = await waitElement(selector ?? "body", {
                customMatcher: () => getAnchor(options) ?? null,
                detector: isAnchorExist ? isNotExist : isExist,
                signal: abortController.signal
              });
              isAnchorExist = !!changedAnchor;
              if (isAnchorExist) {
                uiCallbacks.mount();
              } else {
                uiCallbacks.unmount();
                if (options.once) {
                  uiCallbacks.stopAutoMount();
                }
              }
            } catch (error) {
              if (abortController.signal.aborted && abortController.signal.reason === EXPLICIT_STOP_REASON) {
                break;
              } else {
                throw error;
              }
            }
          }
        }
        observeElement(resolvedAnchor);
        return { stopAutoMount: _stopAutoMount };
      }
      function splitShadowRootCss(css) {
        let shadowCss = css;
        let documentCss = "";
        const rulesRegex = /(\s*@(property|font-face)[\s\S]*?\{[\s\S]*?\})/g;
        let match;
        while ((match = rulesRegex.exec(css)) !== null) {
          documentCss += match[1];
          shadowCss = shadowCss.replace(match[1], "");
        }
        return {
          documentCss: documentCss.trim(),
          shadowCss: shadowCss.trim()
        };
      }
      async function createShadowRootUi(options) {
        const instanceId = Math.random().toString(36).substring(2, 15);
        const css = [];
        if (options.css) {
          css.push(options.css);
        }
        const { shadowCss, documentCss } = splitShadowRootCss(css.join("\n").trim());
        const {
          isolatedElement: uiContainer,
          parentElement: shadowHost,
          shadow
        } = await createIsolatedElement({
          name: options.name,
          css: {
            textContent: shadowCss
          },
          mode: options.mode ?? "open",
          isolateEvents: options.isolateEvents
        });
        shadowHost.setAttribute("data-monkey-shadow-root", "");
        let mounted;
        const mount = () => {
          mountUi(shadowHost, options);
          applyPosition(shadowHost, shadow.querySelector("html"), options);
          if (documentCss && !document.querySelector(
            `style[data-monkey-shadow-root-document-styles="${instanceId}"]`
          )) {
            const style = document.createElement("style");
            style.textContent = documentCss;
            style.setAttribute("data-monkey-shadow-root-document-styles", instanceId);
            (document.head ?? document.body).append(style);
          }
          mounted = options.onMount(uiContainer, shadow, shadowHost);
        };
        const remove = () => {
          options.onRemove?.(mounted);
          shadowHost.remove();
          const documentStyle = document.querySelector(
            `style[data-monkey-shadow-root-document-styles="${instanceId}"]`
          );
          documentStyle?.remove();
          while (uiContainer.lastChild) {
            uiContainer.removeChild(uiContainer.lastChild);
          }
          mounted = void 0;
        };
        const mountFunctions = createMountFunctions(
          {
            mount,
            remove
          },
          options
        );
        return {
          shadow,
          shadowHost,
          uiContainer,
          ...mountFunctions,
          get mounted() {
            return mounted;
          }
        };
      }

    })
  };
}));

System.register("./app-CTkZu6Dc-SKZY4rEH.js", ['./shadow-root-ntA_Bf4v-uyLa-4OP.js', 'react', 'react-dom', './__monkey.entry-CICLkIwt.js'], (function (exports, module) {
  'use strict';
  var jsxRuntimeExports, useState;
  return {
    setters: [module => {
      jsxRuntimeExports = module.j;
    }, module => {
      useState = module.useState;
    }, null, null],
    execute: (function () {

      exports("default", App);

      const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

      const reactLogo = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20aria-hidden='true'%20role='img'%20class='iconify%20iconify--logos'%20width='35.93'%20height='32'%20preserveAspectRatio='xMidYMid%20meet'%20viewBox='0%200%20256%20228'%20%3e%3cpath%20fill='%2300D8FF'%20d='M210.483%2073.824a171.49%20171.49%200%200%200-8.24-2.597c.465-1.9.893-3.777%201.273-5.621c6.238-30.281%202.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254%2019.526a171.23%20171.23%200%200%200-6.375%205.848a155.866%20155.866%200%200%200-4.241-3.917C100.759%203.829%2077.587-4.822%2063.673%203.233C50.33%2010.957%2046.379%2033.89%2051.995%2062.588a170.974%20170.974%200%200%200%201.892%208.48c-3.28.932-6.445%201.924-9.474%202.98C17.309%2083.498%200%2098.307%200%20113.668c0%2015.865%2018.582%2031.778%2046.812%2041.427a145.52%20145.52%200%200%200%206.921%202.165a167.467%20167.467%200%200%200-2.01%209.138c-5.354%2028.2-1.173%2050.591%2012.134%2058.266c13.744%207.926%2036.812-.22%2059.273-19.855a145.567%20145.567%200%200%200%205.342-4.923a168.064%20168.064%200%200%200%206.92%206.314c21.758%2018.722%2043.246%2026.282%2056.54%2018.586c13.731-7.949%2018.194-32.003%2012.4-61.268a145.016%20145.016%200%200%200-1.535-6.842c1.62-.48%203.21-.974%204.76-1.488c29.348-9.723%2048.443-25.443%2048.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365%2070.984c-1.4.463-2.836.91-4.3%201.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11%209.31-21.767%2012.459-31.957c2.619.758%205.16%201.557%207.61%202.4c23.69%208.156%2038.14%2020.213%2038.14%2029.504c0%209.896-15.606%2022.743-40.946%2031.14Zm-10.514%2020.834c2.562%2012.94%202.927%2024.64%201.23%2033.787c-1.524%208.219-4.59%2013.698-8.382%2015.893c-8.067%204.67-25.32-1.4-43.927-17.412a156.726%20156.726%200%200%201-6.437-5.87c7.214-7.889%2014.423-17.06%2021.459-27.246c12.376-1.098%2024.068-2.894%2034.671-5.345a134.17%20134.17%200%200%201%201.386%206.193ZM87.276%20214.515c-7.882%202.783-14.16%202.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923%20156.923%200%200%201%201.869-8.499c10.486%202.32%2022.093%203.988%2034.498%204.994c7.084%209.967%2014.501%2019.128%2021.976%2027.15a134.668%20134.668%200%200%201-4.877%204.492c-9.933%208.682-19.886%2014.842-28.658%2017.94ZM50.35%20144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322%2013.897-21.212%2037.076-29.293c2.813-.98%205.757-1.905%208.812-2.773c3.204%2010.42%207.406%2021.315%2012.477%2032.332c-5.137%2011.18-9.399%2022.249-12.634%2032.792a134.718%20134.718%200%200%201-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134%206.425-47.789c8.564-4.958%2027.502%202.111%2047.463%2019.835a144.318%20144.318%200%200%201%203.841%203.545c-7.438%207.987-14.787%2017.08-21.808%2026.988c-12.04%201.116-23.565%202.908-34.161%205.309a160.342%20160.342%200%200%201-1.76-7.887Zm110.427%2027.268a347.8%20347.8%200%200%200-7.785-12.803c8.168%201.033%2015.994%202.404%2023.343%204.08c-2.206%207.072-4.956%2014.465-8.193%2022.045a381.151%20381.151%200%200%200-7.365-13.322Zm-45.032-43.861c5.044%205.465%2010.096%2011.566%2015.065%2018.186a322.04%20322.04%200%200%200-30.257-.006c4.974-6.559%2010.069-12.652%2015.192-18.18ZM82.802%2087.83a323.167%20323.167%200%200%200-7.227%2013.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634%2015.093-2.97%2023.209-3.984a321.524%20321.524%200%200%200-7.848%2012.897Zm8.081%2065.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3%205.045-14.885%208.298-22.6a321.187%20321.187%200%200%200%207.257%2013.246c2.594%204.48%205.28%208.868%208.038%2013.147Zm37.542%2031.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192%209.899.29%2014.978.29c5.218%200%2010.376-.117%2015.453-.343c-4.985%206.774-10.018%2012.97-15.028%2018.486Zm52.198-57.817c3.422%207.8%206.306%2015.345%208.596%2022.52c-7.422%201.694-15.436%203.058-23.88%204.071a382.417%20382.417%200%200%200%207.859-13.026a347.403%20347.403%200%200%200%207.425-13.565Zm-16.898%208.101a358.557%20358.557%200%200%201-12.281%2019.815a329.4%20329.4%200%200%201-23.444.823c-7.967%200-15.716-.248-23.178-.732a310.202%20310.202%200%200%201-12.513-19.846h.001a307.41%20307.41%200%200%201-10.923-20.627a310.278%20310.278%200%200%201%2010.89-20.637l-.001.001a307.318%20307.318%200%200%201%2012.413-19.761c7.613-.576%2015.42-.876%2023.31-.876H128c7.926%200%2015.743.303%2023.354.883a329.357%20329.357%200%200%201%2012.335%2019.695a358.489%20358.489%200%200%201%2011.036%2020.54a329.472%20329.472%200%200%201-11%2020.722Zm22.56-122.124c8.572%204.944%2011.906%2024.881%206.52%2051.026c-.344%201.668-.73%203.367-1.15%205.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789%20160.789%200%200%201%205.888-5.4c18.9-16.447%2036.564-22.941%2044.612-18.3ZM128%2090.808c12.625%200%2022.86%2010.235%2022.86%2022.86s-10.235%2022.86-22.86%2022.86s-22.86-10.235-22.86-22.86s10.235-22.86%2022.86-22.86Z'%20/%3e%3c/svg%3e";
      const viteLogo = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20aria-hidden='true'%20role='img'%20class='iconify%20iconify--logos'%20width='31.88'%20height='32'%20preserveAspectRatio='xMidYMid%20meet'%20viewBox='0%200%20256%20257'%20%3e%3cdefs%3e%3clinearGradient%20id='IconifyId1813088fe1fbc01fb466'%20x1='-.828%25'%20x2='57.636%25'%20y1='7.652%25'%20y2='78.411%25'%3e%3cstop%20offset='0%25'%20stop-color='%2341D1FF'%20/%3e%3cstop%20offset='100%25'%20stop-color='%23BD34FE'%20/%3e%3c/linearGradient%3e%3clinearGradient%20id='IconifyId1813088fe1fbc01fb467'%20x1='43.376%25'%20x2='50.316%25'%20y1='2.242%25'%20y2='89.03%25'%3e%3cstop%20offset='0%25'%20stop-color='%23FFEA83'%20/%3e%3cstop%20offset='8.333%25'%20stop-color='%23FFDD35'%20/%3e%3cstop%20offset='100%25'%20stop-color='%23FFA800'%20/%3e%3c/linearGradient%3e%3c/defs%3e%3cpath%20fill='url(%23IconifyId1813088fe1fbc01fb466)'%20d='M255.153%2037.938L134.897%20252.976c-2.483%204.44-8.862%204.466-11.382.048L.875%2037.958c-2.746-4.814%201.371-10.646%206.827-9.67l120.385%2021.517a6.537%206.537%200%200%200%202.322-.004l117.867-21.483c5.438-.991%209.574%204.796%206.877%209.62Z'%20/%3e%3cpath%20fill='url(%23IconifyId1813088fe1fbc01fb467)'%20d='M185.432.063L96.44%2017.501a3.268%203.268%200%200%200-2.634%203.014l-5.474%2092.456a3.268%203.268%200%200%200%203.997%203.378l24.777-5.718c2.318-.535%204.413%201.507%203.936%203.838l-7.361%2036.047c-.495%202.426%201.782%204.5%204.151%203.78l15.304-4.649c2.372-.72%204.652%201.36%204.15%203.788l-11.698%2056.621c-.732%203.542%203.979%205.473%205.943%202.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505%204.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z'%20/%3e%3c/svg%3e";
      const appCss = "/*! tailwindcss v4.1.12 | MIT License | https://tailwindcss.com */#starter-monkey-root{margin-inline:auto;margin-block:calc(var(--spacing,.25rem)*0);max-width:calc(var(--spacing,.25rem)*320);padding:calc(var(--spacing,.25rem)*8);text-align:center}body{align-items:center;display:flex}";
      importCSS(appCss);
      function r(e) {
        var t, f, n = "";
        if ("string" == typeof e || "number" == typeof e) n += e;
        else if ("object" == typeof e) if (Array.isArray(e)) {
          var o = e.length;
          for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
        } else for (f in e) e[f] && (n && (n += " "), n += f);
        return n;
      }
      function clsx() {
        for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
        return n;
      }
      function normalizeStrings(strings) {
        const lineCommentPattern = /\/\/.*((\r?\n)|$)/g;
        let result = strings.join(" ");
        if (result.includes("//")) {
          result = result.replace(lineCommentPattern, "");
        }
        return result.replace(/\s+/g, " ").trim();
      }
      function handleCls(strings, ...expressions) {
        const classNamesList = strings.reduce((prev, current, currentIndex) => {
          const expression = expressions[currentIndex] || "";
          prev.push(current, clsx(expression));
          return prev;
        }, []);
        return normalizeStrings(classNamesList);
      }
      function cls(strings, ...expressions) {
        return handleCls(strings, ...expressions);
      }
      function App() {
        const [count, setCount] = useState(0);
        const baseLogoCls = cls`h-10 p-1 will-change-[filter]`;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://vitejs.dev", target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: viteLogo,
                className: cls`
              ${baseLogoCls}
              hover:drop-shadow-xl hover:drop-shadow-indigo-400
            `,
                alt: "Vite logo"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://reactjs.org", target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: reactLogo,
                className: cls`
              ${baseLogoCls}
              hover:drop-shadow-xl hover:drop-shadow-blue-300
            `,
                alt: "React logo"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "italic", children: "Vite + React" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "cursor-pointer border px-1", type: "button", onClick: () => setCount((count2) => count2 + 1), children: [
              "count is",
              " ",
              count
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "Edit",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "src/App.tsx" }),
              " ",
              "and save to test HMR"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-800", children: "Click on the Vite and React logos to learn more" })
        ] });
      }

    })
  };
}));

System.register("./app-DTbN8Da9-oZpMwbeO.js", ['./shadow-root-ntA_Bf4v-uyLa-4OP.js', 'react', 'react-dom', './__monkey.entry-CICLkIwt.js'], (function (exports, module) {
  'use strict';
  var createShadowRootUi, reactRenderInShadowRoot, jsxRuntimeExports, useMountContext, useRef, useEffect, useMemo, memo, React__default__default, useState, useCallback;
  return {
    setters: [module => {
      createShadowRootUi = module.c;
      reactRenderInShadowRoot = module.r;
      jsxRuntimeExports = module.j;
      useMountContext = module.u;
    }, module => {
      useRef = module.useRef;
      useEffect = module.useEffect;
      useMemo = module.useMemo;
      memo = module.memo;
      React__default__default = module.default;
      useState = module.useState;
      useCallback = module.useCallback;
    }, null, null],
    execute: (function () {

      exports("default", App);

      var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
      function _defineProperty$1(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function ownKeys$1(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          if (enumerableOnly) symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          });
          keys.push.apply(keys, symbols);
        }
        return keys;
      }
      function _objectSpread2$1(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {};
          if (i % 2) {
            ownKeys$1(Object(source), true).forEach(function(key) {
              _defineProperty$1(target, key, source[key]);
            });
          } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
          } else {
            ownKeys$1(Object(source)).forEach(function(key) {
              Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
          }
        }
        return target;
      }
      function _objectWithoutPropertiesLoose(source, excluded) {
        if (source == null) return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;
        for (i = 0; i < sourceKeys.length; i++) {
          key = sourceKeys[i];
          if (excluded.indexOf(key) >= 0) continue;
          target[key] = source[key];
        }
        return target;
      }
      function _objectWithoutProperties(source, excluded) {
        if (source == null) return {};
        var target = _objectWithoutPropertiesLoose(source, excluded);
        var key, i;
        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
          for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
          }
        }
        return target;
      }
      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
      }
      function _iterableToArrayLimit(arr, i) {
        if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = void 0;
        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"] != null) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
        return arr2;
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          if (enumerableOnly) symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          });
          keys.push.apply(keys, symbols);
        }
        return keys;
      }
      function _objectSpread2(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {};
          if (i % 2) {
            ownKeys(Object(source), true).forEach(function(key) {
              _defineProperty(target, key, source[key]);
            });
          } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
          } else {
            ownKeys(Object(source)).forEach(function(key) {
              Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
          }
        }
        return target;
      }
      function compose$1() {
        for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
          fns[_key] = arguments[_key];
        }
        return function(x) {
          return fns.reduceRight(function(y, f) {
            return f(y);
          }, x);
        };
      }
      function curry$1(fn) {
        return function curried() {
          var _this = this;
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          return args.length >= fn.length ? fn.apply(this, args) : function() {
            for (var _len3 = arguments.length, nextArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              nextArgs[_key3] = arguments[_key3];
            }
            return curried.apply(_this, [].concat(args, nextArgs));
          };
        };
      }
      function isObject$1(value) {
        return {}.toString.call(value).includes("Object");
      }
      function isEmpty(obj) {
        return !Object.keys(obj).length;
      }
      function isFunction(value) {
        return typeof value === "function";
      }
      function hasOwnProperty(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      }
      function validateChanges(initial, changes) {
        if (!isObject$1(changes)) errorHandler$1("changeType");
        if (Object.keys(changes).some(function(field) {
          return !hasOwnProperty(initial, field);
        })) errorHandler$1("changeField");
        return changes;
      }
      function validateSelector(selector) {
        if (!isFunction(selector)) errorHandler$1("selectorType");
      }
      function validateHandler(handler) {
        if (!(isFunction(handler) || isObject$1(handler))) errorHandler$1("handlerType");
        if (isObject$1(handler) && Object.values(handler).some(function(_handler) {
          return !isFunction(_handler);
        })) errorHandler$1("handlersType");
      }
      function validateInitial(initial) {
        if (!initial) errorHandler$1("initialIsRequired");
        if (!isObject$1(initial)) errorHandler$1("initialType");
        if (isEmpty(initial)) errorHandler$1("initialContent");
      }
      function throwError$1(errorMessages2, type) {
        throw new Error(errorMessages2[type] || errorMessages2["default"]);
      }
      var errorMessages$1 = {
        initialIsRequired: "initial state is required",
        initialType: "initial state should be an object",
        initialContent: "initial state shouldn't be an empty object",
        handlerType: "handler should be an object or a function",
        handlersType: "all handlers should be a functions",
        selectorType: "selector should be a function",
        changeType: "provided value of changes should be an object",
        changeField: 'it seams you want to change a field in the state which is not specified in the "initial" state',
        "default": "an unknown error accured in `state-local` package"
      };
      var errorHandler$1 = curry$1(throwError$1)(errorMessages$1);
      var validators$1 = {
        changes: validateChanges,
        selector: validateSelector,
        handler: validateHandler,
        initial: validateInitial
      };
      function create(initial) {
        var handler = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        validators$1.initial(initial);
        validators$1.handler(handler);
        var state = {
          current: initial
        };
        var didUpdate = curry$1(didStateUpdate)(state, handler);
        var update = curry$1(updateState)(state);
        var validate = curry$1(validators$1.changes)(initial);
        var getChanges = curry$1(extractChanges)(state);
        function getState2() {
          var selector = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function(state2) {
            return state2;
          };
          validators$1.selector(selector);
          return selector(state.current);
        }
        function setState2(causedChanges) {
          compose$1(didUpdate, update, validate, getChanges)(causedChanges);
        }
        return [getState2, setState2];
      }
      function extractChanges(state, causedChanges) {
        return isFunction(causedChanges) ? causedChanges(state.current) : causedChanges;
      }
      function updateState(state, changes) {
        state.current = _objectSpread2(_objectSpread2({}, state.current), changes);
        return changes;
      }
      function didStateUpdate(state, handler, changes) {
        isFunction(handler) ? handler(state.current) : Object.keys(changes).forEach(function(field) {
          var _handler$field;
          return (_handler$field = handler[field]) === null || _handler$field === void 0 ? void 0 : _handler$field.call(handler, state.current[field]);
        });
        return changes;
      }
      var index = {
        create
      };
      var config$1 = {
        paths: {
          vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs"
        }
      };
      function curry(fn) {
        return function curried() {
          var _this = this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return args.length >= fn.length ? fn.apply(this, args) : function() {
            for (var _len2 = arguments.length, nextArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              nextArgs[_key2] = arguments[_key2];
            }
            return curried.apply(_this, [].concat(args, nextArgs));
          };
        };
      }
      function isObject(value) {
        return {}.toString.call(value).includes("Object");
      }
      function validateConfig(config2) {
        if (!config2) errorHandler("configIsRequired");
        if (!isObject(config2)) errorHandler("configType");
        if (config2.urls) {
          informAboutDeprecation();
          return {
            paths: {
              vs: config2.urls.monacoBase
            }
          };
        }
        return config2;
      }
      function informAboutDeprecation() {
        console.warn(errorMessages.deprecation);
      }
      function throwError(errorMessages2, type) {
        throw new Error(errorMessages2[type] || errorMessages2["default"]);
      }
      var errorMessages = {
        configIsRequired: "the configuration object is required",
        configType: "the configuration object should be an object",
        "default": "an unknown error accured in `@monaco-editor/loader` package",
        deprecation: "Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "
      };
      var errorHandler = curry(throwError)(errorMessages);
      var validators = {
        config: validateConfig
      };
      var compose = function compose2() {
        for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
          fns[_key] = arguments[_key];
        }
        return function(x) {
          return fns.reduceRight(function(y, f) {
            return f(y);
          }, x);
        };
      };
      function merge(target, source) {
        Object.keys(source).forEach(function(key) {
          if (source[key] instanceof Object) {
            if (target[key]) {
              Object.assign(source[key], merge(target[key], source[key]));
            }
          }
        });
        return _objectSpread2$1(_objectSpread2$1({}, target), source);
      }
      var CANCELATION_MESSAGE = {
        type: "cancelation",
        msg: "operation is manually canceled"
      };
      function makeCancelable(promise) {
        var hasCanceled_ = false;
        var wrappedPromise = new Promise(function(resolve, reject) {
          promise.then(function(val) {
            return hasCanceled_ ? reject(CANCELATION_MESSAGE) : resolve(val);
          });
          promise["catch"](reject);
        });
        return wrappedPromise.cancel = function() {
          return hasCanceled_ = true;
        }, wrappedPromise;
      }
      var _state$create = index.create({
        config: config$1,
        isInitialized: false,
        resolve: null,
        reject: null,
        monaco: null
      }), _state$create2 = _slicedToArray(_state$create, 2), getState = _state$create2[0], setState = _state$create2[1];
      function config(globalConfig) {
        var _validators$config = validators.config(globalConfig), monaco = _validators$config.monaco, config2 = _objectWithoutProperties(_validators$config, ["monaco"]);
        setState(function(state) {
          return {
            config: merge(state.config, config2),
            monaco
          };
        });
      }
      function init() {
        var state = getState(function(_ref) {
          var monaco = _ref.monaco, isInitialized = _ref.isInitialized, resolve = _ref.resolve;
          return {
            monaco,
            isInitialized,
            resolve
          };
        });
        if (!state.isInitialized) {
          setState({
            isInitialized: true
          });
          if (state.monaco) {
            state.resolve(state.monaco);
            return makeCancelable(wrapperPromise);
          }
          if (_unsafeWindow.monaco && _unsafeWindow.monaco.editor) {
            storeMonacoInstance(_unsafeWindow.monaco);
            state.resolve(_unsafeWindow.monaco);
            return makeCancelable(wrapperPromise);
          }
          compose(injectScripts, getMonacoLoaderScript)(configureLoader);
        }
        return makeCancelable(wrapperPromise);
      }
      function injectScripts(script) {
        return document.body.appendChild(script);
      }
      function createScript(src) {
        var script = document.createElement("script");
        return src && (script.src = src), script;
      }
      function getMonacoLoaderScript(configureLoader2) {
        var state = getState(function(_ref2) {
          var config2 = _ref2.config, reject = _ref2.reject;
          return {
            config: config2,
            reject
          };
        });
        var loaderScript = createScript("".concat(state.config.paths.vs, "/loader.js"));
        loaderScript.onload = function() {
          return configureLoader2();
        };
        loaderScript.onerror = state.reject;
        return loaderScript;
      }
      function configureLoader() {
        var state = getState(function(_ref3) {
          var config2 = _ref3.config, resolve = _ref3.resolve, reject = _ref3.reject;
          return {
            config: config2,
            resolve,
            reject
          };
        });
        var require2 = _unsafeWindow.require;
        require2.config(state.config);
        require2(["vs/editor/editor.main"], function(monaco) {
          storeMonacoInstance(monaco);
          state.resolve(monaco);
        }, function(error) {
          state.reject(error);
        });
      }
      function storeMonacoInstance(monaco) {
        if (!getState().monaco) {
          setState({
            monaco
          });
        }
      }
      function __getMonacoInstance() {
        return getState(function(_ref4) {
          var monaco = _ref4.monaco;
          return monaco;
        });
      }
      var wrapperPromise = new Promise(function(resolve, reject) {
        return setState({
          resolve,
          reject
        });
      });
      var loader = {
        config,
        init,
        __getMonacoInstance
      };
      var le = { wrapper: { display: "flex", position: "relative", textAlign: "initial" }, fullWidth: { width: "100%" }, hide: { display: "none" } }, v = le;
      var ae = { container: { display: "flex", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" } }, Y = ae;
      function Me({ children: e }) {
        return React__default__default.createElement("div", { style: Y.container }, e);
      }
      var Z = Me;
      var $ = Z;
      function Ee({ width: e, height: r, isEditorReady: n, loading: t, _ref: a, className: m, wrapperProps: E }) {
        return React__default__default.createElement("section", { style: { ...v.wrapper, width: e, height: r }, ...E }, !n && React__default__default.createElement($, null, t), React__default__default.createElement("div", { ref: a, style: { ...v.fullWidth, ...!n && v.hide }, className: m }));
      }
      var ee = Ee;
      var H = memo(ee);
      function Ce(e) {
        useEffect(e, []);
      }
      var k = Ce;
      function he(e, r, n = true) {
        let t = useRef(true);
        useEffect(t.current || !n ? () => {
          t.current = false;
        } : e, r);
      }
      var l = he;
      function D() {
      }
      function h(e, r, n, t) {
        return De(e, t) || be(e, r, n, t);
      }
      function De(e, r) {
        return e.editor.getModel(te(e, r));
      }
      function be(e, r, n, t) {
        return e.editor.createModel(r, n, t ? te(e, t) : void 0);
      }
      function te(e, r) {
        return e.Uri.parse(r);
      }
      function Oe({ original: e, modified: r, language: n, originalLanguage: t, modifiedLanguage: a, originalModelPath: m, modifiedModelPath: E, keepCurrentOriginalModel: g = false, keepCurrentModifiedModel: N = false, theme: x = "light", loading: P = "Loading...", options: y = {}, height: V = "100%", width: z = "100%", className: F, wrapperProps: j = {}, beforeMount: A = D, onMount: q = D }) {
        let [M, O] = useState(false), [T, s] = useState(true), u = useRef(null), c = useRef(null), w = useRef(null), d = useRef(q), o = useRef(A), b = useRef(false);
        k(() => {
          let i = loader.init();
          return i.then((f) => (c.current = f) && s(false)).catch((f) => f?.type !== "cancelation" && console.error("Monaco initialization: error:", f)), () => u.current ? I() : i.cancel();
        }), l(() => {
          if (u.current && c.current) {
            let i = u.current.getOriginalEditor(), f = h(c.current, e || "", t || n || "text", m || "");
            f !== i.getModel() && i.setModel(f);
          }
        }, [m], M), l(() => {
          if (u.current && c.current) {
            let i = u.current.getModifiedEditor(), f = h(c.current, r || "", a || n || "text", E || "");
            f !== i.getModel() && i.setModel(f);
          }
        }, [E], M), l(() => {
          let i = u.current.getModifiedEditor();
          i.getOption(c.current.editor.EditorOption.readOnly) ? i.setValue(r || "") : r !== i.getValue() && (i.executeEdits("", [{ range: i.getModel().getFullModelRange(), text: r || "", forceMoveMarkers: true }]), i.pushUndoStop());
        }, [r], M), l(() => {
          u.current?.getModel()?.original.setValue(e || "");
        }, [e], M), l(() => {
          let { original: i, modified: f } = u.current.getModel();
          c.current.editor.setModelLanguage(i, t || n || "text"), c.current.editor.setModelLanguage(f, a || n || "text");
        }, [n, t, a], M), l(() => {
          c.current?.editor.setTheme(x);
        }, [x], M), l(() => {
          u.current?.updateOptions(y);
        }, [y], M);
        let L = useCallback(() => {
          if (!c.current) return;
          o.current(c.current);
          let i = h(c.current, e || "", t || n || "text", m || ""), f = h(c.current, r || "", a || n || "text", E || "");
          u.current?.setModel({ original: i, modified: f });
        }, [n, r, a, e, t, m, E]), U = useCallback(() => {
          !b.current && w.current && (u.current = c.current.editor.createDiffEditor(w.current, { automaticLayout: true, ...y }), L(), c.current?.editor.setTheme(x), O(true), b.current = true);
        }, [y, x, L]);
        useEffect(() => {
          M && d.current(u.current, c.current);
        }, [M]), useEffect(() => {
          !T && !M && U();
        }, [T, M, U]);
        function I() {
          let i = u.current?.getModel();
          g || i?.original?.dispose(), N || i?.modified?.dispose(), u.current?.dispose();
        }
        return React__default__default.createElement(H, { width: z, height: V, isEditorReady: M, loading: P, _ref: w, className: F, wrapperProps: j });
      }
      var ie = Oe;
      memo(ie);
      function He(e) {
        let r = useRef();
        return useEffect(() => {
          r.current = e;
        }, [e]), r.current;
      }
      var se = He;
      var _ = /* @__PURE__ */ new Map();
      function Ve({ defaultValue: e, defaultLanguage: r, defaultPath: n, value: t, language: a, path: m, theme: E = "light", line: g, loading: N = "Loading...", options: x = {}, overrideServices: P = {}, saveViewState: y = true, keepCurrentModel: V = false, width: z = "100%", height: F = "100%", className: j, wrapperProps: A = {}, beforeMount: q = D, onMount: M = D, onChange: O, onValidate: T = D }) {
        let [s, u] = useState(false), [c, w] = useState(true), d = useRef(null), o = useRef(null), b = useRef(null), L = useRef(M), U = useRef(q), I = useRef(), i = useRef(t), f = se(m), Q = useRef(false), B = useRef(false);
        k(() => {
          let p = loader.init();
          return p.then((R) => (d.current = R) && w(false)).catch((R) => R?.type !== "cancelation" && console.error("Monaco initialization: error:", R)), () => o.current ? pe() : p.cancel();
        }), l(() => {
          let p = h(d.current, e || t || "", r || a || "", m || n || "");
          p !== o.current?.getModel() && (y && _.set(f, o.current?.saveViewState()), o.current?.setModel(p), y && o.current?.restoreViewState(_.get(m)));
        }, [m], s), l(() => {
          o.current?.updateOptions(x);
        }, [x], s), l(() => {
          !o.current || t === void 0 || (o.current.getOption(d.current.editor.EditorOption.readOnly) ? o.current.setValue(t) : t !== o.current.getValue() && (B.current = true, o.current.executeEdits("", [{ range: o.current.getModel().getFullModelRange(), text: t, forceMoveMarkers: true }]), o.current.pushUndoStop(), B.current = false));
        }, [t], s), l(() => {
          let p = o.current?.getModel();
          p && a && d.current?.editor.setModelLanguage(p, a);
        }, [a], s), l(() => {
          g !== void 0 && o.current?.revealLine(g);
        }, [g], s), l(() => {
          d.current?.editor.setTheme(E);
        }, [E], s);
        let X = useCallback(() => {
          if (!(!b.current || !d.current) && !Q.current) {
            U.current(d.current);
            let p = m || n, R = h(d.current, t || e || "", r || a || "", p || "");
            o.current = d.current?.editor.create(b.current, { model: R, automaticLayout: true, ...x }, P), y && o.current.restoreViewState(_.get(p)), d.current.editor.setTheme(E), g !== void 0 && o.current.revealLine(g), u(true), Q.current = true;
          }
        }, [e, r, n, t, a, m, x, P, y, E, g]);
        useEffect(() => {
          s && L.current(o.current, d.current);
        }, [s]), useEffect(() => {
          !c && !s && X();
        }, [c, s, X]), i.current = t, useEffect(() => {
          s && O && (I.current?.dispose(), I.current = o.current?.onDidChangeModelContent((p) => {
            B.current || O(o.current.getValue(), p);
          }));
        }, [s, O]), useEffect(() => {
          if (s) {
            let p = d.current.editor.onDidChangeMarkers((R) => {
              let G = o.current.getModel()?.uri;
              if (G && R.find((J) => J.path === G.path)) {
                let J = d.current.editor.getModelMarkers({ resource: G });
                T?.(J);
              }
            });
            return () => {
              p?.dispose();
            };
          }
          return () => {
          };
        }, [s, T]);
        function pe() {
          I.current?.dispose(), V ? y && _.set(m, o.current.saveViewState()) : o.current.getModel()?.dispose(), o.current.dispose();
        }
        return React__default__default.createElement(H, { width: z, height: F, isEditorReady: s, loading: N, _ref: b, className: j, wrapperProps: A });
      }
      var fe = Ve;
      var de = memo(fe);
      function createElementMutationObserver(options) {
        const { element, onMount, onUpdate, observeOptions } = options;
        if (!element.isConnected) {
          return;
        }
        if (onMount) {
          onMount(element);
        }
        if (onUpdate) {
          const callback = (mutations, observer2) => {
            onUpdate(element, mutations);
          };
          const observer = new MutationObserver(callback);
          observer.observe(element, {
            subtree: true,
            childList: true,
            attributes: true,
            ...observeOptions
          });
          return () => {
            observer.disconnect();
          };
        }
      }
      React__default__default.createContext(/* @__PURE__ */ new Map());
      function useElementsMutationObserver(selectors, options, observeOptions) {
        const optionsRef = useRef(options);
        useEffect(() => {
          optionsRef.current = options;
        }, [options]);
        const stateManager = useMemo(() => {
          const unmountCallbackElements = /* @__PURE__ */ new WeakSet();
          const mountDisposers = /* @__PURE__ */ new Map();
          return {
            markElementForUnmount(element) {
              unmountCallbackElements.add(element);
            },
            hasUnmountCallback(element) {
              return unmountCallbackElements.has(element);
            },
            removeUnmountCallback(element) {
              unmountCallbackElements.delete(element);
            },
            setMountDisposer(element, disposer) {
              mountDisposers.set(element, disposer);
            },
            getMountDisposer(element) {
              return mountDisposers.get(element);
            },
            hasMountDisposer(element) {
              return mountDisposers.has(element);
            },
            removeMountDisposer(element) {
              mountDisposers.delete(element);
            },
            // Return all disposers currently stored. Used during hook cleanup.
            getAllMountDisposers() {
              return Array.from(mountDisposers.values());
            }
          };
        }, [selectors]);
        const memoedObserveOptions = useMemo(() => {
          return {
            subtree: true,
            childList: true,
            attributes: true,
            ...observeOptions
          };
        }, [JSON.stringify(observeOptions)]);
        const rootElementFromOptions = options?.rootElement ?? null;
        useEffect(() => {
          const disposers = [];
          const createUpdateObserverForElement = (element) => {
            if (optionsRef.current?.onUpdate) {
              const elementObserverDisposer = createElementMutationObserver({
                element,
                observeOptions: memoedObserveOptions,
                onUpdate: () => {
                  const currentOptions = optionsRef.current;
                  if (currentOptions?.onUpdate) {
                    currentOptions.onUpdate(element);
                  }
                }
              });
              if (elementObserverDisposer) {
                disposers.push(elementObserverDisposer);
              }
            }
          };
          const processElement = (element) => {
            const currentOptions = optionsRef.current;
            try {
              if (currentOptions?.onMount) {
                const possibleDisposer = currentOptions.onMount(element);
                if (typeof possibleDisposer === "function") {
                  stateManager.setMountDisposer(element, possibleDisposer);
                }
              }
              if (currentOptions?.onUnmount) {
                stateManager.markElementForUnmount(element);
              }
              createUpdateObserverForElement(element);
            } catch (error) {
              console.error("Error processing element:", error, element);
            }
          };
          const processElements = (elements) => {
            elements.forEach(processElement);
          };
          const processUnmountElement = (element) => {
            const currentOptions = optionsRef.current;
            try {
              if (stateManager.hasMountDisposer(element)) {
                const mountDisposer = stateManager.getMountDisposer(element);
                if (mountDisposer) {
                  try {
                    mountDisposer();
                  } catch (err) {
                    console.error("Error calling mount disposer for element:", err, element);
                  }
                }
                stateManager.removeMountDisposer(element);
              }
            } catch (err) {
              console.error("Error handling mount disposer for element:", err, element);
            }
            if (currentOptions?.onUnmount && stateManager.hasUnmountCallback(element)) {
              try {
                currentOptions.onUnmount(element);
              } catch (error) {
                console.error("Error processing unmount element:", error, element);
              } finally {
                stateManager.removeUnmountCallback(element);
              }
            }
          };
          const processRemovedNode = (removedNode) => {
            if (removedNode.matches(selectors)) {
              processUnmountElement(removedNode);
            } else {
              const matchedChildren = removedNode.querySelectorAll(selectors);
              matchedChildren.forEach(processUnmountElement);
            }
          };
          const root = rootElementFromOptions ?? document.documentElement;
          const documentObserverDisposer = createElementMutationObserver({
            element: root,
            observeOptions: memoedObserveOptions,
            onMount: () => {
              const elements = root.querySelectorAll(selectors);
              processElements(Array.from(elements));
            },
            onUpdate: (_2, mutations) => {
              const currentOptions = optionsRef.current;
              mutations.forEach((record) => {
                if (record.type === "childList" && record.addedNodes.length > 0) {
                  record.addedNodes.forEach((addedNode) => {
                    if (addedNode instanceof Element) {
                      const elementsToProcess = [];
                      if (addedNode.matches(selectors)) {
                        elementsToProcess.push(addedNode);
                      }
                      const matchedChildren = addedNode.querySelectorAll(selectors);
                      elementsToProcess.push(...Array.from(matchedChildren));
                      processElements(elementsToProcess);
                    }
                  });
                }
              });
              if (!currentOptions?.onUnmount) {
                return;
              }
              mutations.forEach((record) => {
                if (record.type === "childList" && record.removedNodes.length > 0) {
                  record.removedNodes.forEach((removedNode) => {
                    if (removedNode instanceof Element) {
                      processRemovedNode(removedNode);
                    }
                  });
                }
              });
            }
          });
          if (documentObserverDisposer) {
            disposers.push(documentObserverDisposer);
          }
          return () => {
            disposers.forEach((dispose) => dispose());
            try {
              const remainingDisposers = stateManager.getAllMountDisposers();
              remainingDisposers.forEach((d) => {
                try {
                  d();
                } catch (err) {
                  console.error("Error calling mount disposer during cleanup:", err);
                }
              });
            } catch (err) {
              console.error("Error while cleaning up mount disposers:", err);
            }
          };
        }, [selectors, memoedObserveOptions, stateManager, rootElementFromOptions]);
      }
      function useSyncDocumentHeadElements(options) {
        const { selectors } = options;
        const { shadow } = useMountContext();
        useElementsMutationObserver(selectors, {
          rootElement: document.head,
          onMount: (element) => {
            const shadowHead = shadow.querySelector("head");
            if (!shadowHead) {
              return;
            }
            const copiedElement = element.cloneNode(true);
            shadowHead.appendChild(copiedElement);
            return () => {
              shadowHead.removeChild(copiedElement);
            };
          }
        });
      }
      function MonacoEditor(props) {
        useSyncDocumentHeadElements({
          selectors: 'link[data-name="vs/editor/editor.main"], script[src*="/vs/editor/editor.main.js"], style[data-name="vs/editor/editor.main"]'
        });
        return /* @__PURE__ */ jsxRuntimeExports.jsx(de, { ...props });
      }
      function useCreateUis(selectors, createFn) {
        const uiMap = useRef(/* @__PURE__ */ new WeakMap());
        const versionMap = useRef(/* @__PURE__ */ new WeakMap());
        useElementsMutationObserver(selectors, {
          onMount: (element) => {
            const removeUiSafe = (ui) => {
              if (!ui) {
                return;
              }
              try {
                ui.remove();
              } catch (e) {
              }
            };
            const mountUiSafe = (ui) => {
              if (!ui) {
                return;
              }
              try {
                ui.mount();
              } catch (e) {
              }
            };
            const prevVersion = versionMap.current.get(element) ?? 0;
            const currentVersion = prevVersion + 1;
            versionMap.current.set(element, currentVersion);
            createFn(element).then((createdUi) => {
              const latestVersion = versionMap.current.get(element) ?? 0;
              if (latestVersion !== currentVersion) {
                removeUiSafe(createdUi);
                return;
              }
              const previousUi = uiMap.current.get(element);
              if (previousUi && previousUi !== createdUi) {
                removeUiSafe(previousUi);
              }
              uiMap.current.set(element, createdUi);
              mountUiSafe(createdUi);
            });
          }
        });
        return {
          // convenient helper to get the current mounted ui for an element
          getUiForElement: (el) => uiMap.current.get(el)
        };
      }
      function useShadowModal(options) {
        const { name, zIndex = 999, content } = options;
        const modalUi = useRef(null);
        const openRef = useRef(false);
        const toggleModal = () => {
          openRef.current = !openRef.current;
          if (openRef.current) {
            modalUi.current?.mount();
          } else {
            modalUi.current?.remove();
          }
        };
        useEffect(() => {
          createShadowRootUi({
            name,
            position: "modal",
            zIndex,
            onMount: (container, shadowRoot, shadowHost) => {
              shadowHost.style.display = "block";
              return reactRenderInShadowRoot(
                { uiContainer: container, shadow: shadowRoot, shadowHost },
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `
              absolute inset-0 flex items-center justify-center backdrop-blur-lg
            `,
                    onClick: () => {
                      toggleModal();
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "max-h-[80vh] min-h-20 w-130 max-w-[80vw]",
                        onClick: (event) => {
                          event.stopPropagation();
                        },
                        children: content
                      }
                    )
                  }
                )
              );
            }
          }).then((ui) => {
            if (modalUi.current) {
              modalUi.current.remove();
            }
            modalUi.current = ui;
            if (openRef.current) {
              ui.mount();
            }
          });
        }, [name, zIndex, content]);
        return {
          toggleModal
        };
      }
      function App() {
        const { toggleModal: toggleEditorModal } = useShadowModal({
          name: "v2ex-demo-editor",
          content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 text-lg", children: "Monaco Editor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MonacoEditor, { height: "50vh", defaultValue: "Hello, world!" })
          ] })
        });
        useCreateUis("a.topic-link", async (element) => {
          return createShadowRootUi({
            name: "v2ex-demo-item",
            position: "inline",
            append: "after",
            anchor: element,
            onMount: (container, shadowRoot, shadowHost) => {
              shadowHost.style.display = "inline-block";
              return reactRenderInShadowRoot(
                { uiContainer: container, shadow: shadowRoot, shadowHost },
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "inline-flex items-center gap-1 font-bold text-red-400",
                    onClick: () => {
                      toggleEditorModal();
                    },
                    children: [
                      "Editor",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "i-bx--bx-edit" })
                    ]
                  }
                )
              );
            }
          });
        });
        return null;
      }

    })
  };
}));

System.import("./__entry.js", "./");