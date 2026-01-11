// ==UserScript==
// @name         bob-monkey
// @namespace    yuns
// @version      1.0.0
// @description  个人图方便的用户脚本
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        https://deepwiki.com/*
// @match        https://deepwiki.com/*
// @match        https://github.com/*/*
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.19/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/react-umd@19.2.3/dist/react.umd.min.js
// @require      data:application/javascript,window.React&&(window.React.default=window.React);
// @require      https://cdn.jsdelivr.net/npm/react-umd@19.2.3/dist/react-dom.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/react-umd@19.2.3/dist/react-dom-client.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/@ant-design/cssinjs@2.0.2/dist/umd/cssinjs.min.js
// @require      https://cdn.jsdelivr.net/npm/antd@6.1.4/dist/antd.min.js
// @require      https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/system.min.js
// @require      https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/extras/named-register.min.js
// @require      data:application/javascript,%3B(typeof%20System!%3D'undefined')%26%26(System%3Dnew%20System.constructor())%3B
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/550210/bob-monkey.user.js
// @updateURL https://update.greasyfork.org/scripts/550210/bob-monkey.meta.js
// ==/UserScript==

System.addImportMap({ imports: {"@ant-design/cssinjs":"user:@ant-design/cssinjs","antd":"user:antd","react":"user:react","react-dom":"user:react-dom","react-dom/client":"user:react-dom/client"} });
System.set("user:@ant-design/cssinjs", (()=>{const _=antdCssinjs;('default' in _)||(_.default=_);return _})());
System.set("user:antd", (()=>{const _=antd;('default' in _)||(_.default=_);return _})());
System.set("user:react", (()=>{const _=React;('default' in _)||(_.default=_);return _})());
System.set("user:react-dom", (()=>{const _=ReactDOM;('default' in _)||(_.default=_);return _})());
System.set("user:react-dom/client", (()=>{const _=ReactDOMClient;('default' in _)||(_.default=_);return _})());

System.register("./__entry.js", ['./__monkey.entry-CH7Ii6ir.js'], (function (exports, module) {
	'use strict';
	return {
		setters: [null],
		execute: (function () {



		})
	};
}));

