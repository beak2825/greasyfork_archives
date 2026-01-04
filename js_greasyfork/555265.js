// ==UserScript==
// @name            danbooru / rule34 图片标签提取
// @name:en         danbooru / rule34 image tag extractor
// @name:zh         danbooru / rule34 图片标签提取
// @name:ja         danbooru / rule34 画像のタグ抽出
// @namespace       oninashi
// @version         1.0.251120
// @author          oninashi
// @description     从相应网站提取图片标签/词条，包括作者、角色、角色归属（版权），并过滤打码标注
// @description:en  Extract image tags/entries from the respective website, including author, character, character attribution (copyright), and filter out censored annotations
// @description:ja  対応するウェブサイトから画像のタグ/エントリを抽出し、作者、キャラクター、キャラクターの帰属（著作権）、および検閲された注釈をフィルタリングします
// @description:zh  从相应网站提取图片标签/词条，包括作者、角色、角色归属（版权），并过滤打码标注
// @license         MIT
// @homepage        https://baraag.net/@wd92asd
// @supportURL      https://baraag.net/@wd92asd
// @match           https://danbooru.donmai.us/*
// @match           https://rule34.xxx/*
// @require         https://cdn.jsdelivr.net/npm/vue@3.5.24/dist/vue.global.prod.js
// @grant           GM_addStyle
// @antifeature     ads            其他浏览器插件的广告
// @antifeature     referral-link  AI 网站推广
// @downloadURL https://update.greasyfork.org/scripts/555265/danbooru%20%20rule34%20%E5%9B%BE%E7%89%87%E6%A0%87%E7%AD%BE%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/555265/danbooru%20%20rule34%20%E5%9B%BE%E7%89%87%E6%A0%87%E7%AD%BE%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function(vue) {
  "use strict";

  const d = new Set(); const importCSS = async (e) => { d.has(e) || (d.add(e), ((t) => { typeof GM_addStyle == "function" ? GM_addStyle(t) : document.head.appendChild(document.createElement("style")).append(t); })(e)); };

  importCSS(" *,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.de-helper :is(.my-2){margin-top:.5rem;margin-bottom:.5rem}.de-helper :is(.mb-1){margin-bottom:.25rem}.de-helper :is(.hidden){display:none}.de-helper :is(.h-10){height:2.5rem}.de-helper :is(.w-\\[30\\%\\]){width:30%}.de-helper :is(.w-\\[48\\%\\]){width:48%}.de-helper :is(.w-10){width:2.5rem}.de-helper :is(.w-48){width:12rem}.de-helper :is(.w-full){width:100%}.de-helper :is(.flex){display:flex}.de-helper :is(.flex-col){flex-direction:column}.de-helper :is(.flex-wrap){flex-wrap:wrap}.de-helper :is(.cursor-pointer){cursor:pointer}.de-helper :is(.items-center){align-items:center}.de-helper :is(.justify-center){justify-content:center}.de-helper :is(.gap-1){gap:.25rem}.de-helper :is(.gap-2){gap:.5rem}.de-helper :is(.overflow-clip){overflow:clip}.de-helper :is(.overflow-hidden){overflow:hidden}.de-helper :is(.border){border-width:1px}.de-helper :is(.border-b-1){border-bottom-width:1px}.de-helper :is(.border-blue-500){--un-border-opacity:1;border-color:rgb(59 130 246 / var(--un-border-opacity))}.de-helper :is(.border-transparent){border-color:transparent}.de-helper :is(.border-yellow-400){--un-border-opacity:1;border-color:rgb(250 204 21 / var(--un-border-opacity))}.de-helper :is(.rounded-md){border-radius:.375rem}.de-helper :is(.rounded){border-radius:.25rem}.de-helper :is(.rounded-l-lg){border-top-left-radius:.5rem;border-bottom-left-radius:.5rem}.de-helper :is(.bg-blue-500){--un-bg-opacity:1;background-color:rgb(59 130 246 / var(--un-bg-opacity))}.de-helper :is(.bg-white){--un-bg-opacity:1;background-color:rgb(255 255 255 / var(--un-bg-opacity))}.de-helper :is(.hover\\:bg-blue-600:hover){--un-bg-opacity:1;background-color:rgb(37 99 235 / var(--un-bg-opacity))}.de-helper :is(.p-1){padding:.25rem}.de-helper :is(.p-2){padding:.5rem}.de-helper :is(.px-2){padding-left:.5rem;padding-right:.5rem}.de-helper :is(.pb-2px){padding-bottom:2px}.de-helper :is(.font-size-17px){font-size:17px}.de-helper :is(.text-white){--un-text-opacity:1;color:rgb(255 255 255 / var(--un-text-opacity))}.de-helper :is(.font-500){font-weight:500}.de-helper :is(.font-600){font-weight:600}.de-helper :is(.opacity-95){opacity:.95}.de-helper :is(.transition-colors){transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s} ");

  const clothes = [
    [
      ".+_uniform",
      "bikini",
      "bottomless",
      "clothes",
      "clothing",
      "costume",
      "maid",
      "nude",
      "school_uniform",
      "serafuku",
      "topless",
      "suit",
    ],
    [
      ".+_cutout",
      "belt\\b",
      "bow\\b",
      "bracelet",
      "charm",
      "cross",
      "frills",
      "fur_trim",
      "glint",
      "heart",
      "jewelry",
      "lace_trim\\b",
      "lace\\b",
      "ofuda",
      "pasties",
      "piercing",
      "pinstripe_pattern",
      "ribbon",
      "zipper",
    ],
    [
      ".+_cap\\b",
      ".+_eyewear",
      "eyewear_.+",
      "glasses",
      "hat",
      "qingdai_guanmao",
      "veil\\b",
      "headgear",
    ],
    [
      "choker",
      "collar",
      "neckerchief",
      "off_shoulder",
      "scarf",
      "spaghetti_strap",
    ],
    [
      "gloves?",
      "sleeveless",
      "sleeves?",
      "bridal_gauntlets",
    ],
    [
      ".+_hood",
      "apron",
      "dress",
      "jacket",
      "leotard",
      "shirt",
      "swimsuit",
    ],
    [
      "babydoll",
      "bra\\b",
      "cameltoe",
      "g-string",
      "gusset",
      "highleg",
      "lingerie",
      "panties",
      "panty_straps",
      "pelvic_curtain",
      "t-back",
      "thong",
      "trefoil",
      "underwear",
      "wedgie",
      "pasties",
    ],
    [
      ".+_pants",
      "pants",
      "shorts",
      "skirt",
    ],
    [
      "garter_straps",
      "legwear",
      "pantyhose",
      "skindentation",
      "thigh_strap",
      "thighhighs",
    ],
    [
      "high_heels",
      "mary_janes",
      "shoes",
      "slippers",
      "socks",
    ],
  ];
  const flatClothes = {
    name: "服装",
    order: 145,
    break: true,
    items: clothes.flat(),
  };
  const lsObj = {
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key, def = "") => {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return def;
    },
  };
  const gob = {
    site: "danbooru",
    vueEls: ["de-app", "de-sidebar"],
    $imgContainer: null,
    $app: null,
    get locHref() {
      return location.href;
    },
    get types() {
      return ["artist", "character", "copyright", "general"];
    },
    $n(selector, context = document) {
      return context.querySelector(selector);
    },
    $na(selector, context = document) {
      return context.querySelectorAll(selector);
    },
    _init() {
      this.site = this.locHref.includes("rule34") ? "rule34" : "danbooru";
    },
    _isPost() {
      if (this.site === "rule34") {
        this.$imgContainer = gob.$n(".flexi > div > img");
        return /^https:\/\/rule34\.xxx\/index\.php\?page=post&s=view&id=\d+/.test(this.locHref);
      }
      else {
        this.$imgContainer = gob.$n("#content .image-container");
        return this.site === "danbooru" && /^https:\/\/danbooru\.donmai\.us\/posts\/.+$/.test(this.locHref);
      }
    },
    _getPostID() {
      if (this.site === "danbooru") {
        const match = this.locHref.match(/^https:\/\/danbooru\.donmai\.us\/posts\/(\d+)/);
        return match ? match[1] : null;
      }
      else if (this.site === "rule34") {
        const match = this.locHref.match(/^https:\/\/rule34\.xxx\/index\.php\?page=post&s=view&id=(\d+)/);
        return match ? match[1] : null;
      }
      return null;
    },
    _tagLink(tag) {
      if (this.site === "danbooru") {
        return `https://danbooru.donmai.us/posts?tags=${tag}`;
      }
      else if (this.site === "rule34") {
        return `https://rule34.xxx/index.php?page=post&s=list&tags=${tag}`;
      }
      return "";
    },
    _setAppStyle() {
      if (!gob.$app || !gob.$imgContainer) return;
      const MIN_MARGIN = 10;
      const rectImg = gob.$imgContainer.getBoundingClientRect();
      const rectApp = gob.$app.getBoundingClientRect();
      const minTop = window.innerHeight < rectApp.height + MIN_MARGIN ? window.innerHeight - rectApp.height - MIN_MARGIN : MIN_MARGIN;
      const appTop = Math.max(rectImg.top, minTop);
      const appLeft = rectImg.right + MIN_MARGIN;
      gob.$app.style.setProperty("--top", `${appTop}px`);
      gob.$app.style.setProperty("--left", `${appLeft}px`);
    },
    _getTags(type = "general") {
      if (this.site === "danbooru" && this._isPost()) {
        let selector = `ul.${type}-tag-list`;
        const tags = this.$n(selector)?.querySelectorAll("li a.search-tag") || [];
        return Array.from(tags).map((tag) => tag.textContent.trim().replace(/\s/g, "_") || "");
      }
      if (this.site === "rule34" && this._isPost()) {
        let selector = `li.tag-type-${type} >a`;
        const $$tags = this.$na(selector) || [];
        const tags = Array.from($$tags).filter((tag) => tag.textContent !== "?");
        return Array.from(tags).map((tag) => tag.textContent.trim().replace(/\s/g, "_") || "");
      }
      return [];
    },
    _replaceSynonyms(tags) {
      const _subReplace = (arg_tags, search, target = "_placeholder_") => {
        return arg_tags.map((tag) => tag.replace(search, target));
      };
      const list = {
        fingernails: ["nails"],
      };
      for (const key in list) {
        if (!Object.hasOwn(list, key)) continue;
        tags = _subReplace(tags, key, "_placeholder_");
        const synonyms = list[key];
        for (const synonym of synonyms) {
          tags = _subReplace(tags, synonym, key);
        }
        tags = _subReplace(tags, "_placeholder_", key);
      }
      return tags;
    },
    _terGroups() {
      return [
        {
          name: "前置",
          items: ["\\dgirl", "\\dboy", "solo|duo", "yuri|hetero", "multiple_girls", "6\\+"],
        },
        {
          name: "镜头视角",
          items: [".+_focus", "pov", "multiple_views", ".+_angle", "\\bfrom_behind", "from_above", "from_below", "from_side", "close-up", "portrait", "looking_.+", "full_body", "upper_body", "cowboy_shot", "upskirt", "straight-on"],
        },
        {
          name: "场景位置",
          items: ["indoors", "outdoors", ".+_background", "sidelighting", "onsen", "blurry", "window", "\\bshadow\\b", "night", "day", "cityscape", "sky"],
        },
        {
          name: "物品家具",
          items: ["\\bbed\\b", "pillow", "bed_sheet", "petals", "phone", "bag", "chandelier"],
          break: true,
        },
        {
          name: "人物整体",
          items: ["sweat", "hairy", "mole\\b", "mature", "jimiko", "mojyo", ".+_skin", "skinned", "plump", "tanlines", "\\btan\\b", ".+_out_of_frame", "scars?\\b", "steaming_body", "curvy", "petite", "skinny"],
        },
        {
          name: "头",
          items: ["\\bhair", ".+_hair", "sidelocks", "hairband", "ponytail", "ahoge", "braid\\b", "horns", "twintails", "halo", "。+_bangs"],
        },
        {
          name: "脸",
          items: ["blush", "mouth", "smile", "eyes", "eyebrows", "earrings", "makeup", "eyelashes", "grin", "teeth", "tongue", "fang", ":.+", "lips", "!+", "@_@", "mole_under_eye", "drooling", "saliva"],
        },
        {
          name: "肩颈",
          items: ["collarbone", "bare_shoulders"],
        },
        {
          name: "胸部",
          items: ["breasts?", "nipples?", "areolae?", "cleavage", "no_bra", "underboob", "sideboob", "backboob"],
        },
        {
          name: "手臂",
          items: ["armpits", "armpit_crease", "armpit_riah", "fingernails", "nail_polish"],
        },
        {
          name: "腰腹",
          items: ["belly", "navel", "\\bstomach"],
        },
        {
          name: "股间",
          items: ["pussy", "pubic_riah", "groin", "fat_mons", "partially_visible_vulva"],
        },
        {
          name: "臀",
          items: ["\\bass", "huge_ass", "anus", "anal_riah", "wide_hips", "hip_bones"],
        },
        {
          name: "腿",
          items: ["thighs", "legs\\b", "kneepits", "thigh_gap", "thick_thighs", "zettai_ryouiki"],
        },
        {
          name: "脚",
          items: ["barefoot", "feet", "soles", "toes"],
          break: true,
        },
        {
          name: "动作",
          items: [".+_pose", "holding", "straddling", "spread_.+", "squatting", "lying", "adjusting_.+", ".+_up", "sitting", "standing", "hands?_on_.+", "on_side", "on_stomach", "groping", "grabbing", "elbow_rest", "on_bed", "on_back", "head_tilt", "arms_behind_.+", "against_.+"],
        },
        {
          name: "sex",
          items: ["sex", "penis", "vagina", ".+_position", "girl_on_top", ".+stimulation", "ejaculation", "\\bcum", "breath", "erection", "suspended_congress", "lifting_person", "prone_bone"],
          break: true,
        },
        {
          name: "其他",
          items: [],
        },
      ].map((group, i) => ({ ...group, order: 10 * i }));
    },
    _groupTags(tags, flat = false) {
      const terGroups = this._terGroups();
      terGroups.push(flatClothes);
      terGroups.sort((a, b) => a.order - b.order);
      const groupedTags = [];
      for (const group of terGroups) {
        groupedTags.push({ name: group.name, items: [], order: group.order, break: group.break || false });
      }
      for (let tag of tags) {
        tag = tag.replace(/(pubic|anal|armpit|body)_hair/g, "$1_riah");
        let found = false;
        for (const group of terGroups) {
          if (group.items.some((item) => {
            try {
              const regex = new RegExp(item);
              return regex.test(tag);
            }
            catch (e) {
              console.log(e);
              return tag.includes(item);
            }
          })) {
            tag = tag.replace(/(pubic|anal|armpit|body)_riah/g, "$1_hair");
            groupedTags.find((g) => g.name === group.name)?.items.push(tag);
            found = true;
            break;
          }
        }
        if (!found) {
          groupedTags.find((g) => g.name === "其他")?.items.push(tag);
        }
      }
      if (flat) {
        const flatTags = [];
        let legChaged = false;
        for (const group of groupedTags) {
          if (group.items.length > 0) {
            flatTags.push(...group.items);
            legChaged = true;
          }
          if (group.break && legChaged) {
            flatTags.push("++");
            legChaged = false;
          }
        }
        if (flatTags[flatTags.length - 1] === "++") {
          flatTags.pop();
        }
        return flatTags;
      }
      return groupedTags;
    },
    _saveSelectedTags(arg_data) {
      const postID = this._getPostID();
      if (!postID) return;
      const key = `selectedTags_${postID}`;
      lsObj.setItem(key, arg_data);
    },
    _loadSelectedTags() {
      const postID = this._getPostID();
      if (!postID) return;
      const key = `selectedTags_${postID}`;
      return lsObj.getItem(key, []);
    },
  };
  const _hoisted_1$1 = { class: "mb-1 flex items-center gap-1" };
  const _hoisted_2 = { class: "de-tags-list flex flex-wrap gap-2 w-full font-size-17px font-500" };
  const _hoisted_3 = ["href", "title"];
  const _hoisted_4 = ["onClick"];
  const _hoisted_5 = {
    key: 0,
    class: "rounded",
  };
  const _hoisted_6 = ["value"];
  const _sfc_main$1 = vue.defineComponent({
    __name: "App",
    setup(__props) {
      const tagsByGroup = vue.ref([]);
      const tagsForShow = vue.computed(() => genShowTags());
      const showType = vue.ref("def");
      const selectedTags = vue.ref([]);
      const showSelected = vue.computed(() => {
        const flatTags = tagsForShow.value.filter((_, index) => selectedTags.value.includes(index));
        return flatTags.map((tag) => tag.value).join(", ");
      });
      const clsTagSpan = vue.ref("");
      const blockTags = ["mosaic_censoring", "censored", "bar_censor", "talisman_pasties", "heart_censor", "patreon_username", "web_address"];
      const getTags = () => {
        const rltTags = [];
        const types = gob.types;
        types.forEach((type) => {
          let groupTags = gob._getTags(type).map((tag) => {
            return type !== "general" ? `${type}: ${tag}` : tag;
          });
          if (type === "general") {
            groupTags = groupTags.filter((tag) => !blockTags.includes(tag));
            groupTags = gob._replaceSynonyms(groupTags);
            groupTags = gob._groupTags(groupTags, true);
          }
          const curTags = {
            category: type,
            values: type !== "general" ? [...groupTags, "||"] : groupTags,
          };
          if (groupTags.length > 0) {
            rltTags.push(curTags);
          }
        });
        return rltTags;
      };
      const genShowTags = () => {
        const showTags = [];
        tagsByGroup.value.forEach((gTag) => {
          const flatTags = gTag.values.map((item) => {
            return {
              category: gTag.category,
              value: item,
            };
          });
          showTags.push(...flatTags);
        });
        const arrClass = [showTags.length >= 60 ? "w-[30%]" : "w-[48%]"];
        arrClass.push("border-b-1", "border-transparent", "pb-2px", "cursor-pointer");
        clsTagSpan.value = arrClass.join(" ");
        return showTags;
      };
      const copyTags = (event) => {
        const $target = event.target;
        $target.textContent = "已复制";
        setTimeout(() => {
          $target.textContent = "一键复制";
        }, 1500);
        let text = tagsForShow.value.map((tag) => tag.value).join(", ").replace(/([|+]{2}),/g, "$1");
        if (selectedTags.value.length > 0 && showType.value === "def") {
          text = showSelected.value;
        }
        navigator.clipboard.writeText(text);
      };
      const switchShowType = () => {
        switch (showType.value) {
          case "def":
            showType.value = "link";
            break;
          default:
            showType.value = "def";
            break;
        }
      };
      const toggleTagSelection = (index) => {
        const curSet = new Set(selectedTags.value);
        if (curSet.has(index)) {
          curSet.delete(index);
        }
        else {
          curSet.add(index);
        }
        selectedTags.value = Array.from(curSet).sort();
        gob._saveSelectedTags(selectedTags.value);
      };
      vue.onMounted(() => {
        tagsByGroup.value = getTags();
        selectedTags.value = gob._loadSelectedTags();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("p", _hoisted_1$1, [
            vue.createElementVNode("button", {
              class: "p-1 px-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors border-blue-500",
              onClick: _cache[0] || (_cache[0] = ($event) => copyTags($event)),
            }, " 一键复制 "),
            vue.createElementVNode("button", {
              class: "p-1 px-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors border-blue-500",
              onClick: switchShowType,
            }, vue.toDisplayString(showType.value === "def" ? "切至链接模式" : "切至默认模式"), 1),
          ]),
          vue.createElementVNode("div", _hoisted_2, [
            showType.value === "link"
              ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(tagsForShow.value, (itemTag) => {
                return vue.openBlock(), vue.createElementBlock("a", {
                  key: itemTag.value,
                  class: vue.normalizeClass(["overflow-clip", `${itemTag.category} ${clsTagSpan.value}`]),
                  href: vue.unref(gob)._tagLink(itemTag.value),
                  title: itemTag.value,
                  target: "_blank",
                }, vue.toDisplayString(itemTag.value), 11, _hoisted_3);
              }), 128))
              : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(tagsForShow.value, (itemTag, i) => {
                return vue.openBlock(), vue.createElementBlock("span", {
                  key: itemTag.value,
                  class: vue.normalizeClass(["overflow-clip", `${itemTag.category} ${clsTagSpan.value} ${showType.value === "def" && selectedTags.value.includes(i) ? " border-yellow-400" : ""}`]),
                  onClick: ($event) => showType.value === "def" && toggleTagSelection(i),
                }, vue.toDisplayString(itemTag.value), 11, _hoisted_4);
              }), 128)),
          ]),
          showType.value === "def" && selectedTags.value.length > 0
            ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5, [
              _cache[1] || (_cache[1] = vue.createElementVNode("hr", { class: "border-b-1 my-2" }, null, -1)),
              vue.createElementVNode("textarea", {
                class: "w-full p-2 border rounded",
                value: showSelected.value,
                rows: "5",
                readonly: "",
              }, null, 8, _hoisted_6),
            ]))
            : vue.createCommentVNode("", true),
          _cache[2] || (_cache[2] = vue.createElementVNode("hr", { class: "border-b-1 my-2" }, null, -1)),
          _cache[3] || (_cache[3] = vue.createElementVNode("div", { class: "font-600" }, " 说明：默认模式下，可以点击词条以自行选择 ", -1)),
          _cache[4] || (_cache[4] = vue.createElementVNode("div", { class: "font-600 ads" }, [
            vue.createTextVNode(" 广告："),
            vue.createElementVNode("a", {
              href: "https://www.dzmm.io?rf=76bdb299",
              target: "_blank",
              title: "dzmm.io",
            }, "dzmm.io"),
            vue.createTextVNode(" ← 可以用 ublock-origin 规则屏蔽这个广告显示 "),
          ], -1)),
        ], 64);
      };
    },
  });
  function mitt(n) {
    return { all: n = n || new Map(), on: function(t, e) {
      var i = n.get(t);
      i ? i.push(e) : n.set(t, [e]);
    }, off: function(t, e) {
      var i = n.get(t);
      i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []));
    }, emit: function(t, e) {
      var i = n.get(t);
      i && i.slice().map(function(n2) {
        n2(e);
      }), (i = n.get("*")) && i.slice().map(function(n2) {
        n2(t, e);
      });
    } };
  }
  const eventBus = mitt();
  const _hoisted_1 = { class: "flex" };
  const _sfc_main = vue.defineComponent({
    __name: "SideBar",
    setup(__props) {
      const showContent = vue.ref(false);
      const showApp = vue.ref(false);
      const toggleApp = () => {
        const $vue = gob.$n("#" + gob.vueEls[0]);
        if ($vue?.classList.contains("hidden")) {
          $vue?.classList.remove("hidden");
          eventBus.emit("request:data", { act: "showApp" });
          showApp.value = true;
        }
        else {
          $vue?.classList.add("hidden");
          showApp.value = false;
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          !showContent.value
            ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              id: "de-sidebar-badge",
              class: "bg-blue-500 text-white w-10 h-10 flex items-center justify-center cursor-pointer rounded-l-lg",
              onMouseenter: _cache[0] || (_cache[0] = ($event) => showContent.value = true),
            }, " D ", 32))
            : vue.createCommentVNode("", true),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["bg-white opacity-95 rounded-md p-1", showContent.value ? "w-48 flex flex-col" : "hidden"]),
            onMouseenter: _cache[1] || (_cache[1] = ($event) => showContent.value = true),
            onMouseleave: _cache[2] || (_cache[2] = ($event) => showContent.value = false),
          }, [
            vue.createElementVNode("button", {
              class: "p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors",
              onClick: toggleApp,
            }, vue.toDisplayString(showApp.value ? "再次点击关闭" : "显示词条提取"), 1),
          ], 34),
        ]);
      };
    },
  });
  const VueMount = (id) => {
    if (id === "de-app") {
      !gob.$n(`#${id}`) && vue.createApp(_sfc_main$1).mount(
        (() => {
          const app = document.createElement("div");
          app.id = id;
          app.className = "de-helper fixed";
          app.classList.add("hidden");
          document.body.append(app);
          gob.$app = app;
          return app;
        })(),
      );
    }
    else if (id === "de-sidebar") {
      !gob.$n(`#${id}`) && vue.createApp(_sfc_main).mount(
        (() => {
          const sidebar = document.createElement("div");
          sidebar.id = id;
          sidebar.className = "de-helper fixed right-0 top-1/2";
          document.body.append(sidebar);
          return sidebar;
        })(),
      );
    }
  };
  const styleCss = ".de-helper,.de-helper *{box-sizing:border-box;padding:0;margin:0}.de-helper hr{border-color:#777892}#de-app{--app-right: 8rem;background-color:#1e1e2c;border-radius:1rem;color:#d1d1da;padding:1rem;position:fixed;z-index:110;left:var(--left);top:var(--top);right:var(--app-right);border:1px solid #333;transition:top .3s ease-in-out}@media(max-width:1760px){#de-app{--app-right: 6rem}}@media(max-width:1680px){#de-app{--app-right: 2rem}}@media(max-width:1600px){#de-app{top:50%;left:50%;transform:translate(-50%,-50%)}}#de-app .artist{color:var(--artist-tag-color)}#de-app .copyright{color:var(--copyright-tag-color)}#de-app .character{color:var(--character-tag-color)}#de-app .general{color:var(--general-tag-color)}#de-sidebar{position:fixed;z-index:120;right:0;top:50%}@media(min-width:1601px){#de-app.hidden{display:block!important}#de-sidebar{display:none}}";
  importCSS(styleCss);
  const fnInitializePage = () => {
    gob._init();
    if (gob._isPost()) {
      gob.vueEls.forEach((id) => {
        VueMount(id);
      });
      if (gob.$imgContainer) {
        if (gob.$imgContainer.dataset.loaded === "true") return;
        gob.$imgContainer.dataset.loaded = "true";
        gob._setAppStyle();
        window.addEventListener("scrollend", () => {
          gob._setAppStyle();
        });
      }
    }
  };
  (() => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fnInitializePage);
    }
    else {
      fnInitializePage();
    }
  })();
})(Vue);
