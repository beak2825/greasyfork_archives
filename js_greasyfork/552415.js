// ==UserScript==
// @name         Best Laffer Hehe
// @author       idc about real creators, its remake of ez and abdo.
// @description  best mod 2026 / 2027
// @version      v2 remake
// @match        *://*.moomoo.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1500286
// @downloadURL https://update.greasyfork.org/scripts/552415/Best%20Laffer%20Hehe.user.js
// @updateURL https://update.greasyfork.org/scripts/552415/Best%20Laffer%20Hehe.meta.js
// ==/UserScript==
let autoVelocityTickToggled = false;
let wsAddress;
let autogathering = false;
let autoOneFrameToggled = true;
let settings = {
    botplatformplacer: false,
    botcount: 40,
    botname: "Helper",
    gamezoom: 100,
    x18ksync: true,
    chatlog: false,
    spampreplace: true,
    autoPlace: true,
};

let packets = 0;
let packetInterval;
let pps = 0;
let replaced = false;
/******/ (function(modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/ 	var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
        /******/
        /******/ 		// Check if module is in cache
        /******/ 		if(installedModules[moduleId]) {
            /******/ 			return installedModules[moduleId].exports;
            /******/ 		}
        /******/ 		// Create a new module (and put it into the cache)
        /******/ 		var module = installedModules[moduleId] = {
            /******/ 			i: moduleId,
            /******/ 			l: false,
            /******/ 			exports: {}
            /******/ 		};
        /******/
        /******/ 		// Execute the module function
        /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ 		// Flag the module as loaded
        /******/ 		module.l = true;
        /******/
        /******/ 		// Return the exports of the module
        /******/ 		return module.exports;
        /******/ 	}
    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/ 	__webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/ 	__webpack_require__.c = installedModules;
    /******/
    /******/ 	// define getter function for harmony exports
    /******/ 	__webpack_require__.d = function(exports, name, getter) {
        /******/ 		if(!__webpack_require__.o(exports, name)) {
            /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
            /******/ 		}
        /******/ 	};
    /******/
    /******/ 	// define __esModule on exports
    /******/ 	__webpack_require__.r = function(exports) {
        /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
            /******/ 		}
        /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
        /******/ 	};
    /******/
    /******/ 	// create a fake namespace object
    /******/ 	// mode & 1: value is a module id, require it
    /******/ 	// mode & 2: merge all properties of value into the ns
    /******/ 	// mode & 4: return value when already ns object
    /******/ 	// mode & 8|1: behave like require
    /******/ 	__webpack_require__.t = function(value, mode) {
        /******/ 		if(mode & 1) value = __webpack_require__(value);
        /******/ 		if(mode & 8) return value;
        /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
        /******/ 		var ns = Object.create(null);
        /******/ 		__webpack_require__.r(ns);
        /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
        /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
        /******/ 		return ns;
        /******/ 	};
    /******/
    /******/ 	// getDefaultExport function for compatibility with non-harmony modules
    /******/ 	__webpack_require__.n = function(module) {
        /******/ 		var getter = module && module.__esModule ?
            /******/ 			function getDefault() { return module['default']; } :
        /******/ 			function getModuleExports() { return module; };
        /******/ 		__webpack_require__.d(getter, 'a', getter);
        /******/ 		return getter;
        /******/ 	};
    /******/
    /******/ 	// Object.prototype.hasOwnProperty.call
    /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    /******/
    /******/ 	// __webpack_public_path__
    /******/ 	__webpack_require__.p = "";
    /******/
    /******/
    /******/ 	// Load entry module and return exports
    /******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/app.js");
    /******/ })
/************************************************************************/
/******/ ({

    /***/ "./node_modules/bad-words/lib/badwords.js":
    /*!************************************************!*\
  !*** ./node_modules/bad-words/lib/badwords.js ***!
  \************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        const localList = __webpack_require__(/*! ./lang.json */ "./node_modules/bad-words/lib/lang.json").words;
        const baseList = __webpack_require__(/*! badwords-list */ "./node_modules/badwords-list/lib/index.js").array;

        class Filter {

            /**
   * Filter constructor.
   * @constructor
   * @param {object} options - Filter instance options
   * @param {boolean} options.emptyList - Instantiate filter with no blacklist
   * @param {array} options.list - Instantiate filter with custom list
   * @param {string} options.placeHolder - Character used to replace profane words.
   * @param {string} options.regex - Regular expression used to sanitize words before comparing them to blacklist.
   * @param {string} options.replaceRegex - Regular expression used to replace profane words with placeHolder.
   */
            constructor(options = {}) {
                Object.assign(this, {
                    list: options.emptyList && [] || Array.prototype.concat.apply(localList, [baseList, options.list || []]),
                    exclude: options.exclude || [],
                    placeHolder: options.placeHolder || '*',
                    regex: options.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
                    replaceRegex: options.replaceRegex || /\w/g
                })
            }

            /**
   * Determine if a string contains profane language.
   * @param {string} string - String to evaluate for profanity.
   */
            isProfane(string) {
                return this.list
                    .filter((word) => {
                    const wordExp = new RegExp(`\\b${word.replace(/(\W)/g, '\\$1')}\\b`, 'gi');
                    return !this.exclude.includes(word.toLowerCase()) && wordExp.test(string);
                })
                    .length > 0 || false;
            }

            /**
   * Replace a word with placeHolder characters;
   * @param {string} string - String to replace.
   */
            replaceWord(string) {
                return string
                    .replace(this.regex, '')
                    .replace(this.replaceRegex, this.placeHolder);
            }

            /**
   * Evaluate a string for profanity and return an edited version.
   * @param {string} string - Sentence to filter.
   */
            clean(string) {
                return string.split(/\b/).map((word) => {
                    return this.isProfane(word) ? this.replaceWord(word) : word;
                }).join('');
            }

            /**
   * Add word(s) to blacklist filter / remove words from whitelist filter
   * @param {...string} word - Word(s) to add to blacklist
   */
            addWords() {
                let words = Array.from(arguments);

                this.list.push(...words);

                words
                    .map(word => word.toLowerCase())
                    .forEach((word) => {
                    if (this.exclude.includes(word)) {
                        this.exclude.splice(this.exclude.indexOf(word), 1);
                    }
                });
            }

            /**
   * Add words to whitelist filter
   * @param {...string} word - Word(s) to add to whitelist.
   */
            removeWords() {
                this.exclude.push(...Array.from(arguments).map(word => word.toLowerCase()));
            }
        }

        module.exports = Filter;

        /***/ }),

    /***/ "./node_modules/bad-words/lib/lang.json":
    /*!**********************************************!*\
  !*** ./node_modules/bad-words/lib/lang.json ***!
  \**********************************************/
    /*! exports provided: words, default */
    /***/ (function(module) {

        module.exports = {"words":["ahole","anus","ash0le","ash0les","asholes","ass","Ass Monkey","Assface","assh0le","assh0lez","asshole","assholes","assholz","asswipe","azzhole","bassterds","bastard","bastards","bastardz","basterds","basterdz","Biatch","bitch","bitches","Blow Job","boffing","butthole","buttwipe","c0ck","c0cks","c0k","Carpet Muncher","cawk","cawks","Clit","cnts","cntz","cock","cockhead","cock-head","cocks","CockSucker","cock-sucker","crap","cum","cunt","cunts","cuntz","dick","dild0","dild0s","dildo","dildos","dilld0","dilld0s","dominatricks","dominatrics","dominatrix","dyke","enema","f u c k","f u c k e r","fag","fag1t","faget","fagg1t","faggit","faggot","fagg0t","fagit","fags","fagz","faig","faigs","fart","flipping the bird","fuck","fucker","fuckin","fucking","fucks","Fudge Packer","fuk","Fukah","Fuken","fuker","Fukin","Fukk","Fukkah","Fukken","Fukker","Fukkin","g00k","God-damned","h00r","h0ar","h0re","hells","hoar","hoor","hoore","jackoff","jap","japs","jerk-off","jisim","jiss","jizm","jizz","knob","knobs","knobz","kunt","kunts","kuntz","Lezzian","Lipshits","Lipshitz","masochist","masokist","massterbait","masstrbait","masstrbate","masterbaiter","masterbate","masterbates","Motha Fucker","Motha Fuker","Motha Fukkah","Motha Fukker","Mother Fucker","Mother Fukah","Mother Fuker","Mother Fukkah","Mother Fukker","mother-fucker","Mutha Fucker","Mutha Fukah","Mutha Fuker","Mutha Fukkah","Mutha Fukker","n1gr","nastt","nigger;","nigur;","niiger;","niigr;","orafis","orgasim;","orgasm","orgasum","oriface","orifice","orifiss","packi","packie","packy","paki","pakie","paky","pecker","peeenus","peeenusss","peenus","peinus","pen1s","penas","penis","penis-breath","penus","penuus","Phuc","Phuck","Phuk","Phuker","Phukker","polac","polack","polak","Poonani","pr1c","pr1ck","pr1k","pusse","pussee","pussy","puuke","puuker","queer","queers","queerz","qweers","qweerz","qweir","recktum","rectum","retard","sadist","scank","schlong","screwing","semen","sex","sexy","Sh!t","sh1t","sh1ter","sh1ts","sh1tter","sh1tz","shit","shits","shitter","Shitty","Shity","shitz","Shyt","Shyte","Shytty","Shyty","skanck","skank","skankee","skankey","skanks","Skanky","slag","slut","sluts","Slutty","slutz","son-of-a-bitch","tit","turd","va1jina","vag1na","vagiina","vagina","vaj1na","vajina","vullva","vulva","w0p","wh00r","wh0re","whore","xrated","xxx","b!+ch","bitch","blowjob","clit","arschloch","fuck","shit","ass","asshole","b!tch","b17ch","b1tch","bastard","bi+ch","boiolas","buceta","c0ck","cawk","chink","cipa","clits","cock","cum","cunt","dildo","dirsa","ejakulate","fatass","fcuk","fuk","fux0r","hoer","hore","jism","kawk","l3itch","l3i+ch","lesbian","masturbate","masterbat*","masterbat3","motherfucker","s.o.b.","mofo","nazi","nigga","nigger","nutsack","phuck","pimpis","pusse","pussy","scrotum","sh!t","shemale","shi+","sh!+","slut","smut","teets","tits","boobs","b00bs","teez","testical","testicle","titt","w00se","jackoff","wank","whoar","whore","*damn","*dyke","*fuck*","*shit*","@$$","amcik","andskota","arse*","assrammer","ayir","bi7ch","bitch*","bollock*","breasts","butt-pirate","cabron","cazzo","chraa","chuj","Cock*","cunt*","d4mn","daygo","dego","dick*","dike*","dupa","dziwka","ejackulate","Ekrem*","Ekto","enculer","faen","fag*","fanculo","fanny","feces","feg","Felcher","ficken","fitt*","Flikker","foreskin","Fotze","Fu(*","fuk*","futkretzn","gook","guiena","h0r","h4x0r","hell","helvete","hoer*","honkey","Huevon","hui","injun","jizz","kanker*","kike","klootzak","kraut","knulle","kuk","kuksuger","Kurac","kurwa","kusi*","kyrpa*","lesbo","mamhoon","masturbat*","merd*","mibun","monkleigh","mouliewop","muie","mulkku","muschi","nazis","nepesaurio","nigger*","orospu","paska*","perse","picka","pierdol*","pillu*","pimmel","piss*","pizda","poontsee","poop","porn","p0rn","pr0n","preteen","pula","pule","puta","puto","qahbeh","queef*","rautenberg","schaffer","scheiss*","schlampe","schmuck","screw","sh!t*","sharmuta","sharmute","shipal","shiz","skribz","skurwysyn","sphencter","spic","spierdalaj","splooge","suka","b00b*","testicle*","titt*","twat","vittu","wank*","wetback*","wichser","wop*","yed","zabourah"]};

        /***/ }),

    /***/ "./node_modules/badwords-list/lib/array.js":
    /*!*************************************************!*\
  !*** ./node_modules/badwords-list/lib/array.js ***!
  \*************************************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        module.exports = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"];

        /***/ }),

    /***/ "./node_modules/badwords-list/lib/index.js":
    /*!*************************************************!*\
  !*** ./node_modules/badwords-list/lib/index.js ***!
  \*************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        module.exports = {
            object: __webpack_require__(/*! ./object */ "./node_modules/badwords-list/lib/object.js"),
            array: __webpack_require__(/*! ./array */ "./node_modules/badwords-list/lib/array.js"),
            regex: __webpack_require__(/*! ./regexp */ "./node_modules/badwords-list/lib/regexp.js")
        };

        /***/ }),

    /***/ "./node_modules/badwords-list/lib/object.js":
    /*!**************************************************!*\
  !*** ./node_modules/badwords-list/lib/object.js ***!
  \**************************************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        module.exports = {"4r5e": 1, "5h1t": 1, "5hit": 1, "a55": 1, "anal": 1, "anus": 1, "ar5e": 1, "arrse": 1, "arse": 1, "ass": 1, "ass-fucker": 1, "asses": 1, "assfucker": 1, "assfukka": 1, "asshole": 1, "assholes": 1, "asswhole": 1, "a_s_s": 1, "b!tch": 1, "b00bs": 1, "b17ch": 1, "b1tch": 1, "ballbag": 1, "balls": 1, "ballsack": 1, "bastard": 1, "beastial": 1, "beastiality": 1, "bellend": 1, "bestial": 1, "bestiality": 1, "bi+ch": 1, "biatch": 1, "bitch": 1, "bitcher": 1, "bitchers": 1, "bitches": 1, "bitchin": 1, "bitching": 1, "bloody": 1, "blow job": 1, "blowjob": 1, "blowjobs": 1, "boiolas": 1, "bollock": 1, "bollok": 1, "boner": 1, "boob": 1, "boobs": 1, "booobs": 1, "boooobs": 1, "booooobs": 1, "booooooobs": 1, "breasts": 1, "buceta": 1, "bugger": 1, "bum": 1, "bunny fucker": 1, "butt": 1, "butthole": 1, "buttmuch": 1, "buttplug": 1, "c0ck": 1, "c0cksucker": 1, "carpet muncher": 1, "cawk": 1, "chink": 1, "cipa": 1, "cl1t": 1, "clit": 1, "clitoris": 1, "clits": 1, "cnut": 1, "cock": 1, "cock-sucker": 1, "cockface": 1, "cockhead": 1, "cockmunch": 1, "cockmuncher": 1, "cocks": 1, "cocksuck": 1, "cocksucked": 1, "cocksucker": 1, "cocksucking": 1, "cocksucks": 1, "cocksuka": 1, "cocksukka": 1, "cok": 1, "cokmuncher": 1, "coksucka": 1, "coon": 1, "cox": 1, "crap": 1, "cum": 1, "cummer": 1, "cumming": 1, "cums": 1, "cumshot": 1, "cunilingus": 1, "cunillingus": 1, "cunnilingus": 1, "cunt": 1, "cuntlick": 1, "cuntlicker": 1, "cuntlicking": 1, "cunts": 1, "cyalis": 1, "cyberfuc": 1, "cyberfuck": 1, "cyberfucked": 1, "cyberfucker": 1, "cyberfuckers": 1, "cyberfucking": 1, "d1ck": 1, "damn": 1, "dick": 1, "dickhead": 1, "dildo": 1, "dildos": 1, "dink": 1, "dinks": 1, "dirsa": 1, "dlck": 1, "dog-fucker": 1, "doggin": 1, "dogging": 1, "donkeyribber": 1, "doosh": 1, "duche": 1, "dyke": 1, "ejaculate": 1, "ejaculated": 1, "ejaculates": 1, "ejaculating": 1, "ejaculatings": 1, "ejaculation": 1, "ejakulate": 1, "f u c k": 1, "f u c k e r": 1, "f4nny": 1, "fag": 1, "fagging": 1, "faggitt": 1, "faggot": 1, "faggs": 1, "fagot": 1, "fagots": 1, "fags": 1, "fanny": 1, "fannyflaps": 1, "fannyfucker": 1, "fanyy": 1, "fatass": 1, "fcuk": 1, "fcuker": 1, "fcuking": 1, "feck": 1, "fecker": 1, "felching": 1, "fellate": 1, "fellatio": 1, "fingerfuck": 1, "fingerfucked": 1, "fingerfucker": 1, "fingerfuckers": 1, "fingerfucking": 1, "fingerfucks": 1, "fistfuck": 1, "fistfucked": 1, "fistfucker": 1, "fistfuckers": 1, "fistfucking": 1, "fistfuckings": 1, "fistfucks": 1, "flange": 1, "fook": 1, "fooker": 1, "fuck": 1, "fucka": 1, "fucked": 1, "fucker": 1, "fuckers": 1, "fuckhead": 1, "fuckheads": 1, "fuckin": 1, "fucking": 1, "fuckings": 1, "fuckingshitmotherfucker": 1, "fuckme": 1, "fucks": 1, "fuckwhit": 1, "fuckwit": 1, "fudge packer": 1, "fudgepacker": 1, "fuk": 1, "fuker": 1, "fukker": 1, "fukkin": 1, "fuks": 1, "fukwhit": 1, "fukwit": 1, "fux": 1, "fux0r": 1, "f_u_c_k": 1, "gangbang": 1, "gangbanged": 1, "gangbangs": 1, "gaylord": 1, "gaysex": 1, "goatse": 1, "God": 1, "god-dam": 1, "god-damned": 1, "goddamn": 1, "goddamned": 1, "hardcoresex": 1, "hell": 1, "heshe": 1, "hoar": 1, "hoare": 1, "hoer": 1, "homo": 1, "hore": 1, "horniest": 1, "horny": 1, "hotsex": 1, "jack-off": 1, "jackoff": 1, "jap": 1, "jerk-off": 1, "jism": 1, "jiz": 1, "jizm": 1, "jizz": 1, "kawk": 1, "knob": 1, "knobead": 1, "knobed": 1, "knobend": 1, "knobhead": 1, "knobjocky": 1, "knobjokey": 1, "kock": 1, "kondum": 1, "kondums": 1, "kum": 1, "kummer": 1, "kumming": 1, "kums": 1, "kunilingus": 1, "l3i+ch": 1, "l3itch": 1, "labia": 1, "lust": 1, "lusting": 1, "m0f0": 1, "m0fo": 1, "m45terbate": 1, "ma5terb8": 1, "ma5terbate": 1, "masochist": 1, "master-bate": 1, "masterb8": 1, "masterbat*": 1, "masterbat3": 1, "masterbate": 1, "masterbation": 1, "masterbations": 1, "masturbate": 1, "mo-fo": 1, "mof0": 1, "mofo": 1, "mothafuck": 1, "mothafucka": 1, "mothafuckas": 1, "mothafuckaz": 1, "mothafucked": 1, "mothafucker": 1, "mothafuckers": 1, "mothafuckin": 1, "mothafucking": 1, "mothafuckings": 1, "mothafucks": 1, "mother fucker": 1, "motherfuck": 1, "motherfucked": 1, "motherfucker": 1, "motherfuckers": 1, "motherfuckin": 1, "motherfucking": 1, "motherfuckings": 1, "motherfuckka": 1, "motherfucks": 1, "muff": 1, "mutha": 1, "muthafecker": 1, "muthafuckker": 1, "muther": 1, "mutherfucker": 1, "n1gga": 1, "n1gger": 1, "nazi": 1, "nigg3r": 1, "nigg4h": 1, "nigga": 1, "niggah": 1, "niggas": 1, "niggaz": 1, "nigger": 1, "niggers": 1, "nob": 1, "nob jokey": 1, "nobhead": 1, "nobjocky": 1, "nobjokey": 1, "numbnuts": 1, "nutsack": 1, "orgasim": 1, "orgasims": 1, "orgasm": 1, "orgasms": 1, "p0rn": 1, "pawn": 1, "pecker": 1, "penis": 1, "penisfucker": 1, "phonesex": 1, "phuck": 1, "phuk": 1, "phuked": 1, "phuking": 1, "phukked": 1, "phukking": 1, "phuks": 1, "phuq": 1, "pigfucker": 1, "pimpis": 1, "piss": 1, "pissed": 1, "pisser": 1, "pissers": 1, "pisses": 1, "pissflaps": 1, "pissin": 1, "pissing": 1, "pissoff": 1, "poop": 1, "porn": 1, "porno": 1, "pornography": 1, "pornos": 1, "prick": 1, "pricks": 1, "pron": 1, "pube": 1, "pusse": 1, "pussi": 1, "pussies": 1, "pussy": 1, "pussys": 1, "rectum": 1, "retard": 1, "rimjaw": 1, "rimming": 1, "s hit": 1, "s.o.b.": 1, "sadist": 1, "schlong": 1, "screwing": 1, "scroat": 1, "scrote": 1, "scrotum": 1, "semen": 1, "sex": 1, "sh!+": 1, "sh!t": 1, "sh1t": 1, "shag": 1, "shagger": 1, "shaggin": 1, "shagging": 1, "shemale": 1, "shi+": 1, "shit": 1, "shitdick": 1, "shite": 1, "shited": 1, "shitey": 1, "shitfuck": 1, "shitfull": 1, "shithead": 1, "shiting": 1, "shitings": 1, "shits": 1, "shitted": 1, "shitter": 1, "shitters": 1, "shitting": 1, "shittings": 1, "shitty": 1, "skank": 1, "slut": 1, "sluts": 1, "smegma": 1, "smut": 1, "snatch": 1, "son-of-a-bitch": 1, "spac": 1, "spunk": 1, "s_h_i_t": 1, "t1tt1e5": 1, "t1tties": 1, "teets": 1, "teez": 1, "testical": 1, "testicle": 1, "tit": 1, "titfuck": 1, "tits": 1, "titt": 1, "tittie5": 1, "tittiefucker": 1, "titties": 1, "tittyfuck": 1, "tittywank": 1, "titwank": 1, "tosser": 1, "turd": 1, "tw4t": 1, "twat": 1, "twathead": 1, "twatty": 1, "twunt": 1, "twunter": 1, "v14gra": 1, "v1gra": 1, "vagina": 1, "viagra": 1, "vulva": 1, "w00se": 1, "wang": 1, "wank": 1, "wanker": 1, "wanky": 1, "whoar": 1, "whore": 1, "willies": 1, "willy": 1, "xrated": 1, "xxx": 1};

        /***/ }),

    /***/ "./node_modules/badwords-list/lib/regexp.js":
    /*!**************************************************!*\
  !*** ./node_modules/badwords-list/lib/regexp.js ***!
  \**************************************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        module.exports = /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi;

        /***/ }),

    /***/ "./node_modules/base64-js/index.js":
    /*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";


        exports.byteLength = byteLength
        exports.toByteArray = toByteArray
        exports.fromByteArray = fromByteArray

        var lookup = []
        var revLookup = []
        var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

        var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
        for (var i = 0, len = code.length; i < len; ++i) {
            lookup[i] = code[i]
            revLookup[code.charCodeAt(i)] = i
        }

        // Support decoding URL-safe base64 strings, as Node.js does.
        // See: https://en.wikipedia.org/wiki/Base64#URL_applications
        revLookup['-'.charCodeAt(0)] = 62
        revLookup['_'.charCodeAt(0)] = 63

        function getLens (b64) {
            var len = b64.length

            if (len % 4 > 0) {
                throw new Error('Invalid string. Length must be a multiple of 4')
            }

            // Trim off extra bytes after placeholder bytes are found
            // See: https://github.com/beatgammit/base64-js/issues/42
            var validLen = b64.indexOf('=')
            if (validLen === -1) validLen = len

            var placeHoldersLen = validLen === len
            ? 0
            : 4 - (validLen % 4)

            return [validLen, placeHoldersLen]
        }

        // base64 is 4/3 + up to two characters of the original data
        function byteLength (b64) {
            var lens = getLens(b64)
            var validLen = lens[0]
            var placeHoldersLen = lens[1]
            return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
        }

        function _byteLength (b64, validLen, placeHoldersLen) {
            return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
        }

        function toByteArray (b64) {
            var tmp
            var lens = getLens(b64)
            var validLen = lens[0]
            var placeHoldersLen = lens[1]

            var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

            var curByte = 0

            // if there are placeholders, only get up to the last complete 4 chars
            var len = placeHoldersLen > 0
            ? validLen - 4
            : validLen

            var i
            for (i = 0; i < len; i += 4) {
                tmp =
                    (revLookup[b64.charCodeAt(i)] << 18) |
                    (revLookup[b64.charCodeAt(i + 1)] << 12) |
                    (revLookup[b64.charCodeAt(i + 2)] << 6) |
                    revLookup[b64.charCodeAt(i + 3)]
                arr[curByte++] = (tmp >> 16) & 0xFF
                arr[curByte++] = (tmp >> 8) & 0xFF
                arr[curByte++] = tmp & 0xFF
            }

            if (placeHoldersLen === 2) {
                tmp =
                    (revLookup[b64.charCodeAt(i)] << 2) |
                    (revLookup[b64.charCodeAt(i + 1)] >> 4)
                arr[curByte++] = tmp & 0xFF
            }

            if (placeHoldersLen === 1) {
                tmp =
                    (revLookup[b64.charCodeAt(i)] << 10) |
                    (revLookup[b64.charCodeAt(i + 1)] << 4) |
                    (revLookup[b64.charCodeAt(i + 2)] >> 2)
                arr[curByte++] = (tmp >> 8) & 0xFF
                arr[curByte++] = tmp & 0xFF
            }

            return arr
        }

        function tripletToBase64 (num) {
            return lookup[num >> 18 & 0x3F] +
                lookup[num >> 12 & 0x3F] +
                lookup[num >> 6 & 0x3F] +
                lookup[num & 0x3F]
        }

        function encodeChunk (uint8, start, end) {
            var tmp
            var output = []
            for (var i = start; i < end; i += 3) {
                tmp =
                    ((uint8[i] << 16) & 0xFF0000) +
                    ((uint8[i + 1] << 8) & 0xFF00) +
                    (uint8[i + 2] & 0xFF)
                output.push(tripletToBase64(tmp))
            }
            return output.join('')
        }

        function fromByteArray (uint8) {
            var tmp
            var len = uint8.length
            var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
            var parts = []
            var maxChunkLength = 16383 // must be multiple of 3

            // go through the array every three bytes, we'll deal with trailing stuff later
            for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
                parts.push(encodeChunk(
                    uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
                ))
            }

            // pad the end with zeros, but make sure to not forget the extra bytes
            if (extraBytes === 1) {
                tmp = uint8[len - 1]
                parts.push(
                    lookup[tmp >> 2] +
                    lookup[(tmp << 4) & 0x3F] +
                    '=='
                )
            } else if (extraBytes === 2) {
                tmp = (uint8[len - 2] << 8) + uint8[len - 1]
                parts.push(
                    lookup[tmp >> 10] +
                    lookup[(tmp >> 4) & 0x3F] +
                    lookup[(tmp << 2) & 0x3F] +
                    '='
                )
            }

            return parts.join('')
        }


        /***/ }),

    /***/ "./node_modules/buffer/index.js":
    /*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";
        /* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
            /* eslint-disable no-proto */



            var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
            var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
            var isArray = __webpack_require__(/*! isarray */ "./node_modules/buffer/node_modules/isarray/index.js")

            exports.Buffer = Buffer
            exports.SlowBuffer = SlowBuffer
            exports.INSPECT_MAX_BYTES = 50

            /**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
            Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
                ? global.TYPED_ARRAY_SUPPORT
            : typedArraySupport()

            /*
 * Export kMaxLength after typed array support is determined.
 */
            exports.kMaxLength = kMaxLength()

            function typedArraySupport () {
                try {
                    var arr = new Uint8Array(1)
                    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
                    return arr.foo() === 42 && // typed array instances can be augmented
                        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
                        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
                } catch (e) {
                    return false
                }
            }

            function kMaxLength () {
                return Buffer.TYPED_ARRAY_SUPPORT
                    ? 0x7fffffff
                : 0x3fffffff
            }

            function createBuffer (that, length) {
                if (kMaxLength() < length) {
                    throw new RangeError('Invalid typed array length')
                }
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    // Return an augmented `Uint8Array` instance, for best performance
                    that = new Uint8Array(length)
                    that.__proto__ = Buffer.prototype
                } else {
                    // Fallback: Return an object instance of the Buffer class
                    if (that === null) {
                        that = new Buffer(length)
                    }
                    that.length = length
                }

                return that
            }

            /**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

            function Buffer (arg, encodingOrOffset, length) {
                if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
                    return new Buffer(arg, encodingOrOffset, length)
                }

                // Common case.
                if (typeof arg === 'number') {
                    if (typeof encodingOrOffset === 'string') {
                        throw new Error(
                            'If encoding is specified then the first argument must be a string'
                        )
                    }
                    return allocUnsafe(this, arg)
                }
                return from(this, arg, encodingOrOffset, length)
            }

            Buffer.poolSize = 8192 // not used by this implementation

            // TODO: Legacy, not needed anymore. Remove in next major version.
            Buffer._augment = function (arr) {
                arr.__proto__ = Buffer.prototype
                return arr
            }

            function from (that, value, encodingOrOffset, length) {
                if (typeof value === 'number') {
                    throw new TypeError('"value" argument must not be a number')
                }

                if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
                    return fromArrayBuffer(that, value, encodingOrOffset, length)
                }

                if (typeof value === 'string') {
                    return fromString(that, value, encodingOrOffset)
                }

                return fromObject(that, value)
            }

            /**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
            Buffer.from = function (value, encodingOrOffset, length) {
                return from(null, value, encodingOrOffset, length)
            }

            if (Buffer.TYPED_ARRAY_SUPPORT) {
                Buffer.prototype.__proto__ = Uint8Array.prototype
                Buffer.__proto__ = Uint8Array
                if (typeof Symbol !== 'undefined' && Symbol.species &&
                    Buffer[Symbol.species] === Buffer) {
                    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
                    Object.defineProperty(Buffer, Symbol.species, {
                        value: null,
                        configurable: true
                    })
                }
            }

            function assertSize (size) {
                if (typeof size !== 'number') {
                    throw new TypeError('"size" argument must be a number')
                } else if (size < 0) {
                    throw new RangeError('"size" argument must not be negative')
                }
            }

            function alloc (that, size, fill, encoding) {
                assertSize(size)
                if (size <= 0) {
                    return createBuffer(that, size)
                }
                if (fill !== undefined) {
                    // Only pay attention to encoding if it's a string. This
                    // prevents accidentally sending in a number that would
                    // be interpretted as a start offset.
                    return typeof encoding === 'string'
                        ? createBuffer(that, size).fill(fill, encoding)
                    : createBuffer(that, size).fill(fill)
                }
                return createBuffer(that, size)
            }

            /**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
            Buffer.alloc = function (size, fill, encoding) {
                return alloc(null, size, fill, encoding)
            }

            function allocUnsafe (that, size) {
                assertSize(size)
                that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
                if (!Buffer.TYPED_ARRAY_SUPPORT) {
                    for (var i = 0; i < size; ++i) {
                        that[i] = 0
                    }
                }
                return that
            }

            /**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
            Buffer.allocUnsafe = function (size) {
                return allocUnsafe(null, size)
            }
            /**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
            Buffer.allocUnsafeSlow = function (size) {
                return allocUnsafe(null, size)
            }

            function fromString (that, string, encoding) {
                if (typeof encoding !== 'string' || encoding === '') {
                    encoding = 'utf8'
                }

                if (!Buffer.isEncoding(encoding)) {
                    throw new TypeError('"encoding" must be a valid string encoding')
                }

                var length = byteLength(string, encoding) | 0
                that = createBuffer(that, length)

                var actual = that.write(string, encoding)

                if (actual !== length) {
                    // Writing a hex string, for example, that contains invalid characters will
                    // cause everything after the first invalid character to be ignored. (e.g.
                    // 'abxxcd' will be treated as 'ab')
                    that = that.slice(0, actual)
                }

                return that
            }

            function fromArrayLike (that, array) {
                var length = array.length < 0 ? 0 : checked(array.length) | 0
                that = createBuffer(that, length)
                for (var i = 0; i < length; i += 1) {
                    that[i] = array[i] & 255
                }
                return that
            }

            function fromArrayBuffer (that, array, byteOffset, length) {
                array.byteLength // this throws if `array` is not a valid ArrayBuffer

                if (byteOffset < 0 || array.byteLength < byteOffset) {
                    throw new RangeError('\'offset\' is out of bounds')
                }

                if (array.byteLength < byteOffset + (length || 0)) {
                    throw new RangeError('\'length\' is out of bounds')
                }

                if (byteOffset === undefined && length === undefined) {
                    array = new Uint8Array(array)
                } else if (length === undefined) {
                    array = new Uint8Array(array, byteOffset)
                } else {
                    array = new Uint8Array(array, byteOffset, length)
                }

                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    // Return an augmented `Uint8Array` instance, for best performance
                    that = array
                    that.__proto__ = Buffer.prototype
                } else {
                    // Fallback: Return an object instance of the Buffer class
                    that = fromArrayLike(that, array)
                }
                return that
            }

            function fromObject (that, obj) {
                if (Buffer.isBuffer(obj)) {
                    var len = checked(obj.length) | 0
                    that = createBuffer(that, len)

                    if (that.length === 0) {
                        return that
                    }

                    obj.copy(that, 0, 0, len)
                    return that
                }

                if (obj) {
                    if ((typeof ArrayBuffer !== 'undefined' &&
                         obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
                        if (typeof obj.length !== 'number' || isnan(obj.length)) {
                            return createBuffer(that, 0)
                        }
                        return fromArrayLike(that, obj)
                    }

                    if (obj.type === 'Buffer' && isArray(obj.data)) {
                        return fromArrayLike(that, obj.data)
                    }
                }

                throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
            }

            function checked (length) {
                // Note: cannot use `length < kMaxLength()` here because that fails when
                // length is NaN (which is otherwise coerced to zero.)
                if (length >= kMaxLength()) {
                    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
                }
                return length | 0
            }

            function SlowBuffer (length) {
                if (+length != length) { // eslint-disable-line eqeqeq
                    length = 0
                }
                return Buffer.alloc(+length)
            }

            Buffer.isBuffer = function isBuffer (b) {
                return !!(b != null && b._isBuffer)
            }

            Buffer.compare = function compare (a, b) {
                if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
                    throw new TypeError('Arguments must be Buffers')
                }

                if (a === b) return 0

                var x = a.length
                var y = b.length

                for (var i = 0, len = Math.min(x, y); i < len; ++i) {
                    if (a[i] !== b[i]) {
                        x = a[i]
                        y = b[i]
                        break
                    }
                }

                if (x < y) return -1
                if (y < x) return 1
                return 0
            }

            Buffer.isEncoding = function isEncoding (encoding) {
                switch (String(encoding).toLowerCase()) {
                    case 'hex':
                    case 'utf8':
                    case 'utf-8':
                    case 'ascii':
                    case 'latin1':
                    case 'binary':
                    case 'base64':
                    case 'ucs2':
                    case 'ucs-2':
                    case 'utf16le':
                    case 'utf-16le':
                        return true
                    default:
                        return false
                }
            }

            Buffer.concat = function concat (list, length) {
                if (!isArray(list)) {
                    throw new TypeError('"list" argument must be an Array of Buffers')
                }

                if (list.length === 0) {
                    return Buffer.alloc(0)
                }

                var i
                if (length === undefined) {
                    length = 0
                    for (i = 0; i < list.length; ++i) {
                        length += list[i].length
                    }
                }

                var buffer = Buffer.allocUnsafe(length)
                var pos = 0
                for (i = 0; i < list.length; ++i) {
                    var buf = list[i]
                    if (!Buffer.isBuffer(buf)) {
                        throw new TypeError('"list" argument must be an Array of Buffers')
                    }
                    buf.copy(buffer, pos)
                    pos += buf.length
                }
                return buffer
            }

            function byteLength (string, encoding) {
                if (Buffer.isBuffer(string)) {
                    return string.length
                }
                if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
                    (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
                    return string.byteLength
                }
                if (typeof string !== 'string') {
                    string = '' + string
                }

                var len = string.length
                if (len === 0) return 0

                // Use a for loop to avoid recursion
                var loweredCase = false
                for (;;) {
                    switch (encoding) {
                        case 'ascii':
                        case 'latin1':
                        case 'binary':
                            return len
                        case 'utf8':
                        case 'utf-8':
                        case undefined:
                            return utf8ToBytes(string).length
                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                            return len * 2
                        case 'hex':
                            return len >>> 1
                        case 'base64':
                            return base64ToBytes(string).length
                        default:
                            if (loweredCase) return utf8ToBytes(string).length // assume utf8
                            encoding = ('' + encoding).toLowerCase()
                            loweredCase = true
                    }
                }
            }
            Buffer.byteLength = byteLength

            function slowToString (encoding, start, end) {
                var loweredCase = false

                // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
                // property of a typed array.

                // This behaves neither like String nor Uint8Array in that we set start/end
                // to their upper/lower bounds if the value passed is out of range.
                // undefined is handled specially as per ECMA-262 6th Edition,
                // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
                if (start === undefined || start < 0) {
                    start = 0
                }
                // Return early if start > this.length. Done here to prevent potential uint32
                // coercion fail below.
                if (start > this.length) {
                    return ''
                }

                if (end === undefined || end > this.length) {
                    end = this.length
                }

                if (end <= 0) {
                    return ''
                }

                // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
                end >>>= 0
                start >>>= 0

                if (end <= start) {
                    return ''
                }

                if (!encoding) encoding = 'utf8'

                while (true) {
                    switch (encoding) {
                        case 'hex':
                            return hexSlice(this, start, end)

                        case 'utf8':
                        case 'utf-8':
                            return utf8Slice(this, start, end)

                        case 'ascii':
                            return asciiSlice(this, start, end)

                        case 'latin1':
                        case 'binary':
                            return latin1Slice(this, start, end)

                        case 'base64':
                            return base64Slice(this, start, end)

                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                            return utf16leSlice(this, start, end)

                        default:
                            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                            encoding = (encoding + '').toLowerCase()
                            loweredCase = true
                    }
                }
            }

            // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
            // Buffer instances.
            Buffer.prototype._isBuffer = true

            function swap (b, n, m) {
                var i = b[n]
                b[n] = b[m]
                b[m] = i
            }

            Buffer.prototype.swap16 = function swap16 () {
                var len = this.length
                if (len % 2 !== 0) {
                    throw new RangeError('Buffer size must be a multiple of 16-bits')
                }
                for (var i = 0; i < len; i += 2) {
                    swap(this, i, i + 1)
                }
                return this
            }

            Buffer.prototype.swap32 = function swap32 () {
                var len = this.length
                if (len % 4 !== 0) {
                    throw new RangeError('Buffer size must be a multiple of 32-bits')
                }
                for (var i = 0; i < len; i += 4) {
                    swap(this, i, i + 3)
                    swap(this, i + 1, i + 2)
                }
                return this
            }

            Buffer.prototype.swap64 = function swap64 () {
                var len = this.length
                if (len % 8 !== 0) {
                    throw new RangeError('Buffer size must be a multiple of 64-bits')
                }
                for (var i = 0; i < len; i += 8) {
                    swap(this, i, i + 7)
                    swap(this, i + 1, i + 6)
                    swap(this, i + 2, i + 5)
                    swap(this, i + 3, i + 4)
                }
                return this
            }

            Buffer.prototype.toString = function toString () {
                var length = this.length | 0
                if (length === 0) return ''
                if (arguments.length === 0) return utf8Slice(this, 0, length)
                return slowToString.apply(this, arguments)
            }

            Buffer.prototype.equals = function equals (b) {
                if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
                if (this === b) return true
                return Buffer.compare(this, b) === 0
            }

            Buffer.prototype.inspect = function inspect () {
                var str = ''
                var max = exports.INSPECT_MAX_BYTES
                if (this.length > 0) {
                    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
                    if (this.length > max) str += ' ... '
                }
                return '<Buffer ' + str + '>'
            }

            Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
                if (!Buffer.isBuffer(target)) {
                    throw new TypeError('Argument must be a Buffer')
                }

                if (start === undefined) {
                    start = 0
                }
                if (end === undefined) {
                    end = target ? target.length : 0
                }
                if (thisStart === undefined) {
                    thisStart = 0
                }
                if (thisEnd === undefined) {
                    thisEnd = this.length
                }

                if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
                    throw new RangeError('out of range index')
                }

                if (thisStart >= thisEnd && start >= end) {
                    return 0
                }
                if (thisStart >= thisEnd) {
                    return -1
                }
                if (start >= end) {
                    return 1
                }

                start >>>= 0
                end >>>= 0
                thisStart >>>= 0
                thisEnd >>>= 0

                if (this === target) return 0

                var x = thisEnd - thisStart
                var y = end - start
                var len = Math.min(x, y)

                var thisCopy = this.slice(thisStart, thisEnd)
                var targetCopy = target.slice(start, end)

                for (var i = 0; i < len; ++i) {
                    if (thisCopy[i] !== targetCopy[i]) {
                        x = thisCopy[i]
                        y = targetCopy[i]
                        break
                    }
                }

                if (x < y) return -1
                if (y < x) return 1
                return 0
            }

            // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
            // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
            //
            // Arguments:
            // - buffer - a Buffer to search
            // - val - a string, Buffer, or number
            // - byteOffset - an index into `buffer`; will be clamped to an int32
            // - encoding - an optional encoding, relevant is val is a string
            // - dir - true for indexOf, false for lastIndexOf
            function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
                // Empty buffer means no match
                if (buffer.length === 0) return -1

                // Normalize byteOffset
                if (typeof byteOffset === 'string') {
                    encoding = byteOffset
                    byteOffset = 0
                } else if (byteOffset > 0x7fffffff) {
                    byteOffset = 0x7fffffff
                } else if (byteOffset < -0x80000000) {
                    byteOffset = -0x80000000
                }
                byteOffset = +byteOffset  // Coerce to Number.
                if (isNaN(byteOffset)) {
                    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
                    byteOffset = dir ? 0 : (buffer.length - 1)
                }

                // Normalize byteOffset: negative offsets start from the end of the buffer
                if (byteOffset < 0) byteOffset = buffer.length + byteOffset
                if (byteOffset >= buffer.length) {
                    if (dir) return -1
                    else byteOffset = buffer.length - 1
                } else if (byteOffset < 0) {
                    if (dir) byteOffset = 0
                    else return -1
                }

                // Normalize val
                if (typeof val === 'string') {
                    val = Buffer.from(val, encoding)
                }

                // Finally, search either indexOf (if dir is true) or lastIndexOf
                if (Buffer.isBuffer(val)) {
                    // Special case: looking for empty string/buffer always fails
                    if (val.length === 0) {
                        return -1
                    }
                    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
                } else if (typeof val === 'number') {
                    val = val & 0xFF // Search for a byte value [0-255]
                    if (Buffer.TYPED_ARRAY_SUPPORT &&
                        typeof Uint8Array.prototype.indexOf === 'function') {
                        if (dir) {
                            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
                        } else {
                            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
                        }
                    }
                    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
                }

                throw new TypeError('val must be string, number or Buffer')
            }

            function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
                var indexSize = 1
                var arrLength = arr.length
                var valLength = val.length

                if (encoding !== undefined) {
                    encoding = String(encoding).toLowerCase()
                    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
                        encoding === 'utf16le' || encoding === 'utf-16le') {
                        if (arr.length < 2 || val.length < 2) {
                            return -1
                        }
                        indexSize = 2
                        arrLength /= 2
                        valLength /= 2
                        byteOffset /= 2
                    }
                }

                function read (buf, i) {
                    if (indexSize === 1) {
                        return buf[i]
                    } else {
                        return buf.readUInt16BE(i * indexSize)
                    }
                }

                var i
                if (dir) {
                    var foundIndex = -1
                    for (i = byteOffset; i < arrLength; i++) {
                        if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                            if (foundIndex === -1) foundIndex = i
                            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
                        } else {
                            if (foundIndex !== -1) i -= i - foundIndex
                            foundIndex = -1
                        }
                    }
                } else {
                    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
                    for (i = byteOffset; i >= 0; i--) {
                        var found = true
                        for (var j = 0; j < valLength; j++) {
                            if (read(arr, i + j) !== read(val, j)) {
                                found = false
                                break
                            }
                        }
                        if (found) return i
                    }
                }

                return -1
            }

            Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
                return this.indexOf(val, byteOffset, encoding) !== -1
            }

            Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
                return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
            }

            Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
                return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
            }

            function hexWrite (buf, string, offset, length) {
                offset = Number(offset) || 0
                var remaining = buf.length - offset
                if (!length) {
                    length = remaining
                } else {
                    length = Number(length)
                    if (length > remaining) {
                        length = remaining
                    }
                }

                // must be an even number of digits
                var strLen = string.length
                if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

                if (length > strLen / 2) {
                    length = strLen / 2
                }
                for (var i = 0; i < length; ++i) {
                    var parsed = parseInt(string.substr(i * 2, 2), 16)
                    if (isNaN(parsed)) return i
                    buf[offset + i] = parsed
                }
                return i
            }

            function utf8Write (buf, string, offset, length) {
                return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
            }

            function asciiWrite (buf, string, offset, length) {
                return blitBuffer(asciiToBytes(string), buf, offset, length)
            }

            function latin1Write (buf, string, offset, length) {
                return asciiWrite(buf, string, offset, length)
            }

            function base64Write (buf, string, offset, length) {
                return blitBuffer(base64ToBytes(string), buf, offset, length)
            }

            function ucs2Write (buf, string, offset, length) {
                return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
            }

            Buffer.prototype.write = function write (string, offset, length, encoding) {
                // Buffer#write(string)
                if (offset === undefined) {
                    encoding = 'utf8'
                    length = this.length
                    offset = 0
                    // Buffer#write(string, encoding)
                } else if (length === undefined && typeof offset === 'string') {
                    encoding = offset
                    length = this.length
                    offset = 0
                    // Buffer#write(string, offset[, length][, encoding])
                } else if (isFinite(offset)) {
                    offset = offset | 0
                    if (isFinite(length)) {
                        length = length | 0
                        if (encoding === undefined) encoding = 'utf8'
                    } else {
                        encoding = length
                        length = undefined
                    }
                    // legacy write(string, encoding, offset, length) - remove in v0.13
                } else {
                    throw new Error(
                        'Buffer.write(string, encoding, offset[, length]) is no longer supported'
                    )
                }

                var remaining = this.length - offset
                if (length === undefined || length > remaining) length = remaining

                if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
                    throw new RangeError('Attempt to write outside buffer bounds')
                }

                if (!encoding) encoding = 'utf8'

                var loweredCase = false
                for (;;) {
                    switch (encoding) {
                        case 'hex':
                            return hexWrite(this, string, offset, length)

                        case 'utf8':
                        case 'utf-8':
                            return utf8Write(this, string, offset, length)

                        case 'ascii':
                            return asciiWrite(this, string, offset, length)

                        case 'latin1':
                        case 'binary':
                            return latin1Write(this, string, offset, length)

                        case 'base64':
                            // Warning: maxLength not taken into account in base64Write
                            return base64Write(this, string, offset, length)

                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                            return ucs2Write(this, string, offset, length)

                        default:
                            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                            encoding = ('' + encoding).toLowerCase()
                            loweredCase = true
                    }
                }
            }

            Buffer.prototype.toJSON = function toJSON () {
                return {
                    type: 'Buffer',
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            }

            function base64Slice (buf, start, end) {
                if (start === 0 && end === buf.length) {
                    return base64.fromByteArray(buf)
                } else {
                    return base64.fromByteArray(buf.slice(start, end))
                }
            }

            function utf8Slice (buf, start, end) {
                end = Math.min(buf.length, end)
                var res = []

                var i = start
                while (i < end) {
                    var firstByte = buf[i]
                    var codePoint = null
                    var bytesPerSequence = (firstByte > 0xEF) ? 4
                    : (firstByte > 0xDF) ? 3
                    : (firstByte > 0xBF) ? 2
                    : 1

                    if (i + bytesPerSequence <= end) {
                        var secondByte, thirdByte, fourthByte, tempCodePoint

                        switch (bytesPerSequence) {
                            case 1:
                                if (firstByte < 0x80) {
                                    codePoint = firstByte
                                }
                                break
                            case 2:
                                secondByte = buf[i + 1]
                                if ((secondByte & 0xC0) === 0x80) {
                                    tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
                                    if (tempCodePoint > 0x7F) {
                                        codePoint = tempCodePoint
                                    }
                                }
                                break
                            case 3:
                                secondByte = buf[i + 1]
                                thirdByte = buf[i + 2]
                                if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                                    tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
                                    if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                                        codePoint = tempCodePoint
                                    }
                                }
                                break
                            case 4:
                                secondByte = buf[i + 1]
                                thirdByte = buf[i + 2]
                                fourthByte = buf[i + 3]
                                if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                                    tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
                                    if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                                        codePoint = tempCodePoint
                                    }
                                }
                        }
                    }

                    if (codePoint === null) {
                        // we did not generate a valid codePoint so insert a
                        // replacement char (U+FFFD) and advance only 1 byte
                        codePoint = 0xFFFD
                        bytesPerSequence = 1
                    } else if (codePoint > 0xFFFF) {
                        // encode to utf16 (surrogate pair dance)
                        codePoint -= 0x10000
                        res.push(codePoint >>> 10 & 0x3FF | 0xD800)
                        codePoint = 0xDC00 | codePoint & 0x3FF
                    }

                    res.push(codePoint)
                    i += bytesPerSequence
                }

                return decodeCodePointsArray(res)
            }

            // Based on http://stackoverflow.com/a/22747272/680742, the browser with
            // the lowest limit is Chrome, with 0x10000 args.
            // We go 1 magnitude less, for safety
            var MAX_ARGUMENTS_LENGTH = 0x1000

            function decodeCodePointsArray (codePoints) {
                var len = codePoints.length
                if (len <= MAX_ARGUMENTS_LENGTH) {
                    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
                }

                // Decode in chunks to avoid "call stack size exceeded".
                var res = ''
                var i = 0
                while (i < len) {
                    res += String.fromCharCode.apply(
                        String,
                        codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
                    )
                }
                return res
            }

            function asciiSlice (buf, start, end) {
                var ret = ''
                end = Math.min(buf.length, end)

                for (var i = start; i < end; ++i) {
                    ret += String.fromCharCode(buf[i] & 0x7F)
                }
                return ret
            }

            function latin1Slice (buf, start, end) {
                var ret = ''
                end = Math.min(buf.length, end)

                for (var i = start; i < end; ++i) {
                    ret += String.fromCharCode(buf[i])
                }
                return ret
            }

            function hexSlice (buf, start, end) {
                var len = buf.length

                if (!start || start < 0) start = 0
                if (!end || end < 0 || end > len) end = len

                var out = ''
                for (var i = start; i < end; ++i) {
                    out += toHex(buf[i])
                }
                return out
            }

            function utf16leSlice (buf, start, end) {
                var bytes = buf.slice(start, end)
                var res = ''
                for (var i = 0; i < bytes.length; i += 2) {
                    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
                }
                return res
            }

            Buffer.prototype.slice = function slice (start, end) {
                var len = this.length
                start = ~~start
                end = end === undefined ? len : ~~end

                if (start < 0) {
                    start += len
                    if (start < 0) start = 0
                } else if (start > len) {
                    start = len
                }

                if (end < 0) {
                    end += len
                    if (end < 0) end = 0
                } else if (end > len) {
                    end = len
                }

                if (end < start) end = start

                var newBuf
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    newBuf = this.subarray(start, end)
                    newBuf.__proto__ = Buffer.prototype
                } else {
                    var sliceLen = end - start
                    newBuf = new Buffer(sliceLen, undefined)
                    for (var i = 0; i < sliceLen; ++i) {
                        newBuf[i] = this[i + start]
                    }
                }

                return newBuf
            }

            /*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
            function checkOffset (offset, ext, length) {
                if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
                if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
            }

            Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
                offset = offset | 0
                byteLength = byteLength | 0
                if (!noAssert) checkOffset(offset, byteLength, this.length)

                var val = this[offset]
                var mul = 1
                var i = 0
                while (++i < byteLength && (mul *= 0x100)) {
                    val += this[offset + i] * mul
                }

                return val
            }

            Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
                offset = offset | 0
                byteLength = byteLength | 0
                if (!noAssert) {
                    checkOffset(offset, byteLength, this.length)
                }

                var val = this[offset + --byteLength]
                var mul = 1
                while (byteLength > 0 && (mul *= 0x100)) {
                    val += this[offset + --byteLength] * mul
                }

                return val
            }

            Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
                if (!noAssert) checkOffset(offset, 1, this.length)
                return this[offset]
            }

            Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
                if (!noAssert) checkOffset(offset, 2, this.length)
                return this[offset] | (this[offset + 1] << 8)
            }

            Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
                if (!noAssert) checkOffset(offset, 2, this.length)
                return (this[offset] << 8) | this[offset + 1]
            }

            Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length)

                return ((this[offset]) |
                        (this[offset + 1] << 8) |
                        (this[offset + 2] << 16)) +
                    (this[offset + 3] * 0x1000000)
            }

            Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length)

                return (this[offset] * 0x1000000) +
                    ((this[offset + 1] << 16) |
                     (this[offset + 2] << 8) |
                     this[offset + 3])
            }

            Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
                offset = offset | 0
                byteLength = byteLength | 0
                if (!noAssert) checkOffset(offset, byteLength, this.length)

                var val = this[offset]
                var mul = 1
                var i = 0
                while (++i < byteLength && (mul *= 0x100)) {
                    val += this[offset + i] * mul
                }
                mul *= 0x80

                if (val >= mul) val -= Math.pow(2, 8 * byteLength)

                return val
            }

            Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
                offset = offset | 0
                byteLength = byteLength | 0
                if (!noAssert) checkOffset(offset, byteLength, this.length)

                var i = byteLength
                var mul = 1
                var val = this[offset + --i]
                while (i > 0 && (mul *= 0x100)) {
                    val += this[offset + --i] * mul
                }
                mul *= 0x80

                if (val >= mul) val -= Math.pow(2, 8 * byteLength)

                return val
            }

            Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
                if (!noAssert) checkOffset(offset, 1, this.length)
                if (!(this[offset] & 0x80)) return (this[offset])
                return ((0xff - this[offset] + 1) * -1)
            }

            Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
                if (!noAssert) checkOffset(offset, 2, this.length)
                var val = this[offset] | (this[offset + 1] << 8)
                return (val & 0x8000) ? val | 0xFFFF0000 : val
            }

            Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
                if (!noAssert) checkOffset(offset, 2, this.length)
                var val = this[offset + 1] | (this[offset] << 8)
                return (val & 0x8000) ? val | 0xFFFF0000 : val
            }

            Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length)

                return (this[offset]) |
                    (this[offset + 1] << 8) |
                    (this[offset + 2] << 16) |
                    (this[offset + 3] << 24)
            }

            Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length)

                return (this[offset] << 24) |
                    (this[offset + 1] << 16) |
                    (this[offset + 2] << 8) |
                    (this[offset + 3])
            }

            Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length)
                return ieee754.read(this, offset, true, 23, 4)
            }

            Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length)
                return ieee754.read(this, offset, false, 23, 4)
            }

            Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
                if (!noAssert) checkOffset(offset, 8, this.length)
                return ieee754.read(this, offset, true, 52, 8)
            }

            Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
                if (!noAssert) checkOffset(offset, 8, this.length)
                return ieee754.read(this, offset, false, 52, 8)
            }

            function checkInt (buf, value, offset, ext, max, min) {
                if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
                if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
                if (offset + ext > buf.length) throw new RangeError('Index out of range')
            }

            Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
                value = +value
                offset = offset | 0
                byteLength = byteLength | 0
                if (!noAssert) {
                    var maxBytes = Math.pow(2, 8 * byteLength) - 1
                    checkInt(this, value, offset, byteLength, maxBytes, 0)
                }

                var mul = 1
                var i = 0
                this[offset] = value & 0xFF
                while (++i < byteLength && (mul *= 0x100)) {
                    this[offset + i] = (value / mul) & 0xFF
                }

                return offset + byteLength
            }

            Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
                value = +value
                offset = offset | 0
                byteLength = byteLength | 0
                if (!noAssert) {
                    var maxBytes = Math.pow(2, 8 * byteLength) - 1
                    checkInt(this, value, offset, byteLength, maxBytes, 0)
                }

                var i = byteLength - 1
                var mul = 1
                this[offset + i] = value & 0xFF
                while (--i >= 0 && (mul *= 0x100)) {
                    this[offset + i] = (value / mul) & 0xFF
                }

                return offset + byteLength
            }

            Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
                value = +value
                offset = offset | 0
                if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
                if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
                this[offset] = (value & 0xff)
                return offset + 1
            }

            function objectWriteUInt16 (buf, value, offset, littleEndian) {
                if (value < 0) value = 0xffff + value + 1
                for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
                    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
                        (littleEndian ? i : 1 - i) * 8
                }
            }

            Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
                value = +value
                offset = offset | 0
                if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    this[offset] = (value & 0xff)
                    this[offset + 1] = (value >>> 8)
                } else {
                    objectWriteUInt16(this, value, offset, true)
                }
                return offset + 2
            }

            Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
                value = +value
                offset = offset | 0
                if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    this[offset] = (value >>> 8)
                    this[offset + 1] = (value & 0xff)
                } else {
                    objectWriteUInt16(this, value, offset, false)
                }
                return offset + 2
            }

            function objectWriteUInt32 (buf, value, offset, littleEndian) {
                if (value < 0) value = 0xffffffff + value + 1
                for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
                    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
                }
            }

            Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
                value = +value
                offset = offset | 0
                if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    this[offset + 3] = (value >>> 24)
                    this[offset + 2] = (value >>> 16)
                    this[offset + 1] = (value >>> 8)
                    this[offset] = (value & 0xff)
                } else {
                    objectWriteUInt32(this, value, offset, true)
                }
                return offset + 4
            }

            Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
                value = +value
                offset = offset | 0
                if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    this[offset] = (value >>> 24)
                    this[offset + 1] = (value >>> 16)
                    this[offset + 2] = (value >>> 8)
                    this[offset + 3] = (value & 0xff)
                } else {
                    objectWriteUInt32(this, value, offset, false)
                }
                return offset + 4
            }

            Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
                value = +value
                offset = offset | 0
                if (!noAssert) {
                    var limit = Math.pow(2, 8 * byteLength - 1)

                    checkInt(this, value, offset, byteLength, limit - 1, -limit)
                }

                var i = 0
                var mul = 1
                var sub = 0
                this[offset] = value & 0xFF
                while (++i < byteLength && (mul *= 0x100)) {
                    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                        sub = 1
                    }
                    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
                }

                return offset + byteLength
            }

            Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
                value = +value
                offset = offset | 0
                if (!noAssert) {
                    var limit = Math.pow(2, 8 * byteLength - 1)

                    checkInt(this, value, offset, byteLength, limit - 1, -limit)
                }

                var i = byteLength - 1
                var mul = 1
                var sub = 0
                this[offset + i] = value & 0xFF
                while (--i >= 0 && (mul *= 0x100)) {
                    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                        sub = 1
                    }
                    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
                }

                return offset + byteLength
            }

            Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
                value = +value
                offset = offset | 0
                if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
                if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
                if (value < 0) value = 0xff + value + 1
                this[offset] = (value & 0xff)
                return offset + 1
            }

            Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
                value = +value
                offset = offset | 0
                if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    this[offset] = (value & 0xff)
                    this[offset + 1] = (value >>> 8)
                } else {
                    objectWriteUInt16(this, value, offset, true)
                }
                return offset + 2
            }

            Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
                value = +value
                offset = offset | 0
                if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    this[offset] = (value >>> 8)
                    this[offset + 1] = (value & 0xff)
                } else {
                    objectWriteUInt16(this, value, offset, false)
                }
                return offset + 2
            }

            Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
                value = +value
                offset = offset | 0
                if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    this[offset] = (value & 0xff)
                    this[offset + 1] = (value >>> 8)
                    this[offset + 2] = (value >>> 16)
                    this[offset + 3] = (value >>> 24)
                } else {
                    objectWriteUInt32(this, value, offset, true)
                }
                return offset + 4
            }

            Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
                value = +value
                offset = offset | 0
                if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
                if (value < 0) value = 0xffffffff + value + 1
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    this[offset] = (value >>> 24)
                    this[offset + 1] = (value >>> 16)
                    this[offset + 2] = (value >>> 8)
                    this[offset + 3] = (value & 0xff)
                } else {
                    objectWriteUInt32(this, value, offset, false)
                }
                return offset + 4
            }

            function checkIEEE754 (buf, value, offset, ext, max, min) {
                if (offset + ext > buf.length) throw new RangeError('Index out of range')
                if (offset < 0) throw new RangeError('Index out of range')
            }

            function writeFloat (buf, value, offset, littleEndian, noAssert) {
                if (!noAssert) {
                    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
                }
                ieee754.write(buf, value, offset, littleEndian, 23, 4)
                return offset + 4
            }

            Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
                return writeFloat(this, value, offset, true, noAssert)
            }

            Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
                return writeFloat(this, value, offset, false, noAssert)
            }

            function writeDouble (buf, value, offset, littleEndian, noAssert) {
                if (!noAssert) {
                    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
                }
                ieee754.write(buf, value, offset, littleEndian, 52, 8)
                return offset + 8
            }

            Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
                return writeDouble(this, value, offset, true, noAssert)
            }

            Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
                return writeDouble(this, value, offset, false, noAssert)
            }

            // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
            Buffer.prototype.copy = function copy (target, targetStart, start, end) {
                if (!start) start = 0
                if (!end && end !== 0) end = this.length
                if (targetStart >= target.length) targetStart = target.length
                if (!targetStart) targetStart = 0
                if (end > 0 && end < start) end = start

                // Copy 0 bytes; we're done
                if (end === start) return 0
                if (target.length === 0 || this.length === 0) return 0

                // Fatal error conditions
                if (targetStart < 0) {
                    throw new RangeError('targetStart out of bounds')
                }
                if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
                if (end < 0) throw new RangeError('sourceEnd out of bounds')

                // Are we oob?
                if (end > this.length) end = this.length
                if (target.length - targetStart < end - start) {
                    end = target.length - targetStart + start
                }

                var len = end - start
                var i

                if (this === target && start < targetStart && targetStart < end) {
                    // descending copy from end
                    for (i = len - 1; i >= 0; --i) {
                        target[i + targetStart] = this[i + start]
                    }
                } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
                    // ascending copy from start
                    for (i = 0; i < len; ++i) {
                        target[i + targetStart] = this[i + start]
                    }
                } else {
                    Uint8Array.prototype.set.call(
                        target,
                        this.subarray(start, start + len),
                        targetStart
                    )
                }

                return len
            }

            // Usage:
            //    buffer.fill(number[, offset[, end]])
            //    buffer.fill(buffer[, offset[, end]])
            //    buffer.fill(string[, offset[, end]][, encoding])
            Buffer.prototype.fill = function fill (val, start, end, encoding) {
                // Handle string cases:
                if (typeof val === 'string') {
                    if (typeof start === 'string') {
                        encoding = start
                        start = 0
                        end = this.length
                    } else if (typeof end === 'string') {
                        encoding = end
                        end = this.length
                    }
                    if (val.length === 1) {
                        var code = val.charCodeAt(0)
                        if (code < 256) {
                            val = code
                        }
                    }
                    if (encoding !== undefined && typeof encoding !== 'string') {
                        throw new TypeError('encoding must be a string')
                    }
                    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
                        throw new TypeError('Unknown encoding: ' + encoding)
                    }
                } else if (typeof val === 'number') {
                    val = val & 255
                }

                // Invalid ranges are not set to a default, so can range check early.
                if (start < 0 || this.length < start || this.length < end) {
                    throw new RangeError('Out of range index')
                }

                if (end <= start) {
                    return this
                }

                start = start >>> 0
                end = end === undefined ? this.length : end >>> 0

                if (!val) val = 0

                var i
                if (typeof val === 'number') {
                    for (i = start; i < end; ++i) {
                        this[i] = val
                    }
                } else {
                    var bytes = Buffer.isBuffer(val)
                    ? val
                    : utf8ToBytes(new Buffer(val, encoding).toString())
                    var len = bytes.length
                    for (i = 0; i < end - start; ++i) {
                        this[i + start] = bytes[i % len]
                    }
                }

                return this
            }

            // HELPER FUNCTIONS
            // ================

            var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

            function base64clean (str) {
                // Node strips out invalid characters like \n and \t from the string, base64-js does not
                str = stringtrim(str).replace(INVALID_BASE64_RE, '')
                // Node converts strings with length < 2 to ''
                if (str.length < 2) return ''
                // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
                while (str.length % 4 !== 0) {
                    str = str + '='
                }
                return str
            }

            function stringtrim (str) {
                if (str.trim) return str.trim()
                return str.replace(/^\s+|\s+$/g, '')
            }

            function toHex (n) {
                if (n < 16) return '0' + n.toString(16)
                return n.toString(16)
            }

            function utf8ToBytes (string, units) {
                units = units || Infinity
                var codePoint
                var length = string.length
                var leadSurrogate = null
                var bytes = []

                for (var i = 0; i < length; ++i) {
                    codePoint = string.charCodeAt(i)

                    // is surrogate component
                    if (codePoint > 0xD7FF && codePoint < 0xE000) {
                        // last char was a lead
                        if (!leadSurrogate) {
                            // no lead yet
                            if (codePoint > 0xDBFF) {
                                // unexpected trail
                                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                                continue
                            } else if (i + 1 === length) {
                                // unpaired lead
                                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                                continue
                            }

                            // valid lead
                            leadSurrogate = codePoint

                            continue
                        }

                        // 2 leads in a row
                        if (codePoint < 0xDC00) {
                            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                            leadSurrogate = codePoint
                            continue
                        }

                        // valid surrogate pair
                        codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
                    } else if (leadSurrogate) {
                        // valid bmp char, but last char was a lead
                        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                    }

                    leadSurrogate = null

                    // encode utf8
                    if (codePoint < 0x80) {
                        if ((units -= 1) < 0) break
                        bytes.push(codePoint)
                    } else if (codePoint < 0x800) {
                        if ((units -= 2) < 0) break
                        bytes.push(
                            codePoint >> 0x6 | 0xC0,
                            codePoint & 0x3F | 0x80
                        )
                    } else if (codePoint < 0x10000) {
                        if ((units -= 3) < 0) break
                        bytes.push(
                            codePoint >> 0xC | 0xE0,
                            codePoint >> 0x6 & 0x3F | 0x80,
                            codePoint & 0x3F | 0x80
                        )
                    } else if (codePoint < 0x110000) {
                        if ((units -= 4) < 0) break
                        bytes.push(
                            codePoint >> 0x12 | 0xF0,
                            codePoint >> 0xC & 0x3F | 0x80,
                            codePoint >> 0x6 & 0x3F | 0x80,
                            codePoint & 0x3F | 0x80
                        )
                    } else {
                        throw new Error('Invalid code point')
                    }
                }

                return bytes
            }

            function asciiToBytes (str) {
                var byteArray = []
                for (var i = 0; i < str.length; ++i) {
                    // Node's code seems to be doing this and not & 0x7F..
                    byteArray.push(str.charCodeAt(i) & 0xFF)
                }
                return byteArray
            }

            function utf16leToBytes (str, units) {
                var c, hi, lo
                var byteArray = []
                for (var i = 0; i < str.length; ++i) {
                    if ((units -= 2) < 0) break

                    c = str.charCodeAt(i)
                    hi = c >> 8
                    lo = c % 256
                    byteArray.push(lo)
                    byteArray.push(hi)
                }

                return byteArray
            }

            function base64ToBytes (str) {
                return base64.toByteArray(base64clean(str))
            }

            function blitBuffer (src, dst, offset, length) {
                for (var i = 0; i < length; ++i) {
                    if ((i + offset >= dst.length) || (i >= src.length)) break
                    dst[i + offset] = src[i]
                }
                return i
            }

            function isnan (val) {
                return val !== val // eslint-disable-line no-self-compare
            }

            /* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

        /***/ }),

    /***/ "./node_modules/buffer/node_modules/isarray/index.js":
    /*!***********************************************************!*\
  !*** ./node_modules/buffer/node_modules/isarray/index.js ***!
  \***********************************************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        var toString = {}.toString;

        module.exports = Array.isArray || function (arr) {
            return toString.call(arr) == '[object Array]';
        };


        /***/ }),

    /***/ "./node_modules/charenc/charenc.js":
    /*!*****************************************!*\
  !*** ./node_modules/charenc/charenc.js ***!
  \*****************************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        var charenc = {
            // UTF-8 encoding
            utf8: {
                // Convert a string to a byte array
                stringToBytes: function(str) {
                    return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
                },

                // Convert a byte array to a string
                bytesToString: function(bytes) {
                    return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
                }
            },

            // Binary encoding
            bin: {
                // Convert a string to a byte array
                stringToBytes: function(str) {
                    for (var bytes = [], i = 0; i < str.length; i++)
                        bytes.push(str.charCodeAt(i) & 0xFF);
                    return bytes;
                },

                // Convert a byte array to a string
                bytesToString: function(bytes) {
                    for (var str = [], i = 0; i < bytes.length; i++)
                        str.push(String.fromCharCode(bytes[i]));
                    return str.join('');
                }
            }
        };

        module.exports = charenc;


        /***/ }),

    /***/ "./node_modules/crypt/crypt.js":
    /*!*************************************!*\
  !*** ./node_modules/crypt/crypt.js ***!
  \*************************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        (function() {
            var base64map
            = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

                crypt = {
                    // Bit-wise rotation left
                    rotl: function(n, b) {
                        return (n << b) | (n >>> (32 - b));
                    },

                    // Bit-wise rotation right
                    rotr: function(n, b) {
                        return (n << (32 - b)) | (n >>> b);
                    },

                    // Swap big-endian to little-endian and vice versa
                    endian: function(n) {
                        // If number given, swap endian
                        if (n.constructor == Number) {
                            return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
                        }

                        // Else, assume array and swap all items
                        for (var i = 0; i < n.length; i++)
                            n[i] = crypt.endian(n[i]);
                        return n;
                    },

                    // Generate an array of any length of random bytes
                    randomBytes: function(n) {
                        for (var bytes = []; n > 0; n--)
                            bytes.push(Math.floor(Math.random() * 256));
                        return bytes;
                    },

                    // Convert a byte array to big-endian 32-bit words
                    bytesToWords: function(bytes) {
                        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
                            words[b >>> 5] |= bytes[i] << (24 - b % 32);
                        return words;
                    },

                    // Convert big-endian 32-bit words to a byte array
                    wordsToBytes: function(words) {
                        for (var bytes = [], b = 0; b < words.length * 32; b += 8)
                            bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
                        return bytes;
                    },

                    // Convert a byte array to a hex string
                    bytesToHex: function(bytes) {
                        for (var hex = [], i = 0; i < bytes.length; i++) {
                            hex.push((bytes[i] >>> 4).toString(16));
                            hex.push((bytes[i] & 0xF).toString(16));
                        }
                        return hex.join('');
                    },

                    // Convert a hex string to a byte array
                    hexToBytes: function(hex) {
                        for (var bytes = [], c = 0; c < hex.length; c += 2)
                            bytes.push(parseInt(hex.substr(c, 2), 16));
                        return bytes;
                    },

                    // Convert a byte array to a base-64 string
                    bytesToBase64: function(bytes) {
                        for (var base64 = [], i = 0; i < bytes.length; i += 3) {
                            var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
                            for (var j = 0; j < 4; j++)
                                if (i * 8 + j * 6 <= bytes.length * 8)
                                    base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
                                else
                                    base64.push('=');
                        }
                        return base64.join('');
                    },

                    // Convert a base-64 string to a byte array
                    base64ToBytes: function(base64) {
                        // Remove non-base-64 characters
                        base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

                        for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
                             imod4 = ++i % 4) {
                            if (imod4 == 0) continue;
                            bytes.push(((base64map.indexOf(base64.charAt(i - 1))
                                         & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
                                       | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
                        }
                        return bytes;
                    }
                };

            module.exports = crypt;
        })();


        /***/ }),

    /***/ "./node_modules/event-lite/event-lite.js":
    /*!***********************************************!*\
  !*** ./node_modules/event-lite/event-lite.js ***!
  \***********************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        /**
 * event-lite.js - Light-weight EventEmitter (less than 1KB when gzipped)
 *
 * @copyright Yusuke Kawasaki
 * @license MIT
 * @constructor
 * @see https://github.com/kawanet/event-lite
 * @see http://kawanet.github.io/event-lite/EventLite.html
 * @example
 * var EventLite = require("event-lite");
 *
 * function MyClass() {...}             // your class
 *
 * EventLite.mixin(MyClass.prototype);  // import event methods
 *
 * var obj = new MyClass();
 * obj.on("foo", function() {...});     // add event listener
 * obj.once("bar", function() {...});   // add one-time event listener
 * obj.emit("foo");                     // dispatch event
 * obj.emit("bar");                     // dispatch another event
 * obj.off("foo");                      // remove event listener
 */

        function EventLite() {
            if (!(this instanceof EventLite)) return new EventLite();
        }

        (function(EventLite) {
            // export the class for node.js
            if (true) module.exports = EventLite;

            // property name to hold listeners
            var LISTENERS = "listeners";

            // methods to export
            var methods = {
                on: on,
                once: once,
                off: off,
                emit: emit
            };

            // mixin to self
            mixin(EventLite.prototype);

            // export mixin function
            EventLite.mixin = mixin;

            /**
   * Import on(), once(), off() and emit() methods into target object.
   *
   * @function EventLite.mixin
   * @param target {Prototype}
   */

            function mixin(target) {
                for (var key in methods) {
                    target[key] = methods[key];
                }
                return target;
            }

            /**
   * Add an event listener.
   *
   * @function EventLite.prototype.on
   * @param type {string}
   * @param func {Function}
   * @returns {EventLite} Self for method chaining
   */

            function on(type, func) {
                getListeners(this, type).push(func);
                return this;
            }

            /**
   * Add one-time event listener.
   *
   * @function EventLite.prototype.once
   * @param type {string}
   * @param func {Function}
   * @returns {EventLite} Self for method chaining
   */

            function once(type, func) {
                var that = this;
                wrap.originalListener = func;
                getListeners(that, type).push(wrap);
                return that;

                function wrap() {
                    off.call(that, type, wrap);
                    func.apply(this, arguments);
                }
            }

            /**
   * Remove an event listener.
   *
   * @function EventLite.prototype.off
   * @param [type] {string}
   * @param [func] {Function}
   * @returns {EventLite} Self for method chaining
   */

            function off(type, func) {
                var that = this;
                var listners;
                if (!arguments.length) {
                    delete that[LISTENERS];
                } else if (!func) {
                    listners = that[LISTENERS];
                    if (listners) {
                        delete listners[type];
                        if (!Object.keys(listners).length) return off.call(that);
                    }
                } else {
                    listners = getListeners(that, type, true);
                    if (listners) {
                        listners = listners.filter(ne);
                        if (!listners.length) return off.call(that, type);
                        that[LISTENERS][type] = listners;
                    }
                }
                return that;

                function ne(test) {
                    return test !== func && test.originalListener !== func;
                }
            }

            /**
   * Dispatch (trigger) an event.
   *
   * @function EventLite.prototype.emit
   * @param type {string}
   * @param [value] {*}
   * @returns {boolean} True when a listener received the event
   */

            function emit(type, value) {
                var that = this;
                var listeners = getListeners(that, type, true);
                if (!listeners) return false;
                var arglen = arguments.length;
                if (arglen === 1) {
                    listeners.forEach(zeroarg);
                } else if (arglen === 2) {
                    listeners.forEach(onearg);
                } else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    listeners.forEach(moreargs);
                }
                return !!listeners.length;

                function zeroarg(func) {
                    func.call(that);
                }

                function onearg(func) {
                    func.call(that, value);
                }

                function moreargs(func) {
                    func.apply(that, args);
                }
            }

            /**
   * @ignore
   */

            function getListeners(that, type, readonly) {
                if (readonly && !that[LISTENERS]) return;
                var listeners = that[LISTENERS] || (that[LISTENERS] = {});
                return listeners[type] || (listeners[type] = []);
            }

        })(EventLite);


        /***/ }),

    /***/ "./node_modules/ieee754/index.js":
    /*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        exports.read = function (buffer, offset, isLE, mLen, nBytes) {
            var e, m
            var eLen = (nBytes * 8) - mLen - 1
            var eMax = (1 << eLen) - 1
            var eBias = eMax >> 1
            var nBits = -7
            var i = isLE ? (nBytes - 1) : 0
            var d = isLE ? -1 : 1
            var s = buffer[offset + i]

            i += d

            e = s & ((1 << (-nBits)) - 1)
            s >>= (-nBits)
            nBits += eLen
            for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

            m = e & ((1 << (-nBits)) - 1)
            e >>= (-nBits)
            nBits += mLen
            for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

            if (e === 0) {
                e = 1 - eBias
            } else if (e === eMax) {
                return m ? NaN : ((s ? -1 : 1) * Infinity)
            } else {
                m = m + Math.pow(2, mLen)
                e = e - eBias
            }
            return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
        }

        exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
            var e, m, c
            var eLen = (nBytes * 8) - mLen - 1
            var eMax = (1 << eLen) - 1
            var eBias = eMax >> 1
            var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
            var i = isLE ? 0 : (nBytes - 1)
            var d = isLE ? 1 : -1
            var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

            value = Math.abs(value)

            if (isNaN(value) || value === Infinity) {
                m = isNaN(value) ? 1 : 0
                e = eMax
            } else {
                e = Math.floor(Math.log(value) / Math.LN2)
                if (value * (c = Math.pow(2, -e)) < 1) {
                    e--
                    c *= 2
                }
                if (e + eBias >= 1) {
                    value += rt / c
                } else {
                    value += rt * Math.pow(2, 1 - eBias)
                }
                if (value * c >= 2) {
                    e++
                    c /= 2
                }

                if (e + eBias >= eMax) {
                    m = 0
                    e = eMax
                } else if (e + eBias >= 1) {
                    m = ((value * c) - 1) * Math.pow(2, mLen)
                    e = e + eBias
                } else {
                    m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
                    e = 0
                }
            }

            for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

            e = (e << mLen) | m
            eLen += mLen
            for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

            buffer[offset + i - d] |= s * 128
        }


        /***/ }),

    /***/ "./node_modules/int64-buffer/int64-buffer.js":
    /*!***************************************************!*\
  !*** ./node_modules/int64-buffer/int64-buffer.js ***!
  \***************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        /* WEBPACK VAR INJECTION */(function(Buffer) {// int64-buffer.js

            /*jshint -W018 */ // Confusing use of '!'.
            /*jshint -W030 */ // Expected an assignment or function call and instead saw an expression.
            /*jshint -W093 */ // Did you mean to return a conditional instead of an assignment?

            var Uint64BE, Int64BE, Uint64LE, Int64LE;

            !function(exports) {
                // constants

                var UNDEFINED = "undefined";
                var BUFFER = (UNDEFINED !== typeof Buffer) && Buffer;
                var UINT8ARRAY = (UNDEFINED !== typeof Uint8Array) && Uint8Array;
                var ARRAYBUFFER = (UNDEFINED !== typeof ArrayBuffer) && ArrayBuffer;
                var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
                var isArray = Array.isArray || _isArray;
                var BIT32 = 4294967296;
                var BIT24 = 16777216;

                // storage class

                var storage; // Array;

                // generate classes

                Uint64BE = factory("Uint64BE", true, true);
                Int64BE = factory("Int64BE", true, false);
                Uint64LE = factory("Uint64LE", false, true);
                Int64LE = factory("Int64LE", false, false);

                // class factory

                function factory(name, bigendian, unsigned) {
                    var posH = bigendian ? 0 : 4;
                    var posL = bigendian ? 4 : 0;
                    var pos0 = bigendian ? 0 : 3;
                    var pos1 = bigendian ? 1 : 2;
                    var pos2 = bigendian ? 2 : 1;
                    var pos3 = bigendian ? 3 : 0;
                    var fromPositive = bigendian ? fromPositiveBE : fromPositiveLE;
                    var fromNegative = bigendian ? fromNegativeBE : fromNegativeLE;
                    var proto = Int64.prototype;
                    var isName = "is" + name;
                    var _isInt64 = "_" + isName;

                    // properties
                    proto.buffer = void 0;
                    proto.offset = 0;
                    proto[_isInt64] = true;

                    // methods
                    proto.toNumber = toNumber;
                    proto.toString = toString;
                    proto.toJSON = toNumber;
                    proto.toArray = toArray;

                    // add .toBuffer() method only when Buffer available
                    if (BUFFER) proto.toBuffer = toBuffer;

                    // add .toArrayBuffer() method only when Uint8Array available
                    if (UINT8ARRAY) proto.toArrayBuffer = toArrayBuffer;

                    // isUint64BE, isInt64BE
                    Int64[isName] = isInt64;

                    // CommonJS
                    exports[name] = Int64;

                    return Int64;

                    // constructor
                    function Int64(buffer, offset, value, raddix) {
                        if (!(this instanceof Int64)) return new Int64(buffer, offset, value, raddix);
                        return init(this, buffer, offset, value, raddix);
                    }

                    // isUint64BE, isInt64BE
                    function isInt64(b) {
                        return !!(b && b[_isInt64]);
                    }

                    // initializer
                    function init(that, buffer, offset, value, raddix) {
                        if (UINT8ARRAY && ARRAYBUFFER) {
                            if (buffer instanceof ARRAYBUFFER) buffer = new UINT8ARRAY(buffer);
                            if (value instanceof ARRAYBUFFER) value = new UINT8ARRAY(value);
                        }

                        // Int64BE() style
                        if (!buffer && !offset && !value && !storage) {
                            // shortcut to initialize with zero
                            that.buffer = newArray(ZERO, 0);
                            return;
                        }

                        // Int64BE(value, raddix) style
                        if (!isValidBuffer(buffer, offset)) {
                            var _storage = storage || Array;
                            raddix = offset;
                            value = buffer;
                            offset = 0;
                            buffer = new _storage(8);
                        }

                        that.buffer = buffer;
                        that.offset = offset |= 0;

                        // Int64BE(buffer, offset) style
                        if (UNDEFINED === typeof value) return;

                        // Int64BE(buffer, offset, value, raddix) style
                        if ("string" === typeof value) {
                            fromString(buffer, offset, value, raddix || 10);
                        } else if (isValidBuffer(value, raddix)) {
                            fromArray(buffer, offset, value, raddix);
                        } else if ("number" === typeof raddix) {
                            writeInt32(buffer, offset + posH, value); // high
                            writeInt32(buffer, offset + posL, raddix); // low
                        } else if (value > 0) {
                            fromPositive(buffer, offset, value); // positive
                        } else if (value < 0) {
                            fromNegative(buffer, offset, value); // negative
                        } else {
                            fromArray(buffer, offset, ZERO, 0); // zero, NaN and others
                        }
                    }

                    function fromString(buffer, offset, str, raddix) {
                        var pos = 0;
                        var len = str.length;
                        var high = 0;
                        var low = 0;
                        if (str[0] === "-") pos++;
                        var sign = pos;
                        while (pos < len) {
                            var chr = parseInt(str[pos++], raddix);
                            if (!(chr >= 0)) break; // NaN
                            low = low * raddix + chr;
                            high = high * raddix + Math.floor(low / BIT32);
                            low %= BIT32;
                        }
                        if (sign) {
                            high = ~high;
                            if (low) {
                                low = BIT32 - low;
                            } else {
                                high++;
                            }
                        }
                        writeInt32(buffer, offset + posH, high);
                        writeInt32(buffer, offset + posL, low);
                    }

                    function toNumber() {
                        var buffer = this.buffer;
                        var offset = this.offset;
                        var high = readInt32(buffer, offset + posH);
                        var low = readInt32(buffer, offset + posL);
                        if (!unsigned) high |= 0; // a trick to get signed
                        return high ? (high * BIT32 + low) : low;
                    }

                    function toString(radix) {
                        var buffer = this.buffer;
                        var offset = this.offset;
                        var high = readInt32(buffer, offset + posH);
                        var low = readInt32(buffer, offset + posL);
                        var str = "";
                        var sign = !unsigned && (high & 0x80000000);
                        if (sign) {
                            high = ~high;
                            low = BIT32 - low;
                        }
                        radix = radix || 10;
                        while (1) {
                            var mod = (high % radix) * BIT32 + low;
                            high = Math.floor(high / radix);
                            low = Math.floor(mod / radix);
                            str = (mod % radix).toString(radix) + str;
                            if (!high && !low) break;
                        }
                        if (sign) {
                            str = "-" + str;
                        }
                        return str;
                    }

                    function writeInt32(buffer, offset, value) {
                        buffer[offset + pos3] = value & 255;
                        value = value >> 8;
                        buffer[offset + pos2] = value & 255;
                        value = value >> 8;
                        buffer[offset + pos1] = value & 255;
                        value = value >> 8;
                        buffer[offset + pos0] = value & 255;
                    }

                    function readInt32(buffer, offset) {
                        return (buffer[offset + pos0] * BIT24) +
                            (buffer[offset + pos1] << 16) +
                            (buffer[offset + pos2] << 8) +
                            buffer[offset + pos3];
                    }
                }

                function toArray(raw) {
                    var buffer = this.buffer;
                    var offset = this.offset;
                    storage = null; // Array
                    if (raw !== false && offset === 0 && buffer.length === 8 && isArray(buffer)) return buffer;
                    return newArray(buffer, offset);
                }

                function toBuffer(raw) {
                    var buffer = this.buffer;
                    var offset = this.offset;
                    storage = BUFFER;
                    if (raw !== false && offset === 0 && buffer.length === 8 && Buffer.isBuffer(buffer)) return buffer;
                    var dest = new BUFFER(8);
                    fromArray(dest, 0, buffer, offset);
                    return dest;
                }

                function toArrayBuffer(raw) {
                    var buffer = this.buffer;
                    var offset = this.offset;
                    var arrbuf = buffer.buffer;
                    storage = UINT8ARRAY;
                    if (raw !== false && offset === 0 && (arrbuf instanceof ARRAYBUFFER) && arrbuf.byteLength === 8) return arrbuf;
                    var dest = new UINT8ARRAY(8);
                    fromArray(dest, 0, buffer, offset);
                    return dest.buffer;
                }

                function isValidBuffer(buffer, offset) {
                    var len = buffer && buffer.length;
                    offset |= 0;
                    return len && (offset + 8 <= len) && ("string" !== typeof buffer[offset]);
                }

                function fromArray(destbuf, destoff, srcbuf, srcoff) {
                    destoff |= 0;
                    srcoff |= 0;
                    for (var i = 0; i < 8; i++) {
                        destbuf[destoff++] = srcbuf[srcoff++] & 255;
                    }
                }

                function newArray(buffer, offset) {
                    return Array.prototype.slice.call(buffer, offset, offset + 8);
                }

                function fromPositiveBE(buffer, offset, value) {
                    var pos = offset + 8;
                    while (pos > offset) {
                        buffer[--pos] = value & 255;
                        value /= 256;
                    }
                }

                function fromNegativeBE(buffer, offset, value) {
                    var pos = offset + 8;
                    value++;
                    while (pos > offset) {
                        buffer[--pos] = ((-value) & 255) ^ 255;
                        value /= 256;
                    }
                }

                function fromPositiveLE(buffer, offset, value) {
                    var end = offset + 8;
                    while (offset < end) {
                        buffer[offset++] = value & 255;
                        value /= 256;
                    }
                }

                function fromNegativeLE(buffer, offset, value) {
                    var end = offset + 8;
                    value++;
                    while (offset < end) {
                        buffer[offset++] = ((-value) & 255) ^ 255;
                        value /= 256;
                    }
                }

                // https://github.com/retrofox/is-array
                function _isArray(val) {
                    return !!val && "[object Array]" == Object.prototype.toString.call(val);
                }

            }( true && typeof exports.nodeName !== 'string' ? exports : (this || {}));

            /* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

        /***/ }),

    /***/ "./node_modules/is-buffer/index.js":
    /*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        /*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

        // The _isBuffer check is for Safari 5-7 support, because it's missing
        // Object.prototype.constructor. Remove this eventually
        module.exports = function (obj) {
            return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
        }

        function isBuffer (obj) {
            return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
        }

        // For Node v0.10 support. Remove this eventually.
        function isSlowBuffer (obj) {
            return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
        }


        /***/ }),

    /***/ "./node_modules/md5/md5.js":
    /*!*********************************!*\
  !*** ./node_modules/md5/md5.js ***!
  \*********************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        (function(){
            var crypt = __webpack_require__(/*! crypt */ "./node_modules/crypt/crypt.js"),
                utf8 = __webpack_require__(/*! charenc */ "./node_modules/charenc/charenc.js").utf8,
                isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js"),
                bin = __webpack_require__(/*! charenc */ "./node_modules/charenc/charenc.js").bin,

                // The core
                md5 = function (message, options) {
                    // Convert to byte array
                    if (message.constructor == String)
                        if (options && options.encoding === 'binary')
                            message = bin.stringToBytes(message);
                        else
                            message = utf8.stringToBytes(message);
                    else if (isBuffer(message))
                        message = Array.prototype.slice.call(message, 0);
                    else if (!Array.isArray(message))
                        message = message.toString();
                    // else, assume byte array already

                    var m = crypt.bytesToWords(message),
                        l = message.length * 8,
                        a =  1732584193,
                        b = -271733879,
                        c = -1732584194,
                        d =  271733878;

                    // Swap endian
                    for (var i = 0; i < m.length; i++) {
                        m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
                            ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
                    }

                    // Padding
                    m[l >>> 5] |= 0x80 << (l % 32);
                    m[(((l + 64) >>> 9) << 4) + 14] = l;

                    // Method shortcuts
                    var FF = md5._ff,
                        GG = md5._gg,
                        HH = md5._hh,
                        II = md5._ii;

                    for (var i = 0; i < m.length; i += 16) {

                        var aa = a,
                            bb = b,
                            cc = c,
                            dd = d;

                        a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
                        d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
                        c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
                        b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
                        a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
                        d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
                        c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
                        b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
                        a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
                        d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
                        c = FF(c, d, a, b, m[i+10], 17, -42063);
                        b = FF(b, c, d, a, m[i+11], 22, -1990404162);
                        a = FF(a, b, c, d, m[i+12],  7,  1804603682);
                        d = FF(d, a, b, c, m[i+13], 12, -40341101);
                        c = FF(c, d, a, b, m[i+14], 17, -1502002290);
                        b = FF(b, c, d, a, m[i+15], 22,  1236535329);

                        a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
                        d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
                        c = GG(c, d, a, b, m[i+11], 14,  643717713);
                        b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
                        a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
                        d = GG(d, a, b, c, m[i+10],  9,  38016083);
                        c = GG(c, d, a, b, m[i+15], 14, -660478335);
                        b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
                        a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
                        d = GG(d, a, b, c, m[i+14],  9, -1019803690);
                        c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
                        b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
                        a = GG(a, b, c, d, m[i+13],  5, -1444681467);
                        d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
                        c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
                        b = GG(b, c, d, a, m[i+12], 20, -1926607734);

                        a = HH(a, b, c, d, m[i+ 5],  4, -378558);
                        d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
                        c = HH(c, d, a, b, m[i+11], 16,  1839030562);
                        b = HH(b, c, d, a, m[i+14], 23, -35309556);
                        a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
                        d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
                        c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
                        b = HH(b, c, d, a, m[i+10], 23, -1094730640);
                        a = HH(a, b, c, d, m[i+13],  4,  681279174);
                        d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
                        c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
                        b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
                        a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
                        d = HH(d, a, b, c, m[i+12], 11, -421815835);
                        c = HH(c, d, a, b, m[i+15], 16,  530742520);
                        b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

                        a = II(a, b, c, d, m[i+ 0],  6, -198630844);
                        d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
                        c = II(c, d, a, b, m[i+14], 15, -1416354905);
                        b = II(b, c, d, a, m[i+ 5], 21, -57434055);
                        a = II(a, b, c, d, m[i+12],  6,  1700485571);
                        d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
                        c = II(c, d, a, b, m[i+10], 15, -1051523);
                        b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
                        a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
                        d = II(d, a, b, c, m[i+15], 10, -30611744);
                        c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
                        b = II(b, c, d, a, m[i+13], 21,  1309151649);
                        a = II(a, b, c, d, m[i+ 4],  6, -145523070);
                        d = II(d, a, b, c, m[i+11], 10, -1120210379);
                        c = II(c, d, a, b, m[i+ 2], 15,  718787259);
                        b = II(b, c, d, a, m[i+ 9], 21, -343485551);

                        a = (a + aa) >>> 0;
                        b = (b + bb) >>> 0;
                        c = (c + cc) >>> 0;
                        d = (d + dd) >>> 0;
                    }

                    return crypt.endian([a, b, c, d]);
                };

            // Auxiliary functions
            md5._ff  = function (a, b, c, d, x, s, t) {
                var n = a + (b & c | ~b & d) + (x >>> 0) + t;
                return ((n << s) | (n >>> (32 - s))) + b;
            };
            md5._gg  = function (a, b, c, d, x, s, t) {
                var n = a + (b & d | c & ~d) + (x >>> 0) + t;
                return ((n << s) | (n >>> (32 - s))) + b;
            };
            md5._hh  = function (a, b, c, d, x, s, t) {
                var n = a + (b ^ c ^ d) + (x >>> 0) + t;
                return ((n << s) | (n >>> (32 - s))) + b;
            };
            md5._ii  = function (a, b, c, d, x, s, t) {
                var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
                return ((n << s) | (n >>> (32 - s))) + b;
            };

            // Package private blocksize
            md5._blocksize = 16;
            md5._digestsize = 16;

            module.exports = function (message, options) {
                if (message === undefined || message === null)
                    throw new Error('Illegal argument ' + message);

                var digestbytes = crypt.wordsToBytes(md5(message, options));
                return options && options.asBytes ? digestbytes :
                options && options.asString ? bin.bytesToString(digestbytes) :
                crypt.bytesToHex(digestbytes);
            };

        })();


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/browser.js":
    /*!**************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/browser.js ***!
  \**************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // browser.js

        exports.encode = __webpack_require__(/*! ./encode */ "./node_modules/msgpack-lite/lib/encode.js").encode;
        exports.decode = __webpack_require__(/*! ./decode */ "./node_modules/msgpack-lite/lib/decode.js").decode;

        exports.Encoder = __webpack_require__(/*! ./encoder */ "./node_modules/msgpack-lite/lib/encoder.js").Encoder;
        exports.Decoder = __webpack_require__(/*! ./decoder */ "./node_modules/msgpack-lite/lib/decoder.js").Decoder;

        exports.createCodec = __webpack_require__(/*! ./ext */ "./node_modules/msgpack-lite/lib/ext.js").createCodec;
        exports.codec = __webpack_require__(/*! ./codec */ "./node_modules/msgpack-lite/lib/codec.js").codec;


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/buffer-global.js":
    /*!********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/buffer-global.js ***!
  \********************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        /* WEBPACK VAR INJECTION */(function(Buffer) {/* globals Buffer */

            module.exports =
                c(("undefined" !== typeof Buffer) && Buffer) ||
                c(this.Buffer) ||
                c(("undefined" !== typeof window) && window.Buffer) ||
                this.Buffer;

            function c(B) {
                return B && B.isBuffer && B;
            }
            /* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/buffer-lite.js":
    /*!******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/buffer-lite.js ***!
  \******************************************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        // buffer-lite.js

        var MAXBUFLEN = 8192;

        exports.copy = copy;
        exports.toString = toString;
        exports.write = write;

        /**
 * Buffer.prototype.write()
 *
 * @param string {String}
 * @param [offset] {Number}
 * @returns {Number}
 */

        function write(string, offset) {
            var buffer = this;
            var index = offset || (offset |= 0);
            var length = string.length;
            var chr = 0;
            var i = 0;
            while (i < length) {
                chr = string.charCodeAt(i++);

                if (chr < 128) {
                    buffer[index++] = chr;
                } else if (chr < 0x800) {
                    // 2 bytes
                    buffer[index++] = 0xC0 | (chr >>> 6);
                    buffer[index++] = 0x80 | (chr & 0x3F);
                } else if (chr < 0xD800 || chr > 0xDFFF) {
                    // 3 bytes
                    buffer[index++] = 0xE0 | (chr  >>> 12);
                    buffer[index++] = 0x80 | ((chr >>> 6)  & 0x3F);
                    buffer[index++] = 0x80 | (chr          & 0x3F);
                } else {
                    // 4 bytes - surrogate pair
                    chr = (((chr - 0xD800) << 10) | (string.charCodeAt(i++) - 0xDC00)) + 0x10000;
                    buffer[index++] = 0xF0 | (chr >>> 18);
                    buffer[index++] = 0x80 | ((chr >>> 12) & 0x3F);
                    buffer[index++] = 0x80 | ((chr >>> 6)  & 0x3F);
                    buffer[index++] = 0x80 | (chr          & 0x3F);
                }
            }
            return index - offset;
        }

        /**
 * Buffer.prototype.toString()
 *
 * @param [encoding] {String} ignored
 * @param [start] {Number}
 * @param [end] {Number}
 * @returns {String}
 */

        function toString(encoding, start, end) {
            var buffer = this;
            var index = start|0;
            if (!end) end = buffer.length;
            var string = '';
            var chr = 0;

            while (index < end) {
                chr = buffer[index++];
                if (chr < 128) {
                    string += String.fromCharCode(chr);
                    continue;
                }

                if ((chr & 0xE0) === 0xC0) {
                    // 2 bytes
                    chr = (chr & 0x1F) << 6 |
                        (buffer[index++] & 0x3F);

                } else if ((chr & 0xF0) === 0xE0) {
                    // 3 bytes
                    chr = (chr & 0x0F)             << 12 |
                        (buffer[index++] & 0x3F) << 6  |
                        (buffer[index++] & 0x3F);

                } else if ((chr & 0xF8) === 0xF0) {
                    // 4 bytes
                    chr = (chr & 0x07)             << 18 |
                        (buffer[index++] & 0x3F) << 12 |
                        (buffer[index++] & 0x3F) << 6  |
                        (buffer[index++] & 0x3F);
                }

                if (chr >= 0x010000) {
                    // A surrogate pair
                    chr -= 0x010000;

                    string += String.fromCharCode((chr >>> 10) + 0xD800, (chr & 0x3FF) + 0xDC00);
                } else {
                    string += String.fromCharCode(chr);
                }
            }

            return string;
        }

        /**
 * Buffer.prototype.copy()
 *
 * @param target {Buffer}
 * @param [targetStart] {Number}
 * @param [start] {Number}
 * @param [end] {Number}
 * @returns {number}
 */

        function copy(target, targetStart, start, end) {
            var i;
            if (!start) start = 0;
            if (!end && end !== 0) end = this.length;
            if (!targetStart) targetStart = 0;
            var len = end - start;

            if (target === this && start < targetStart && targetStart < end) {
                // descending
                for (i = len - 1; i >= 0; i--) {
                    target[i + targetStart] = this[i + start];
                }
            } else {
                // ascending
                for (i = 0; i < len; i++) {
                    target[i + targetStart] = this[i + start];
                }
            }

            return len;
        }


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/bufferish-array.js":
    /*!**********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/bufferish-array.js ***!
  \**********************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // bufferish-array.js

        var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");

        var exports = module.exports = alloc(0);

        exports.alloc = alloc;
        exports.concat = Bufferish.concat;
        exports.from = from;

        /**
 * @param size {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

        function alloc(size) {
            return new Array(size);
        }

        /**
 * @param value {Array|ArrayBuffer|Buffer|String}
 * @returns {Array}
 */

        function from(value) {
            if (!Bufferish.isBuffer(value) && Bufferish.isView(value)) {
                // TypedArray to Uint8Array
                value = Bufferish.Uint8Array.from(value);
            } else if (Bufferish.isArrayBuffer(value)) {
                // ArrayBuffer to Uint8Array
                value = new Uint8Array(value);
            } else if (typeof value === "string") {
                // String to Array
                return Bufferish.from.call(exports, value);
            } else if (typeof value === "number") {
                throw new TypeError('"value" argument must not be a number');
            }

            // Array-like to Array
            return Array.prototype.slice.call(value);
        }


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/bufferish-buffer.js":
    /*!***********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/bufferish-buffer.js ***!
  \***********************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // bufferish-buffer.js

        var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");
        var Buffer = Bufferish.global;

        var exports = module.exports = Bufferish.hasBuffer ? alloc(0) : [];

        exports.alloc = Bufferish.hasBuffer && Buffer.alloc || alloc;
        exports.concat = Bufferish.concat;
        exports.from = from;

        /**
 * @param size {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

        function alloc(size) {
            return new Buffer(size);
        }

        /**
 * @param value {Array|ArrayBuffer|Buffer|String}
 * @returns {Buffer}
 */

        function from(value) {
            if (!Bufferish.isBuffer(value) && Bufferish.isView(value)) {
                // TypedArray to Uint8Array
                value = Bufferish.Uint8Array.from(value);
            } else if (Bufferish.isArrayBuffer(value)) {
                // ArrayBuffer to Uint8Array
                value = new Uint8Array(value);
            } else if (typeof value === "string") {
                // String to Buffer
                return Bufferish.from.call(exports, value);
            } else if (typeof value === "number") {
                throw new TypeError('"value" argument must not be a number');
            }

            // Array-like to Buffer
            if (Buffer.from && Buffer.from.length !== 1) {
                return Buffer.from(value); // node v6+
            } else {
                return new Buffer(value); // node v4
            }
        }


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/bufferish-proto.js":
    /*!**********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/bufferish-proto.js ***!
  \**********************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // bufferish-proto.js

        /* jshint eqnull:true */

        var BufferLite = __webpack_require__(/*! ./buffer-lite */ "./node_modules/msgpack-lite/lib/buffer-lite.js");

        exports.copy = copy;
        exports.slice = slice;
        exports.toString = toString;
        exports.write = gen("write");

        var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");
        var Buffer = Bufferish.global;

        var isBufferShim = Bufferish.hasBuffer && ("TYPED_ARRAY_SUPPORT" in Buffer);
        var brokenTypedArray = isBufferShim && !Buffer.TYPED_ARRAY_SUPPORT;

        /**
 * @param target {Buffer|Uint8Array|Array}
 * @param [targetStart] {Number}
 * @param [start] {Number}
 * @param [end] {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

        function copy(target, targetStart, start, end) {
            var thisIsBuffer = Bufferish.isBuffer(this);
            var targetIsBuffer = Bufferish.isBuffer(target);
            if (thisIsBuffer && targetIsBuffer) {
                // Buffer to Buffer
                return this.copy(target, targetStart, start, end);
            } else if (!brokenTypedArray && !thisIsBuffer && !targetIsBuffer &&
                       Bufferish.isView(this) && Bufferish.isView(target)) {
                // Uint8Array to Uint8Array (except for minor some browsers)
                var buffer = (start || end != null) ? slice.call(this, start, end) : this;
                target.set(buffer, targetStart);
                return buffer.length;
            } else {
                // other cases
                return BufferLite.copy.call(this, target, targetStart, start, end);
            }
        }

        /**
 * @param [start] {Number}
 * @param [end] {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

        function slice(start, end) {
            // for Buffer, Uint8Array (except for minor some browsers) and Array
            var f = this.slice || (!brokenTypedArray && this.subarray);
            if (f) return f.call(this, start, end);

            // Uint8Array (for minor some browsers)
            var target = Bufferish.alloc.call(this, end - start);
            copy.call(this, target, 0, start, end);
            return target;
        }

        /**
 * Buffer.prototype.toString()
 *
 * @param [encoding] {String} ignored
 * @param [start] {Number}
 * @param [end] {Number}
 * @returns {String}
 */

        function toString(encoding, start, end) {
            var f = (!isBufferShim && Bufferish.isBuffer(this)) ? this.toString : BufferLite.toString;
            return f.apply(this, arguments);
        }

        /**
 * @private
 */

        function gen(method) {
            return wrap;

            function wrap() {
                var f = this[method] || BufferLite[method];
                return f.apply(this, arguments);
            }
        }


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/bufferish-uint8array.js":
    /*!***************************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/bufferish-uint8array.js ***!
  \***************************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // bufferish-uint8array.js

        var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");

        var exports = module.exports = Bufferish.hasArrayBuffer ? alloc(0) : [];

        exports.alloc = alloc;
        exports.concat = Bufferish.concat;
        exports.from = from;

        /**
 * @param size {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

        function alloc(size) {
            return new Uint8Array(size);
        }

        /**
 * @param value {Array|ArrayBuffer|Buffer|String}
 * @returns {Uint8Array}
 */

        function from(value) {
            if (Bufferish.isView(value)) {
                // TypedArray to ArrayBuffer
                var byteOffset = value.byteOffset;
                var byteLength = value.byteLength;
                value = value.buffer;
                if (value.byteLength !== byteLength) {
                    if (value.slice) {
                        value = value.slice(byteOffset, byteOffset + byteLength);
                    } else {
                        // Android 4.1 does not have ArrayBuffer.prototype.slice
                        value = new Uint8Array(value);
                        if (value.byteLength !== byteLength) {
                            // TypedArray to ArrayBuffer to Uint8Array to Array
                            value = Array.prototype.slice.call(value, byteOffset, byteOffset + byteLength);
                        }
                    }
                }
            } else if (typeof value === "string") {
                // String to Uint8Array
                return Bufferish.from.call(exports, value);
            } else if (typeof value === "number") {
                throw new TypeError('"value" argument must not be a number');
            }

            return new Uint8Array(value);
        }


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/bufferish.js":
    /*!****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/bufferish.js ***!
  \****************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // bufferish.js

        var Buffer = exports.global = __webpack_require__(/*! ./buffer-global */ "./node_modules/msgpack-lite/lib/buffer-global.js");
        var hasBuffer = exports.hasBuffer = Buffer && !!Buffer.isBuffer;
        var hasArrayBuffer = exports.hasArrayBuffer = ("undefined" !== typeof ArrayBuffer);

        var isArray = exports.isArray = __webpack_require__(/*! isarray */ "./node_modules/msgpack-lite/node_modules/isarray/index.js");
        exports.isArrayBuffer = hasArrayBuffer ? isArrayBuffer : _false;
        var isBuffer = exports.isBuffer = hasBuffer ? Buffer.isBuffer : _false;
        var isView = exports.isView = hasArrayBuffer ? (ArrayBuffer.isView || _is("ArrayBuffer", "buffer")) : _false;

        exports.alloc = alloc;
        exports.concat = concat;
        exports.from = from;

        var BufferArray = exports.Array = __webpack_require__(/*! ./bufferish-array */ "./node_modules/msgpack-lite/lib/bufferish-array.js");
        var BufferBuffer = exports.Buffer = __webpack_require__(/*! ./bufferish-buffer */ "./node_modules/msgpack-lite/lib/bufferish-buffer.js");
        var BufferUint8Array = exports.Uint8Array = __webpack_require__(/*! ./bufferish-uint8array */ "./node_modules/msgpack-lite/lib/bufferish-uint8array.js");
        var BufferProto = exports.prototype = __webpack_require__(/*! ./bufferish-proto */ "./node_modules/msgpack-lite/lib/bufferish-proto.js");

        /**
 * @param value {Array|ArrayBuffer|Buffer|String}
 * @returns {Buffer|Uint8Array|Array}
 */

        function from(value) {
            if (typeof value === "string") {
                return fromString.call(this, value);
            } else {
                return auto(this).from(value);
            }
        }

        /**
 * @param size {Number}
 * @returns {Buffer|Uint8Array|Array}
 */

        function alloc(size) {
            return auto(this).alloc(size);
        }

        /**
 * @param list {Array} array of (Buffer|Uint8Array|Array)s
 * @param [length]
 * @returns {Buffer|Uint8Array|Array}
 */

        function concat(list, length) {
            if (!length) {
                length = 0;
                Array.prototype.forEach.call(list, dryrun);
            }
            var ref = (this !== exports) && this || list[0];
            var result = alloc.call(ref, length);
            var offset = 0;
            Array.prototype.forEach.call(list, append);
            return result;

            function dryrun(buffer) {
                length += buffer.length;
            }

            function append(buffer) {
                offset += BufferProto.copy.call(buffer, result, offset);
            }
        }

        var _isArrayBuffer = _is("ArrayBuffer");

        function isArrayBuffer(value) {
            return (value instanceof ArrayBuffer) || _isArrayBuffer(value);
        }

        /**
 * @private
 */

        function fromString(value) {
            var expected = value.length * 3;
            var that = alloc.call(this, expected);
            var actual = BufferProto.write.call(that, value);
            if (expected !== actual) {
                that = BufferProto.slice.call(that, 0, actual);
            }
            return that;
        }

        function auto(that) {
            return isBuffer(that) ? BufferBuffer
            : isView(that) ? BufferUint8Array
            : isArray(that) ? BufferArray
            : hasBuffer ? BufferBuffer
            : hasArrayBuffer ? BufferUint8Array
            : BufferArray;
        }

        function _false() {
            return false;
        }

        function _is(name, key) {
            /* jshint eqnull:true */
            name = "[object " + name + "]";
            return function(value) {
                return (value != null) && {}.toString.call(key ? value[key] : value) === name;
            };
        }

        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/codec-base.js":
    /*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/codec-base.js ***!
  \*****************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // codec-base.js

        var IS_ARRAY = __webpack_require__(/*! isarray */ "./node_modules/msgpack-lite/node_modules/isarray/index.js");

        exports.createCodec = createCodec;
        exports.install = install;
        exports.filter = filter;

        var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");

        function Codec(options) {
            if (!(this instanceof Codec)) return new Codec(options);
            this.options = options;
            this.init();
        }

        Codec.prototype.init = function() {
            var options = this.options;

            if (options && options.uint8array) {
                this.bufferish = Bufferish.Uint8Array;
            }

            return this;
        };

        function install(props) {
            for (var key in props) {
                Codec.prototype[key] = add(Codec.prototype[key], props[key]);
            }
        }

        function add(a, b) {
            return (a && b) ? ab : (a || b);

            function ab() {
                a.apply(this, arguments);
                return b.apply(this, arguments);
            }
        }

        function join(filters) {
            filters = filters.slice();

            return function(value) {
                return filters.reduce(iterator, value);
            };

            function iterator(value, filter) {
                return filter(value);
            }
        }

        function filter(filter) {
            return IS_ARRAY(filter) ? join(filter) : filter;
        }

        // @public
        // msgpack.createCodec()

        function createCodec(options) {
            return new Codec(options);
        }

        // default shared codec

        exports.preset = createCodec({preset: true});


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/codec.js":
    /*!************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/codec.js ***!
  \************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // codec.js

        // load both interfaces
        __webpack_require__(/*! ./read-core */ "./node_modules/msgpack-lite/lib/read-core.js");
        __webpack_require__(/*! ./write-core */ "./node_modules/msgpack-lite/lib/write-core.js");

        // @public
        // msgpack.codec.preset

        exports.codec = {
            preset: __webpack_require__(/*! ./codec-base */ "./node_modules/msgpack-lite/lib/codec-base.js").preset
        };


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/decode-buffer.js":
    /*!********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/decode-buffer.js ***!
  \********************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // decode-buffer.js

        exports.DecodeBuffer = DecodeBuffer;

        var preset = __webpack_require__(/*! ./read-core */ "./node_modules/msgpack-lite/lib/read-core.js").preset;

        var FlexDecoder = __webpack_require__(/*! ./flex-buffer */ "./node_modules/msgpack-lite/lib/flex-buffer.js").FlexDecoder;

        FlexDecoder.mixin(DecodeBuffer.prototype);

        function DecodeBuffer(options) {
            if (!(this instanceof DecodeBuffer)) return new DecodeBuffer(options);

            if (options) {
                this.options = options;
                if (options.codec) {
                    var codec = this.codec = options.codec;
                    if (codec.bufferish) this.bufferish = codec.bufferish;
                }
            }
        }

        DecodeBuffer.prototype.codec = preset;

        DecodeBuffer.prototype.fetch = function() {
            return this.codec.decode(this);
        };


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/decode.js":
    /*!*************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/decode.js ***!
  \*************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // decode.js

        exports.decode = decode;

        var DecodeBuffer = __webpack_require__(/*! ./decode-buffer */ "./node_modules/msgpack-lite/lib/decode-buffer.js").DecodeBuffer;

        function decode(input, options) {
            var decoder = new DecodeBuffer(options);
            decoder.write(input);
            return decoder.read();
        }

        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/decoder.js":
    /*!**************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/decoder.js ***!
  \**************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // decoder.js

        exports.Decoder = Decoder;

        var EventLite = __webpack_require__(/*! event-lite */ "./node_modules/event-lite/event-lite.js");
        var DecodeBuffer = __webpack_require__(/*! ./decode-buffer */ "./node_modules/msgpack-lite/lib/decode-buffer.js").DecodeBuffer;

        function Decoder(options) {
            if (!(this instanceof Decoder)) return new Decoder(options);
            DecodeBuffer.call(this, options);
        }

        Decoder.prototype = new DecodeBuffer();

        EventLite.mixin(Decoder.prototype);

        Decoder.prototype.decode = function(chunk) {
            if (arguments.length) this.write(chunk);
            this.flush();
        };

        Decoder.prototype.push = function(chunk) {
            this.emit("data", chunk);
        };

        Decoder.prototype.end = function(chunk) {
            this.decode(chunk);
            this.emit("end");
        };


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/encode-buffer.js":
    /*!********************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/encode-buffer.js ***!
  \********************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // encode-buffer.js

        exports.EncodeBuffer = EncodeBuffer;

        var preset = __webpack_require__(/*! ./write-core */ "./node_modules/msgpack-lite/lib/write-core.js").preset;

        var FlexEncoder = __webpack_require__(/*! ./flex-buffer */ "./node_modules/msgpack-lite/lib/flex-buffer.js").FlexEncoder;

        FlexEncoder.mixin(EncodeBuffer.prototype);

        function EncodeBuffer(options) {
            if (!(this instanceof EncodeBuffer)) return new EncodeBuffer(options);

            if (options) {
                this.options = options;
                if (options.codec) {
                    var codec = this.codec = options.codec;
                    if (codec.bufferish) this.bufferish = codec.bufferish;
                }
            }
        }

        EncodeBuffer.prototype.codec = preset;

        EncodeBuffer.prototype.write = function(input) {
            this.codec.encode(this, input);
        };


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/encode.js":
    /*!*************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/encode.js ***!
  \*************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // encode.js

        exports.encode = encode;

        var EncodeBuffer = __webpack_require__(/*! ./encode-buffer */ "./node_modules/msgpack-lite/lib/encode-buffer.js").EncodeBuffer;

        function encode(input, options) {
            var encoder = new EncodeBuffer(options);
            encoder.write(input);
            return encoder.read();
        }


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/encoder.js":
    /*!**************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/encoder.js ***!
  \**************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // encoder.js

        exports.Encoder = Encoder;

        var EventLite = __webpack_require__(/*! event-lite */ "./node_modules/event-lite/event-lite.js");
        var EncodeBuffer = __webpack_require__(/*! ./encode-buffer */ "./node_modules/msgpack-lite/lib/encode-buffer.js").EncodeBuffer;

        function Encoder(options) {
            if (!(this instanceof Encoder)) return new Encoder(options);
            EncodeBuffer.call(this, options);
        }

        Encoder.prototype = new EncodeBuffer();

        EventLite.mixin(Encoder.prototype);

        Encoder.prototype.encode = function(chunk) {
            this.write(chunk);
            this.emit("data", this.read());
        };

        Encoder.prototype.end = function(chunk) {
            if (arguments.length) this.encode(chunk);
            this.flush();
            this.emit("end");
        };


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/ext-buffer.js":
    /*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/ext-buffer.js ***!
  \*****************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // ext-buffer.js

        exports.ExtBuffer = ExtBuffer;

        var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");

        function ExtBuffer(buffer, type) {
            if (!(this instanceof ExtBuffer)) return new ExtBuffer(buffer, type);
            this.buffer = Bufferish.from(buffer);
            this.type = type;
        }


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/ext-packer.js":
    /*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/ext-packer.js ***!
  \*****************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // ext-packer.js

        exports.setExtPackers = setExtPackers;

        var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");
        var Buffer = Bufferish.global;
        var packTypedArray = Bufferish.Uint8Array.from;
        var _encode;

        var ERROR_COLUMNS = {name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1};

        function setExtPackers(codec) {
            codec.addExtPacker(0x0E, Error, [packError, encode]);
            codec.addExtPacker(0x01, EvalError, [packError, encode]);
            codec.addExtPacker(0x02, RangeError, [packError, encode]);
            codec.addExtPacker(0x03, ReferenceError, [packError, encode]);
            codec.addExtPacker(0x04, SyntaxError, [packError, encode]);
            codec.addExtPacker(0x05, TypeError, [packError, encode]);
            codec.addExtPacker(0x06, URIError, [packError, encode]);

            codec.addExtPacker(0x0A, RegExp, [packRegExp, encode]);
            codec.addExtPacker(0x0B, Boolean, [packValueOf, encode]);
            codec.addExtPacker(0x0C, String, [packValueOf, encode]);
            codec.addExtPacker(0x0D, Date, [Number, encode]);
            codec.addExtPacker(0x0F, Number, [packValueOf, encode]);

            if ("undefined" !== typeof Uint8Array) {
                codec.addExtPacker(0x11, Int8Array, packTypedArray);
                codec.addExtPacker(0x12, Uint8Array, packTypedArray);
                codec.addExtPacker(0x13, Int16Array, packTypedArray);
                codec.addExtPacker(0x14, Uint16Array, packTypedArray);
                codec.addExtPacker(0x15, Int32Array, packTypedArray);
                codec.addExtPacker(0x16, Uint32Array, packTypedArray);
                codec.addExtPacker(0x17, Float32Array, packTypedArray);

                // PhantomJS/1.9.7 doesn't have Float64Array
                if ("undefined" !== typeof Float64Array) {
                    codec.addExtPacker(0x18, Float64Array, packTypedArray);
                }

                // IE10 doesn't have Uint8ClampedArray
                if ("undefined" !== typeof Uint8ClampedArray) {
                    codec.addExtPacker(0x19, Uint8ClampedArray, packTypedArray);
                }

                codec.addExtPacker(0x1A, ArrayBuffer, packTypedArray);
                codec.addExtPacker(0x1D, DataView, packTypedArray);
            }

            if (Bufferish.hasBuffer) {
                codec.addExtPacker(0x1B, Buffer, Bufferish.from);
            }
        }

        function encode(input) {
            if (!_encode) _encode = __webpack_require__(/*! ./encode */ "./node_modules/msgpack-lite/lib/encode.js").encode; // lazy load
            return _encode(input);
        }

        function packValueOf(value) {
            return (value).valueOf();
        }

        function packRegExp(value) {
            value = RegExp.prototype.toString.call(value).split("/");
            value.shift();
            var out = [value.pop()];
            out.unshift(value.join("/"));
            return out;
        }

        function packError(value) {
            var out = {};
            for (var key in ERROR_COLUMNS) {
                out[key] = value[key];
            }
            return out;
        }


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/ext-unpacker.js":
    /*!*******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/ext-unpacker.js ***!
  \*******************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // ext-unpacker.js

        exports.setExtUnpackers = setExtUnpackers;

        var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");
        var Buffer = Bufferish.global;
        var _decode;

        var ERROR_COLUMNS = {name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1};

        function setExtUnpackers(codec) {
            codec.addExtUnpacker(0x0E, [decode, unpackError(Error)]);
            codec.addExtUnpacker(0x01, [decode, unpackError(EvalError)]);
            codec.addExtUnpacker(0x02, [decode, unpackError(RangeError)]);
            codec.addExtUnpacker(0x03, [decode, unpackError(ReferenceError)]);
            codec.addExtUnpacker(0x04, [decode, unpackError(SyntaxError)]);
            codec.addExtUnpacker(0x05, [decode, unpackError(TypeError)]);
            codec.addExtUnpacker(0x06, [decode, unpackError(URIError)]);

            codec.addExtUnpacker(0x0A, [decode, unpackRegExp]);
            codec.addExtUnpacker(0x0B, [decode, unpackClass(Boolean)]);
            codec.addExtUnpacker(0x0C, [decode, unpackClass(String)]);
            codec.addExtUnpacker(0x0D, [decode, unpackClass(Date)]);
            codec.addExtUnpacker(0x0F, [decode, unpackClass(Number)]);

            if ("undefined" !== typeof Uint8Array) {
                codec.addExtUnpacker(0x11, unpackClass(Int8Array));
                codec.addExtUnpacker(0x12, unpackClass(Uint8Array));
                codec.addExtUnpacker(0x13, [unpackArrayBuffer, unpackClass(Int16Array)]);
                codec.addExtUnpacker(0x14, [unpackArrayBuffer, unpackClass(Uint16Array)]);
                codec.addExtUnpacker(0x15, [unpackArrayBuffer, unpackClass(Int32Array)]);
                codec.addExtUnpacker(0x16, [unpackArrayBuffer, unpackClass(Uint32Array)]);
                codec.addExtUnpacker(0x17, [unpackArrayBuffer, unpackClass(Float32Array)]);

                // PhantomJS/1.9.7 doesn't have Float64Array
                if ("undefined" !== typeof Float64Array) {
                    codec.addExtUnpacker(0x18, [unpackArrayBuffer, unpackClass(Float64Array)]);
                }

                // IE10 doesn't have Uint8ClampedArray
                if ("undefined" !== typeof Uint8ClampedArray) {
                    codec.addExtUnpacker(0x19, unpackClass(Uint8ClampedArray));
                }

                codec.addExtUnpacker(0x1A, unpackArrayBuffer);
                codec.addExtUnpacker(0x1D, [unpackArrayBuffer, unpackClass(DataView)]);
            }

            if (Bufferish.hasBuffer) {
                codec.addExtUnpacker(0x1B, unpackClass(Buffer));
            }
        }

        function decode(input) {
            if (!_decode) _decode = __webpack_require__(/*! ./decode */ "./node_modules/msgpack-lite/lib/decode.js").decode; // lazy load
            return _decode(input);
        }

        function unpackRegExp(value) {
            return RegExp.apply(null, value);
        }

        function unpackError(Class) {
            return function(value) {
                var out = new Class();
                for (var key in ERROR_COLUMNS) {
                    out[key] = value[key];
                }
                return out;
            };
        }

        function unpackClass(Class) {
            return function(value) {
                return new Class(value);
            };
        }

        function unpackArrayBuffer(value) {
            return (new Uint8Array(value)).buffer;
        }


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/ext.js":
    /*!**********************************************!*\
  !*** ./node_modules/msgpack-lite/lib/ext.js ***!
  \**********************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // ext.js

        // load both interfaces
        __webpack_require__(/*! ./read-core */ "./node_modules/msgpack-lite/lib/read-core.js");
        __webpack_require__(/*! ./write-core */ "./node_modules/msgpack-lite/lib/write-core.js");

        exports.createCodec = __webpack_require__(/*! ./codec-base */ "./node_modules/msgpack-lite/lib/codec-base.js").createCodec;


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/flex-buffer.js":
    /*!******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/flex-buffer.js ***!
  \******************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // flex-buffer.js

        exports.FlexDecoder = FlexDecoder;
        exports.FlexEncoder = FlexEncoder;

        var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");

        var MIN_BUFFER_SIZE = 2048;
        var MAX_BUFFER_SIZE = 65536;
        var BUFFER_SHORTAGE = "BUFFER_SHORTAGE";

        function FlexDecoder() {
            if (!(this instanceof FlexDecoder)) return new FlexDecoder();
        }

        function FlexEncoder() {
            if (!(this instanceof FlexEncoder)) return new FlexEncoder();
        }

        FlexDecoder.mixin = mixinFactory(getDecoderMethods());
        FlexDecoder.mixin(FlexDecoder.prototype);

        FlexEncoder.mixin = mixinFactory(getEncoderMethods());
        FlexEncoder.mixin(FlexEncoder.prototype);

        function getDecoderMethods() {
            return {
                bufferish: Bufferish,
                write: write,
                fetch: fetch,
                flush: flush,
                push: push,
                pull: pull,
                read: read,
                reserve: reserve,
                offset: 0
            };

            function write(chunk) {
                var prev = this.offset ? Bufferish.prototype.slice.call(this.buffer, this.offset) : this.buffer;
                this.buffer = prev ? (chunk ? this.bufferish.concat([prev, chunk]) : prev) : chunk;
                this.offset = 0;
            }

            function flush() {
                while (this.offset < this.buffer.length) {
                    var start = this.offset;
                    var value;
                    try {
                        value = this.fetch();
                    } catch (e) {
                        if (e && e.message != BUFFER_SHORTAGE) throw e;
                        // rollback
                        this.offset = start;
                        break;
                    }
                    this.push(value);
                }
            }

            function reserve(length) {
                var start = this.offset;
                var end = start + length;
                if (end > this.buffer.length) throw new Error(BUFFER_SHORTAGE);
                this.offset = end;
                return start;
            }
        }

        function getEncoderMethods() {
            return {
                bufferish: Bufferish,
                write: write,
                fetch: fetch,
                flush: flush,
                push: push,
                pull: pull,
                read: read,
                reserve: reserve,
                send: send,
                maxBufferSize: MAX_BUFFER_SIZE,
                minBufferSize: MIN_BUFFER_SIZE,
                offset: 0,
                start: 0
            };

            function fetch() {
                var start = this.start;
                if (start < this.offset) {
                    var end = this.start = this.offset;
                    return Bufferish.prototype.slice.call(this.buffer, start, end);
                }
            }

            function flush() {
                while (this.start < this.offset) {
                    var value = this.fetch();
                    if (value) this.push(value);
                }
            }

            function pull() {
                var buffers = this.buffers || (this.buffers = []);
                var chunk = buffers.length > 1 ? this.bufferish.concat(buffers) : buffers[0];
                buffers.length = 0; // buffer exhausted
                return chunk;
            }

            function reserve(length) {
                var req = length | 0;

                if (this.buffer) {
                    var size = this.buffer.length;
                    var start = this.offset | 0;
                    var end = start + req;

                    // is it long enough?
                    if (end < size) {
                        this.offset = end;
                        return start;
                    }

                    // flush current buffer
                    this.flush();

                    // resize it to 2x current length
                    length = Math.max(length, Math.min(size * 2, this.maxBufferSize));
                }

                // minimum buffer size
                length = Math.max(length, this.minBufferSize);

                // allocate new buffer
                this.buffer = this.bufferish.alloc(length);
                this.start = 0;
                this.offset = req;
                return 0;
            }

            function send(buffer) {
                var length = buffer.length;
                if (length > this.minBufferSize) {
                    this.flush();
                    this.push(buffer);
                } else {
                    var offset = this.reserve(length);
                    Bufferish.prototype.copy.call(buffer, this.buffer, offset);
                }
            }
        }

        // common methods

        function write() {
            throw new Error("method not implemented: write()");
        }

        function fetch() {
            throw new Error("method not implemented: fetch()");
        }

        function read() {
            var length = this.buffers && this.buffers.length;

            // fetch the first result
            if (!length) return this.fetch();

            // flush current buffer
            this.flush();

            // read from the results
            return this.pull();
        }

        function push(chunk) {
            var buffers = this.buffers || (this.buffers = []);
            buffers.push(chunk);
        }

        function pull() {
            var buffers = this.buffers || (this.buffers = []);
            return buffers.shift();
        }

        function mixinFactory(source) {
            return mixin;

            function mixin(target) {
                for (var key in source) {
                    target[key] = source[key];
                }
                return target;
            }
        }


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/read-core.js":
    /*!****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/read-core.js ***!
  \****************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // read-core.js

        var ExtBuffer = __webpack_require__(/*! ./ext-buffer */ "./node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer;
        var ExtUnpacker = __webpack_require__(/*! ./ext-unpacker */ "./node_modules/msgpack-lite/lib/ext-unpacker.js");
        var readUint8 = __webpack_require__(/*! ./read-format */ "./node_modules/msgpack-lite/lib/read-format.js").readUint8;
        var ReadToken = __webpack_require__(/*! ./read-token */ "./node_modules/msgpack-lite/lib/read-token.js");
        var CodecBase = __webpack_require__(/*! ./codec-base */ "./node_modules/msgpack-lite/lib/codec-base.js");

        CodecBase.install({
            addExtUnpacker: addExtUnpacker,
            getExtUnpacker: getExtUnpacker,
            init: init
        });

        exports.preset = init.call(CodecBase.preset);

        function getDecoder(options) {
            var readToken = ReadToken.getReadToken(options);
            return decode;

            function decode(decoder) {
                var type = readUint8(decoder);
                var func = readToken[type];
                if (!func) throw new Error("Invalid type: " + (type ? ("0x" + type.toString(16)) : type));
                return func(decoder);
            }
        }

        function init() {
            var options = this.options;
            this.decode = getDecoder(options);

            if (options && options.preset) {
                ExtUnpacker.setExtUnpackers(this);
            }

            return this;
        }

        function addExtUnpacker(etype, unpacker) {
            var unpackers = this.extUnpackers || (this.extUnpackers = []);
            unpackers[etype] = CodecBase.filter(unpacker);
        }

        function getExtUnpacker(type) {
            var unpackers = this.extUnpackers || (this.extUnpackers = []);
            return unpackers[type] || extUnpacker;

            function extUnpacker(buffer) {
                return new ExtBuffer(buffer, type);
            }
        }


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/read-format.js":
    /*!******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/read-format.js ***!
  \******************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // read-format.js

        var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js");
        var Int64Buffer = __webpack_require__(/*! int64-buffer */ "./node_modules/int64-buffer/int64-buffer.js");
        var Uint64BE = Int64Buffer.Uint64BE;
        var Int64BE = Int64Buffer.Int64BE;

        exports.getReadFormat = getReadFormat;
        exports.readUint8 = uint8;

        var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");
        var BufferProto = __webpack_require__(/*! ./bufferish-proto */ "./node_modules/msgpack-lite/lib/bufferish-proto.js");

        var HAS_MAP = ("undefined" !== typeof Map);
        var NO_ASSERT = true;

        function getReadFormat(options) {
            var binarraybuffer = Bufferish.hasArrayBuffer && options && options.binarraybuffer;
            var int64 = options && options.int64;
            var usemap = HAS_MAP && options && options.usemap;

            var readFormat = {
                map: (usemap ? map_to_map : map_to_obj),
                array: array,
                str: str,
                bin: (binarraybuffer ? bin_arraybuffer : bin_buffer),
                ext: ext,
                uint8: uint8,
                uint16: uint16,
                uint32: uint32,
                uint64: read(8, int64 ? readUInt64BE_int64 : readUInt64BE),
                int8: int8,
                int16: int16,
                int32: int32,
                int64: read(8, int64 ? readInt64BE_int64 : readInt64BE),
                float32: read(4, readFloatBE),
                float64: read(8, readDoubleBE)
            };

            return readFormat;
        }

        function map_to_obj(decoder, len) {
            var value = {};
            var i;
            var k = new Array(len);
            var v = new Array(len);

            var decode = decoder.codec.decode;
            for (i = 0; i < len; i++) {
                k[i] = decode(decoder);
                v[i] = decode(decoder);
            }
            for (i = 0; i < len; i++) {
                value[k[i]] = v[i];
            }
            return value;
        }

        function map_to_map(decoder, len) {
            var value = new Map();
            var i;
            var k = new Array(len);
            var v = new Array(len);

            var decode = decoder.codec.decode;
            for (i = 0; i < len; i++) {
                k[i] = decode(decoder);
                v[i] = decode(decoder);
            }
            for (i = 0; i < len; i++) {
                value.set(k[i], v[i]);
            }
            return value;
        }

        function array(decoder, len) {
            var value = new Array(len);
            var decode = decoder.codec.decode;
            for (var i = 0; i < len; i++) {
                value[i] = decode(decoder);
            }
            return value;
        }

        function str(decoder, len) {
            var start = decoder.reserve(len);
            var end = start + len;
            return BufferProto.toString.call(decoder.buffer, "utf-8", start, end);
        }

        function bin_buffer(decoder, len) {
            var start = decoder.reserve(len);
            var end = start + len;
            var buf = BufferProto.slice.call(decoder.buffer, start, end);
            return Bufferish.from(buf);
        }

        function bin_arraybuffer(decoder, len) {
            var start = decoder.reserve(len);
            var end = start + len;
            var buf = BufferProto.slice.call(decoder.buffer, start, end);
            return Bufferish.Uint8Array.from(buf).buffer;
        }

        function ext(decoder, len) {
            var start = decoder.reserve(len+1);
            var type = decoder.buffer[start++];
            var end = start + len;
            var unpack = decoder.codec.getExtUnpacker(type);
            if (!unpack) throw new Error("Invalid ext type: " + (type ? ("0x" + type.toString(16)) : type));
            var buf = BufferProto.slice.call(decoder.buffer, start, end);
            return unpack(buf);
        }

        function uint8(decoder) {
            var start = decoder.reserve(1);
            return decoder.buffer[start];
        }

        function int8(decoder) {
            var start = decoder.reserve(1);
            var value = decoder.buffer[start];
            return (value & 0x80) ? value - 0x100 : value;
        }

        function uint16(decoder) {
            var start = decoder.reserve(2);
            var buffer = decoder.buffer;
            return (buffer[start++] << 8) | buffer[start];
        }

        function int16(decoder) {
            var start = decoder.reserve(2);
            var buffer = decoder.buffer;
            var value = (buffer[start++] << 8) | buffer[start];
            return (value & 0x8000) ? value - 0x10000 : value;
        }

        function uint32(decoder) {
            var start = decoder.reserve(4);
            var buffer = decoder.buffer;
            return (buffer[start++] * 16777216) + (buffer[start++] << 16) + (buffer[start++] << 8) + buffer[start];
        }

        function int32(decoder) {
            var start = decoder.reserve(4);
            var buffer = decoder.buffer;
            return (buffer[start++] << 24) | (buffer[start++] << 16) | (buffer[start++] << 8) | buffer[start];
        }

        function read(len, method) {
            return function(decoder) {
                var start = decoder.reserve(len);
                return method.call(decoder.buffer, start, NO_ASSERT);
            };
        }

        function readUInt64BE(start) {
            return new Uint64BE(this, start).toNumber();
        }

        function readInt64BE(start) {
            return new Int64BE(this, start).toNumber();
        }

        function readUInt64BE_int64(start) {
            return new Uint64BE(this, start);
        }

        function readInt64BE_int64(start) {
            return new Int64BE(this, start);
        }

        function readFloatBE(start) {
            return ieee754.read(this, start, false, 23, 4);
        }

        function readDoubleBE(start) {
            return ieee754.read(this, start, false, 52, 8);
        }

        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/read-token.js":
    /*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/read-token.js ***!
  \*****************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // read-token.js

        var ReadFormat = __webpack_require__(/*! ./read-format */ "./node_modules/msgpack-lite/lib/read-format.js");

        exports.getReadToken = getReadToken;

        function getReadToken(options) {
            var format = ReadFormat.getReadFormat(options);

            if (options && options.useraw) {
                return init_useraw(format);
            } else {
                return init_token(format);
            }
        }

        function init_token(format) {
            var i;
            var token = new Array(256);

            // positive fixint -- 0x00 - 0x7f
            for (i = 0x00; i <= 0x7f; i++) {
                token[i] = constant(i);
            }

            // fixmap -- 0x80 - 0x8f
            for (i = 0x80; i <= 0x8f; i++) {
                token[i] = fix(i - 0x80, format.map);
            }

            // fixarray -- 0x90 - 0x9f
            for (i = 0x90; i <= 0x9f; i++) {
                token[i] = fix(i - 0x90, format.array);
            }

            // fixstr -- 0xa0 - 0xbf
            for (i = 0xa0; i <= 0xbf; i++) {
                token[i] = fix(i - 0xa0, format.str);
            }

            // nil -- 0xc0
            token[0xc0] = constant(null);

            // (never used) -- 0xc1
            token[0xc1] = null;

            // false -- 0xc2
            // true -- 0xc3
            token[0xc2] = constant(false);
            token[0xc3] = constant(true);

            // bin 8 -- 0xc4
            // bin 16 -- 0xc5
            // bin 32 -- 0xc6
            token[0xc4] = flex(format.uint8, format.bin);
            token[0xc5] = flex(format.uint16, format.bin);
            token[0xc6] = flex(format.uint32, format.bin);

            // ext 8 -- 0xc7
            // ext 16 -- 0xc8
            // ext 32 -- 0xc9
            token[0xc7] = flex(format.uint8, format.ext);
            token[0xc8] = flex(format.uint16, format.ext);
            token[0xc9] = flex(format.uint32, format.ext);

            // float 32 -- 0xca
            // float 64 -- 0xcb
            token[0xca] = format.float32;
            token[0xcb] = format.float64;

            // uint 8 -- 0xcc
            // uint 16 -- 0xcd
            // uint 32 -- 0xce
            // uint 64 -- 0xcf
            token[0xcc] = format.uint8;
            token[0xcd] = format.uint16;
            token[0xce] = format.uint32;
            token[0xcf] = format.uint64;

            // int 8 -- 0xd0
            // int 16 -- 0xd1
            // int 32 -- 0xd2
            // int 64 -- 0xd3
            token[0xd0] = format.int8;
            token[0xd1] = format.int16;
            token[0xd2] = format.int32;
            token[0xd3] = format.int64;

            // fixext 1 -- 0xd4
            // fixext 2 -- 0xd5
            // fixext 4 -- 0xd6
            // fixext 8 -- 0xd7
            // fixext 16 -- 0xd8
            token[0xd4] = fix(1, format.ext);
            token[0xd5] = fix(2, format.ext);
            token[0xd6] = fix(4, format.ext);
            token[0xd7] = fix(8, format.ext);
            token[0xd8] = fix(16, format.ext);

            // str 8 -- 0xd9
            // str 16 -- 0xda
            // str 32 -- 0xdb
            token[0xd9] = flex(format.uint8, format.str);
            token[0xda] = flex(format.uint16, format.str);
            token[0xdb] = flex(format.uint32, format.str);

            // array 16 -- 0xdc
            // array 32 -- 0xdd
            token[0xdc] = flex(format.uint16, format.array);
            token[0xdd] = flex(format.uint32, format.array);

            // map 16 -- 0xde
            // map 32 -- 0xdf
            token[0xde] = flex(format.uint16, format.map);
            token[0xdf] = flex(format.uint32, format.map);

            // negative fixint -- 0xe0 - 0xff
            for (i = 0xe0; i <= 0xff; i++) {
                token[i] = constant(i - 0x100);
            }

            return token;
        }

        function init_useraw(format) {
            var i;
            var token = init_token(format).slice();

            // raw 8 -- 0xd9
            // raw 16 -- 0xda
            // raw 32 -- 0xdb
            token[0xd9] = token[0xc4];
            token[0xda] = token[0xc5];
            token[0xdb] = token[0xc6];

            // fixraw -- 0xa0 - 0xbf
            for (i = 0xa0; i <= 0xbf; i++) {
                token[i] = fix(i - 0xa0, format.bin);
            }

            return token;
        }

        function constant(value) {
            return function() {
                return value;
            };
        }

        function flex(lenFunc, decodeFunc) {
            return function(decoder) {
                var len = lenFunc(decoder);
                return decodeFunc(decoder, len);
            };
        }

        function fix(len, method) {
            return function(decoder) {
                return method(decoder, len);
            };
        }


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/write-core.js":
    /*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/write-core.js ***!
  \*****************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // write-core.js

        var ExtBuffer = __webpack_require__(/*! ./ext-buffer */ "./node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer;
        var ExtPacker = __webpack_require__(/*! ./ext-packer */ "./node_modules/msgpack-lite/lib/ext-packer.js");
        var WriteType = __webpack_require__(/*! ./write-type */ "./node_modules/msgpack-lite/lib/write-type.js");
        var CodecBase = __webpack_require__(/*! ./codec-base */ "./node_modules/msgpack-lite/lib/codec-base.js");

        CodecBase.install({
            addExtPacker: addExtPacker,
            getExtPacker: getExtPacker,
            init: init
        });

        exports.preset = init.call(CodecBase.preset);

        function getEncoder(options) {
            var writeType = WriteType.getWriteType(options);
            return encode;

            function encode(encoder, value) {
                var func = writeType[typeof value];
                if (!func) throw new Error("Unsupported type \"" + (typeof value) + "\": " + value);
                func(encoder, value);
            }
        }

        function init() {
            var options = this.options;
            this.encode = getEncoder(options);

            if (options && options.preset) {
                ExtPacker.setExtPackers(this);
            }

            return this;
        }

        function addExtPacker(etype, Class, packer) {
            packer = CodecBase.filter(packer);
            var name = Class.name;
            if (name && name !== "Object") {
                var packers = this.extPackers || (this.extPackers = {});
                packers[name] = extPacker;
            } else {
                // fallback for IE
                var list = this.extEncoderList || (this.extEncoderList = []);
                list.unshift([Class, extPacker]);
            }

            function extPacker(value) {
                if (packer) value = packer(value);
                return new ExtBuffer(value, etype);
            }
        }

        function getExtPacker(value) {
            var packers = this.extPackers || (this.extPackers = {});
            var c = value.constructor;
            var e = c && c.name && packers[c.name];
            if (e) return e;

            // fallback for IE
            var list = this.extEncoderList || (this.extEncoderList = []);
            var len = list.length;
            for (var i = 0; i < len; i++) {
                var pair = list[i];
                if (c === pair[0]) return pair[1];
            }
        }


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/write-token.js":
    /*!******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/write-token.js ***!
  \******************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // write-token.js

        var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js");
        var Int64Buffer = __webpack_require__(/*! int64-buffer */ "./node_modules/int64-buffer/int64-buffer.js");
        var Uint64BE = Int64Buffer.Uint64BE;
        var Int64BE = Int64Buffer.Int64BE;

        var uint8 = __webpack_require__(/*! ./write-uint8 */ "./node_modules/msgpack-lite/lib/write-uint8.js").uint8;
        var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");
        var Buffer = Bufferish.global;
        var IS_BUFFER_SHIM = Bufferish.hasBuffer && ("TYPED_ARRAY_SUPPORT" in Buffer);
        var NO_TYPED_ARRAY = IS_BUFFER_SHIM && !Buffer.TYPED_ARRAY_SUPPORT;
        var Buffer_prototype = Bufferish.hasBuffer && Buffer.prototype || {};

        exports.getWriteToken = getWriteToken;

        function getWriteToken(options) {
            if (options && options.uint8array) {
                return init_uint8array();
            } else if (NO_TYPED_ARRAY || (Bufferish.hasBuffer && options && options.safe)) {
                return init_safe();
            } else {
                return init_token();
            }
        }

        function init_uint8array() {
            var token = init_token();

            // float 32 -- 0xca
            // float 64 -- 0xcb
            token[0xca] = writeN(0xca, 4, writeFloatBE);
            token[0xcb] = writeN(0xcb, 8, writeDoubleBE);

            return token;
        }

        // Node.js and browsers with TypedArray

        function init_token() {
            // (immediate values)
            // positive fixint -- 0x00 - 0x7f
            // nil -- 0xc0
            // false -- 0xc2
            // true -- 0xc3
            // negative fixint -- 0xe0 - 0xff
            var token = uint8.slice();

            // bin 8 -- 0xc4
            // bin 16 -- 0xc5
            // bin 32 -- 0xc6
            token[0xc4] = write1(0xc4);
            token[0xc5] = write2(0xc5);
            token[0xc6] = write4(0xc6);

            // ext 8 -- 0xc7
            // ext 16 -- 0xc8
            // ext 32 -- 0xc9
            token[0xc7] = write1(0xc7);
            token[0xc8] = write2(0xc8);
            token[0xc9] = write4(0xc9);

            // float 32 -- 0xca
            // float 64 -- 0xcb
            token[0xca] = writeN(0xca, 4, (Buffer_prototype.writeFloatBE || writeFloatBE), true);
            token[0xcb] = writeN(0xcb, 8, (Buffer_prototype.writeDoubleBE || writeDoubleBE), true);

            // uint 8 -- 0xcc
            // uint 16 -- 0xcd
            // uint 32 -- 0xce
            // uint 64 -- 0xcf
            token[0xcc] = write1(0xcc);
            token[0xcd] = write2(0xcd);
            token[0xce] = write4(0xce);
            token[0xcf] = writeN(0xcf, 8, writeUInt64BE);

            // int 8 -- 0xd0
            // int 16 -- 0xd1
            // int 32 -- 0xd2
            // int 64 -- 0xd3
            token[0xd0] = write1(0xd0);
            token[0xd1] = write2(0xd1);
            token[0xd2] = write4(0xd2);
            token[0xd3] = writeN(0xd3, 8, writeInt64BE);

            // str 8 -- 0xd9
            // str 16 -- 0xda
            // str 32 -- 0xdb
            token[0xd9] = write1(0xd9);
            token[0xda] = write2(0xda);
            token[0xdb] = write4(0xdb);

            // array 16 -- 0xdc
            // array 32 -- 0xdd
            token[0xdc] = write2(0xdc);
            token[0xdd] = write4(0xdd);

            // map 16 -- 0xde
            // map 32 -- 0xdf
            token[0xde] = write2(0xde);
            token[0xdf] = write4(0xdf);

            return token;
        }

        // safe mode: for old browsers and who needs asserts

        function init_safe() {
            // (immediate values)
            // positive fixint -- 0x00 - 0x7f
            // nil -- 0xc0
            // false -- 0xc2
            // true -- 0xc3
            // negative fixint -- 0xe0 - 0xff
            var token = uint8.slice();

            // bin 8 -- 0xc4
            // bin 16 -- 0xc5
            // bin 32 -- 0xc6
            token[0xc4] = writeN(0xc4, 1, Buffer.prototype.writeUInt8);
            token[0xc5] = writeN(0xc5, 2, Buffer.prototype.writeUInt16BE);
            token[0xc6] = writeN(0xc6, 4, Buffer.prototype.writeUInt32BE);

            // ext 8 -- 0xc7
            // ext 16 -- 0xc8
            // ext 32 -- 0xc9
            token[0xc7] = writeN(0xc7, 1, Buffer.prototype.writeUInt8);
            token[0xc8] = writeN(0xc8, 2, Buffer.prototype.writeUInt16BE);
            token[0xc9] = writeN(0xc9, 4, Buffer.prototype.writeUInt32BE);

            // float 32 -- 0xca
            // float 64 -- 0xcb
            token[0xca] = writeN(0xca, 4, Buffer.prototype.writeFloatBE);
            token[0xcb] = writeN(0xcb, 8, Buffer.prototype.writeDoubleBE);

            // uint 8 -- 0xcc
            // uint 16 -- 0xcd
            // uint 32 -- 0xce
            // uint 64 -- 0xcf
            token[0xcc] = writeN(0xcc, 1, Buffer.prototype.writeUInt8);
            token[0xcd] = writeN(0xcd, 2, Buffer.prototype.writeUInt16BE);
            token[0xce] = writeN(0xce, 4, Buffer.prototype.writeUInt32BE);
            token[0xcf] = writeN(0xcf, 8, writeUInt64BE);

            // int 8 -- 0xd0
            // int 16 -- 0xd1
            // int 32 -- 0xd2
            // int 64 -- 0xd3
            token[0xd0] = writeN(0xd0, 1, Buffer.prototype.writeInt8);
            token[0xd1] = writeN(0xd1, 2, Buffer.prototype.writeInt16BE);
            token[0xd2] = writeN(0xd2, 4, Buffer.prototype.writeInt32BE);
            token[0xd3] = writeN(0xd3, 8, writeInt64BE);

            // str 8 -- 0xd9
            // str 16 -- 0xda
            // str 32 -- 0xdb
            token[0xd9] = writeN(0xd9, 1, Buffer.prototype.writeUInt8);
            token[0xda] = writeN(0xda, 2, Buffer.prototype.writeUInt16BE);
            token[0xdb] = writeN(0xdb, 4, Buffer.prototype.writeUInt32BE);

            // array 16 -- 0xdc
            // array 32 -- 0xdd
            token[0xdc] = writeN(0xdc, 2, Buffer.prototype.writeUInt16BE);
            token[0xdd] = writeN(0xdd, 4, Buffer.prototype.writeUInt32BE);

            // map 16 -- 0xde
            // map 32 -- 0xdf
            token[0xde] = writeN(0xde, 2, Buffer.prototype.writeUInt16BE);
            token[0xdf] = writeN(0xdf, 4, Buffer.prototype.writeUInt32BE);

            return token;
        }

        function write1(type) {
            return function(encoder, value) {
                var offset = encoder.reserve(2);
                var buffer = encoder.buffer;
                buffer[offset++] = type;
                buffer[offset] = value;
            };
        }

        function write2(type) {
            return function(encoder, value) {
                var offset = encoder.reserve(3);
                var buffer = encoder.buffer;
                buffer[offset++] = type;
                buffer[offset++] = value >>> 8;
                buffer[offset] = value;
            };
        }

        function write4(type) {
            return function(encoder, value) {
                var offset = encoder.reserve(5);
                var buffer = encoder.buffer;
                buffer[offset++] = type;
                buffer[offset++] = value >>> 24;
                buffer[offset++] = value >>> 16;
                buffer[offset++] = value >>> 8;
                buffer[offset] = value;
            };
        }

        function writeN(type, len, method, noAssert) {
            return function(encoder, value) {
                var offset = encoder.reserve(len + 1);
                encoder.buffer[offset++] = type;
                method.call(encoder.buffer, value, offset, noAssert);
            };
        }

        function writeUInt64BE(value, offset) {
            new Uint64BE(this, offset, value);
        }

        function writeInt64BE(value, offset) {
            new Int64BE(this, offset, value);
        }

        function writeFloatBE(value, offset) {
            ieee754.write(this, value, offset, false, 23, 4);
        }

        function writeDoubleBE(value, offset) {
            ieee754.write(this, value, offset, false, 52, 8);
        }


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/write-type.js":
    /*!*****************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/write-type.js ***!
  \*****************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        // write-type.js

        var IS_ARRAY = __webpack_require__(/*! isarray */ "./node_modules/msgpack-lite/node_modules/isarray/index.js");
        var Int64Buffer = __webpack_require__(/*! int64-buffer */ "./node_modules/int64-buffer/int64-buffer.js");
        var Uint64BE = Int64Buffer.Uint64BE;
        var Int64BE = Int64Buffer.Int64BE;

        var Bufferish = __webpack_require__(/*! ./bufferish */ "./node_modules/msgpack-lite/lib/bufferish.js");
        var BufferProto = __webpack_require__(/*! ./bufferish-proto */ "./node_modules/msgpack-lite/lib/bufferish-proto.js");
        var WriteToken = __webpack_require__(/*! ./write-token */ "./node_modules/msgpack-lite/lib/write-token.js");
        var uint8 = __webpack_require__(/*! ./write-uint8 */ "./node_modules/msgpack-lite/lib/write-uint8.js").uint8;
        var ExtBuffer = __webpack_require__(/*! ./ext-buffer */ "./node_modules/msgpack-lite/lib/ext-buffer.js").ExtBuffer;

        var HAS_UINT8ARRAY = ("undefined" !== typeof Uint8Array);
        var HAS_MAP = ("undefined" !== typeof Map);

        var extmap = [];
        extmap[1] = 0xd4;
        extmap[2] = 0xd5;
        extmap[4] = 0xd6;
        extmap[8] = 0xd7;
        extmap[16] = 0xd8;

        exports.getWriteType = getWriteType;

        function getWriteType(options) {
            var token = WriteToken.getWriteToken(options);
            var useraw = options && options.useraw;
            var binarraybuffer = HAS_UINT8ARRAY && options && options.binarraybuffer;
            var isBuffer = binarraybuffer ? Bufferish.isArrayBuffer : Bufferish.isBuffer;
            var bin = binarraybuffer ? bin_arraybuffer : bin_buffer;
            var usemap = HAS_MAP && options && options.usemap;
            var map = usemap ? map_to_map : obj_to_map;

            var writeType = {
                "boolean": bool,
                "function": nil,
                "number": number,
                "object": (useraw ? object_raw : object),
                "string": _string(useraw ? raw_head_size : str_head_size),
                "symbol": nil,
                "undefined": nil
            };

            return writeType;

            // false -- 0xc2
            // true -- 0xc3
            function bool(encoder, value) {
                var type = value ? 0xc3 : 0xc2;
                token[type](encoder, value);
            }

            function number(encoder, value) {
                var ivalue = value | 0;
                var type;
                if (value !== ivalue) {
                    // float 64 -- 0xcb
                    type = 0xcb;
                    token[type](encoder, value);
                    return;
                } else if (-0x20 <= ivalue && ivalue <= 0x7F) {
                    // positive fixint -- 0x00 - 0x7f
                    // negative fixint -- 0xe0 - 0xff
                    type = ivalue & 0xFF;
                } else if (0 <= ivalue) {
                    // uint 8 -- 0xcc
                    // uint 16 -- 0xcd
                    // uint 32 -- 0xce
                    type = (ivalue <= 0xFF) ? 0xcc : (ivalue <= 0xFFFF) ? 0xcd : 0xce;
                } else {
                    // int 8 -- 0xd0
                    // int 16 -- 0xd1
                    // int 32 -- 0xd2
                    type = (-0x80 <= ivalue) ? 0xd0 : (-0x8000 <= ivalue) ? 0xd1 : 0xd2;
                }
                token[type](encoder, ivalue);
            }

            // uint 64 -- 0xcf
            function uint64(encoder, value) {
                var type = 0xcf;
                token[type](encoder, value.toArray());
            }

            // int 64 -- 0xd3
            function int64(encoder, value) {
                var type = 0xd3;
                token[type](encoder, value.toArray());
            }

            // str 8 -- 0xd9
            // str 16 -- 0xda
            // str 32 -- 0xdb
            // fixstr -- 0xa0 - 0xbf
            function str_head_size(length) {
                return (length < 32) ? 1 : (length <= 0xFF) ? 2 : (length <= 0xFFFF) ? 3 : 5;
            }

            // raw 16 -- 0xda
            // raw 32 -- 0xdb
            // fixraw -- 0xa0 - 0xbf
            function raw_head_size(length) {
                return (length < 32) ? 1 : (length <= 0xFFFF) ? 3 : 5;
            }

            function _string(head_size) {
                return string;

                function string(encoder, value) {
                    // prepare buffer
                    var length = value.length;
                    var maxsize = 5 + length * 3;
                    encoder.offset = encoder.reserve(maxsize);
                    var buffer = encoder.buffer;

                    // expected header size
                    var expected = head_size(length);

                    // expected start point
                    var start = encoder.offset + expected;

                    // write string
                    length = BufferProto.write.call(buffer, value, start);

                    // actual header size
                    var actual = head_size(length);

                    // move content when needed
                    if (expected !== actual) {
                        var targetStart = start + actual - expected;
                        var end = start + length;
                        BufferProto.copy.call(buffer, buffer, targetStart, start, end);
                    }

                    // write header
                    var type = (actual === 1) ? (0xa0 + length) : (actual <= 3) ? (0xd7 + actual) : 0xdb;
                    token[type](encoder, length);

                    // move cursor
                    encoder.offset += length;
                }
            }

            function object(encoder, value) {
                // null
                if (value === null) return nil(encoder, value);

                // Buffer
                if (isBuffer(value)) return bin(encoder, value);

                // Array
                if (IS_ARRAY(value)) return array(encoder, value);

                // int64-buffer objects
                if (Uint64BE.isUint64BE(value)) return uint64(encoder, value);
                if (Int64BE.isInt64BE(value)) return int64(encoder, value);

                // ext formats
                var packer = encoder.codec.getExtPacker(value);
                if (packer) value = packer(value);
                if (value instanceof ExtBuffer) return ext(encoder, value);

                // plain old Objects or Map
                map(encoder, value);
            }

            function object_raw(encoder, value) {
                // Buffer
                if (isBuffer(value)) return raw(encoder, value);

                // others
                object(encoder, value);
            }

            // nil -- 0xc0
            function nil(encoder, value) {
                var type = 0xc0;
                token[type](encoder, value);
            }

            // fixarray -- 0x90 - 0x9f
            // array 16 -- 0xdc
            // array 32 -- 0xdd
            function array(encoder, value) {
                var length = value.length;
                var type = (length < 16) ? (0x90 + length) : (length <= 0xFFFF) ? 0xdc : 0xdd;
                token[type](encoder, length);

                var encode = encoder.codec.encode;
                for (var i = 0; i < length; i++) {
                    encode(encoder, value[i]);
                }
            }

            // bin 8 -- 0xc4
            // bin 16 -- 0xc5
            // bin 32 -- 0xc6
            function bin_buffer(encoder, value) {
                var length = value.length;
                var type = (length < 0xFF) ? 0xc4 : (length <= 0xFFFF) ? 0xc5 : 0xc6;
                token[type](encoder, length);
                encoder.send(value);
            }

            function bin_arraybuffer(encoder, value) {
                bin_buffer(encoder, new Uint8Array(value));
            }

            // fixext 1 -- 0xd4
            // fixext 2 -- 0xd5
            // fixext 4 -- 0xd6
            // fixext 8 -- 0xd7
            // fixext 16 -- 0xd8
            // ext 8 -- 0xc7
            // ext 16 -- 0xc8
            // ext 32 -- 0xc9
            function ext(encoder, value) {
                var buffer = value.buffer;
                var length = buffer.length;
                var type = extmap[length] || ((length < 0xFF) ? 0xc7 : (length <= 0xFFFF) ? 0xc8 : 0xc9);
                token[type](encoder, length);
                uint8[value.type](encoder);
                encoder.send(buffer);
            }

            // fixmap -- 0x80 - 0x8f
            // map 16 -- 0xde
            // map 32 -- 0xdf
            function obj_to_map(encoder, value) {
                var keys = Object.keys(value);
                var length = keys.length;
                var type = (length < 16) ? (0x80 + length) : (length <= 0xFFFF) ? 0xde : 0xdf;
                token[type](encoder, length);

                var encode = encoder.codec.encode;
                keys.forEach(function(key) {
                    encode(encoder, key);
                    encode(encoder, value[key]);
                });
            }

            // fixmap -- 0x80 - 0x8f
            // map 16 -- 0xde
            // map 32 -- 0xdf
            function map_to_map(encoder, value) {
                if (!(value instanceof Map)) return obj_to_map(encoder, value);

                var length = value.size;
                var type = (length < 16) ? (0x80 + length) : (length <= 0xFFFF) ? 0xde : 0xdf;
                token[type](encoder, length);

                var encode = encoder.codec.encode;
                value.forEach(function(val, key, m) {
                    encode(encoder, key);
                    encode(encoder, val);
                });
            }

            // raw 16 -- 0xda
            // raw 32 -- 0xdb
            // fixraw -- 0xa0 - 0xbf
            function raw(encoder, value) {
                var length = value.length;
                var type = (length < 32) ? (0xa0 + length) : (length <= 0xFFFF) ? 0xda : 0xdb;
                token[type](encoder, length);
                encoder.send(value);
            }
        }


        /***/ }),

    /***/ "./node_modules/msgpack-lite/lib/write-uint8.js":
    /*!******************************************************!*\
  !*** ./node_modules/msgpack-lite/lib/write-uint8.js ***!
  \******************************************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        // write-unit8.js

        var constant = exports.uint8 = new Array(256);

        for (var i = 0x00; i <= 0xFF; i++) {
            constant[i] = write0(i);
        }

        function write0(type) {
            return function(encoder) {
                var offset = encoder.reserve(1);
                encoder.buffer[offset] = type;
            };
        }


        /***/ }),

    /***/ "./node_modules/msgpack-lite/node_modules/isarray/index.js":
    /*!*****************************************************************!*\
  !*** ./node_modules/msgpack-lite/node_modules/isarray/index.js ***!
  \*****************************************************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        var toString = {}.toString;

        module.exports = Array.isArray || function (arr) {
            return toString.call(arr) == '[object Array]';
        };


        /***/ }),

    /***/ "./node_modules/process/browser.js":
    /*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        // shim for using process in browser
        var process = module.exports = {};

        // cached from whatever global is present so that test runners that stub it
        // don't break things.  But we need to wrap it in a try catch in case it is
        // wrapped in strict mode code which doesn't define any globals.  It's inside a
        // function because try/catches deoptimize in certain engines.

        var cachedSetTimeout;
        var cachedClearTimeout;

        function defaultSetTimout() {
            throw new Error('setTimeout has not been defined');
        }
        function defaultClearTimeout () {
            throw new Error('clearTimeout has not been defined');
        }
        (function () {
            try {
                if (typeof setTimeout === 'function') {
                    cachedSetTimeout = setTimeout;
                } else {
                    cachedSetTimeout = defaultSetTimout;
                }
            } catch (e) {
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                if (typeof clearTimeout === 'function') {
                    cachedClearTimeout = clearTimeout;
                } else {
                    cachedClearTimeout = defaultClearTimeout;
                }
            } catch (e) {
                cachedClearTimeout = defaultClearTimeout;
            }
        } ())
        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
                //normal enviroments in sane situations
                return setTimeout(fun, 0);
            }
            // if setTimeout wasn't available but was latter defined
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                cachedSetTimeout = setTimeout;
                return setTimeout(fun, 0);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedSetTimeout(fun, 0);
            } catch(e){
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                    return cachedSetTimeout.call(null, fun, 0);
                } catch(e){
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }


        }
        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
                //normal enviroments in sane situations
                return clearTimeout(marker);
            }
            // if clearTimeout wasn't available but was latter defined
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                cachedClearTimeout = clearTimeout;
                return clearTimeout(marker);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedClearTimeout(marker);
            } catch (e){
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                    return cachedClearTimeout.call(null, marker);
                } catch (e){
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                    // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                    return cachedClearTimeout.call(this, marker);
                }
            }



        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;

        function cleanUpNextTick() {
            if (!draining || !currentQueue) {
                return;
            }
            draining = false;
            if (currentQueue.length) {
                queue = currentQueue.concat(queue);
            } else {
                queueIndex = -1;
            }
            if (queue.length) {
                drainQueue();
            }
        }

        function drainQueue() {
            if (draining) {
                return;
            }
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;

            var len = queue.length;
            while(len) {
                currentQueue = queue;
                queue = [];
                while (++queueIndex < len) {
                    if (currentQueue) {
                        currentQueue[queueIndex].run();
                    }
                }
                queueIndex = -1;
                len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
        }

        process.nextTick = function (fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
                runTimeout(drainQueue);
            }
        };

        // v8 likes predictible objects
        function Item(fun, array) {
            this.fun = fun;
            this.array = array;
        }
        Item.prototype.run = function () {
            this.fun.apply(null, this.array);
        };
        process.title = 'browser';
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = ''; // empty string to avoid regexp issues
        process.versions = {};

        function noop() {}

        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;

        process.listeners = function (name) { return [] }

        process.binding = function (name) {
            throw new Error('process.binding is not supported');
        };

        process.cwd = function () { return '/' };
        process.chdir = function (dir) {
            throw new Error('process.chdir is not supported');
        };
        process.umask = function() { return 0; };


        /***/ }),

    /***/ "./node_modules/punycode/punycode.js":
    /*!*******************************************!*\
  !*** ./node_modules/punycode/punycode.js ***!
  \*******************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        /* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
                                                              ;(function(root) {

                                                                  /** Detect free variables */
                                                                  var freeExports =  true && exports &&
                                                                      !exports.nodeType && exports;
                                                                  var freeModule =  true && module &&
                                                                      !module.nodeType && module;
                                                                  var freeGlobal = typeof global == 'object' && global;
                                                                  if (
                                                                      freeGlobal.global === freeGlobal ||
                                                                      freeGlobal.window === freeGlobal ||
                                                                      freeGlobal.self === freeGlobal
                                                                  ) {
                                                                      root = freeGlobal;
                                                                  }

                                                                  /**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
                                                                  var punycode,

                                                                      /** Highest positive signed 32-bit float value */
                                                                      maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

                                                                      /** Bootstring parameters */
                                                                      base = 36,
                                                                      tMin = 1,
                                                                      tMax = 26,
                                                                      skew = 38,
                                                                      damp = 700,
                                                                      initialBias = 72,
                                                                      initialN = 128, // 0x80
                                                                      delimiter = '-', // '\x2D'

                                                                      /** Regular expressions */
                                                                      regexPunycode = /^xn--/,
                                                                      regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
                                                                      regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

                                                                      /** Error messages */
                                                                      errors = {
                                                                          'overflow': 'Overflow: input needs wider integers to process',
                                                                          'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
                                                                          'invalid-input': 'Invalid input'
                                                                      },

                                                                      /** Convenience shortcuts */
                                                                      baseMinusTMin = base - tMin,
                                                                      floor = Math.floor,
                                                                      stringFromCharCode = String.fromCharCode,

                                                                      /** Temporary variable */
                                                                      key;

                                                                  /*--------------------------------------------------------------------------*/

                                                                  /**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
                                                                  function error(type) {
                                                                      throw new RangeError(errors[type]);
                                                                  }

                                                                  /**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
                                                                  function map(array, fn) {
                                                                      var length = array.length;
                                                                      var result = [];
                                                                      while (length--) {
                                                                          result[length] = fn(array[length]);
                                                                      }
                                                                      return result;
                                                                  }

                                                                  /**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
                                                                  function mapDomain(string, fn) {
                                                                      var parts = string.split('@');
                                                                      var result = '';
                                                                      if (parts.length > 1) {
                                                                          // In email addresses, only the domain name should be punycoded. Leave
                                                                          // the local part (i.e. everything up to `@`) intact.
                                                                          result = parts[0] + '@';
                                                                          string = parts[1];
                                                                      }
                                                                      // Avoid `split(regex)` for IE8 compatibility. See #17.
                                                                      string = string.replace(regexSeparators, '\x2E');
                                                                      var labels = string.split('.');
                                                                      var encoded = map(labels, fn).join('.');
                                                                      return result + encoded;
                                                                  }

                                                                  /**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
                                                                  function ucs2decode(string) {
                                                                      var output = [],
                                                                          counter = 0,
                                                                          length = string.length,
                                                                          value,
                                                                          extra;
                                                                      while (counter < length) {
                                                                          value = string.charCodeAt(counter++);
                                                                          if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
                                                                              // high surrogate, and there is a next character
                                                                              extra = string.charCodeAt(counter++);
                                                                              if ((extra & 0xFC00) == 0xDC00) { // low surrogate
                                                                                  output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
                                                                              } else {
                                                                                  // unmatched surrogate; only append this code unit, in case the next
                                                                                  // code unit is the high surrogate of a surrogate pair
                                                                                  output.push(value);
                                                                                  counter--;
                                                                              }
                                                                          } else {
                                                                              output.push(value);
                                                                          }
                                                                      }
                                                                      return output;
                                                                  }

                                                                  /**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
                                                                  function ucs2encode(array) {
                                                                      return map(array, function(value) {
                                                                          var output = '';
                                                                          if (value > 0xFFFF) {
                                                                              value -= 0x10000;
                                                                              output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
                                                                              value = 0xDC00 | value & 0x3FF;
                                                                          }
                                                                          output += stringFromCharCode(value);
                                                                          return output;
                                                                      }).join('');
                                                                  }

                                                                  /**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
                                                                  function basicToDigit(codePoint) {
                                                                      if (codePoint - 48 < 10) {
                                                                          return codePoint - 22;
                                                                      }
                                                                      if (codePoint - 65 < 26) {
                                                                          return codePoint - 65;
                                                                      }
                                                                      if (codePoint - 97 < 26) {
                                                                          return codePoint - 97;
                                                                      }
                                                                      return base;
                                                                  }

                                                                  /**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
                                                                  function digitToBasic(digit, flag) {
                                                                      //  0..25 map to ASCII a..z or A..Z
                                                                      // 26..35 map to ASCII 0..9
                                                                      return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
                                                                  }

                                                                  /**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
                                                                  function adapt(delta, numPoints, firstTime) {
                                                                      var k = 0;
                                                                      delta = firstTime ? floor(delta / damp) : delta >> 1;
                                                                      delta += floor(delta / numPoints);
                                                                      for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
                                                                          delta = floor(delta / baseMinusTMin);
                                                                      }
                                                                      return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
                                                                  }

                                                                  /**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
                                                                  function decode(input) {
                                                                      // Don't use UCS-2
                                                                      var output = [],
                                                                          inputLength = input.length,
                                                                          out,
                                                                          i = 0,
                                                                          n = initialN,
                                                                          bias = initialBias,
                                                                          basic,
                                                                          j,
                                                                          index,
                                                                          oldi,
                                                                          w,
                                                                          k,
                                                                          digit,
                                                                          t,
                                                                          /** Cached calculation results */
                                                                          baseMinusT;

                                                                      // Handle the basic code points: let `basic` be the number of input code
                                                                      // points before the last delimiter, or `0` if there is none, then copy
                                                                      // the first basic code points to the output.

                                                                      basic = input.lastIndexOf(delimiter);
                                                                      if (basic < 0) {
                                                                          basic = 0;
                                                                      }

                                                                      for (j = 0; j < basic; ++j) {
                                                                          // if it's not a basic code point
                                                                          if (input.charCodeAt(j) >= 0x80) {
                                                                              error('not-basic');
                                                                          }
                                                                          output.push(input.charCodeAt(j));
                                                                      }

                                                                      // Main decoding loop: start just after the last delimiter if any basic code
                                                                      // points were copied; start at the beginning otherwise.

                                                                      for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

                                                                          // `index` is the index of the next character to be consumed.
                                                                          // Decode a generalized variable-length integer into `delta`,
                                                                          // which gets added to `i`. The overflow checking is easier
                                                                          // if we increase `i` as we go, then subtract off its starting
                                                                          // value at the end to obtain `delta`.
                                                                          for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

                                                                              if (index >= inputLength) {
                                                                                  error('invalid-input');
                                                                              }

                                                                              digit = basicToDigit(input.charCodeAt(index++));

                                                                              if (digit >= base || digit > floor((maxInt - i) / w)) {
                                                                                  error('overflow');
                                                                              }

                                                                              i += digit * w;
                                                                              t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

                                                                              if (digit < t) {
                                                                                  break;
                                                                              }

                                                                              baseMinusT = base - t;
                                                                              if (w > floor(maxInt / baseMinusT)) {
                                                                                  error('overflow');
                                                                              }

                                                                              w *= baseMinusT;

                                                                          }

                                                                          out = output.length + 1;
                                                                          bias = adapt(i - oldi, out, oldi == 0);

                                                                          // `i` was supposed to wrap around from `out` to `0`,
                                                                          // incrementing `n` each time, so we'll fix that now:
                                                                          if (floor(i / out) > maxInt - n) {
                                                                              error('overflow');
                                                                          }

                                                                          n += floor(i / out);
                                                                          i %= out;

                                                                          // Insert `n` at position `i` of the output
                                                                          output.splice(i++, 0, n);

                                                                      }

                                                                      return ucs2encode(output);
                                                                  }

                                                                  /**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
                                                                  function encode(input) {
                                                                      var n,
                                                                          delta,
                                                                          handledCPCount,
                                                                          basicLength,
                                                                          bias,
                                                                          j,
                                                                          m,
                                                                          q,
                                                                          k,
                                                                          t,
                                                                          currentValue,
                                                                          output = [],
                                                                          /** `inputLength` will hold the number of code points in `input`. */
                                                                          inputLength,
                                                                          /** Cached calculation results */
                                                                          handledCPCountPlusOne,
                                                                          baseMinusT,
                                                                          qMinusT;

                                                                      // Convert the input in UCS-2 to Unicode
                                                                      input = ucs2decode(input);

                                                                      // Cache the length
                                                                      inputLength = input.length;

                                                                      // Initialize the state
                                                                      n = initialN;
                                                                      delta = 0;
                                                                      bias = initialBias;

                                                                      // Handle the basic code points
                                                                      for (j = 0; j < inputLength; ++j) {
                                                                          currentValue = input[j];
                                                                          if (currentValue < 0x80) {
                                                                              output.push(stringFromCharCode(currentValue));
                                                                          }
                                                                      }

                                                                      handledCPCount = basicLength = output.length;

                                                                      // `handledCPCount` is the number of code points that have been handled;
                                                                      // `basicLength` is the number of basic code points.

                                                                      // Finish the basic string - if it is not empty - with a delimiter
                                                                      if (basicLength) {
                                                                          output.push(delimiter);
                                                                      }

                                                                      // Main encoding loop:
                                                                      while (handledCPCount < inputLength) {

                                                                          // All non-basic code points < n have been handled already. Find the next
                                                                          // larger one:
                                                                          for (m = maxInt, j = 0; j < inputLength; ++j) {
                                                                              currentValue = input[j];
                                                                              if (currentValue >= n && currentValue < m) {
                                                                                  m = currentValue;
                                                                              }
                                                                          }

                                                                          // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
                                                                          // but guard against overflow
                                                                          handledCPCountPlusOne = handledCPCount + 1;
                                                                          if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
                                                                              error('overflow');
                                                                          }

                                                                          delta += (m - n) * handledCPCountPlusOne;
                                                                          n = m;

                                                                          for (j = 0; j < inputLength; ++j) {
                                                                              currentValue = input[j];

                                                                              if (currentValue < n && ++delta > maxInt) {
                                                                                  error('overflow');
                                                                              }

                                                                              if (currentValue == n) {
                                                                                  // Represent delta as a generalized variable-length integer
                                                                                  for (q = delta, k = base; /* no condition */; k += base) {
                                                                                      t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
                                                                                      if (q < t) {
                                                                                          break;
                                                                                      }
                                                                                      qMinusT = q - t;
                                                                                      baseMinusT = base - t;
                                                                                      output.push(
                                                                                          stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
                                                                                      );
                                                                                      q = floor(qMinusT / baseMinusT);
                                                                                  }

                                                                                  output.push(stringFromCharCode(digitToBasic(q, 0)));
                                                                                  bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                                                                                  delta = 0;
                                                                                  ++handledCPCount;
                                                                              }
                                                                          }

                                                                          ++delta;
                                                                          ++n;

                                                                      }
                                                                      return output.join('');
                                                                  }

                                                                  /**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
                                                                  function toUnicode(input) {
                                                                      return mapDomain(input, function(string) {
                                                                          return regexPunycode.test(string)
                                                                              ? decode(string.slice(4).toLowerCase())
                                                                          : string;
                                                                      });
                                                                  }

                                                                  /**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
                                                                  function toASCII(input) {
                                                                      return mapDomain(input, function(string) {
                                                                          return regexNonASCII.test(string)
                                                                              ? 'xn--' + encode(string)
                                                                          : string;
                                                                      });
                                                                  }

                                                                  /*--------------------------------------------------------------------------*/

                                                                  /** Define the public API */
                                                                  punycode = {
                                                                      /**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
                                                                      'version': '1.4.1',
                                                                      /**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
                                                                      'ucs2': {
                                                                          'decode': ucs2decode,
                                                                          'encode': ucs2encode
                                                                      },
                                                                      'decode': decode,
                                                                      'encode': encode,
                                                                      'toASCII': toASCII,
                                                                      'toUnicode': toUnicode
                                                                  };

                                                                  /** Expose `punycode` */
                                                                  // Some AMD build optimizers, like r.js, check for specific condition patterns
                                                                  // like the following:
                                                                  if (
                                                                      true
                                                                  ) {
                                                                      !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
                                                                          return punycode;
                                                                      }).call(exports, __webpack_require__, exports, module),
                                                                        __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                                                                  } else {}

                                                              }(this));

                                                              /* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module), __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

        /***/ }),

    /***/ "./node_modules/querystring-es3/decode.js":
    /*!************************************************!*\
  !*** ./node_modules/querystring-es3/decode.js ***!
  \************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";
        // Copyright Joyent, Inc. and other Node contributors.
        //
        // Permission is hereby granted, free of charge, to any person obtaining a
        // copy of this software and associated documentation files (the
        // "Software"), to deal in the Software without restriction, including
        // without limitation the rights to use, copy, modify, merge, publish,
        // distribute, sublicense, and/or sell copies of the Software, and to permit
        // persons to whom the Software is furnished to do so, subject to the
        // following conditions:
        //
        // The above copyright notice and this permission notice shall be included
        // in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
        // USE OR OTHER DEALINGS IN THE SOFTWARE.



        // If obj.hasOwnProperty has been overridden, then calling
        // obj.hasOwnProperty(prop) will break.
        // See: https://github.com/joyent/node/issues/1707
        function hasOwnProperty(obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        }

        module.exports = function(qs, sep, eq, options) {
            sep = sep || '&';
            eq = eq || '=';
            var obj = {};

            if (typeof qs !== 'string' || qs.length === 0) {
                return obj;
            }

            var regexp = /\+/g;
            qs = qs.split(sep);

            var maxKeys = 1000;
            if (options && typeof options.maxKeys === 'number') {
                maxKeys = options.maxKeys;
            }

            var len = qs.length;
            // maxKeys <= 0 means that we should not limit keys count
            if (maxKeys > 0 && len > maxKeys) {
                len = maxKeys;
            }

            for (var i = 0; i < len; ++i) {
                var x = qs[i].replace(regexp, '%20'),
                    idx = x.indexOf(eq),
                    kstr, vstr, k, v;

                if (idx >= 0) {
                    kstr = x.substr(0, idx);
                    vstr = x.substr(idx + 1);
                } else {
                    kstr = x;
                    vstr = '';
                }

                k = decodeURIComponent(kstr);
                v = decodeURIComponent(vstr);

                if (!hasOwnProperty(obj, k)) {
                    obj[k] = v;
                } else if (isArray(obj[k])) {
                    obj[k].push(v);
                } else {
                    obj[k] = [obj[k], v];
                }
            }

            return obj;
        };

        var isArray = Array.isArray || function (xs) {
            return Object.prototype.toString.call(xs) === '[object Array]';
        };


        /***/ }),

    /***/ "./node_modules/querystring-es3/encode.js":
    /*!************************************************!*\
  !*** ./node_modules/querystring-es3/encode.js ***!
  \************************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";
        // Copyright Joyent, Inc. and other Node contributors.
        //
        // Permission is hereby granted, free of charge, to any person obtaining a
        // copy of this software and associated documentation files (the
        // "Software"), to deal in the Software without restriction, including
        // without limitation the rights to use, copy, modify, merge, publish,
        // distribute, sublicense, and/or sell copies of the Software, and to permit
        // persons to whom the Software is furnished to do so, subject to the
        // following conditions:
        //
        // The above copyright notice and this permission notice shall be included
        // in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
        // USE OR OTHER DEALINGS IN THE SOFTWARE.



        var stringifyPrimitive = function(v) {
            switch (typeof v) {
                case 'string':
                    return v;

                case 'boolean':
                    return v ? 'true' : 'false';

                case 'number':
                    return isFinite(v) ? v : '';

                default:
                    return '';
            }
        };

        module.exports = function(obj, sep, eq, name) {
            sep = sep || '&';
            eq = eq || '=';
            if (obj === null) {
                obj = undefined;
            }

            if (typeof obj === 'object') {
                return map(objectKeys(obj), function(k) {
                    var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
                    if (isArray(obj[k])) {
                        return map(obj[k], function(v) {
                            return ks + encodeURIComponent(stringifyPrimitive(v));
                        }).join(sep);
                    } else {
                        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
                    }
                }).join(sep);

            }

            if (!name) return '';
            return encodeURIComponent(stringifyPrimitive(name)) + eq +
                encodeURIComponent(stringifyPrimitive(obj));
        };

        var isArray = Array.isArray || function (xs) {
            return Object.prototype.toString.call(xs) === '[object Array]';
        };

        function map (xs, f) {
            if (xs.map) return xs.map(f);
            var res = [];
            for (var i = 0; i < xs.length; i++) {
                res.push(f(xs[i], i));
            }
            return res;
        }

        var objectKeys = Object.keys || function (obj) {
            var res = [];
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
            }
            return res;
        };


        /***/ }),

    /***/ "./node_modules/querystring-es3/index.js":
    /*!***********************************************!*\
  !*** ./node_modules/querystring-es3/index.js ***!
  \***********************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";


        exports.decode = exports.parse = __webpack_require__(/*! ./decode */ "./node_modules/querystring-es3/decode.js");
        exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ "./node_modules/querystring-es3/encode.js");


        /***/ }),

    /***/ "./node_modules/url/url.js":
    /*!*********************************!*\
  !*** ./node_modules/url/url.js ***!
  \*********************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";
        // Copyright Joyent, Inc. and other Node contributors.
        //
        // Permission is hereby granted, free of charge, to any person obtaining a
        // copy of this software and associated documentation files (the
        // "Software"), to deal in the Software without restriction, including
        // without limitation the rights to use, copy, modify, merge, publish,
        // distribute, sublicense, and/or sell copies of the Software, and to permit
        // persons to whom the Software is furnished to do so, subject to the
        // following conditions:
        //
        // The above copyright notice and this permission notice shall be included
        // in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
        // USE OR OTHER DEALINGS IN THE SOFTWARE.



        var punycode = __webpack_require__(/*! punycode */ "./node_modules/punycode/punycode.js");
        var util = __webpack_require__(/*! ./util */ "./node_modules/url/util.js");

        exports.parse = urlParse;
        exports.resolve = urlResolve;
        exports.resolveObject = urlResolveObject;
        exports.format = urlFormat;

        exports.Url = Url;

        function Url() {
            this.protocol = null;
            this.slashes = null;
            this.auth = null;
            this.host = null;
            this.port = null;
            this.hostname = null;
            this.hash = null;
            this.search = null;
            this.query = null;
            this.pathname = null;
            this.path = null;
            this.href = null;
        }

        // Reference: RFC 3986, RFC 1808, RFC 2396

        // define these here so at least they only have to be
        // compiled once on the first module load.
        var protocolPattern = /^([a-z0-9.+-]+:)/i,
            portPattern = /:[0-9]*$/,

            // Special case for a simple path URL
            simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

            // RFC 2396: characters reserved for delimiting URLs.
            // We actually just auto-escape these.
            delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

            // RFC 2396: characters not allowed for various reasons.
            unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

            // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
            autoEscape = ['\''].concat(unwise),
            // Characters that are never ever allowed in a hostname.
            // Note that any invalid chars are also handled, but these
            // are the ones that are *expected* to be seen, so we fast-path
            // them.
            nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
            hostEndingChars = ['/', '?', '#'],
            hostnameMaxLen = 255,
            hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
            hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
            // protocols that can allow "unsafe" and "unwise" chars.
            unsafeProtocol = {
                'javascript': true,
                'javascript:': true
            },
            // protocols that never have a hostname.
            hostlessProtocol = {
                'javascript': true,
                'javascript:': true
            },
            // protocols that always contain a // bit.
            slashedProtocol = {
                'http': true,
                'https': true,
                'ftp': true,
                'gopher': true,
                'file': true,
                'http:': true,
                'https:': true,
                'ftp:': true,
                'gopher:': true,
                'file:': true
            },
            querystring = __webpack_require__(/*! querystring */ "./node_modules/querystring-es3/index.js");

        function urlParse(url, parseQueryString, slashesDenoteHost) {
            if (url && util.isObject(url) && url instanceof Url) return url;

            var u = new Url;
            u.parse(url, parseQueryString, slashesDenoteHost);
            return u;
        }

        Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
            if (!util.isString(url)) {
                throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
            }

            // Copy chrome, IE, opera backslash-handling behavior.
            // Back slashes before the query string get converted to forward slashes
            // See: https://code.google.com/p/chromium/issues/detail?id=25916
            var queryIndex = url.indexOf('?'),
                splitter =
                (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
                uSplit = url.split(splitter),
                slashRegex = /\\/g;
            uSplit[0] = uSplit[0].replace(slashRegex, '/');
            url = uSplit.join(splitter);

            var rest = url;

            // trim before proceeding.
            // This is to support parse stuff like "  http://foo.com  \n"
            rest = rest.trim();

            if (!slashesDenoteHost && url.split('#').length === 1) {
                // Try fast path regexp
                var simplePath = simplePathPattern.exec(rest);
                if (simplePath) {
                    this.path = rest;
                    this.href = rest;
                    this.pathname = simplePath[1];
                    if (simplePath[2]) {
                        this.search = simplePath[2];
                        if (parseQueryString) {
                            this.query = querystring.parse(this.search.substr(1));
                        } else {
                            this.query = this.search.substr(1);
                        }
                    } else if (parseQueryString) {
                        this.search = '';
                        this.query = {};
                    }
                    return this;
                }
            }

            var proto = protocolPattern.exec(rest);
            if (proto) {
                proto = proto[0];
                var lowerProto = proto.toLowerCase();
                this.protocol = lowerProto;
                rest = rest.substr(proto.length);
            }

            // figure out if it's got a host
            // user@server is *always* interpreted as a hostname, and url
            // resolution will treat //foo/bar as host=foo,path=bar because that's
            // how the browser resolves relative URLs.
            if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                var slashes = rest.substr(0, 2) === '//';
                if (slashes && !(proto && hostlessProtocol[proto])) {
                    rest = rest.substr(2);
                    this.slashes = true;
                }
            }

            if (!hostlessProtocol[proto] &&
                (slashes || (proto && !slashedProtocol[proto]))) {

                // there's a hostname.
                // the first instance of /, ?, ;, or # ends the host.
                //
                // If there is an @ in the hostname, then non-host chars *are* allowed
                // to the left of the last @ sign, unless some host-ending character
                // comes *before* the @-sign.
                // URLs are obnoxious.
                //
                // ex:
                // http://a@b@c/ => user:a@b host:c
                // http://a@b?@c => user:a host:c path:/?@c

                // v0.12 TODO(isaacs): This is not quite how Chrome does things.
                // Review our test case against browsers more comprehensively.

                // find the first instance of any hostEndingChars
                var hostEnd = -1;
                for (var i = 0; i < hostEndingChars.length; i++) {
                    var hec = rest.indexOf(hostEndingChars[i]);
                    if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
                        hostEnd = hec;
                }

                // at this point, either we have an explicit point where the
                // auth portion cannot go past, or the last @ char is the decider.
                var auth, atSign;
                if (hostEnd === -1) {
                    // atSign can be anywhere.
                    atSign = rest.lastIndexOf('@');
                } else {
                    // atSign must be in auth portion.
                    // http://a@b/c@d => host:b auth:a path:/c@d
                    atSign = rest.lastIndexOf('@', hostEnd);
                }

                // Now we have a portion which is definitely the auth.
                // Pull that off.
                if (atSign !== -1) {
                    auth = rest.slice(0, atSign);
                    rest = rest.slice(atSign + 1);
                    this.auth = decodeURIComponent(auth);
                }

                // the host is the remaining to the left of the first non-host char
                hostEnd = -1;
                for (var i = 0; i < nonHostChars.length; i++) {
                    var hec = rest.indexOf(nonHostChars[i]);
                    if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
                        hostEnd = hec;
                }
                // if we still have not hit it, then the entire thing is a host.
                if (hostEnd === -1)
                    hostEnd = rest.length;

                this.host = rest.slice(0, hostEnd);
                rest = rest.slice(hostEnd);

                // pull out port.
                this.parseHost();

                // we've indicated that there is a hostname,
                // so even if it's empty, it has to be present.
                this.hostname = this.hostname || '';

                // if hostname begins with [ and ends with ]
                // assume that it's an IPv6 address.
                var ipv6Hostname = this.hostname[0] === '[' &&
                    this.hostname[this.hostname.length - 1] === ']';

                // validate a little.
                if (!ipv6Hostname) {
                    var hostparts = this.hostname.split(/\./);
                    for (var i = 0, l = hostparts.length; i < l; i++) {
                        var part = hostparts[i];
                        if (!part) continue;
                        if (!part.match(hostnamePartPattern)) {
                            var newpart = '';
                            for (var j = 0, k = part.length; j < k; j++) {
                                if (part.charCodeAt(j) > 127) {
                                    // we replace non-ASCII char with a temporary placeholder
                                    // we need this to make sure size of hostname is not
                                    // broken by replacing non-ASCII by nothing
                                    newpart += 'x';
                                } else {
                                    newpart += part[j];
                                }
                            }
                            // we test again with ASCII char only
                            if (!newpart.match(hostnamePartPattern)) {
                                var validParts = hostparts.slice(0, i);
                                var notHost = hostparts.slice(i + 1);
                                var bit = part.match(hostnamePartStart);
                                if (bit) {
                                    validParts.push(bit[1]);
                                    notHost.unshift(bit[2]);
                                }
                                if (notHost.length) {
                                    rest = '/' + notHost.join('.') + rest;
                                }
                                this.hostname = validParts.join('.');
                                break;
                            }
                        }
                    }
                }

                if (this.hostname.length > hostnameMaxLen) {
                    this.hostname = '';
                } else {
                    // hostnames are always lower case.
                    this.hostname = this.hostname.toLowerCase();
                }

                if (!ipv6Hostname) {
                    // IDNA Support: Returns a punycoded representation of "domain".
                    // It only converts parts of the domain name that
                    // have non-ASCII characters, i.e. it doesn't matter if
                    // you call it with a domain that already is ASCII-only.
                    this.hostname = punycode.toASCII(this.hostname);
                }

                var p = this.port ? ':' + this.port : '';
                var h = this.hostname || '';
                this.host = h + p;
                this.href += this.host;

                // strip [ and ] from the hostname
                // the host field still retains them, though
                if (ipv6Hostname) {
                    this.hostname = this.hostname.substr(1, this.hostname.length - 2);
                    if (rest[0] !== '/') {
                        rest = '/' + rest;
                    }
                }
            }

            // now rest is set to the post-host stuff.
            // chop off any delim chars.
            if (!unsafeProtocol[lowerProto]) {

                // First, make 100% sure that any "autoEscape" chars get
                // escaped, even if encodeURIComponent doesn't think they
                // need to be.
                for (var i = 0, l = autoEscape.length; i < l; i++) {
                    var ae = autoEscape[i];
                    if (rest.indexOf(ae) === -1)
                        continue;
                    var esc = encodeURIComponent(ae);
                    if (esc === ae) {
                        esc = escape(ae);
                    }
                    rest = rest.split(ae).join(esc);
                }
            }


            // chop off from the tail first.
            var hash = rest.indexOf('#');
            if (hash !== -1) {
                // got a fragment string.
                this.hash = rest.substr(hash);
                rest = rest.slice(0, hash);
            }
            var qm = rest.indexOf('?');
            if (qm !== -1) {
                this.search = rest.substr(qm);
                this.query = rest.substr(qm + 1);
                if (parseQueryString) {
                    this.query = querystring.parse(this.query);
                }
                rest = rest.slice(0, qm);
            } else if (parseQueryString) {
                // no query string, but parseQueryString still requested
                this.search = '';
                this.query = {};
            }
            if (rest) this.pathname = rest;
            if (slashedProtocol[lowerProto] &&
                this.hostname && !this.pathname) {
                this.pathname = '/';
            }

            //to support http.request
            if (this.pathname || this.search) {
                var p = this.pathname || '';
                var s = this.search || '';
                this.path = p + s;
            }

            // finally, reconstruct the href based on what has been validated.
            this.href = this.format();
            return this;
        };

        // format a parsed object into a url string
        function urlFormat(obj) {
            // ensure it's an object, and not a string url.
            // If it's an obj, this is a no-op.
            // this way, you can call url_format() on strings
            // to clean up potentially wonky urls.
            if (util.isString(obj)) obj = urlParse(obj);
            if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
            return obj.format();
        }

        Url.prototype.format = function() {
            var auth = this.auth || '';
            if (auth) {
                auth = encodeURIComponent(auth);
                auth = auth.replace(/%3A/i, ':');
                auth += '@';
            }

            var protocol = this.protocol || '',
                pathname = this.pathname || '',
                hash = this.hash || '',
                host = false,
                query = '';

            if (this.host) {
                host = auth + this.host;
            } else if (this.hostname) {
                host = auth + (this.hostname.indexOf(':') === -1 ?
                               this.hostname :
                               '[' + this.hostname + ']');
                if (this.port) {
                    host += ':' + this.port;
                }
            }

            if (this.query &&
                util.isObject(this.query) &&
                Object.keys(this.query).length) {
                query = querystring.stringify(this.query);
            }

            var search = this.search || (query && ('?' + query)) || '';

            if (protocol && protocol.substr(-1) !== ':') protocol += ':';

            // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
            // unless they had them to begin with.
            if (this.slashes ||
                (!protocol || slashedProtocol[protocol]) && host !== false) {
                host = '//' + (host || '');
                if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
            } else if (!host) {
                host = '';
            }

            if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
            if (search && search.charAt(0) !== '?') search = '?' + search;

            pathname = pathname.replace(/[?#]/g, function(match) {
                return encodeURIComponent(match);
            });
            search = search.replace('#', '%23');

            return protocol + host + pathname + search + hash;
        };

        function urlResolve(source, relative) {
            return urlParse(source, false, true).resolve(relative);
        }

        Url.prototype.resolve = function(relative) {
            return this.resolveObject(urlParse(relative, false, true)).format();
        };

        function urlResolveObject(source, relative) {
            if (!source) return relative;
            return urlParse(source, false, true).resolveObject(relative);
        }

        Url.prototype.resolveObject = function(relative) {
            if (util.isString(relative)) {
                var rel = new Url();
                rel.parse(relative, false, true);
                relative = rel;
            }

            var result = new Url();
            var tkeys = Object.keys(this);
            for (var tk = 0; tk < tkeys.length; tk++) {
                var tkey = tkeys[tk];
                result[tkey] = this[tkey];
            }

            // hash is always overridden, no matter what.
            // even href="" will remove it.
            result.hash = relative.hash;

            // if the relative url is empty, then there's nothing left to do here.
            if (relative.href === '') {
                result.href = result.format();
                return result;
            }

            // hrefs like //foo/bar always cut to the protocol.
            if (relative.slashes && !relative.protocol) {
                // take everything except the protocol from relative
                var rkeys = Object.keys(relative);
                for (var rk = 0; rk < rkeys.length; rk++) {
                    var rkey = rkeys[rk];
                    if (rkey !== 'protocol')
                        result[rkey] = relative[rkey];
                }

                //urlParse appends trailing / to urls like http://www.example.com
                if (slashedProtocol[result.protocol] &&
                    result.hostname && !result.pathname) {
                    result.path = result.pathname = '/';
                }

                result.href = result.format();
                return result;
            }

            if (relative.protocol && relative.protocol !== result.protocol) {
                // if it's a known url protocol, then changing
                // the protocol does weird things
                // first, if it's not file:, then we MUST have a host,
                // and if there was a path
                // to begin with, then we MUST have a path.
                // if it is file:, then the host is dropped,
                // because that's known to be hostless.
                // anything else is assumed to be absolute.
                if (!slashedProtocol[relative.protocol]) {
                    var keys = Object.keys(relative);
                    for (var v = 0; v < keys.length; v++) {
                        var k = keys[v];
                        result[k] = relative[k];
                    }
                    result.href = result.format();
                    return result;
                }

                result.protocol = relative.protocol;
                if (!relative.host && !hostlessProtocol[relative.protocol]) {
                    var relPath = (relative.pathname || '').split('/');
                    while (relPath.length && !(relative.host = relPath.shift()));
                    if (!relative.host) relative.host = '';
                    if (!relative.hostname) relative.hostname = '';
                    if (relPath[0] !== '') relPath.unshift('');
                    if (relPath.length < 2) relPath.unshift('');
                    result.pathname = relPath.join('/');
                } else {
                    result.pathname = relative.pathname;
                }
                result.search = relative.search;
                result.query = relative.query;
                result.host = relative.host || '';
                result.auth = relative.auth;
                result.hostname = relative.hostname || relative.host;
                result.port = relative.port;
                // to support http.request
                if (result.pathname || result.search) {
                    var p = result.pathname || '';
                    var s = result.search || '';
                    result.path = p + s;
                }
                result.slashes = result.slashes || relative.slashes;
                result.href = result.format();
                return result;
            }

            var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
                isRelAbs = (
                    relative.host ||
                    relative.pathname && relative.pathname.charAt(0) === '/'
                ),
                mustEndAbs = (isRelAbs || isSourceAbs ||
                              (result.host && relative.pathname)),
                removeAllDots = mustEndAbs,
                srcPath = result.pathname && result.pathname.split('/') || [],
                relPath = relative.pathname && relative.pathname.split('/') || [],
                psychotic = result.protocol && !slashedProtocol[result.protocol];

            // if the url is a non-slashed url, then relative
            // links like ../.. should be able
            // to crawl up to the hostname, as well.  This is strange.
            // result.protocol has already been set by now.
            // Later on, put the first path part into the host field.
            if (psychotic) {
                result.hostname = '';
                result.port = null;
                if (result.host) {
                    if (srcPath[0] === '') srcPath[0] = result.host;
                    else srcPath.unshift(result.host);
                }
                result.host = '';
                if (relative.protocol) {
                    relative.hostname = null;
                    relative.port = null;
                    if (relative.host) {
                        if (relPath[0] === '') relPath[0] = relative.host;
                        else relPath.unshift(relative.host);
                    }
                    relative.host = null;
                }
                mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
            }

            if (isRelAbs) {
                // it's absolute.
                result.host = (relative.host || relative.host === '') ?
                    relative.host : result.host;
                result.hostname = (relative.hostname || relative.hostname === '') ?
                    relative.hostname : result.hostname;
                result.search = relative.search;
                result.query = relative.query;
                srcPath = relPath;
                // fall through to the dot-handling below.
            } else if (relPath.length) {
                // it's relative
                // throw away the existing file, and take the new path instead.
                if (!srcPath) srcPath = [];
                srcPath.pop();
                srcPath = srcPath.concat(relPath);
                result.search = relative.search;
                result.query = relative.query;
            } else if (!util.isNullOrUndefined(relative.search)) {
                // just pull out the search.
                // like href='?foo'.
                // Put this after the other two cases because it simplifies the booleans
                if (psychotic) {
                    result.hostname = result.host = srcPath.shift();
                    //occationaly the auth can get stuck only in host
                    //this especially happens in cases like
                    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
                    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                        result.host.split('@') : false;
                    if (authInHost) {
                        result.auth = authInHost.shift();
                        result.host = result.hostname = authInHost.shift();
                    }
                }
                result.search = relative.search;
                result.query = relative.query;
                //to support http.request
                if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
                    result.path = (result.pathname ? result.pathname : '') +
                        (result.search ? result.search : '');
                }
                result.href = result.format();
                return result;
            }

            if (!srcPath.length) {
                // no path at all.  easy.
                // we've already handled the other stuff above.
                result.pathname = null;
                //to support http.request
                if (result.search) {
                    result.path = '/' + result.search;
                } else {
                    result.path = null;
                }
                result.href = result.format();
                return result;
            }

            // if a url ENDs in . or .., then it must get a trailing slash.
            // however, if it ends in anything else non-slashy,
            // then it must NOT get a trailing slash.
            var last = srcPath.slice(-1)[0];
            var hasTrailingSlash = (
                (result.host || relative.host || srcPath.length > 1) &&
                (last === '.' || last === '..') || last === '');

            // strip single dots, resolve double dots to parent dir
            // if the path tries to go above the root, `up` ends up > 0
            var up = 0;
            for (var i = srcPath.length; i >= 0; i--) {
                last = srcPath[i];
                if (last === '.') {
                    srcPath.splice(i, 1);
                } else if (last === '..') {
                    srcPath.splice(i, 1);
                    up++;
                } else if (up) {
                    srcPath.splice(i, 1);
                    up--;
                }
            }

            // if the path is allowed to go above the root, restore leading ..s
            if (!mustEndAbs && !removeAllDots) {
                for (; up--; up) {
                    srcPath.unshift('..');
                }
            }

            if (mustEndAbs && srcPath[0] !== '' &&
                (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
                srcPath.unshift('');
            }

            if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
                srcPath.push('');
            }

            var isAbsolute = srcPath[0] === '' ||
                (srcPath[0] && srcPath[0].charAt(0) === '/');

            // put the host back
            if (psychotic) {
                result.hostname = result.host = isAbsolute ? '' :
                srcPath.length ? srcPath.shift() : '';
                //occationaly the auth can get stuck only in host
                //this especially happens in cases like
                //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
                var authInHost = result.host && result.host.indexOf('@') > 0 ?
                    result.host.split('@') : false;
                if (authInHost) {
                    result.auth = authInHost.shift();
                    result.host = result.hostname = authInHost.shift();
                }
            }

            mustEndAbs = mustEndAbs || (result.host && srcPath.length);

            if (mustEndAbs && !isAbsolute) {
                srcPath.unshift('');
            }

            if (!srcPath.length) {
                result.pathname = null;
                result.path = null;
            } else {
                result.pathname = srcPath.join('/');
            }

            //to support request.http
            if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
                result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
            }
            result.auth = relative.auth || result.auth;
            result.slashes = result.slashes || relative.slashes;
            result.href = result.format();
            return result;
        };

        Url.prototype.parseHost = function() {
            var host = this.host;
            var port = portPattern.exec(host);
            if (port) {
                port = port[0];
                if (port !== ':') {
                    this.port = port.substr(1);
                }
                host = host.substr(0, host.length - port.length);
            }
            if (host) this.hostname = host;
        };


        /***/ }),

    /***/ "./node_modules/url/util.js":
    /*!**********************************!*\
  !*** ./node_modules/url/util.js ***!
  \**********************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";


        module.exports = {
            isString: function(arg) {
                return typeof(arg) === 'string';
            },
            isObject: function(arg) {
                return typeof(arg) === 'object' && arg !== null;
            },
            isNull: function(arg) {
                return arg === null;
            },
            isNullOrUndefined: function(arg) {
                return arg == null;
            }
        };


        /***/ }),

    /***/ "./node_modules/webpack/buildin/global.js":
    /*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        var g;

        // This works in non-strict mode
        g = (function() {
            return this;
        })();

        try {
            // This works if eval is allowed (see CSP)
            g = g || new Function("return this")();
        } catch (e) {
            // This works if the window reference is available
            if (typeof window === "object") g = window;
        }

        // g can still be undefined, but nothing to do about it...
        // We return undefined, instead of nothing here, so it's
        // easier to handle this case. if(!global) { ...}

        module.exports = g;


        /***/ }),

    /***/ "./node_modules/webpack/buildin/module.js":
    /*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        module.exports = function(module) {
            if (!module.webpackPolyfill) {
                module.deprecate = function() {};
                module.paths = [];
                // module.parent = undefined by default
                if (!module.children) module.children = [];
                Object.defineProperty(module, "loaded", {
                    enumerable: true,
                    get: function() {
                        return module.l;
                    }
                });
                Object.defineProperty(module, "A", {
                    enumerable: true,
                    get: function() {
                        return module.i;
                    }
                });
                module.webpackPolyfill = 1;
            }
            return module;
        };


        /***/ }),

    /***/ "./src/js/app.js":
    /*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";


        window.loadedScript = true;

        // ENV:
        var isProd = location.hostname !== "127.0.0.1" && !location.hostname.startsWith("192.168.");

        // IMPORTS:
        __webpack_require__(/*! ./libs/modernizr.js */ "./src/js/libs/modernizr.js");
        var io = __webpack_require__(/*! ./libs/io-client.js */ "./src/js/libs/io-client.js");
        var UTILS = __webpack_require__(/*! ./libs/utils.js */ "./src/js/libs/utils.js");
        var animText = __webpack_require__(/*! ./libs/animText.js */ "./src/js/libs/animText.js");
        var config = __webpack_require__(/*! ./config.js */ "./src/js/config.js");
        var GameObject = __webpack_require__(/*! ./data/gameObject.js */ "./src/js/data/gameObject.js");
        var items = __webpack_require__(/*! ./data/items.js */ "./src/js/data/items.js");
        var MapManager = __webpack_require__(/*! ./data/mapManager.js */ "./src/js/data/mapManager.js");
        var ObjectManager = __webpack_require__(/*! ./data/objectManager.js */ "./src/js/data/objectManager.js");
        var Player = __webpack_require__(/*! ./data/player.js */ "./src/js/data/player.js");
        var store = __webpack_require__(/*! ./data/store.js */ "./src/js/data/store.js");
        var Projectile = __webpack_require__(/*! ./data/projectile.js */ "./src/js/data/projectile.js");
        var ProjectileManager = __webpack_require__(/*! ./data/projectileManager.js */ "./src/js/data/projectileManager.js");
        var SoundManager = __webpack_require__(/*! ./libs/soundManager.js */ "./src/js/libs/soundManager.js").obj;
        var textManager = new animText.TextManager();

        // URL PARAMS:
        function getParameterByName(name, url) {
            if (!url) {
                url = window.location.href;
            }
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        // SOCKET & CONNECTION:
        var connected = false;
        var startedConnecting = false;

        window.OriginalWebSocket = window.WebSocket;
        window.WebSocket = class {
            constructor(wsAddr) {
                if(!wsAddress){
                    wsAddress = wsAddr;
                }

                connectSocket(wsAddr);
            };
        }
        function connectSocket(wsAddress) {
            // CONNECT:
            io.connect(wsAddress, function(error) {
                pingSocket();
                setInterval(() => pingSocket(), 2500);

                if (error) {
                    disconnect(error);
                } else {
                    connected = true;
                    startGame();

                    // DEFINE ENTER GAME BUTTON ON CLICK:
                    enterGameButton.onclick = UTILS.checkTrusted(function() {
                        // START GAME:
                        enterGame();
                    });
                    UTILS.hookTouchEvents(enterGameButton);
                }
            }, {
                "A": setInitData,
                "B": disconnect,
                "C": setupGame,
                "D": addPlayer,
                "E": removePlayer,
                "a": updatePlayers,
                "G": updateLeaderboard,
                "H": loadGameObject,
                "I": loadAI,
                "J": animateAI,
                "K": gatherAnimation,
                "L": wiggleGameObject,
                "M": shootTurret,
                "N": updatePlayerValue,
                "O": updateHealth,
                "P": killPlayer,
                "Q": killObject,
                "R": killObjects,
                "S": updateItemCounts,
                "T": updateAge,
                "U": updateUpgrades,
                "V": updateItems,
                "X": addProjectile,
                "Y": remProjectile,
                "Z": serverShutdownNotice,
                "g": addAlliance,
                "1": deleteAlliance,
                "2": allianceNotification,
                "3": setPlayerTeam,
                "4": setAlliancePlayers,
                "5": updateStoreItems,
                "6": receiveChat,
                "7": updateMinimap,
                "8": showText,
                "9": pingMap,
                "0": pingSocketResponse
            });
        }
        function socketReady() {
            return (io.connected);
        }

        function joinParty() {
            var currentKey = serverBrowser.value;
            var key = prompt("party key", currentKey);
            if (key) {
                window.onbeforeunload = undefined; // Don't ask to leave
                window.location.href = "/?server=" + key;
            }
        } /**/

        // SOUND:
        var Sound = new SoundManager(config, UTILS);
        function toggleSound(active) {
            if (active == undefined)
                active = !Sound.active;
            Sound.active = active;
            //Sound.toggleMute("menu", !active);
            saveVal("moo_moosic", active?1:0);
        }

        // MATHS:
        var mathPI = Math.PI;
        var mathPI2 = mathPI * 2;
        var mathPI3 = mathPI * 3;
        Math.lerpAngle = function (value1, value2, amount) {
            var difference = Math.abs(value2 - value1);
            if (difference > mathPI) {
                if (value1 > value2) {
                    value2 += mathPI2;
                } else {
                    value1 += mathPI2;
                }
            }
            var value = (value2 + ((value1 - value2) * amount));
            if (value >= 0 && value <= mathPI2)
                return value;
            return (value % mathPI2);
        }

        // REOUNDED RECTANGLE:
        CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) r = h / 2;
            if (r < 0)
                r = 0;
            this.beginPath();
            this.moveTo(x+r, y);
            this.arcTo(x+w, y, x+w, y+h, r);
            this.arcTo(x+w, y+h, x, y+h, r);
            this.arcTo(x, y+h, x, y, r);
            this.arcTo(x, y, x+w, y, r);
            this.closePath();
            return this;
        }

        // STORAGE:
        var canStore;
        if (typeof(Storage) !== "undefined") {
            canStore = true;
        }
        function saveVal(name, val) {
            if (canStore)
                localStorage.setItem(name, val);
        }
        function deleteVal(name) {
            if (canStore)
                localStorage.removeItem(name);
        }
        function getSavedVal(name) {
            if (canStore)
                return localStorage.getItem(name);
            return null;
        }

        // TERMS:

        // GLOBAL VALUES:
        var moofoll = getSavedVal("moofoll");
        function follmoo() {
            if (!moofoll) {
                moofoll = true;
                saveVal("moofoll", 1);
            }
        }
        var useNativeResolution;
        var showPing;
        var playSound;
        var pixelDensity = 1;
        var delta, now, lastSent;
        var lastUpdate = Date.now();
        var keys, attackState;
        var ais = [];
        var players = [];
        var alliances = [];
        var gameObjects = [];
        var projectiles = [];
        var projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, config, UTILS);
        var AiManager = __webpack_require__(/*! ./data/aiManager.js */ "./src/js/data/aiManager.js");
        var AI = __webpack_require__(/*! ./data/ai.js */ "./src/js/data/ai.js");
        var aiManager = new AiManager(ais, AI, players, items, null, config, UTILS);
        var myPlayer, myPlayerSID, tmpObj;
        var waterMult = 1;
        var waterPlus = 0;
        var mouseX = 0;
        var mouseY = 0;
        var controllingTouch = {
            id: -1,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0
        };
        var attackingTouch = {
            id: -1,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0
        };
        var camX, camY;
        var tmpDir;
        var skinColor = 0;
        var selectSkinIndex = 0;
        var maxScreenWidth = config.maxScreenWidth;
        var maxScreenHeight = config.maxScreenHeight;
        var screenWidth, screenHeight;
        var inGame = false;
        var adContainer = document.getElementById("ad-container");
        var mainMenu = document.getElementById("mainMenu");
        var enterGameButton = document.getElementById("enterGame");
        var promoImageButton = document.getElementById("promoImg");
        var promoImageHolder = document.getElementById("promoImgHolder");
        // block squid game ad
        promoImageButton.remove();
        promoImageHolder.remove();
        var partyButton = document.getElementById("partyButton");
        var joinPartyButton = document.getElementById("joinPartyButton");
        var settingsButton = document.getElementById("settingsButton");
        var settingsButtonTitle = settingsButton.getElementsByTagName("span")[0];
        var allianceButton = document.getElementById("allianceButton");
        var storeButton = document.getElementById("storeButton");
        var chatButton = document.getElementById("chatButton");
        var gameCanvas = document.getElementById("gameCanvas");
        var mainContext = gameCanvas.getContext("2d");
        var serverBrowser = document.getElementById("serverBrowser");
        var nativeResolutionCheckbox = document.getElementById("nativeResolution");
        var showPingCheckbox = document.getElementById("showPing");
        var playMusicCheckbox = document.getElementById("playMusic");
        var pingDisplay = document.getElementById("pingDisplay");
        var shutdownDisplay = document.getElementById("shutdownDisplay");
        var menuCardHolder = document.getElementById("menuCardHolder");
        var guideCard = document.getElementById("guideCard");
        var loadingText = document.getElementById("loadingText");
        var gameUI = document.getElementById("gameUI");
        var actionBar = document.getElementById("actionBar");
        var scoreDisplay = document.getElementById("scoreDisplay");
        var foodDisplay = document.getElementById("foodDisplay");
        var woodDisplay = document.getElementById("woodDisplay");
        var stoneDisplay = document.getElementById("stoneDisplay");
        var killCounter = document.getElementById("killCounter");
        var leaderboardData = document.getElementById("leaderboardData");
        var nameInput = document.getElementById("nameInput");
        var itemInfoHolder = document.getElementById("itemInfoHolder");
        var ageText = document.getElementById("ageText");
        var ageBarBody = document.getElementById("ageBarBody");
        var upgradeHolder = document.getElementById("upgradeHolder");
        var upgradeCounter = document.getElementById("upgradeCounter");
        var allianceMenu = document.getElementById("allianceMenu");
        var allianceHolder = document.getElementById("allianceHolder");
        var allianceManager = document.getElementById("allianceManager");
        var mapDisplay = document.getElementById("mapDisplay");
        var diedText = document.getElementById("diedText");
        var skinColorHolder = document.getElementById("skinColorHolder");
        var mapContext = mapDisplay.getContext("2d");
        mapDisplay.width = 300;
        mapDisplay.height = 300;
        var storeMenu = document.getElementById("storeMenu");
        var storeHolder = document.getElementById("storeHolder");
        var noticationDisplay = document.getElementById("noticationDisplay");
        var hats = store.hats;
        var accessories = store.accessories;
        var objectManager = new ObjectManager(GameObject, gameObjects, UTILS, config);
        var outlineColor = "#525252";
        var darkOutlineColor = "#3d3f42";
        var outlineWidth = 5.5;

        // SET INIT DATA:
        function setInitData(data) {
            alliances = data.teams;
        }

        // ON LOAD:
        var inWindow = true;
        var didLoad = false;
        var captchaReady = false;
        window.onblur = function() {
            inWindow = false;
        };
        window.onfocus = function() {
            inWindow = true;
            if (myPlayer && myPlayer.alive) {
                resetMoveDir();
            }
        };
        window.onload = function() {
            didLoad = true;
        };
        window.captchaCallback = function() {
            captchaReady = true;
        };
        gameCanvas.oncontextmenu = function() {
            return false;
        };
        function disconnect(reason) {
            connected = false;
            io.close();
            showLoadingText(reason);
        }
        function showLoadingText(text) {
            mainMenu.style.display = "block";
            gameUI.style.display = "none";
            menuCardHolder.style.display = "none";
            diedText.style.display = "none";
            loadingText.style.display = "block";
            loadingText.innerHTML = text +
                "<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>";
        }

        // BUTTON EVENTS:
        function bindEvents() {
            enterGameButton.onclick = UTILS.checkTrusted(function() {
                // SHOW AD TO START GAME:
                // showPreAdIfReady();
            });
            UTILS.hookTouchEvents(enterGameButton);
            promoImageButton.onclick = UTILS.checkTrusted(function() {
                openLink('https://krunker.io/?play=SquidGame_KB');
            });
            UTILS.hookTouchEvents(promoImageButton);
            joinPartyButton.onclick = UTILS.checkTrusted(function() {
                setTimeout(function() { joinParty(); }, 10);
            });
            UTILS.hookTouchEvents(joinPartyButton);
            settingsButton.onclick = UTILS.checkTrusted(function() {
                toggleSettings();
            });
            UTILS.hookTouchEvents(settingsButton);
            allianceButton.onclick = UTILS.checkTrusted(function() {
                toggleAllianceMenu();
            });
            UTILS.hookTouchEvents(allianceButton);
            storeButton.onclick = UTILS.checkTrusted(function() {
                toggleStoreMenu();
            });
            UTILS.hookTouchEvents(storeButton);
            chatButton.onclick = UTILS.checkTrusted(function() {
                toggleChat();
            });
            UTILS.hookTouchEvents(chatButton);
            mapDisplay.onclick = UTILS.checkTrusted(function() {
                sendMapPing();
            });
            UTILS.hookTouchEvents(mapDisplay);
        }

        // SHOW ITEM INFO:
        function showItemInfo(item, isWeapon, isStoreItem) {
            if (myPlayer && item) {
                UTILS.removeAllChildren(itemInfoHolder);
                itemInfoHolder.classList.add("visible");
                // chatButton.classList.add("hide");
                UTILS.generateElement({
                    id: "itemInfoName",
                    text: UTILS.capitalizeFirst(item.name),
                    parent: itemInfoHolder
                });
                UTILS.generateElement({
                    id: "itemInfoDesc",
                    text: item.desc,
                    parent: itemInfoHolder
                });
                if (isStoreItem) {

                } else if (isWeapon) {
                    UTILS.generateElement({
                        class: "itemInfoReq",
                        text: !item.type?"primary":"secondary",
                        parent: itemInfoHolder
                    });
                } else {
                    for (var i = 0; i < item.req.length; i += 2) {
                        UTILS.generateElement({
                            class: "itemInfoReq",
                            html: item.req[i] + "<span class='itemInfoReqVal'> x" + item.req[i + 1] + "</span>",
                            parent: itemInfoHolder
                        });
                    }
                    if (item.group.limit) {
                        UTILS.generateElement({
                            class: "itemInfoLmt",
                            text: (myPlayer.itemCounts[item.group.id]||0) + "/" + item.group.limit,
                            parent: itemInfoHolder
                        });
                    }
                }
            } else {
                itemInfoHolder.classList.remove("visible");
                // chatButton.classList.remove("hide");
            }
        }

        // SHOW ALLIANCE MENU:
        var allianceNotifications = [];
        var alliancePlayers = [];
        function allianceNotification(sid, name) {
            allianceNotifications.push({
                sid: sid,
                name: name
            });
            updateNotifications();
        }
        function updateNotifications() {
            if (allianceNotifications[0]) {
                var tmpN = allianceNotifications[0];
                UTILS.removeAllChildren(noticationDisplay);
                noticationDisplay.style.display = "block";
                UTILS.generateElement({
                    class: "notificationText",
                    text: tmpN.name,
                    parent: noticationDisplay
                });
                UTILS.generateElement({
                    class: "notifButton",
                    html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>",
                    parent: noticationDisplay,
                    onclick: function() { aJoinReq(0); },
                    hookTouch: true
                });
                UTILS.generateElement({
                    class: "notifButton",
                    html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>",
                    parent: noticationDisplay,
                    onclick: function() { aJoinReq(1); },
                    hookTouch: true
                });
            } else {
                noticationDisplay.style.display = "none";
            }
        }
        function addAlliance(data) {
            alliances.push(data);
            if (allianceMenu.style.display == "block")
                showAllianceMenu();
        }
        function setPlayerTeam(team, isOwner) {
            if (myPlayer) {
                myPlayer.team = team;
                myPlayer.isOwner = isOwner;
                if (allianceMenu.style.display == "block")
                    showAllianceMenu();
            }
        }
        function setAlliancePlayers(data) {
            alliancePlayers = data;
            if (allianceMenu.style.display == "block")
                showAllianceMenu();
        }
        function deleteAlliance(sid) {
            for (var i = alliances.length - 1; i >= 0; i--) {
                if (alliances[i].sid == sid)
                    alliances.splice(i, 1);
            }
            if (allianceMenu.style.display == "block")
                showAllianceMenu();
        }
        function toggleAllianceMenu() {
            resetMoveDir();
            if (allianceMenu.style.display != "block") {
                showAllianceMenu();
            } else {
                allianceMenu.style.display = "none";
            }
        }
        function showAllianceMenu() {
            if (myPlayer && myPlayer.alive) {
                closeChat();
                storeMenu.style.display = "none";
                allianceMenu.style.display = "block";
                UTILS.removeAllChildren(allianceHolder);
                if (myPlayer.team) {
                    for (var i = 0; i < alliancePlayers.length; i+=2) {
                        (function(i) {
                            var tmp = UTILS.generateElement({
                                class: "allianceItem",
                                style: "color:" + (alliancePlayers[i]==myPlayer.sid ? "#fff" : "rgba(255,255,255,0.6)"),
                                text: alliancePlayers[i+1],
                                parent: allianceHolder
                            });
                            if (myPlayer.isOwner && alliancePlayers[i] != myPlayer.sid) {
                                UTILS.generateElement({
                                    class: "joinAlBtn",
                                    text: "Kick",
                                    onclick: function() { kickFromClan(alliancePlayers[i]); },
                                    hookTouch: true,
                                    parent: tmp
                                });
                            }
                        })(i);
                    }
                } else {
                    if (alliances.length) {
                        for (var i = 0; i < alliances.length; ++i) {
                            (function(i) {
                                var tmp = UTILS.generateElement({
                                    class: "allianceItem",
                                    style: "color:" + (alliances[i].sid==myPlayer.team ? "#fff" : "rgba(255,255,255,0.6)"),
                                    text: alliances[i].sid,
                                    parent: allianceHolder
                                });
                                UTILS.generateElement({
                                    class: "joinAlBtn",
                                    text: "Join",
                                    onclick: function() { sendJoin(i); },
                                    hookTouch: true,
                                    parent: tmp
                                });
                            })(i);
                        }
                    } else {
                        UTILS.generateElement({
                            class: "allianceItem",
                            text: "No Tribes Yet",
                            parent: allianceHolder
                        });
                    }
                }
                UTILS.removeAllChildren(allianceManager);
                if (myPlayer.team) {
                    UTILS.generateElement({
                        class: "allianceButtonM",
                        style: "width: 360px",
                        text: myPlayer.isOwner? "Delete Tribe" : "Leave Tribe",
                        onclick: function() { leaveAlliance() },
                        hookTouch: true,
                        parent: allianceManager
                    });
                } else {
                    UTILS.generateElement({
                        tag: "input",
                        type: "text",
                        id: "allianceInput",
                        maxLength: 7,
                        placeholder: "unique name",
                        ontouchstart: function(ev) {
                            ev.preventDefault();
                            var newValue = prompt("unique name", ev.currentTarget.value);
                            ev.currentTarget.value = newValue.slice(0, 7);
                        },
                        parent: allianceManager
                    });
                    UTILS.generateElement({
                        tag: "div",
                        class: "allianceButtonM",
                        style: "width: 140px;",
                        text: "Create",
                        onclick: function() { createAlliance(); },
                        hookTouch: true,
                        parent: allianceManager
                    });
                }
            }
        }
        function aJoinReq(join) {
            io.send("P", allianceNotifications[0].sid, join);
            allianceNotifications.splice(0, 1);
            updateNotifications();
        }
        function kickFromClan(sid) {
            io.send("Q", sid);
        }
        function sendJoin(index) {
            io.send("b", alliances[index].sid);
        }
        function createAlliance() {
            io.send("L", document.getElementById("allianceInput").value);
        }
        function leaveAlliance() {
            allianceNotifications = [];
            updateNotifications();
            io.send("N");
        }

        // MINIMAP:
        var lastDeath;
        var minimapData;
        var mapMarker;
        var mapPings = [];
        var tmpPing;
        function MapPing() {
            this.init = function(x, y) {
                this.scale = 0;
                this.x = x;
                this.y = y;
                this.active = true;
            };
            this.update = function(ctxt, delta) {
                if (this.active) {
                    this.scale += 0.05 * delta;
                    if (this.scale >= config.mapPingScale) {
                        this.active = false;
                    } else {
                        ctxt.globalAlpha = (1-Math.max(0, this.scale/config.mapPingScale));
                        ctxt.beginPath();
                        ctxt.arc((this.x / config.mapScale) * mapDisplay.width, (this.y / config.mapScale)
                                 * mapDisplay.width, this.scale, 0, 2 * Math.PI);
                        ctxt.stroke();
                    }
                }
            };
        }
        function pingMap(x, y) {
            for (var i = 0; i < mapPings.length; ++i) {
                if (!mapPings[i].active) {
                    tmpPing = mapPings[i];
                    break;
                }
            }
            if (!tmpPing) {
                tmpPing = new MapPing();
                mapPings.push(tmpPing);
            }
            tmpPing.init(x, y);
        }
        function updateMapMarker() {
            if (!mapMarker)
                mapMarker = {};
            mapMarker.x = myPlayer.x;
            mapMarker.y = myPlayer.y;
        }
        function updateMinimap(data) {
            minimapData = data;
        }
        function renderMinimap(delta) {
            if (myPlayer && myPlayer.alive) {
                mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);

                // RENDER PINGS:
                mapContext.strokeStyle = "#fff";
                mapContext.lineWidth = 4;
                for (var i = 0; i < mapPings.length; ++i) {
                    tmpPing = mapPings[i];
                    tmpPing.update(mapContext, delta);
                }

                // RENDER PLAYERS:
                mapContext.globalAlpha = 1;
                mapContext.fillStyle = "#fff";
                renderCircle((myPlayer.x/config.mapScale)*mapDisplay.width,
                             (myPlayer.y/config.mapScale)*mapDisplay.height, 7, mapContext, true);
                mapContext.fillStyle = "rgba(255,255,255,0.35)";
                if (myPlayer.team && minimapData) {
                    for (var i = 0; i < minimapData.length;) {
                        renderCircle((minimapData[i]/config.mapScale)*mapDisplay.width,
                                     (minimapData[i+1]/config.mapScale)*mapDisplay.height, 7, mapContext, true);
                        i+=2;
                    }
                }

                // DEATH LOCATION:
                if (lastDeath) {
                    mapContext.fillStyle = "#fc5553";
                    mapContext.font = "34px Hammersmith One";
                    mapContext.textBaseline = "middle";
                    mapContext.textAlign = "center";
                    mapContext.fillText("x", (lastDeath.x/config.mapScale)*mapDisplay.width,
                                        (lastDeath.y/config.mapScale)*mapDisplay.height);
                }

                // MAP MARKER:
                if (mapMarker) {
                    mapContext.fillStyle = "#fff";
                    mapContext.font = "34px Hammersmith One";
                    mapContext.textBaseline = "middle";
                    mapContext.textAlign = "center";
                    mapContext.fillText("x", (mapMarker.x/config.mapScale)*mapDisplay.width,
                                        (mapMarker.y/config.mapScale)*mapDisplay.height);
                }
            }
        }

        // STORE MENU:
        var currentStoreIndex = 0;
        var playerItems = {};
        function changeStoreIndex(index) {
            if (currentStoreIndex != index) {
                currentStoreIndex = index;
                generateStoreList();
            }
        }
        function toggleStoreMenu() {
            if (storeMenu.style.display != "block") {
                storeMenu.style.display = "block";
                allianceMenu.style.display = "none";
                closeChat();
                generateStoreList();
            } else {
                storeMenu.style.display = "none";
            }
        }
        function updateStoreItems(type, id, index) {
            if (index) {
                if (!type)
                    myPlayer.tails[id] = 1;
                else
                    myPlayer.tailIndex = id;
            } else {
                if (!type)
                    myPlayer.skins[id] = 1;
                else
                    myPlayer.skinIndex = id;
            }
            if (storeMenu.style.display == "block")
                generateStoreList();
        }
        function generateStoreList() {
            if (myPlayer) {
                UTILS.removeAllChildren(storeHolder);
                var index = currentStoreIndex;
                var tmpArray = index?accessories:hats;
                for (var i = 0; i < tmpArray.length; ++i) {
                    if (!tmpArray[i].dontSell) {
                        (function(i) {
                            var tmp = UTILS.generateElement({
                                id: "storeDisplay" + i,
                                class: "storeItem",
                                onmouseout: function() { showItemInfo(); },
                                onmouseover: function() { showItemInfo(tmpArray[i], false, true); },
                                parent: storeHolder
                            });
                            UTILS.hookTouchEvents(tmp, true);
                            UTILS.generateElement({
                                tag: "img",
                                class: "hatPreview",
                                src: "../img/" + (index?"accessories/access_":"hats/hat_") + tmpArray[i].id + (tmpArray[i].topSprite?"_p":"") + ".png",
                                parent: tmp
                            });
                            UTILS.generateElement({
                                tag: "span",
                                text: tmpArray[i].name,
                                parent: tmp
                            });
                            if (index?(!myPlayer.tails[tmpArray[i].id]):(!myPlayer.skins[tmpArray[i].id])) {
                                UTILS.generateElement({
                                    class: "joinAlBtn",
                                    style: "margin-top: 5px",
                                    text: "Buy",
                                    onclick: function() { storeBuy(tmpArray[i].id, index); },
                                    hookTouch: true,
                                    parent: tmp
                                });
                                UTILS.generateElement({
                                    tag: "span",
                                    class: "itemPrice",
                                    text: tmpArray[i].price,
                                    parent: tmp
                                })
                            } else if ((index?myPlayer.tailIndex:myPlayer.skinIndex)==tmpArray[i].id) {
                                UTILS.generateElement({
                                    class: "joinAlBtn",
                                    style: "margin-top: 5px",
                                    text: "Unequip",
                                    onclick: function() { storeEquip(0, index); },
                                    hookTouch: true,
                                    parent: tmp
                                });
                            } else {
                                UTILS.generateElement({
                                    class: "joinAlBtn",
                                    style: "margin-top: 5px",
                                    text: "Equip",
                                    onclick: function() { storeEquip(tmpArray[i].id, index); },
                                    hookTouch: true,
                                    parent: tmp
                                });
                            }
                        })(i);
                    }
                }
            }
        }
        function storeEquip(id, index) {
            io.send("c", 0, id, index);
        }
        function storeBuy(id, index) {
            io.send("c", 1, id, index);
        }

        // HIDE WINDOWS:
        function hideAllWindows() {
            storeMenu.style.display = "none";
            allianceMenu.style.display = "none";
            closeChat();
        }

        // PREPARE UI:
        function prepareUI() {

            // NATIVE RESOLUTION:
            var savedNativeValue = getSavedVal("native_resolution");
            if (!savedNativeValue) {
                setUseNativeResolution(typeof cordova !== "undefined"); // Only default to native if on mobile
            } else {
                setUseNativeResolution(savedNativeValue == "true");
            }

            // SHOW PING:
            showPing = getSavedVal("show_ping") == "true";
            pingDisplay.hidden = !showPing;

            // LOAD SOUND SETTING:
            playSound = getSavedVal("moo_moosic")||0;

            // MOBILE DOWNLOADS:
            setInterval(function() {
                if (window.cordova) {
                    document.getElementById("downloadButtonContainer").classList.add("cordova");
                    document.getElementById("mobileDownloadButtonContainer").classList.add("cordova");
                }
            }, 1000);

            // SKIN COLOR PICKER:
            updateSkinColorPicker();

            // ACTION BAR:
            UTILS.removeAllChildren(actionBar);
            for (var i = 0; i < (items.weapons.length+items.list.length); ++i) {
                (function(i) {
                    UTILS.generateElement({
                        id: "actionBarItem" + i,
                        class: "actionBarItem",
                        style: "display:none",
                        onmouseout: function() {
                            showItemInfo();
                        },
                        parent: actionBar
                    });
                })(i);
            }
            for (var i = 0; i < (items.list.length + items.weapons.length); ++i) {
                (function(i) {
                    var tmpCanvas = document.createElement('canvas');
                    tmpCanvas.width = tmpCanvas.height = 66;
                    var tmpContext = tmpCanvas.getContext('2d');
                    tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                    tmpContext.imageSmoothingEnabled = false;
                    tmpContext.webkitImageSmoothingEnabled = false;
                    tmpContext.mozImageSmoothingEnabled = false;
                    if (items.weapons[i]) {
                        tmpContext.rotate((Math.PI/4)+Math.PI);
                        var tmpSprite = new Image();
                        toolSprites[items.weapons[i].src] = tmpSprite;
                        tmpSprite.onload = function() {
                            this.isLoaded = true;
                            var tmpPad = 1 / (this.height / this.width);
                            var tmpMlt = (items.weapons[i].iPad || 1);
                            tmpContext.drawImage(this, -(tmpCanvas.width*tmpMlt*config.iconPad*tmpPad)/2, -(tmpCanvas.height*tmpMlt*config.iconPad)/2,
                                                 tmpCanvas.width*tmpMlt*tmpPad*config.iconPad, tmpCanvas.height*tmpMlt*config.iconPad);
                            tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                            tmpContext.globalCompositeOperation = "source-atop";
                            tmpContext.fillRect(-tmpCanvas.width / 2, -tmpCanvas.height / 2, tmpCanvas.width, tmpCanvas.height);
                            document.getElementById('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                        };
                        tmpSprite.src = ".././img/weapons/" + items.weapons[i].src + ".png";
                        var tmpUnit = document.getElementById('actionBarItem' + i);
                        tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                            showItemInfo(items.weapons[i], true);
                        });
                        tmpUnit.onclick = UTILS.checkTrusted(function() {
                            selectToBuild(i, true);
                        });
                        UTILS.hookTouchEvents(tmpUnit);
                    } else {
                        var tmpSprite = getItemSprite(items.list[i-items.weapons.length], true);
                        var tmpScale = Math.min(tmpCanvas.width - config.iconPadding, tmpSprite.width);
                        tmpContext.globalAlpha = 1;
                        tmpContext.drawImage(tmpSprite, -tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                        tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                        tmpContext.globalCompositeOperation = "source-atop";
                        tmpContext.fillRect(-tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                        document.getElementById('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                        var tmpUnit = document.getElementById('actionBarItem' + i);
                        tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                            showItemInfo(items.list[i-items.weapons.length]);
                        });
                        tmpUnit.onclick = UTILS.checkTrusted(function() {
                            selectToBuild(i-items.weapons.length);
                        });
                        UTILS.hookTouchEvents(tmpUnit);
                    }
                })(i);
            }

            // MOBILE NAME INPUT:
            nameInput.ontouchstart = UTILS.checkTrusted(function(e) {
                e.preventDefault();
                var newValue = prompt("enter name", e.currentTarget.value);
                e.currentTarget.value = newValue.slice(0, 15);
            });

            // SETTINGS:
            nativeResolutionCheckbox.checked = useNativeResolution;
            nativeResolutionCheckbox.onchange = UTILS.checkTrusted(function(e) {
                setUseNativeResolution(e.target.checked);
            });
            showPingCheckbox.checked = showPing;
            showPingCheckbox.onchange = UTILS.checkTrusted(function(e) {
                showPing = showPingCheckbox.checked;
                pingDisplay.hidden = !showPing;
                saveVal("show_ping", showPing ? "true" : "false");
            });

            // PLAY MENU SOUND:
            // Sound.play("menu", 1, true);
        }
        function updateItems(data, wpn) {
            if (data) {
                if (wpn) myPlayer.weapons = data;
                else myPlayer.items = data;
            }
            for (var i = 0; i < items.list.length; ++i) {
                var tmpI = (items.weapons.length + i);
                document.getElementById("actionBarItem" + tmpI).style.display = myPlayer.items.indexOf(items.list[i].id) >= 0 ? "inline-block" : "none";
            }
            for (var i = 0; i < items.weapons.length; ++i) {
                document.getElementById("actionBarItem" + i).style.display = (myPlayer.weapons[items.weapons[i].type] == items.weapons[i].id) ? "inline-block" : "none";
            }

            if(keyCodeWeapon < 9){
                keyCodeWeapon = myPlayer.weapons[0];
            } else {
                keyCodeWeapon = myPlayer.weapons[1];
            }
        }
        function setUseNativeResolution(useNative) {
            useNativeResolution = useNative;
            pixelDensity = useNative ? (window.devicePixelRatio || 1) : 1;
            nativeResolutionCheckbox.checked = useNative;
            saveVal("native_resolution", useNative.toString());
            resize();
        }
        function updateGuide() {
            if (usingTouch) {
                guideCard.classList.add("touch");
            } else {
                guideCard.classList.remove("touch");
            }
        }

        // SETTINGS STUFF:
        function toggleSettings() {
            if (guideCard.classList.contains("showing")) {
                guideCard.classList.remove("showing");
                settingsButtonTitle.innerText = "Settings";
            } else {
                guideCard.classList.add("showing");
                settingsButtonTitle.innerText = "Close";
            }
        }

        // SELECT SKIN COLOR:
        function updateSkinColorPicker() {
            var tmpHTML = "";
            for (var i = 0; i < config.skinColors.length; ++i) {
                if (i == selectSkinIndex) {
                    tmpHTML += ("<div class='skinColorItem activeSkin' style='background-color:" +
                                config.skinColors[i] + "' onclick='selectSkinColor(" + i + ")'></div>");
                } else {
                    tmpHTML += ("<div class='skinColorItem' style='background-color:" +
                                config.skinColors[i] + "' onclick='selectSkinColor(" + i + ")'></div>");
                }
            }
            skinColorHolder.innerHTML = tmpHTML;
        }
        function selectSkinColor(index) {
            selectSkinIndex = index;
            skinColor = index == 10 ? "__lookupGetter__" : index;
            updateSkinColorPicker();
        }

        // CHAT STUFF:
        var chatBox = document.getElementById("chatBox");
        var chatHolder = document.getElementById("chatHolder");
        function toggleChat() {
            if (!usingTouch) {
                if (chatHolder.style.display == "block") {
                    if (chatBox.value) {
                        sendChat(chatBox.value);
                    }
                    closeChat();
                } else {
                    storeMenu.style.display = "none";
                    allianceMenu.style.display = "none";
                    chatHolder.style.display = "block";
                    chatBox.focus();
                    resetMoveDir();
                }
            } else {
                setTimeout(function() { // Timeout lets the `hookTouchEvents` function exit
                    var chatMessage = prompt("chat message");
                    if (chatMessage) {
                        sendChat(chatMessage);
                    }
                }, 1);
            }
            chatBox.value = "";
        }
        function sendChat(message) {
            io.send("6", message.slice(0, 30));
        }
        function closeChat() {
            chatBox.value = "";
            chatHolder.style.display = "none";
        }

        // SEND MESSAGE:
        var profanityList = ["cunt", "whore", "fuck", "shit", "faggot", "nigger",
                             "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex",
                             "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune",
                             "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
        function checkProfanityString(text) {
            var tmpString;
            for (var i = 0; i < profanityList.length; ++i) {
                if (text.indexOf(profanityList[i]) > -1) {
                    tmpString = "";
                    for (var y = 0; y < profanityList[i].length; ++y) {
                        tmpString += tmpString.length?"o":"M";
                    }
                    var re = new RegExp(profanityList[i], 'g');
                    text = text.replace(re, tmpString);
                }
            }
            return text;
        }
        // MOVEMENT:
        function move(e) {
            io.send("9", e, 1);
        }

        function setMoveDir(e) {
            move(e);

            game.tickBase(() => {
                move(lastMoveDir);
            }, 1);
        }
        function receiveChat(sid, message) {
            var tmpPlayer = findPlayerBySID(sid);
            if (tmpPlayer) {
                tmpPlayer.chatMessage = checkProfanityString(message);
                tmpPlayer.chatCountdown = config.chatCountdown;
                if (sid === myPlayer.sid) {
                    if (/!follow\s+\d+/i.test(message)) {
                        let id = parseInt(message.split(" ")[1]);
                        if (players.find(obj => obj.sid === id)) {
                            isAutoFollowOn = true;
                            targetPlayerId = id;
                        }
                    }
                    if (/!unfollow/i.test(message)) {
                        isAutoFollowOn = false;
                        targetPlayerId = null;
                    }
                }
                if (isAlly(tmpPlayer) || myPlayer === tmpPlayer) {
                    if (message.includes("!stopfollow")) {
                        isAutoFollowOn = false;
                        setMoveDir(null);
                    } else if (message.includes("!continue")) {
                        isAutoFollowOn = true;
                    }
                }
            }
        }

        // RESIZE:
        window.addEventListener('resize', UTILS.checkTrusted(resize));
        function resize() {
            screenWidth = window.innerWidth;
            screenHeight = window.innerHeight;
            var scaleFillNative = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight) * pixelDensity;
            gameCanvas.width = screenWidth * pixelDensity;
            gameCanvas.height = screenHeight * pixelDensity;
            gameCanvas.style.width = screenWidth + "px";
            gameCanvas.style.height = screenHeight + "px";
            mainContext.setTransform(
                scaleFillNative, 0,
                0, scaleFillNative,
                (screenWidth * pixelDensity - (maxScreenWidth * scaleFillNative)) / 2,
                (screenHeight * pixelDensity - (maxScreenHeight * scaleFillNative)) / 2
            );
        }
        resize();

        // TOUCH INPUT:
        var usingTouch;
        setUsingTouch(false);
        function setUsingTouch(using) {
            usingTouch = using;
            updateGuide();
        }
        window.setUsingTouch = setUsingTouch;

        gameCanvas.addEventListener('touchmove', UTILS.checkTrusted(touchMove), false);
        function touchMove(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            setUsingTouch(true);
            for (var i = 0; i < ev.changedTouches.length; i++) {
                var t = ev.changedTouches[i];
                if (t.identifier == controllingTouch.id) {
                    controllingTouch.currentX = t.pageX;
                    controllingTouch.currentY = t.pageY;
                    sendMoveDir();
                } else if (t.identifier == attackingTouch.id) {
                    attackingTouch.currentX = t.pageX;
                    attackingTouch.currentY = t.pageY;
                    attackState = 1;
                }
            }
        }
        gameCanvas.addEventListener('touchstart', UTILS.checkTrusted(touchStart), false);
        function touchStart(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            setUsingTouch(true);
            for (var i = 0; i < ev.changedTouches.length; i++) {
                var t = ev.changedTouches[i];
                if (t.pageX < document.body.scrollWidth / 2 && controllingTouch.id == -1) {
                    controllingTouch.id = t.identifier;
                    controllingTouch.startX = controllingTouch.currentX = t.pageX;
                    controllingTouch.startY = controllingTouch.currentY = t.pageY;
                    sendMoveDir();
                } else if (t.pageX > document.body.scrollWidth / 2 && attackingTouch.id == -1) {
                    attackingTouch.id = t.identifier;
                    attackingTouch.startX = attackingTouch.currentX = t.pageX;
                    attackingTouch.startY = attackingTouch.currentY = t.pageY;
                    if (myPlayer.buildIndex < 0) {
                        attackState = 1;
                        sendAtckState();
                    }
                }
            }
        }
        gameCanvas.addEventListener('touchend', UTILS.checkTrusted(touchEnd), false);
        gameCanvas.addEventListener('touchcancel', UTILS.checkTrusted(touchEnd), false);
        gameCanvas.addEventListener('touchleave', UTILS.checkTrusted(touchEnd), false);
        function touchEnd(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            setUsingTouch(true);
            for (var i = 0; i < ev.changedTouches.length; i++) {
                var t = ev.changedTouches[i];
                if (t.identifier == controllingTouch.id) {
                    controllingTouch.id = -1;
                    sendMoveDir();
                } else if (t.identifier == attackingTouch.id) {
                    attackingTouch.id = -1;
                    if (myPlayer.buildIndex >= 0) {
                        attackState = 1;
                        sendAtckState();
                    }
                    attackState = 0;
                    sendAtckState();
                }
            }
        }


        // MOUSE INPUT:
        const mals = document.getElementById('touch-controls-fullscreen');
        mals.style.display = 'block';
        mals.addEventListener("mousemove", gameInput, false);
        function gameInput(e) {
            e.preventDefault();
            e.stopPropagation();
            setUsingTouch(false);
            mouseX = e.clientX;
            mouseY = e.clientY;
        }
        mals.addEventListener("mousedown", mouseDown, false);
        function mouseDown(e) {
            setUsingTouch(false);
            if (attackState != 1) {
                attackState = 1;
                sendAtckState();
            }
        }
        mals.addEventListener("mouseup", mouseUp, false);
        function mouseUp(e) {
            setUsingTouch(false);
            if (attackState != 0) {
                attackState = 0;
                sendAtckState();
            }
        }

        // INPUT UTILS:
        function getMoveDir() {
            var dx = 0;
            var dy = 0;
            if (controllingTouch.id != -1) {
                dx += controllingTouch.currentX - controllingTouch.startX;
                dy += controllingTouch.currentY - controllingTouch.startY;
            } else {
                for (var key in moveKeys) {
                    var tmpDir = moveKeys[key];
                    dx += !!keys[key] * tmpDir[0];
                    dy += !!keys[key] * tmpDir[1];
                }
            }
            return (dx == 0 && dy == 0) ? undefined : UTILS.fixTo(Math.atan2(dy, dx), 2);
        }
        var lastDir;
        let lessDir = undefined;
        let tmpAttackDir = undefined;
        let plusDir = 0;
        let enemy = [];
        let nearestEnemy;
        function getSafeDir() {
            if (!myPlayer) return 0;
            if (attackingTouch.id != -1) {
                lastDir = Math.atan2(attackingTouch.currentY - attackingTouch.startY, attackingTouch.currentX - attackingTouch.startX);
            } else if (!myPlayer.lockDir && !usingTouch) {
                lastDir = Math.atan2(mouseY - screenHeight / 2, mouseX - screenWidth / 2);
            }
            return UTILS.fixTo(lastDir || 0, 2);
        }
        function getAttackDir(){
            if(myPlayer){
                if(autoaim && nearestEnemy){
                    return Math.atan2(nearestEnemy.y2-myPlayer.y2, nearestEnemy.x2-myPlayer.x2);
                }

                if(antiPush){
                    return antiPushAngle;
                }

                if(autoBreak){
                    return autoBreakAngle;
                }

                if(!myPlayer.lockDir && !usingTouch){
                    lastDir = Math.atan2(mouseY - (screenHeight / 2), mouseX - (screenWidth / 2));
                    return UTILS.fixTo(lastDir || 0, 2);
                }
            }

            return 0;
        }

        // KEYS:
        var keys = {};
        var moveKeys = {
            87: [0,-1],
            38: [0,-1],
            83: [0,1],
            40: [0,1],
            65: [-1,0],
            37: [-1,0],
            68: [1,0],
            39: [1,0]
        };
        function resetMoveDir() {
            keys = {};
            io.send("e");
        }
        function keysActive() {
            return (allianceMenu.style.display != "block"
                    && chatHolder.style.display != "block");
        }
        function spikeTick() {
            autoaim = true;
            selectWeapon(myPlayer.weapons[0]);
            io.send("D", getAttackDir());
            hat(7, 0);
            sendAutoGather();
            setTimeout(() => {
                selectWeapon(myPlayer.weapons[1]);
                hat(53, 0);
                setTimeout(() => {
                    sendAutoGather();
                    autoaim = false;
                }, 94);
            }, 175);
        }
        let autoOneFrameToggled = false;
        let game = {
            tick: 0,
            tickQueue: [],
            tickBase: function(set, tick) {
                if (this.tickQueue[this.tick + tick]) {
                    this.tickQueue[this.tick + tick].push(set);
                } else {
                    this.tickQueue[this.tick + tick] = [set];
                }
            },
            tickRate: (1000 / config.serverUpdateRate),
            tickSpeed: 0,
            lastTick: performance.now()
        };
        function keyDown(event) {
            var keyNum = event.which||event.keyCode||0;
            if (keyNum == 27) {
                if (!keys[keyNum]) {
                    keys[keyNum] = 1;
                    if (myPlayer && myPlayer.alive) {
                        hideAllWindows();
                        $("#modMenus").toggle();
                    }
                }
            } else if (myPlayer && myPlayer.alive && keysActive()) {
                if (!keys[keyNum]) {
                    keys[keyNum] = 1;
                    if (keyNum == 69) {
                        ePress = !ePress;
                    } else if (keyNum == 67) {
                        updateMapMarker();
                    } else if (keyNum == 88) {
                        sendLockDir();
                    }else if (event.key == "g") {
                        autoOneFrameToggled = !autoOneFrameToggled;
                        const oneFrameStatus = autoOneFrameToggled ? "On" : "Off";
                        sendChat(`OneFrame: ${oneFrameStatus}`);
                    }else if (event.key == "T") {
                        autoVelocityTickToggled = !autoVelocityTickToggled;
                        const oneFrameStatus = autoVelocityTickToggled ? "on" : "off";
                        sendChat(`1shotmod ${(oneFrameStatus)}`);
                    } else if (keyNum == 84) {
                        autoaim = true;
                        selectWeapon(myPlayer.weapons[0], 1);
                        setTimeout(() => {
                            selectWeapon(myPlayer.weapons[0]);
                            hat(53, 0, 1);
                            setTimeout(() => {
                                selectWeapon(myPlayer.weapons[0], 1);
                                io.send("F", 1);
                                hat(7, 0, 1);
                                setTimeout(() => {
                                    autoaim = false;
                                    io.send("F", null, 1);
                                }, 224);
                            }, 94);
                        }, 1);
                    } else if (event.key === "v") {
                        place(myPlayer.items[2], getAttackDir());
                    } else if (event.key === "h") {
                        place(myPlayer.items[5], getAttackDir());
                    } else if (event.key === "f") {
                        place(myPlayer.items[4], getAttackDir());
                    } else if (myPlayer.weapons[keyNum - 49] != undefined) {
                        keyCodeWeapon = myPlayer.weapons[keyNum - 49];
                    } else if (myPlayer.items[keyNum - 49 - myPlayer.weapons.length] != undefined) {
                        selectToBuild(myPlayer.items[keyNum - 49 - myPlayer.weapons.length]);
                    } else if (keyNum == 82) {
                        sendMapPing();
                    } else if (keyNum == 32) {
                        attackState = 1;
                        sendAtckState();
                    } else if (keyNum == 66) {
                        autoMills = !autoMills;
                    } else if(keyNum == 81){
                        qPress = true;
                    }
                }
            }
        }
        window.addEventListener('keydown', UTILS.checkTrusted(keyDown));
        function keyUp(event) {
            if (myPlayer && myPlayer.alive) {
                var keyNum = event.which||event.keyCode||0;
                if (keyNum == 13) {
                    toggleChat();
                } else if (keysActive()) {
                    if (keys[keyNum]) {
                        keys[keyNum] = 0;
                        if (keyNum == 32) {
                            attackState = 0;
                            sendAtckState();
                        } else if(keyNum == 81){
                            qPress = true;
                        }
                    }
                }
            }
        }
        window.addEventListener('keyup',  UTILS.checkTrusted(keyUp));
        function sendAtckState() {
            if (myPlayer && myPlayer.alive) {
                io.send("F", attackState, (myPlayer.buildIndex >= 0?getAttackDir():null));
            }
        }
        var lastMoveDir = undefined;
        function sendMoveDir() {
            var newMoveDir = getMoveDir();
            if (lastMoveDir == undefined || newMoveDir == undefined || Math.abs(newMoveDir - lastMoveDir) > 0.3) {
                io.send("9", newMoveDir);
                lastMoveDir = newMoveDir;
            }
        }
        function sendLockDir() {
            myPlayer.lockDir = myPlayer.lockDir?0:1;
            io.send("K", 0);
        }
        let empAntiVel = false;
        function simpleAntiEmpCounter() {
            for (let i = 0; i < nears.length; i++) {
                if (nears[i].skinIndex == 22) empAntiVel = false;
                if (nears[i].skinIndex != 22) empAntiVel = true;
                close.push(nears[i]);
                return true;
            }
        }
        let hitDetect = [];
        let close = [];
        let canDeleteNearestZulu = false;
        function predictReload() {
            try {
                if (!near) {
                    hitDetect = [];
                    return false;
                }
                hitDetect = [];
                let potentialHit = [];
                for (let i = 0; i < close.length; i++) {
                    if (close[i].primaryReload == 1) {
                        for (let o = 0; o < nears.length; o++) {
                            if (close[i].sid == nears[o].sid) {
                                potentialHit.push(close[i]);
                                break;
                            }
                        }
                    }
                }
                hitDetect = potentialHit;
                close = [];
                for (let i = 0; i < nears.length; i++) {
                    if (players[i].secondaryIndex == 10 && players[i].secondaryReload + game.tickRate / items.weapons[players[i].secondaryIndex].speed >= 1 && players[i].secondaryReload + game.tickRate / items.weapons[players[i].secondaryIndex].speed <= 1.2) {
                        close.push(nears[i]);
                        return true;
                    } else if (nears[i].primaryReload + game.tickRate / items.weapons[nears[i].primaryIndex].speed >= 1 && (nears[i].primaryIndex == 5 ? nears[i].primaryReload + game.tickRate / items.weapons[nears[i].primaryIndex].speed <= 1.15 : nears[i].primaryReload + game.tickRate / items.weapons[nears[i].primaryIndex].speed <= 1.2)) {
                        console.log("hit is yes")
                        close.push(nears[i]);
                        return true;
                    }
                }
                canDeleteNearestZulu = close.length > 0;
                return false;
            } catch (e) {
                return false;
            }
        }
        let hatPredictTrap = false;
        function predictHatSwitch(id, mainHat = nearestEnemy.skinIndex) { // simple predict hat of main
            if (near.inTrap) {
                if (mainHat == 6 || mainHat == 22) {
                    if (predictReload() && (mainHat != 6 || mainHat != 22)) {
                        hatPredictTrap = true;
                    } else {
                        hatPredictTrap = false;
                    }
                } else {
                    hatPredictTrap = false;
                }
            }
        }
        class Instakill {
            constructor() {
                this.wait = false;
                this.can = false;
                this.isTrue = false;
                this.nobull = false;
                this.ticking = false;
                this.canSpikeTick = false;
                this.startTick = false;
                this.readyTick = false;
                this.canCounter = false;
                this.revTick = false;
                this.syncHit = false;
                this.changeType = function(type) {
                    this.wait = false;
                    this.isTrue = true;
                    my.autoAim = true;
                    if (type == "rev") {
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        buyEquip(18, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(0, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }, 1);
                        }, 1);
                    } else if (type == "normal") {
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(0, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            buyEquip(53, 0);
                            selectWeapon(player.weapons[1]);
                            buyEquip(53, 0);
                            buyEquip(18, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }, 1);
                        }, 1);
                    } else {
                        setTimeout(() => {
                            this.isTrue = false;
                            my.autoAim = false;
                        }, 50);
                    }
                };
                function biomeGear(mover, returns, id) {
                    if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                        if (returns) return 31;
                        buyEquip(31, 0);
                    } else {
                        if (player.y2 <= config.snowBiomeTop) {
                            buyEquip(15, 0);
                        }
                    }
                    if (returns) return 0;
                }
                this.spikeTickType = function () {
                    this.isTrue = true;
                    my.autoAim = true;
                    selectWeapon(player.weapons[0]);
                    io.send("D", getAttackDir());
                    buyEquip(7, 0);
                    sendAutoGather();
                    game.tickBase(() => {
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        game.tickBase(() => {
                            sendAutoGather();
                            this.isTrue = false;
                            my.autoAim = false;
                        }, 1);
                    }, 1);
                };
                this.OneTickType = function() {
                    this.isTrue = true;
                    my.autoAim = true;
                    biomeGear();
                    buyEquip(21, 1);
                    io.send("9", near.aim2, 1);
                    game.tickBase(() => {
                        if (player.weapons[1] == 15) {
                            my.revAim = true;
                        }
                        selectWeapon(player.weapons[[9, 12, 13, 15].includes(player.weapons[1]) ? 1 : 0]);
                        buyEquip(53, 0);
                        buyEquip(21, 1);
                        if ([9, 12, 13, 15].includes(player.weapons[1])) {
                            sendAutoGather();
                        }
                        io.send("9", near.aim2, 1);
                        game.tickBase(() => {
                            my.revAim = false;
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(21, 1);
                            if (![9, 12, 13, 15].includes(player.weapons[1])) {
                                sendAutoGather();
                            }
                            io.send("9", near.aim2, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                io.send("9", undefined, 1);
                            }, 2);
                        }, 1);
                    }, 1);
                };
                this.BoostOneTICKERS = function() {
                    this.isTrue = true;
                    my.autoAim = true;
                    biomeGear();
                    buyEquip(21, 1);
                    io.send("9", near.aim2, 1);
                    game.tickBase(() => {
                        selectWeapon(player.weapons[0]);
                        buyEquip(53, 0);
                        buyEquip(21, 1);
                        io.send("9", near.aim2, 1);
                        place(4, near.aim2);
                        game.tickBase(() => {
                            my.revAim = false;
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(21, 1);
                            sendAutoGather();
                            io.send("9", near.aim2, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                io.send("9", undefined, 1);
                            }, 5);
                        }, 1);
                    }, 1);
                };
                this.threeOneTickType = function() {
                    this.isTrue = true;
                    my.autoAim = true;
                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                    biomeGear();
                    buyEquip(0, 1);
                    io.send("9", near.aim2, 1);
                    game.tickBase(() => {
                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                        buyEquip(53, 0);
                        buyEquip(0, 1);
                        io.send("9", near.aim2, 1);
                        game.tickBase(() => {
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(0, 1);
                            sendAutoGather();
                            io.send("9", near.aim2, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                io.send("9", undefined, 1);
                            }, 1);
                        }, 1);
                    }, 1);
                };
                this.kmTickType = function() {
                    this.isTrue = true;
                    my.autoAim = true;
                    my.revAim = true;
                    selectWeapon(player.weapons[1]);
                    buyEquip(53, 0);
                    buyEquip(0, 1);
                    sendAutoGather();
                    io.send("9", near.aim2, 1);
                    game.tickBase(() => {
                        my.revAim = false;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(0, 1);
                        io.send("9", near.aim2, 1);
                        game.tickBase(() => {
                            sendAutoGather();
                            this.isTrue = false;
                            my.autoAim = false;
                            io.send("9", undefined, 1);
                        }, 1);
                    }, 1);
                };
                this.spiketickOption = function() {
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(18, 1);
                    sendAutoGather();
                    game.tickBase(() => {
                        selectWeapon(player.weapons[0]);
                        buyEquip(53, 0);
                        game.tickBase(() => {
                            sendAutoGather();
                            my.autoAim = false;
                        }, 1);
                    }, 1);
                };
                this.boostTickType = function() {
                    this.isTrue = true;
                    my.autoAim = true;
                    buyEquip(40, 0);
                    buyEquip(0, 1);
                    io.send("9", near.aim2, 1);
                    game.tickBase(() => {
                        if (player.weapons[1] == 15) {
                            my.revAim = true;
                        }
                        selectWeapon(player.weapons[[9, 12, 13, 15].includes(player.weapons[1]) ? 1 : 0]);
                        buyEquip(53, 0);
                        buyEquip(21, 1);
                        if ([9, 12, 13, 15].includes(player.weapons[1])) {
                            sendAutoGather();
                        }
                        io.send("9", near.aim2, 1);
                        place(4, near.aim2);
                        game.tickBase(() => {
                            my.revAim = false;
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            if (![9, 12, 13, 15].includes(player.weapons[1])) {
                                sendAutoGather();
                            }
                            io.send("9", near.aim2, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                io.send("9", undefined, 1);
                            }, 1);
                        }, 1);
                    }, 1);
                };
                this.rangeType = function(type) {
                    this.isTrue = true;
                    my.autoAim = true;
                    if (type == "ageInsta") {
                        my.ageInsta = false;
                        if (player.items[5] == 18) {
                            place(5, near.aim2);
                        }
                        io.send("9", undefined, 1);
                        buyEquip(22, 0);
                        buyEquip(21, 1);
                        game.tickBase(() => {
                            selectWeapon(player.weapons[1]);
                            io.send("F", 1);
                            buyEquip(53, 0);
                            buyEquip(21, 1);
                            sendAutoGather();
                            game.tickBase(() => {
                                sendUpgrade(12);
                                selectWeapon(player.weapons[1]);
                                io.send("F", 1);
                                buyEquip(53, 0);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendUpgrade(15);
                                    selectWeapon(player.weapons[1]);
                                    io.send("F", 1);
                                    buyEquip(53, 0);
                                    buyEquip(21, 1);
                                    game.tickBase(() => {
                                        sendAutoGather();
                                        this.isTrue = false;
                                        my.autoAim = false;
                                    }, 1);
                                }, 1);
                            }, 1);
                        }, 1);
                    } else {
                        selectWeapon(player.weapons[1]);
                        io.send("F", 1);
                        if (player.reloads[53] == 0 && near.dist2 <= 700 && nearestEnemy.skinIndex != 22) {
                            buyEquip(53, 0);
                        } else {
                            buyEquip(20, 0);
                        }
                        buyEquip(19, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            sendAutoGather();
                            io.send("F", null, 0);
                            this.isTrue = false;
                            my.autoAim = false;
                        }, 1);
                    }
                };
                this.gotoGoal = function(goto, OT) {
                    let slowDists = (weeeee) => weeeee * config.playerScale;
                    let goal = {
                        a: goto - OT,
                        b: goto + OT,
                        c: goto - slowDists(1),
                        d: goto + slowDists(1),
                        e: goto - slowDists(2),
                        f: goto + slowDists(2),
                        g: goto - slowDists(4),
                        h: goto + slowDists(4)
                    };
                    let bQ = function(wwww, awwww) {
                        if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2 && awwww == 0) {
                            buyEquip(31, 0);
                        } else {
                            buyEquip(wwww, awwww);
                        }
                    }
                    if (enemy.length) {
                        let dst = near.dist2;
                        this.ticking = true;
                        if (dst >= goal.a && dst <= goal.b) {
                            bQ(19, 1);
                            if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            }
                            return {
                                dir: undefined,
                                action: 1
                            };
                        } else {
                            if (dst < goal.a) {
                                if (dst >= goal.g) {
                                    if (dst >= goal.e) {
                                        if (dst >= goal.c) {
                                            bQ(40, 0);
                                            if (true) {
                                                player.buildIndex != player.items[1] && selectToBuild(player.items[1]);
                                            } else {
                                                if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                }
                                            }
                                        } else {
                                            bQ(40, 0);
                                            if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                            }
                                        }
                                    } else {
                                        bQ(6, 0);
                                        if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                        }
                                    }
                                } else {
                                    biomeGear();
                                    if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                    }
                                }
                                return {
                                    dir: near.aim2 + Math.PI,
                                    action: 0
                                };
                            } else if (dst > goal.b) {
                                if (dst <= goal.h) {
                                    if (dst <= goal.f) {
                                        if (dst <= goal.d) {
                                            bQ(40, 0);
                                            if (true) {
                                                player.buildIndex != player.items[1] && selectToBuild(player.items[1]);
                                            } else {
                                                if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                }
                                            }
                                        } else {
                                            bQ(40, 0);
                                            if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                            }
                                        }
                                    } else {
                                        bQ(6, 0);
                                        if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                        }
                                    }
                                } else {
                                    biomeGear();
                                    if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                    }
                                }
                                return {
                                    dir: near.aim2,
                                    action: 0
                                };
                            }
                            return {
                                dir: undefined,
                                action: 0
                            };
                        }
                    } else {
                        this.ticking = false;
                        return {
                            dir: undefined,
                            action: 0
                        };
                    }
                }
                this.tickMovement = function() {
                    let dist = player.weapons[1] == 9 ? 245 : 245;
                    let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1 : player.weapons[1] == 15 ? 2 : 3;
                    let moveMent = this.gotoGoal(245, 3);
                    if (moveMent.action) {
                        if (player.reloads[53] == 0 && !this.isTrue) {
                            this.OneTickType();
                        } else {
                            io.send("9", moveMent.dir, 1);
                        }
                    } else {
                        io.send("9", moveMent.dir, 1);
                    }
                }
                this.BoostOneTick = function() {
                    let dist = player.weapons[1] == 9 ? 365 : player.weapons[1] == 12 ? 380 : player.weapons[1] == 13 ? 365 : player.weapons[1] == 15 ? 365 : 370;
                    let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1 : player.weapons[1] == 15 ? 2 : 3;
                    let moveMent = this.gotoGoal(372, 3);
                    if (moveMent.action) {
                        if (player.reloads[53] == 0 && !this.isTrue) {
                            this.BoostOneTICKERS();
                        } else {
                            io.send("9", moveMent.dir, 1);
                        }
                    } else {
                        io.send("9", moveMent.dir, 1);
                    }
                }
                this.kmTickMovement = function() {
                    let moveMent = this.gotoGoal(240, 3);
                    if (moveMent.action) {
                        if (nearestEnemy.skinIndex != 22 && player.reloads[53] == 0 && !this.isTrue && ((game.tick - near.poisonTick) % config.serverUpdateRate == 8)) {
                            this.kmTickType();
                        } else {
                            io.send("9", moveMent.dir, 1);
                        }
                    } else {
                        io.send("9", moveMent.dir, 1);
                    }
                }
                this.boostTickMovement = function() {
                    let dist = player.weapons[1] == 9 ? 345 : player.weapons[1] == 12 ? 375 : player.weapons[1] == 13 ? 363 : player.weapons[1] == 15 ? 365 : 370;
                    let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1 : player.weapons[1] == 15 ? 2 : 3;
                    let moveMent = this.gotoGoal(372, 3);
                    if (moveMent.action) {
                        if (player.reloads[53] == 0 && !this.isTrue) {
                            this.boostTickType();
                        } else {
                            io.send("9", moveMent.dir, 1);
                        }
                    } else {
                        io.send("9", moveMent.dir, 1);
                    }
                }
                this.perfCheck = function(pl, nr) {
                    if (nr.weaponIndex == 11 && UTILS.getAngleDist(nr.aim2 + Math.PI, nr.d2) <= config.shieldAngle) return false;
                    if (![9, 12, 13, 15].includes(player.weapons[1])) return true;
                    let pjs = {
                        x: nr.x2 + (65 * Math.cos(nr.aim2 + Math.PI)),
                        y: nr.y2 + (65 * Math.sin(nr.aim2 + Math.PI))
                    };
                    if (UTILS.lineInRect(pl.x2 - pl.scale, pl.y2 - pl.scale, pl.x2 + pl.scale, pl.y2 + pl.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                        return true;
                    }
                    let finds = ais.filter(tmp => tmp.visible)
                    .find((tmp) => {
                        if (UTILS.lineInRect(tmp.x2 - tmp.scale, tmp.y2 - tmp.scale, tmp.x2 + tmp.scale, tmp.y2 + tmp.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                            return true;
                        }
                    });
                    if (finds) return false;
                    finds = gameObjects.filter(tmp => tmp.active)
                        .find((tmp) => {
                        let tmpScale = tmp.getScale();
                        if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                            return true;
                        }
                    });
                    if (finds) return false;
                    return true;
                };
            }
        };
        let useWasd = false;

        function buyEquip(id, index) {
            let nID = player.skins[6] ? 6 : 0;
            if (player.alive && inGame) {
                if (index == 0) {
                    if (player.skins[id]) {
                        if (player.latestSkin != id) {
                            io.send("c", 0, id, 0);
                        }
                    } else {
                        if (settings.autoBuyEquip) {
                            let find = findID(hats, id);
                            if (find) {
                                if (player.points >= find.price) {
                                    io.send("c", 1, id, 0);
                                    io.send("c", 0, id, 0);
                                } else {
                                    if (player.latestSkin != nID) {
                                        io.send("c", 0, nID, 0);
                                    }
                                }
                            } else {
                                if (player.latestSkin != nID) {
                                    io.send("c", 0, nID, 0);
                                }
                            }
                        } else {
                            if (player.latestSkin != nID) {
                                io.send("c", 0, nID, 0);
                            }
                        }
                    }
                } else if (index == 1) {
                    if (useWasd && (id != 11 && id != 0)) {
                        if (player.latestTail != 0) {
                            io.send("c", 0, 0, 1);
                        }
                        return;
                    }
                    if (player.tails[id]) {
                        if (player.latestTail != id) {
                            io.send("c", 0, id, 1);
                        }
                    } else {
                        if (settings.autoBuyEquip) {
                            let find = findID(accessories, id);
                            if (find) {
                                if (player.points >= find.price) {
                                    io.send("c", 1, id, 1);
                                    io.send("c", 0, id, 1);
                                } else {
                                    if (player.latestTail != 0) {
                                        io.send("c", 0, 0, 1);
                                    }
                                }
                            } else {
                                if (player.latestTail != 0) {
                                    io.send("c", 0, 0, 1);
                                }
                            }
                        } else {
                            if (player.latestTail != 0) {
                                io.send("c", 0, 0, 1);
                            }
                        }
                    }
                }
            }
        }
        const elotickers = () => {
            if (primaryReload[myPlayer.sid] === 0 && turretReload[myPlayer.sid] === 0) {
                autoaim = true;
                selectWeapon(myPlayer.weapons[0]);
                storeEquip(53, 0);
                setTimeout(() => {
                    storeEquip(7, 0);
                    io.send("F", 1);
                    selectWeapon(myPlayer.weapons[0]);
                }, 93);
                setTimeout(() => {
                    autoaim = false;
                    storeEquip(6, 0);
                    io.send("F", 0, null);
                }, 205);
            }
        }
        function findID(tmpObj, tmp) {
            return tmpObj.find((THIS) => THIS.id == tmp);
        }
        let instaC = new Instakill();

        function sendMapPing() {
            io.send("S", 1);
        }
        function sendAutoGather() {
            autogathering = !autogathering;
            io.send("K", 1);
        }
        function selectToBuild(index) {
            io.send("z", index, false);
        }
        function selectWeapon(index, isPlace) {
            io.send("z", index, true);
        }
        function sendAtck(id, angle) {
            io.send("F", id, angle);
        }

        // ENTER GAME:
        function enterGame() {
            saveVal("moo_name", nameInput.value);
            if (!inGame && socketReady()) {
                inGame = true;
                Sound.stop("menu");
                showLoadingText("Loading...");
                io.send("M", {
                    name: nameInput.value,
                    moofoll: moofoll,
                    skin: skinColor
                });
                let cookie = document.getElementById("ot-sdk-btn-floating");
                if (cookie) {
                    cookie.style.display = "none";
                }
            }
        }

        // SETUP GAME:
        var firstSetup = true;
        function setupGame(yourSID) {
            loadingText.style.display = "none";
            menuCardHolder.style.display = "block";
            mainMenu.style.display = "none";
            keys = {};
            myPlayerSID = yourSID;
            attackState = 0;
            inGame = true;
            if (firstSetup) {
                firstSetup = false;
                gameObjects.length = 0;
            }
        }

        // SHOW ANIM TEXT:
        function showText(x, y, value, type) {
            textManager.showText(x, y, 50, 0.18, 500, Math.abs(value), (value>=0)?"#fff":"#8ecc51");
        }

        // KILL PLAYER:
        var deathTextScale = 99999;
        function killPlayer() {
            inGame = false;
            myPlayer.alive = false;

            try {
                factorem.refreshAds([2], true);
            } catch (e) {};
            gameUI.style.display = "none";
            hideAllWindows();
            lastDeath = {
                x: myPlayer.x,
                y: myPlayer.y
            };
            loadingText.style.display = "none";
            diedText.style.display = "block";
            diedText.style.fontSize = "0px";
            deathTextScale = 0;
            setTimeout(function() {
                menuCardHolder.style.display = "block";
                mainMenu.style.display = "block";
                // Sound.play("menu", 1, true);
                diedText.style.display = "none";
            }, config.deathFadeout);
        }

        // KILL ALL OBJECTS BY A PLAYER:
        function killObjects(sid) {
            let findObj = findObjectBySid(sid);
            if (myPlayer) objectManager.removeAllItems(sid);
            replacer(findObj);
        }

        // KILL OBJECT:
        function killObject(sid) {
            removedObjects.push(sid);
            objectManager.disableBySid(sid);
        }

        // UPDATE SCORE DISPLAY:
        function updateStatusDisplay() {
            scoreDisplay.innerText = myPlayer.points;
            foodDisplay.innerText = myPlayer.food;;
            woodDisplay.innerText = myPlayer.wood;
            stoneDisplay.innerText = myPlayer.stone;
            killCounter.innerText = myPlayer.kills;
        }

        // ICONS:
        var iconSprites = {};
        var icons = ["crown", "skull"];
        function loadIcons() {
            for (var i = 0; i < icons.length; ++i) {
                var tmpSprite = new Image();
                tmpSprite.onload = function() {
                    this.isLoaded = true;
                };
                tmpSprite.src = ".././img/icons/" + icons[i] + ".png";
                iconSprites[icons[i]] = tmpSprite;
            }
        }

        // UPDATE UPGRADES:
        var tmpList = [];
        function updateUpgrades(points, age) {
            myPlayer.upgradePoints = points;
            myPlayer.upgrAge = age;
            if (points > 0) {
                tmpList.length = 0;
                UTILS.removeAllChildren(upgradeHolder);
                for (var i = 0; i < items.weapons.length; ++i) {
                    if (items.weapons[i].age == age && (items.weapons[i].pre == undefined || myPlayer.weapons.indexOf(items.weapons[i].pre) >= 0)) {
                        var e = UTILS.generateElement({
                            id: "upgradeItem" + i,
                            class: "actionBarItem",
                            onmouseout: function() { showItemInfo(); },
                            parent: upgradeHolder
                        });
                        e.style.backgroundImage = document.getElementById("actionBarItem" + i).style.backgroundImage;
                        tmpList.push(i);
                    }
                }
                for (var i = 0; i < items.list.length; ++i) {
                    if (items.list[i].age == age && (items.list[i].pre == undefined || myPlayer.items.indexOf(items.list[i].pre) >= 0)) {
                        var tmpI = (items.weapons.length + i);
                        var e = UTILS.generateElement({
                            id: "upgradeItem" + tmpI,
                            class: "actionBarItem",
                            onmouseout: function() { showItemInfo(); },
                            parent: upgradeHolder
                        });
                        e.style.backgroundImage = document.getElementById("actionBarItem" + tmpI).style.backgroundImage;
                        tmpList.push(tmpI);
                    }
                }
                for (var i = 0; i < tmpList.length; i++) {
                    (function(i) {
                        var tmpItem = document.getElementById('upgradeItem' + i);
                        tmpItem.onmouseover = function() {
                            if (items.weapons[i]) {
                                showItemInfo(items.weapons[i], true);
                            } else {
                                showItemInfo(items.list[i-items.weapons.length]);
                            }
                        };
                        tmpItem.onclick = UTILS.checkTrusted(function(){
                            io.send("H", i);
                        });
                        UTILS.hookTouchEvents(tmpItem);
                    })(tmpList[i]);
                }
                if (tmpList.length) {
                    upgradeHolder.style.display = "block";
                    upgradeCounter.style.display = "block";
                    upgradeCounter.innerHTML = "SELECT ITEMS (" + points + ")";
                } else {
                    upgradeHolder.style.display = "none";
                    upgradeCounter.style.display = "none";
                    showItemInfo();
                }
            } else {
                upgradeHolder.style.display = "none";
                upgradeCounter.style.display = "none";
                showItemInfo();
            }
        }
        function sendUpgrade(index) {
            io.send("H", index);
        }

        // UPDATE AGE:
        function updateAge(xp, mxp, age) {
            if (xp != undefined) myPlayer.XP = xp;
            if (mxp != undefined) myPlayer.maxXP = mxp;
            if (age != undefined) myPlayer.age = age;

            age == config.maxAge ? (ageText.innerHTML = "MAX AGE",
                                    ageBarBody.style.width = "100%") : (ageText.innerHTML = "AGE " + myPlayer.age,
                                                                        ageBarBody.style.width = myPlayer.XP / myPlayer.maxXP * 100 + "%")
            /*
            if (age == config.maxAge) {
                ageText.innerHTML = "MAX AGE";
            } else {
                ageText.innerHTML = "AGE " + player.age;
            }
            */
        }

        // UPDATE LEADERBOARD:
        function updateLeaderboard(data) {
            UTILS.removeAllChildren(leaderboardData);
            var tmpC = 1;
            for (var i = 0; i < data.length; i += 3) {
                (function(i) {
                    UTILS.generateElement({
                        class: "leaderHolder",
                        parent: leaderboardData,
                        children: [
                            UTILS.generateElement({
                                class: "leaderboardItem",
                                style: "color:" + ((data[i] == myPlayerSID) ? "#fff" : "rgba(255,255,255,0.6)"),
                                text: tmpC + ". " + (data[i+1] != "" ? data[i+1] : "unknown")
                            }),
                            UTILS.generateElement({
                                class: "leaderScore",
                                text: UTILS.kFormat(data[i+2]) || "0"
                            })
                        ]
                    });
                })(i);
                tmpC++;
            }
        }

        // UPDATE GAME:
        function updateGame() {
            if (true) {

                // UPDATE DIRECTION:
                /*
                if (player) {
                    if (!lastSent || now - lastSent >= (1000 / config.clientSendRate)) {
                        lastSent = now;
                        let atckDir = getAttackDir();
                        if (lessDir !== atckDir) {
                            lessDir = atckDir;
                            io.send("D", atckDir);
                        }
                        tmpAttackDir = atckDir;
                    }
                }
                */

                // DEATH TEXT:
                if (deathTextScale < 120) {
                    deathTextScale += 0.1 * delta;
                    diedText.style.fontSize = Math.min(Math.round(deathTextScale), 120) + "px";
                }

                // MOVE CAMERA:
                if (myPlayer) {
                    var tmpDist = UTILS.getDistance(camX, camY, myPlayer.x, myPlayer.y);
                    var tmpDir = UTILS.getDirection(myPlayer.x, myPlayer.y, camX, camY);
                    var camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist);
                    if (tmpDist > 0.05) {
                        camX += camSpd * Math.cos(tmpDir);
                        camY += camSpd * Math.sin(tmpDir);
                    } else {
                        camX = myPlayer.x;
                        camY = myPlayer.y;
                    }
                } else {
                    camX = config.mapScale / 2;
                    camY = config.mapScale / 2;
                }

                // INTERPOLATE PLAYERS AND AI:
                var lastTime = now - (1000 / config.serverUpdateRate);
                var tmpDiff;
                for (var i = 0; i < players.length + ais.length; ++i) {
                    tmpObj = players[i]||ais[i-players.length];
                    if (tmpObj && tmpObj.visible) {
                        if (tmpObj.forcePos) {
                            tmpObj.x = tmpObj.x2;
                            tmpObj.y = tmpObj.y2;
                            tmpObj.dir = tmpObj.d2;
                        } else {
                            var total = tmpObj.t2 - tmpObj.t1;
                            var fraction = lastTime - tmpObj.t1;
                            var ratio = (fraction / total);
                            var rate = 170;
                            tmpObj.dt += delta;
                            var tmpRate = Math.min(1.7, tmpObj.dt / rate);
                            var tmpDiff = (tmpObj.x2 - tmpObj.x1);
                            tmpObj.x = tmpObj.x1 + (tmpDiff * tmpRate);
                            tmpDiff = (tmpObj.y2 - tmpObj.y1);
                            tmpObj.y = tmpObj.y1 + (tmpDiff * tmpRate);
                            tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                        }
                    }
                }

                // RENDER CORDS:
                var xOffset = camX - (maxScreenWidth / 2);
                var yOffset = camY - (maxScreenHeight / 2);

                // RENDER BACKGROUND:
                if (config.snowBiomeTop - yOffset <= 0 && config.mapScale - config.snowBiomeTop - yOffset >= maxScreenHeight) {
                    mainContext.fillStyle = "#b6db66";
                    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                } else if (config.mapScale - config.snowBiomeTop - yOffset <= 0) {
                    mainContext.fillStyle = "#dbc666";
                    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                } else if (config.snowBiomeTop - yOffset >= maxScreenHeight) {
                    mainContext.fillStyle = "#fff";
                    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                } else if (config.snowBiomeTop - yOffset >= 0) {
                    mainContext.fillStyle = "#fff";
                    mainContext.fillRect(0, 0, maxScreenWidth, config.snowBiomeTop - yOffset);
                    mainContext.fillStyle = "#b6db66";
                    mainContext.fillRect(0, config.snowBiomeTop - yOffset, maxScreenWidth,
                                         maxScreenHeight - (config.snowBiomeTop - yOffset));
                } else {
                    mainContext.fillStyle = "#b6db66";
                    mainContext.fillRect(0, 0, maxScreenWidth,
                                         (config.mapScale - config.snowBiomeTop - yOffset));
                    mainContext.fillStyle = "#dbc666";
                    mainContext.fillRect(0, (config.mapScale - config.snowBiomeTop - yOffset), maxScreenWidth,
                                         maxScreenHeight - (config.mapScale - config.snowBiomeTop - yOffset));
                }

                // RENDER WATER AREAS:
                if (!firstSetup) {
                    waterMult += waterPlus * config.waveSpeed * delta;
                    if (waterMult >= config.waveMax) {
                        waterMult = config.waveMax;
                        waterPlus = -1;
                    } else if (waterMult <= 1) {
                        waterMult = waterPlus = 1;
                    }
                    mainContext.globalAlpha = 1;
                    mainContext.fillStyle = "#dbc666";
                    renderWaterBodies(xOffset, yOffset, mainContext, config.riverPadding);
                    mainContext.fillStyle = "#91b2db";
                    renderWaterBodies(xOffset, yOffset, mainContext, (waterMult - 1) * 250);
                }
                // RENDER GRID:
                mainContext.lineWidth = 4;
                mainContext.strokeStyle = "#000";
                mainContext.globalAlpha = 0.06;
                mainContext.beginPath();
                for (var x = -camX; x < maxScreenWidth; x += maxScreenHeight / 18) {
                    if (x > 0) {
                        mainContext.moveTo(x, 0);
                        mainContext.lineTo(x, maxScreenHeight);
                    }
                }
                for (var y = -camY; y < maxScreenHeight; y += maxScreenHeight / 18) {
                    if (x > 0) {
                        mainContext.moveTo(0, y);
                        mainContext.lineTo(maxScreenWidth, y);
                    }
                }
                mainContext.stroke();
                // RENDER BOTTOM LAYER:
                mainContext.globalAlpha = 1;
                mainContext.strokeStyle = outlineColor;
                renderGameObjects(-1, xOffset, yOffset);

                // RENDER PROJECTILES:
                mainContext.globalAlpha = 1;
                mainContext.lineWidth = outlineWidth;
                renderProjectiles(0, xOffset, yOffset);

                // RENDER VELOCITY POSITION
                if(myPlayer && myPlayer.alive){
                    mainContext.globalAlpha = 0.5;

                    mainContext.save();
                    mainContext.translate(myPlayer.xVel - xOffset, myPlayer.yVel - yOffset);

                    mainContext.rotate(myPlayer.dir);
                    renderPlayer(myPlayer, mainContext);
                    mainContext.restore();

                    mainContext.globalAlpha = 1;
                }

                // RENDER PLAYERS:
                renderPlayers(xOffset, yOffset, 0);


                // RENDER AI:
                mainContext.globalAlpha = 1;
                for (var i = 0; i < ais.length; ++i) {
                    tmpObj = ais[i];
                    if (tmpObj.active && tmpObj.visible) {
                        tmpObj.animate(delta);
                        mainContext.save();
                        mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                        mainContext.rotate(tmpObj.dir+tmpObj.dirPlus-(Math.PI/2));
                        renderAI(tmpObj, mainContext);
                        mainContext.restore();
                    }
                }

                // RENDER GAME OBJECTS (LAYERED):
                renderGameObjects(0, xOffset, yOffset);
                renderProjectiles(1, xOffset, yOffset);
                renderGameObjects(1, xOffset, yOffset);
                renderPlayers(xOffset, yOffset, 1);
                renderGameObjects(2, xOffset, yOffset);
                renderGameObjects(3, xOffset, yOffset);

                // MAP BOUNDARIES:
                mainContext.fillStyle = "#000";
                mainContext.globalAlpha = 0.09;
                if (xOffset <= 0) {
                    mainContext.fillRect(0, 0, -xOffset, maxScreenHeight);
                } if (config.mapScale - xOffset <= maxScreenWidth) {
                    var tmpY = Math.max(0, -yOffset);
                    mainContext.fillRect(config.mapScale - xOffset, tmpY, maxScreenWidth - (config.mapScale - xOffset), maxScreenHeight - tmpY);
                } if (yOffset <= 0) {
                    mainContext.fillRect(-xOffset, 0, maxScreenWidth + xOffset, -yOffset);
                } if (config.mapScale - yOffset <= maxScreenHeight) {
                    var tmpX = Math.max(0, -xOffset);
                    var tmpMin = 0;
                    if (config.mapScale - xOffset <= maxScreenWidth)
                        tmpMin = maxScreenWidth - (config.mapScale - xOffset);
                    mainContext.fillRect(tmpX, config.mapScale - yOffset,
                                         (maxScreenWidth - tmpX) - tmpMin, maxScreenHeight - (config.mapScale - yOffset));
                }

                renderEnemyTraps(xOffset, yOffset);
                for(let object of predictObjects){
                    mainContext.globalAlpha = .6;

                    mainContext.save();
                    mainContext.translate(object.x - xOffset, object.y - yOffset);

                    let image = getItemSprite({id: object.id, name: object.name, scale: object.scale, prediction: true, preplace: object.preplace});
                    mainContext.drawImage(image, -(image.width / 2), -(image.height / 2));

                    mainContext.rotate(object.angle);
                    mainContext.restore();
                }

                for(let i in visibleObjects){
                    let object = visibleObjects[i];

                    if(UTILS.getDistance(myPlayer.x, myPlayer.y, object.x, object.y) < 300 && object.isItem){
                        mainContext.globalAlpha = 1;
                        mainContext.lineCap = "round";

                        mainContext.strokeStyle = darkOutlineColor;
                        mainContext.lineWidth = 12.5;

                        mainContext.beginPath();
                        mainContext.arc(object.x - xOffset, object.y - yOffset, object.id > 5 && object.id < 10 ? 30 : 20, 0, object.health * (Math.PI * 2 / object.maxHealth))
                        mainContext.stroke();

                        mainContext.strokeStyle = object.owner.sid == myPlayer.sid ? "#8ecc51" : isAlly(object.owner.sid) ? "#518ecc" : "#cc5151";
                        mainContext.lineWidth = 5;

                        mainContext.beginPath();
                        mainContext.arc(object.x - xOffset, object.y - yOffset, object.id > 5 && object.id < 10 ? 30 : 20, 0, object.health * (Math.PI * 2 / object.maxHealth))
                        mainContext.stroke();
                    }
                }

                // RENDER DAY/NIGHT TIME:
                mainContext.globalAlpha = 1;
                mainContext.fillStyle = "rgba(0, 0, 70, 0.55)";
                mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                let bowr = false;
                mainContext.strokeStyle = darkOutlineColor;
                mainContext.globalAlpha = 1;

                // RENDER PLAYER AND AI UI / PLAYERINFOS:
                mainContext.strokeStyle = darkOutlineColor;
                for (var i = 0; i < players.length + ais.length; ++i) {
                    tmpObj = players[i]||ais[i-players.length];
                    if (tmpObj.visible) {

                        // NAME AND HEALTH:
                        if (tmpObj.skinIndex != 10 || (tmpObj==myPlayer) || (tmpObj.team && tmpObj.team==myPlayer.team)) {
                            var tmpText = (tmpObj.team ? `[${tmpObj.team}] ` : ``) + (tmpObj.name || ``) + (tmpObj == myPlayer ? ` [${getPredictDamage()}]` : ``);
                            if (tmpText != "") {
                                mainContext.font = (tmpObj.nameScale||30) + "px Hammersmith One";
                                mainContext.fillStyle = "#fff";
                                mainContext.textBaseline = "middle";
                                mainContext.textAlign = "center";
                                mainContext.lineWidth = (tmpObj.nameScale?11:8);
                                mainContext.lineJoin = "round";
                                mainContext.strokeText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                if (tmpObj.sid && tmpObj.isPlayer) {
                                    mainContext.fillText(tmpObj.sid, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY + 67);
                                }
                                mainContext.fillText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                if (tmpObj.isLeader && iconSprites["crown"].isLoaded) {
                                    var tmpS = config.crownIconScale;
                                    var tmpX = tmpObj.x - xOffset - (tmpS/2) - (mainContext.measureText(tmpText).width / 2) - config.crownPad;
                                    mainContext.drawImage(iconSprites["crown"], tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                                                          - config.nameY - (tmpS/2) - 5, tmpS, tmpS);
                                } if (tmpObj.iconIndex == 1 && iconSprites["skull"].isLoaded) {
                                    var tmpS = config.crownIconScale;
                                    var tmpX = tmpObj.x - xOffset - (tmpS/2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad;
                                    mainContext.drawImage(iconSprites["skull"], tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                                                          - config.nameY - (tmpS/2) - 5, tmpS, tmpS);
                                }
                            }

                            tmpObj.isPlayer && (
                                mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One",
                                mainContext.fillStyle = "#ffffff",
                                mainContext.textBaseline = "middle",
                                mainContext.textAlign = "center",
                                mainContext.lineWidth = tmpObj.nameScale ? 11 : 8,
                                mainContext.lineJoin = "round",
                                mainContext.strokeText(tmpObj.shameCount,
                                                       (tmpObj.iconIndex == 1 ? (tmpObj.x - xOffset - 30 + mainContext.measureText(tmpText).width / 2 + config.crownPad * 3.5 + 5) : (tmpObj.x - xOffset + mainContext.measureText(tmpText).width / 2 + config.crownPad)),
                                                       tmpObj.y - yOffset - tmpObj.scale - config.nameY),

                                mainContext.fillText(tmpObj.shameCount,
                                                     (tmpObj.iconIndex == 1 ? (tmpObj.x - xOffset - 30 + mainContext.measureText(tmpText).width / 2 + config.crownPad * 3.5 + 5) : (tmpObj.x - xOffset + mainContext.measureText(tmpText).width / 2 + config.crownPad)),
                                                     tmpObj.y - yOffset - tmpObj.scale - config.nameY))

                            if(tmpObj.isPlayer && tmpObj.alive && tmpObj.sid == myPlayer.sid){
                                mainContext.strokeStyle = "#ffffff";
                                mainContext.lineWidth = 2.5;

                                mainContext.beginPath();

                                mainContext.moveTo(spikeKnockPosLine.x - xOffset, spikeKnockPosLine.y - yOffset);
                                mainContext.lineTo(spikeKnockPosLine.x2 - xOffset, spikeKnockPosLine.y2 - yOffset);

                                mainContext.stroke();
                                mainContext.strokeStyle = darkOutlineColor;
                            }

                            if(tmpObj.isPlayer && tmpObj.alive && tmpObj.sid == myPlayer.sid && autoPush){
                                mainContext.strokeStyle = "#ffffff";
                                mainContext.lineWidth = 5;

                                mainContext.beginPath();
                                mainContext.moveTo(myPlayer.x - xOffset, myPlayer.y - yOffset);

                                mainContext.lineTo(pushPositions.x - xOffset, pushPositions.y - yOffset);
                                mainContext.lineTo(pushPositions.x2 - xOffset, pushPositions.y2 - yOffset);

                                mainContext.stroke();
                                mainContext.strokeStyle = darkOutlineColor;
                            }

                            tmpObj.isPlayer && (mainContext.fillStyle = darkOutlineColor,
                                                mainContext.roundRect(tmpObj.x - xOffset - 50 - config.healthBarPad,
                                                                      tmpObj.y - yOffset + tmpObj.scale + config.nameY - 13,
                                                                      2 * 23.5 + 2 * config.healthBarPad, 17, 10),
                                                mainContext.fill(),
                                                mainContext.fillStyle = "#cba24f",
                                                mainContext.roundRect(tmpObj.x - xOffset - 50,
                                                                      tmpObj.y - yOffset + tmpObj.scale + config.nameY - 13 + config.healthBarPad,
                                                                      2 * 23.5 * primaryReload[tmpObj.sid], 16 - 2 * config.healthBarPad, 10),
                                                mainContext.fill())

                            tmpObj.isPlayer && (mainContext.fillStyle = darkOutlineColor,
                                                mainContext.roundRect(tmpObj.x - xOffset + 2 - config.healthBarPad,
                                                                      tmpObj.y - yOffset + tmpObj.scale + config.nameY - 13,
                                                                      2 * 23.5 + 2 * config.healthBarPad, 17, 10),
                                                mainContext.fill(),
                                                mainContext.fillStyle = "#cba24f",
                                                mainContext.roundRect(tmpObj.x - xOffset + 2,
                                                                      tmpObj.y - yOffset + tmpObj.scale + config.nameY - 13 + config.healthBarPad,
                                                                      2 * 23.5 * secondaryReload[tmpObj.sid], 16 - 2 * config.healthBarPad, 10),
                                                mainContext.fill())

                            if(tmpObj.health > 0){
                                // HEALTH HOLDER:
                                var tmpWidth = config.healthBarWidth;
                                mainContext.fillStyle = darkOutlineColor;
                                mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                      (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                                      (config.healthBarPad * 2), 17, 8);
                                mainContext.fill();

                                // HEALTH BAR:
                                mainContext.fillStyle = (tmpObj==myPlayer||(tmpObj.team&&tmpObj.team==myPlayer.team))?"#8ecc51":"#cc5151";
                                mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                      (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                      ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 7);
                                mainContext.fill();
                            }

                        }
                    }
                }

                // RENDER ANIM TEXTS:
                textManager.update(delta, mainContext, xOffset, yOffset);

                // RENDER CHAT MESSAGES:
                for (var i = 0; i < players.length; ++i) {
                    tmpObj = players[i];
                    if (tmpObj.visible && tmpObj.chatCountdown > 0) {
                        tmpObj.chatCountdown -= delta;
                        if (tmpObj.chatCountdown <= 0)
                            tmpObj.chatCountdown = 0;
                        mainContext.font = "32px Hammersmith One";
                        var tmpSize = mainContext.measureText(tmpObj.chatMessage);
                        mainContext.textBaseline = "middle";
                        mainContext.textAlign = "center";
                        var tmpX = tmpObj.x - xOffset;
                        var tmpY = tmpObj.y - tmpObj.scale - yOffset - 90;
                        var tmpH = 47;
                        var tmpW = tmpSize.width + 17;
                        mainContext.fillStyle = "rgba(0,0,0,0.2)";
                        mainContext.roundRect(tmpX-tmpW/2, tmpY-tmpH/2, tmpW, tmpH, 6);
                        mainContext.fill();
                        mainContext.fillStyle = "#fff";
                        mainContext.fillText(tmpObj.chatMessage, tmpX, tmpY);
                    }
                }
            }

            // RENDER MINIMAP:
            renderMinimap(delta);
            function createMiniStats() {
            if (document.getElementById("miniStats")) return;

            const stats = document.createElement("div");
            stats.id = "miniStats";
            stats.style.position = "fixed";
            stats.style.top = "15px";
            stats.style.left = "20px";
            stats.style.background = "rgba(10, 10, 15, 0.75)";
            stats.style.color = "#00eaff";
            stats.style.fontFamily = "Consolas, monospace";
            stats.style.fontSize = "18px";
            stats.style.fontWeight = "600";
            stats.style.padding = "10px 15px";
            stats.style.borderRadius = "10px";
            stats.style.border = "2px solid rgba(0, 255, 255, 0.5)";
            stats.style.boxShadow = "0 0 15px rgba(0,255,255,0.3)";
            stats.style.zIndex = "999999";
            stats.style.textShadow = "0 0 6px rgba(0,255,255,0.7)";
            stats.style.cursor = "move"; // sürüklenebilir olduğunu gösterir

            stats.innerHTML = `
                <div style="margin: 4px 0;">
                    <span style="color:#00ff7f;">FPS:</span>
                    <span id="fpsVal" style="float:right;">0</span>
                </div>
                <div style="margin: 4px 0;">
                    <span style="color:#ffcc00;">PING:</span>
                    <span id="pingVal" style="float:right;">0</span>
                </div>
            `;
            document.body.appendChild(stats);

            // Güncelleme fonksiyonu
            function updateMiniStats() {
                if (typeof window.pingTime !== "undefined")
                    document.getElementById("pingVal").textContent = window.pingTime;
                if (typeof fpsTimer !== "undefined" && fpsTimer.ltime)
                    document.getElementById("fpsVal").textContent = Math.round(fpsTimer.ltime);
                requestAnimationFrame(updateMiniStats);
            }
            updateMiniStats();

            // --------- SÜRÜKLEME KODU ----------
            let isDragging = false;
            let offsetX = 0, offsetY = 0;

            stats.addEventListener("mousedown", (e) => {
                isDragging = true;
                offsetX = e.clientX - stats.getBoundingClientRect().left;
                offsetY = e.clientY - stats.getBoundingClientRect().top;
            });

            document.addEventListener("mousemove", (e) => {
                if (isDragging) {
                    stats.style.left = e.clientX - offsetX + "px";
                    stats.style.top = e.clientY - offsetY + "px";
                }
            });

            document.addEventListener("mouseup", () => {
                isDragging = false;
            });
        }

        createMiniStats();
            // RENDER CONTROLS:
            if (controllingTouch.id !== -1) {
                renderControl(
                    controllingTouch.startX, controllingTouch.startY,
                    controllingTouch.currentX, controllingTouch.currentY
                );
            }
            if (attackingTouch.id !== -1) {
                renderControl(
                    attackingTouch.startX, attackingTouch.startY,
                    attackingTouch.currentX, attackingTouch.currentY
                );
            }
        }

        function renderEnemyTraps(xOffset, yOffset){
            for(let i in predictEnemyTraps){
                let object = predictEnemyTraps[i];

                mainContext.save();
                mainContext.translate(object.x - xOffset, object.y - yOffset);
                let image = getItemSprite({id: object.id, name: items.list[object.id].name, scale: 40, predictEnemyTrap: true});
                mainContext.globalAlpha = .6;
                mainContext.drawImage(image, -(image.width / 2), -(image.height / 2));
                mainContext.restore();
            }
        }

        // RENDER CONTROL:
        function renderControl(startX, startY, currentX, currentY) {
            mainContext.save();
            mainContext.setTransform(1, 0, 0, 1, 0, 0);
            // mainContext.resetTransform();
            mainContext.scale(pixelDensity, pixelDensity);
            var controlRadius = 50;
            mainContext.beginPath();
            mainContext.arc(startX, startY, controlRadius, 0, Math.PI * 2, false);
            mainContext.closePath();
            mainContext.fillStyle = "rgba(255, 255, 255, 0.3)";
            mainContext.fill();
            var offsetX = currentX - startX;
            var offsetY = currentY - startY;
            var mag = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
            var divisor = mag > controlRadius ? (mag / controlRadius) : 1;
            offsetX /= divisor;
            offsetY /= divisor;
            mainContext.beginPath();
            mainContext.arc(startX + offsetX, startY + offsetY, controlRadius * 0.5, 0, Math.PI * 2, false);
            mainContext.closePath();
            mainContext.fillStyle = "white";
            mainContext.fill();
            mainContext.restore();
        }

        // RENDER PROJECTILES:
        function renderProjectiles(layer, xOffset, yOffset) {
            for (var i = 0; i < projectiles.length; ++i) {
                tmpObj = projectiles[i];
                if (tmpObj.active && tmpObj.layer == layer) {
                    tmpObj.update(delta);
                    if (tmpObj.active && isOnScreen(tmpObj.x-xOffset, tmpObj.y-yOffset, tmpObj.scale)) {
                        mainContext.save();
                        mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                        mainContext.rotate(tmpObj.dir);
                        renderProjectile(0, 0, tmpObj, mainContext, 1);
                        mainContext.restore();
                    }
                }
            }
        }

        // RENDER PROJECTILE:
        var projectileSprites = {};
        function renderProjectile(x, y, obj, ctxt, debug) {
            if (obj.src) {
                var tmpSrc = items.projectiles[obj.indx].src;
                var tmpSprite = projectileSprites[tmpSrc];
                if (!tmpSprite) {
                    tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    }
                    tmpSprite.src = ".././img/weapons/" + tmpSrc + ".png";
                    projectileSprites[tmpSrc] = tmpSprite;
                }
                if (tmpSprite.isLoaded)
                    ctxt.drawImage(tmpSprite, x - (obj.scale / 2), y - (obj.scale / 2), obj.scale, obj.scale);
            } else if (obj.indx == 1) {
                ctxt.fillStyle = "#939393";
                renderCircle(x, y, obj.scale, ctxt);
            }
        }

        // RENDER WATER BODIES:
        function renderWaterBodies(xOffset, yOffset, ctxt, padding) {
            // MIDDLE RIVER:
            var tmpW = config.riverWidth + padding;
            var tmpY = (config.mapScale / 2) - yOffset - (tmpW / 2);
            if (tmpY < maxScreenHeight && tmpY + tmpW > 0) {
                ctxt.fillRect(0, tmpY, maxScreenWidth, tmpW);
            }
        }

        // RENDER GAME OBJECTS:
        function renderGameObjects(layer, xOffset, yOffset) {
            var tmpSprite, tmpX, tmpY;
            for (var i = 0; i < gameObjects.length; ++i) {
                tmpObj = gameObjects[i];
                if (tmpObj.active) {
                    tmpX = tmpObj.x + tmpObj.xWiggle - xOffset;
                    tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;
                    if (layer == 0) {
                        tmpObj.update(delta);
                    }
                    if (tmpObj.layer == layer && isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker||0))) {
                        mainContext.globalAlpha = tmpObj.hideFromEnemy?0.6:1;
                        if(tmpObj.isItem){
                            tmpSprite = getItemSprite(tmpObj);

                            mainContext.save();
                            mainContext.translate(tmpX, tmpY);
                            mainContext.rotate(tmpObj.dir);
                            mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));

                            if(tmpObj.blocker){
                                mainContext.strokeStyle = "#db6e6e";
                                mainContext.globalAlpha = 0.3;
                                mainContext.lineWidth = 6;
                                renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
                            }

                            mainContext.restore();
                        } else {
                            tmpSprite = getResSprite(tmpObj);
                            mainContext.drawImage(tmpSprite, tmpX - (tmpSprite.width / 2), tmpY - (tmpSprite.height / 2));
                        }
                    }
                }
            }
        }
        let detect = {
            insta: false,
            reverse: false,
            onetick: false,
            spiketick: false,
            barbarian: false,
            antibull: false,
            antibullhit: false,
            bowInsta: false,
            antiSync: false,
        }
        // GATHER ANIMATION:
        function gatherAnimation(sid, isObjectHit, weapon) {
            tmpObj = findPlayerBySID(sid);
            if (tmpObj) {
                hits.push({player: tmpObj, isObjectHit: isObjectHit, weapon: weapon});

                if(isObjectHit){
                    objectHits.push({objects: damageObjects, player: tmpObj, weapon: weapon});
                    damageObjects = [];
                }

                tmpObj.startAnim(isObjectHit, weapon);
            }
            if (UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestEnemy.x2, nearestEnemy.y2) <= 400 && UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestEnemy.x2, nearestEnemy.y2) >= 170 && UTILS.getAngleDist(tmpDir, tmpObj.dir) <= config.gatherAngle) {
                if ((tmpObj.weaponIndex == 12 || tmpObj.weaponIndex == 13) && (tmpObj.skinIndex == 53 || tmpObj.skinIndex == 7)) {
                    detect.onetick = true;
                } else {
                    detect.onetick = false;
                }
            } else {
                detect.onetick = false;
            }
        }

        // RENDER PLAYERS:
        function renderPlayers(xOffset, yOffset, zIndex) {
            mainContext.globalAlpha = 1;
            for (var i = 0; i < players.length; ++i) {
                tmpObj = players[i];
                if (tmpObj.zIndex == zIndex) {
                    tmpObj.animate(delta);
                    if (tmpObj.visible) {
                        tmpObj.skinRot += (0.002 * delta);
                        tmpDir = ((tmpObj == myPlayer) ? getAttackDir() : tmpObj.dir) + tmpObj.dirPlus;
                        mainContext.save();
                        mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                        // RENDER PLAYER:
                        mainContext.rotate(tmpDir);
                        renderPlayer(tmpObj, mainContext);
                        mainContext.restore();
                    }
                }
            }
        }

        // RENDER PLAYER:
        function renderPlayer(obj, ctxt) {
            ctxt = ctxt || mainContext;
            ctxt.lineWidth = outlineWidth;
            ctxt.lineJoin = "miter";
            var handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS||1);
            var oHandAngle = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndS||1):1;
            var oHandDist = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndD||1):1;

            // TAIL/CAPE:
            if (obj.tailIndex > 0) {
                renderTail(obj.tailIndex, ctxt, obj);
            }

            // WEAPON BELLOW HANDS:
            if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                    renderProjectile(obj.scale, 0,
                                     items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                }
            }

            // HANDS:
            ctxt.fillStyle = config.skinColors[obj.skinColor];
            renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
            renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                         (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

            // WEAPON ABOVE HANDS:
            if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                    renderProjectile(obj.scale, 0,
                                     items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                }
            }

            // BUILD ITEM:
            if (obj.buildIndex >= 0) {
                var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
            }

            // BODY:
            renderCircle(0, 0, obj.scale, ctxt);

            // SKIN:
            if (obj.skinIndex > 0) {
                ctxt.rotate(Math.PI/2);
                renderSkin(obj.skinIndex, ctxt, null, obj);
            }
        }
        // === UPDATED TEXTURE PACK ===

        // --- HATS ---
        let newHatImgs = {
            6: "https://i.imgur.com/vM9Ri8g.png",                       //soldier helmet
            7: "https://i.imgur.com/xJ3SBcn.png",                       //bull hat - my new idea
            8: "https://i.imgur.com/kf8yAC2.png",                       //red (winter) cap xd
            9: "https://i.imgur.com/1nY34aL.png",                       //miers gear
            11: "https://i.imgur.com/yfqME8H.png",                      //spike gear
            "11_p": "https://i.imgur.com/yfqME8H.png",
            "11_top": "https://i.imgur.com/s7Cxc9y.png",
            12: "https://i.imgur.com/qFghS5s.png",                      //booster hat
            13: "https://i.imgur.com/EwkbsHN.png",                      //healer helmet
            14: "https://i.imgur.com/V8JrIwv.png",                      //windmill hat
            "14_p": "https://i.imgur.com/V8JrIwv.png",                  //windmill p
            "14_top": "https://i.imgur.com/V8JrIwv.png",                //windmill top
            15: "https://i.postimg.cc/Fs8KDTsz/assfurryhacker.webp",    //winter cap
            20: "https://i.imgur.com/vcy6Xxo.png",                      //samurai armor
            23: "https://i.imgur.com/B9AcmcN.png",                      //anti venum gear
            26: "https://i.imgur.com/I0xGtyZ.png",                      //Barbarian Armor
            31: "http://u.cubeupload.com/nicholas/scuba.png",           //flipper hat
            40: "https://i.imgur.com/pe3Yx3F.png",                      //tank gear
            22: "http://u.cubeupload.com/nicholas/emp.png",             //emp Helmet

            // === New from Updated_Texture_Pack.txt ===
            41: "https://i.imgur.com/L8L6Q7W.png",
            42: "https://i.imgur.com/dtPiqz2.png",
            43: "https://i.imgur.com/sKu0X5X.png",
            44: "https://i.imgur.com/9owV41E.png",
            45: "https://i.imgur.com/nlXZfHh.png",
            46: "https://i.imgur.com/MtWkhHa.png",
            47: "https://i.imgur.com/MQzxZJ5.png",
            48: "https://i.imgur.com/ZtYH9bn.png",
            49: "https://i.imgur.com/TQIoD2V.png",
            50: "https://i.imgur.com/sD24kkl.png",
            51: "https://i.imgur.com/3PHM5E7.png",
            52: "https://i.imgur.com/KuI67yx.png",
        };

        // --- ACCESSORIES ---
        let newAccImgs = {
            18: "https://i.imgur.com/0rmN7L9.png",                      // bloody wings ?
            19: "https://i.imgur.com/Qyxy7IB.png",                      // speed wigs ?
            21: "https://i.imgur.com/eikGSfv.png",                      // corrupt wings ?

            // === New from Updated_Texture_Pack.txt ===
            22: "https://i.imgur.com/jVULu9W.png",      // not works
            23: "https://i.imgur.com/NxTb8TP.png",      // not works
            24: "https://i.imgur.com/2NlTuIA.png",      // not works
            25: "https://i.imgur.com/TaR2p6E.png",      // not works
        };

        // --- WEAPONS ---
        let newWeaponImgs = {
            sword_1_g: "https://i.imgur.com/wOTr8TG.png",                   // golden first sword
            sword_1_d: "https://i.postimg.cc/5ycbszbC/sword-1-d.png",       // diamond first sword
            sword_1_r: "https://i.imgur.com/V9dzAbF.png",                   // ruby first sword
            samurai_1_g: "https://i.imgur.com/QKBc2ou.png",                 // golden katana
            samurai_1_d: "https://i.postimg.cc/vBKdcV4G/samurai-1-d.png",   // diamond katana
            samurai_1_r: "https://i.imgur.com/cHSvjlv.png",                 // ruby katana
            spear_1_g: "https://i.imgur.com/jKDdyvc.png",                   // golden polearm
            spear_1_d: "https://i.postimg.cc/0QzyWxm9/spear-1-d.png",       // diamond polearm
            spear_1_r: "https://i.imgur.com/UY7SV7j.png",                   // ruby polearm
            great_hammer_1_g: "",// gold great hammer
            great_hammer_1_d: "https://i.imgur.com/Fg93gj3.png",            // diam great hammer
            great_hammer_1_r: "https://i.imgur.com/tmUzurk.png",            // ruby great hammer
            hammer_1_g: "",//gold first hammer
            hammer_1_d: "",//diamond first hammer
            hammer_1_r: "https://i.imgur.com/oRXUfW8.png",                  // ruby first hammer
            bat_1_g: "https://i.imgur.com/ivLPh10.png",                     // golden bat
            bat_1_d: "https://i.imgur.com/phXTNsa.png",                     // diamond bat
            bat_1_r: "https://i.imgur.com/6ayjbIz.png",                     // ruby bat
            axe_1_g: "",
            axe_1_d: "",
            axe_1_r: "https://i.imgur.com/kr8H9g7.png",                     // ruby axe
            great_axe_1_g: "",
            great_axe_1_d: "",
            great_axe_1_r: "https://i.imgur.com/UZ2HcQw.png",               // ruby great axe
            shield_1_g: "https://i.imgur.com/zYP8eVL.png",                  //gold shield
            shield_1_d: "https://i.imgur.com/DAtKdXC.png",                  //diamond shield
            shield_1_r: "https://i.imgur.com/SNFV2dc.png",                  // ruby shield
            dagger_1_g: "",                                                 //golden daggers
            dagger_1_d: "https://i.postimg.cc/MHcqDYCJ/dagger-1-d.png",     // diamond daggers
            dagger_1_r: "https://i.imgur.com/CDAmjux.png",                  // ruby daggers
            stick_1_g: "",
            stick_1_d: "",
            stick_1_r: "https://i.imgur.com/aEs3FSU.png",                   // ruby stick
            grab_1_g: "https://imgur.com/DRzBdFX",                          // golden grab(hand)
            grab_1_d: "https://i.imgur.com/7kbtWfk.png",                    // diamond grab(hand)
            grab_1_r: "https://i.imgur.com/wV42LEE.png",                    // ruby grab(hand)


            // - - - BOWS - - -
            bow_1_g: "https://i.imgur.com/G4OfZGI.png",                     // fake ruby bow
            bow_1_d: "https://i.imgur.com/G4OfZGI.png",                     // fake ruby bow
            bow_1_r: "https://i.imgur.com/G4OfZGI.png",                     // ruby bow
            crossbow_1_g: "https://i.imgur.com/JHcAxkE.png",                // fake ruby crossbow
            crossbow_1_d: "https://i.imgur.com/JHcAxkE.png",                // fake ruby crossbow
            crossbow_1_r: "https://i.imgur.com/JHcAxkE.png",                // ruby crossbow
            crossbow_2_g: "https://i.imgur.com/TfCSqQW.png",                // fake ruby rptcrossbow
            crossbow_2_d: "https://i.imgur.com/TfCSqQW.png",                // fake ruby rptcrossbow
            crossbow_2_r: "https://i.imgur.com/TfCSqQW.png",                // ruby rptcrossbow

        };

        // --- ANIMALS ---
        let newAnimalsPack = {
            "enemy": "https://i.postimg.cc/GhhM9WSq/enemy-Num1.webp",
            "pig_1": "https://i.postimg.cc/5yGfKtJT/pig-1.webp",
            "wolf_1": "https://i.postimg.cc/bNMryPCb/undefined-Imgur-1.png",
            "wolf_2": "https://i.imgur.com/wANrStd.png",
            "cow_1": "https://i.imgur.com/7kuCRCr.png",
            "bull_1": "https://i.imgur.com/ii5D3tH.png",
            "bull_2": "https://i.imgur.com/eKlFlSj.png",

            // === New from Updated_xstylee_Pack.txt ===

            "pig_2": "https://i.imgur.com/YZmgZ4m.png",
            "cow_2": "https://i.imgur.com/7kuCRCr.png",
            "bull_3": "https://i.imgur.com/ii5D3tH.png",
            "chicken_1": "https://i.imgur.com/UtBEmai.png",
            "chicken_2": "https://i.imgur.com/UtBEmai.png",
        };

        function getTexturePackImg(e, t) {
            const texturePacks = {
                hat: newHatImgs,
                acc: newAccImgs,
                weapons: newWeaponImgs,
                animals: newAnimalsPack
            };

            if (texturePacks[t] && texturePacks[t][e]) {
                return texturePacks[t][e];
            }

            const pathMap = {
                acc: ".././img/accessories/access_",
                hat: ".././img/hats/hat_",
                animals: ".././img/animals/",
                weapons: ".././img/weapons/"
            };

            return (pathMap[t] || ".././img/weapons/") + e + ".png";
        }
        // RENDER SKINS:
       let skinSprites = {};
        let skinPointers = {};
        let tmpSkin;
        function renderSkin(index, ctxt, parentSkin, owner) {
            tmpSkin = skinSprites[index];
            if (!tmpSkin) {
                let tmpImage = new Image();
                tmpImage.onload = function() {
                    this.isLoaded = true;
                    this.onload = null;
                };
                tmpImage.src = getTexturePackImg(index, "hat");
                skinSprites[index] = tmpImage;
                tmpSkin = tmpImage;
            }

            let _ = parentSkin||skinPointers[index];

            if (!_) {
                for (let i = 0; i < hats.length; ++i) {
                    if (hats[i].id == index) {
                        _ = hats[i];
                        break;
                    }
                }
                skinPointers[index] = _;
            }

            if (tmpSkin.isLoaded) ctxt.drawImage(tmpSkin, -_.scale/2, -_.scale/2, _.scale, _.scale);

            if (!parentSkin && _.topSprite) {
                ctxt.save();
                ctxt.rotate(owner.skinRot);
                renderSkin(index + "_top", ctxt, _, owner);
                ctxt.restore();
            }
        }

        // RENDER TAIL:
        var accessSprites = {};
        var accessPointers = {};
        function renderTail(index, ctxt, owner) {
            tmpSkin = accessSprites[index];
            if (!tmpSkin) {
                var tmpImage = new Image();
                tmpImage.onload = function() {
                    this.isLoaded = true;
                    this.onload = null;
                };
                tmpImage.src = ".././img/accessories/access_" + index + ".png";
                accessSprites[index] = tmpImage;
                tmpSkin = tmpImage;
            }
            var tmpObj = accessPointers[index];
            if (!tmpObj) {
                for (var i = 0; i < accessories.length; ++i) {
                    if (accessories[i].id == index) {
                        tmpObj = accessories[i];
                        break;
                    }
                }
                accessPointers[index] = tmpObj;
            }
            if (tmpSkin.isLoaded) {
                ctxt.save();
                ctxt.translate(-20 - (tmpObj.xOff||0), 0);
                if (tmpObj.spin)
                    ctxt.rotate(owner.skinRot);
                ctxt.drawImage(tmpSkin, -(tmpObj.scale/2), -(tmpObj.scale/2), tmpObj.scale, tmpObj.scale);
                ctxt.restore();
            }
        }

        // RENDER TOOL:
        let toolSprites = {};
        function renderTool(obj, variant, x, y, ctxt) {
          let tmpSrc = obj.src + (variant||"");
          let tmpSprite = toolSprites[tmpSrc];

          if (!tmpSprite) {
              tmpSprite = new Image();
              tmpSprite.onload = function() {
                  this.isLoaded = true;
              }
              tmpSprite.src = getTexturePackImg(tmpSrc, "weapons");
              toolSprites[tmpSrc] = tmpSprite;
          }

          if (tmpSprite.isLoaded) ctxt.drawImage(tmpSprite, x + obj.xOff - (obj.length / 2), y + obj.yOff - (obj.width / 2), obj.length, obj.width);
      }

        // RENDER GAME OBJECTS:
        var gameObjectSprites = {};
        function getResSprite(obj) {
            var biomeID = (obj.y>=config.mapScale-config.snowBiomeTop)?2:((obj.y<=config.snowBiomeTop)?1:0);
            var tmpIndex = (obj.type + "_" + obj.scale + "_" + biomeID);
            var tmpSprite = gameObjectSprites[tmpIndex];
            if (!tmpSprite) {
                var tmpCanvas = document.createElement('canvas');
                tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.1) + outlineWidth;
                var tmpContext = tmpCanvas.getContext('2d');
                tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                tmpContext.rotate(UTILS.randFloat(0, Math.PI));
                tmpContext.strokeStyle = outlineColor;
                tmpContext.lineWidth = outlineWidth;
                let colors = [
                    ["#b1d959", "#95b946"],
                    ["#bade6e", "#aac76b"],
                    ["#a7d544", "#86a63f"],
                    ["#b4db62", "#9ebf57"]
                ]
                let select = colors[Math.floor(Math.random() * colors.length)];
                if (obj.type == 0) {
                    var tmpScale;
                    for (var i = 0; i < 2; ++i) {
                        tmpScale = tmpObj.scale * (!i?1:0.5);
                        renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                        tmpContext.fillStyle = !biomeID?(!i?"#9ebf57":"#b4db62"):(!i?"#e3f1f4":"#fff");
                        tmpContext.fill();
                        if (!i)
                            tmpContext.stroke();
                    }
                } else if (obj.type == 1) {
                    if (biomeID == 2) {
                        tmpContext.fillStyle = "#606060";
                        renderStar(tmpContext, 6, obj.scale * 0.3, obj.scale * 0.71);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#89a54c";
                        renderCircle(0, 0, obj.scale * 0.55, tmpContext);
                        tmpContext.fillStyle = "#a5c65b";
                        renderCircle(0, 0, obj.scale * 0.3, tmpContext, true);
                    } else {
                        renderBlob(tmpContext, 6, tmpObj.scale, tmpObj.scale * 0.7);
                        tmpContext.fillStyle = biomeID?"#e3f1f4":"#89a54c";
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = biomeID?"#6a64af":"#c15555";
                        var tmpRange;
                        var berries = 4;
                        var rotVal = mathPI2 / berries;
                        for (var i = 0; i < berries; ++i) {
                            tmpRange = UTILS.randInt(tmpObj.scale/3.5, tmpObj.scale/2.3);
                            renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                         UTILS.randInt(10, 12), tmpContext);
                        }
                    }
                } else if (obj.type == 2 || obj.type == 3) {
                    tmpContext.fillStyle = (obj.type==2)?(biomeID==2?"#938d77":"#939393"):"#e0c655";
                    renderStar(tmpContext, 3, obj.scale, obj.scale);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = (obj.type==2)?(biomeID==2?"#b2ab90":"#bcbcbc"):"#ebdca3";
                    renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                    tmpContext.fill();
                }
                tmpSprite = tmpCanvas;
                gameObjectSprites[tmpIndex] = tmpSprite;
            }
            return tmpSprite;
        }

        // GET ITEM SPRITE:
        var itemSprites = [];
        function getItemSprite(obj, asIcon) {
            var tmpSprite = itemSprites[obj.id + (obj.predictEnemyTrap ? 100 : (obj.prediction ? (obj.preplace ? 200 : 300) : 0))];
            if (!tmpSprite || asIcon) {
                var tmpCanvas = document.createElement('canvas');
                tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.5) + outlineWidth +
                    (items.list[obj.id].spritePadding||0);
                var tmpContext = tmpCanvas.getContext('2d');
                tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                tmpContext.rotate(asIcon?0:(Math.PI/2));
                tmpContext.strokeStyle = obj.prediction ? obj.preplace ? "#0000ff" : "#ff0000" : outlineColor;
                tmpContext.lineWidth = outlineWidth * (asIcon?(tmpCanvas.width/81):1);
                if (obj.name == "apple") {
                    tmpContext.fillStyle = "#c15555";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#89a54c";
                    var leafDir = -(Math.PI / 2);
                    renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir),
                               25, leafDir + Math.PI/2, tmpContext);
                } else if (obj.name == "cookie") {
                    tmpContext.fillStyle = "#cca861";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#937c4b";
                    var chips = 4;
                    var rotVal = mathPI2 / chips;
                    var tmpRange;
                    for (var i = 0; i < chips; ++i) {
                        tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                        renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                     UTILS.randInt(4, 5), tmpContext, true);
                    }
                } else if (obj.name == "cheese") {
                    tmpContext.fillStyle = "#f4f3ac";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#c3c28b";
                    var chips = 4;
                    var rotVal = mathPI2 / chips;
                    var tmpRange;
                    for (var i = 0; i < chips; ++i) {
                        tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                        renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                     UTILS.randInt(4, 5), tmpContext, true);
                    }
                } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                    tmpContext.fillStyle = (obj.name == "castle wall")?"#83898e":(obj.name=="wood wall")?
                        "#a5974c":"#939393";
                    var sides = (obj.name == "castle wall")?4:3;
                    renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = (obj.name == "castle wall")?"#9da4aa":(obj.name=="wood wall")?
                        "#c9b758":"#bcbcbc";
                    renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes"){
                    tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";

                    var tmpScale = (obj.scale * 0.6);
                    renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);

                    tmpContext.fill();
                    tmpContext.stroke();

                    obj.prediction && (
                        tmpContext.globalAlpha = 0.6,
                        tmpContext.fillStyle = obj.preplace ? "#0000ff" : "#ff0000",
                        renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale),
                        tmpContext.fill(),
                        tmpContext.globalAlpha = 1);

                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, tmpScale, tmpContext);

                    obj.prediction && (
                        tmpContext.globalAlpha = 0.6,
                        tmpContext.fillStyle = obj.preplace ? "#0000ff" : "#ff0000",
                        renderCircle(0, 0, tmpScale, tmpContext),
                        tmpContext.globalAlpha = 1);

                    tmpContext.fillStyle = "#c9b758";
                    renderCircle(0, 0, tmpScale / 2, tmpContext, true);

                    obj.prediction && (
                        tmpContext.globalAlpha = 0.6,
                        tmpContext.fillStyle = obj.preplace ? "#0000ff" : "#ff0000",
                        renderCircle(0, 0, tmpScale / 2, tmpContext, !0),
                        tmpContext.globalAlpha = 1);
                } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, obj.scale, tmpContext);

                    obj.prediction && (
                        tmpContext.globalAlpha = 0.6,
                        tmpContext.fillStyle = obj.preplace ? "#0000ff" : "#ff0000",
                        renderCircle(0, 0, obj.scale, tmpContext),
                        tmpContext.globalAlpha = 1);

                    tmpContext.fillStyle = "#c9b758";
                    renderRectCircle(0, 0, obj.scale * 1.5, 29, 4, tmpContext);

                    obj.prediction && (
                        tmpContext.globalAlpha = 0.6,
                        tmpContext.fillStyle = obj.preplace ? "#0000ff" : "#ff0000",
                        renderRectCircle(0, 0, obj.scale * 1.5, 29, 4, tmpContext),
                        tmpContext.globalAlpha = 1);

                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, obj.scale * 0.5, tmpContext);

                    obj.prediction && (
                        tmpContext.globalAlpha = 0.6,
                        tmpContext.fillStyle = obj.preplace ? "#0000ff" : "#ff0000",
                        renderCircle(0, 0, obj.scale * .5, tmpContext),
                        tmpContext.globalAlpha = 1);
                } else if (obj.name == "mine") {
                    tmpContext.fillStyle = "#939393";
                    renderStar(tmpContext, 3, obj.scale, obj.scale);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#bcbcbc";
                    renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "sapling") {
                    for (var i = 0; i < 2; ++i) {
                        var tmpScale = obj.scale * (!i?1:0.5);
                        renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                        tmpContext.fillStyle = (!i?"#9ebf57":"#b4db62");
                        tmpContext.fill();
                        if (!i) tmpContext.stroke();
                    }
                } else if (obj.name == "pit trap") {
                    tmpContext.fillStyle = "#a5974c";
                    renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.fill();
                    tmpContext.stroke();

                    obj.prediction && (
                        tmpContext.globalAlpha = 0.6,
                        tmpContext.fillStyle = obj.preplace ? "#0000ff" : "#ff0000",
                        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1),
                        tmpContext.fill(),
                        tmpContext.globalAlpha = 1);

                    tmpContext.fillStyle = outlineColor;
                    renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                    tmpContext.fill();

                    obj.prediction && (
                        tmpContext.globalAlpha = 0.6,
                        tmpContext.fillStyle = obj.preplace ? "#0000ff" : "#ff0000",
                        renderStar(tmpContext, 3, obj.scale * .65, obj.scale * .65),
                        tmpContext.fill());
                } else if (obj.name == "boost pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale*2, obj.scale*2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#dbd97d";
                    renderTriangle(obj.scale * 1, tmpContext);
                } else if (obj.name == "turret") {
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#939393";
                    var tmpLen = 50;
                    renderRect(0, -tmpLen/2, obj.scale * 0.9, tmpLen, tmpContext);
                    renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                } else if (obj.name == "platform") {
                    tmpContext.fillStyle = "#cebd5f";
                    var tmpCount = 4;
                    var tmpS = obj.scale * 2;
                    var tmpW = tmpS / tmpCount;
                    var tmpX = -(obj.scale/2);
                    for (var i = 0; i < tmpCount; ++i) {
                        renderRect(tmpX - (tmpW/2), 0, tmpW, obj.scale*2, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpX += tmpS / tmpCount;
                    }
                } else if (obj.name == "healing pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale*2, obj.scale*2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#db6e6e";
                    renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                } else if (obj.name == "spawn pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale*2, obj.scale*2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#71aad6";
                    renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                } else if (obj.name == "blocker") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.rotate(Math.PI / 4);
                    tmpContext.fillStyle = "#db6e6e";
                    renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                }  else if (obj.name == "teleporter") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.rotate(Math.PI / 4);
                    tmpContext.fillStyle = "#d76edb";
                    renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
                }
                tmpSprite = tmpCanvas;
                if (!asIcon)
                    itemSprites[obj.id + (obj.predictEnemyTrap ? 100 : (obj.prediction ? (obj.preplace ? 200 : 300) : 0))] = tmpSprite;
            }
            return tmpSprite;
        }

        // RENDER LEAF:
        function renderLeaf(x, y, l, r, ctxt) {
            var endX = x + (l * Math.cos(r));
            var endY = y + (l * Math.sin(r));
            var width = l * 0.4;
            ctxt.moveTo(x, y);
            ctxt.beginPath();
            ctxt.quadraticCurveTo(((x + endX) / 2) + (width * Math.cos(r + Math.PI/2)),
                                  ((y + endY) / 2) + (width * Math.sin(r + Math.PI/2)), endX, endY);
            ctxt.quadraticCurveTo(((x + endX) / 2) - (width * Math.cos(r + Math.PI/2)),
                                  ((y + endY) / 2) - (width * Math.sin(r + Math.PI/2)), x, y);
            ctxt.closePath();
            ctxt.fill();
            ctxt.stroke();
        }

        // RENDER CIRCLE:
        function renderCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
            tmpContext = tmpContext||mainContext;
            tmpContext.beginPath();
            tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
            if (!dontFill) tmpContext.fill();
            if (!dontStroke) tmpContext.stroke();
        }

        // RENDER STAR SHAPE:
        function renderStar(ctxt, spikes, outer, inner) {
            var rot = Math.PI / 2 * 3;
            var x, y;
            var step = Math.PI / spikes;
            ctxt.beginPath();
            ctxt.moveTo(0, -outer);
            for (var i = 0; i < spikes; i++) {
                x = Math.cos(rot) * outer;
                y = Math.sin(rot) * outer;
                ctxt.lineTo(x, y);
                rot += step;
                x = Math.cos(rot) * inner;
                y = Math.sin(rot) * inner;
                ctxt.lineTo(x, y);
                rot += step;
            }
            ctxt.lineTo(0, -outer);
            ctxt.closePath();
        }

        // RENDER RECTANGLE:
        function renderRect(x, y, w, h, ctxt, stroke) {
            ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
            if (!stroke)
                ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
        }

        // RENDER RECTCIRCLE:
        function renderRectCircle(x, y, s, sw, seg, ctxt, stroke) {
            ctxt.save();
            ctxt.translate(x, y);
            seg = Math.ceil(seg / 2);
            for (var i = 0; i < seg; i++) {
                renderRect(0, 0, s * 2, sw, ctxt, stroke);
                ctxt.rotate(Math.PI / seg);
            }
            ctxt.restore();
        }

        // RENDER BLOB:
        function renderBlob(ctxt, spikes, outer, inner) {
            var rot = Math.PI / 2 * 3;
            var x, y;
            var step = Math.PI / spikes;
            var tmpOuter;
            ctxt.beginPath();
            ctxt.moveTo(0, -inner);
            for (var i = 0; i < spikes; i++) {
                tmpOuter = UTILS.randInt(outer + 0.9, outer * 1.2);
                ctxt.quadraticCurveTo(Math.cos(rot + step) * tmpOuter, Math.sin(rot + step) * tmpOuter,
                                      Math.cos(rot + (step * 2)) * inner, Math.sin(rot + (step * 2)) * inner);
                rot += step * 2;
            }
            ctxt.lineTo(0, -inner);
            ctxt.closePath();
        }

        // RENDER TRIANGLE:
        function renderTriangle(s, ctx) {
            ctx = ctx||mainContext;
            var h = s * (Math.sqrt(3)/2);
            ctx.beginPath();
            ctx.moveTo(0, -h / 2);
            ctx.lineTo( -s / 2, h / 2);
            ctx.lineTo(s / 2, h / 2);
            ctx.lineTo(0, -h / 2);
            ctx.fill();
            ctx.closePath();
        }

        // PREPARE MENU BACKGROUND:
        // PREPARE MENU BACKGROUND:
        function prepareMenuBackground() {
            var tmpMid = config.mapScale / 2;

            // Ana ağaçlar
            objectManager.add(0, tmpMid, tmpMid + 200, 0, config.treeScales[3], 0);
            objectManager.add(1, tmpMid, tmpMid - 480, 0, config.treeScales[3], 0);
            objectManager.add(2, tmpMid + 300, tmpMid + 450, 0, config.treeScales[3], 0);
            objectManager.add(3, tmpMid - 950, tmpMid - 130, 0, config.treeScales[2], 0);
            objectManager.add(4, tmpMid - 750, tmpMid - 400, 0, config.treeScales[3], 0);
            objectManager.add(5, tmpMid - 700, tmpMid + 400, 0, config.treeScales[2], 0);
            objectManager.add(6, tmpMid + 800, tmpMid - 200, 0, config.treeScales[3], 0);

            // Çalılar
            objectManager.add(7, tmpMid - 260, tmpMid + 340, 0, config.bushScales[3], 1);
            objectManager.add(8, tmpMid + 760, tmpMid + 310, 0, config.bushScales[3], 1);
            objectManager.add(9, tmpMid - 800, tmpMid + 100, 0, config.bushScales[3], 1);
            objectManager.add(10, tmpMid - 800, tmpMid + 300, 0, config.bushScales[3], 1);
            objectManager.add(11, tmpMid + 650, tmpMid - 390, 0, config.bushScales[3], 1);

            // Kayalar
            objectManager.add(12, tmpMid - 400, tmpMid - 450, 0, config.rockScales[2], 2);
            objectManager.add(13, tmpMid + 450, tmpMid + 550, 0, config.rockScales[2], 2);
            objectManager.add(14, tmpMid - 600, tmpMid + 600, 0, config.rockScales[2], 2);

            // Dekoratif objeler (oyun item’leri)
            objectManager.add(15, tmpMid - 950, tmpMid - 550, 0, items.list[4].scale, items.list[4].id, items.list[10]);
            objectManager.add(16, tmpMid + 850, tmpMid - 200, 0, items.list[4].scale, items.list[4].id, items.list[10]);
            objectManager.add(17, tmpMid - 650, tmpMid + 450, 0, items.list[4].scale, items.list[4].id, items.list[10]);
        }


        // LOAD GAME OBJECT:
        function loadGameObject(data) {
            for (var i = 0; i < data.length;) {
                objectManager.add(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4],
                                  data[i + 5], items.list[data[i + 6]], true, (data[i + 7]>=0?{sid:data[i + 7]}:null));

                if(data[i + 7] >= 0){
                    spawnedObjectSids.push(data[i + 7]);
                }

                i+=8;
            }

            if(!promiseResolve) return;
            promiseResolve(true);
        }

        // WIGGLE GAME OBJECT:
        function wiggleGameObject(dir, sid) {
            tmpObj = findObjectBySid(sid);
            if(tmpObj){
                damageObjects.push(tmpObj);

                tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir);
                tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir);
            }
        }

        // SHOOT TURRET:
        function shootTurret(sid, dir) {
            tmpObj = findObjectBySid(sid);
            if(tmpObj){
                tmpObj.dir = dir;
                tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir+Math.PI);
                tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir+Math.PI);
            }
        }

        // ADD PROJECTILE:
        function addProjectile(x, y, dir, range, speed, indx, layer, sid) {
            let projectile = projectileManager.addProjectile(x, y, dir, range, speed, indx, null, null, layer);
            projectile.sid = sid;

            /*
            if(inWindow){
                projectileManager.addProjectile(x, y, dir, range, speed, indx, null, null, layer).sid = sid;
            }
            */

            shoots.push({projectile: projectile, x: x, y: y, range: range, speed: speed});
        }

        // REMOVE PROJECTILE:
        function remProjectile(sid, range) {
            for(let projectile of projectiles){
                if(projectile.sid == sid){
                    projectile.range = range;

                    removeShoots.push(projectile);
                    if(damageObjects.length > 0){
                        objectShoots.push({objects: damageObjects, projectile: projectile});
                        damageObjects = [];
                    }
                }
            }
        }

        // ANIMATE AI:
        function animateAI(sid) {
            tmpObj = findAIBySID(sid);
            if (tmpObj) tmpObj.startAnim();
        }

        // ADD AI:
        function loadAI(data) {
            for (var i = 0; i < ais.length; ++i) {
                ais[i].forcePos = !ais[i].visible;
                ais[i].visible = false;
            }
            if (data) {
                var tmpTime = Date.now();
                for (var i = 0; i < data.length;) {
                    tmpObj = findAIBySID(data[i]);
                    if (tmpObj) {
                        tmpObj.index = data[i + 1];
                        tmpObj.t1 = (tmpObj.t2===undefined)?tmpTime:tmpObj.t2;
                        tmpObj.t2 = tmpTime;
                        tmpObj.x1 = tmpObj.x;
                        tmpObj.y1 = tmpObj.y;
                        tmpObj.x2 = data[i + 2];
                        tmpObj.y2 = data[i + 3];
                        tmpObj.d1 = (tmpObj.d2===undefined)?data[i + 4]:tmpObj.d2;
                        tmpObj.d2 = data[i + 4];
                        tmpObj.health = data[i + 5];
                        tmpObj.dt = 0;
                        tmpObj.visible = true;
                    } else {
                        tmpObj = aiManager.spawn(data[i + 2], data[i + 3], data[i + 4], data[i + 1]);
                        tmpObj.x2 = tmpObj.x;
                        tmpObj.y2 = tmpObj.y;
                        tmpObj.d2 = tmpObj.dir;
                        tmpObj.health = data[i + 5];
                        if (!aiManager.aiTypes[data[i + 1]].name)
                            tmpObj.name = config.cowNames[data[i + 6]];
                        tmpObj.forcePos = true;
                        tmpObj.sid = data[i];
                        tmpObj.visible = true;
                    }
                    i+=7;
                }
            }
        }

        // RENDER AI:
        let aiSprites = {};
        function renderAI(obj, ctxt) {
            let tmpIndx = obj.index;
            let tmpSprite = aiSprites[tmpIndx];

            if (!tmpSprite) {
                let tmpImg = new Image();
                tmpImg.onload = function() {
                    this.isLoaded = true;
                    this.onload = null;
                };
                tmpImg.src = getTexturePackImg(obj.src, "animals");
                tmpSprite = tmpImg;
                aiSprites[tmpIndx] = tmpSprite;
            }

            if (tmpSprite.isLoaded) {
                let tmpScale = obj.scale * 1.2 * (obj.spriteMlt || 1);
                ctxt.drawImage(tmpSprite, -tmpScale, -tmpScale, tmpScale * 2, tmpScale * 2);
            }
        }

        // OBJECT ON SCREEN:
        function isOnScreen(x, y, s) {
            return (x + s >= 0 && x - s <= maxScreenWidth && y + s >= 0 && y - s <= maxScreenHeight)
        }

        // ADD NEW PLAYER:
        function addPlayer(data, isYou) {
            var tmpPlayer = findPlayerByID(data[0]);
            if (!tmpPlayer) {
                tmpPlayer = new Player(data[0], data[1], config, UTILS, projectileManager,
                                       objectManager, players, ais, items, hats, accessories);
                players.push(tmpPlayer);
            }

            tmpPlayer.spawn(isYou?moofoll:null);
            tmpPlayer.visible = false;
            tmpPlayer.x2 = undefined;
            tmpPlayer.y2 = undefined;
            tmpPlayer.setData(data);

            primaryReload[tmpPlayer.sid] = 1;
            secondaryReload[tmpPlayer.sid] = 1;
            turretReload[tmpPlayer.sid] = 1;

            if (isYou) {
                ePress = false;
                autogathering = false;
                keyCodeWeapon = 0;

                myPlayer = tmpPlayer;
                camX = myPlayer.x;
                camY = myPlayer.y;
                updateItems();
                updateStatusDisplay();
                updateAge();
                updateUpgrades(0);
                gameUI.style.display = "block";
            }
        }

        // REMOVE PLAYER:
        function removePlayer(id) {
            for (var i = 0; i < players.length; i++) {
                if (players[i].id == id) {
                    players.splice(i, 1);
                    break;
                }
            }
        }

        // UPDATE PLAYER ITEM VALUES:
        function updateItemCounts(index, value) {
            if (myPlayer) {
                myPlayer.itemCounts[index] = value;
            }
        }

        /// UPDATE PLAYER VALUE:
        function updatePlayerValue(index, value, updateView) {
            if (myPlayer) {
                myPlayer[index] = value;

                // Öldürme sayısı değiştiyse hemen mesaj gönder
                if (index == "kills") {
                    console.log("Kill değişti!");
                    sendChat(`NEXT GOT CLAPPED | Kill:${myPlayer.kills}`);
                }

                if (updateView)
                    updateStatusDisplay();

                // OneFrame otomatik kontrol
                autoOneFrame();
            }
        }

        // === OneFrame Functions ===
        function doOneFrame() {
            myPlayer.autoAim = true;
            buyEquip(53, 0);
            selectWeapon(myPlayer.weapons[0]);
            game.tickBase(() => {
                buyEquip(7, 0);
                sendAutoGather();
                game.tickBase(() => {
                    selectWeapon(myPlayer.weapons[0]);
                    sendAutoGather();
                    myPlayer.autoAim = false;
                }, 1);
            }, 1);
        }

        function autoOneFrame() {
            if (!autoOneFrameToggled || !myPlayer || !myPlayer.alive) return;
            let nearestEnemy = getNearestEnemy();
            if (!nearestEnemy) return;

            let ping = window.pingTime || 100;
            let range = (ping > 140) ? 230 : (ping > 110) ? 210 : (ping > 85) ? 190 : 170;
            let distance = UTILS.getDistance(myPlayer.x, myPlayer.y, nearestEnemy.x, nearestEnemy.y);

            if (distance > range && distance <= 245 && myPlayer.reloads[myPlayer.weapons[0]] == 0) {
                sendChat("Auto OneFrame Triggered!");
                doOneFrame();
            }
        }

        let autoMills = false;

        let autoBreak = false;
        let autoBreakAngle;
        let breakObject;
        let nearestTrap;


        let enemiesNear;
        let ePress = false;
        let checkGather = false;
        let lastGatherState = false;

        let damageTick = 0;
        let tick = 0;

        let hits = [];
        let shoots = [];
        let removeShoots = [];

        let primaryReload = [];
        let secondaryReload = [];
        let turretReload = [];

        let placeTick = 0;
        let predictObjects = [];
        let prePlaceObjects = [];
        let predictEnemyTraps = [];

        let predictWeapon = 0;
        let keyCodeWeapon = 0;

        let healing = false;

        let autoReload = false;

        let deathDamages = [];

        let spikeDmg = 0;
        let spikeDmgCount = 0;
        let spikeDamages = [];

        let damageObjects = [];
        let objectHits = [];
        let objectShoots = [];

        let antiReverse = [];
        let antiInsta = [];

        let damageByPoisonTick = 0;
        let damagesByTurrets = [];
        let damagesByHits = [];
        let damagesByShoots = [];
        let damages = [];

        let qPress = false;

        let spikeKnockPosLine = {};

        let visibleObjects = [];

        let enemySpikes;
        let antiVelocitySpikeSync;

        let trapBreaked = false;
        let trapBreakedTick = 0;

        let soldierAnti = false;

        let predictMoveAngle = null;
        let lastMoveAngle = null;

        let antiSpikeTick;
        let nearestEnemiesCount = 0;

        let antiTick = false;
        let antiTickTimeout;
        let deadPlayers = [];
        let breakObjects = [];
        let player;
        let playerSID;
        let near = [];
        let nears = [];
        let syncrlist = [];
        let antiBoostTick = false;

        let predictDamage = {
            spike: 0,
            poison: 0,
            player: 0,
        };

        let antiPush = false;

        let autoPush = false;
        let autoPushAngle = null;
        let pushPositions;
        let my = {
            reloaded: false,
            waitHit: 0,
            autoAim: false,
            revAim: false,
            ageInsta: true,
            reSync: false,
            bullTick: 0,
            anti0Tick: 0,
            antiSync: false,
            safePrimary: function (tmpObj) {
                return [0, 8].includes(tmpObj.primaryIndex);
            },
            safeSecondary: function (tmpObj) {
                return [10, 11, 14].includes(tmpObj.secondaryIndex);
            },
            lastDir: 0,
            autoPush: false,
            pushData: {},
            antiInsta: false,
        }

        let predictMove = [];
        let moveVectors = {
            87: [0, -1],
            83: [0, 1],
            65: [-1, 0],
            68: [1, 0],
        };

        let autoaim = false;

        let instaKill = [];
        let insta = {
            primary: false,
            secondary: false
        }

        let spamPrePlacer = false;
        let prePlaceInterval;

        function resetPredictDamages(){
            for(const i in predictDamage){
                predictDamage[i] = 0;
            }
        }

        function getPredictDamage(){
            let damage = 0;
            for(let i in predictDamage){
                damage += predictDamage[i];
            }

            return damage;
        }

        function canVelocitySpikeTick(){
            if(!nearestEnemy) return;

            let spikes = visibleObjects.filter(object => object.id > 5 && object.id < 10 && (object.owner.sid == myPlayer.sid || isAlly(object.owner.sid)));
            let trap = visibleObjects.filter(object => object.id == 15 && UTILS.getDistance(nearestEnemy.x2, nearestEnemy.y2, object.x, object.y) <= 50 && (object.owner.sid == myPlayer.sid || isAlly(object.owner.sid)))[0];

            let isEnemyInSpike = false;

            let posX = nearestEnemy.x2 + 111 * (.3 + (items.weapons[myPlayer.weapons[0]].knock || 0)) * Math.cos(Math.atan2(nearestEnemy.y2-myPlayer.y2, nearestEnemy.x2-myPlayer.x2));
            let posY = nearestEnemy.y2 + 111 * (.3 + (items.weapons[myPlayer.weapons[0]].knock || 0)) * Math.sin(Math.atan2(nearestEnemy.y2-myPlayer.y2, nearestEnemy.x2-myPlayer.x2));

            for(let object of spikes){
                if(UTILS.getDistance(nearestEnemy.xVel, nearestEnemy.yVel, object.x, object.y) < (35 + object.scale)){
                    isEnemyInSpike = true;
                } else {
                    if(trap){
                        if(nearestEnemy.spikeDamage > 0){
                            isEnemyInSpike = true;
                        }
                    } else {
                        if(UTILS.getDistance(posX, posY, object.x, object.y) < (35 + object.scale)){
                            isEnemyInSpike = true;
                        }
                    }
                }

                if(isEnemyInSpike) break;
            }

            if(isEnemyInSpike){
                return (myPlayer.weapons[0] == 4 || myPlayer.weapons[0] == 5) && UTILS.getDistance(nearestEnemy.xVel, nearestEnemy.yVel, myPlayer.xVel, myPlayer.yVel) <= (35 * 1.8 + items.weapons[myPlayer.weapons[0]].range)
                && primaryReload[myPlayer.sid] == 1 && !autoaim;
            }
        }

        function canSpikeTick(object){
            return (object.id > 5 && object.id < 10) && nearestEnemy && UTILS.getDistance(nearestEnemy.x2, nearestEnemy.y2, object.x, object.y) <= (35 + object.scale)
            && (myPlayer.weapons[0] == 4 || myPlayer.weapons[0] == 5) && primaryReload[myPlayer.sid] == 1 && secondaryReload[myPlayer.sid] == 1 && !autoaim
            && !trapBreaked;
        }

        function canPredictSpikeTick(object){
            if(!canSpikeTick(object)) return false;

            let trap = visibleObjects.filter(object => object.id == 15 && UTILS.getDistance(nearestEnemy.x2, nearestEnemy.y2, object.x, object.y) <= 50 && (object.owner.sid == myPlayer.sid || isAlly(object.owner.sid)))[0];
            if(trap){
                let damage = 0;
                let weapon = null;

                if(myPlayer.weapons[1] == 10){
                    if(secondaryReload[myPlayer.sid] == 1){
                        weapon = myPlayer.weapons[1];
                    }
                }

                if(weapon != null && UTILS.getDistance(myPlayer.x2, myPlayer.y2, trap.x, trap.y) <= (trap.scale + items.weapons[weapon].range)){
                    damage = items.weapons[weapon].dmg * (items.weapons[weapon].sDmg || 1) * config.weaponVariants[(myPlayer.weaponVariants[weapon] || 1)].val * (isBoughtHat(40, 0) ? 3.3 : 1);
                }

                if(trap.health <= damage){
                    return true;
                }
            }
        }

        function place(id, angle = Math.atan2(mouseY - (screenHeight / 2), mouseX - (screenWidth / 2))){
            selectToBuild(id);
            sendAtck(1, angle);
            sendAtck(0, angle);
            selectWeapon(predictWeapon);
        }

        function heal(value){
            for(let i = 0;i < value;i += items.list[myPlayer.items[0]].heal){
                place(myPlayer.items[0], null);
            }
        }

        function isBoughtHat(id, type){
            if(type){
                return myPlayer.tails[id];
            } else {
                return myPlayer.skins[id];
            }
        }

        function hat(id){
            if(myPlayer.skinIndex != id){
                if(id == 0){
                    storeEquip(id, 0);
                } else {
                    if(isBoughtHat(id, 0)){
                        storeEquip(id, 0);
                    }
                }
            }
        }

        function acc(id){
            if(myPlayer.tailIndex != id){
                if(id == 0){
                    storeEquip(id, 1);
                } else {
                    if(isBoughtHat(id, 1)){
                        storeEquip(id, 1);
                    }
                }
            }
        }

        function getConfig(id, angle, velocity){
            return {
                x: (velocity ? myPlayer.xVel : myPlayer.x2) + (35 + items.list[id].scale + (items.list[id].placeOffset || 0)) * Math.cos(angle),
                y: (velocity ? myPlayer.yVel : myPlayer.y2) + (35 + items.list[id].scale + (items.list[id].placeOffset || 0)) * Math.sin(angle),
                scale: items.list[id].scale,
            }
        }

        function canPlace(id, angle, objects, velocity){
            if(isItemLimit(id)) return false;

            let config = getConfig(id, angle, velocity);
            if(objectManager.checkItemLocation(config.x, config.y, config.scale, 0.6, id, false, myPlayer, objects ? objects : visibleObjects)) return true;

            return false;
        }

        function getPredictWeapon(){
            if(autoBreak){
                if(myPlayer.weapons[1] != 10){
                    return myPlayer.weapons[0];
                }

                if(nearestTrap){
                    if(breakObject == nearestTrap){
                        if(items.weapons[myPlayer.weapons[0]].speed <= 400 && breakObject.health <= items.weapons[myPlayer.weapons[0]].dmg){
                            return myPlayer.weapons[0];
                        }

                        return myPlayer.weapons[1];
                    } else {
                        if(items.weapons[myPlayer.weapons[0]].speed <= 400 && breakObject.health <= items.weapons[myPlayer.weapons[0]].dmg
                           && UTILS.getDistance(myPlayer.x2, myPlayer.y2, breakObject.x, breakObject.y) <= (items.weapons[myPlayer.weapons[0]].range + breakObject.scale)){
                            return myPlayer.weapons[0];
                        }

                        if(UTILS.getDistance(myPlayer.x2, myPlayer.y2, breakObject.x, breakObject.y) <= (items.weapons[myPlayer.weapons[1]].range + breakObject.scale)){
                            return myPlayer.weapons[1];
                        } else {
                            return myPlayer.weapons[0];
                        }
                    }
                } else {
                    return myPlayer.weapons[1];
                }
            } else {
                if(secondaryReload[myPlayer.sid] < 1){
                    return myPlayer.weapons[1];
                } else {
                    if(primaryReload[myPlayer.sid] < 1){
                        return myPlayer.weapons[0];
                    }
                }
            }

            return keyCodeWeapon;
        }

        function addPredictObject(id, angle, preplace){
            let config = getConfig(id, angle);
            for(let object of predictObjects){
                if(UTILS.getDistance(config.x, config.y, object.x, object.y) < (config.scale + object.scale)) return;
            }

            predictObjects.push({id: id, angle: angle, name: items.list[id].name, x: config.x, y: config.y, scale: config.scale, preplace: preplace});
        }

        function isItemLimit(id){
            let group = items.list[id].group;
            let limit = (group.sandboxLimit || 99);

            if(myPlayer.itemCounts[group.id] >= limit){
                return true;
            }
        }

        function lineInCircle(x, y, x2, y2, circleX, circleY, scale){
            let lineVec = {x: x2 - x, y: y2 - y};
            let lineToCircleVec = {x: circleX - x, y: circleY - y};

            let projection = (lineToCircleVec.x * lineVec.x + lineToCircleVec.y * lineVec.y) / (lineVec.x * lineVec.x + lineVec.y * lineVec.y);
            let closestPoint = {x: x + projection * lineVec.x, y: y + projection * lineVec.y};

            if(closestPoint.x >= Math.min(x, x2) && closestPoint.x <= Math.max(x, x2) && closestPoint.y >= Math.min(y, y2) && closestPoint.y <= Math.max(y, y2)){
                return UTILS.getDistance(closestPoint.x, closestPoint.y, circleX, circleY) < scale;
            }
        }

        function isAlly(sid){
            if(myPlayer.team){
                for(var i = 0; i < alliancePlayers.length;i += 2){
                    if(alliancePlayers[i] == sid){
                        return true;
                    }
                }
            }
        }

        function checkEnemyTraps(id, angle){
            let config = getConfig(id, angle);
            for(let object of predictEnemyTraps){
                if(UTILS.getDistance(config.x, config.y, object.x, object.y) < (config.scale + object.scale)) return false;
            }

            return true;
        }

        function addEnemyTrap(id, angle){
            let config = getConfig(id, angle);
            if(checkEnemyTraps(id, angle)){
                predictEnemyTraps.push({id: 15, x: config.x, y: config.y, scale: config.scale, tick: tick});
            }
        }

        let lastPrePlaceObject = null;
        let removedObjects = [];

        function updateAngles(id){
            const angles = [];
            for(let i = 0;i < 200;i++){
                const angle = UTILS.toRad(i * (360 / 200));
                angles.push({id: id, angle: angle, placeable: canPlace(id, angle), ...getConfig(id, angle)});
            }

            getPerfectAngles(angles);
            checkPredictObjects(angles);
        }

        function updateAngles2(id){
            const angles = [];
            for(let i = 0;i < 36;i++){
                const angle = UTILS.toRad(i * (360 / 36));
                angles.push({id: id, angle: angle, placeable: canPlace(id, angle) && checkEnemyTraps(id, angle), ...getConfig(id, angle)});
            }

            getPerfectAngles(angles);
            checkPredictObjects(angles);
        }

        function checkPredictObjects(angles){
            for(let object of angles.filter((object) => object.perfect)){
                if(!isAutoPlaceAngle(object)) continue;
                addPredictObject(object.id, object.angle, false);
            }

            for(let object of angles.filter((object) => object.placeable)){
                if(!isAutoPlaceAngle(object)) continue;
                addPredictObject(object.id, object.angle, false);
            }
        }

        function getPrePlaceAngles(id, customObjects){
            const angles = [];
            for(let i = 0;i < 200;i++){
                const angle = UTILS.toRad(i * (360 / 200));
                angles.push({id: id, angle: angle, placeable: canPlace(id, angle, customObjects), ...getConfig(id, angle)});
            }

            getPerfectAngles(angles);
            return angles;
        }

        function getPerfectAngles(angles){
            for(let i in angles){
                angles[i].perfect = false;

                if(i < 1) continue;

                if(angles[i].placeable && !angles[i - 1].placeable){
                    angles[i].perfect = true;
                }

                if(angles[i - 1].placeable && !angles[i].placeable){
                    angles[i - 1].perfect = true;
                }
            }
        }

        function isPrePlaceAngle(config, prePlaceObject){
            if(!nearestEnemy) return false;

            if(config.id == myPlayer.items[2] && !isItemLimit(myPlayer.items[2])){
                const trap = visibleObjects.filter((object) => object.id == 15 && UTILS.getDistance(nearestEnemy.x2, nearestEnemy.y2, object.x, object.y) <= 50 && (object.owner.sid == myPlayer.sid || isAlly(object.owner.sid)))[0];
                if(trap && prePlaceObject != trap){
                    return true;
                } else {
                    if(nearestTrap) return false;

                    if(UTILS.getDistance(config.x, config.y, nearestEnemy.xVel, nearestEnemy.yVel) <= (35 + config.scale)){
                        let angle = Math.atan2(nearestEnemy.yVel-config.y, nearestEnemy.xVel-config.x);

                        let posX = config.x + 200 * Math.cos(angle);
                        let posY = config.y + 200 * Math.sin(angle);

                        let spikes = visibleObjects.filter(object => object.id > 5 && object.id < 10 && (object.owner.sid == myPlayer.sid || isAlly(object.owner.sid)));
                        for(let object of spikes){
                            if(prePlaceObject != object && UTILS.lineInRect(object.x - object.scale, object.y - object.scale, object.x + object.scale, object.y + object.scale, config.x, config.y, posX, posY)){
                                return myPlayer.items[2];
                            }
                        }
                    } else {
                        if(UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestEnemy.x2, nearestEnemy.y2) > 300) return false;
                        if(UTILS.lineInRect(config.x - config.scale, config.y - config.scale, config.x + config.scale, config.y + config.scale, myPlayer.x2, myPlayer.y2, nearestEnemy.x2, nearestEnemy.y2)) return false;

                        let spikes = visibleObjects.filter(object => object.id > 5 && object.id < 10 && (object.owner.sid == myPlayer.sid || isAlly(object.owner.sid)));
                        let nearestSpike = spikes.sort((a, b) => UTILS.getDistance(config.x, config.y, a.x, a.y) - UTILS.getDistance(config.x, config.y, b.x, b.y))[0];

                        const getAvoidSpikesCount = function(){
                            let count = 0;
                            for(let object of predictObjects){
                                if(object.id != myPlayer.items[2]) continue;
                                count++;
                            }

                            return count;
                        }

                        if(getAvoidSpikesCount() >= 1) return false;

                        if(nearestSpike){
                            if(UTILS.getDistance(config.x, config.y, nearestSpike.x, nearestSpike.y) > (config.scale + nearestSpike.scale + 50)){
                                return true;
                            }
                        } else {
                            return true;
                        }
                    }
                }
            }

            if(config.id == myPlayer.items[4] && !isItemLimit(myPlayer.items[4])){
                if(UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestEnemy.x2, nearestEnemy.y2) > 300) return false;
                return true;
            }

            return false;
        }

        function isAutoPlaceAngle(config){
            if(!nearestEnemy) return false;

            if(config.id == myPlayer.items[2] && !isItemLimit(myPlayer.items[2])){
                const trap = visibleObjects.filter((object) => object.id == 15 && UTILS.getDistance(nearestEnemy.x2, nearestEnemy.y2, object.x, object.y) <= 50 && (object.owner.sid == myPlayer.sid || isAlly(object.owner.sid)))[0];
                if(trap){
                    if(UTILS.getDistance(config.x, config.y, nearestEnemy.x2, nearestEnemy.y2) <= (35 + config.scale)){
                        return true;
                    } else {
                        if(UTILS.lineInRect(config.x - config.scale, config.y - config.scale, config.x + config.scale, config.y + config.scale, myPlayer.x2, myPlayer.y2, trap.x, trap.y)) return false;

                        if(UTILS.getDistance(config.x, config.y, nearestEnemy.x2, nearestEnemy.y2) > (35 * 2 + config.scale)
                           && UTILS.getDistance(config.x, config.y, trap.x, trap.y) <= (config.scale + trap.scale + 50)){
                            return true;
                        }
                    }
                } else {
                    if(nearestTrap) return false;

                    if(UTILS.getDistance(config.x, config.y, nearestEnemy.xVel, nearestEnemy.yVel) <= (35 + config.scale)){
                        let angle = Math.atan2(nearestEnemy.yVel-config.y, nearestEnemy.xVel-config.x);

                        let posX = config.x + 200 * Math.cos(angle);
                        let posY = config.y + 200 * Math.sin(angle);

                        let spikes = visibleObjects.filter(object => object.id > 5 && object.id < 10 && (object.owner.sid == myPlayer.sid || isAlly(object.owner.sid)));
                        for(let object of spikes){
                            if(UTILS.lineInRect(object.x - object.scale, object.y - object.scale, object.x + object.scale, object.y + object.scale, config.x, config.y, posX, posY)){
                                return true;
                            }
                        }
                    } else {
                        if(UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestEnemy.x2, nearestEnemy.y2) > 300) return false;
                        if(UTILS.lineInRect(config.x - config.scale, config.y - config.scale, config.x + config.scale, config.y + config.scale, myPlayer.x2, myPlayer.y2, nearestEnemy.x2, nearestEnemy.y2)) return false;

                        let spikes = visibleObjects.filter(object => object.id > 5 && object.id < 10 && (object.owner.sid == myPlayer.sid || isAlly(object.owner.sid)));
                        let nearestSpike = spikes.sort((a, b) => UTILS.getDistance(config.x, config.y, a.x, a.y) - UTILS.getDistance(config.x, config.y, b.x, b.y))[0];

                        const getAvoidSpikesCount = function(){
                            let count = 0;
                            for(let object of predictObjects){
                                if(object.id != myPlayer.items[2]) continue;
                                count++;
                            }

                            return count;
                        }

                        if(getAvoidSpikesCount() >= 1) return false;

                        if(nearestSpike){
                            if(UTILS.getDistance(config.x, config.y, nearestSpike.x, nearestSpike.y) > (config.scale + nearestSpike.scale + 50)){
                                return true;
                            }
                        } else {
                            return true;
                        }
                    }
                }
            }

            if(config.id == myPlayer.items[4] && !isItemLimit(myPlayer.items[4])){
                if(UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestEnemy.x2, nearestEnemy.y2) > 300) return false;

                const trap = visibleObjects.filter((object) => object.id == 15 && UTILS.getDistance(nearestEnemy.x2, nearestEnemy.y2, object.x, object.y) <= 50 && (object.owner.sid == myPlayer.sid || isAlly(object.owner.sid)))[0];
                if(trap && UTILS.getDistance(myPlayer.x2, myPlayer.y2, trap.x, trap.y) <= (35 + trap.scale + 50)){
                    return false;
                } else {
                    return true;
                }
            }

            return false;
        }

        function getPrePlaceObject(){
            let findObject;

            if(autogathering){
                if((predictWeapon < 9 && primaryReload[myPlayer.sid] == 1) || (predictWeapon > 8 && secondaryReload[myPlayer.sid] == 1)){
                    let dmg = items.weapons[predictWeapon].dmg * (items.weapons[predictWeapon].sDmg || 1) * (config.weaponVariants[myPlayer.weaponVariants[predictWeapon]].val) * (isBoughtHat(40, 0) ? 3.3 : 1);

                    findObject = visibleObjects.filter((object) => (UTILS.getDistance(myPlayer.xVel, myPlayer.yVel, object.x, object.y) - object.scale) <= items.weapons[predictWeapon].range
                                                       && UTILS.getAngleDist(UTILS.getDirection(object.x, object.y, myPlayer.xVel, myPlayer.yVel), getAttackDir()) <= config.gatherAngle
                                                       && object.health <= dmg).sort((a, b) => UTILS.getDistance(a.x, a.y, nearestEnemy.x2, nearestEnemy.y2) - UTILS.getDistance(b.x, b.y, nearestEnemy.x2, nearestEnemy.y2))[0];
                }
            }

            if(nearestEnemy && !findObject){
                let weapon = null;
                if(nearestEnemy.weapons[1] == 10 && secondaryReload[nearestEnemy.sid] == 1 && nearestEnemy.lastSecondaryReload < secondaryReload[nearestEnemy.sid]){
                    weapon = nearestEnemy.weapons[1];
                } else {
                    if(items.weapons[nearestEnemy.weapons[0]].speed <= 400 && primaryReload[nearestEnemy.sid] == 1 && nearestEnemy.lastPrimaryReload < primaryReload[nearestEnemy.sid]){
                        weapon = nearestEnemy.weapons[0];
                    }
                }

                if(weapon != null){
                    let dmg = items.weapons[weapon].dmg * (items.weapons[weapon].sDmg || 1) * (config.weaponVariants[nearestEnemy.weaponVariants[weapon]].val || 1) * 3.3;

                    findObject = visibleObjects.filter((object) => !object.hideFromEnemy && UTILS.getDistance(nearestEnemy.x2, nearestEnemy.y2, object.x, object.y) <= (object.scale + items.weapons[weapon].range)
                                                       && object.health <= dmg).sort((a, b) => UTILS.getDistance(a.x, a.y, nearestEnemy.x2, nearestEnemy.y2) - UTILS.getDistance(b.x, b.y, nearestEnemy.x2, nearestEnemy.y2))[0];
                }
            }

            if(findObject){
                spamPrePlacer = true;
            }

            return findObject;
        }

        function getPredictObjects(){
            // FIX STACK PACKETS
            if(removedObjects.length > 0){
                if(lastPrePlaceObject && removedObjects.some((sid) => lastPrePlaceObject.sid == sid)){
                    for(const object of predictObjects){
                        if(!object.preplace) continue;

                        addEnemyTrap(object.id, object.angle);
                        placeTick = tick;
                    }
                }

                removedObjects = [];
            }

            predictObjects = [];

            // PRE PLACER
            lastPrePlaceObject = null;
            spamPrePlacer = false;

            if(nearestEnemy && UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestEnemy.x2, nearestEnemy.y2) < 300 && !(nearestTrap && spikeDmgCount > 0)){
                let findObject = getPrePlaceObject();

                let customObjects = [];
                for(let object of visibleObjects){
                    customObjects.push(object);
                }

                if(findObject){
                    customObjects.splice(customObjects.indexOf(findObject), 1);

                    let findAngle;

                    const spikeAngles = getPrePlaceAngles(myPlayer.items[2], customObjects);
                    const trapAngles = getPrePlaceAngles(myPlayer.items[4] || 15, customObjects);

                    const getFindAngle = function(findAngleFunc){
                        if(findAngle) return;

                        findAngleFunc();
                        if(findAngle){
                            addPredictObject(findAngle.id, findAngle.angle, true);
                        }
                    }

                    getFindAngle(function(){
                        const object = spikeAngles.filter((object) => object.perfect).sort((a, b) => UTILS.getDistance(findObject.x, findObject.y, a.x, a.y) - UTILS.getDistance(findObject.x, findObject.y, b.x, b.y))[0];
                        if(object && isPrePlaceAngle(object, findObject)){
                            findAngle = object;
                        }
                    });

                    getFindAngle(function(){
                        const object = trapAngles.filter((object) => object.perfect).sort((a, b) => UTILS.getDistance(findObject.x, findObject.y, a.x, a.y) - UTILS.getDistance(findObject.x, findObject.y, b.x, b.y))[0];
                        if(object && isPrePlaceAngle(object, findObject)){
                            findAngle = object;
                        }
                    });

                    getFindAngle(function(){
                        const object = spikeAngles.filter((object) => object.placeable).sort((a, b) => UTILS.getDistance(findObject.x, findObject.y, a.x, a.y) - UTILS.getDistance(findObject.x, findObject.y, b.x, b.y))[0];
                        if(object && isPrePlaceAngle(object, findObject)){
                            findAngle = object;
                        }
                    });

                    getFindAngle(function(){
                        const object = trapAngles.filter((object) => object.placeable).sort((a, b) => UTILS.getDistance(findObject.x, findObject.y, a.x, a.y) - UTILS.getDistance(findObject.x, findObject.y, b.x, b.y))[0];
                        if(object && isPrePlaceAngle(object, findObject)){
                            findAngle = object;
                        }
                    });

                    for(let i in predictObjects){
                        if(!predictObjects[i].preplace) continue;

                        lastPrePlaceObject = findObject;
                        break;
                    }
                }
            }
            /* object filtering */
            //let enemyTrapped = gameObjects.filter(tmp => tmp.trap && tmp.active && isAlly(tmp.owner.sid) && UTILS.getDist(tmp, 0, 2) <= tmp.scale + tmp.getScale() + 15).sort((a, b) => {
            //    return UTILS.getDist(a, 0, 2) - UTILS.getDist(b, 0, 2);
            //})[0];
            // AUTO PLACE
            if(settings.autoPlace){
                if(nearestTrap){
                    updateAngles2(myPlayer.items[2]);
                    updateAngles2(myPlayer.items[4] || 15);
                } else {
                    updateAngles2(myPlayer.items[2]);
                    updateAngles2(myPlayer.items[4] || 15);

                    setPlaceTick();
                    if((tick - placeTick) >= 3) {
                        updateAngles(myPlayer.items[2]);
                        updateAngles(myPlayer.items[4] || 15);
                    }
                }
            }

            setPlaceTick();

            // SHIT AUTO MILLS
            if(autoMills && lastMoveAngle != null && !nearestTrap){
                let angle = lastMoveAngle + UTILS.toRad(180);
                if(canPlace(myPlayer.items[3], angle) && checkEnemyTraps(myPlayer.items[3], angle)){
                    if(canPlace(myPlayer.items[3], angle) && checkEnemyTraps(myPlayer.items[3], angle)){
                        addPredictObject(myPlayer.items[3], angle, false);
                    }

                    if(canPlace(myPlayer.items[3], angle - UTILS.toRad(items.list[myPlayer.items[3]].scale + items.list[myPlayer.items[3]].scale / 2)) && checkEnemyTraps(myPlayer.items[3], angle - UTILS.toRad(items.list[myPlayer.items[3]].scale + items.list[myPlayer.items[3]].scale / 2))){
                        addPredictObject(myPlayer.items[3], angle - UTILS.toRad(items.list[myPlayer.items[3]].scale + items.list[myPlayer.items[3]].scale / 2), false);
                    }

                    if(canPlace(myPlayer.items[3], angle + UTILS.toRad(items.list[myPlayer.items[3]].scale + items.list[myPlayer.items[3]].scale / 2)) && checkEnemyTraps(myPlayer.items[3], angle + UTILS.toRad(items.list[myPlayer.items[3]].scale + items.list[myPlayer.items[3]].scale / 2))){
                        addPredictObject(myPlayer.items[3], angle + UTILS.toRad(items.list[myPlayer.items[3]].scale + items.list[myPlayer.items[3]].scale / 2), false);
                    }
                }
            }
        }

        function setPlaceTick(){
            for(let i in predictObjects){
                if(predictObjects[i].preplace) continue;

                placeTick = tick;
                break;
            }
        }

        function getHatInStore(id){
            for(let hat of hats){
                if(hat.id == id){
                    return hat;
                }
            }

            return {};
        }

        function getAccInStore(id){
            for(let acc of accessories){
                if(acc.id == id){
                    return acc;
                }
            }

            return {};
        }

        function doWeaponStuff(player){
            if(player.buildIndex < 0){
                player.weaponVariants[player.weaponIndex] = player.weaponVariant;

                if(player.weaponIndex < 9){
                    if(player != myPlayer){
                        player.weapons[0] = player.weaponIndex;
                    }

                    primaryReload[player.sid] = Math.min(1, primaryReload[player.sid] + (player.t2 - player.t1) / items.weapons[player.weaponIndex].speed);
                } else {
                    if(player != myPlayer){
                        player.weapons[1] = player.weaponIndex;
                    }

                    if(player.weaponIndex != 11){
                        secondaryReload[player.sid] = Math.min(1, secondaryReload[player.sid] + (player.t2 - player.t1) / items.weapons[player.weaponIndex].speed);
                    }
                }
            }

            turretReload[player.sid] = Math.min(1, turretReload[player.sid] + (player.t2 - player.t1) / 2500);
        }
        function calculatePerfectAngle(x1, y1, x2, y2) {
            return Math.atan2(y2 - y1, x2 - x1);
        }
        function testCanPlace(id, first = -(Math.PI / 2), repeat = (Math.PI / 2), plus = (Math.PI / 18), radian, replacer, yaboi) {
            try {
                let item = items.list[myPlayer.items[id]];
                let tmpS = myPlayer.scale + item.scale + (item.placeOffset || 0);
                let counts = {
                    attempts: 0,
                    placed: 0
                };
                let tmpObjects = [];
                gameObjects.forEach((p) => {
                    tmpObjects.push({
                        x: p.x,
                        y: p.y,
                        active: p.active,
                        blocker: p.blocker,
                        scale: p.scale,
                        isItem: p.isItem,
                        type: p.type,
                        colDiv: p.colDiv,
                        getScale: function(sM, ig) {
                            sM = sM||1;
                            return this.scale * ((this.isItem||this.type==2||this.type==3||this.type==4)
                                                 ?1:(0.6*sM)) * (ig?1:this.colDiv);
                        },
                    });
                });
                for (let i = first; i < repeat; i += plus) {
                    counts.attempts++;
                    let relAim = radian + i;
                    let tmpX = myPlayer.x2 + tmpS * Math.cos(relAim);
                    let tmpY = myPlayer.y2 + tmpS * Math.sin(relAim);
                    let cantPlace = tmpObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                    if (cantPlace) continue;
                    if (item.id != 18 && tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
                    if ((!replacer && yaboi)) {
                        if (yaboi.inTrap) {
                            if (UTILS.getAngleDist(io.send("D", nearestEnemy) + Math.PI, relAim + Math.PI) <= Math.PI) {
                                place(myPlayer.items[2], relAim, 1);
                            } else {
                                myPlayer.items[4] == 15 && place(myPlayer.items[4], relAim, 1);
                            }
                        } else {
                            if (UTILS.getAngleDist(io.send("D", nearestEnemy), relAim) <= config.gatherAngle / 1.5) {
                                place(myPlayer.items[2], relAim, 1);
                            } else {
                                myPlayer.items[4] == 15 && place(myPlayer.items[4], relAim, 1);
                            }
                        }
                    } else {
                        place(myPlayer.items[id], relAim, 1);
                    }
                    tmpObjects.push({
                        x: tmpX,
                        y: tmpY,
                        active: true,
                        blocker: item.blocker,
                        scale: item.scale,
                        isItem: true,
                        type: null,
                        colDiv: item.colDiv,
                        getScale: function() {
                            return this.scale;
                        },
                    });
                    if (UTILS.getAngleDist(io.send("D", nearestEnemy), relAim) <= 1) {
                        counts.placed++;
                    }
                }
                if (counts.placed > 0 && replacer && item.dmg) {
                    if (nearestEnemy <= items.weapons[myPlayer.weapons[0]].range + (myPlayer.scale * 1.8)) {
                        spikeTick();
                    }
                }
            } catch (err) {
            }
        };

        function checkSpikeTick() {
            try {
                if (![3, 4, 5].includes(nearestEnemy.primaryIndex)) return false;
                if (nearestEnemy.primaryIndex == undefined ? true : (nearestEnemy.reloads[nearestEnemy.primaryIndex] > game.tickRate)) return false;
                // more range for safe. also testing nearestEnemy.primaryIndex || 5
                if (nearestEnemy <= items.weapons[nearestEnemy.primaryIndex || 5].range + (nearestEnemy.scale * 1.8)) {
                    let item = items.list[9];
                    let tmpS = nearestEnemy.scale + item.scale + (item.placeOffset || 0);
                    let danger = 0;
                    let counts = {
                        attempts: 0,
                        block: `unblocked`
                    };
                    for (let i = -1; i <= 1; i += 1/10) {
                        counts.attempts++;
                        let relAim = UTILS.getDirect(myPlayer, nearestEnemy, 2, 2) + i;
                        let tmpX = nearestEnemy.x2 + tmpS * Math.cos(relAim);
                        let tmpY = nearestEnemy.y2 + tmpS * Math.sin(relAim);
                        let cantPlace = gameObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                        if (cantPlace) continue;
                        if (tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
                        danger++;
                        counts.block = `blocked`;
                        break;
                    }
                    if (danger) {
                        return true;
                    }
                }
            } catch (err) {
                return null;
            }
            return false;
        }
        function replacer(findObj) {
            if (!findObj) return;
            if (!inGame) return;
            game.tickBase(() => {
                let objAim = UTILS.getDirect(findObj, myPlayer, 0, 2);
                let objDst = UTILS.getDist(findObj, myPlayer, 0, 2);
                let perfectAngle = Math.round(calculatePerfectAngle(findObj.x, findObj.y, myPlayer.x, myPlayer.y) / (Math.PI / 2)) * (Math.PI / 2);
                let canPlaceCondition = [4, 5].includes(myPlayer.weapons[0]) && nearestEnemy <= items.weapons[nearestEnemy.primaryIndex || 5].range + (nearestEnemy.scale * 1.2) && myPlayer.reloads[myPlayer.weapons[0]] == 0;
                if (objDst <= items.weapons[myPlayer.weaponIndex].range + myPlayer.scale) return;
                let danger = checkSpikeTick();
                if (objDst <= 300 && nearestEnemy <= 400) {
                    if (nearestEnemy && canPlaceCondition) {
                        this.testCanPlace(2, -Math.PI/4, Math.PI/4, (Math.PI / 20), io.send("D", nearestEnemy), 1);
                        this.testCanPlace(4, -Math.PI/4, Math.PI/4, Math.PI/12, io.send("D", nearestEnemy) + Math.PI , 1)
                    } else if (!danger && nearestEnemy <= items.weapons[nearestEnemy.primaryIndex || 5].range + (nearestEnemy.scale * 1.8)) {
                        this.testCanPlace(2, 0, (Math.PI * 2), (Math.PI / 24), perfectAngle , 1);
                    } else {
                        if (myPlayer.items[4] == 15) {
                            this.testCanPlace(nearestEnemy ? 4 : 2, 0, (Math.PI * 2), (Math.PI / 24), perfectAngle , 1);
                        }
                        replaced = true;
                    }
                }
            }, 1);
        };
        // UPDATE HEALTH:
        function updateHealth(sid, value){
            tmpObj = findPlayerBySID(sid);
            if (tmpObj){
                let damage = tmpObj.health - value;
                tmpObj.health = value;

                if(damage > 0){
                    tmpObj.hitTime = Date.now();

                    if(tmpObj == myPlayer){
                        damageTick = (tick + 1);

                        damages.push(UTILS.fixTo(damage, 2));
                        deathDamages.push({damage: UTILS.fixTo(damage, 2), tick: damageTick});
                    } else {
                        if([20, 30, 35, 45, (20 * .75), (30 * .75), (35 * .75), (45 * .75)].includes(damage)){
                            tmpObj.spikeDamage = damage;
                        }
                    }
                } else {
                    if(tmpObj.hitTime){
                        let o = Date.now() - tmpObj.hitTime;
                        if(o <= 120){
                            tmpObj.shameCount = tmpObj.shameCount + 1;
                        } else {
                            tmpObj.shameCount = Math.max(0, tmpObj.shameCount - 2);
                        }

                        tmpObj.hitTime = null;
                    }

                    if(tmpObj == myPlayer && tmpObj.health == 100){
                        deathDamages = [];
                        spikeDmg = 0;
                    }
                }
            }
        }

        function projectileHandle(projectile){
            let player = projectile.player;
            if(player == null) return;

            if(!isAlly(player.sid)){
                if(projectile.weapon == "turret" && UTILS.getDistance(myPlayer.x2, myPlayer.y2, player.x2, player.y2) > 200 && UTILS.getDistance(myPlayer.x2, myPlayer.y2, player.x2, player.y2) < 300
                   && canShoot(projectile) && primaryReload[player.sid] == 1){
                    addChatLog(`Mod: Anti Tick`, "#ffffff");
                    antiOneTick(UTILS.getDistance(myPlayer.x2, myPlayer.y2, projectile.x, projectile.y) / projectile.speed);
                }
            }
        }

        function canShoot(projectile){
            let config = {
                x: projectile.x + projectile.range * Math.cos(projectile.dir),
                y: projectile.y + projectile.range * Math.sin(projectile.dir),
                sid: projectile.object != null ? projectile.object.owner.sid : projectile.player.sid,
            };

            if(config.sid == myPlayer.sid || isAlly(config.sid)){
                return false;
            }

            if(UTILS.lineInRect(myPlayer.x2 - 35, myPlayer.y2 - 35, myPlayer.x2 + 35, myPlayer.y2 + 35, projectile.x, projectile.y, config.x, config.y)){
                let filterObjects = [];
                let types = [10, 11, 12, 17];
                for(let object of visibleObjects){
                    if(object.ignoreCollision) continue;

                    if(projectile.weapon == "turret"){
                        if(projectile.object != null && object.sid == projectile.object.sid) continue;

                        if(types.includes(object.id) || (object.type != null && object.type != 2)){
                            filterObjects.push(object);
                        }
                    } else {
                        filterObjects.push(object);
                    }
                }

                let nearestFind = filterObjects.filter((object) => UTILS.lineInRect(object.x - object.getScale(), object.y - object.getScale(), object.x + object.getScale(), object.y + object.getScale(), projectile.x, projectile.y, config.x, config.y))
                .sort((a, b) => UTILS.getDistance(a.x, a.y, projectile.x, projectile.y) - UTILS.getDistance(b.x, b.y, projectile.x, projectile.y))[0];

                if(nearestFind && UTILS.getDistance(nearestFind.x, nearestFind.y, projectile.x, projectile.y) < UTILS.getDistance(myPlayer.x2, myPlayer.y2, projectile.x, projectile.y)){
                    return false;
                }

                return true;
            }

            return false;
        }

        function antiOneTick(speed){
            antiTick = true;
            clearTimeout(antiTickTimeout);
            antiTickTimeout = setTimeout(function(){
                antiTick = false;
            }, speed);
        }

        function distributionDamages(object){
            if(object.type == "hit"){
                const {weapon, player} = object;

                let damage = items.weapons[weapon].dmg * config.weaponVariants[player.weaponVariants[weapon]].val;

                damage *= (getHatInStore(player.skinIndex).dmgMultO || 1);
                damage *= (getAccInStore(player.tailIndex).dmgMultO || 1);

                damage *= (getHatInStore(myPlayer.skinIndex).dmgMult || 1);
                damage = UTILS.fixTo(damage, 2);

                for(let i in damages){
                    if(damages[i] == damage){
                        damagesByHits.push({damage: damage, player: player, weapon: weapon});
                        damages.splice(i, 1);

                        break;
                    }
                }
            } else if(object.type == "shoot"){
                const {projectile} = object;

                let damage = projectile.dmg * (getHatInStore(myPlayer.skinIndex).dmgMult || 1);
                damage = UTILS.fixTo(damage, 2);

                for(let i in damages){
                    if(damages[i] == damage){
                        damagesByShoots.push({projectile: projectile, damage: damage});
                        damages.splice(i, 1);

                        break;
                    }
                }
            } else if(object.type == "spikes"){
                for(let damage of damages){
                    if(damage == 20 || damage == 30 || damage == 35 || damage == 45 || damage == (20 * .75) || damage == (30 * .75) || damage == (35 * .75) || damage == (45 * .75)){
                        spikeDamages.push(damage);
                    }
                }

                for(let damage of spikeDamages){
                    damages.splice(damages.indexOf(damage), 1);
                }
            }
        }

        function antiInstaFc(object){
            const {type, player} = object;
            let damage = 0;

            if(!player) return;

            (function(){
                if(nearestTrap){
                    let dmg = 0;

                    for(let player of players){
                        let weapon = null;

                        if(player.weapons[1] == 10 && secondaryReload[player.sid] == 1){
                            weapon = player.weapons[1];
                        } else {
                            if(primaryReload[player.sid] == 1){
                                weapon = player.weapons[0];
                            }
                        }

                        if(weapon != null && UTILS.getDistance(player.x2, player.y2, nearestTrap.x, nearestTrap.y) <= (nearestTrap.scale + items.weapons[weapon].range)){
                            dmg += items.weapons[weapon].dmg * (items.weapons[weapon].sDmg || 1) * (config.weaponVariants[player.weaponVariants[weapon]].val || 1) * (player.sid == myPlayer.sid ? (isBoughtHat(40, 0) ? 3.3 : 1) : 3.3);
                        }
                    }

                    if(nearestTrap.health <= dmg){
                        if(predictDamage.spike < 45){
                            predictDamage.spike = 45;
                        }
                    }
                }
            })();

            if(type == "normal"){
                let secondaryWeapon = player.weapons[1] ? player.weapons[1] : 15;
                if(secondaryReload[player.sid] == 1){
                    if(items.weapons[secondaryWeapon].projectile != undefined){
                        damage += items.projectiles[items.weapons[secondaryWeapon].projectile].dmg;
                    } else {
                        damage += items.weapons[secondaryWeapon].dmg * config.weaponVariants[player.weaponVariants[secondaryWeapon]].val;
                    }

                    (function(){
                        let damage = 0;
                        let knock = 200;

                        let posX = myPlayer.x2 + knock * Math.cos(Math.atan2(myPlayer.y2-player.y2, myPlayer.x2-player.x2));
                        let posY = myPlayer.y2 + knock * Math.sin(Math.atan2(myPlayer.y2-player.y2, myPlayer.x2-player.x2));

                        for(let object of enemySpikes.filter((object) => UTILS.getDistance(posX, posY, object.x, object.y) < (35 + object.scale)
                                                             || lineInCircle(myPlayer.x2, myPlayer.y2, posX, posY, object.x, object.y, (35 + object.scale)))){
                            damage += items.list[object.id].dmg;
                        }

                        if(predictDamage.spike < damage){
                            predictDamage.spike = damage;
                        }

                        if(damage > 0 && 100 <= getPredictDamage()){
                            antiVelocitySpikeSync = true;
                        }
                    })();
                }

                if(turretReload[player.sid] >= (2500 - 111 * 2) / 2500){
                    damage += 25;
                }

                predictDamage.player += damage;
                if(nearestEnemiesCount > 1){
                    healing = true;
                }

                antiInsta[player.sid] = true;
            } else if(type == "reverse"){
                (function(){
                    if(antiSpikeTick){
                        if(predictDamage.spike < 45){
                            predictDamage.spike = 45;
                        }
                    }
                })();

                let primaryWeapon = player.weapons[0] ? player.weapons[0] : null;
                let primaryVariant = 0;

                if(primaryWeapon != null){
                    primaryVariant = player.weaponVariants[primaryWeapon];
                } else {
                    primaryVariant = 3;
                    primaryWeapon = 5;
                }

                if(primaryReload[player.sid] == 1){
                    damage += items.weapons[primaryWeapon].dmg * 1.5 * config.weaponVariants[primaryVariant].val;

                    (function(){
                        let damage = 0;
                        let knock = 200;

                        let posX = myPlayer.x2 + knock * Math.cos(Math.atan2(myPlayer.y2-player.y2, myPlayer.x2-player.x2));
                        let posY = myPlayer.y2 + knock * Math.sin(Math.atan2(myPlayer.y2-player.y2, myPlayer.x2-player.x2));

                        for(let object of enemySpikes.filter((object) => UTILS.getDistance(posX, posY, object.x, object.y) < (35 + object.scale)
                                                             || lineInCircle(myPlayer.x2, myPlayer.y2, posX, posY, object.x, object.y, (35 + object.scale)))){
                            damage += items.list[object.id].dmg;
                        }

                        if(predictDamage.spike < damage){
                            predictDamage.spike = damage;
                        }

                        if(damage > 0 && 100 <= getPredictDamage()){
                            antiVelocitySpikeSync = true;
                        }
                    })();
                }

                (function(){
                    let wasTurretDamage = false;
                    for(let i in damagesByTurrets){
                        let {damage, projectile} = damagesByTurrets[i];
                        if(projectile.player != null && projectile.player == player){
                            wasTurretDamage = true;
                        }
                    }

                    if(!wasTurretDamage && turretReload[player.sid] == 0){
                        damage += 25;
                    }
                })();

                predictDamage.player += damage;
                if(nearestEnemiesCount > 1){
                    healing = true;
                }

                antiReverse[player.sid] = true;
            }
        }

        function changeObjectHealth(player, weapon, damageObjects){
            let dmg = items.weapons[weapon].dmg * (items.weapons[weapon].sDmg || 1) * (player.skinIndex == 40 ? 3.3 : 1) * config.weaponVariants[player.weaponVariants[weapon]].val;
            for(let object of damageObjects){
                object.health -= dmg;
            }
        }

        function checkBuildingDamage(projectile, damageObjects){
            let config = {
                x: projectile.x + projectile.range * Math.cos(projectile.dir),
                y: projectile.y + projectile.range * Math.sin(projectile.dir),
            };

            for(let object of damageObjects){
                if(!object.ignoreCollision && UTILS.lineInRect(object.x - object.scale, object.y - object.scale, object.x + object.scale, object.y + object.scale, projectile.x, projectile.y, config.x, config.y)){
                    if(object.id == 3){
                        object.health -= projectile.dmg;
                    }
                }
            }
        }

        function isSpikeCollisionEnemy(spike){
            if(nearestEnemy.spikeDamage > 0){
                return true;
            }
        }

        function canAutoPush(){
            if(lineInCircle(myPlayer.x2, myPlayer.y2, pushPositions.x, pushPositions.y, nearestEnemy.x2, nearestEnemy.y2, 35)){
                return false;
            }

            for(let object of visibleObjects){
                if(object.id == 15 && (object.owner.sid == myPlayer.sid || isAlly(object.owner.sid))) continue;

                if(((object.id > 5 && object.id < 10) && object.owner != myPlayer.sid && !isAlly(object.owner)) || object.id == 16 || object.id == 22){
                    if(lineInCircle(myPlayer.x2, myPlayer.y2, pushPositions.x, pushPositions.y, object.x, object.y, 35 + object.getScale(.6, object.isItem))){
                        return false;
                    }
                } else {
                    if(lineInCircle(myPlayer.x2, myPlayer.y2, pushPositions.x, pushPositions.y, object.x, object.y, object.getScale(.6, object.isItem) * .75)){
                        return false;
                    }
                }
            }

            return true;
        }

        let antiPushAngle;
        function isNearestEnemyPushPlayer(){
            if(!nearestEnemy) return false;
            if(visibleObjects.filter((object) => object.id == 15 && UTILS.getDistance(nearestEnemy.x2, nearestEnemy.y2, object.x, object.y) <= 50 && (object.owner.sid == myPlayer.sid || isAlly(object.owner.sid)))[0]) return false;

            if((nearestTrap && spikeDmgCount < 1) && (myPlayer.weapons[0] == 6 || myPlayer.weapons[0] == 7) && !antiSpikeTick){
                const nearestSpike = enemySpikes.sort((a, b) => UTILS.getDistance(myPlayer.x2, myPlayer.y2, a.x, a.y) - UTILS.getDistance(myPlayer.x2, myPlayer.y2, b.x, b.y))[0];

                if((nearestTrap && nearestSpike)
                   && UTILS.getDistance(nearestSpike.x, nearestSpike.y, nearestTrap.x, nearestTrap.y) <= (35 + nearestSpike.scale + nearestTrap.scale)
                   && UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestEnemy.xVel, nearestEnemy.yVel) <= (35 * 1.8 + items.weapons[myPlayer.weapons[0]].range)){
                    antiPushAngle = Math.atan2(nearestEnemy.y2-myPlayer.y2, nearestEnemy.x2-myPlayer.x2);
                    return true;
                }
            }

            return false;
        }

        function updatePredictEnemyTraps(){
            let objects = [];
            for(let trap of predictEnemyTraps){
                if(visibleObjects.find((object) => UTILS.getDistance(trap.x, trap.y, object.x, object.y) < (trap.scale + object.getScale(.6, object.isItem))) || (tick - trap.tick) >= (3 * 10)){
                    objects.push(trap);
                }
            }

            for(let object of objects){
                predictEnemyTraps.splice(predictEnemyTraps.indexOf(object), 1);
            }
        }

        let spawnedObjectSids;
        let promiseResolve;
        let isAutoFollowOn = false;
        let targetPlayerId = null;
        const CLOSE_DISTANCE = 80;
        const FAR_DISTANCE = 100;
        let altPlayerManager = {
            activator: [],
            iframe: null,
            iframeActive: false,
            mode: 'sync',
        };
        document.addEventListener('keydown', (e) => {
            if (e.key === 'eleol' && document.activeElement.id.toLowerCase() !== "chatbox") {
                altPlayerManager.activator.push(Date.now());
                let recentPresses = altPlayerManager.activator.filter(g => Date.now() - g < 1000).length;

                if (recentPresses === 3) {
                    if (altPlayerManager.iframe) {
                        altPlayerManager.iframe.remove();
                        altPlayerManager.iframe = null;
                        altPlayerManager.iframeActive = false;
                    } else {
                        altPlayerManager.iframe = document.createElement('iframe');
                        altPlayerManager.iframe.src = document.URL + '?isAltPlayer=true';
                        altPlayerManager.iframe.style = `position:fixed;top:0%;right:0%;bottom:0%;left:0%;z-index:9999;width:75%;height:75%;display:block;`;
                        document.body.appendChild(altPlayerManager.iframe);
                        altPlayerManager.iframeActive = true;
                    }
                    altPlayerManager.activator = [];
                } else if (recentPresses === 1) {
                    if (altPlayerManager.iframe) {
                        altPlayerManager.iframe.style.display = (altPlayerManager.iframe.style.display === 'block') ? 'none' : 'block';
                    }
                }
            }
        });


        document.addEventListener('keydown', (e) => {
            if (e.key === 'elaow' && document.activeElement.id.toLowerCase() !== "chatbox") {
                e.preventDefault();
                if (altPlayerManager.iframeActive) {
                    altPlayerManager.iframe.contentWindow.focus();
                } else {
                    window.focus();
                }
                altPlayerManager.iframeActive = !altPlayerManager.iframeActive;
            }
        });
        const WompWomp = {
            trap:new Image(),
            spike:new Image(),
            spikeBreakSid: -1
        }
        WompWomp.trap.src = 'https://images.vexels.com/content/209028/preview/simple-hexagon-label-3f3168.png';
        WompWomp.spike.src = 'https://cdn-icons-png.flaticon.com/512/279/279951.png'
        // UPDATE PLAYER DATA:
        let lastpretrigger = Date.now();
        WompWomp.isInTrap = (sid)=>{
            let near = findPlayerBySID(sid), nearTrap;
            nearTrap = gameObjects.filter(e => e.trap && e.active && !isAlly(e.owner.sid) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5)).sort(function(a, b) {
                return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
            })[0];
            if(nearTrap){
                return nearTrap;
            }else{
                return false;
            }
        }
        class NeuralNetwork {
            constructor(inputSize, hiddenSize, outputSize) {
                this.weights1 = this.initializeWeights(inputSize, hiddenSize);
                this.weights2 = this.initializeWeights(hiddenSize, outputSize);
                this.bias1 = this.initializeBias(hiddenSize);
                this.bias2 = this.initializeBias(outputSize);
            }

            initializeWeights(input, output) {
                return Array.from({ length: input }, () => Array.from({ length: output }, () => Math.random() * 2 - 1));
            }

            initializeBias(size) {
                return Array.from({ length: size }, () => Math.random() * 2 - 1);
            }

            sigmoid(x) {
                return 1 / (1 + Math.exp(-x));
            }

            sigmoidDerivative(x) {
                return x * (1 - x);
            }

            feedForward(input) {
                this.hidden = this.sigmoid(this.addBias(this.multiply(input, this.weights1), this.bias1));
                this.output = this.sigmoid(this.addBias(this.multiply(this.hidden, this.weights2), this.bias2));
                return this.output;
            }

            addBias(matrix, bias) {
                return matrix.map((val, idx) => val + bias[idx]);
            }

            multiply(input, weights) {
                return weights[0].map((_, i) => input.reduce((sum, x, j) => sum + x * weights[j][i], 0));
            }

            backpropagate(input, expected, learningRate) {
                const outputError = expected.map((val, idx) => val - this.output[idx]);
                const outputDelta = outputError.map((val, idx) => val * this.sigmoidDerivative(this.output[idx]));

                const hiddenError = this.multiply(outputDelta, this.transpose(this.weights2));
                const hiddenDelta = hiddenError.map((val, idx) => val * this.sigmoidDerivative(this.hidden[idx]));

                this.weights2 = this.adjustWeights(this.hidden, outputDelta, this.weights2, learningRate);
                this.weights1 = this.adjustWeights(input, hiddenDelta, this.weights1, learningRate);

                this.bias2 = this.adjustBias(this.bias2, outputDelta, learningRate);
                this.bias1 = this.adjustBias(this.bias1, hiddenDelta, learningRate);
            }

            transpose(matrix) {
                return matrix[0].map((_, i) => matrix.map(row => row[i]));
            }

            adjustWeights(input, delta, weights, learningRate) {
                return weights.map((row, i) => row.map((w, j) => w + learningRate * delta[j] * input[i]));
            }

            adjustBias(bias, delta, learningRate) {
                return bias.map((b, i) => b + learningRate * delta[i]);
            }

            train(input, expected, learningRate = 0.1) {
                this.feedForward(input);
                this.backpropagate(input, expected, learningRate);
            }

            predict(input) {
                return this.feedForward(input);
            }
        }

        const inputSize = 5;
        const hiddenSize = 10;
        const outputSize = 2;
        const learningRate = 0.1;

        const nn = new NeuralNetwork(inputSize, hiddenSize, outputSize);

        function trainAI(data) {
            data.forEach(({ inputs, expected }) => {
                nn.train(inputs, expected, learningRate);
            });
        }
        let proheal = [Date.now(),100,false];
        function findID(tmpObj, tmp) {
            return tmpObj.find(THIS => THIS.id == tmp);
        }
        function updateAI() {
            const shameCount = myPlayer.shameCount;
            let tmpObj = myPlayer;
            let spikes = gameObjects.filter(e => e.dmg && e.active && UTILS.getDist(e, tmpObj, 0, 2) <= 400 && !isAlly(e.owner.sid)).sort(function(a, b) {
                return UTILS.getDist(a, tmpObj, 0, 2) - UTILS.getDist(b, tmpObj, 0, 2);
            })[0];
            const data = {
                health: myPlayer.health,
                lastDamageTime: myPlayer.timeDamaged,
                trapStatus: WompWomp.isInTrap(myPlayer),
                nearbySpikes: spikes,
                pingTime: window.pingTime
            };
            const inputs = Object.values(data);
            const prediction = nn.predict(inputs);
            if (shameCount < 8) {
                if (prediction[0] > 0.5) place(0, getSafeDir());
                if (prediction[1] > 0.5) heal(myPlayer.health - 100);
            }
            const prohealLength = proheal.length;
            const buildingData = gameObjects.map(b => b.active);

            const trainingData = [
                {
                    inputs: [data.health, data.lastDamageTime, data.trapStatus, data.nearbySpikes, data.pingTime, proheal,players,buildingData,myPlayer.shameCount],
                    expected: [prohealLength > 0 ? 1 : 0, data.health < 100 ? 1 : 0]
                }
            ];

            trainAI(trainingData);

            if (data.health <= 0) {
                const deathData = JSON.parse(localStorage.getItem('deathData') || '[]');
                deathData.push({ inputs, shameCount });
                localStorage.setItem('deathData', JSON.stringify(deathData));
            } else {
            }

            localStorage.setItem('aiData', JSON.stringify({ inputs, prediction }));
        }
        function autoFollow() {
            if (!isAutoFollowOn || targetPlayerId === null) return;
            if (altPlayerManager.mode == 'sync') {
                players.forEach((e) => {
                    if (e.sid.toString() == targetPlayerId) {
                        if (WompWomp.isInTrap(e.sid)) {
                            io.send("9", Math.atan2(e.y2 - myPlayer.y2, e.x2 - myPlayer.x2), 1);
                        } else {
                            let circleRadius = 80, circleCenterX = e.x2, circleCenterY = e.y2,angle = Math.atan2(myPlayer.y2 - circleCenterY, myPlayer.x2 - circleCenterX);
                            angle -= 0.1;
                            const x = circleCenterX + circleRadius * Math.cos(angle), y = circleCenterY + circleRadius * Math.sin(angle);
                            io.send("9", Math.atan2(y - myPlayer.y2, x - myPlayer.x2), 1);
                        }
                    }
                });
            }
        }
        let ms = {
            avg: 0,
            max: 0,
            min: 0,
            delay: 0
        }
        // UPDATE PLAYER DATA:
        function updatePlayers(data){
            tick++;
            if(myPlayer&&myPlayer.alive && proheal[1] !== 100 && Date.now() - proheal[0] >= 120 - (ms.avg / 2)){
                proheal[1] = 100;
                heal(myPlayer.health - 100);
            }
            near = [];
            enemy = [];
            enemiesNear = [];
            spawnedObjectSids = [];

            var tmpTime = Date.now();
            for(var i = 0; i < players.length; ++i){
                players[i].forcePos = !players[i].visible;
                players[i].visible = false;
            }

            for(var i = 0; i < data.length;){
                tmpObj = findPlayerBySID(data[i]);
                if (tmpObj) {
                    const lastX = tmpObj.x2, lastY = tmpObj.y2;

                    tmpObj.lastPrimaryReload = primaryReload[tmpObj.sid];
                    tmpObj.lastSecondaryReload = secondaryReload[tmpObj.sid];

                    tmpObj.t1 = (tmpObj.t2===undefined)?tmpTime:tmpObj.t2;
                    tmpObj.t2 = tmpTime;

                    tmpObj.x1 = tmpObj.x;
                    tmpObj.y1 = tmpObj.y;

                    tmpObj.x2 = data[i + 1];
                    tmpObj.y2 = data[i + 2];

                    tmpObj.xVel = tmpObj.x2 * 2 - lastX;
                    tmpObj.yVel = tmpObj.y2 * 2 - lastY;

                    tmpObj.d1 = (tmpObj.d2===undefined)?data[i + 3]:tmpObj.d2;
                    tmpObj.d2 = data[i + 3];

                    tmpObj.dt = 0;

                    tmpObj.buildIndex = data[i + 4];
                    tmpObj.weaponIndex = data[i + 5];
                    tmpObj.weaponVariant = data[i + 6];

                    tmpObj.team = data[i + 7];
                    tmpObj.isLeader = data[i + 8];
                    tmpObj.skinIndex = data[i + 9];
                    tmpObj.tailIndex = data[i + 10];

                    tmpObj.iconIndex = data[i + 11];
                    tmpObj.zIndex = data[i + 12];

                    if(tmpObj.forcePos){
                        primaryReload[tmpObj.sid] = 1;
                        secondaryReload[tmpObj.sid] = 1;
                        turretReload[tmpObj.sid] = 1;
                    }

                    tmpObj.visible = true;
                    doWeaponStuff(tmpObj);
                }

                i += 13;
            }
            const promise = new Promise(function(resolve, reject){
                promiseResolve = resolve;

                setTimeout(function(){
                    if(!promiseResolve) return;
                    promiseResolve(false);
                }, 1);
            });

            promise.then(function(newObject){
                if(tickPromiseResolve){
                    tickPromiseResolve(true);
                }

                promiseResolve = null;

                visibleObjects = gameObjects.filter(object => UTILS.getDistance(object.x, object.y, myPlayer.x2, myPlayer.y2) < 1000);

                // CHECK COLLISION
                for(const object of visibleObjects){
                    if(object.dmg > 0 || object.ignoreCollision) continue;

                    const tmpLen = 35 + object.getScale();
                    if((UTILS.getDistance(myPlayer.xVel, myPlayer.yVel, object.x, object.y) - tmpLen) < 0){
                        const tmpDir = Math.atan2(myPlayer.yVel-object.y, myPlayer.xVel-object.x);

                        myPlayer.xVel = object.x + (tmpLen * Math.cos(tmpDir));
                        myPlayer.yVel = object.y + (tmpLen * Math.sin(tmpDir));
                    }
                }

                updatePredictEnemyTraps();

                for(let i in players){
                    if(players[i].visible && players[i] != myPlayer && (players[i].team == null || players[i].team != myPlayer.team)){
                        enemiesNear.push(players[i]);
                    }
                }

                nearestEnemy = enemiesNear.sort((a, b) => UTILS.getDistance(myPlayer.x2, myPlayer.y2, a.x2, a.y2) - UTILS.getDistance(myPlayer.x2, myPlayer.y2, b.x2, b.y2))[0];

                nearestEnemiesCount = 0;
                for(let enemy of enemiesNear) {
                    if(UTILS.getDistance(myPlayer.x2, myPlayer.y2, enemy.x2, enemy.y2) <= 300){
                        nearestEnemiesCount++;
                    }

                    let trap = visibleObjects.filter(object => object.id == 15 && UTILS.getDistance(enemy.x2, enemy.y2, object.x, object.y) < 50 && (object.owner.sid == myPlayer.sid || isAlly(object.owner.sid)))[0];
                    if(trap && trap.hideFromEnemy){
                        trap.hideFromEnemy = false;
                    }
                }

                if(objectShoots.length > 0){
                    for(let shoot of objectShoots){
                        const {objects, projectile} = shoot;
                        checkBuildingDamage(projectile, objects);
                    }

                    objectShoots = [];
                }

                if(objectHits.length > 0){
                    for(let objectHit of objectHits){
                        changeObjectHealth(objectHit.player, objectHit.weapon, objectHit.objects);
                    }

                    objectHits = [];
                }

                // ENEMY SPIKES
                enemySpikes = visibleObjects.filter(object => object.id > 5 && object.id < 10 && object.owner.sid != myPlayer.sid && !isAlly(object.owner.sid));
                let nearestSpike = enemySpikes.sort((a, b) => UTILS.getDistance(myPlayer.x2, myPlayer.y2, a.x, a.y) - UTILS.getDistance(myPlayer.x2, myPlayer.y2, b.x, b.y))[0];

                // NEAREST TRAP
                const lastNearestTrap = nearestTrap;
                if(nearestTrap && removedObjects.some((sid) => nearestTrap.sid == sid)){
                    trapBreaked = true;
                    trapBreakedTick = tick;
                }

                if(trapBreaked && (tick - trapBreakedTick) > 1){
                    trapBreaked = false;
                }

                nearestTrap = visibleObjects.filter(object => object.id == 15 && UTILS.getDistance(myPlayer.x2, myPlayer.y2, object.x, object.y) <= 50 && (object.owner.sid != myPlayer.sid && !isAlly(object.owner.sid)))[0];

                // AUTO BREAK
                breakObject = null;
                if(nearestTrap){
                    if(nearestTrap.hideFromEnemy){
                        nearestTrap.hideFromEnemy = false;
                    }

                    if(nearestSpike){
                        if(spikeDmgCount > 0){
                            if(nearestEnemy && UTILS.getDistance(nearestEnemy.x2, nearestEnemy.y2, nearestTrap.x, nearestTrap.y) < UTILS.getDistance(nearestEnemy.x2, nearestEnemy.y2, nearestSpike.x, nearestSpike.y)){
                                breakObject = nearestTrap;
                                if(myPlayer.weapons[1] == 10 && UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestSpike.x, nearestSpike.y) <= (items.weapons[myPlayer.weapons[1]].range + nearestSpike.scale)){
                                    breakObject = nearestSpike;
                                } else {
                                    if(items.weapons[myPlayer.weapons[0]].speed < 400 && UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestSpike.x, nearestSpike.y) <= (items.weapons[myPlayer.weapons[0]].range + nearestSpike.scale)){
                                        breakObject = nearestSpike;
                                    }
                                }
                            } else {
                                breakObject = nearestTrap;
                            }
                        } else {
                            breakObject = nearestTrap;
                            if(myPlayer.weapons[1] == 10 && UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestSpike.x, nearestSpike.y) <= (items.weapons[myPlayer.weapons[1]].range + nearestSpike.scale)){
                                breakObject = nearestSpike;
                            } else {
                                if(items.weapons[myPlayer.weapons[0]].speed < 400 && UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestSpike.x, nearestSpike.y) <= (items.weapons[myPlayer.weapons[0]].range + nearestSpike.scale)){
                                    breakObject = nearestSpike;
                                }
                            }
                        }
                    } else {
                        breakObject = nearestTrap;
                    }
                } else {
                    if(nearestSpike){
                        if(myPlayer.weapons[1] == 10 && UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestSpike.x, nearestSpike.y) <= (items.weapons[myPlayer.weapons[1]].range + nearestSpike.scale)){
                            breakObject = nearestSpike;
                        }
                    }
                }

                if(breakObject){
                    autoBreakAngle = Math.atan2(breakObject.y-myPlayer.y2, breakObject.x-myPlayer.x2);
                    autoBreak = true;
                } else {
                    if(autoBreak){
                        autoReload = true;
                        autoBreak = false;
                    }
                }

                if(soldierAnti){
                    soldierAnti = false;
                }

                if(hits.length > 0){
                    for(let i in hits){
                        let {player, isObjectHit, weapon} = hits[i];

                        if(weapon < 9){
                            if(player.skinIndex == 20 && items.weapons[weapon].speed > 300){
                                primaryReload[player.sid] = .22;
                            } else {
                                primaryReload[player.sid] = 0;
                            }
                        } else {
                            if(player.skinIndex == 20){
                                secondaryReload[player.sid] = .22;
                            } else {
                                secondaryReload[player.sid] = 0;
                            }
                        }

                        if(player.sid == myPlayer.sid){
                            // FIX GATHER GLITCH
                            if(checkGather){
                                if(!autogathering){
                                    autogathering = true;
                                }

                                checkGather = false;
                            }
                        } else {
                            if(!isAlly(player.sid)){
                                distributionDamages({type: "hit", weapon: weapon, player: player});
                            }
                        }
                    }

                    hits = [];
                }

                if(shoots.length > 0){
                    for(let i in shoots){
                        let {x, y, range, speed, projectile} = shoots[i];

                        projectile.player = null;
                        projectile.object = null;

                        if(projectile.speed == 1.5){
                            projectile.weapon = "turret";

                            let dist = 35;
                            for(let player of players){
                                if(player.visible && dist > UTILS.getDistance(player.x2, player.y2, projectile.x, projectile.y)){
                                    projectile.player = player;
                                    dist = UTILS.getDistance(player.x2, player.y2, projectile.x, projectile.y);
                                }
                            }

                            if(projectile.player != null){
                                projectileHandle(projectile);
                                turretReload[projectile.player.sid] = 0;
                            } else {
                                let dist = 43;
                                for(let object of visibleObjects){
                                    if(dist > UTILS.getDistance(object.x, object.y, projectile.x, projectile.y)){
                                        projectile.object = object;
                                        dist = UTILS.getDistance(object.x, object.y, projectile.x, projectile.y);
                                    }
                                }
                            }
                        } else {
                            projectile.x2 = x - Math.cos(projectile.dir) * 70;
                            projectile.y2 = y - Math.sin(projectile.dir) * 70;

                            for(let i in items.projectiles){
                                if(items.projectiles[i].range == range && items.projectiles[i].speed == speed){
                                    for(let weapon of items.weapons){
                                        if(weapon.projectile == i){
                                            projectile.weapon = weapon.id;
                                        }
                                    }
                                }
                            }

                            let dist = 200;
                            for(let player of players){
                                if(player.visible && UTILS.getDistance(player.x2, player.y2, projectile.x2, projectile.y2) < dist && player.weapons[1] == projectile.weapon){
                                    projectile.player = player;
                                    dist = UTILS.getDistance(player.x2, player.y2, projectile.x2, projectile.y2);
                                }
                            }

                            if(projectile.player != null){
                                if(projectile.player.skinIndex == 20){
                                    secondaryReload[projectile.player.sid] = .22;
                                } else {
                                    secondaryReload[projectile.player.sid] = 0;
                                }
                            }
                        }
                    }

                    shoots = [];
                }

                if(removeShoots.length > 0){
                    for(let i in removeShoots){
                        let projectile = removeShoots[i];

                        if(projectile.player){
                            if(projectile.player != myPlayer && !isAlly(projectile.player.sid)){
                                distributionDamages({type: "shoot", projectile: projectile});
                            }
                        }
                    }

                    removeShoots = [];
                }

                // GET SPIKE DAMAGES
                distributionDamages({type: "spikes"});
                if(spikeDamages.length > 0){
                    spikeDmgCount++;

                    for(let i in spikeDamages){
                        spikeDmg++;
                    }
                } else {
                    spikeDmgCount = 0;
                }

                // DAMAGE BY POISON
                for(let damage of damages){
                    if(damage == 5 || damage == (5 * .75)){
                        damageByPoisonTick = tick;
                    }
                }

                // PREDICT MOVE
                predictMove = [];
                for(let i in keys){
                    if(!keys[i]) continue;

                    if(moveVectors[i]){
                        predictMove.push(moveVectors[i]);
                    }
                }

                predictMoveAngle = null;
                if(predictMove.length > 0){
                    let moveX = 0;
                    let moveY = 0;

                    for(let vector of predictMove){
                        moveX += vector[0];
                        moveY += vector[1];
                    }

                    if(moveX != 0 || moveY != 0){
                        predictMoveAngle = Math.atan2(moveY, moveX);
                    }
                }

                // AUTO PUSH
                autoPush = false;
                autoPushAngle = null;
                if(nearestEnemy && !nearestTrap){
                    let trap = visibleObjects.filter(object => object.id == 15 && UTILS.getDistance(nearestEnemy.x2, nearestEnemy.y2, object.x, object.y) < 50 && (object.owner.sid == myPlayer.sid || isAlly(object.owner.sid)))[0];
                    if(trap){
                        let spikes = visibleObjects.filter(object => object.id > 5 && object.id < 10 && UTILS.getDistance(trap.x, trap.y, object.x, object.y) < (35 / 2 + object.scale + trap.scale) && (object.owner.sid == myPlayer.sid || isAlly(object.owner.sid)));
                        let nearestSpike = spikes.sort((a, b) => UTILS.getDistance(nearestEnemy.x2, nearestEnemy.y2, a.x, a.y) - UTILS.getDistance(nearestEnemy.x2, nearestEnemy.y2, b.x, b.y))[0];

                        if(nearestSpike && !isSpikeCollisionEnemy(nearestSpike)){
                            let posX = nearestSpike.x + nearestSpike.scale * Math.cos(Math.atan2(trap.y-nearestSpike.y, trap.x-nearestSpike.x));
                            let posY = nearestSpike.y + nearestSpike.scale * Math.sin(Math.atan2(trap.y-nearestSpike.y, trap.x-nearestSpike.x));

                            pushPositions = {
                                x: posX + (UTILS.getDistance(posX, posY, nearestEnemy.x2, nearestEnemy.y2) + 35) * Math.cos(Math.atan2(nearestEnemy.y2-posY, nearestEnemy.x2-posX)),
                                y: posY + (UTILS.getDistance(posX, posY, nearestEnemy.x2, nearestEnemy.y2) + 35) * Math.sin(Math.atan2(nearestEnemy.y2-posY, nearestEnemy.x2-posX)),
                                x2: posX,
                                y2: posY
                            };

                            if(canAutoPush()){
                                autoPush = true;
                                autoPushAngle = Math.atan2(pushPositions.y-myPlayer.y2, pushPositions.x-myPlayer.x2);
                            }
                        }
                    }
                }

                if(autoPush){
                    predictMoveAngle = autoPushAngle;
                }

                // ANTI SPIKE TICK
                antiSpikeTick = false;
                if(nearestEnemy){
                    for(let i = 0;i < 36;i++){
                        let angle = UTILS.toRad(i * (360 / 36));
                        let id = 9;

                        let config = {
                            x: nearestEnemy.xVel + (35 + items.list[id].scale + (items.list[id].placeOffset || 0)) * Math.cos(angle),
                            y: nearestEnemy.yVel + (35 + items.list[id].scale + (items.list[id].placeOffset || 0)) * Math.sin(angle),
                            scale: items.list[id].scale
                        };

                        if(objectManager.checkItemLocation(config.x, config.y, config.scale, 0.6, id, false, nearestEnemy, visibleObjects)){
                            if(UTILS.getDistance(myPlayer.x2, myPlayer.y2, config.x, config.y) <= (35 + config.scale)){
                                antiSpikeTick = true;
                            }

                            if(UTILS.getDistance(myPlayer.xVel, myPlayer.yVel, config.x, config.y) <= (35 + config.scale)){
                                antiSpikeTick = true;
                            }
                        }
                    }
                }
/*                 function autoVelocityTick(dt, angle) {
                    try {
                        let minimumOTRange = (1.5 * (1000/9)) + 35;
                        let maximumOTRange = (1.5 * (1000/9)) + 80;
                        var spdMult = ((myPlayer.buildIndex>=0)?0.5:1) * (items.weapons[myPlayer.weaponIndex].spdMult||1) *
                            (myPlayer.skin?(myPlayer.skin.spdMult||1):1) * (myPlayer.tail?(myPlayer.tail.spdMult||1):1) * (myPlayer.y<=config.snowBiomeTop?
                                                                                                           ((myPlayer.skin&&myPlayer.skin.coldM)?1:config.snowSpeed):1) * myPlayer.slowMult;
                        if (UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestEnemy.x2, nearestEnemy.y2) > 201.66666666666665
                            && UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestEnemy.x2, nearestEnemy.y2) < 246.66666666666665) {
                            if (!nearestTrap && (nearestEnemy.skinIndex != 6)) {
                                elotickers();
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    }
                } */
                function grrniggergrr() {
                    if (primaryReload[myPlayer.sid] == 1 && turretReload[myPlayer.sid] == 1) {
                        hat(53, 0);
                        keyCodeWeapon = myPlayer.weapons[0];
                        selectWeapon(keyCodeWeapon);
                        setTimeout(() => {
                            autoaim = true;
                            keyCodeWeapon = myPlayer.weapons[0];
                            selectWeapon(keyCodeWeapon);
                            hat(7, 0);
                            io.send("F", 1);
                            setTimeout(() => {
                                autoaim = false;
                                io.send("F", null, 0);
                            }, 200);
                        }, 93);
                    }
                }
                if (autoVelocityTickToggled) {
                    if (nearestEnemy && myPlayer && myPlayer.alive) {
                        let minimumOTRange = (1.5 * (1000/9)) + 35;
                        let maximumOTRange = (1.5 * (1000/9)) + 80;
                        /* simple velocity caculation */
                        let distance = UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestEnemy.x2, nearestEnemy.y2);
                        if (!detect.onetick && !nearestTrap && (distance < maximumOTRange && distance > minimumOTRange) && nearestEnemy.skinIndex != 6) {
                            grrniggergrr();
                        }
                    }
                }
                healing = false;
                if(myPlayer.alive){
                    // PREDICT WEAPON
                    predictWeapon = getPredictWeapon();

                    // RESET PREDICT DAMAGES
                    resetPredictDamages();

                    // PREDICT POISON DAMAGE
                    if((tick - damageByPoisonTick) % 9 == 8){
                        predictDamage.poison = 5;
                    }

                    // PREDICT SPIKE DAMAGE
                    (function(){
                        let damage = 0;
                        if(spikeDamages.length > 0){
                            for(let i of spikeDamages){
                                if([20 * .75, 30 * .75, 35 * .75, 45 * .75].includes(i)){
                                    damage += (i / .75);
                                } else {
                                    damage += i;
                                }
                            }
                        }

                        if(predictDamage.spike < damage){
                            predictDamage.spike = damage;
                        }
                    })();

                    (function(){
                        if(trapBreaked){
                            if(predictDamage.spike < 45){
                                predictDamage.spike = 45;
                            }
                        }
                    })();

                    (function(){
                        let damage = 0;
                        if(predictMoveAngle != null && !nearestTrap){
                            let posX = myPlayer.x2 + 50 * Math.cos(predictMoveAngle);
                            let posY = myPlayer.y2 + 50 * Math.sin(predictMoveAngle);

                            for(let object of enemySpikes.filter((object) => UTILS.getDistance(posX, posY, object.x, object.y) < (35 + object.scale))){
                                damage += items.list[object.id].dmg;
                            }
                        }

                        if(predictDamage.spike < damage){
                            predictDamage.spike = damage;
                        }
                    })();

                    (function(){
                        let damage = 0;
                        for(let object of enemySpikes.filter((object) => UTILS.getDistance(myPlayer.xVel, myPlayer.yVel, object.x, object.y) < (35 + object.scale))){
                            damage += items.list[object.id].dmg;
                        }

                        if(predictDamage.spike < damage){
                            predictDamage.spike = damage;
                        }
                    })();

                    antiVelocitySpikeSync = false;

                    // GET TURRET DAMAGES
                    if(damagesByShoots.length > 0){
                        for(let i in damagesByShoots){
                            let {damage, projectile} = damagesByShoots[i];

                            if(projectile.weapon != "turret") continue;
                            damagesByTurrets.push({damage: damage, projectile: projectile});
                        }
                    }

                    // HIT DAMAGES
                    if(damagesByHits.length > 0){
                        for(let i in damagesByHits){
                            let {damage, player, weapon} = damagesByHits[i];

                            if(weapon < 8){
                                antiInstaFc({type: "normal", player: player});
                            } else {
                                if(weapon == 10){
                                    antiInstaFc({type: "reverse", player: player});
                                }
                            }
                        }

                        damagesByHits = [];
                    }

                    // SHOOT DAMAGES
                    if(damagesByShoots.length > 0){
                        for(let i in damagesByShoots){
                            let {damage, projectile} = damagesByShoots[i];

                            if(projectile.weapon == "turret") continue;
                            antiInstaFc({type: "reverse", player: projectile.player});
                        }

                        damagesByShoots = [];
                    }

                    // PREDICT VELOCITY SPIKE SYNC
                    if(nearestEnemy && predictDamage.spike > 0){
                        if(primaryReload[nearestEnemy.sid] == 1){
                            let primaryWeapon = nearestEnemy.weapons[0] ? nearestEnemy.weapons[0] : null;
                            let primaryVariant = 0;

                            if(primaryWeapon != null){
                                primaryVariant = nearestEnemy.weaponVariants[primaryWeapon];
                            } else {
                                primaryVariant = 3;
                                primaryWeapon = 5;
                            }

                            if(nearestTrap){
                                if(UTILS.getDistance(myPlayer.xVel, myPlayer.yVel, nearestEnemy.xVel, nearestEnemy.yVel) <= (35 * 1.8 + items.weapons[primaryWeapon].range)){
                                    if(spikeDmgCount < 2 || nearestEnemy.lastPrimaryReload != primaryReload[nearestEnemy.sid] || UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestEnemy.x2, nearestEnemy.y2) > (35 * 1.8 + items.weapons[primaryWeapon].range)){
                                        if(predictDamage.player == 0){
                                            predictDamage.player += items.weapons[primaryWeapon].dmg * 1.5 * config.weaponVariants[primaryVariant].val;
                                        }

                                        if(100 <= getPredictDamage()){
                                            antiVelocitySpikeSync = true;
                                        }
                                    }
                                }
                            } else {
                                if(UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestEnemy.x2, nearestEnemy.y2) <= 300){
                                    if(predictDamage.player == 0){
                                        predictDamage.player += items.weapons[primaryWeapon].dmg * 1.5 * config.weaponVariants[primaryVariant].val;
                                    }

                                    if(100 <= getPredictDamage()){
                                        antiVelocitySpikeSync = true;
                                    }
                                }
                            }
                        }

                        if(turretReload[nearestEnemy.sid] == 1 && nearestTrap && spikeDmgCount < 3){
                            if(UTILS.getDistance(myPlayer.xVel, myPlayer.yVel, nearestEnemy.xVel, nearestEnemy.yVel) <= 200){
                                if(predictDamage.player == 0){
                                    predictDamage.player += 25;
                                }
                            }
                        }
                    }

                    // PREDICT KNOCK BACK SPIKE SYNC
                    if(nearestEnemy && !nearestTrap){
                        let damage = 0;

                        if(primaryReload[nearestEnemy.sid] == 1){
                            let primaryWeapon = nearestEnemy.weapons[0] ? nearestEnemy.weapons[0] : null;
                            let primaryVariant = 0;

                            if(primaryWeapon != null){
                                primaryVariant = nearestEnemy.weaponVariants[primaryWeapon];
                            } else {
                                primaryVariant = 3;
                                primaryWeapon = 5;
                            }

                            if(UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestEnemy.x2, nearestEnemy.y2) <= (35 * 1.8 + items.weapons[primaryWeapon].range)){
                                if(predictDamage.player == 0){
                                    predictDamage.player += items.weapons[primaryWeapon].dmg * 1.5 * config.weaponVariants[primaryVariant].val;
                                }

                                let knock = 111 * (.3 + (items.weapons[primaryWeapon].knock || 0));

                                let posX = myPlayer.x2 + knock * Math.cos(Math.atan2(myPlayer.y2-nearestEnemy.y2, myPlayer.x2-nearestEnemy.x2));
                                let posY = myPlayer.y2 + knock * Math.sin(Math.atan2(myPlayer.y2-nearestEnemy.y2, myPlayer.x2-nearestEnemy.x2));

                                for(let object of enemySpikes.filter((object) => UTILS.getDistance(posX, posY, object.x, object.y) <= (35 + object.scale))){
                                    damage += items.list[object.id].dmg;
                                }

                                if(predictDamage.spike < damage){
                                    predictDamage.spike = damage;
                                }

                                if(100 <= getPredictDamage()){
                                    antiVelocitySpikeSync = true;
                                }
                            }
                        }
                    }

                    // TURRET DAMAGES
                    if(damagesByTurrets.length > 0){
                        for(let i in damagesByTurrets){
                            let {damage, projectile} = damagesByTurrets[i];

                            if(projectile.player != null && !antiReverse[projectile.player.sid]){
                                healing = true;
                            }
                        }

                        damagesByTurrets = [];
                    }

                    // SPIKE DAMAGES
                    if(spikeDamages.length > 0){
                        if(spikeDmgCount < 2 && (!nearestTrap || (nearestTrap && !lastNearestTrap))){
                            healing = true;
                        }

                        spikeDamages = [];
                    }

                    damages = [];

                    antiReverse = [];
                    antiInsta = [];

                    if(predictMoveAngle != lastMoveAngle){
                        io.send("9", predictMoveAngle);
                        lastMoveAngle = predictMoveAngle;
                    }

                    if(nearestEnemy && settings.x18ksync && primaryReload[myPlayer.sid] == 1 && !autoaim){
                        let myPlayerDamage = 0;
                        if(UTILS.getDistance(myPlayer.xVel, myPlayer.yVel, nearestEnemy.xVel, nearestEnemy.yVel) <= (35 * 1.8 + items.weapons[myPlayer.weapons[0]].range)){
                            myPlayerDamage += items.weapons[myPlayer.weapons[0]].dmg * 1.5 * config.weaponVariants[myPlayer.weaponVariants[myPlayer.weapons[0]]].val;
                        }

                        for(let player of players.filter((player) => player.sid != myPlayer.sid && isAlly(player.sid))){
                            const nearestEnemyAlly = enemiesNear.sort((a, b) => UTILS.getDistance(player.x2, player.y2, a.x2, a.y2) - UTILS.getDistance(player.x2, player.y2, b.x2, b.y2))[0];
                            if(nearestEnemy.sid != nearestEnemyAlly.sid) continue;

                            let allyDamage = 0;
                            if(UTILS.getDistance(player.xVel, player.yVel, nearestEnemy.xVel, nearestEnemy.yVel) <= (35 * 1.8 + items.weapons[player.weapons[0]].range)
                               && primaryReload[player.sid] == 1){
                                allyDamage += items.weapons[player.weapons[0]].dmg * 1.5 * config.weaponVariants[player.weaponVariants[player.weapons[0]]].val;
                            }

                            if(((myPlayerDamage + allyDamage) * .75) > 100){
                                instaKill = ["primary", "stop"];
                                break;
                            }
                        }
                    }

                    if(canVelocitySpikeTick()){
                        instaKill = ["primary", "stop"];
                    }

                    // INTSA KILL FUNCTION
                    if(instaKill.length > 0){
                        if(instaKill[0] == "secondary"){
                            autoaim = true;

                            insta.primary = false;
                            insta.secondary = true;

                            predictWeapon = myPlayer.weapons[1];

                            if(!isBadTail()){
                                instaKill.shift();
                            }
                        } else if(instaKill[0] == "primary"){
                            autoaim = true;

                            insta.primary = true;
                            insta.secondary = false;

                            predictWeapon = myPlayer.weapons[0];

                            if(!isBadTail()){
                                instaKill.shift();
                            }
                        } else if(instaKill[0] == "stop"){
                            insta.primary = false;
                            insta.secondary = false;

                            autoaim = false;

                            autoReload = true;
                            instaKill.shift();
                        }
                    }

                    antiPush = isNearestEnemyPushPlayer();
                    if(antiPush){
                        predictWeapon = myPlayer.weapons[0];
                    }

                    if(myPlayer.health <= getPredictDamage()){
                        if(autoaim || (autoBreak && spikeDmgCount > 0)){
                            healing = true;
                        } else {
                            if(myPlayer.health > (getPredictDamage() * .75)){
                                soldierAnti = true;
                            } else {
                                healing = true;
                            }
                        }
                    }

                    // HEAL
                    let damageHealed = false;
                    if(((healing && myPlayer.shameCount < 7) || (tick - damageTick) > 0) && myPlayer.health < 100){
                        heal(100 - myPlayer.health);
                        damageHealed = true;
                    }

                    // PLAYER WEAPON
                    if(myPlayer.weaponIndex != predictWeapon || myPlayer.buildIndex >= 0){
                        selectWeapon(predictWeapon);
                    }

                    // FIX GATHER GLITCH
                    if(checkGather){
                        if(autogathering){
                            autogathering = false;
                        }

                        checkGather = false;
                    }

                    // PLAYER AUTO GATHER
                    if(needAutoGather()){
                        if(!autogathering){
                            sendAutoGather();
                        }
                    } else {
                        if(autogathering){
                            sendAutoGather();
                        }
                    }

                    // CHECK GATHER
                    if(myPlayer.buildIndex < 0){
                        if(myPlayer.weaponIndex < 9){
                            if(primaryReload[myPlayer.sid] == 1){
                                checkGather = true;
                            }
                        } else {
                            if(secondaryReload[myPlayer.sid] == 1){
                                checkGather = true;
                            }
                        }
                    }

                    // PLAYER HATS & ACCESSORIES
                    hatFc();

                    // AUTO PLACER
                    getPredictObjects();
                    for(let object of predictObjects){
                        if(object.preplace) continue;

                        place(object.id, object.angle);
                        addEnemyTrap(object.id, object.angle);
                    }

                    // PLAYER DIRECTION
                    let angle = getAttackDir();
                    if(predictObjects.length > 0 || damageHealed){
                        io.send("D", angle);
                    } else {
                        if(Math.abs(myPlayer.d2 - angle) > 0.3){
                            io.send("D", angle);
                        }
                    }
                } else {
                    predictObjects = [];

                    if(deathDamages.length > 0){
                        addChatLog(`Mod: Predict Damages before death ${JSON.stringify(predictDamage)}`, "#ffffff");
                        addChatLog(`Mod: Damages before death ${JSON.stringify(deathDamages)}`, "#ffffff");

                        deathDamages = [];
                    }
                }

                for(let player of players){
                    if(player.spikeDamage <= 0) continue;
                    player.spikeDamage = 0;
                }
            });
            // PRE PLACER
            setTimeout(function(){
                for(let object of predictObjects){
                    if(!object.preplace) continue;

                    place(object.id, object.angle);
                    io.send("D", getAttackDir());
                }
            }, 1);

            setTimeout(function(){
                for(let object of predictObjects){
                    if(!object.preplace) continue;
                    place(object.id, object.angle);
                    io.send("D", getAttackDir());
                }
            }, 111 - window.pingTime);

            setTimeout(function(){
                if(spamPrePlacer){
                    for(let object of predictObjects){
                        if(!object.preplace) continue;
                        place(object.id, object.angle);
                        io.send("D", getAttackDir());
                    }
                }
            }, 111 - minPingTime);

            // AUTO FOLLOW
            autoFollow();
        }

        let tickInterval;
        let tickPromiseResolve;

        function needAutoGather(){
            return (((ePress || autoaim) && !isBadTail()) || autoBreak || antiPush) && !antiVelocitySpikeSync && !soldierAnti;
        }

        function isBadTail(){
            if(autoaim){
                if(myPlayer.tailIndex == 11){
                    return true;
                }
            } else {
                if(predictWeapon < 8 && myPlayer.tailIndex == 11){
                    return true;
                }
            }
        }

        function isPlayerCanInsta(){
            if(!nearestEnemy) return;

            let damage = 0;
            if(primaryReload[nearestEnemy.sid] == 1){
                let primaryWeapon = nearestEnemy.weapons[0] ? nearestEnemy.weapons[0] : null;
                let primaryVariant = 0;

                if(primaryWeapon != null){
                    primaryVariant = nearestEnemy.weaponVariants[primaryWeapon];
                } else {
                    primaryVariant = 3;
                    primaryWeapon = 5;
                }

                damage += items.weapons[primaryWeapon].dmg * 1.5 * config.weaponVariants[primaryVariant].val;
            }

            if(secondaryReload[nearestEnemy.sid] == 1){
                let secondaryWeapon = nearestEnemy.weapons[1] ? nearestEnemy.weapons[1] : 15;
                if(items.weapons[secondaryWeapon].projectile != undefined){
                    damage += items.projectiles[items.weapons[secondaryWeapon].projectile].dmg;
                } else {
                    damage += items.weapons[secondaryWeapon].dmg * config.weaponVariants[nearestEnemy.weaponVariants[secondaryWeapon]].val;
                }
            }

            if(turretReload[nearestEnemy.sid] == 1){
                damage += 25;
            }

            if(damage >= 100) return true;
        }

        function hatFc(){
            // HAT
            let currentHat = 0;
            if(isBoughtHat(6, 0)){
                currentHat = 6;
            }

            if(isBoughtHat(12, 0)){
                currentHat = 12;
            }

            if(myPlayer.y < 2400 && isBoughtHat(15, 0)){
                currentHat = 15;
            }

            if((myPlayer.y > 6838 && myPlayer.y < 7562) && isBoughtHat(31, 0)){
                currentHat = 31;
            }

            if(autogathering && isBoughtHat(6, 0)){
                currentHat = 6;
            }

            if(isBoughtHat(7, 0)){
                if(myPlayer.shameCount > 0 && myPlayer.skinIndex != 45 && myPlayer.health > (5 + getPredictDamage()) && (tick - damageByPoisonTick) >= 8){
                    currentHat = 7;
                }
            }

            if(nearestEnemy && UTILS.getDistance(myPlayer.x2, myPlayer.y2, nearestEnemy.x2, nearestEnemy.y2) <= 300 && isBoughtHat(6, 0)){
                currentHat = 6;
            }

            if(isBoughtHat(7, 0)){
                if(myPlayer.shameCount > 0 && myPlayer.skinIndex != 45 && myPlayer.health > (5 + getPredictDamage()) && (tick - damageByPoisonTick) >= 8
                   && (!nearestEnemy || !isPlayerCanInsta())){
                    currentHat = 7;
                }
            }

            if((antiSpikeTick || (nearestTrap && spikeDmgCount > 0)) && isBoughtHat(6, 0)){
                currentHat = 6;
            }

            if(autogathering){
                if(predictWeapon < 9){
                    if(primaryReload[myPlayer.sid] == 1){
                        if(autoBreak){
                            if(antiPush){
                                if(isBoughtHat(7, 0)){
                                    currentHat = 7;
                                }
                            } else {
                                if(isBoughtHat(40, 0)){
                                    currentHat = 40;
                                }
                            }
                        } else {
                            if(predictWeapon < 8 && nearestEnemy && UTILS.getDistance(myPlayer.xVel, myPlayer.yVel, nearestEnemy.xVel, nearestEnemy.yVel) <= (35 * 1.8 + items.weapons[predictWeapon].range)){
                                if(isBoughtHat(7, 0)){
                                    currentHat = 7;
                                }
                            } else {
                                if(isBoughtHat(40, 0)){
                                    currentHat = 40;
                                }
                            }
                        }
                    }
                } else if(predictWeapon != 11){
                    if(secondaryReload[myPlayer.sid] == 1){
                        if(predictWeapon == 10){
                            if(isBoughtHat(40, 0)){
                                currentHat = 40;
                            }
                        } else {
                            if(isBoughtHat(20, 0)){
                                currentHat = 20;
                            }
                        }
                    }
                }
            }

            // ACC
            let currentAcc = 0;
            if(isBoughtHat(19, 1)){
                currentAcc = 19;
            }

            if (nearestEnemy) {
                if (isBoughtHat(21, 1)) {
                    currentAcc = 21;
                }
            }

            if(myPlayer.weapons[0] == 8 && isBoughtHat(19, 1)){
                currentAcc = 19;
            }

            // HAT & ACC
            if(insta.primary && isBoughtHat(7, 0)){
                currentHat = 7;
            }

            if(insta.secondary && isBoughtHat(40, 0)){
                currentHat = 40;
            }

            if(isBoughtHat(6, 0)){
                if(antiVelocitySpikeSync || soldierAnti || antiTick || trapBreaked){
                    currentHat = 6;
                }
            }

            // EQUIP
            hat(currentHat);
            acc(currentAcc);
        }

        // FIND OBJECTS BY ID/SID:
        function findPlayerByID(id) {
            for (var i = 0; i < players.length; ++i) {
                if (players[i].id == id) {
                    return players[i];
                }
            } return null;
        }
        function findPlayerBySID(sid) {
            for (var i = 0; i < players.length; ++i) {
                if (players[i].sid == sid) {
                    return players[i];
                }
            } return null;
        }
        function findAIBySID(sid) {
            for (var i = 0; i < ais.length; ++i) {
                if (ais[i].sid == sid) {
                    return ais[i];
                }
            } return null;
        }
        function findObjectBySid(sid) {
            for (var i = 0; i < gameObjects.length; ++i) {
                if (gameObjects[i].sid == sid) {
                    return gameObjects[i];
                }
            } return null;
        }
        //idk
        function findAllianceBySid(sid) {
            for (let i = 0; i < alliancePlayers.length; i+=2) {
                if (alliancePlayers[i] == sid) {
                    return alliancePlayers[i];
                }
            } return null;
        }

        let pings = [];
        let minPingTime = Infinity;
        let maxPingTime = 0;
        let averagePing = 0;
        let isFirstPing = true;

        // PING:
        var lastPing = -1;
        function pingSocketResponse() {
            var pingTime = Date.now() - lastPing;
            window.pingTime = pingTime;

            if(!isFirstPing){
                if(pings.length > 200){
                    pings = [];
                }

                pings.push(pingTime);

                averagePing = 0;
                for(let ping of pings){
                    averagePing += ping;
                }

                averagePing = averagePing / pings.length;
                if(pingTime < minPingTime){
                    minPingTime = pingTime;
                }

                if(pingTime > maxPingTime){
                    maxPingTime = pingTime;
                }
            } else {
                isFirstPing = false;
            }

            pingDisplay.innerText = `Ping: ${window.pingTime} ms | Min: ${minPingTime} ms | Max: ${maxPingTime} ms | Average: ${averagePing} ms`;
        }
        function pingSocket() {
            lastPing = Date.now();
            io.send("0");
        }

        // SERVER SHUTDOWN NOTICE:
        function serverShutdownNotice(countdown) {
            if (countdown < 0) return;

            var minutes = Math.floor(countdown / 60);
            var seconds = countdown % 60;
            seconds = ("0" + seconds).slice(-2);

            shutdownDisplay.innerText = "Server restarting in " + minutes + ":" + seconds;
            shutdownDisplay.hidden = false;
        }

        // UPDATE & ANIMATE:
        function doUpdate() {
            now = Date.now();
            delta = now - lastUpdate;
            lastUpdate = now;
            updateGame();
            requestAnimationFrame(doUpdate);
        }

        // START GAME:
        function startGame() {
            bindEvents();
            loadIcons();
            loadingText.style.display = "none";
            menuCardHolder.style.display = "block";
            nameInput.value = getSavedVal("moo_name")||"";
            prepareUI();
        }
        prepareMenuBackground();
        doUpdate();

        // OPEN LINK:
        function openLink(link) {
            window.open(link, "_blank")
        }

        // EXPORT VALUES:
        window.openLink = openLink;
        window.aJoinReq = aJoinReq;
        window.follmoo = follmoo;
        window.kickFromClan = kickFromClan;
        window.sendJoin = sendJoin;
        window.leaveAlliance = leaveAlliance;
        window.createAlliance = createAlliance;
        window.storeBuy = storeBuy;
        window.storeEquip = storeEquip;
        window.showItemInfo = showItemInfo;
        window.selectSkinColor = selectSkinColor;
        window.changeStoreIndex = changeStoreIndex;
        window.config = config;


        /***/ }),

    /***/ "./src/js/config.js":
    /*!**************************!*\
  !*** ./src/js/config.js ***!
  \**************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        /* WEBPACK VAR INJECTION */(function(process) {
            // RENDER:
            module.exports.maxScreenWidth = 1920;
            module.exports.maxScreenHeight = 1080;

            // SERVER:
            module.exports.serverUpdateRate = 9;
            module.exports.tickRate = (1000 / module.exports.serverUpdateRate);
            module.exports.maxPlayers = Infinity; // (process && process.argv.indexOf("--largeserver") != -1) ? 80 : 50;
            module.exports.maxPlayersHard = Infinity; // module.exports.maxPlayers + 10;
            module.exports.collisionDepth = 6;
            module.exports.minimapRate = 3000;

            // COLLISIONS:
            module.exports.colGrid = 10;

            // CLIENT:
            module.exports.clientSendRate = 5;

            // UI:
            module.exports.healthBarWidth = 50;
            module.exports.healthBarPad = 4.5;
            module.exports.iconPadding = 15;
            module.exports.iconPad = 0.9;
            module.exports.deathFadeout = 0;
            module.exports.crownIconScale = 60;
            module.exports.crownPad = 35;

            // CHAT:
            module.exports.chatCountdown = 3000;
            module.exports.chatCooldown = 500;

            // SANDBOX:
            module.exports.inSandbox = process && process.env.VULTR_SCHEME === "mm_exp";
            module.exports.isSandbox = window.location.hostname == "sandbox.moomoo.io";

            // PLAYER:
            module.exports.maxAge = 100;
            module.exports.gatherAngle = Math.PI/2.6;
            module.exports.gatherWiggle = 10;
            module.exports.hitReturnRatio = 0.25;
            module.exports.hitAngle = Math.PI / 2;
            module.exports.playerScale = 35;
            module.exports.playerSpeed = 0.0016;
            module.exports.playerDecel = 0.993;
            module.exports.nameY = 34;

            // CUSTOMIZATION:
            module.exports.skinColors = ["#bf8f54", "#cbb091", "#896c4b",
                                         "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3",
                                         "#8bc373", "#91b2db"];

            // ANIMALS:
            module.exports.animalCount = 7;
            module.exports.aiTurnRandom = 0.06;
            module.exports.cowNames = ["Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper",
                                       "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Theo", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky"];

            // WEAPONS:
            module.exports.shieldAngle = Math.PI/3;
            module.exports.weaponVariants = [{
                id: 0,
                src: "",
                xp: 0,
                val: 1
            }, {
                id: 1,
                src: "_g",
                xp: 3000,
                val: 1.1
            }, {
                id: 2,
                src: "_d",
                xp: 7000,
                val: 1.18
            }, {
                id: 3,
                src: "_r",
                poison: true,
                xp: 12000,
                val: 1.18
            }];
            module.exports.fetchVariant = function(player) {
                var tmpXP = player.weaponXP[player.weaponIndex]||0;
                for (var i = module.exports.weaponVariants.length - 1; i >= 0; --i) {
                    if (tmpXP >= module.exports.weaponVariants[i].xp)
                        return module.exports.weaponVariants[i];
                }
            };

            // NATURE:
            module.exports.resourceTypes = ["wood", "food", "stone", "points"];
            module.exports.areaCount = 7;
            module.exports.treesPerArea = 9;
            module.exports.bushesPerArea = 3;
            module.exports.totalRocks = 32;
            module.exports.goldOres = 7;
            module.exports.riverWidth = 724;
            module.exports.riverPadding = 114;
            module.exports.waterCurrent = 0.0011;
            module.exports.waveSpeed = 0.0001;
            module.exports.waveMax = 1.3;
            module.exports.treeScales = [150, 160, 165, 175];
            module.exports.bushScales = [80, 85, 95];
            module.exports.rockScales = [80, 85, 90];

            // BIOME DATA:
            module.exports.snowBiomeTop = 2400;
            module.exports.snowSpeed = 0.75;

            // DATA:
            module.exports.maxNameLength = 15;

            // MAP:
            module.exports.mapScale = 14400;
            module.exports.mapPingScale = 40;
            module.exports.mapPingTime = 2200;

            /* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/process/browser.js */ "./node_modules/process/browser.js")))

        /***/ }),

    /***/ "./src/js/data/ai.js":
    /*!***************************!*\
  !*** ./src/js/data/ai.js ***!
  \***************************/
    /*! no static exports found */
    /***/ (function(module, exports) {


        var PI2 = Math.PI * 2;
        module.exports = function(sid, objectManager, players, items, UTILS, config, scoreCallback, server) {
            this.sid = sid;
            this.isAI = true;
            this.nameIndex = UTILS.randInt(0, config.cowNames.length-1);

            // INIT:
            this.init = function(x, y, dir, index, data) {
                this.x = x;
                this.y = y;
                this.startX = data.fixedSpawn?x:null;
                this.startY = data.fixedSpawn?y:null;
                this.xVel = 0;
                this.yVel = 0;
                this.zIndex = 0;
                this.dir = dir;
                this.dirPlus = 0;
                this.index = index;
                this.src = data.src;
                if (data.name) this.name = data.name;
                this.weightM = data.weightM;
                this.speed = data.speed;
                this.killScore = data.killScore;
                this.turnSpeed = data.turnSpeed;
                this.scale = data.scale;
                this.maxHealth = data.health;
                this.leapForce = data.leapForce;
                this.health = this.maxHealth;
                this.chargePlayer = data.chargePlayer;
                this.viewRange = data.viewRange;
                this.drop = data.drop;
                this.dmg = data.dmg;
                this.hostile = data.hostile;
                this.dontRun = data.dontRun;
                this.hitRange = data.hitRange;
                this.hitDelay = data.hitDelay;
                this.hitScare = data.hitScare;
                this.spriteMlt = data.spriteMlt;
                this.nameScale = data.nameScale;
                this.colDmg = data.colDmg;
                this.noTrap = data.noTrap;
                this.spawnDelay = data.spawnDelay;
                this.hitWait = 0;
                this.waitCount = 1000;
                this.moveCount = 0;
                this.targetDir = 0;
                this.active = true;
                this.alive = true;
                this.runFrom = null;
                this.chargeTarget = null;
                this.dmgOverTime = {};
            };

            // UPDATE:
            var timerCount = 0;
            this.update = function(delta) {
                if (this.active) {

                    // SPAWN DELAY:
                    if (this.spawnCounter) {
                        this.spawnCounter -= delta;
                        if (this.spawnCounter <= 0) {
                            this.spawnCounter = 0;
                            this.x = this.startX||UTILS.randInt(0, config.mapScale);
                            this.y = this.startY||UTILS.randInt(0, config.mapScale);
                        }
                        return;
                    }

                    // REGENS AND AUTO:
                    timerCount -= delta;
                    if (timerCount <= 0) {
                        if (this.dmgOverTime.dmg) {
                            this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer);
                            this.dmgOverTime.time -= 1;
                            if (this.dmgOverTime.time <= 0)
                                this.dmgOverTime.dmg = 0;
                        }
                        timerCount = 1000;
                    }

                    // BEHAVIOUR:
                    var charging = false;
                    var slowMlt = 1;
                    if (!this.zIndex && !this.lockMove && this.y >= (config.mapScale / 2) - (config.riverWidth / 2) &&
                        this.y <= (config.mapScale / 2) + (config.riverWidth / 2)) {
                        slowMlt = 0.33;
                        this.xVel += config.waterCurrent * delta;
                    }
                    if (this.lockMove) {
                        this.xVel = 0;
                        this.yVel = 0;
                    } else if (this.waitCount > 0) {
                        this.waitCount -= delta;
                        if (this.waitCount <= 0) {
                            if (this.chargePlayer) {
                                var tmpPlayer, bestDst, tmpDist;
                                for (var i = 0; i < players.length; ++i) {
                                    if (players[i].alive && !(players[i].skin && players[i].skin.bullRepel)) {
                                        tmpDist = UTILS.getDistance(this.x, this.y, players[i].x, players[i].y);
                                        if (tmpDist <= this.viewRange && (!tmpPlayer || tmpDist < bestDst)) {
                                            bestDst = tmpDist;
                                            tmpPlayer = players[i];
                                        }
                                    }
                                }
                                if (tmpPlayer) {
                                    this.chargeTarget = tmpPlayer;
                                    this.moveCount = UTILS.randInt(8000, 12000);
                                } else {
                                    this.moveCount = UTILS.randInt(1000, 2000);
                                    this.targetDir = UTILS.randFloat(-Math.PI, Math.PI);
                                }
                            } else {
                                this.moveCount = UTILS.randInt(4000, 10000);
                                this.targetDir = UTILS.randFloat(-Math.PI, Math.PI);
                            }
                        }
                    } else if (this.moveCount > 0) {
                        var tmpSpd = this.speed * slowMlt;
                        if (this.runFrom && this.runFrom.active && !(this.runFrom.isPlayer && !this.runFrom.alive)) {
                            this.targetDir = UTILS.getDirection(this.x, this.y, this.runFrom.x, this.runFrom.y);
                            tmpSpd *= 1.42;
                        } else if (this.chargeTarget && this.chargeTarget.alive) {
                            this.targetDir = UTILS.getDirection(this.chargeTarget.x, this.chargeTarget.y, this.x, this.y);
                            tmpSpd *= 1.75;
                            charging = true;
                        } if (this.hitWait) {
                            tmpSpd *= 0.3;
                        }
                        if (this.dir != this.targetDir) {
                            this.dir %= PI2;
                            var netAngle = (this.dir - this.targetDir + PI2) % PI2;
                            var amnt = Math.min(Math.abs(netAngle - PI2), netAngle, this.turnSpeed * delta);
                            var sign = (netAngle - Math.PI)>=0?1:-1;
                            this.dir += sign * amnt + PI2;
                        }
                        this.dir %= PI2;
                        this.xVel += (tmpSpd * delta) * Math.cos(this.dir);
                        this.yVel += (tmpSpd * delta) * Math.sin(this.dir);
                        this.moveCount -= delta;
                        if (this.moveCount <= 0) {
                            this.runFrom = null;
                            this.chargeTarget = null;
                            this.waitCount = this.hostile?1500:UTILS.randInt(1500, 6000);
                        }
                    }

                    // OBJECT COLL:
                    this.zIndex = 0;
                    this.lockMove = false;
                    var tmpList;
                    var tmpSpeed = UTILS.getDistance(0, 0, this.xVel * delta, this.yVel * delta);
                    var depth = Math.min(4, Math.max(1, Math.round(tmpSpeed / 40)));
                    var tMlt = 1 / depth;
                    for (var i = 0; i < depth; ++i) {
                        if (this.xVel)
                            this.x += (this.xVel * delta) * tMlt;
                        if (this.yVel)
                            this.y += (this.yVel * delta) * tMlt;
                        tmpList = objectManager.getGridArrays(this.x, this.y, this.scale);
                        for (var x = 0; x < tmpList.length; ++x) {
                            for (var y = 0; y < tmpList[x].length; ++y) {
                                if (tmpList[x][y].active)
                                    objectManager.checkCollision(this, tmpList[x][y], tMlt);
                            }
                        }
                    }

                    // HITTING:
                    var hitting = false;
                    if (this.hitWait > 0) {
                        this.hitWait -= delta;
                        if (this.hitWait <= 0) {
                            hitting = true;
                            this.hitWait = 0;
                            if (this.leapForce && !UTILS.randInt(0, 2)) {
                                this.xVel += this.leapForce * Math.cos(this.dir);
                                this.yVel += this.leapForce * Math.sin(this.dir);
                            }
                            var tmpList = objectManager.getGridArrays(this.x, this.y, this.hitRange);
                            var tmpObj, tmpDst;
                            for (var t = 0; t < tmpList.length; ++t) {
                                for (var x = 0; x < tmpList[t].length; ++x) {
                                    tmpObj = tmpList[t][x];
                                    if (tmpObj.health) {
                                        tmpDst = UTILS.getDistance(this.x, this.y, tmpObj.x, tmpObj.y);
                                        if (tmpDst < tmpObj.scale + this.hitRange) {
                                            if (tmpObj.changeHealth(-this.dmg * 5)) objectManager.disableObj(tmpObj);
                                            objectManager.hitObj(tmpObj, UTILS.getDirection(this.x, this.y, tmpObj.x, tmpObj.y));
                                        }
                                    }
                                }
                            }
                            for (var x = 0; x < players.length; ++x) {
                                if (players[x].canSee(this)) {
                                    server.send(players[x].id, "J", this.sid);
                                }
                            }
                        }
                    }

                    // PLAYER COLLISIONS:
                    if (charging || hitting) {
                        var tmpObj, tmpDst, tmpDir;
                        for (var i = 0; i < players.length; ++i) {
                            tmpObj = players[i];
                            if (tmpObj && tmpObj.alive) {
                                tmpDst = UTILS.getDistance(this.x, this.y, tmpObj.x, tmpObj.y);
                                if (this.hitRange) {
                                    if  (!this.hitWait && tmpDst <= this.hitRange + tmpObj.scale) {
                                        if (hitting) {
                                            tmpDir = UTILS.getDirection(tmpObj.x, tmpObj.y, this.x, this.y);
                                            tmpObj.changeHealth(-this.dmg);
                                            tmpObj.xVel += 0.6 * Math.cos(tmpDir);
                                            tmpObj.yVel += 0.6 * Math.sin(tmpDir);
                                            this.runFrom = null;
                                            this.chargeTarget = null;
                                            this.waitCount = 3000;
                                            this.hitWait = (!UTILS.randInt(0, 2)?600:0);
                                        } else this.hitWait = this.hitDelay;
                                    }
                                } else if (tmpDst <= this.scale + tmpObj.scale) {
                                    tmpDir = UTILS.getDirection(tmpObj.x, tmpObj.y, this.x, this.y);
                                    tmpObj.changeHealth(-this.dmg);
                                    tmpObj.xVel += 0.55 * Math.cos(tmpDir);
                                    tmpObj.yVel += 0.55 * Math.sin(tmpDir);
                                }
                            }
                        }
                    }

                    // DECEL:
                    if (this.xVel)
                        this.xVel *= Math.pow(config.playerDecel, delta);
                    if (this.yVel)
                        this.yVel *= Math.pow(config.playerDecel, delta);

                    // MAP BOUNDARIES:
                    var tmpScale = this.scale;
                    if (this.x - tmpScale < 0) {
                        this.x = tmpScale;
                        this.xVel = 0;
                    } else if (this.x + tmpScale > config.mapScale) {
                        this.x = config.mapScale - tmpScale;
                        this.xVel = 0;
                    } if (this.y - tmpScale < 0) {
                        this.y = tmpScale;
                        this.yVel = 0;
                    } else if (this.y + tmpScale > config.mapScale) {
                        this.y = config.mapScale - tmpScale;
                        this.yVel = 0;
                    }

                }
            };

            // CAN SEE:
            this.canSee = function(other) {
                if (!other) return false;
                if (other.skin && other.skin.invisTimer && other.noMovTimer
                    >= other.skin.invisTimer) return false;
                var dx = Math.abs(other.x - this.x) - other.scale;
                var dy = Math.abs(other.y - this.y) - other.scale;
                return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3;
            };

            var tmpRatio = 0;
            var animIndex = 0;
            this.animate = function(delta) {
                if (this.animTime > 0) {
                    this.animTime -= delta;
                    if (this.animTime <= 0) {
                        this.animTime = 0;
                        this.dirPlus = 0;
                        tmpRatio = 0;
                        animIndex = 0;
                    } else {
                        if (animIndex == 0) {
                            tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                            this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                            if (tmpRatio >= 1) {
                                tmpRatio = 1;
                                animIndex = 1;
                            }
                        } else {
                            tmpRatio -= delta / (this.animSpeed * (1-config.hitReturnRatio));
                            this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                        }
                    }
                }
            };

            // ANIMATION:
            this.startAnim = function() {
                this.animTime = this.animSpeed = 600;
                this.targetAngle = Math.PI * 0.8;
                tmpRatio = 0;
                animIndex = 0;
            };

            // CHANGE HEALTH:
            this.changeHealth = function(val, doer, runFrom) {
                if (this.active) {
                    this.health += val;
                    if (runFrom) {
                        if (this.hitScare && !UTILS.randInt(0, this.hitScare)) {
                            this.runFrom = runFrom;
                            this.waitCount = 0;
                            this.moveCount = 2000;
                        } else if (this.hostile && this.chargePlayer && runFrom.isPlayer) {
                            this.chargeTarget = runFrom;
                            this.waitCount = 0;
                            this.moveCount = 8000;
                        } else if (!this.dontRun) {
                            this.runFrom = runFrom;
                            this.waitCount = 0;
                            this.moveCount = 2000;
                        }
                    }
                    if (val < 0 && this.hitRange && UTILS.randInt(0, 1)) this.hitWait = 500;
                    if (doer && doer.canSee(this) && val < 0) {
                        server.send(doer.id, "8", Math.round(this.x),
                                    Math.round(this.y), Math.round(-val), 1);
                    } if (this.health <= 0) {
                        if (this.spawnDelay) {
                            this.spawnCounter = this.spawnDelay;
                            this.x = -1000000;
                            this.y = -1000000;
                        } else {
                            this.x = this.startX||UTILS.randInt(0, config.mapScale);
                            this.y = this.startY||UTILS.randInt(0, config.mapScale);
                        }
                        this.health = this.maxHealth;
                        this.runFrom = null;
                        if (doer) {
                            scoreCallback(doer, this.killScore);
                            if (this.drop) {
                                for (var i = 0; i < this.drop.length;) {
                                    doer.addResource(config.resourceTypes.indexOf(this.drop[i]), this.drop[i+1]);
                                    i+=2;
                                }
                            }
                        }
                    }
                }
            };

        };


        /***/ }),

    /***/ "./src/js/data/aiManager.js":
    /*!**********************************!*\
  !*** ./src/js/data/aiManager.js ***!
  \**********************************/
    /*! no static exports found */
    /***/ (function(module, exports) {


        // AI MANAGER:
        module.exports = function(ais, AI, players, items, objectManager, config, UTILS, scoreCallback, server) {

            // AI TYPES:
            this.aiTypes = [{
                id: 0,
                src: "cow_1",
                killScore: 150,
                health: 500,
                weightM: 0.8,
                speed: 0.00095,
                turnSpeed: 0.001,
                scale: 72,
                drop: ["food", 50]
            }, {
                id: 1,
                src: "pig_1",
                killScore: 200,
                health: 800,
                weightM: 0.6,
                speed: 0.00085,
                turnSpeed: 0.001,
                scale: 72,
                drop: ["food", 80]
            }, {
                id: 2,
                name: "Bull",
                src: "bull_2",
                hostile: true,
                dmg: 20,
                killScore: 1000,
                health: 1800,
                weightM: 0.5,
                speed: 0.00094,
                turnSpeed: 0.00074,
                scale: 78,
                viewRange: 800,
                chargePlayer: true,
                drop: ["food", 100]
            }, {
                id: 3,
                name: "Bully",
                src: "bull_1",
                hostile: true,
                dmg: 20,
                killScore: 2000,
                health: 2800,
                weightM: 0.45,
                speed: 0.001,
                turnSpeed: 0.0008,
                scale: 90,
                viewRange: 900,
                chargePlayer: true,
                drop: ["food", 400]
            }, {
                id: 4,
                name: "Wolf",
                src: "wolf_1",
                hostile: true,
                dmg: 8,
                killScore: 500,
                health: 300,
                weightM: 0.45,
                speed: 0.001,
                turnSpeed: 0.002,
                scale: 84,
                viewRange: 800,
                chargePlayer: true,
                drop: ["food", 200]
            }, {
                id: 5,
                name: "Quack",
                src: "chicken_1",
                dmg: 8,
                killScore: 2000,
                noTrap: true,
                health: 300,
                weightM: 0.2,
                speed: 0.0018,
                turnSpeed: 0.006,
                scale: 70,
                drop: ["food", 100]
            }, {
                id: 6,
                name: "MOOSTAFA",
                nameScale: 50,
                src: "enemy",
                hostile: true,
                dontRun: true,
                fixedSpawn: true,
                spawnDelay: 60000,
                noTrap: true,
                colDmg: 100,
                dmg: 40,
                killScore: 8000,
                health: 18000,
                weightM: 0.4,
                speed: 0.0007,
                turnSpeed: 0.01,
                scale: 80,
                spriteMlt: 1.8,
                leapForce: 0.9,
                viewRange: 1000,
                hitRange: 210,
                hitDelay: 1000,
                chargePlayer: true,
                drop: ["food", 100]
            }, {
                id: 7,
                name: "Treasure",
                hostile: true,
                nameScale: 35,
                src: "crate_1",
                fixedSpawn: true,
                spawnDelay: 120000,
                colDmg: 200,
                killScore: 5000,
                health: 20000,
                weightM: 0.1,
                speed: 0.0,
                turnSpeed: 0.0,
                scale: 70,
                spriteMlt: 1.0
            }, {
                id: 8,
                name: "MOOFIE",
                src: "wolf_2",
                hostile: true,
                fixedSpawn: true,
                dontRun: true,
                hitScare: 4,
                spawnDelay: 30000,
                noTrap: true,
                nameScale: 35,
                dmg: 10,
                colDmg: 100,
                killScore: 3000,
                health: 7000,
                weightM: 0.45,
                speed: 0.0015,
                turnSpeed: 0.002,
                scale: 90,
                viewRange: 800,
                chargePlayer: true,
                drop: ["food", 1000]
            }, {
                id: 9,
                name: "??MOOFIE",
                src: "wolf_2",
                hostile: !0,
                fixedSpawn: !0,
                dontRun: !0,
                hitScare: 50,
                spawnDelay: 6e4,
                noTrap: !0,
                nameScale: 35,
                dmg: 12,
                colDmg: 100,
                killScore: 3e3,
                health: 9e3,
                weightM: .45,
                speed: .0015,
                turnSpeed: .0025,
                scale: 94,
                viewRange: 1440,
                chargePlayer: !0,
                drop: ["food", 3e3],
                minSpawnRange: .85,
                maxSpawnRange: .9
            }, {
                id: 10,
                name: "??Wolf",
                src: "wolf_1",
                hostile: !0,
                fixedSpawn: !0,
                dontRun: !0,
                hitScare: 50,
                spawnDelay: 3e4,
                dmg: 10,
                killScore: 700,
                health: 500,
                weightM: .45,
                speed: .00115,
                turnSpeed: .0025,
                scale: 88,
                viewRange: 1440,
                chargePlayer: !0,
                drop: ["food", 400],
                minSpawnRange: .85,
                maxSpawnRange: .9
            }, {
                id: 11,
                name: "??Bully",
                src: "bull_1",
                hostile: !0,
                fixedSpawn: !0,
                dontRun: !0,
                hitScare: 50,
                dmg: 20,
                killScore: 5e3,
                health: 5e3,
                spawnDelay: 1e5,
                weightM: .45,
                speed: .00115,
                turnSpeed: .0025,
                scale: 94,
                viewRange: 1440,
                chargePlayer: !0,
                drop: ["food", 800],
                minSpawnRange: .85,
                maxSpawnRange: .9
            }];

            // SPAWN AI:
            this.spawn = function(x, y, dir, index) {
                var tmpObj;
                for (var i = 0; i < ais.length; ++i) {
                    if (!ais[i].active) {
                        tmpObj = ais[i];
                        break;
                    }
                }
                if (!tmpObj) {
                    tmpObj = new AI(ais.length, objectManager, players, items, UTILS, config, scoreCallback, server);
                    ais.push(tmpObj);
                }
                tmpObj.init(x, y, dir, index, this.aiTypes[index]);
                return tmpObj;
            };

        };


        /***/ }),

    /***/ "./src/js/data/gameObject.js":
    /*!***********************************!*\
  !*** ./src/js/data/gameObject.js ***!
  \***********************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        module.exports = function (sid) {
            this.sid = sid;

            // INIT:
            this.init = function(x, y, dir, scale, type, data, owner) {
                data = data||{};
                this.sentTo = {};
                this.gridLocations = [];
                this.active = true;
                this.doUpdate = data.doUpdate;
                this.x = x;
                this.y = y;
                this.dir = dir;
                this.xWiggle = 0;
                this.yWiggle = 0;
                this.scale = scale;
                this.type = type;
                this.id = data.id;
                this.owner = owner;
                this.name = data.name;
                this.isItem = (this.id!=undefined);
                this.group = data.group;
                this.health = data.health;
                this.maxHealth = data.health;
                this.layer = 2;
                if (this.group != undefined) {
                    this.layer = this.group.layer;
                } else if (this.type == 0) {
                    this.layer = 3;
                } else if (this.type == 2) {
                    this.layer = 0;
                }  else if (this.type == 4) {
                    this.layer = -1;
                }
                this.colDiv = data.colDiv||1;
                this.blocker = data.blocker;
                this.ignoreCollision = data.ignoreCollision;
                this.dontGather = data.dontGather;
                this.hideFromEnemy = data.hideFromEnemy;
                this.friction = data.friction;
                this.projDmg = data.projDmg;
                this.dmg = data.dmg;
                this.pDmg = data.pDmg;
                this.pps = data.pps;
                this.zIndex = data.zIndex||0;
                this.turnSpeed = data.turnSpeed;
                this.req = data.req;
                this.trap = data.trap;
                this.healCol = data.healCol;
                this.teleport = data.teleport;
                this.boostSpeed = data.boostSpeed;
                this.projectile = data.projectile;
                this.shootRange = data.shootRange;
                this.shootRate = data.shootRate;
                this.shootCount = this.shootRate;
                this.spawnPoint = data.spawnPoint;
            };

            // GET HIT:
            this.changeHealth = function(amount, doer) {
                this.health += amount;
                return (this.health <= 0);
            };

            // GET SCALE:
            this.getScale = function(sM, ig) {
                sM = sM||1;
                return this.scale * ((this.isItem||this.type==2||this.type==3||this.type==4)
                                     ?1:(0.6*sM)) * (ig?1:this.colDiv);
            };

            // VISIBLE TO PLAYER:
            this.visibleToPlayer = function(player) {
                return !(this.hideFromEnemy) || (this.owner && (this.owner == player ||
                                                                (this.owner.team && player.team == this.owner.team)));
            };

            // UPDATE:
            this.update = function(delta) {
                if (this.active) {
                    if (this.xWiggle) {
                        this.xWiggle *= Math.pow(0.99, delta);
                    }
                    if (this.yWiggle) {
                        this.yWiggle *= Math.pow(0.99, delta);
                    }

                    /*
                    if(this.turnSpeed){
                        this.dir += this.turnSpeed * delta;
                    }
                    */
                }
            };
        };


        /***/ }),

    /***/ "./src/js/data/items.js":
    /*!******************************!*\
  !*** ./src/js/data/items.js ***!
  \******************************/
    /*! no static exports found */
    /***/ (function(module, exports) {


        // ITEM GROUPS:
        module.exports.groups = [{
            id: 0,
            name: "food",
            layer: 0
        }, {
            id: 1,
            name: "walls",
            place: !0,
            limit: 30,
            layer: 0
        }, {
            id: 2,
            name: "spikes",
            place: !0,
            limit: 15,
            layer: 0
        }, {
            id: 3,
            name: "mill",
            place: !0,
            limit: 7,
            sandboxLimit: 299,
            layer: 1
        }, {
            id: 4,
            name: "mine",
            place: !0,
            limit: 1,
            layer: 0
        }, {
            id: 5,
            name: "trap",
            place: !0,
            limit: 6,
            layer: -1
        }, {
            id: 6,
            name: "booster",
            place: !0,
            limit: 12,
            sandboxLimit: 299,
            layer: -1
        }, {
            id: 7,
            name: "turret",
            place: !0,
            limit: 2,
            layer: 1
        }, {
            id: 8,
            name: "watchtower",
            place: !0,
            limit: 12,
            layer: 1
        }, {
            id: 9,
            name: "buff",
            place: !0,
            limit: 4,
            layer: -1
        }, {
            id: 10,
            name: "spawn",
            place: !0,
            limit: 1,
            layer: -1
        }, {
            id: 11,
            name: "sapling",
            place: !0,
            limit: 2,
            layer: 0
        }, {
            id: 12,
            name: "blocker",
            place: !0,
            limit: 3,
            layer: -1
        }, {
            id: 13,
            name: "teleporter",
            place: !0,
            limit: 2,
            sandboxLimit: 299,
            layer: -1
        }];

        // PROJECTILES:
        exports.projectiles = [{
            indx: 0,
            layer: 0,
            src: "arrow_1",
            dmg: 25,
            speed: 1.6,
            scale: 103,
            range: 1000
        }, {
            indx: 1,
            layer: 1,
            dmg: 25,
            scale: 20
        }, {
            indx: 0,
            layer: 0,
            src: "arrow_1",
            dmg: 35,
            speed: 2.5,
            scale: 103,
            range: 1200
        }, {
            indx: 0,
            layer: 0,
            src: "arrow_1",
            dmg: 30,
            speed: 2,
            scale: 103,
            range: 1200
        }, {
            indx: 1,
            layer: 1,
            dmg: 16,
            scale: 20
        }, {
            indx: 0,
            layer: 0,
            src: "bullet_1",
            dmg: 50,
            speed: 3.6,
            scale: 160,
            range: 1400
        }];

        // WEAPONS:
        exports.weapons = [{
            id: 0,
            type: 0,
            name: "tool hammer",
            desc: "tool for gathering all resources",
            src: "hammer_1",
            length: 140,
            width: 140,
            xOff: -3,
            yOff: 18,
            dmg: 25,
            range: 65,
            gather: 1,
            speed: 300
        }, {
            id: 1,
            type: 0,
            age: 2,
            name: "hand axe",
            desc: "gathers resources at a higher rate",
            src: "axe_1",
            length: 140,
            width: 140,
            xOff: 3,
            yOff: 24,
            dmg: 30,
            spdMult: 1,
            range: 70,
            gather: 2,
            speed: 400
        }, {
            id: 2,
            type: 0,
            age: 8,
            pre: 1,
            name: "great axe",
            desc: "deal more damage and gather more resources",
            src: "great_axe_1",
            length: 140,
            width: 140,
            xOff: -8,
            yOff: 25,
            dmg: 35,
            spdMult: 1,
            range: 75,
            gather: 4,
            speed: 400
        }, {
            id: 3,
            type: 0,
            age: 2,
            name: "short sword",
            desc: "increased attack power but slower move speed",
            src: "sword_1",
            iPad: 1.3,
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 46,
            dmg: 35,
            spdMult: 0.85,
            range: 110,
            gather: 1,
            speed: 300
        }, {
            id: 4,
            type: 0,
            age: 8,
            pre: 3,
            name: "katana",
            desc: "greater range and damage",
            src: "samurai_1",
            iPad: 1.3,
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 59,
            dmg: 40,
            spdMult: 0.8,
            range: 118,
            gather: 1,
            speed: 300
        }, {
            id: 5,
            type: 0,
            age: 2,
            name: "polearm",
            desc: "long range melee weapon",
            src: "spear_1",
            iPad: 1.3,
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 53,
            dmg: 45,
            knock: 0.2,
            spdMult: 0.82,
            range: 142,
            gather: 1,
            speed: 700
        }, {
            id: 6,
            type: 0,
            age: 2,
            name: "bat",
            desc: "fast long range melee weapon",
            src: "bat_1",
            iPad: 1.3,
            length: 110,
            width: 180,
            xOff: -8,
            yOff: 53,
            dmg: 20,
            knock: 0.7,
            range: 110,
            gather: 1,
            speed: 300
        }, {
            id: 7,
            type: 0,
            age: 2,
            name: "daggers",
            desc: "really fast short range weapon",
            src: "dagger_1",
            iPad: 0.8,
            length: 110,
            width: 110,
            xOff: 18,
            yOff: 0,
            dmg: 20,
            knock: 0.1,
            range: 65,
            gather: 1,
            hitSlow: 0.1,
            spdMult: 1.13,
            speed: 100
        }, {
            id: 8,
            type: 0,
            age: 2,
            name: "stick",
            desc: "great for gathering but very weak",
            src: "stick_1",
            length: 140,
            width: 140,
            xOff: 3,
            yOff: 24,
            dmg: 1,
            spdMult: 1,
            range: 70,
            gather: 7,
            speed: 400
        }, {
            id: 9,
            type: 1,
            age: 6,
            name: "hunting bow",
            desc: "bow used for ranged combat and hunting",
            src: "bow_1",
            req: ["wood", 4],
            length: 120,
            width: 120,
            xOff: -6,
            yOff: 0,
            projectile: 0,
            spdMult: 0.75,
            speed: 600
        }, {
            id: 10,
            type: 1,
            age: 6,
            name: "great hammer",
            desc: "hammer used for destroying structures",
            src: "great_hammer_1",
            length: 140,
            width: 140,
            xOff: -9,
            yOff: 25,
            dmg: 10,
            spdMult: 0.88,
            range: 75,
            sDmg: 7.5,
            gather: 1,
            speed: 400
        }, {
            id: 11,
            type: 1,
            age: 6,
            name: "wooden shield",
            desc: "blocks projectiles and reduces melee damage",
            src: "shield_1",
            length: 120,
            width: 120,
            shield: 0.2,
            xOff: 6,
            yOff: 0,
            spdMult: 0.7
        }, {
            id: 12,
            type: 1,
            age: 8,
            pre: 9,
            name: "crossbow",
            desc: "deals more damage and has greater range",
            src: "crossbow_1",
            req: ["wood", 5],
            aboveHand: true,
            armS: 0.75,
            length: 120,
            width: 120,
            xOff: -4,
            yOff: 0,
            projectile: 2,
            spdMult: 0.7,
            speed: 700
        }, {
            id: 13,
            type: 1,
            age: 9,
            pre: 12,
            name: "repeater crossbow",
            desc: "high firerate crossbow with reduced damage",
            src: "crossbow_2",
            req: ["wood", 10],
            aboveHand: true,
            armS: 0.75,
            length: 120,
            width: 120,
            xOff: -4,
            yOff: 0,
            projectile: 3,
            spdMult: 0.7,
            speed: 230
        }, {
            id: 14,
            type: 1,
            age: 6,
            name: "mc grabby",
            desc: "steals resources from enemies",
            src: "grab_1",
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 53,
            dmg: 0,
            steal: 250,
            knock: 0.2,
            spdMult: 1.05,
            range: 125,
            gather: 0,
            speed: 700
        }, {
            id: 15,
            type: 1,
            age: 9,
            pre: 12,
            name: "musket",
            desc: "slow firerate but high damage and range",
            src: "musket_1",
            req: ["stone", 10],
            aboveHand: true,
            rec: 0.35,
            armS: 0.6,
            hndS: 0.3,
            hndD: 1.6,
            length: 205,
            width: 205,
            xOff: 25,
            yOff: 0,
            projectile: 5,
            hideProjectile: true,
            spdMult: 0.6,
            speed: 1500
        }];

        // ITEMS:
        module.exports.list = [{
            group: module.exports.groups[0],
            name: "apple",
            desc: "restores 20 health when consumed",
            req: ["food", 10],
            consume: function(doer) {
                return doer.changeHealth(20, doer);
            },
            heal: 20,
            scale: 22,
            holdOffset: 15
        }, {
            age: 3,
            group: module.exports.groups[0],
            name: "cookie",
            desc: "restores 40 health when consumed",
            req: ["food", 15],
            consume: function(doer) {
                return doer.changeHealth(40, doer);
            },
            heal: 40,
            scale: 27,
            holdOffset: 15
        }, {
            age: 7,
            group: module.exports.groups[0],
            name: "cheese",
            desc: "restores 30 health and another 50 over 5 seconds",
            req: ["food", 25],
            consume: function(doer) {
                if (doer.changeHealth(30, doer) || doer.health < 100) {
                    doer.dmgOverTime.dmg = -10;
                    doer.dmgOverTime.doer = doer;
                    doer.dmgOverTime.time = 5;
                    return true;
                }
                return false;
            },
            heal: 30,
            scale: 27,
            holdOffset: 15
        }, {
            group: module.exports.groups[1],
            name: "wood wall",
            desc: "provides protection for your village",
            req: ["wood", 10],
            projDmg: true,
            health: 380,
            scale: 50,
            holdOffset: 20,
            placeOffset: -5
        }, {
            age: 3,
            group: module.exports.groups[1],
            name: "stone wall",
            desc: "provides improved protection for your village",
            req: ["stone", 25],
            health: 900,
            scale: 50,
            holdOffset: 20,
            placeOffset: -5
        }, {
            age: 7,
            group: module.exports.groups[1],
            name: "castle wall",
            desc: "provides powerful protection for your village",
            req: ["stone", 35],
            health: 1500,
            scale: 52,
            holdOffset: 20,
            placeOffset: -5
        }, {
            group: module.exports.groups[2],
            name: "spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 20, "stone", 5],
            health: 400,
            dmg: 20,
            scale: 49,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5
        }, {
            age: 5,
            group: module.exports.groups[2],
            name: "greater spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 30, "stone", 10],
            health: 500,
            dmg: 35,
            scale: 52,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5
        }, {
            age: 9,
            group: module.exports.groups[2],
            name: "poison spikes",
            desc: "poisons enemies when they touch them",
            req: ["wood", 35, "stone", 15],
            health: 600,
            dmg: 30,
            pDmg: 5,
            scale: 52,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5
        }, {
            age: 9,
            group: module.exports.groups[2],
            name: "spinning spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 30, "stone", 20],
            health: 500,
            dmg: 45,
            turnSpeed: 0.003,
            scale: 52,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5
        }, {
            group: module.exports.groups[3],
            name: "windmill",
            desc: "generates gold over time",
            req: ["wood", 50, "stone", 10],
            health: 400,
            pps: 1,
            turnSpeed: 0.0016,
            spritePadding: 25,
            iconLineMult: 12,
            scale: 45,
            holdOffset: 20,
            placeOffset: 5
        }, {
            age: 5,
            group: module.exports.groups[3],
            name: "faster windmill",
            desc: "generates more gold over time",
            req: ["wood", 60, "stone", 20],
            health: 500,
            pps: 1.5,
            turnSpeed: 0.0025,
            spritePadding: 25,
            iconLineMult: 12,
            scale: 47,
            holdOffset: 20,
            placeOffset: 5
        }, {
            age: 8,
            group: module.exports.groups[3],
            name: "power mill",
            desc: "generates more gold over time",
            req: ["wood", 100, "stone", 50],
            health: 800,
            pps: 2,
            turnSpeed: 0.005,
            spritePadding: 25,
            iconLineMult: 12,
            scale: 47,
            holdOffset: 20,
            placeOffset: 5
        }, {
            age: 5,
            group: module.exports.groups[4],
            type: 2,
            name: "mine",
            desc: "allows you to mine stone",
            req: ["wood", 20, "stone", 100],
            iconLineMult: 12,
            scale: 65,
            holdOffset: 20,
            placeOffset: 0
        }, {
            age: 5,
            group: module.exports.groups[11],
            type: 0,
            name: "sapling",
            desc: "allows you to farm wood",
            req: ["wood", 150],
            iconLineMult: 12,
            colDiv: 0.5,
            scale: 110,
            holdOffset: 50,
            placeOffset: -15
        }, {
            age: 4,
            group: module.exports.groups[5],
            name: "pit trap",
            desc: "pit that traps enemies if they walk over it",
            req: ["wood", 30, "stone", 30],
            trap: true,
            ignoreCollision: true,
            hideFromEnemy: true,
            health: 500,
            colDiv: 0.2,
            scale: 50,
            holdOffset: 20,
            placeOffset: -5
        }, {
            age: 4,
            group: module.exports.groups[6],
            name: "boost pad",
            desc: "provides boost when stepped on",
            req: ["stone", 20, "wood", 5],
            ignoreCollision: true,
            boostSpeed: 1.5,
            health: 150,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5
        }, {
            age: 7,
            group: module.exports.groups[7],
            doUpdate: true,
            name: "turret",
            desc: "defensive structure that shoots at enemies",
            req: ["wood", 200, "stone", 150],
            health: 800,
            projectile: 1,
            shootRange: 700,
            shootRate: 2200,
            scale: 43,
            holdOffset: 20,
            placeOffset: -5
        }, {
            age: 7,
            group: module.exports.groups[8],
            name: "platform",
            desc: "platform to shoot over walls and cross over water",
            req: ["wood", 20],
            ignoreCollision: true,
            zIndex: 1,
            health: 300,
            scale: 43,
            holdOffset: 20,
            placeOffset: -5
        }, {
            age: 7,
            group: module.exports.groups[9],
            name: "healing pad",
            desc: "standing on it will slowly heal you",
            req: ["wood", 30, "food", 10],
            ignoreCollision: true,
            healCol: 15,
            health: 400,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5
        }, {
            age: 9,
            group: module.exports.groups[10],
            name: "spawn pad",
            desc: "you will spawn here when you die but it will dissapear",
            req: ["wood", 100, "stone", 100],
            health: 400,
            ignoreCollision: true,
            spawnPoint: true,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5
        }, {
            age: 7,
            group: module.exports.groups[12],
            name: "blocker",
            desc: "blocks building in radius",
            req: ["wood", 30, "stone", 25],
            ignoreCollision: true,
            blocker: 300,
            health: 400,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5
        }, {
            age: 7,
            group: module.exports.groups[13],
            name: "teleporter",
            desc: "teleports you to a random point on the map",
            req: ["wood", 60, "stone", 60],
            ignoreCollision: true,
            teleport: true,
            health: 200,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5
        }];

        // ASSIGN IDS:
        for (var i = 0; i < module.exports.list.length; ++i) {
            module.exports.list[i].id = i;
        }

        // TROLOLOLOL:
        if (typeof window !== "undefined") {
            function shuffle(a) {
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            }
        }


        /***/ }),

    /***/ "./src/js/data/mapManager.js":
    /*!***********************************!*\
  !*** ./src/js/data/mapManager.js ***!
  \***********************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        // GLOBAL MAPMANAGER:
        module.exports = {}

        /***/ }),

    /***/ "./src/js/data/objectManager.js":
    /*!**************************************!*\
  !*** ./src/js/data/objectManager.js ***!
  \**************************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        var mathFloor = Math.floor;
        var mathABS = Math.abs;
        var mathCOS = Math.cos;
        var mathSIN = Math.sin;
        var mathPOW = Math.pow;
        var mathSQRT = Math.sqrt;
        module.exports = function (GameObject, gameObjects, UTILS, config, players, server) {
            this.objects = gameObjects;
            this.grids = {};
            this.updateObjects = [];

            // SET OBJECT GRIDS:
            var tmpX, tmpY;
            var tmpS = config.mapScale/config.colGrid;
            this.setObjectGrids = function(obj) {
                var objX = Math.min(config.mapScale, Math.max(0, obj.x));
                var objY = Math.min(config.mapScale, Math.max(0, obj.y));
                for (var x = 0; x < config.colGrid; ++x) {
                    tmpX = x * tmpS;
                    for (var y = 0; y < config.colGrid; ++y) {
                        tmpY = y * tmpS;
                        if (objX + obj.scale >= tmpX && objX - obj.scale <= tmpX + tmpS &&
                            objY + obj.scale >= tmpY && objY - obj.scale <= tmpY + tmpS) {
                            if (!this.grids[x + "_" + y])
                                this.grids[x + "_" + y] = [];
                            this.grids[x + "_" + y].push(obj);
                            obj.gridLocations.push(x + "_" + y);
                        }
                    }
                }
            };

            // REMOVE OBJECT FROM GRID:
            this.removeObjGrid = function(obj) {
                var tmpIndx;
                for (var i = 0; i < obj.gridLocations.length; ++i) {
                    tmpIndx = this.grids[obj.gridLocations[i]].indexOf(obj);
                    if (tmpIndx >= 0) {
                        this.grids[obj.gridLocations[i]].splice(tmpIndx, 1);
                    }
                }
            };

            // DISABLE OBJ:
            this.disableObj = function(obj) {
                obj.active = false;
                if (server) {
                    if (obj.owner && obj.pps) obj.owner.pps -= obj.pps;
                    this.removeObjGrid(obj);
                    var tmpIndx = this.updateObjects.indexOf(obj);
                    if (tmpIndx >= 0) {
                        this.updateObjects.splice(tmpIndx, 1);
                    }
                }
            };

            // HIT OBJECT:
            this.hitObj = function(tmpObj, tmpDir) {
                for (var p = 0; p < players.length; ++p) {
                    if (players[p].active) {
                        if (tmpObj.sentTo[players[p].id]) {
                            if (!tmpObj.active) server.send(players[p].id, "Q", tmpObj.sid);
                            else if (players[p].canSee(tmpObj))
                                server.send(players[p].id, "L", UTILS.fixTo(tmpDir, 1), tmpObj.sid);
                        } if (!tmpObj.active && tmpObj.owner == players[p])
                            players[p].changeItemCount(tmpObj.group.id, -1);
                    }
                }
            };

            // GET GRID ARRAY:
            var tmpArray = [];
            var tmpGrid;
            this.getGridArrays = function(xPos, yPos, s) {
                tmpX = mathFloor(xPos / tmpS);
                tmpY = mathFloor(yPos / tmpS);
                tmpArray.length = 0;
                try {
                    if (this.grids[tmpX + "_" + tmpY])
                        tmpArray.push(this.grids[tmpX + "_" + tmpY]);
                    if (xPos + s >= (tmpX + 1) * tmpS) { // RIGHT
                        tmpGrid = this.grids[(tmpX + 1) + "_" + tmpY];
                        if (tmpGrid) tmpArray.push(tmpGrid);
                        if (tmpY && yPos - s <= tmpY * tmpS) { // TOP RIGHT
                            tmpGrid = this.grids[(tmpX + 1) + "_" + (tmpY - 1)];
                            if (tmpGrid) tmpArray.push(tmpGrid);
                        } else if (yPos + s >= (tmpY + 1) * tmpS) { // BOTTOM RIGHT
                            tmpGrid = this.grids[(tmpX + 1) + "_" + (tmpY + 1)];
                            if (tmpGrid) tmpArray.push(tmpGrid);
                        }
                    } if (tmpX && xPos - s <= tmpX * tmpS) { // LEFT
                        tmpGrid = this.grids[(tmpX - 1) + "_" + tmpY];
                        if (tmpGrid) tmpArray.push(tmpGrid);
                        if (tmpY && yPos - s <= tmpY * tmpS) { // TOP LEFT
                            tmpGrid = this.grids[(tmpX - 1) + "_" + (tmpY - 1)];
                            if (tmpGrid) tmpArray.push(tmpGrid);
                        } else if (yPos + s >= (tmpY + 1) * tmpS) { // BOTTOM LEFT
                            tmpGrid = this.grids[(tmpX - 1) + "_" + (tmpY + 1)];
                            if (tmpGrid) tmpArray.push(tmpGrid);
                        }
                    } if (yPos + s >= (tmpY + 1) * tmpS) { // BOTTOM
                        tmpGrid = this.grids[tmpX + "_" + (tmpY + 1)];
                        if (tmpGrid) tmpArray.push(tmpGrid);
                    } if (tmpY && yPos - s <= tmpY * tmpS) { // TOP
                        tmpGrid = this.grids[tmpX + "_" + (tmpY - 1)];
                        if (tmpGrid) tmpArray.push(tmpGrid);
                    }
                } catch (e) {}
                return tmpArray;
            };

            // ADD NEW:
            var tmpObj;
            this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
                tmpObj = null;
                for (var i = 0; i < gameObjects.length; ++i) {
                    if (gameObjects[i].sid == sid) {
                        tmpObj = gameObjects[i];
                        break;
                    }
                } if (!tmpObj) {
                    for (var i = 0; i < gameObjects.length; ++i) {
                        if (!gameObjects[i].active) {
                            tmpObj = gameObjects[i];
                            break;
                        }
                    }
                } if (!tmpObj) {
                    tmpObj = new GameObject(sid);
                    gameObjects.push(tmpObj);
                }
                if (setSID)
                    tmpObj.sid = sid;
                tmpObj.init(x, y, dir, s, type, data, owner);
                if (server) {
                    this.setObjectGrids(tmpObj);
                    if (tmpObj.doUpdate)
                        this.updateObjects.push(tmpObj);
                }
            };

            // DISABLE BY SID:
            this.disableBySid = function(sid) {
                for(const object of gameObjects){
                    if(object.sid != sid) continue;

                    gameObjects.splice(gameObjects.indexOf(object), 1);
                    break;
                }

                /*
                for(var i = 0; i < gameObjects.length; ++i){
                    if(gameObjects[i].sid == sid){
                        this.disableObj(gameObjects[i]);
                        break;
                    }
                }
                */
            };

            // REMOVE ALL FROM PLAYER:
            this.removeAllItems = function(sid, server) {
                const objects = gameObjects.filter((object) => object.owner && object.owner.sid == sid);
                for(const object of objects){
                    gameObjects.splice(gameObjects.indexOf(object), 1);
                }

                /*
                for (var i = 0; i < gameObjects.length; ++i) {
                    if (gameObjects[i].active && gameObjects[i].owner && gameObjects[i].owner.sid == sid) {
                        this.disableObj(gameObjects[i]);
                    }
                }
                if (server) {
                    server.broadcast("R", sid);
                }
                */
            };

            // FETCH SPAWN OBJECT:
            this.fetchSpawnObj = function(sid) {
                var tmpLoc = null;
                for (var i = 0; i < gameObjects.length; ++i) {
                    tmpObj = gameObjects[i];
                    if (tmpObj.active && tmpObj.owner && tmpObj.owner.sid == sid && tmpObj.spawnPoint) {
                        tmpLoc = [tmpObj.x, tmpObj.y];
                        this.disableObj(tmpObj);
                        server.broadcast("Q", tmpObj.sid);
                        if (tmpObj.owner) {
                            tmpObj.owner.changeItemCount(tmpObj.group.id, -1);
                        }
                        break;
                    }
                }
                return tmpLoc;
            };

            // CHECK IF PLACABLE:
            this.checkItemLocation = function(x, y, s, sM, indx, ignoreWater, placer, objects) {
                for (var i = 0; i < objects.length; ++i) {
                    var blockS = (objects[i].blocker?
                                  objects[i].blocker:objects[i].getScale(sM, objects[i].isItem));
                    if (objects[i].active && UTILS.getDistance(x, y, objects[i].x,
                                                               objects[i].y) < (s + blockS))
                        return false;
                } if (!ignoreWater && indx != 18 && y >= (config.mapScale / 2) - (config.riverWidth / 2) && y <=
                      (config.mapScale / 2) + (config.riverWidth / 2)) {
                    return false;
                }
                return true;
            };

            // ADD PROJECTILE:
            this.addProjectile = function(x, y, dir, range, indx) {
                var tmpData = items.projectiles[indx];
                var tmpProj;
                for (var i = 0; i < projectiles.length; ++i) {
                    if (!projectiles[i].active) {
                        tmpProj = projectiles[i];
                        break;
                    }
                }
                if (!tmpProj) {
                    tmpProj = new Projectile(players, UTILS);
                    projectiles.push(tmpProj);
                }
                tmpProj.init(indx, x, y, dir, tmpData.speed, range, tmpData.scale);
            };

            // CHECK PLAYER COLLISION:
            this.checkCollision = function(player, other, delta) {
                delta = delta||1;
                var dx = player.x - other.x;
                var dy = player.y - other.y;
                var tmpLen = player.scale + other.scale;
                if (mathABS(dx) <= tmpLen || mathABS(dy) <= tmpLen) {
                    tmpLen = player.scale + (other.getScale?other.getScale():other.scale);
                    var tmpInt = mathSQRT(dx * dx + dy * dy) - tmpLen;
                    if (tmpInt <= 0) {
                        if (!other.ignoreCollision) {
                            var tmpDir = UTILS.getDirection(player.x, player.y, other.x, other.y);
                            var tmpDist = UTILS.getDistance(player.x, player.y, other.x, other.y);
                            if (other.isPlayer) {
                                tmpInt = (tmpInt * -1) / 2;
                                player.x += (tmpInt * mathCOS(tmpDir));
                                player.y += (tmpInt * mathSIN(tmpDir));
                                other.x -= (tmpInt * mathCOS(tmpDir));
                                other.y -= (tmpInt * mathSIN(tmpDir));
                            } else {
                                player.x = other.x + (tmpLen * mathCOS(tmpDir));
                                player.y = other.y + (tmpLen * mathSIN(tmpDir));
                                player.xVel *= 0.75;
                                player.yVel *= 0.75;
                            }
                            if (other.dmg && other.owner != player && !(other.owner &&
                                                                        other.owner.team && other.owner.team == player.team)) {
                                player.changeHealth(-other.dmg, other.owner, other);
                                var tmpSpd = 1.5 * (other.weightM||1);
                                player.xVel += tmpSpd * mathCOS(tmpDir);
                                player.yVel += tmpSpd * mathSIN(tmpDir);
                                if (other.pDmg && !(player.skin && player.skin.poisonRes)) {
                                    player.dmgOverTime.dmg = other.pDmg;
                                    player.dmgOverTime.time = 5;
                                    player.dmgOverTime.doer = other.owner;
                                }
                                if (player.colDmg && other.health) {
                                    if (other.changeHealth(-player.colDmg)) this.disableObj(other);
                                    this.hitObj(other, UTILS.getDirection(player.x, player.y, other.x, other.y));
                                }
                            }
                        } else if (other.trap && !player.noTrap && other.owner != player && !(other.owner &&
                                                                                              other.owner.team && other.owner.team == player.team)) {
                            player.lockMove = true;
                            other.hideFromEnemy = false;
                        } else if (other.boostSpeed) {
                            player.xVel += (delta * other.boostSpeed * (other.weightM||1)) * mathCOS(other.dir);
                            player.yVel += (delta * other.boostSpeed * (other.weightM||1)) * mathSIN(other.dir);
                        } else if (other.healCol) {
                            player.healCol = other.healCol;
                        } else if (other.teleport) {
                            player.x = UTILS.randInt(0, config.mapScale);
                            player.y = UTILS.randInt(0, config.mapScale);
                        }
                        if (other.zIndex > player.zIndex) player.zIndex = other.zIndex;
                        return true;
                    }
                }
                return false;
            };

        };


        /***/ }),

    /***/ "./src/js/data/player.js":
    /*!*******************************!*\
  !*** ./src/js/data/player.js ***!
  \*******************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        var LangFilter = __webpack_require__(/*! bad-words */ "./node_modules/bad-words/lib/badwords.js");
        var langFilter = new LangFilter();
        var newProfane = ['jew', 'black', 'baby', 'child', 'white',
                          'porn', 'pedo', 'trump', 'clinton', 'hitler', 'nazi',
                          'gay', 'pride', 'sex', 'pleasure', 'touch', 'poo', 'kids',
                          'rape', 'white power', 'nigga', 'nig nog', 'doggy', 'rapist',
                          'boner', 'nigger', 'nigg', 'finger', 'nogger', 'nagger', 'nig',
                          'fag', 'gai', 'pole', 'stripper', "penis", 'vagina', 'pussy',
                          'nazi', 'hitler', 'stalin', 'burn', 'chamber', 'cock',
                          'peen', 'dick', 'spick', 'nieger', 'die', 'satan', 'n|ig', 'nlg',
                          'cunt', 'c0ck', 'fag', 'lick', 'condom', 'anal', 'shit', 'phile',
                          'little', 'kids', 'free KR', 'tiny', 'sidney', 'ass', 'kill', '.io',
                          '(dot)', '[dot]', 'mini', 'whiore', 'whore', 'faggot', 'github',
                          '1337', '666', 'satan',
                          'senpa', 'discord', 'd1scord', 'mistik', '.io', 'senpa.io', 'sidney', 'sid', 'senpaio', 'vries', 'asa',
                         ];
        langFilter.addWords(...newProfane);

        var mathABS = Math.abs;
        var mathCOS = Math.cos;
        var mathSIN = Math.sin;
        var mathPOW = Math.pow;
        var mathSQRT = Math.sqrt;
        module.exports = function(id, sid, config, UTILS, projectileManager,
                                   objectManager, players, ais, items, hats, accessories, server, scoreCallback, iconCallback) {
            this.id = id;
            this.sid = sid;
            this.tmpScore = 0;
            this.team = null;
            this.skinIndex = 0;
            this.tailIndex = 0;
            this.hitTime = 0;
            this.tails = {};
            for (let i = 0; i < accessories.length; ++i) {
                if (accessories[i].price <= 0) this.tails[accessories[i].id] = 1;
            }
            this.skins = {};
            for (let i = 0; i < hats.length; ++i) {
                if (hats[i].price <= 0) this.skins[hats[i].id] = 1;
            }
            this.points = 0;
            this.dt = 0;
            this.hidden = false;
            this.itemCounts = {};
            this.dist2 = 0;
            this.isPlayer = true;
            this.pps = 0;
            this.moveDir = undefined;
            this.skinRot = 0;
            this.lastPing = 0;
            this.iconIndex = 0;
            this.skinColor = 0;

            // SPAWN:
            this.spawn = function(moofoll) {
                this.weaponVariants = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                this.spikeDamage = 0;

                this.active = true;
                this.alive = true;
                this.lockMove = false;
                this.lockDir = false;
                this.chatCountdown = 0;
                this.shameCount = 0;
                this.shameTimer = 0;
                this.sentTo = {};
                this.gathering = 0;
                this.shooting = {};
                this.autoGather = 0;
                this.animTime = 0;
                this.animSpeed = 0;
                this.mouseState = 0;
                this.buildIndex = -1;
                this.weaponIndex = 0;
                this.weaponVariant = 0;
                this.dmgOverTime = {};
                this.noMovTimer = 0;
                this.maxXP = 300;
                this.XP = 0;
                this.age = 1;
                this.kills = 0;
                this.upgrAge = 2;
                this.upgradePoints = 0;
                this.x = 0;
                this.y = 0;
                this.zIndex = 0;
                this.xVel = 0;
                this.yVel = 0;
                this.slowMult = 1;
                this.dir = 0;
                this.dirPlus = 0;
                this.targetDir = 0;
                this.targetAngle = 0;
                this.maxHealth = 100;
                this.health = this.maxHealth;
                this.scale = config.playerScale;
                this.speed = config.playerSpeed;
                this.resetMoveDir();
                this.resetResources(moofoll);
                this.items = [0, 3, 6, 10];
                this.weapons = [0];
                this.shootCount = 0;
                this.weaponXP = [];
                this.reloads = {
                    [0]: 0,
                    [1]: 0,
                    [2]: 0,
                    [3]: 0,
                    [4]: 0,
                    [5]: 0,
                    [6]: 0,
                    [7]: 0,
                    [8]: 0,
                    [9]: 0,
                    [10]: 0,
                    [11]: 0,
                    [12]: 0,
                    [13]: 0,
                    [14]: 0,
                    [15]: 0,
                    [53]: 0
                };
            };
            this.getItemType = function (id) {
                let findindx = this.items.findIndex(ids => ids == id);
                if (findindx != -1) {
                    return findindx;
                } else {
                    return items.checkItem.index(id, this.items);
                }
            };
            // RESET MOVE DIR:
            this.resetMoveDir = function() {
                this.moveDir = undefined;
            };

            // RESET RESOURCES:
            this.resetResources = function(moofoll) {
                for (var i = 0; i < config.resourceTypes.length; ++i) {
                    this[config.resourceTypes[i]] = moofoll?100:0;
                }
            };

            // ADD ITEM:
            this.addItem = function(id) {
                var tmpItem = items.list[id];
                if (tmpItem) {
                    for (var i = 0; i < this.items.length; ++i) {
                        if (items.list[this.items[i]].group == tmpItem.group) {
                            if (this.buildIndex == this.items[i])
                                this.buildIndex = id;
                            this.items[i] = id;
                            return true;
                        }
                    }
                    this.items.push(id);
                    return true;
                }
                return false;
            };

            // SET USER DATA:
            this.setUserData = function(data) {
                if (data) {
                    // SET INITIAL NAME:
                    this.name = "unknown";

                    // VALIDATE NAME:
                    var name = data.name + "";
                    name = name.slice(0, config.maxNameLength);
                    name = name.replace(/[^\w:\(\)\/? -]+/gmi, " ");  // USE SPACE SO WE CAN CHECK PROFANITY
                    name = name.replace(/[^\x00-\x7F]/g, " ");
                    name = name.trim();

                    // CHECK IF IS PROFANE:
                    var isProfane = false;
                    var convertedName = name.toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
                    for (var word of langFilter.list) {
                        if (convertedName.indexOf(word) != -1) {
                            isProfane = true;
                            break;
                        }
                    }
                    if (name.length > 0 && !isProfane) {
                        this.name = name;
                    }

                    // SKIN:
                    this.skinColor = 0;
                    if (config.skinColors[data.skin])
                        this.skinColor = data.skin;
                }
            };

            // GET DATA TO SEND:
            this.getData = function() {
                return [
                    this.id,
                    this.sid,
                    this.name,
                    UTILS.fixTo(this.x, 2),
                    UTILS.fixTo(this.y, 2),
                    UTILS.fixTo(this.dir, 3),
                    this.health,
                    this.maxHealth,
                    this.scale,
                    this.skinColor
                ];
            };

            // SET DATA:
            this.setData = function(data) {
                this.id = data[0];
                this.sid = data[1];
                this.name = data[2];
                this.x = data[3];
                this.y = data[4];
                this.dir = data[5];
                this.health = data[6];
                this.maxHealth = data[7];
                this.scale = data[8];
                this.skinColor = data[9];
            };

            // UPDATE:
            var timerCount = 0;
            this.findID = function(tmpObj, tmp) {
                return tmpObj.find(THIS => THIS.id == tmp);
            }
            this.update = function(delta) {
                if (!this.alive) return;

                // SHAME SHAME SHAME:
                if (this.shameTimer > 0) {
                    this.shameTimer -= delta;
                    if (this.shameTimer <= 0) {
                        this.shameTimer = 0;
                        this.shameCount = 0;
                    }
                }

                // REGENS AND AUTO:
                timerCount -= delta;
                if (timerCount <= 0) {
                    var regenAmount = (this.skin && this.skin.healthRegen?this.skin.healthRegen:0) +
                        (this.tail && this.tail.healthRegen?this.tail.healthRegen:0);
                    if (regenAmount) {
                        this.changeHealth(regenAmount, this);
                    } if (this.dmgOverTime.dmg) {
                        this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer);
                        this.dmgOverTime.time -= 1;
                        if (this.dmgOverTime.time <= 0)
                            this.dmgOverTime.dmg = 0;
                    } if (this.healCol) {
                        this.changeHealth(this.healCol, this);
                    }
                    timerCount = 1000;
                }

                // CHECK KILL:
                if (!this.alive) return;

                // SLOWER:
                if (this.slowMult < 1) {
                    this.slowMult += 0.0008 * delta;
                    if (this.slowMult > 1) this.slowMult = 1;
                }

                // MOVE:
                this.noMovTimer += delta;
                if (this.xVel || this.yVel) this.noMovTimer = 0;
                if (this.lockMove) {
                    this.xVel = 0;
                    this.yVel = 0;
                } else {
                    let gear = {
                        skin: this.findID(hats, this.skinIndex),
                        tail: this.findID(accessories, this.tailIndex)
                    };
                    let spdMult = (this.buildIndex >= 0 ? 0.5 : 1) * (items.weapons[this.weaponIndex].spdMult || 1) * (gear.skin ? gear.skin.spdMult || 1 : 1) * (gear.tail ? gear.tail.spdMult || 1 : 1) * (this.y <= config.snowBiomeTop ? gear.skin && gear.skin.coldM ? 1 : config.snowSpeed : 1) * this.slowMult;

                    if (!this.zIndex && this.y >= (config.mapScale / 2) - (config.riverWidth / 2) &&
                        this.y <= (config.mapScale / 2) + (config.riverWidth / 2)) {
                        if (this.skin && this.skin.watrImm) {
                            spdMult *= 0.75;
                            this.xVel += config.waterCurrent * 0.4 * delta;
                        } else {
                            spdMult *= 0.33;
                            this.xVel += config.waterCurrent * delta;
                        }
                    }
                    var xVel = (this.moveDir!=undefined)?mathCOS(this.moveDir):0;
                    var yVel = (this.moveDir!=undefined)?mathSIN(this.moveDir):0;
                    var length = mathSQRT(xVel * xVel + yVel * yVel);
                    if (length != 0) {
                        xVel /= length;
                        yVel /= length;
                    }
                    if (xVel) this.xVel += xVel * this.speed * spdMult * delta;
                    if (yVel) this.yVel += yVel * this.speed * spdMult * delta;
                }

                // OBJECT COLL:
                this.zIndex = 0;
                this.lockMove = false;
                this.healCol = 0;
                var tmpList;
                var tmpSpeed = UTILS.getDistance(0, 0, this.xVel * delta, this.yVel * delta);
                var depth = Math.min(4, Math.max(1, Math.round(tmpSpeed / 40)));
                var tMlt = 1 / depth;
                for (var i = 0; i < depth; ++i) {
                    if (this.xVel)
                        this.x += (this.xVel * delta) * tMlt;
                    if (this.yVel)
                        this.y += (this.yVel * delta) * tMlt;
                    tmpList = objectManager.getGridArrays(this.x, this.y, this.scale);
                    for (var x = 0; x < tmpList.length; ++x) {
                        for (var y = 0; y < tmpList[x].length; ++y) {
                            if (tmpList[x][y].active)
                                objectManager.checkCollision(this, tmpList[x][y], tMlt);
                        }
                    }
                }

                // PLAYER COLLISIONS:
                var tmpIndx = players.indexOf(this);
                for (var i = tmpIndx + 1; i < players.length; ++i) {
                    if (players[i] != this && players[i].alive)
                        objectManager.checkCollision(this, players[i]);
                }

                // DECEL:
                if (this.xVel) {
                    this.xVel *= mathPOW(config.playerDecel, delta);
                    if (this.xVel <= 0.01 && this.xVel >= -0.01) this.xVel = 0;
                } if (this.yVel) {
                    this.yVel *= mathPOW(config.playerDecel, delta);
                    if (this.yVel <= 0.01 && this.yVel >= -0.01) this.yVel = 0;
                }

                // MAP BOUNDARIES:
                if (this.x - this.scale < 0) {
                    this.x = this.scale;
                } else if (this.x + this.scale > config.mapScale) {
                    this.x = config.mapScale - this.scale;
                } if (this.y - this.scale < 0) {
                    this.y = this.scale;
                } else if (this.y + this.scale > config.mapScale) {
                    this.y = config.mapScale - this.scale;
                }

                // USE WEAPON OR TOOL:
                if (this.buildIndex < 0) {
                    if (this.reloads[this.weaponIndex] > 0) {
                        this.reloads[this.weaponIndex] -= delta;
                        this.gathering = this.mouseState;
                    } else if (this.gathering || this.autoGather) {
                        var worked = true;
                        if (items.weapons[this.weaponIndex].gather != undefined) {
                            this.gather(players);
                        } else if (items.weapons[this.weaponIndex].projectile != undefined &&
                                   this.hasRes(items.weapons[this.weaponIndex], (this.skin?this.skin.projCost:0))) {
                            this.useRes(items.weapons[this.weaponIndex], (this.skin?this.skin.projCost:0));
                            this.noMovTimer = 0;
                            var tmpIndx = items.weapons[this.weaponIndex].projectile;
                            var projOffset = this.scale * 2;
                            var aMlt = (this.skin&&this.skin.aMlt)?this.skin.aMlt:1;
                            if (items.weapons[this.weaponIndex].rec) {
                                this.xVel -= items.weapons[this.weaponIndex].rec * mathCOS(this.dir);
                                this.yVel -= items.weapons[this.weaponIndex].rec * mathSIN(this.dir);
                            }
                            projectileManager.addProjectile(this.x+(projOffset*mathCOS(this.dir)),
                                                            this.y+(projOffset*mathSIN(this.dir)), this.dir, items.projectiles[tmpIndx].range*aMlt,
                                                            items.projectiles[tmpIndx].speed*aMlt, tmpIndx, this, null, this.zIndex);
                        } else {
                            worked = false;
                        }
                        this.gathering = this.mouseState;
                        if (worked) {
                            this.reloads[this.weaponIndex] = items.weapons[this.weaponIndex].speed*(this.skin?(this.skin.atkSpd||1):1);
                        }
                    }
                }

            };

            // ADD WEAPON XP:
            this.addWeaponXP = function(amnt) {
                if (!this.weaponXP[this.weaponIndex])
                    this.weaponXP[this.weaponIndex] = 0;
                this.weaponXP[this.weaponIndex] += amnt;
            };

            // EARN XP:
            this.earnXP = function(amount) {
                if (this.age < config.maxAge) {
                    this.XP += amount;
                    if (this.XP >= this.maxXP) {
                        if (this.age < config.maxAge) {
                            this.age++;
                            this.XP = 0;
                            this.maxXP *= 1.2;
                        } else {
                            this.XP = this.maxXP;
                        }
                        this.upgradePoints++;
                        server.send(this.id, "U", this.upgradePoints, this.upgrAge);
                        server.send(this.id, "T", this.XP, UTILS.fixTo(this.maxXP, 1), this.age);
                    } else {
                        server.send(this.id, "T", this.XP);
                    }
                }
            };

            // CHANGE HEALTH:
            this.changeHealth = function(amount, doer) {
                if (amount > 0 && this.health >= this.maxHealth)
                    return false
                if (amount < 0 && this.skin)
                    amount *= this.skin.dmgMult||1;
                if (amount < 0 && this.tail)
                    amount *= this.tail.dmgMult||1;
                if (amount < 0)
                    this.hitTime = Date.now();
                this.health += amount;
                if (this.health > this.maxHealth) {
                    amount -= (this.health - this.maxHealth);
                    this.health = this.maxHealth;
                }
                if (this.health <= 0)
                    this.kill(doer);
                for (var i = 0; i < players.length; ++i) {
                    if (this.sentTo[players[i].id])
                        server.send(players[i].id, "O", this.sid, Math.round(this.health));
                }
                if (doer && doer.canSee(this) && !(doer == this && amount < 0)) {
                    server.send(doer.id, "8", Math.round(this.x),
                                Math.round(this.y), Math.round(-amount), 1);
                }
                return true;
            };

            // KILL:
            this.kill = function(doer) {
                if (doer && doer.alive) {
                    doer.kills++;
                    if (doer.skin && doer.skin.goldSteal) scoreCallback(doer, Math.round(this.points / 2));
                    else scoreCallback(doer, Math.round(this.age*100*((doer.skin&&doer.skin.kScrM)?doer.skin.kScrM:1)));
                    server.send(doer.id, "N", "kills", doer.kills, 1);
                }
                this.alive = false;
                server.send(this.id, "P");
                iconCallback();
            };

            // ADD RESOURCE:
            this.addResource = function(type, amount, auto) {
                if (!auto && amount > 0)
                    this.addWeaponXP(amount);
                if (type == 3) {
                    scoreCallback(this, amount, true);
                } else {
                    this[config.resourceTypes[type]] += amount;
                    server.send(this.id, "N", config.resourceTypes[type], this[config.resourceTypes[type]], 1);
                }
            };

            // CHANGE ITEM COUNT:
            this.changeItemCount = function(index, value) {
                this.itemCounts[index] = this.itemCounts[index]||0;
                this.itemCounts[index] += value;
                server.send(this.id, "S", index, this.itemCounts[index]);
            };

            // BUILD:
            this.buildItem = function(item) {
                var tmpS = (this.scale + item.scale + (item.placeOffset||0));
                var tmpX = this.x + (tmpS * mathCOS(this.dir));
                var tmpY = this.y + (tmpS * mathSIN(this.dir));
                if (this.canBuild(item) && !(item.consume && (this.skin && this.skin.noEat))
                    && (item.consume || objectManager.checkItemLocation(tmpX, tmpY, item.scale,
                                                                        0.6, item.id, false, this))) {
                    var worked = false;
                    if (item.consume) {
                        if (this.hitTime) {
                            var timeSinceHit = Date.now() - this.hitTime;
                            this.hitTime = 0;
                            if (timeSinceHit <= 120) {
                                this.shameCount++;
                                if (this.shameCount >= 8) {
                                    this.shameTimer = 30000;
                                    this.shameCount = 0;
                                }
                            } else {
                                this.shameCount -= 2;
                                if (this.shameCount <= 0) {
                                    this.shameCount = 0;
                                }
                            }
                        }
                        if (this.shameTimer <= 0)
                            worked = item.consume(this);
                    } else {
                        worked = true;
                        if (item.group.limit) {
                            this.changeItemCount(item.group.id, 1);
                        }
                        if (item.pps)
                            this.pps += item.pps;
                        objectManager.add(objectManager.objects.length, tmpX, tmpY, this.dir, item.scale,
                                          item.type, item, false, this);
                    }
                    if (worked) {
                        this.useRes(item);
                        this.buildIndex = -1;
                    }
                }
            };

            // HAS RESOURCES:
            this.hasRes = function(item, mult) {
                for (var i = 0; i < item.req.length;) {
                    if (this[item.req[i]] < Math.round(item.req[i + 1] * (mult||1)))
                        return false;
                    i+=2;
                }
                return true;
            };

            // USE RESOURCES:
            this.useRes = function(item, mult) {
                if (config.inSandbox)
                    return;
                for (var i = 0; i < item.req.length;) {
                    this.addResource(config.resourceTypes.indexOf(item.req[i]), -Math.round(item.req[i+1]*(mult||1)));
                    i+=2;
                }
            };

            // CAN BUILD:
            this.canBuild = function(item) {
                if (config.inSandbox)
                    return true;
                if (item.group.limit && this.itemCounts[item.group.id] >= item.group.limit)
                    return false;
                return this.hasRes(item);
            };

            // GATHER:
            this.gather = function() {

                // SHOW:
                this.noMovTimer = 0;

                // SLOW MOVEMENT:
                this.slowMult -= (items.weapons[this.weaponIndex].hitSlow||0.3);
                if (this.slowMult < 0)
                    this.slowMult = 0;

                // VARIANT DMG:
                var tmpVariant = config.fetchVariant(this);
                var applyPoison = tmpVariant.poison;
                var variantDmg = tmpVariant.val;

                // CHECK IF HIT GAME OBJECT:
                var hitObjs = {};
                var tmpDist, tmpDir, tmpObj, hitSomething;
                var tmpList = objectManager.getGridArrays(this.x, this.y, items.weapons[this.weaponIndex].range);
                for (var t = 0; t < tmpList.length; ++t) {
                    for (var i = 0; i < tmpList[t].length; ++i) {
                        tmpObj = tmpList[t][i];
                        if (tmpObj.active && !tmpObj.dontGather && !hitObjs[tmpObj.sid] && tmpObj.visibleToPlayer(this)) {
                            tmpDist = UTILS.getDistance(this.x, this.y, tmpObj.x, tmpObj.y) - tmpObj.scale;
                            if (tmpDist <= items.weapons[this.weaponIndex].range) {
                                tmpDir = UTILS.getDirection(tmpObj.x, tmpObj.y, this.x, this.y);
                                if (UTILS.getAngleDist(tmpDir, this.dir) <= config.gatherAngle) {
                                    hitObjs[tmpObj.sid] = 1;
                                    if (tmpObj.health) {
                                        if (tmpObj.changeHealth(-items.weapons[this.weaponIndex].dmg*(variantDmg)*
                                                                (items.weapons[this.weaponIndex].sDmg||1)*(this.skin&&this.skin.bDmg?this.skin.bDmg:1), this)) {
                                            for (var x = 0; x < tmpObj.req.length;) {
                                                this.addResource(config.resourceTypes.indexOf(tmpObj.req[x]), tmpObj.req[x+1]);
                                                x+=2;
                                            }
                                            objectManager.disableObj(tmpObj);
                                        }
                                    } else {
                                        this.earnXP(4*items.weapons[this.weaponIndex].gather);
                                        var count = items.weapons[this.weaponIndex].gather+(tmpObj.type==3?4:0);
                                        if (this.skin && this.skin.extraGold) {
                                            this.addResource(3, 1);
                                        } this.addResource(tmpObj.type, count);
                                    }
                                    hitSomething = true;
                                    objectManager.hitObj(tmpObj, tmpDir);
                                }
                            }
                        }
                    }
                }

                // CHECK IF HIT PLAYER:
                for (var i = 0; i < players.length + ais.length; ++i) {
                    tmpObj = players[i]||ais[i-players.length];
                    if (tmpObj != this && tmpObj.alive && !(tmpObj.team && tmpObj.team == this.team)) {
                        tmpDist = UTILS.getDistance(this.x, this.y, tmpObj.x, tmpObj.y) - (tmpObj.scale * 1.8);
                        if (tmpDist <= items.weapons[this.weaponIndex].range) {
                            tmpDir = UTILS.getDirection(tmpObj.x, tmpObj.y, this.x, this.y);
                            if (UTILS.getAngleDist(tmpDir, this.dir) <= config.gatherAngle) {

                                // STEAL RESOURCES:
                                var stealCount = items.weapons[this.weaponIndex].steal;
                                if (stealCount && tmpObj.addResource) {
                                    stealCount = Math.min((tmpObj.points||0), stealCount);
                                    this.addResource(3, stealCount);
                                    tmpObj.addResource(3, -stealCount);
                                }

                                // MELEE HIT PLAYER:
                                var dmgMlt = variantDmg;
                                if (tmpObj.weaponIndex != undefined && items.weapons[tmpObj.weaponIndex].shield &&
                                    UTILS.getAngleDist(tmpDir+Math.PI, tmpObj.dir) <= config.shieldAngle) {
                                    dmgMlt = items.weapons[tmpObj.weaponIndex].shield;
                                }
                                var dmgVal = items.weapons[this.weaponIndex].dmg *
                                    (this.skin && this.skin.dmgMultO?this.skin.dmgMultO:1) *
                                    (this.tail && this.tail.dmgMultO?this.tail.dmgMultO:1);
                                var tmpSpd = (0.3 * (tmpObj.weightM||1)) + (items.weapons[this.weaponIndex].knock||0);
                                tmpObj.xVel += tmpSpd * mathCOS(tmpDir);
                                tmpObj.yVel += tmpSpd * mathSIN(tmpDir);
                                if (this.skin && this.skin.healD)
                                    this.changeHealth(dmgVal * dmgMlt * this.skin.healD, this);
                                if (this.tail && this.tail.healD)
                                    this.changeHealth(dmgVal * dmgMlt * this.tail.healD, this);
                                if (tmpObj.skin && tmpObj.skin.dmg && dmgMlt == 1)
                                    this.changeHealth(-dmgVal * tmpObj.skin.dmg, tmpObj);
                                if (tmpObj.tail && tmpObj.tail.dmg && dmgMlt == 1)
                                    this.changeHealth(-dmgVal * tmpObj.tail.dmg, tmpObj);
                                if (tmpObj.dmgOverTime && this.skin && this.skin.poisonDmg &&
                                    !(tmpObj.skin && tmpObj.skin.poisonRes)) {
                                    tmpObj.dmgOverTime.dmg = this.skin.poisonDmg;
                                    tmpObj.dmgOverTime.time = this.skin.poisonTime||1;
                                    tmpObj.dmgOverTime.doer = this;
                                } if (tmpObj.dmgOverTime && applyPoison &&
                                      !(tmpObj.skin && tmpObj.skin.poisonRes)) {
                                    tmpObj.dmgOverTime.dmg = 5;
                                    tmpObj.dmgOverTime.time = 5;
                                    tmpObj.dmgOverTime.doer = this;
                                } if (tmpObj.skin && tmpObj.skin.dmgK) {
                                    this.xVel -= tmpObj.skin.dmgK * mathCOS(tmpDir);
                                    this.yVel -= tmpObj.skin.dmgK * mathSIN(tmpDir);
                                } tmpObj.changeHealth(-dmgVal * dmgMlt, this, this);

                            }
                        }
                    }
                }

                // SEND FOR ANIMATION:
                this.sendAnimation(hitSomething?1:0);
            };

            // SEND ANIMATION:
            this.sendAnimation = function(hit) {
                for (var i = 0; i < players.length; ++i) {
                    if (this.sentTo[players[i].id] && this.canSee(players[i])) {
                        server.send(players[i].id, "K", this.sid, hit?1:0, this.weaponIndex);
                    }
                }
            };

            // ANIMATE:
            var tmpRatio = 0;
            var animIndex = 0;
            this.animate = function(delta) {
                if (this.animTime > 0) {
                    this.animTime -= delta;
                    if (this.animTime <= 0) {
                        this.animTime = 0;
                        this.dirPlus = 0;
                        tmpRatio = 0;
                        animIndex = 0;
                    } else {
                        if (animIndex == 0) {
                            tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                            this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                            if (tmpRatio >= 1) {
                                tmpRatio = 1;
                                animIndex = 1;
                            }
                        } else {
                            tmpRatio -= delta / (this.animSpeed * (1-config.hitReturnRatio));
                            this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                        }
                    }
                }
            };

            // GATHER ANIMATION:
            this.startAnim = function(didHit, index) {
                this.animTime = this.animSpeed = items.weapons[index].speed;
                this.targetAngle = (didHit?-config.hitAngle:-Math.PI);
                tmpRatio = 0;
                animIndex = 0;
            };

            // CAN SEE:
            this.canSee = function(other) {
                if (!other) return false;
                if (other.skin && other.skin.invisTimer && other.noMovTimer
                    >= other.skin.invisTimer) return false;
                var dx = mathABS(other.x - this.x) - other.scale;
                var dy = mathABS(other.y - this.y) - other.scale;
                return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3;
            };

        };


        /***/ }),

    /***/ "./src/js/data/projectile.js":
    /*!***********************************!*\
  !*** ./src/js/data/projectile.js ***!
  \***********************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        module.exports = function (players, ais, objectManager, items, config, UTILS, server) {

            // INIT:
            this.init = function(indx, x, y, dir, spd, dmg, rng, scl, owner) {
                this.active = true;
                this.indx = indx;
                this.x = x;
                this.y = y;
                this.dir = dir;
                this.skipMov = true;
                this.speed = spd;
                this.dmg = dmg;
                this.scale = scl;
                this.range = rng;
                this.owner = owner;
                if (server)
                    this.sentTo = {};
            };

            // UPDATE:
            var objectsHit = [];
            var tmpObj;
            this.update = function(delta) {
                if (this.active) {
                    var tmpSpeed = this.speed * delta;
                    var tmpScale;
                    if (!this.skipMov) {
                        this.x += tmpSpeed * Math.cos(this.dir);
                        this.y += tmpSpeed * Math.sin(this.dir);
                        this.range -= tmpSpeed;
                        if (this.range <= 0) {
                            this.x += this.range * Math.cos(this.dir);
                            this.y += this.range * Math.sin(this.dir);
                            tmpSpeed = 1;
                            this.range = 0;
                            this.active = false;
                        }
                    } else {
                        this.skipMov = false;
                    }
                    if (server) {
                        for (var i = 0; i < players.length; ++i) {
                            if (!this.sentTo[players[i].id] && players[i].canSee(this)) {
                                this.sentTo[players[i].id] = 1;
                                server.send(players[i].id, "X", UTILS.fixTo(this.x, 1), UTILS.fixTo(this.y, 1),
                                            UTILS.fixTo(this.dir, 2), UTILS.fixTo(this.range, 1), this.speed, this.indx, this.layer, this.sid);
                            }
                        }
                        objectsHit.length = 0;
                        for (var i = 0; i < players.length + ais.length; ++i) {
                            tmpObj = players[i]||ais[i-players.length];
                            if (tmpObj.alive && tmpObj != this.owner && !(this.owner.team && tmpObj.team == this.owner.team)) {
                                if (UTILS.lineInRect(tmpObj.x-tmpObj.scale, tmpObj.y-tmpObj.scale, tmpObj.x+tmpObj.scale,
                                                     tmpObj.y+tmpObj.scale, this.x, this.y, this.x+(tmpSpeed*Math.cos(this.dir)),
                                                     this.y+(tmpSpeed*Math.sin(this.dir)))) {
                                    objectsHit.push(tmpObj);
                                }
                            }
                        }
                        var tmpList = objectManager.getGridArrays(this.x, this.y, this.scale);
                        for (var x = 0; x < tmpList.length; ++x) {
                            for (var y = 0; y < tmpList[x].length; ++y) {
                                tmpObj = tmpList[x][y];
                                tmpScale = tmpObj.getScale();
                                if (tmpObj.active && !(this.ignoreObj == tmpObj.sid) && (this.layer <= tmpObj.layer) &&
                                    objectsHit.indexOf(tmpObj) < 0 && !tmpObj.ignoreCollision && UTILS.lineInRect(tmpObj.x-tmpScale, tmpObj.y-tmpScale, tmpObj.x+tmpScale, tmpObj.y+tmpScale,
                                                                                                                  this.x, this.y, this.x+(tmpSpeed*Math.cos(this.dir)), this.y+(tmpSpeed*Math.sin(this.dir)))) {
                                    objectsHit.push(tmpObj);
                                }
                            }
                        }

                        // HIT OBJECTS:
                        if (objectsHit.length > 0) {
                            var hitObj = null;
                            var shortDist = null;
                            var tmpDist = null;
                            for (var i = 0; i < objectsHit.length; ++i) {
                                tmpDist = UTILS.getDistance(this.x, this.y, objectsHit[i].x, objectsHit[i].y);
                                if (shortDist == null || tmpDist < shortDist) {
                                    shortDist = tmpDist;
                                    hitObj = objectsHit[i];
                                }
                            }
                            if (hitObj.isPlayer || hitObj.isAI) {
                                var tmpSd = 0.3 * (hitObj.weightM||1);
                                hitObj.xVel += tmpSd * Math.cos(this.dir);
                                hitObj.yVel += tmpSd * Math.sin(this.dir);
                                if (hitObj.weaponIndex == undefined || (!(items.weapons[hitObj.weaponIndex].shield &&
                                                                          UTILS.getAngleDist(this.dir+Math.PI, hitObj.dir) <= config.shieldAngle))) {
                                    hitObj.changeHealth(-this.dmg, this.owner, this.owner);
                                }
                            } else {
                                if (hitObj.projDmg && hitObj.health && hitObj.changeHealth(-this.dmg)) {
                                    objectManager.disableObj(hitObj);
                                }
                                for (var i = 0; i < players.length; ++i) {
                                    if (players[i].active) {
                                        if (hitObj.sentTo[players[i].id]) {
                                            if (hitObj.active) {
                                                if (players[i].canSee(hitObj))
                                                    server.send(players[i].id, "L", UTILS.fixTo(this.dir, 2), hitObj.sid);
                                            } else {
                                                server.send(players[i].id, "Q", hitObj.sid);
                                            }
                                        }
                                        if (!hitObj.active && hitObj.owner == players[i])
                                            players[i].changeItemCount(hitObj.group.id, -1);
                                    }

                                }
                            }
                            this.active = false;
                            for (var i = 0; i < players.length; ++i) {
                                if (this.sentTo[players[i].id])
                                    server.send(players[i].id, "Y", this.sid, UTILS.fixTo(shortDist, 1));
                            }
                        }
                    }
                }
            };
        };


        /***/ }),

    /***/ "./src/js/data/projectileManager.js":
    /*!******************************************!*\
  !*** ./src/js/data/projectileManager.js ***!
  \******************************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        module.exports = function (Projectile, projectiles, players, ais, objectManager, items, config, UTILS, server) {
            this.addProjectile = function(x, y, dir, range, speed, indx, owner, ignoreObj, layer) {
                var tmpData = items.projectiles[indx];
                var tmpProj;
                for (var i = 0; i < projectiles.length; ++i) {
                    if (!projectiles[i].active) {
                        tmpProj = projectiles[i];
                        break;
                    }
                } if (!tmpProj) {
                    tmpProj = new Projectile(players, ais, objectManager, items, config, UTILS, server);
                    tmpProj.sid = projectiles.length;
                    projectiles.push(tmpProj);
                }
                tmpProj.init(indx, x, y, dir, speed, tmpData.dmg, range, tmpData.scale, owner);
                tmpProj.ignoreObj = ignoreObj;
                tmpProj.layer = layer||tmpData.layer;
                tmpProj.src = tmpData.src;
                return tmpProj;
            };
        };


        /***/ }),

    /***/ "./src/js/data/store.js":
    /*!******************************!*\
  !*** ./src/js/data/store.js ***!
  \******************************/
    /*! no static exports found */
    /***/ (function(module, exports) {


        // STORE HATS:
        module.exports.hats = [{
            id: 45,
            name: "Shame!",
            dontSell: true,
            price: 0,
            scale: 120,
            desc: "hacks are for losers"
        }, {
            id: 51,
            name: "Moo Cap",
            price: 0,
            scale: 120,
            desc: "coolest mooer around"
        }, {
            id: 50,
            name: "Apple Cap",
            price: 0,
            scale: 120,
            desc: "apple farms remembers"
        }, {
            id: 28,
            name: "Moo Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 29,
            name: "Pig Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 30,
            name: "Fluff Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 36,
            name: "Pandou Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 37,
            name: "Bear Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 38,
            name: "Monkey Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 44,
            name: "Polar Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 35,
            name: "Fez Hat",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 42,
            name: "Enigma Hat",
            price: 0,
            scale: 120,
            desc: "join the enigma army"
        }, {
            id: 43,
            name: "Blitz Hat",
            price: 0,
            scale: 120,
            desc: "hey everybody i'm blitz"
        }, {
            id: 49,
            name: "Bob XIII Hat",
            price: 0,
            scale: 120,
            desc: "like and subscribe"
        }, {
            id: 57,
            name: "Pumpkin",
            price: 50,
            scale: 120,
            desc: "Spooooky"
        }, {
            id: 8,
            name: "Bummle Hat",
            price: 100,
            scale: 120,
            desc: "no effect"
        }, {
            id: 2,
            name: "Straw Hat",
            price: 500,
            scale: 120,
            desc: "no effect"
        }, {
            id: 15,
            name: "Winter Cap",
            price: 600,
            scale: 120,
            desc: "allows you to move at normal speed in snow",
            coldM: 1
        }, {
            id: 5,
            name: "Cowboy Hat",
            price: 1000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 4,
            name: "Ranger Hat",
            price: 2000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 18,
            name: "Explorer Hat",
            price: 2000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 31,
            name: "Flipper Hat",
            price: 2500,
            scale: 120,
            desc: "have more control while in water",
            watrImm: true
        }, {
            id: 1,
            name: "Marksman Cap",
            price: 3000,
            scale: 120,
            desc: "increases arrow speed and range",
            aMlt: 1.3
        }, {
            id: 10,
            name: "Bush Gear",
            price: 3000,
            scale: 160,
            desc: "allows you to disguise yourself as a bush"
        }, {
            id: 48,
            name: "Halo",
            price: 3000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 6,
            name: "Soldier Helmet",
            price: 4000,
            scale: 120,
            desc: "reduces damage taken but slows movement",
            spdMult: 0.94,
            dmgMult: 0.75
        }, {
            id: 23,
            name: "Anti Venom Gear",
            price: 4000,
            scale: 120,
            desc: "makes you immune to poison",
            poisonRes: 1
        }, {
            id: 13,
            name: "Medic Gear",
            price: 5000,
            scale: 110,
            desc: "slowly regenerates health over time",
            healthRegen: 3
        }, {
            id: 9,
            name: "Miners Helmet",
            price: 5000,
            scale: 120,
            desc: "earn 1 extra gold per resource",
            extraGold: 1
        }, {
            id: 32,
            name: "Musketeer Hat",
            price: 5000,
            scale: 120,
            desc: "reduces cost of projectiles",
            projCost: 0.5
        }, {
            id: 7,
            name: "Bull Helmet",
            price: 6000,
            scale: 120,
            desc: "increases damage done but drains health",
            healthRegen: -5,
            dmgMultO: 1.5,
            spdMult: 0.96
        }, {
            id: 22,
            name: "Emp Helmet",
            price: 6000,
            scale: 120,
            desc: "turrets won't attack but you move slower",
            antiTurret: 1,
            spdMult: 0.7
        }, {
            id: 12,
            name: "Booster Hat",
            price: 6000,
            scale: 120,
            desc: "increases your movement speed",
            spdMult: 1.16
        }, {
            id: 26,
            name: "Barbarian Armor",
            price: 8000,
            scale: 120,
            desc: "knocks back enemies that attack you",
            dmgK: 0.6
        }, {
            id: 21,
            name: "Plague Mask",
            price: 10000,
            scale: 120,
            desc: "melee attacks deal poison damage",
            poisonDmg: 5,
            poisonTime: 6
        }, {
            id: 46,
            name: "Bull Mask",
            price: 10000,
            scale: 120,
            desc: "bulls won't target you unless you attack them",
            bullRepel: 1
        }, {
            id: 14,
            name: "Windmill Hat",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "generates points while worn",
            pps: 1.5
        }, {
            id: 11,
            name: "Spike Gear",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "deal damage to players that damage you",
            dmg: 0.45
        }, {
            id: 53,
            name: "Turret Gear",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "you become a walking turret",
            turret: {
                proj: 1,
                range: 700,
                rate: 2500
            },
            spdMult: 0.7
        }, {
            id: 20,
            name: "Samurai Armor",
            price: 12000,
            scale: 120,
            desc: "increased attack speed and fire rate",
            atkSpd: 0.78
        }, {
            id: 58,
            name: "Dark Knight",
            price: 12000,
            scale: 120,
            desc: "restores health when you deal damage",
            healD: 0.4
        }, {
            id: 27,
            name: "Scavenger Gear",
            price: 15000,
            scale: 120,
            desc: "earn double points for each kill",
            kScrM: 2
        }, {
            id: 40,
            name: "Tank Gear",
            price: 15000,
            scale: 120,
            desc: "increased damage to buildings but slower movement",
            spdMult: 0.3,
            bDmg: 3.3
        }, {
            id: 52,
            name: "Thief Gear",
            price: 15000,
            scale: 120,
            desc: "steal half of a players gold when you kill them",
            goldSteal: 0.5
        }, {
            id: 55,
            name: "Bloodthirster",
            price: 20000,
            scale: 120,
            desc: "Restore Health when dealing damage. And increased damage",
            healD: 0.25,
            dmgMultO: 1.2,
        }, {
            id: 56,
            name: "Assassin Gear",
            price: 20000,
            scale: 120,
            desc: "Go invisible when not moving. Can't eat. Increased speed",
            noEat: true,
            spdMult: 1.1,
            invisTimer: 1000
        }];

        // STORE ACCESSORIES:
        module.exports.accessories = [{
            id: 12,
            name: "Snowball",
            price: 1000,
            scale: 105,
            xOff: 18,
            desc: "no effect"
        }, {
            id: 9,
            name: "Tree Cape",
            price: 1000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 10,
            name: "Stone Cape",
            price: 1000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 3,
            name: "Cookie Cape",
            price: 1500,
            scale: 90,
            desc: "no effect"
        }, {
            id: 8,
            name: "Cow Cape",
            price: 2000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 11,
            name: "Monkey Tail",
            price: 2000,
            scale: 97,
            xOff: 25,
            desc: "Super speed but reduced damage",
            spdMult: 1.35,
            dmgMultO: 0.2
        }, {
            id: 17,
            name: "Apple Basket",
            price: 3000,
            scale: 80,
            xOff: 12,
            desc: "slowly regenerates health over time",
            healthRegen: 1
        }, {
            id: 6,
            name: "Winter Cape",
            price: 3000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 4,
            name: "Skull Cape",
            price: 4000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 5,
            name: "Dash Cape",
            price: 5000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 2,
            name: "Dragon Cape",
            price: 6000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 1,
            name: "Super Cape",
            price: 8000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 7,
            name: "Troll Cape",
            price: 8000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 14,
            name: "Thorns",
            price: 10000,
            scale: 115,
            xOff: 20,
            desc: "no effect"
        }, {
            id: 15,
            name: "Blockades",
            price: 10000,
            scale: 95,
            xOff: 15,
            desc: "no effect"
        }, {
            id: 20,
            name: "Devils Tail",
            price: 10000,
            scale: 95,
            xOff: 20,
            desc: "no effect"
        }, {
            id: 16,
            name: "Sawblade",
            price: 12000,
            scale: 90,
            spin: true,
            xOff: 0,
            desc: "deal damage to players that damage you",
            dmg: 0.15
        }, {
            id: 13,
            name: "Angel Wings",
            price: 15000,
            scale: 138,
            xOff: 22,
            desc: "slowly regenerates health over time",
            healthRegen: 3
        }, {
            id: 19,
            name: "Shadow Wings",
            price: 15000,
            scale: 138,
            xOff: 22,
            desc: "increased movement speed",
            spdMult: 1.1
        }, {
            id: 18,
            name: "Blood Wings",
            price: 20000,
            scale: 178,
            xOff: 26,
            desc: "restores health when you deal damage",
            healD: 0.2
        }, {
            id: 21,
            name: "Corrupt X Wings",
            price: 20000,
            scale: 178,
            xOff: 26,
            desc: "deal damage to players that damage you",
            dmg: 0.25
        }];


        /***/ }),

    /***/ "./src/js/libs/animText.js":
    /*!*********************************!*\
  !*** ./src/js/libs/animText.js ***!
  \*********************************/
    /*! no static exports found */
    /***/ (function(module, exports) {


        // ANIMATED TEXT:
        module.exports.AnimText = function() {

            // INIT:
            this.init = function(x, y, scale, speed, life, text, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.scale = scale;
                this.startScale = this.scale;
                this.maxScale = scale * 1.5;
                this.scaleSpeed = 0.7;
                this.speed = speed;
                this.life = life;
                this.text = text;
            };

            // UPDATE:
            this.update = function(delta) {
                if (this.life) {
                    this.life -= delta;
                    this.y -= this.speed * delta;
                    this.scale += this.scaleSpeed * delta;
                    if (this.scale >= this.maxScale) {
                        this.scale = this.maxScale;
                        this.scaleSpeed *= -1;
                    } else if (this.scale <= this.startScale) {
                        this.scale = this.startScale;
                        this.scaleSpeed = 0;
                    }
                    if (this.life <= 0) {
                        this.life = 0;
                    }
                }
            };

            // RENDER:
            this.render = function(ctxt, xOff, yOff) {
                ctxt.fillStyle = this.color;
                ctxt.font = this.scale + "px Hammersmith One";
                ctxt.fillText(this.text, this.x - xOff, this.y - yOff);
            };

        }

        // TEXT MANAGER:
        module.exports.TextManager = function() {
            this.texts = [];

            // UPDATE:
            this.update = function(delta, ctxt, xOff, yOff) {
                ctxt.textBaseline = "middle";
                ctxt.textAlign = "center";
                for (var i = 0; i < this.texts.length; ++i) {
                    if (this.texts[i].life) {
                        this.texts[i].update(delta);
                        this.texts[i].render(ctxt, xOff, yOff);
                    }
                }
            };

            // SHOW TEXT:
            this.showText = function(x, y, scale, speed, life, text, color) {
                var tmpText;
                for (var i = 0; i < this.texts.length; ++i) {
                    if (!this.texts[i].life) {
                        tmpText = this.texts[i];
                        break;
                    }
                }
                if (!tmpText) {
                    tmpText = new module.exports.AnimText();
                    this.texts.push(tmpText);
                }
                tmpText.init(x, y, scale, speed, life, text, color);
            };
        }


        /***/ }),

    /***/ "./src/js/libs/io-client.js":
    /*!**********************************!*\
  !*** ./src/js/libs/io-client.js ***!
  \**********************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

        var msgpack = __webpack_require__(/*! msgpack-lite */ "./node_modules/msgpack-lite/lib/browser.js");
        var config = __webpack_require__(/*! ../config */ "./src/js/config.js");

        module.exports = {
            socket: null,
            connected: false,
            socketId: -1,
            connect: function(address, callback, events) {
                if (this.socket) return;

                // CREATE SOCKET:
                var _this = this;
                try {
                    var socketError = false;
                    var socketAddress = address;
                    this.socket = new OriginalWebSocket(socketAddress);
                    this.socket.binaryType = "arraybuffer";
                    this.socket.onmessage = function(message) {

                        // PARSE MESSAGE:
                        var data = new Uint8Array(message.data);
                        var parsed = msgpack.decode(data);
                        var type = parsed[0];
                        var data = parsed[1];

                        // CALL EVENT:
                        if (type == "io-init") {
                            _this.socketId = data[0];
                        } else {
                            events[type].apply(undefined, data);
                        }
                    };
                    this.socket.onopen = function() {
                        _this.connected = true;
                        callback();
                    };
                    this.socket.onclose = function(event) {
                        _this.connected = false;
                        if (event.code == 4001) {
                            callback("Invalid Connection");
                        } else if (!socketError) {
                            callback("disconnected");
                        }
                    };
                    this.socket.onerror = function(error) {
                        if (this.socket && this.socket.readyState != WebSocket.OPEN) {
                            socketError = true;
                            console.error("Socket error", arguments);
                            callback("Socket error");
                        }
                    };

                    console.log(this.socket);
                } catch(e) {
                    console.warn("Socket connection error:", e);
                    callback(e);
                }
            },
            send: function(type) {
                var data = Array.prototype.slice.call(arguments, 1);
                var binary = msgpack.encode([type, data]);

                packets++;
                if(packetInterval === undefined){
                    packetInterval = setInterval(function(){
                        pps = packets;
                        packets = 0;
                    }, 1000);
                }

                this.socket.send(binary);
            },
            socketReady: function() {
                return (this.socket && this.connected);
            },
            close: function() {
                this.socket && this.socket.close();
            }
        };


        /***/ }),

    /***/ "./src/js/libs/modernizr.js":
    /*!**********************************!*\
  !*** ./src/js/libs/modernizr.js ***!
  \**********************************/
    /*! no static exports found */
    /***/ (function(module, exports) {

        !function(e,n,s){function o(e,n){return typeof e===n}function a(){var e,n,s,a,t,f,l;for(var c in r)if(r.hasOwnProperty(c)){if(e=[],n=r[c],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(s=0;s<n.options.aliases.length;s++)e.push(n.options.aliases[s].toLowerCase());for(a=o(n.fn,"function")?n.fn():n.fn,t=0;t<e.length;t++)f=e[t],l=f.split("."),1===l.length?Modernizr[l[0]]=a:(!Modernizr[l[0]]||Modernizr[l[0]]instanceof Boolean||(Modernizr[l[0]]=new Boolean(Modernizr[l[0]])),Modernizr[l[0]][l[1]]=a),i.push((a?"":"no-")+l.join("-"))}}function t(e){var n=l.className,s=Modernizr._config.classPrefix||"";if(c&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+s+"no-js(\\s|$)");n=n.replace(o,"$1"+s+"js$2")}Modernizr._config.enableClasses&&(n+=" "+s+e.join(" "+s),c?l.className.baseVal=n:l.className=n)}var i=[],r=[],f={_version:"3.5.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var s=this;setTimeout(function(){n(s[e])},0)},addTest:function(e,n,s){r.push({name:e,fn:n,options:s})},addAsyncTest:function(e){r.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=f,Modernizr=new Modernizr;var l=n.documentElement,c="svg"===l.nodeName.toLowerCase();Modernizr.addTest("passiveeventlisteners",function(){var n=!1;try{var s=Object.defineProperty({},"passive",{get:function(){n=!0}});e.addEventListener("test",null,s)}catch(o){}return n}),a(),t(i),delete f.addTest,delete f.addAsyncTest;for(var u=0;u<Modernizr._q.length;u++)Modernizr._q[u]();e.Modernizr=Modernizr}(window,document);


        /***/ }),

    /***/ "./src/js/libs/soundManager.js":
    /*!*************************************!*\
  !*** ./src/js/libs/soundManager.js ***!
  \*************************************/
    /*! no static exports found */
    /***/ (function(module, exports) {


        // PLAYER MANAGER:
        module.exports.obj = function(config, UTILS) {

            // INIT:
            var tmpSound;
            this.sounds = [];
            this.active = true;

            // PLAY SOUND:
            this.play = function(id, volume, loop) {
                if (!volume || !this.active) return;
                tmpSound = this.sounds[id];
                if (!tmpSound) {
                    tmpSound = new Howl({
                        src: ".././sound/" + id + ".mp3"
                    });
                    this.sounds[id] = tmpSound;
                }
                if (!loop || !tmpSound.isPlaying) {
                    tmpSound.isPlaying = true;
                    tmpSound.play();
                    tmpSound.volume((volume||1)*config.volumeMult);
                    tmpSound.loop(loop);
                }
            };

            // TOGGLE MUTE:
            this.toggleMute = function(id, mute) {
                tmpSound = this.sounds[id];
                if (tmpSound) tmpSound.mute(mute);
            };

            // STOP SOUND:
            this.stop = function(id) {
                tmpSound = this.sounds[id];
                if (tmpSound) {
                    tmpSound.stop();
                    tmpSound.isPlaying = false;
                }
            };

        };


        /***/ }),

    /***/ "./src/js/libs/utils.js":
    /*!******************************!*\
  !*** ./src/js/libs/utils.js ***!
  \******************************/
    /*! no static exports found */
    /***/ (function(module, exports) {


        // MATH UTILS:
        var mathABS = Math.abs;
        var mathCOS = Math.cos;
        var mathSIN = Math.sin;
        var mathPOW = Math.pow;
        var mathSQRT = Math.sqrt;
        var mathHYPOT = Math.hypot;
        var mathATAN2 = Math.atan2;
        var mathPI = Math.PI;

        // GLOBAL UTILS:
        module.exports.toRad = function (angle) {
            return angle * (Math.PI / 180);
        };
        module.exports.toAng = function (radian) {
            return radian / (Math.PI / 180);
        };
        module.exports.randInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        module.exports.randFloat = function (min, max) {
            return Math.random() * (max - min + 1) + min;
        };
        module.exports.lerp = function (value1, value2, amount) {
            return value1 + (value2 - value1) * amount;
        };
        module.exports.decel = function (val, cel) {
            if (val > 0)
                val = Math.max(0, val - cel);
            else if (val < 0)
                val = Math.min(0, val + cel);
            return val;
        };
        module.exports.getDistance = function (x1, y1, x2, y2) {
            return mathSQRT((x2 -= x1) * x2 + (y2 -= y1) * y2);
        };
        module.exports.getDist = function (tmp1, tmp2) {
            return mathSQRT((tmp2.x -= tmp1.x) * tmp2.x + (tmp2.y -= tmp1.y) * tmp2.y);
        };
        module.exports.getDirection = function (x1, y1, x2, y2) {
            return mathATAN2(y1 - y2, x1 - x2);
        };
        module.exports.getDirect = function (tmp1, tmp2) {
            return mathATAN2(tmp1.y - tmp2.y, tmp1.x - tmp2.x);
        };
        module.exports.getAngleDist = function (a, b) {
            var p = mathABS(b - a) % (mathPI * 2);
            return (p > mathPI ? (mathPI * 2) - p : p);
        };
        module.exports.isNumber = function (n) {
            return (typeof n == "number" && !isNaN(n) && isFinite(n));
        };
        module.exports.isString = function (s) {
            return (s && typeof s == "string");
        };
        module.exports.kFormat = function (num) {
            return num > 999 ? (num / 1000).toFixed(1) + 'k' : num;
        };
        module.exports.capitalizeFirst = function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };
        module.exports.fixTo = function (n, v) {
            return parseFloat(n.toFixed(v));
        };
        module.exports.sortByPoints = function (a, b) {
            return parseFloat(b.points) - parseFloat(a.points);
        };
        module.exports.lineInRect = function (recX, recY, recX2, recY2, x1, y1, x2, y2) {
            var minX = x1;
            var maxX = x2;
            if (x1 > x2) {
                minX = x2;
                maxX = x1;
            }
            if (maxX > recX2)
                maxX = recX2;
            if (minX < recX)
                minX = recX;
            if (minX > maxX)
                return false;
            var minY = y1;
            var maxY = y2;
            var dx = x2 - x1;
            if (Math.abs(dx) > 0.0000001) {
                var a = (y2 - y1) / dx;
                var b = y1 - a * x1;
                minY = a * minX + b;
                maxY = a * maxX + b;
            }
            if (minY > maxY) {
                var tmp = maxY;
                maxY = minY;
                minY = tmp;
            }
            if (maxY > recY2)
                maxY = recY2;
            if (minY < recY)
                minY = recY;
            if (minY > maxY)
                return false;
            return true;
        };
        module.exports.containsPoint = function (element, x, y) {
            var bounds = element.getBoundingClientRect();
            var left = bounds.left + window.scrollX;
            var top = bounds.top + window.scrollY;
            var width = bounds.width;
            var height = bounds.height;

            var insideHorizontal = x > left && x < left + width;
            var insideVertical = y > top && y < top + height;
            return insideHorizontal && insideVertical;
        };
        module.exports.mousifyTouchEvent = function(event) {
            var touch = event.changedTouches[0];
            event.screenX = touch.screenX;
            event.screenY = touch.screenY;
            event.clientX = touch.clientX;
            event.clientY = touch.clientY;
            event.pageX = touch.pageX;
            event.pageY = touch.pageY;
        };
        module.exports.hookTouchEvents = function (element, skipPrevent) {
            var preventDefault = !skipPrevent;
            var isHovering = false;
            // var passive = window.Modernizr.passiveeventlisteners ? {passive: true} : false;
            var passive = false;
            element.addEventListener("touchstart", module.exports.checkTrusted(touchStart), passive);
            element.addEventListener("touchmove", module.exports.checkTrusted(touchMove), passive);
            element.addEventListener("touchend", module.exports.checkTrusted(touchEnd), passive);
            element.addEventListener("touchcancel", module.exports.checkTrusted(touchEnd), passive);
            element.addEventListener("touchleave", module.exports.checkTrusted(touchEnd), passive);
            function touchStart(e) {
                module.exports.mousifyTouchEvent(e);
                window.setUsingTouch(true);
                if (preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (element.onmouseover)
                    element.onmouseover(e);
                isHovering = true;
            }
            function touchMove(e) {
                module.exports.mousifyTouchEvent(e);
                window.setUsingTouch(true);
                if (preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (module.exports.containsPoint(element, e.pageX, e.pageY)) {
                    if (!isHovering) {
                        if (element.onmouseover)
                            element.onmouseover(e);
                        isHovering = true;
                    }
                } else {
                    if (isHovering) {
                        if (element.onmouseout)
                            element.onmouseout(e);
                        isHovering = false;
                    }
                }
            }
            function touchEnd(e) {
                module.exports.mousifyTouchEvent(e);
                window.setUsingTouch(true);
                if (preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (isHovering) {
                    if (element.onclick)
                        element.onclick(e);
                    if (element.onmouseout)
                        element.onmouseout(e);
                    isHovering = false;
                }
            }
        };
        module.exports.removeAllChildren = function (element) {
            while (element.hasChildNodes()) {
                element.removeChild(element.lastChild);
            }
        };
        module.exports.generateElement = function (config) {
            var element = document.createElement(config.tag || "div");
            function bind(configValue, elementValue) {
                if (config[configValue])
                    element[elementValue] = config[configValue];
            }
            bind("text", "textContent");
            bind("html", "innerHTML");
            bind("class", "className");
            for (var key in config) {
                switch (key) {
                    case "tag":
                    case "text":
                    case "html":
                    case "class":
                    case "style":
                    case "hookTouch":
                    case "parent":
                    case "children":
                        continue;
                    default:
                        break;
                }
                element[key] = config[key];
            }
            if (element.onclick)
                element.onclick = module.exports.checkTrusted(element.onclick);
            if (element.onmouseover)
                element.onmouseover = module.exports.checkTrusted(element.onmouseover);
            if (element.onmouseout)
                element.onmouseout = module.exports.checkTrusted(element.onmouseout);
            if (config.style) {
                element.style.cssText = config.style;
            }
            if (config.hookTouch) {
                module.exports.hookTouchEvents(element);
            }
            if (config.parent) {
                config.parent.appendChild(element);
            }
            if (config.children) {
                for (var i = 0; i < config.children.length; i++) {
                    element.appendChild(config.children[i]);
                }
            }
            return element;
        }
        module.exports.eventIsTrusted = function(ev) {
            if (ev && typeof ev.isTrusted == "boolean") {
                return ev.isTrusted;
            } else {
                return true;
            }
        }
        module.exports.checkTrusted = function(callback) {
            return function(ev) {
                if (ev && ev instanceof Event && module.exports.eventIsTrusted(ev)) {
                    callback(ev);
                } else {
                    //console.error("Event is not trusted.", ev);
                }
            }
        }
        module.exports.randomString = function(length) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };
        module.exports.countInArray = function(array, val) {
            var count = 0;
            for (var i = 0; i < array.length; i++) {
                if (array[i] === val) count++;
            } return count;
        };

        // FLATMAP:
        var concat = function(x, y) { return x.concat(y) };

        var flatMap = function(f, xs) { return xs.map(f).reduce(concat, []); };

        Array.prototype.flatMap = function(f) {
            return flatMap(f, this)
        };

        //module.exports = VultrClient;


        /***/ })

    /******/ });
//# sourceMappingURL=bundle.js.map


function addList(id, options){
    let content = ``;
    for(let i in options){
        content += `<option>${options[i]}</option>`;
    }

    return `<select class="setting-list" id="${id}">${content}</select>`
}

function addSetting(id){
    return `<input type="checkbox" class="menu_checkbox" id="${id}" ${settings[id] ? "checked" : ""}>`;
}

function addTextInput(id, maxlength){
    return `<input type="text" class="menu_input" placeholder="NONE" id="${id}" value="${settings[id]}" maxlength="${maxlength}">`;
}

let menu = document.createElement("div");
menu.id = "mod_menu";
menu.style.display = "none";
menu.innerHTML = `
<div id="name_block">
    <div id="name_text">Menu</div>
</div>
<div id="category_block">
    <div id="combat" class="category">
        <div class="category_element"></div>
        <i class="material-icons category_icon">local_fire_department</i>
        <div class="category_text">Combat</div>
    </div>
    <div id="visual" class="category">
        <div class="category_element"></div>
        <i class="material-icons category_icon">visibility</i>
        <div class="category_text">Visual</div>
    </div>
    <div id="bots" class="category">
        <div class="category_element"></div>
        <i class="material-icons category_icon">build</i>
        <div class="category_text">Bots</div>
    </div>
    <div id="exit" class="category">
        <div class="category_element"></div>
        <i id="exit_icon" class="material-icons category_icon">close</i>
        <div class="category_text">Exit</div>
    </div>
</div>
<div id="combat_settings" class="settings_block">
    <div class="settings_title">Gather</div>
    <div class="setting2">
        <div class="setting_element invisible_element">
            <button class="menu_button" id="fix_gather">Fix Gather</button>
        </div>
    </div>
    <div class="settings_title">Pre Place</div>
    <div class="setting2">
        <div class="setting_element">
            <div class="setting_name">Spam</div>${addSetting("spampreplace")}
        </div>
    </div>
    <div class="settings_title">Auto Sync</div>
    <div class="setting2">
        <div class="setting_element">
            <div class="setting_name">x18k Sync</div>${addSetting("x18ksync")}
        </div>
    </div>
    <div class="settings_title">Auto Place</div>
    <div class="setting2">
        <div class="setting_element">
            <div class="setting_name">autoPlace</div>${addSetting("autoPlace")}
        </div>
    </div>
    <div class="settings_title"></div>
</div>
<div id="visual_settings" class="settings_block">
    <div class="settings_title">Visual</div>
    <div class="setting2">
        <div class="setting_element">
            <div class="setting_name">Game Zoom</div>${addTextInput("gamezoom", 15)}
        </div>
    </div>
    <div class="settings_title">Debug</div>
    <div class="setting2">
        <div class="setting_element">
            <div class="setting_name">Chat Log</div>${addSetting("chatlog")}
        </div>
    </div>
    <div class="settings_title"></div>
</div>
<div id="bots_settings" class="settings_block">
    <div class="settings_title">Name</div>
    <div class="setting2">
        <div class="setting_element">
            <div class="setting_name">Bots Name</div>${addTextInput("botname", 15)}
        </div>
    </div>
    <div class="settings_title">Count</div>
    <div class="setting2">
        <div class="setting_element">
            <div class="setting_name">Bots Count</div>${addTextInput("botcount", 2)}
        </div>
    </div>
    <div class="settings_title">Place</div>
    <div class="setting2">
        <div class="setting_element">
            <div class="setting_name">Platform Placer</div>${addSetting("botplatformplacer")}
        </div>
    </div>
    <div class="setting2">
        <div class="setting_element invisible_element">
            <button class="menu_button" id="send_bots">Send bots</button>
            <button class="menu_button" id="close_bots" style="left: 260px;">Close bots</button>
        </div>
    </div>
    <div class="settings_title"></div>
</div>
`;

document.body.appendChild(menu);

document.getElementById("fix_gather").addEventListener("click", function(){
    autogathering = !autogathering;
});

document.getElementById("exit").addEventListener("mousedown", function(){
    menu.style.display = "none";
});

document.getElementById("combat").addEventListener("mousedown", function(){
    document.getElementById("bots_settings").style.display = "none";
    document.getElementById("visual_settings").style.display = "none";
    document.getElementById("combat_settings").style.display = "block";
});

document.getElementById("visual").addEventListener("mousedown", function(){
    document.getElementById("bots_settings").style.display = "none";
    document.getElementById("combat_settings").style.display = "none";
    document.getElementById("visual_settings").style.display = "block";
});

document.getElementById("bots").addEventListener("mousedown", function(){
    document.getElementById("combat_settings").style.display = "none";
    document.getElementById("visual_settings").style.display = "none";
    document.getElementById("bots_settings").style.display = "block";
});

document.addEventListener("keydown", function(e){
    if(e.keyCode == 192){
        if(menu.style.display == "block"){
            menu.style.display = "none";
        } else {
            menu.style.display = "block";
        }
    }
});




for(let setting in settings){
    document.getElementById(setting).addEventListener("change", function(){
        if(typeof settings[setting] == "boolean"){
            if(setting == "chatlog"){
                if(chatLog.style.display == "none"){
                    chatLog.style.display = "block";
                } else {
                    chatLog.style.display = "none";
                }
            }

            settings[setting] = document.getElementById(setting).checked;
        } else {
            settings[setting] = document.getElementById(setting).value;
        }
    });
}




let chatLog = document.createElement("div");
chatLog.id = "chat_log";
chatLog.style.display = "none";
chatLog.innerHTML = `
<div id="chat_name">Chat Log</div>
<div id="chat_box"></div>
`;

document.body.appendChild(chatLog);

function addChatLog(text, color){
    let time = new Date();
    let minutes = time.getMinutes();
    let hours = time.getHours();
    let seconds = time.getSeconds();

    let chat_message = document.createElement("div");
    chat_message.className = "chat_message";
    chat_message.style.color = `${color}`;
    chat_message.innerText = `[${hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}] - ${text}`

    document.getElementById("chat_box").appendChild(chat_message);
    chat_message.scrollIntoView({behavior: 'auto', block: 'end'});
}

addChatLog("Mod: Welcome, Laffer24!", "#ffffff");

let css = document.createElement("style");
css.type = "text/css";
css.appendChild(document.createTextNode(`
#mod_menu {
    position: absolute;
    top: calc(50% - 250px);
    left: calc(50% - 400px);
    width: 820px;
    height: 500px;
    background: #40454E;
    z-index: 1000000;
}

#name_text {
    color: #ffffff;
    font-size: 20px;
    text-align: center;
    padding-top: 12px;
}

#name_block {
    position: absolute;
    width: 200px;
    height: 50px;
    background: #373C45;
}

.settings_block {
    position: absolute;
    left: 200px;
    width: 620px;
    height: 500px;
    overflow-y: scroll;
    overflow-x: hidden;
}

#category_block {
    position: absolute;
    top: 50px;
    width: 200px;
    height: 450px;
    background: #373C45;
}

.category {
    width: 200px;
    display: flex;
    align-items: center;
    height: 50px;
}

.category:hover {
    background: #2D3037;
}

.category_element {
    display: none;
    width: 5px;
    height: 50px;
    background: #696ACB;
}

.category:hover .category_element {
    display: block;
}

.category_icon {
    color: #858A92;
    font-size: 24px;
    padding-left: 15px;
}

.category:hover .category_icon {
    color: #ffffff;
}

.category_text {
    color: #858A92;
    font-size: 16px;
    padding-left: 15px;
}

.category:hover .category_text {
    color: #ffffff;
}

#exit {
    position: absolute;
    bottom: 0px;
}

#exit:hover #exit_icon {
    color: #ff0000;
}

.setting_element {
    display: flex;
    position: relative;
    width: 550px;
    height: 50px;
    align-items: center;
    border-radius: 4px;
    background: #373C45;
}

.invisible_element {
    background: #40454E;
}

.setting2 {
    position: relative;
    padding-top: 10px;
    left: 25px;
}

.setting_name {
    color: #ffffff;
    font-size: 16px;
    padding-left: 15px;
}

.settings_title {
    color: #858A92;
    font-size: 16px;
    padding-top: 25px;
    padding-left: 25px;
}

#visual_settings {
    display: none;
}

.menu_checkbox {
    position: absolute;
    background: rgba(100, 100, 100, 0.5);
    appearance: none;
    width: 33px;
    height: 15.5px;
    border-radius: 50px;
    cursor: pointer;
    transform: scale(1.1);
    right: 15px;
    transition: 0.5s;
}

.menu_input {
    color: #ffffff;
    position: absolute;
    height: 25px;
    width: 75px;
    border: 0px;
    right: 15px;
    text-align: center;
    background: #30303A;
}

.menu_button {
    color: #ffffff;
    position: absolute;
    font-size: 16px;
    width: 250px;
    height: 50px;
    border: 0px;
    cursor: pointer;
    border-radius: 5px;
    background: #373C45;
}

.menu_button:hover {
    background: #2D3037;
}

#botname {
    width: 125px;
}

#combat_settings {
    display: block;
}

#visual_settings {
    display: none;
}

#bots_settings {
    display: none;
}

.menu_checkbox:checked[type="checkbox"] {
    background: #696ACB;
}

.menu_checkbox::after {
    position: absolute;
    content: "";
    width: 15.5px;
    height: 15.5px;
    top: 0;
    left: 0;
    background: #ffffff;
    border-radius: 50%;
    transform: scale(1.1);
    transition: 0.5s;
}

.menu_checkbox:checked[type="checkbox"]::after {
    left: 50%;
}

.settings_block::-webkit-scrollbar-thumb {
    opacity: 0;
}

.settings_block::-webkit-scrollbar-thumb:active {
    opacity: 0;
}

.settings_block::-webkit-scrollbar {
    width: 10px;
}

.settings_block::-webkit-scrollbar-track {
    opacity: 0;
}






#chat_log {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 400px;
    height: 300px;
    border-radius: 4px;
    background: #373C45;
    z-index: 999999;
}

#chat_name {
    position: absolute;
    color: #ffffff;
    padding-left: 10px;
    padding-top: 10px;
    font-size: 24px;
}

#chat_box {
    position: absolute;
    top: 50px;
    left: 10px;
    width: 380px;
    height: 240px;
    border-radius: 4px;
    background: #30303A;
    overflow-y: scroll;
    overflow-x: hidden;
}

#chat_box::-webkit-scrollbar-thumb {
    background: #ffffff;
    border-radius: 4px;
}

#chat_box::-webkit-scrollbar-thumb:active {
    background: #ffffff;
}

#chat_box::-webkit-scrollbar {
    width: 10px;
}

#chat_box::-webkit-scrollbar-track {
    opacity: 0;
}




#chat_log {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 400px;
    height: 300px;
    border-radius: 4px;
    background: #373C45;
    z-index: 999999;
}

#chat_name {
    position: absolute;
    color: #ffffff;
    padding-left: 10px;
    padding-top: 10px;
    font-size: 24px;
}

#chat_box {
    position: absolute;
    top: 50px;
    left: 10px;
    width: 380px;
    height: 240px;
    border-radius: 4px;
    background: #30303A;
    overflow-y: scroll;
    overflow-x: hidden;
}

#chat_box::-webkit-scrollbar-thumb {
    background: #ffffff;
    border-radius: 4px;
}

#chat_box::-webkit-scrollbar-thumb:active {
    background: #ffffff;
}

#chat_box::-webkit-scrollbar {
    width: 10px;
}

#chat_box::-webkit-scrollbar-track {
    opacity: 0;
}
`));

document.head.appendChild(css);
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-07-23
// @description  try to take over the world!
// @author       You
// @match        https://sandbox.moomoo.io/?server=frankfurt:SY
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @grant        none
// ==/UserScript==



    // === One-tick detector (shift + t) ===
    (function(){

        if (window._oneTickDetectorInstalled) return;
        window._oneTickDetectorInstalled = true


        const POLEARM_RANGE = 140;
        const KATANA_RANGE = 100;
        const SOLDIER_HELMET_ID = 6;

        let oneTickDetectorActive = false;


        const dist2 = (a,b) => Math.hypot(a.x - b.x, a.y - b.y);
        const getMyPlayer = () => window.me || window.myPlayer || window.player || null;
        const getAllPlayers = () => {
            if (Array.isArray(window.players)) return window.players;
            if (window.players && typeof window.players === "object") return Object.values(window.players);
            if (Array.isArray(window.entities)) return window.entities.filter(e => e?.isPlayer || e?.type === "player");
             return [];
        };
        const getHelmetId = p =>
            p?.hatId ?? p?.hat ?? p?.items?.hat ?? p?.gear?.helmet ?? p?.helmetId ?? null;

        const performOneTickCheck = () => {
            const me = getMyPlayer();
            if (!me) return false;
            const all = getAllPlayers();
            if (!all?.length) return false;

            let nearest = null, nearestDist = Infinity;
            for (const p of all){
                if (!p || p === me || p.id === me.id) continue;
                if (p.x == null || p.y == null) continue;
                const d = dist2(me,p);
                if (d < nearestDist){ nearest = p; nearestDist = d; }
            }

            if (!nearest) return false;
            const inRange = nearestDist <= Math.max(POLEARM_RANGE, KATANA_RANGE);
            if (!inRange) return false;

            const helmetId = getHelmetId(nearest);
            if (helmetId !== SOLDIER_HELMET_ID){
                console.log("%c[oneTick] Wykryto cel bez soldier helmet!","color:#0f0",nearest);
                if (typeof window.onOneTickDetected === "function") {
                    window.onOneTickDetected(nearest);
                }
                return true;
            }
            return false;
        };

        const frameCheck = () => {
            if (!oneTickDetectorActive) return;
            const ok = performOneTickCheck();
            oneTickDetectorActive = false;
            console.log("[oneTick] frame done, detected:", ok);
        };

        window.addEventListener("keydown", e=>{
            const isTyping = document.activeElement &&
           (document.activeElement.tagName === "INPUT" ||
            document.activeElement.tagName === "TEXTAREA" ||
            document.activeElement.isContentEditable);
         if (isTyping) return;

         if (e.key === "T" && e.shiftKey && !e.repeat){
            oneTickDetectorActive = !oneTickDetectorActive;
            console.log("%c[oneTick] toggle -> " + oneTickDetectorActive,"color:#09f");
            if (oneTickDetectorActive) requestAnimationFrame(frameCheck);
        }
    });


    console.log("%c[oneTick] Detector aktywny (Shift+T) — bez kolizji z czatem","color:#0af");


}());