System.register("./__monkey.entry-CH7Ii6ir.js", [], (function (exports, module) {
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
      const scriptRel = (function detectScriptRel() {
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
              link.addEventListener("error", () => rej( new Error(`Unable to preload CSS for ${dep}`)));
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
        const cache = new Map();
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
          const replacer = (str) => str.replace(new RegExp(`[${chars.join("")}]`, [... new Set([...flags, ..."g"])].join("")), (m) => contextAgnosticMap[m]);
          return new _regex.RegexFragment(replacer(input));
        }
        function exact(input, flags) {
          return (0, _regex.regex)(flags)`${input}`;
        }
        function regexLength(input) {
          return (

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
              source += `(?:${[... new Set([...sub.filter(isContentful).map((x) => String(processSub(flags)(x)))])].sort((a, b) => mult * ((0, _escaping.regexLength)(b) - (0, _escaping.regexLength)(a))).join("|")})`;
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
            return schemeRegex.test(url.protocol) &&
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
      function detectIsUserscriptWithIncludes(userscript) {
        return "includes" in userscript;
      }
      async function getUserscripts() {
        const modules = Object.assign({ "../scripts/deepwiki/ask-helpers/index.tsx": () => __vitePreload(() => module.import('./index-TGFX2Mto-DfuU74Ae.js'), void 0 ), "../scripts/deepwiki/links/index.tsx": () => __vitePreload(() => module.import('./index-CzVJToak-Rg7IQpOc.js'), void 0 ), "../scripts/github/deepwiki-shortcut/index.tsx": () => __vitePreload(() => module.import('./index-Cawyxi35-BNhwiIp1.js'), void 0 ) });
        const userscripts = await Promise.all(Object.values(modules).map((item) => item()));
        return userscripts.map((UserscriptItem, index) => {
          const userscript = interopDefault(UserscriptItem);
          const isUserscriptWithIncludes = detectIsUserscriptWithIncludes(userscript);
          if (isUserscriptWithIncludes) {
            return {
              key: Object.keys(modules)[index],
              script: userscript,
              matched: userscript.includes.map((item) => {
                return new RegExp(item).test(`/${window.location.href}/`);
              })
            };
          } else {
            return {
              key: Object.keys(modules)[index],
              script: userscript,
              matched: userscript.matches.map((item) => {
                return distExports.matchPattern(item).assertValid();
              }).some((item) => {
                return item.match(window.location.href);
              })
            };
          }
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

System.register("./index-TGFX2Mto-DfuU74Ae.js", ['./__monkey.entry-CH7Ii6ir.js', './shadow-root-BQgIbrmJ-uqlXKqPr.js', '@ant-design/cssinjs', 'antd', 'react', 'react-dom', 'react-dom/client'], (function (exports, module) {
  'use strict';
  var __vitePreload, createShadowRootUi, reactRenderInShadowRoot;
  return {
    setters: [module => {
      __vitePreload = module._;
    }, module => {
      createShadowRootUi = module.c;
      reactRenderInShadowRoot = module.r;
    }, null, null, null, null, null],
    execute: (function () {

      const Script = exports("default", async () => {
        const ui = await createShadowRootUi(
          {
            name: "deepwiki-ask-helpers",
            position: "inline",
            onMount: (container, shadowRoot, shadowHost) => {
              return reactRenderInShadowRoot(
                { uiContainer: container, shadow: shadowRoot, shadowHost },
                () => __vitePreload(() => module.import('./app-DyPWEJ3g-ChYZlDZD.js'), void 0 )
              );
            }
          }
        );
        ui.mount();
      });
      Script.displayName = "deepwiki-ask-helpers";
      Script.matches = ["https://deepwiki.com/*"];

    })
  };
}));

System.register("./index-CzVJToak-Rg7IQpOc.js", ['./__monkey.entry-CH7Ii6ir.js', './shadow-root-BQgIbrmJ-uqlXKqPr.js', '@ant-design/cssinjs', 'antd', 'react', 'react-dom', 'react-dom/client'], (function (exports, module) {
  'use strict';
  var __vitePreload, createShadowRootUi, reactRenderInShadowRoot;
  return {
    setters: [module => {
      __vitePreload = module._;
    }, module => {
      createShadowRootUi = module.c;
      reactRenderInShadowRoot = module.r;
    }, null, null, null, null, null],
    execute: (function () {

      const Script = exports("default", async () => {
        const ui = await createShadowRootUi(
          {
            name: "deepwiki-links",
            position: "inline",
            onMount: (container, shadowRoot, shadowHost) => {
              return reactRenderInShadowRoot(
                { uiContainer: container, shadow: shadowRoot, shadowHost },
                () => __vitePreload(() => module.import('./app-LtIJ6G1L-C0Sbj1wG.js'), void 0 )
              );
            }
          }
        );
        ui.mount();
      });
      Script.displayName = "deepwiki-links";
      Script.matches = ["https://deepwiki.com/*"];

    })
  };
}));

System.register("./index-Cawyxi35-BNhwiIp1.js", ['./__monkey.entry-CH7Ii6ir.js', './shadow-root-BQgIbrmJ-uqlXKqPr.js', '@ant-design/cssinjs', 'antd', 'react', 'react-dom', 'react-dom/client'], (function (exports, module) {
  'use strict';
  var __vitePreload, createShadowRootUi, reactRenderInShadowRoot;
  return {
    setters: [module => {
      __vitePreload = module._;
    }, module => {
      createShadowRootUi = module.c;
      reactRenderInShadowRoot = module.r;
    }, null, null, null, null, null],
    execute: (function () {

      const Script = exports("default", async () => {
        const ui = await createShadowRootUi(
          {
            name: "deepwiki-shortcut",
            position: "inline",
            onMount: (container, shadowRoot, shadowHost) => {
              return reactRenderInShadowRoot(
                { uiContainer: container, shadow: shadowRoot, shadowHost },
                () => __vitePreload(() => module.import('./app-B5xoZv6g-DrgVFyBB.js'), void 0 )
              );
            }
          }
        );
        ui.mount();
      });
      Script.displayName = "deepwiki-shortcut";
      Script.matches = ["https://github.com/*/*"];

    })
  };
}));

System.register("./shadow-root-BQgIbrmJ-uqlXKqPr.js", ['@ant-design/cssinjs', 'antd', 'react', 'react-dom', 'react-dom/client', './__monkey.entry-CH7Ii6ir.js'], (function (exports, module) {
  'use strict';
  var StyleProvider, ConfigProvider, React__default, React__default__default, useEffect, createPortal, ReactDOM, logger;
  return {
    setters: [module => {
      StyleProvider = module.StyleProvider;
    }, module => {
      ConfigProvider = module.ConfigProvider;
    }, module => {
      React__default = module;
      React__default__default = module.default;
      useEffect = module.useEffect;
    }, module => {
      createPortal = module.createPortal;
    }, module => {
      ReactDOM = module.default;
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
      var reactJsxRuntime_production = {};
      var hasRequiredReactJsxRuntime_production;
      function requireReactJsxRuntime_production() {
        if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
        hasRequiredReactJsxRuntime_production = 1;
        var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
        function jsxProd(type, config, maybeKey) {
          var key = null;
          void 0 !== maybeKey && (key = "" + maybeKey);
          void 0 !== config.key && (key = "" + config.key);
          if ("key" in config) {
            maybeKey = {};
            for (var propName in config)
              "key" !== propName && (maybeKey[propName] = config[propName]);
          } else maybeKey = config;
          config = maybeKey.ref;
          return {
            $$typeof: REACT_ELEMENT_TYPE,
            type,
            key,
            ref: void 0 !== config ? config : null,
            props: maybeKey
          };
        }
        reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
        reactJsxRuntime_production.jsx = jsxProd;
        reactJsxRuntime_production.jsxs = jsxProd;
        return reactJsxRuntime_production;
      }
      var hasRequiredJsxRuntime;
      function requireJsxRuntime() {
        if (hasRequiredJsxRuntime) return jsxRuntime.exports;
        hasRequiredJsxRuntime = 1;
        {
          jsxRuntime.exports = requireReactJsxRuntime_production();
        }
        return jsxRuntime.exports;
      }
      var jsxRuntimeExports = exports("j", requireJsxRuntime());
      const inlineTailwindCSS = `@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-border-style:solid;--tw-gradient-position:initial;--tw-gradient-from:#0000;--tw-gradient-via:#0000;--tw-gradient-to:#0000;--tw-gradient-stops:initial;--tw-gradient-via-stops:initial;--tw-gradient-from-position:0%;--tw-gradient-via-position:50%;--tw-gradient-to-position:100%;--tw-font-weight:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-duration:initial;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-blue-50:oklch(97% .014 254.604);--color-blue-100:oklch(93.2% .032 255.585);--color-blue-400:oklch(70.7% .165 254.624);--color-blue-500:oklch(62.3% .214 259.815);--color-blue-600:oklch(54.6% .245 262.881);--color-blue-700:oklch(48.8% .243 264.376);--color-blue-800:oklch(42.4% .199 265.638);--color-blue-900:oklch(37.9% .146 265.522);--color-blue-950:oklch(28.2% .091 267.935);--color-indigo-50:oklch(96.2% .018 272.314);--color-indigo-950:oklch(25.7% .09 281.288);--color-purple-600:oklch(55.8% .288 302.321);--color-gray-50:oklch(98.5% .002 247.839);--color-gray-100:oklch(96.7% .003 264.542);--color-gray-200:oklch(92.8% .006 264.531);--color-gray-300:oklch(87.2% .01 258.338);--color-gray-400:oklch(70.7% .022 261.325);--color-gray-600:oklch(44.6% .03 256.802);--color-gray-700:oklch(37.3% .034 259.733);--color-gray-800:oklch(27.8% .033 256.848);--color-gray-900:oklch(21% .034 264.665);--color-white:#fff;--spacing:.25rem;--text-xs:.75rem;--text-xs--line-height:calc(1/.75);--text-sm:.875rem;--text-sm--line-height:calc(1.25/.875);--text-base:1rem;--text-base--line-height: 1.5 ;--font-weight-semibold:600;--radius-md:.375rem;--blur-lg:16px;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4,0,.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer antd,components;@layer utilities{.visible{visibility:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.inset-0{inset:calc(var(--spacing)*0)}.isolate{isolation:isolate}.container{width:100%}@media(min-width:40rem){.container{max-width:40rem}}@media(min-width:48rem){.container{max-width:48rem}}@media(min-width:64rem){.container{max-width:64rem}}@media(min-width:80rem){.container{max-width:80rem}}@media(min-width:96rem){.container{max-width:96rem}}.m-0{margin:calc(var(--spacing)*0)}.mx-1{margin-inline:calc(var(--spacing)*1)}.mx-auto{margin-inline:auto}.mt-2{margin-top:calc(var(--spacing)*2)}.mr-2{margin-right:calc(var(--spacing)*2)}.mb-0{margin-bottom:calc(var(--spacing)*0)}.mb-2{margin-bottom:calc(var(--spacing)*2)}.mb-3{margin-bottom:calc(var(--spacing)*3)}.mb-4{margin-bottom:calc(var(--spacing)*4)}.i-bx--brain{width:1em;height:1em;-webkit-mask-image:var(--svg);mask-image:var(--svg);--svg:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='black' d='M19.864 8.465a3.505 3.505 0 0 0-3.03-4.449A3.005 3.005 0 0 0 14 2a2.98 2.98 0 0 0-2 .78A2.98 2.98 0 0 0 10 2c-1.301 0-2.41.831-2.825 2.015a3.505 3.505 0 0 0-3.039 4.45A4.03 4.03 0 0 0 2 12c0 1.075.428 2.086 1.172 2.832A4 4 0 0 0 3 16c0 1.957 1.412 3.59 3.306 3.934A3.52 3.52 0 0 0 9.5 22c.979 0 1.864-.407 2.5-1.059A3.48 3.48 0 0 0 14.5 22a3.51 3.51 0 0 0 3.19-2.06a4.006 4.006 0 0 0 3.138-5.108A4 4 0 0 0 22 12a4.03 4.03 0 0 0-2.136-3.535M9.5 20c-.711 0-1.33-.504-1.47-1.198L7.818 18H7c-1.103 0-2-.897-2-2c0-.352.085-.682.253-.981l.456-.816l-.784-.51A2.02 2.02 0 0 1 4 12c0-.977.723-1.824 1.682-1.972l1.693-.26l-1.059-1.346a1.502 1.502 0 0 1 1.498-2.39L9 6.207V5a1 1 0 0 1 2 0v13.5c0 .827-.673 1.5-1.5 1.5m9.575-6.308l-.784.51l.456.816q.252.452.253.982c0 1.103-.897 2-2.05 2h-.818l-.162.802A1.5 1.5 0 0 1 14.5 20c-.827 0-1.5-.673-1.5-1.5V5c0-.552.448-1 1-1s1 .448 1 1.05v1.207l1.186-.225a1.502 1.502 0 0 1 1.498 2.39l-1.059 1.347l1.693.26A2 2 0 0 1 20 12c0 .683-.346 1.315-.925 1.692'/%3E%3C/svg%3E");background-color:currentColor;display:inline-block;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}.i-bx--history{width:1em;height:1em;-webkit-mask-image:var(--svg);mask-image:var(--svg);--svg:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='black' d='M12 8v5h5v-2h-3V8z'/%3E%3Cpath fill='black' d='M21.292 8.497a9 9 0 0 0-1.928-2.862a9 9 0 0 0-4.55-2.452a9.1 9.1 0 0 0-3.626 0a8.97 8.97 0 0 0-4.552 2.453a9 9 0 0 0-1.928 2.86A9 9 0 0 0 4 12l.001.025H2L5 16l3-3.975H6.001L6 12a6.96 6.96 0 0 1 1.195-3.913a7.1 7.1 0 0 1 1.891-1.892a7 7 0 0 1 2.503-1.054a7.003 7.003 0 0 1 8.269 5.445a7.1 7.1 0 0 1 0 2.824a6.9 6.9 0 0 1-1.054 2.503c-.25.371-.537.72-.854 1.036a7.1 7.1 0 0 1-2.225 1.501a7 7 0 0 1-1.313.408a7.1 7.1 0 0 1-2.823 0a7 7 0 0 1-2.501-1.053a7 7 0 0 1-1.037-.855l-1.414 1.414A9 9 0 0 0 13 21a9.1 9.1 0 0 0 3.503-.707a9 9 0 0 0 3.959-3.26A8.97 8.97 0 0 0 22 12a8.9 8.9 0 0 0-.708-3.503'/%3E%3C/svg%3E");background-color:currentColor;display:inline-block;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}.i-bx--question-mark{width:1em;height:1em;-webkit-mask-image:var(--svg);mask-image:var(--svg);--svg:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='black' d='M12 4C9.243 4 7 6.243 7 9h2c0-1.654 1.346-3 3-3s3 1.346 3 3c0 1.069-.454 1.465-1.481 2.255c-.382.294-.813.626-1.226 1.038C10.981 13.604 10.995 14.897 11 15v2h2v-2.009c0-.024.023-.601.707-1.284c.32-.32.682-.598 1.031-.867C15.798 12.024 17 11.1 17 9c0-2.757-2.243-5-5-5m-1 14h2v2h-2z'/%3E%3C/svg%3E");background-color:currentColor;display:inline-block;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}.i-bx--search{width:1em;height:1em;-webkit-mask-image:var(--svg);mask-image:var(--svg);--svg:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='black' d='M10 18a7.95 7.95 0 0 0 4.897-1.688l4.396 4.396l1.414-1.414l-4.396-4.396A7.95 7.95 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8s3.589 8 8 8m0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6s-6-2.691-6-6s2.691-6 6-6'/%3E%3C/svg%3E");background-color:currentColor;display:inline-block;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}.i-bx--time{width:1em;height:1em;-webkit-mask-image:var(--svg);mask-image:var(--svg);--svg:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='black' d='M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8'/%3E%3Cpath fill='black' d='M13 7h-2v6h6v-2h-4z'/%3E%3C/svg%3E");background-color:currentColor;display:inline-block;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}.block{display:block}.contents{display:contents}.flex{display:flex}.hidden{display:none}.inline{display:inline}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.size-4{width:calc(var(--spacing)*4);height:calc(var(--spacing)*4)}.size-5{width:calc(var(--spacing)*5);height:calc(var(--spacing)*5)}.size-6{width:calc(var(--spacing)*6);height:calc(var(--spacing)*6)}.size-8{width:calc(var(--spacing)*8);height:calc(var(--spacing)*8)}.size-12{width:calc(var(--spacing)*12);height:calc(var(--spacing)*12)}.h-64{height:calc(var(--spacing)*64)}.max-h-\\[80vh\\]{max-height:80vh}.min-h-20{min-height:calc(var(--spacing)*20)}.w-72{width:calc(var(--spacing)*72)}.w-130{width:calc(var(--spacing)*130)}.max-w-\\[80vw\\]{max-width:80vw}.origin-center{transform-origin:50%}.transform{transform:var(--tw-rotate-x,)var(--tw-rotate-y,)var(--tw-rotate-z,)var(--tw-skew-x,)var(--tw-skew-y,)}.cursor-pointer{cursor:pointer}.flex-wrap{flex-wrap:wrap}.items-center{align-items:center}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.gap-4{gap:calc(var(--spacing)*4)}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.rounded{border-radius:.25rem}.rounded-full{border-radius:3.40282e38px}.rounded-md{border-radius:var(--radius-md)}.border{border-style:var(--tw-border-style);border-width:1px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-blue-400{border-color:var(--color-blue-400)}.border-gray-200{border-color:var(--color-gray-200)}.border-gray-300{border-color:var(--color-gray-300)}.bg-blue-50{background-color:var(--color-blue-50)}.bg-gray-50{background-color:var(--color-gray-50)}.bg-white\\/50{background-color:#ffffff80}@supports (color:color-mix(in lab,red,red)){.bg-white\\/50{background-color:color-mix(in oklab,var(--color-white)50%,transparent)}}.bg-gradient-to-r{--tw-gradient-position:to right in oklab;background-image:linear-gradient(var(--tw-gradient-stops))}.from-blue-50{--tw-gradient-from:var(--color-blue-50);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.from-blue-600{--tw-gradient-from:var(--color-blue-600);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.via-purple-600{--tw-gradient-via:var(--color-purple-600);--tw-gradient-via-stops:var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-via)var(--tw-gradient-via-position),var(--tw-gradient-to)var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-via-stops)}.to-blue-800{--tw-gradient-to:var(--color-blue-800);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.to-indigo-50{--tw-gradient-to:var(--color-indigo-50);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.bg-clip-text{-webkit-background-clip:text;background-clip:text}.p-0{padding:calc(var(--spacing)*0)}.p-2{padding:calc(var(--spacing)*2)}.p-4{padding:calc(var(--spacing)*4)}.px-3{padding-inline:calc(var(--spacing)*3)}.py-1\\.5{padding-block:calc(var(--spacing)*1.5)}.py-12{padding-block:calc(var(--spacing)*12)}.text-center{text-align:center}.font-mono{font-family:var(--font-mono)}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.text-blue-600{color:var(--color-blue-600)}.text-gray-300{color:var(--color-gray-300)}.text-gray-600{color:var(--color-gray-600)}.text-gray-900{color:var(--color-gray-900)}.text-transparent{color:#0000}.no-underline{text-decoration-line:none}.shadow,.shadow-sm{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.backdrop-blur-lg{--tw-backdrop-blur:blur(var(--blur-lg));-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.duration-200{--tw-duration:.2s;transition-duration:.2s}.duration-300{--tw-duration:.3s;transition-duration:.3s}.will-change-transform{will-change:transform}@media(hover:hover){.group-hover\\:text-blue-700:is(:where(.group):hover *){color:var(--color-blue-700)}.hover\\:z-10:hover{z-index:10}.hover\\:scale-110:hover{--tw-scale-x:110%;--tw-scale-y:110%;--tw-scale-z:110%;scale:var(--tw-scale-x)var(--tw-scale-y)}.hover\\:bg-blue-100:hover{background-color:var(--color-blue-100)}.hover\\:bg-gray-100:hover{background-color:var(--color-gray-100)}.hover\\:bg-gray-200:hover{background-color:var(--color-gray-200)}.hover\\:shadow-lg:hover{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a),0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.hover\\:brightness-95:hover{--tw-brightness:brightness(95%);filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}}@media(prefers-color-scheme:dark){.dark\\:border-blue-500{border-color:var(--color-blue-500)}.dark\\:border-gray-600{border-color:var(--color-gray-600)}.dark\\:border-gray-700{border-color:var(--color-gray-700)}.dark\\:bg-blue-950{background-color:var(--color-blue-950)}.dark\\:bg-gray-800{background-color:var(--color-gray-800)}.dark\\:bg-gray-900\\/50{background-color:#10182880}@supports (color:color-mix(in lab,red,red)){.dark\\:bg-gray-900\\/50{background-color:color-mix(in oklab,var(--color-gray-900)50%,transparent)}}.dark\\:from-blue-950{--tw-gradient-from:var(--color-blue-950);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.dark\\:to-indigo-950{--tw-gradient-to:var(--color-indigo-950);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.dark\\:text-blue-400{color:var(--color-blue-400)}.dark\\:text-gray-50{color:var(--color-gray-50)}.dark\\:text-gray-400{color:var(--color-gray-400)}.dark\\:text-gray-600{color:var(--color-gray-600)}@media(hover:hover){.dark\\:hover\\:bg-blue-900:hover{background-color:var(--color-blue-900)}.dark\\:hover\\:bg-gray-700:hover{background-color:var(--color-gray-700)}}}}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-gradient-position{syntax:"*";inherits:false}@property --tw-gradient-from{syntax:"<color>";inherits:false;initial-value:#0000}@property --tw-gradient-via{syntax:"<color>";inherits:false;initial-value:#0000}@property --tw-gradient-to{syntax:"<color>";inherits:false;initial-value:#0000}@property --tw-gradient-stops{syntax:"*";inherits:false}@property --tw-gradient-via-stops{syntax:"*";inherits:false}@property --tw-gradient-from-position{syntax:"<length-percentage>";inherits:false;initial-value:0%}@property --tw-gradient-via-position{syntax:"<length-percentage>";inherits:false;initial-value:50%}@property --tw-gradient-to-position{syntax:"<length-percentage>";inherits:false;initial-value:100%}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}@property --tw-duration{syntax:"*";inherits:false}@property --tw-scale-x{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-y{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-z{syntax:"*";inherits:false;initial-value:1}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}`;
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
        return jsxRuntimeExports.jsx("style", { children: inlineTailwindCSS });
      }
      function createContext(rootComponentName, defaultContext) {
        const Context = React__default.createContext(
          defaultContext
        );
        const Provider = (props) => {
          const { children, ...context } = props;
          const value = React__default.useMemo(
            () => context,
Object.values(context)
          );
          return jsxRuntimeExports.jsx(Context.Provider, { value, children });
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
      );
      function reactRenderInShadowRoot(mountContext, app) {
        const { uiContainer, shadow } = mountContext;
        const _app = typeof app === "function" ? app : () => Promise.resolve({
          default: () => {
            return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: app });
          }
        });
        const rootContext = document.createElement("div");
        rootContext.id = "bob-monkey-root";
        uiContainer.appendChild(rootContext);
        const root = ReactDOM.createRoot(rootContext);
        const targetHead = shadow.querySelector("head");
        if (!targetHead) {
          console.error("No head element found in shadow root");
          return;
        }
        const portal = createPortal(
jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: jsxRuntimeExports.jsx(InlineTailwindCSS, {}) }),
          targetHead
        );
        root.render(
jsxRuntimeExports.jsxs(React__default__default.StrictMode, { children: [
            portal,
jsxRuntimeExports.jsx(MountContextProvider, { ...mountContext, children: jsxRuntimeExports.jsx(StyleProvider, { container: shadow, layer: true, children: jsxRuntimeExports.jsx(
              ConfigProvider,
              {
                getPopupContainer: () => shadow,
                getTargetContainer: () => shadow,
                children: React__default__default.createElement(React__default__default.lazy(_app))
              }
            ) }) })
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
      const isPotentialCustomElementName = getDefaultExportFromCjs(isPotentialCustomElementNameExports);
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
      var ALLOWED_SHADOW_ELEMENTS = [
        "article",
        "aside",
        "blockquote",
        "body",
        "div",
        "footer",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "header",
        "main",
        "nav",
        "p",
        "section",
        "span"
      ];
      function createIsolatedElement(options) {
        return __async(this, null, function* () {
          const { name, mode = "closed", css, isolateEvents = false } = options;
          if (!ALLOWED_SHADOW_ELEMENTS.includes(name) && !isPotentialCustomElementName(name)) {
            throw Error(
              `"${name}" cannot have a shadow root attached to it. It must be two words and kebab-case, with a few exceptions. See https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#elements_you_can_attach_a_shadow_to`
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
          this._objectHashes = new WeakMap();
          this._symbolHashes = new Map();
          this._publicKeys = new Map();
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

System.register("./app-DyPWEJ3g-ChYZlDZD.js", ['./shadow-root-BQgIbrmJ-uqlXKqPr.js', './ui-DuZG7jKQ-B--JgJfk.js', './client-KAL8RE9f-JeXNrSwN.js', 'antd', 'react', '@ant-design/cssinjs', 'react-dom', 'react-dom/client', './__monkey.entry-CH7Ii6ir.js'], (function (exports, module) {
  'use strict';
  var createShadowRootUi, reactRenderInShadowRoot, jsxRuntimeExports, useCreateUis, isRepoPage, _GM_getValue, _GM_setValue, Popover, Button, Typography, useState, useEffect;
  return {
    setters: [module => {
      createShadowRootUi = module.c;
      reactRenderInShadowRoot = module.r;
      jsxRuntimeExports = module.j;
    }, module => {
      useCreateUis = module.u;
    }, module => {
      isRepoPage = module.i;
      _GM_getValue = module._;
      _GM_setValue = module.a;
    }, module => {
      Popover = module.Popover;
      Button = module.Button;
      Typography = module.Typography;
    }, module => {
      useState = module.useState;
      useEffect = module.useEffect;
    }, null, null, null, null],
    execute: (function () {

      exports("default", App);

      function insertText(element, value) {
        try {
          element.focus();
          element.select();
          const tracker = element._valueTracker;
          if (tracker) {
            tracker.setValue("");
          }
          const success = document.execCommand("insertText", false, value);
          if (success) {
            if (tracker) {
              tracker.setValue(value);
            }
            return true;
          }
          return false;
        } catch (error) {
          console.error("insertText failed:", error);
          return false;
        }
      }
      function setTextareaValue(element, value, options = {}) {
        const { focusToEnd = true, debug = false } = options;
        if (debug) {
          console.debug(`Setting textarea value: "${value}"`);
        }
        const success = insertText(element, value);
        if (!success) {
          if (debug) {
            console.debug("execCommand failed, using fallback");
          }
          element.value = value;
          element.dispatchEvent(new Event("input", { bubbles: true }));
          element.dispatchEvent(new Event("change", { bubbles: true }));
        }
        if (focusToEnd) {
          element.focus();
          setTimeout(() => {
            element.selectionStart = element.selectionEnd = value.length;
          }, 0);
        }
        if (debug) {
          console.debug(`Textarea value set successfully: "${element.value}"`);
        }
      }
      const deepwikiAskHistoryCacheKey = "deepwiki-ask-history-cache-v2";
      function pushToAskHistory(question) {
        const pathname = location.pathname;
        if (!isRepoPage() || !question.trim()) {
          return;
        }
        const cache = _GM_getValue(deepwikiAskHistoryCacheKey, {});
        const pathHistory = cache[pathname] || [];
        const newItem = {
          question: question.trim(),
          timestamp: Date.now()
        };
        const filteredHistory = pathHistory.filter((item) => item.question !== question.trim());
        const newPathHistory = [...filteredHistory, newItem].slice(-5);
        cache[pathname] = newPathHistory;
        _GM_setValue(deepwikiAskHistoryCacheKey, cache);
      }
      function getAskHistory(pathname) {
        const cache = _GM_getValue(deepwikiAskHistoryCacheKey, {});
        const targetPath = pathname || location.pathname;
        return cache[targetPath] || [];
      }
      function getLastQuestion(pathname) {
        const history = getAskHistory(pathname);
        return history.length > 0 ? history[history.length - 1].question : null;
      }
      function useQuestionHistory(element) {
        const [refreshTrigger, setRefreshTrigger] = useState(0);
        const history = getAskHistory();
        const triggerRefresh = () => {
          setRefreshTrigger((prev) => prev + 1);
        };
        useEffect(() => {
          const handleKeydown = (event) => {
            const target = event.target;
            const question = target.value.trim();
            if (event.key === "Enter" && question) {
              if (event.ctrlKey || event.metaKey) {
                pushToAskHistory(question);
                triggerRefresh();
                console.debug("deepwiki-ask-helpers: question saved to cache (Ctrl+Enter)", question);
              } else {
                pushToAskHistory(question);
                triggerRefresh();
                console.debug("deepwiki-ask-helpers: question saved to cache (Enter)", question);
              }
            }
          };
          element.addEventListener("keydown", handleKeydown);
          return () => {
            element.removeEventListener("keydown", handleKeydown);
          };
        }, [element]);
        const handleLastQuestionClick = () => {
          if (history.length === 0) {
            return;
          }
          const lastQuestion = getLastQuestion();
          if (lastQuestion) {
            setTextareaValue(element, lastQuestion);
          } else {
            console.warn("deepwiki-ask-helpers: no previous question found");
          }
        };
        const handleQuestionClick = (question) => {
          setTextareaValue(element, question, { debug: true });
        };
        return {
          history,
          handleLastQuestionClick,
          handleQuestionClick
        };
      }
      function formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1e3 * 60));
        const diffHours = Math.floor(diffMs / (1e3 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1e3 * 60 * 60 * 24));
        if (diffMins < 1) {
          return "刚刚";
        } else if (diffMins < 60) {
          return `${diffMins}分钟前`;
        } else if (diffHours < 24) {
          return `${diffHours}小时前`;
        } else if (diffDays < 7) {
          return `${diffDays}天前`;
        } else {
          return date.toLocaleDateString("zh-CN", {
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
          });
        }
      }
      const { Paragraph: Paragraph$1, Text: Text$1 } = Typography;
      function HistoryItem({ item, isLatest, isLast, onQuestionClick }) {
        const handleClick = () => {
          onQuestionClick(item.question);
        };
        const baseClasses = "p-2 cursor-pointer rounded-md border transition-colors duration-200";
        const marginClass = isLast ? "mb-0" : "mb-2";
        const styleClasses = isLatest ? "border-blue-400 bg-blue-50 hover:bg-blue-100 dark:border-blue-500 dark:bg-blue-950 dark:hover:bg-blue-900" : "border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700";
        return jsxRuntimeExports.jsxs(
          "div",
          {
            className: `
        ${marginClass}
        ${baseClasses}
        ${styleClasses}
      `,
            onClick: handleClick,
            children: [
jsxRuntimeExports.jsx(
                Paragraph$1,
                {
                  ellipsis: { rows: 2, tooltip: item.question },
                  className: `
          mb-2 text-gray-900
          dark:text-gray-50
        `,
                  children: item.question
                }
              ),
jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
jsxRuntimeExports.jsx(
                  Text$1,
                  {
                    className: `
          text-xs text-gray-600
          dark:text-gray-400
        `,
                    children: formatTime(item.timestamp)
                  }
                ),
                isLatest && jsxRuntimeExports.jsx(
                  Text$1,
                  {
                    strong: true,
                    className: `
              text-xs text-blue-600
              dark:text-blue-400
            `,
                    children: "最新"
                  }
                )
              ] })
            ]
          }
        );
      }
      const { Paragraph, Text } = Typography;
      function HistoryTooltip({ history, onQuestionClick }) {
        const handleQuestionClick = (question) => {
          onQuestionClick(question);
        };
        if (history.length === 0) {
          return jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
jsxRuntimeExports.jsx(Paragraph, { type: "secondary", style: { marginBottom: 8 }, children: "暂无历史提问记录" }),
jsxRuntimeExports.jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: "在输入框中输入问题并按回车即可保存" })
          ] });
        }
        return jsxRuntimeExports.jsx("div", { className: "w-72", children: history.map((item, index) => {
          const isLatest = index === history.length - 1;
          const isLast = index === history.length - 1;
          return jsxRuntimeExports.jsx(
            HistoryItem,
            {
              item,
              isLatest,
              isLast,
              onQuestionClick: handleQuestionClick
            },
            item.timestamp
          );
        }) });
      }
      const { Title } = Typography;
      function LastQuestionButton(props) {
        const { element } = props;
        const [open, setOpen] = useState(false);
        const { history, handleLastQuestionClick, handleQuestionClick } = useQuestionHistory(element);
        const onQuestionClick = (question) => {
          handleQuestionClick(question);
          setOpen(false);
        };
        const handleClick = () => {
          if (history.length > 0) {
            setOpen(true);
          } else {
            handleLastQuestionClick();
          }
        };
        return jsxRuntimeExports.jsx(
          Popover,
          {
            content: jsxRuntimeExports.jsx(
              HistoryTooltip,
              {
                history,
                onQuestionClick
              }
            ),
            title: history.length > 0 ? jsxRuntimeExports.jsxs(Title, { level: 5, style: { margin: 0 }, children: [
              "历史问题",
              " ",
jsxRuntimeExports.jsxs(Typography.Text, { type: "secondary", style: { fontSize: 14 }, children: [
                "(",
                history.length,
                "/5)"
              ] })
            ] }) : void 0,
            open,
            onOpenChange: setOpen,
            placement: "topLeft",
            children: jsxRuntimeExports.jsxs(
              Button,
              {
                type: "text",
                onClick: handleClick,
                disabled: history.length === 0,
                children: [
                  "上次提问",
                  " ",
                  history.length > 0 && `(${history.length})`
                ]
              }
            )
          }
        );
      }
      function App() {
        useCreateUis("textarea", async (element) => {
          if (!isRepoPage()) {
            return;
          }
          if (!(element instanceof HTMLTextAreaElement)) {
            return;
          }
          const closestForm = element.closest("form");
          if (!closestForm) {
            console.debug("deepwiki-ask-helpers: cannot find closest form for textarea", element);
            return;
          }
          const toolbarFirstButton = closestForm.querySelector("button");
          if (!toolbarFirstButton) {
            console.debug("deepwiki-ask-helpers: textarea is not the first button in the toolbar", element);
            return;
          }
          return createShadowRootUi({
            name: "deepwiki-ask-helpers-last-question-button",
            position: "inline",
            append: "after",
            anchor: toolbarFirstButton,
            onMount: (container, shadowRoot, shadowHost) => {
              shadowHost.style.display = "inline-block";
              return reactRenderInShadowRoot(
                { uiContainer: container, shadow: shadowRoot, shadowHost },
jsxRuntimeExports.jsx(LastQuestionButton, { element })
              );
            }
          });
        });
        return null;
      }

    })
  };
}));

System.register("./app-LtIJ6G1L-C0Sbj1wG.js", ['./shadow-root-BQgIbrmJ-uqlXKqPr.js', 'antd', './ui-DuZG7jKQ-B--JgJfk.js', 'react', './client-KAL8RE9f-JeXNrSwN.js', '@ant-design/cssinjs', 'react-dom', 'react-dom/client', './__monkey.entry-CH7Ii6ir.js'], (function (exports, module) {
  'use strict';
  var jsxRuntimeExports, createShadowRootUi, reactRenderInShadowRoot, Modal, Typography, Input, Tag, useCreateUis, useState, useRef, useMemo, useEffect, _GM_getValue, _GM_setValue, isRepoPage;
  return {
    setters: [module => {
      jsxRuntimeExports = module.j;
      createShadowRootUi = module.c;
      reactRenderInShadowRoot = module.r;
    }, module => {
      Modal = module.Modal;
      Typography = module.Typography;
      Input = module.Input;
      Tag = module.Tag;
    }, module => {
      useCreateUis = module.u;
    }, module => {
      useState = module.useState;
      useRef = module.useRef;
      useMemo = module.useMemo;
      useEffect = module.useEffect;
    }, module => {
      _GM_getValue = module._;
      _GM_setValue = module.a;
      isRepoPage = module.i;
    }, null, null, null, null],
    execute: (function () {

      exports("default", App);

      const deepwikiHistoryCacheKey = "deepwiki-history-cache-v1";
      function pushToHistory() {
        const pathname = location.pathname;
        if (!isRepoPage()) {
          return;
        }
        const history = _GM_getValue(deepwikiHistoryCacheKey, []);
        const newHistory = [pathname, ...history.filter((item) => item !== pathname)].slice(0, 50);
        _GM_setValue(deepwikiHistoryCacheKey, newHistory);
      }
      function getHistory() {
        return _GM_getValue(deepwikiHistoryCacheKey, []);
      }
      function removeFromHistory(path) {
        const history = _GM_getValue(deepwikiHistoryCacheKey, []);
        const newHistory = history.filter((item) => item !== path);
        _GM_setValue(deepwikiHistoryCacheKey, newHistory);
      }
      const { Text: Text$1 } = Typography;
      function HistoryTag({ path, onRemove }) {
        const [owner, repo] = path.slice(1).split("/");
        return jsxRuntimeExports.jsx(
          Tag,
          {
            closable: true,
            onClose: (e) => {
              e.preventDefault();
              onRemove(path);
            },
            color: "blue",
            className: `
        m-0 origin-center transform cursor-pointer rounded-full px-3 py-1.5
        shadow-sm transition-all duration-300 will-change-transform
        hover:z-10 hover:scale-110 hover:shadow-lg hover:brightness-95
      `,
            style: { backfaceVisibility: "hidden", perspective: 1e3 },
            children: jsxRuntimeExports.jsxs(
              "a",
              {
                href: `https://deepwiki.com${path}`,
                className: `
          inline-flex items-center font-mono text-xs no-underline
          transition-colors
        `,
                onClick: (e) => e.stopPropagation(),
                children: [
jsxRuntimeExports.jsx(
                    Text$1,
                    {
                      type: "secondary",
                      className: `
            text-xs transition-colors
            group-hover:text-blue-700
          `,
                      children: owner
                    }
                  ),
jsxRuntimeExports.jsx(Text$1, { type: "secondary", className: "mx-1 text-xs", children: "/" }),
jsxRuntimeExports.jsx(Text$1, { strong: true, className: "text-xs transition-colors", children: repo })
                ]
              }
            )
          }
        );
      }
      const { Title, Text } = Typography;
      function HistoryPanel() {
        const [query, setQuery] = useState("");
        const [history, setHistory] = useState(() => getHistory());
        const inputRef = useRef(null);
        const filteredHistory = useMemo(() => {
          return history.filter((path) => path.toLowerCase().includes(query.toLowerCase()));
        }, [history, query]);
        useEffect(() => {
          inputRef.current?.focus();
        }, []);
        const handleRemove = (path) => {
          removeFromHistory(path);
          setHistory(getHistory());
        };
        return jsxRuntimeExports.jsxs("div", { children: [
jsxRuntimeExports.jsxs(
            "div",
            {
              className: `
        border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4
        dark:border-gray-700 dark:from-blue-950 dark:to-indigo-950
      `,
              children: [
jsxRuntimeExports.jsxs(Title, { level: 4, className: "mb-3 flex items-center", children: [
jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `
            mr-2 i-bx--time size-5 text-blue-600
            dark:text-blue-400
          `
                    }
                  ),
                  "历史记录"
                ] }),
jsxRuntimeExports.jsx(
                  Input,
                  {
                    ref: inputRef,
                    placeholder: "搜索历史记录...",
                    value: query,
                    onChange: (e) => setQuery(e.target.value),
                    prefix: jsxRuntimeExports.jsx("span", { className: "i-bx--search size-4" }),
                    allowClear: true,
                    size: "large"
                  }
                )
              ]
            }
          ),
jsxRuntimeExports.jsx(
            "div",
            {
              className: `
        h-64 overflow-y-auto bg-white/50 p-4
        dark:bg-gray-900/50
      `,
              children: filteredHistory.length === 0 ? jsxRuntimeExports.jsxs("div", { className: "py-12 text-center", children: [
jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `
                  mx-auto mb-4 i-bx--question-mark block size-12 text-gray-300
                  dark:text-gray-600
                `
                  }
                ),
jsxRuntimeExports.jsx(Text, { className: "block text-base", type: "secondary", children: query ? "未找到匹配的历史记录" : "暂无历史记录" }),
jsxRuntimeExports.jsx(Text, { className: "mt-2 block text-sm", type: "secondary", children: query ? "请尝试调整搜索词" : "开始探索以建立历史记录！" })
              ] }) : jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-4", children: filteredHistory.map((path) => jsxRuntimeExports.jsx(
                HistoryTag,
                {
                  path,
                  onRemove: handleRemove
                },
                path
              )) })
            }
          )
        ] });
      }
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
        const [modalOpen, setModalOpen] = useState(false);
        useCreateUis('button[aria-label="Switch to dark mode"]', async (element) => {
          pushToHistory();
          return createShadowRootUi({
            name: "deepwiki-shortcut-item",
            position: "inline",
            append: "after",
            anchor: element,
            onMount: (container, shadowRoot, shadowHost) => {
              shadowHost.style.display = "inline-block";
              return reactRenderInShadowRoot(
                { uiContainer: container, shadow: shadowRoot, shadowHost },
jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: `
              flex size-8 cursor-pointer items-center justify-center rounded
              hover:bg-gray-200
            `,
                    onClick: () => {
                      setModalOpen(true);
                    },
                    title: "浏览记录",
                    children: jsxRuntimeExports.jsx("span", { className: "i-bx--history size-6" })
                  }
                )
              );
            }
          });
        });
        return jsxRuntimeExports.jsx(
          Modal,
          {
            closable: false,
            open: modalOpen,
            footer: null,
            onCancel: () => setModalOpen(false),
            classNames: {
              container: cls`p-0 overflow-hidden`
            },
            children: jsxRuntimeExports.jsx(HistoryPanel, {})
          }
        );
      }

    })
  };
}));

System.register("./client-KAL8RE9f-JeXNrSwN.js", [], (function (exports, module) {
  'use strict';
  return {
    execute: (function () {

      exports("i", isRepoPage);

      function isRepoPage() {
        const pathname = location.pathname;
        if (pathname.startsWith("/search/")) {
          return false;
        }
        if (pathname.split("/").filter(Boolean).length !== 2) {
          return false;
        }
        return true;
      }
      var _GM_getValue = exports("_", (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)());
      var _GM_setValue = exports("a", (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)());

    })
  };
}));

System.register("./app-B5xoZv6g-DrgVFyBB.js", ['./shadow-root-BQgIbrmJ-uqlXKqPr.js', 'antd', './ui-DuZG7jKQ-B--JgJfk.js', 'react', '@ant-design/cssinjs', 'react-dom', 'react-dom/client', './__monkey.entry-CH7Ii6ir.js'], (function (exports, module) {
  'use strict';
  var createShadowRootUi, reactRenderInShadowRoot, jsxRuntimeExports, Button, useCreateUis, useEffect;
  return {
    setters: [module => {
      createShadowRootUi = module.c;
      reactRenderInShadowRoot = module.r;
      jsxRuntimeExports = module.j;
    }, module => {
      Button = module.Button;
    }, module => {
      useCreateUis = module.u;
    }, module => {
      useEffect = module.useEffect;
    }, null, null, null, null],
    execute: (function () {

      exports("default", App);

      const selector = '[data-testid="top-nav-center"] > nav > ol > li:nth-of-type(2)';
      function App() {
        useEffect(() => {
          const target = document.querySelector(selector);
          if (!target) {
            console.warn("DeepWiki shortcut: target element not found");
          }
        }, []);
        useCreateUis(selector, async (element) => {
          return createShadowRootUi({
            name: "deepwiki-shortcut-item",
            position: "inline",
            anchor: element,
            onMount: (container, shadowRoot, shadowHost) => {
              shadowHost.style.display = "inline-block";
              return reactRenderInShadowRoot(
                { uiContainer: container, shadow: shadowRoot, shadowHost },
jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "default",
                    size: "small",
                    icon: jsxRuntimeExports.jsx("span", { className: "flex items-center justify-center", children: jsxRuntimeExports.jsx("span", { className: "i-bx--brain size-4 text-blue-600" }) }),
                    onClick: () => {
                      window.open(`https://deepwiki.com${location.pathname}`, "_blank");
                    },
                    title: "在 DeepWiki 中查看此页面",
                    children: jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `
              bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800
              bg-clip-text font-semibold text-transparent
            `,
                        children: "DeepWiki"
                      }
                    )
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

System.register("./ui-DuZG7jKQ-B--JgJfk.js", ['./shadow-root-BQgIbrmJ-uqlXKqPr.js', 'react', '@ant-design/cssinjs', 'antd', 'react-dom', 'react-dom/client'], (function (exports, module) {
  'use strict';
  var useRef, useEffect, useMemo, React__default__default;
  return {
    setters: [null, module => {
      useRef = module.useRef;
      useEffect = module.useEffect;
      useMemo = module.useMemo;
      React__default__default = module.default;
    }, null, null, null, null],
    execute: (function () {

      exports("u", useCreateUis);

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
      React__default__default.createContext( new Map());
      function useElementsMutationObserver(selectors, options, observeOptions) {
        const optionsRef = useRef(options);
        useEffect(() => {
          optionsRef.current = options;
        }, [options]);
        const stateManager = useMemo(() => {
          const unmountCallbackElements = new WeakSet();
          const mountDisposers = new Map();
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
            onUpdate: (_, mutations) => {
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
      function useCreateUis(selectors, createFn) {
        const uiMap = useRef( new WeakMap());
        const versionMap = useRef( new WeakMap());
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
            Promise.resolve(createFn(element)).then((createdUi) => {
              if (!createdUi) {
                return;
              }
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
getUiForElement: (el) => uiMap.current.get(el)
        };
      }

    })
  };
}));

System.import("./__entry.js", "./");