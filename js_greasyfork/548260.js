// ==UserScript==
// @name        Internet Roadtrip Advanced Interactive Street View
// @namespace   jdranczewski.github.io
// @description Make the embedded Internet Roadtrip Street View fully interactive.
// @match       https://neal.fun/*
// @match       https://www.google.com/maps/embed/v1/streetview*
// @icon        https://jdranczewski.dev/irt/images/aisv.png
// @version     1.1.0
// @author      jdranczewski & netux
// @license     MIT
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2/dist/solid.min.js
// @grant       GM.addStyle
// @grant       GM.getValues
// @grant       GM.setValues
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/548260/Internet%20Roadtrip%20Advanced%20Interactive%20Street%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/548260/Internet%20Roadtrip%20Advanced%20Interactive%20Street%20View.meta.js
// ==/UserScript==

(function (IRF) {
'use strict';

function _interopNamespaceDefault(e) {
var n = Object.create(null);
if (e) {
Object.keys(e).forEach(function (k) {
if (k !== 'default') {
var d = Object.getOwnPropertyDescriptor(e, k);
Object.defineProperty(n, k, d.get ? d : {
enumerable: true,
get: function () { return e[k]; }
});
}
});
}
n.default = e;
return Object.freeze(n);
}

var IRF__namespace = /*#__PURE__*/_interopNamespaceDefault(IRF);

if (IRF__namespace.isInternetRoadtrip) {
    // We're inside Roadtrip, inject Roadtrip logic
    console.log("[AISV-rt] Inside Roadtrip");
(async function (web, IRF, solidJs) {
'use strict';

function _interopNamespaceDefault(e) {
var n = Object.create(null);
if (e) {
Object.keys(e).forEach(function (k) {
if (k !== 'default') {
var d = Object.getOwnPropertyDescriptor(e, k);
Object.defineProperty(n, k, d.get ? d : {
enumerable: true,
get: function () { return e[k]; }
});
}
});
}
n.default = e;
return Object.freeze(n);
}

var IRF__namespace = /*#__PURE__*/_interopNamespaceDefault(IRF);

var styles = {"settings-section":"settings-module_settings-section__tE36w","settings-item-margin":"settings-module_settings-item-margin__oc1Fk","settings-item":"settings-module_settings-item__Ub-iT","inverse":"settings-module_inverse__XIdK5","setting":"settings-module_setting__-4u4F"};
var stylesheet="a{color:#aaa}.settings-module_settings-section__tE36w>hr{display:none}.settings-module_settings-section__tE36w~.settings-module_settings-section__tE36w>hr{display:block;margin-top:1.5rem}.settings-module_settings-section__tE36w p{text-align:justify}.settings-module_settings-item-margin__oc1Fk{display:grid;margin-right:.5rem}.settings-module_settings-item__Ub-iT{align-items:center;display:grid;grid-template-columns:auto 1fr auto;margin-right:.5rem}.settings-module_settings-item__Ub-iT.settings-module_inverse__XIdK5{grid-template-columns:1fr auto 1fr;margin-left:.75rem;margin-right:1.25rem}.settings-module_settings-item__Ub-iT>hr{--un-border-opacity:1;background-color:initial;border-color:rgb(65 71 75/var(--un-border-opacity));border-style:dashed;border-width:1px;color:transparent;width:100%}.settings-module_setting__-4u4F{margin:.5rem .75rem}.settings-module_sidenote__mjM03{color:#aaa;font-size:.875rem;line-height:1.25rem}";

var _tmpl$ = /*#__PURE__*/web.template(`<hr>`),
  _tmpl$2 = /*#__PURE__*/web.template(`<h2>`),
  _tmpl$3 = /*#__PURE__*/web.template(`<p>`),
  _tmpl$4 = /*#__PURE__*/web.template(`<div><span></span><hr><div><input type=checkbox>`),
  _tmpl$5 = /*#__PURE__*/web.template(`<div><div><label> <!>: </label><input type=range>`),
  _tmpl$6 = /*#__PURE__*/web.template(`<div><hr><div><button></button></div><hr>`),
  _tmpl$7 = /*#__PURE__*/web.template(`<button>Reset`),
  _tmpl$8 = /*#__PURE__*/web.template(`<div><span>:</span><input style=width:100%>`),
  _tmpl$9 = /*#__PURE__*/web.template(`<div><span>:</span><select style=width:100%>`),
  _tmpl$0 = /*#__PURE__*/web.template(`<option>`),
  _tmpl$1 = /*#__PURE__*/web.template(`<div><p>`);

// Wrapper around IRF panel
class Section {
  constructor(name, settings, description) {
    this.name = name;
    this.settings = settings;
    this.description = description;
    this.container = document.createElement("div");
    this.render_header();
  }
  render_header() {
    this.container.classList.add(styles['settings-section']);
    const _self$ = this;
    const item = [_tmpl$(), (() => {
      var _el$2 = _tmpl$2();
      web.insert(_el$2, () => _self$.name);
      return _el$2;
    })(), web.createComponent(web.Show, {
      get when() {
        return _self$.description;
      },
      get children() {
        var _el$3 = _tmpl$3();
        web.effect(() => _el$3.innerHTML = _self$.description);
        return _el$3;
      }
    })];
    web.render(() => item, this.container);
  }
  add_checkbox(name, identifier, callback = undefined) {
    const _self$2 = this;
    const item = (() => {
      var _el$4 = _tmpl$4(),
        _el$5 = _el$4.firstChild,
        _el$6 = _el$5.nextSibling,
        _el$7 = _el$6.nextSibling,
        _el$8 = _el$7.firstChild;
      web.insert(_el$5, name);
      _el$8.addEventListener("change", e => {
        _self$2.settings[identifier] = e.currentTarget.checked;
        GM.setValues(_self$2.settings);
        if (callback) callback(e.currentTarget.checked);
      });
      web.effect(_p$ => {
        var _v$ = styles['settings-item'],
          _v$2 = styles['setting'],
          _v$3 = styles['setting'],
          _v$4 = IRF__namespace.ui.panel.styles.toggle;
        _v$ !== _p$.e && web.className(_el$4, _p$.e = _v$);
        _v$2 !== _p$.t && web.className(_el$5, _p$.t = _v$2);
        _v$3 !== _p$.a && web.className(_el$7, _p$.a = _v$3);
        _v$4 !== _p$.o && web.className(_el$8, _p$.o = _v$4);
        return _p$;
      }, {
        e: undefined,
        t: undefined,
        a: undefined,
        o: undefined
      });
      web.effect(() => _el$8.checked = _self$2.settings[identifier]);
      return _el$4;
    })();
    web.render(() => item, this.container);
  }
  add_slider(name, identifier, callback = undefined, slider_bits = [1, 17, .5]) {
    const [value, setValue] = solidJs.createSignal(this.settings[identifier]);
    solidJs.createEffect(solidJs.on(value, () => {
      this.settings[identifier] = value();
      GM.setValues(this.settings);
      if (callback) callback(value());
    }, {
      defer: true
    }));
    const item = (() => {
      var _el$9 = _tmpl$5(),
        _el$0 = _el$9.firstChild,
        _el$1 = _el$0.firstChild,
        _el$10 = _el$1.firstChild,
        _el$12 = _el$10.nextSibling;
        _el$12.nextSibling;
        var _el$13 = _el$1.nextSibling;
      web.insert(_el$1, name, _el$12);
      web.insert(_el$1, value, null);
      _el$13.$$input = e => setValue(e.target.value);
      web.effect(_p$ => {
        var _v$5 = styles['settings-item-margin'],
          _v$6 = styles['setting'],
          _v$7 = slider_bits[0],
          _v$8 = slider_bits[1],
          _v$9 = slider_bits[2],
          _v$0 = IRF__namespace.ui.panel.styles.slider;
        _v$5 !== _p$.e && web.className(_el$9, _p$.e = _v$5);
        _v$6 !== _p$.t && web.className(_el$0, _p$.t = _v$6);
        _v$7 !== _p$.a && web.setAttribute(_el$13, "min", _p$.a = _v$7);
        _v$8 !== _p$.o && web.setAttribute(_el$13, "max", _p$.o = _v$8);
        _v$9 !== _p$.i && web.setAttribute(_el$13, "step", _p$.i = _v$9);
        _v$0 !== _p$.n && web.className(_el$13, _p$.n = _v$0);
        return _p$;
      }, {
        e: undefined,
        t: undefined,
        a: undefined,
        o: undefined,
        i: undefined,
        n: undefined
      });
      web.effect(() => _el$13.value = value());
      return _el$9;
    })();
    web.render(() => item, this.container);
  }
  add_button(name, callback) {
    const item = (() => {
      var _el$14 = _tmpl$6(),
        _el$15 = _el$14.firstChild,
        _el$16 = _el$15.nextSibling,
        _el$17 = _el$16.firstChild;
      _el$17.$$click = () => callback();
      web.insert(_el$17, name);
      web.effect(_p$ => {
        var _v$1 = [styles['settings-item'], styles['inverse']].join(' '),
          _v$10 = styles['setting'];
        _v$1 !== _p$.e && web.className(_el$14, _p$.e = _v$1);
        _v$10 !== _p$.t && web.className(_el$16, _p$.t = _v$10);
        return _p$;
      }, {
        e: undefined,
        t: undefined
      });
      return _el$14;
    })();
    web.render(() => item, this.container);
  }
  add_input(name, identifier, type, callback, default_value) {
    const [value, setValue] = solidJs.createSignal(this.settings[identifier]);

    // We use on with defer here so the effect only runs when value changes
    // and not when the effect is initially created
    solidJs.createEffect(solidJs.on(value, () => {
      this.settings[identifier] = value();
      GM.setValues(this.settings);
      if (callback) callback(value());
    }, {
      defer: true
    }));
    const item = (() => {
      var _el$18 = _tmpl$8(),
        _el$19 = _el$18.firstChild,
        _el$20 = _el$19.firstChild,
        _el$21 = _el$19.nextSibling;
      web.insert(_el$19, name, _el$20);
      _el$21.addEventListener("change", e => setValue(e.target.value));
      web.setAttribute(_el$21, "type", type);
      web.insert(_el$18, web.createComponent(web.Show, {
        when: default_value,
        get children() {
          var _el$22 = _tmpl$7();
          _el$22.$$click = () => setValue(default_value);
          web.effect(() => web.className(_el$22, styles['setting']));
          return _el$22;
        }
      }), null);
      web.effect(_p$ => {
        var _v$11 = styles['settings-item'],
          _v$12 = styles['setting'];
        _v$11 !== _p$.e && web.className(_el$18, _p$.e = _v$11);
        _v$12 !== _p$.t && web.className(_el$19, _p$.t = _v$12);
        return _p$;
      }, {
        e: undefined,
        t: undefined
      });
      web.effect(() => _el$21.value = value());
      return _el$18;
    })();
    web.render(() => item, this.container);
  }
  add_dropdown(name, identifier, values, callback, default_value) {
    const [value, setValue] = solidJs.createSignal(this.settings[identifier]);

    // We use on with defer here so the effect only runs when value changes
    // and not when the effect is initially created
    solidJs.createEffect(solidJs.on(value, () => {
      this.settings[identifier] = value();
      GM.setValues(this.settings);
      if (callback) callback(value());
    }, {
      defer: true
    }));
    const item = (() => {
      var _el$23 = _tmpl$9(),
        _el$24 = _el$23.firstChild,
        _el$25 = _el$24.firstChild,
        _el$26 = _el$24.nextSibling;
      web.insert(_el$24, name, _el$25);
      _el$26.addEventListener("change", e => setValue(e.target.value));
      web.insert(_el$26, web.createComponent(solidJs.For, {
        each: values,
        children: item => (() => {
          var _el$28 = _tmpl$0();
          web.insert(_el$28, () => item[0]);
          web.effect(() => _el$28.value = item[1]);
          return _el$28;
        })()
      }));
      web.insert(_el$23, web.createComponent(web.Show, {
        when: default_value,
        get children() {
          var _el$27 = _tmpl$7();
          _el$27.$$click = () => setValue(default_value);
          web.effect(() => web.className(_el$27, styles['setting']));
          return _el$27;
        }
      }), null);
      web.effect(_p$ => {
        var _v$13 = styles['settings-item'],
          _v$14 = styles['setting'];
        _v$13 !== _p$.e && web.className(_el$23, _p$.e = _v$13);
        _v$14 !== _p$.t && web.className(_el$24, _p$.t = _v$14);
        return _p$;
      }, {
        e: undefined,
        t: undefined
      });
      web.effect(() => _el$26.value = value());
      return _el$23;
    })();
    web.render(() => item, this.container);
  }
  add_comment(text) {
    const item = (() => {
      var _el$29 = _tmpl$1(),
        _el$30 = _el$29.firstChild;
      _el$30.innerHTML = text;
      web.effect(_p$ => {
        var _v$15 = styles['settings-item-margin'],
          _v$16 = styles['setting'];
        _v$15 !== _p$.e && web.className(_el$29, _p$.e = _v$15);
        _v$16 !== _p$.t && web.className(_el$30, _p$.t = _v$16);
        return _p$;
      }, {
        e: undefined,
        t: undefined
      });
      return _el$29;
    })();
    web.render(() => item, this.container);
  }
  add_wide_comment(text) {
    const item = (() => {
      var _el$31 = _tmpl$3();
      _el$31.innerHTML = text;
      return _el$31;
    })();
    web.render(() => item, this.container);
  }
}
class Panel extends Section {
  constructor(name, settings, gm_info) {
    super(name, settings);
    this._irf_settings = IRF__namespace.ui.panel.createTabFor(gm_info, {
      tabName: name,
      style: stylesheet
    });
    this.container = this._irf_settings.container;
  }
  render_header() {}
  add_section(name, description) {
    const section = new Section(name, this.settings, description);
    this.container.appendChild(section.container);
    return section;
  }
}
web.delegateEvents(["input", "click"]);

// Default settings
const default_settings = {
  fadeSmoothTransitions: "aBitFiltered",
  fadeSharpTransitions: "aBitFiltered",
  animateFurtherStraights: true,
  betterFades: false,
  turnThreshold: 5,
  pauseKey: "Escape",
  resetViewKey: " ",
  scale: "100",
  fill: false,
  rotateArrowsWithHeading: true
};

// Initialise settings
const settings = default_settings;
const storedSettings = await( GM.getValues(Object.keys(settings)));
Object.assign(settings, storedSettings);
GM.setValues(settings);

// Update script name so it takes up less space
const gm_info = GM.info;
gm_info.script.name = "Advanced Interactive Street View";
gm_info.script.icon = null;

// Add the main panel
const panel = new Panel("AISV", settings, gm_info);

const vcontainer = await( IRF__namespace.vdom.container);
const voptions = await( IRF__namespace.vdom.options);

class AISVMessageEvent extends Event {}
class Messenger extends EventTarget {
  constructor(target, targetOrigin) {
    super();
    this.target = target;
    this.targetOrigin = targetOrigin;
    window.addEventListener("message", event => {
      var _event$data;
      if (event.origin !== this.targetOrigin) return;
      if ((_event$data = event.data) != null && _event$data.action) {
        const messageEvent = new AISVMessageEvent(`${event.data.action}`);
        messageEvent.args = event.data.args;
        this.dispatchEvent(messageEvent);
      }
    });
  }
  send(action, args) {
    this.target.postMessage({
      action,
      args
    }, this.targetOrigin);
  }
}

const pano0 = document.getElementById("pano0");
const pano1 = document.getElementById("pano1");

// We don't need `switchFrameOrder` since we're using our own iframe
const originalSwitchFrameOrder = vcontainer.methods.switchFrameOrder;
vcontainer.state.switchFrameOrder = new Proxy(originalSwitchFrameOrder, {
  apply: () => {}
});

// Add our own iframe
const iframe = document.createElement("iframe");
iframe.id = "aisv-iframe";
iframe.width = "100%";
iframe.height = "100%";
iframe.allowFullscreen = true;
iframe.classList.add("pano");
iframe.style.border = "0px";
iframe.style.zIndex = "-2";
iframe.style.pointerEvents = "auto";
iframe.dataset["v-5f07f20e"] = "";
pano1.parentNode.insertBefore(iframe, iframe.nextSibling);
const messenger = new Messenger(iframe.contentWindow, "https://www.google.com");

// Override the source setters on the existing iframes
pano0.src = "about:blank";
pano1.src = "about:blank";
[pano0, pano1].forEach(pano => {
  let _src_storage = "";
  Object.defineProperty(pano, "src", {
    get() {
      return _src_storage;
    },
    set(src) {
      _src_storage = src;
      setPanoFromURL(src);
    },
    configurable: true,
    enumerable: true
  });
});
let patchedSuccesfully = false;
function setPanoFromURL(urlString) {
  const url = new URL(urlString);
  if (!patchedSuccesfully) {
    url.hash = "aisv-frame";
    // Correct for smaller iframe size
    url.searchParams.set("pitch", (parseFloat(url.searchParams.get("pitch")) - 2).toString());
    iframe.src = url.toString();
    return;
  }
  if (url.origin !== 'https://www.google.com') return;
  messenger.send("setPano", {
    pano: url.searchParams.get("pano"),
    heading: parseFloat(url.searchParams.get("heading")),
    pitch: parseFloat(url.searchParams.get("pitch")) - 2,
    fov: parseFloat(url.searchParams.get("fov")),
    currentHeading: vcontainer.data.currentHeading,
    optionsN: vcontainer.data.currentOptions.length
  });
}

// Respond to confirm that we are an Internet Roadtrip frame
messenger.addEventListener("marco", () => {
  messenger.send("polo");
  patchedSuccesfully = true;
  unsafeWindow._AISV.patched = true;
});

// Expose an API

unsafeWindow._AISV = {
  messenger,
  patched: false
};

const fade_section = panel.add_section("Animations between locations", `When the car location changes,
we try to make the transition smooth by applying a slight or full fade.<br><br>
If the new location is nearby, there will be a "whoosh" animation between the two panoramas,
which we call a "smooth" transition. By default, we blur these slightly to obscure any artefacts.
<br><br>
If the new location is not connected or further away, there will be a sharp jump between the two,
which we call a "sharp" transition. By default, we fade the pano out slightly, but you may choose to
fade it out fully, obscuring the sharp changeover.
`);
const fadeOptions = [["No fade", ""], ["Slightly", "aBitFiltered"], ["Medium", "aBitMoreFiltered"], ["Fully", "filtered"]];
fade_section.add_dropdown("Fade during smooth transitions", "fadeSmoothTransitions", fadeOptions, value => {
  messenger.send("settingChanged", {
    identifier: "fadeSmoothTransitions",
    value: value
  });
}, "aBitFiltered");
fade_section.add_dropdown("Fade during sharp transitions", "fadeSharpTransitions", fadeOptions, value => {
  messenger.send("settingChanged", {
    identifier: "fadeSharpTransitions",
    value: value
  });
}, "aBitFiltered");
fade_section.add_wide_comment(`When we are going along a straight road, the game will often jump multiple
panoramas at a time, which creates a sharp transition. We make this into a smooth transition by executing
multiple jumps between the two panoramas, which creates smoother, but longer animation.`);
fade_section.add_checkbox("Animate multiple smooth transitions for longer jumps", "animateFurtherStraights", value => {
  messenger.send("settingChanged", {
    identifier: "animateFurtherStraights",
    value: value
  });
});
fade_section.add_wide_comment(`To avoid small, jarring jumps in heading, rotation is only animated if
the car turns by a high enough angle from where the viewer is currently pointed. You can change
this threshold here`);
fade_section.add_slider("Angle difference threshold for animation", "turnThreshold", value => {
  messenger.send("settingChanged", {
    identifier: "turnThreshold",
    value: value
  });
}, [0, 20, 1]);
const key_section = panel.add_section("Keyboard shortcuts", `Press space (" " here) to reset the view
to the "official" one, and escape to pause/unpause the view - good for taking screenshots,
especially on straight roads where the view changes often! You can also use the buttons on the
left of the radio for this.<br><br>
Check <a href="https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values"
target="_blank">here</a> for a list of possible key values (they should be fairly intuitive).
`);
key_section.add_input("Pause key", "pauseKey", "text", value => {
  messenger.send("settingChanged", {
    identifier: "pauseKey",
    value: value
  });
}, "Escape");
key_section.add_input("Reset view key", "resetViewKey", "text", value => {
  messenger.send("settingChanged", {
    identifier: "resetViewKey",
    value: value
  });
}, " ");
const performance_section = panel.add_section("Performance", `You can adapt the game's look
and potentially improve its performance by making the resolution smaller. Note that if
you enable scaling back to the full window, zooming and dragging may work weirdly.
`);
performance_section.add_slider("Street View window render scale", "scale", value => {
  messenger.send("settingChanged", {
    identifier: "scale",
    value: value
  });
}, [0, 100, 1]);
performance_section.add_checkbox("Fill window", "fill", value => {
  messenger.send("settingChanged", {
    identifier: "fill",
    value: value
  });
});
const ui_section = panel.add_section("UI", ``);
ui_section.add_checkbox("Rotate arrows as you pan", "rotateArrowsWithHeading", value => {
  messenger.send("settingChanged", {
    identifier: "rotateArrowsWithHeading",
    value: value
  });
});

var css_248z = "#aisv-buttons{bottom:-1px;color:#fff;display:flex;left:0;position:absolute;transform:rotate(-90deg);transform-origin:bottom left;z-index:-1}#aisv-buttons .aisv-button{margin:0;position:static;width:34px}#aisv-buttons .aisv-button:has(+.aisv-button){border-top-right-radius:0}#aisv-buttons .aisv-button+.aisv-button{border-top-left-radius:0}#aisv-buttons .aisv-button svg{transform:rotate(90deg)}#aisv-buttons .aisv-button.aisv-frosted{background:#5c89e9cc;background:linear-gradient(81deg,rgba(112,204,247,.6),#5c89e9cc 27%,#668de1cc 46%,#5c89e9cc 58%,rgba(209,248,255,.71));opacity:.75}.radio-body{border-bottom-left-radius:0!important}.voted{pointer-events:none}#aisv-iframe{height:100vh;position:absolute;top:0}body{height:auto!important;overflow:hidden}";

// Add a reset button
const radio = await( IRF__namespace.dom.radio);
const buttons = document.createElement("div");
buttons.id = "aisv-buttons";
radio.appendChild(buttons);
const reset = document.createElement("div");
reset.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="20" height="20" viewBox="0 0 5.56 5.56"><path d="M26 13.7a1.34 1.34 0 0 1 1.45-.56 1.34 1.34 0 0 1 1 1.18 1.34 1.34 0 0 1-.76 1.34 1.34 1.34 0 0 1-1.53-.28" style="fill:none;stroke:#fff;stroke-width:.5;stroke-linecap:butt;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke markers fill" transform="translate(-24.43 -11.67)"/><path d="M25.9 12.97v.85h.87" style="fill:none;stroke:#fff;stroke-width:.4;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke markers fill" transform="translate(-24.43 -11.67)"/></svg>';
reset.classList.add("odometer-container");
reset.classList.add("aisv-button");
reset.dataset["v-259ab0e2"] = "";
buttons.appendChild(reset);
reset.addEventListener("click", () => {
  messenger.send("resetPov");
});
const pause = document.createElement("div");
pause.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="20" height="20" viewBox="0 0 5.56 5.56"><path d="M26.06 4.29V.86M28.36 4.29V.86" style="fill:none;stroke:#fff;stroke-width:1.2;stroke-linecap:butt;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke markers fill" transform="translate(-24.43 .2)"/></svg>';
pause.classList.add("odometer-container");
pause.classList.add("aisv-button");
pause.dataset["v-259ab0e2"] = "";
buttons.appendChild(pause);
pause.addEventListener("click", () => {
  messenger.send("togglePaused");
});

// Add event hooks
messenger.addEventListener("setFrosted", event => {
  const element = {
    "togglePauseBtn": pause,
    "resetPovBtn": reset
  }[event.args.thing];
  element.classList.toggle("aisv-frosted", event.args.frosted);
});
messenger.addEventListener("marco", () => {
  // Occasionally the pause button gets stuck in frosted state
  // if the frame is loaded twice, so explictly unfreeze it once
  // the SV frame says hello
  pause.classList.toggle("aisv-frosted", false);
});

GM.addStyle(css_248z);

// Keyboard shortcuts
document.addEventListener("keydown", event => {
  if (event.key == settings.pauseKey) {
    event.preventDefault();
    messenger.send("togglePaused");
  }
  if (event.key == settings.resetViewKey) {
    event.preventDefault();
    messenger.send("resetPov");
  }
});

// Heading handling and switchFrameOrder
let currentPanoramaHeading = vcontainer.data.currentHeading;
messenger.addEventListener("setHeading", event => {
  currentPanoramaHeading = event.args.heading;
  document.querySelectorAll('.option').forEach(async (option, index) => {
    option.style.rotate = `${voptions.methods.getRotation(index)}deg`;
  });
});
messenger.addEventListener("marco", patchHeading);
function patchHeading() {
  voptions.state.getRotation = new Proxy(voptions.methods.getRotation, {
    apply: (target, thisArg, args) => {
      // Multiplication by 1.25 offsets the vanilla game's multiplication by 0.8.
      // This way, the arrows actually point towards the road they correspond to.
      const angle = Reflect.apply(target, thisArg, args) * 1.25;
      if (!settings.rotateArrowsWithHeading) {
        return angle;
      }
      return angle - (currentPanoramaHeading - vcontainer.data.currentHeading) % 360;
    }
  });

  // Only need to do this patch once
  messenger.removeEventListener("marco", patchHeading);
}

})(VM.solid.web, IRF, VM.solid);

} else if (location.hash === "#aisv-frame") {
    // We're inside a Street View embed iframe, inject SV logic
    console.log("[AISV-sv] Inside Street View");
(async function () {
'use strict';

class AISVMessageEvent extends Event {}
class Messenger extends EventTarget {
  constructor(target, targetOrigin) {
    super();
    this.target = target;
    this.targetOrigin = targetOrigin;
    window.addEventListener("message", event => {
      var _event$data;
      if (event.origin !== this.targetOrigin) return;
      if ((_event$data = event.data) != null && _event$data.action) {
        const messageEvent = new AISVMessageEvent(`${event.data.action}`);
        messageEvent.args = event.data.args;
        this.dispatchEvent(messageEvent);
      }
    });
  }
  send(action, args) {
    this.target.postMessage({
      action,
      args
    }, this.targetOrigin);
  }
}

// Default settings
const default_settings = {
  fadeSmoothTransitions: "aBitFiltered",
  fadeSharpTransitions: "aBitFiltered",
  animateFurtherStraights: true,
  betterFades: false,
  turnThreshold: 5,
  pauseKey: "Escape",
  resetViewKey: " ",
  scale: "100",
  fill: false,
  rotateArrowsWithHeading: true
};

const settings = default_settings;
const storedSettings = await( GM.getValues(Object.keys(settings)));
Object.assign(settings, storedSettings);

// Override clearColor to make the SV canvas background transparent.
// Override clear to preserve contents and avoid weird jumps during rendering.
const originalGetContext = HTMLCanvasElement.prototype.getContext;
let overrideCanvasClear = true;
function setOverrideCanvasClear(value) {
  overrideCanvasClear = value;
}
HTMLCanvasElement.prototype.getContext = function (type, args) {
  if (type === 'webgl' || type === 'experimental-webgl') {
    args = Object.assign({}, args, {
      preserveDrawingBuffer: settings.betterFades
    });
    const ctx = originalGetContext.call(this, type, args);

    // Override clearColor to make the canvas always transparent
    // const originalClearColor = ctx.clearColor.bind(ctx);
    ctx.clearColor = function () {};

    // Override clear to avoid the canvas blinking to nothing
    const originalClear = ctx.clear.bind(ctx);
    if (!settings.betterFades) ctx.clear = function (mask) {
      if (overrideCanvasClear) return;
      originalClear(mask);
    };
    return ctx;
  } else {
    return originalGetContext.call(this, type, args);
  }
};

// Waiting based on Netux's implementation in the Pathfinder

const waitForOnApiLoad = new Promise(resolve => {
  if (unsafeWindow.onApiLoad) {
    resolve(unsafeWindow.onApiLoad);
    return;
  }
  let _onApiLoad;
  Object.defineProperty(unsafeWindow, "onApiLoad", {
    get() {
      return _onApiLoad;
    },
    set(onApiLoad) {
      _onApiLoad = onApiLoad;
      resolve(onApiLoad);
    },
    configurable: true,
    enumerable: true
  });
});

// Override the StreetViewPanorama function to get the embed's instance
const waitForInstances = new Promise(resolve => {
  waitForOnApiLoad.then(originalOnApiLoad => {
    unsafeWindow.onApiLoad = function (args) {
      const originalConstructor = unsafeWindow.google.maps.StreetViewPanorama;

      // @ts-expect-error We are overriding a constructor in a slightly silly way here
      unsafeWindow.google.maps.StreetViewPanorama = function (container, opts) {
        const instance = new originalConstructor(container, opts);
        unsafeWindow._SVP = instance;
        // Add all the event listeners for debugging
        // [
        //     "pano_changed",
        //     "keydown",
        //     "status_changed",
        //     "visible_changed",
        //     "resize",
        //     "closeclick",
        //     "addresscontrol_changed",
        //     "clicktogo_changed",
        //     "disabledefaultui_changed",
        //     "disabledoubleclickzoom_changed",
        //     "enableclosebutton_changed",
        //     "imagedatecontrol_changed",
        //     "linkscontrol_changed",
        //     "pancontrol_changed",
        //     "scrollwheel_changed",
        //     "zoomcontrol_changed",
        //     "addresscontroloptions_changed",
        //     "pancontroloptions_changed",
        //     "zoomcontroloptions_changed",
        //     "panoprovider_changed",
        //     "pov_changed",
        //     "shouldUseRTLControlsChange",
        //     "motiontrackingcontroloptions_changed"
        // ].forEach((name) => {
        //     instance.addListener(name, (event) => {
        //         console.debug(name, event);
        //     })
        // })

        const service = new unsafeWindow.google.maps.StreetViewService();
        unsafeWindow._SVS = service;
        resolve([instance, service]);
        return instance;
      };
      return originalOnApiLoad(args);
    };
  });
});
const [instance, service] = await( waitForInstances);
const messenger = new Messenger(window.parent, "https://neal.fun");

var css_248z = "html{background-color:#46484f;background:linear-gradient(#bad7f9 34%,#859e53,#8a878e 90%)}body{height:var(--aisv-scale,100%)!important;left:calc((100% - var(--aisv-scale, 100%))/2);position:relative;top:calc((100% - var(--aisv-scale, 100%))/2);width:var(--aisv-scale,100%)!important}#mapDiv{filter:none;transition:filter .15s}#mapDiv.filtered{filter:blur(15px) grayscale(1) opacity(0);pointer-events:none}#mapDiv.better.filtered{filter:opacity(0);pointer-events:none}#mapDiv.aBitFiltered{filter:blur(5px) grayscale(.1) opacity(.9);pointer-events:none}#mapDiv.aBitMoreFiltered{filter:blur(8px) grayscale(.1) opacity(.7);pointer-events:none}#mapDiv .widget-scene{cursor:move!important}#mapDiv,.gm-style>div,.mapsConsumerUiSceneCoreScene__canvas,.widget-scene{background:none!important}.gm-style-cc,.gmnoprint,img[alt~=Google]{display:none}#second-canvas{left:0;position:absolute;top:0;z-index:-1}";

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

class AsyncAbortSignal extends EventTarget {
  constructor(...args) {
    super(...args);
    this.aborted = false;
  }
  async protect(callback) {
    if (this.aborted) {
      return;
    }
    const callbackResult = callback();
    this.currentActionPromise = callbackResult instanceof Promise ? callbackResult.then(() => {/* no-op */}) : Promise.resolve();
    return callbackResult;
  }
  static dummy() {
    const signal = new AsyncAbortSignal();
    signal.protect = () => Promise.resolve();
    return signal;
  }
}
class AsyncAbortController {
  constructor() {
    this.refresh();
  }
  async abort(reason) {
    this.signal.aborted = true;
    this.signal.reason = reason;
    this.signal.dispatchEvent(new Event('abort'));
    await this.signal.currentActionPromise;
  }
  async refresh() {
    if (this.signal != null) {
      await this.abort();
    }
    this.signal = new AsyncAbortSignal();
    return this;
  }
}
const changePanoAsyncAbortController = new AsyncAbortController();
const animatePovAsyncAbortController = new AsyncAbortController();

const asyncTimeout = (ms, options) => new Promise((resolve, reject) => {
  setTimeout(resolve, ms);
});

// Normalize angles to [0, 360)
function normalizeAngle(angle) {
  return (angle % 360 + 360) % 360;
}

// Shortest angular distance between two headings
function shortestAngleDist(a, b) {
  let diff = normalizeAngle(b) - normalizeAngle(a);
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}
function closestLinkToHeading(links, heading) {
  let best = null;
  links.forEach(link => {
    const diff = Math.abs(shortestAngleDist(heading, link.heading));
    if (best == null || diff < best.diff) {
      best = {
        link,
        diff
      };
    }
  });
  if (best && best.diff < 120) {
    return best.link;
  }
}

// The conversion between zoom and fov is hardcoded into the SV embed API backend
// This is just a linear interpolation approximation of whatever function they use
const fovs = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
const zooms = [0.14691402, 0.400000006, 0.653085947, 0.914145529, 1.192481279, 1.500645995, 1.858107567, 2.299968719, 2.903674841, 3.914760113];
function fovToZoom(fov) {
  for (let i = 0; i < fovs.length - 1; i++) {
    if (fovs[i + 1] <= fov) {
      return zooms[i] + (fov - fovs[i]) / (fovs[i + 1] - fovs[i]) * (zooms[i + 1] - zooms[i]);
    }
  }
}

// Get the main embed element
const mapDiv = document.getElementById("mapDiv");

// Set some map styles
document.body.style.setProperty('--aisv-scale', settings.scale ? `${settings.scale}%` : "");
document.body.style.transform = settings.fill ? `scale(${100 / parseFloat(settings.scale)})` : "none";
messenger.addEventListener("settingChanged", event => {
  if (event.args.identifier === "scale") {
    document.body.style.setProperty('--aisv-scale', `${event.args.value}%`);
    document.body.style.transform = settings.fill ? `scale(${100 / parseFloat(event.args.value)})` : "none";
  }
  if (event.args.identifier == "fill") document.body.style.transform = event.args.value ? `scale(${100 / parseFloat(settings.scale)})` : "none";
});

// Better fades with another canvas
let copyCanvas = () => {};
if (settings.betterFades) {
  mapDiv.classList.add("better");
  const second_canvas = document.createElement("canvas");
  const ctx = second_canvas.getContext("2d");
  second_canvas.id = "second-canvas";
  document.body.append(second_canvas);
  copyCanvas = () => {
    const first_canvas = document.getElementsByClassName("mapsConsumerUiSceneCoreScene__canvas widget-scene-canvas")[0];
    second_canvas.width = first_canvas.width;
    second_canvas.height = first_canvas.height;
    ctx.drawImage(first_canvas, 0, 0);
  };
}
let currentlyFadeTransitioning = false;
async function withFadeTransition(callback, filterClass) {
  if (currentlyFadeTransitioning) {
    // Fade transition inside fade transition
    // Simply let the callback run through.
    return callback();
  }
  if (filterClass != null && filterClass !== "") {
    console.debug("[AISV-sv] Fade in", filterClass);
    currentlyFadeTransitioning = true;
    mapDiv.classList.toggle(filterClass, true);
    if (filterClass === "filtered") copyCanvas();
  }
  const result = await callback();
  if (filterClass != null && filterClass !== "") {
    console.debug("[AISV-sv] Fade out", filterClass);
    mapDiv.classList.toggle(filterClass, false);
    currentlyFadeTransitioning = false;
  }
  return result;
}
const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
async function animatePov(targetPov, speed) {
  await animatePovAsyncAbortController.refresh();
  return new Promise(resolve => {
    const startPov = instance.getPov();
    const startTime = performance.now();
    const headingDiff = shortestAngleDist(startPov.heading, targetPov.heading);
    const duration = Math.max(speed * Math.abs(headingDiff) / 180, 100);
    function step(now) {
      if (animatePovAsyncAbortController.signal.aborted) {
        return;
      }
      const elapsed = now - startTime;
      const t = Math.max(0, Math.min(elapsed / duration, 1)); // progress 0..1
      const easedT = easeInOutQuad(t);
      const newPov = _extends({}, startPov);

      // Interpolate heading with shortest path
      newPov.heading = normalizeAngle(startPov.heading + headingDiff * easedT);
      if (targetPov.pitch != null) {
        // Interpolate pitch linearly
        newPov.pitch = startPov.pitch + (targetPov.pitch - startPov.pitch) * easedT;
      }
      if (targetPov.zoom != null) {
        // Interpolate zoom linearly if needed
        newPov.zoom = startPov.zoom !== undefined && targetPov.zoom !== undefined ? startPov.zoom + (targetPov.zoom - startPov.zoom) * easedT : targetPov.zoom || 0;
      }
      instance.setPov(newPov);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }
    requestAnimationFrame(step);
  });
}

// State
let internalHeading = instance.getPov().heading;
const originalSearchParams = new URL(window.location.href).searchParams;
let canonicalPov = {
  heading: parseFloat(originalSearchParams.get("heading")),
  pitch: parseFloat(originalSearchParams.get("pitch")),
  fov: parseFloat(originalSearchParams.get("fov"))
};
let prev_pano = instance.getPano();
let lastSetPanoMessageData = null;

// Handle pausing updates
let updatesPaused = false;
let updatesPausedManually = false;
async function pauseUpdates(pause, source) {
  if (!pause && lastSetPanoMessageData) {
    handleSetPanoMessage(lastSetPanoMessageData, updatesPausedManually ? 'smooth' : 'instant');
  }
  updatesPaused = pause;
  updatesPausedManually = pause && source === 'manual';
  messenger.send("setFrosted", {
    thing: "togglePauseBtn",
    frosted: updatesPaused
  });
}
document.addEventListener('visibilitychange', async () => {
  if (document.hidden) {
    instance.setVisible(false);
    if (!updatesPausedManually) {
      pauseUpdates(true, 'document-visibility');
    }
  } else {
    instance.setVisible(true);
    if (!updatesPausedManually) {
      pauseUpdates(false, 'document-visibility');
    }
  }
});
async function toggleManualPause() {
  prev_pano = instance.getPano();
  pauseUpdates(!updatesPaused, 'manual');
  await changePanoAsyncAbortController.abort();
}

// Handle message events
async function handleSetPano(event) {
  if (!updatesPaused) {
    await handleSetPanoMessage(event.args, 'smooth');
  }
  lastSetPanoMessageData = event.args;
}
async function handleSetPanoMessage(args, mode) {
  console.debug("%c[AISV-sv] Setting pano", "font-size: 2em;", args.pano);

  // Store the canonical values
  canonicalPov = {
    heading: args.heading,
    pitch: args.pitch,
    fov: args.fov
  };
  const doInstantJump = mode === 'instant';
  if (prev_pano === args.pano || Math.abs(shortestAngleDist(internalHeading, args.heading)) > settings.turnThreshold) {
    // Only animate the heading if it's a
    // significant change or the pano hasn't changed
    // (dead end)
    const userHeadingOffset = shortestAngleDist(instance.getPov().heading, internalHeading);
    internalHeading = args.heading;
    await withFadeTransition(async () => {
      const targetHeading = internalHeading - userHeadingOffset;
      if (doInstantJump) {
        // Wait for CSS transition to finish before snapping Pov
        await asyncTimeout(150);
        instance.setPov(_extends({}, instance.getPov(), {
          heading: targetHeading
        }));
      } else {
        await animatePov({
          heading: targetHeading
        }, 1000);
      }
      await changePano(args, doInstantJump);
      prev_pano = args.pano;
    }, doInstantJump ? "filtered" : null);
  } else {
    // Keeping angle the same
    await changePano(args, doInstantJump);
    prev_pano = args.pano;
  }
  messenger.send("setPanoDone");
}

// Change the pano
async function changePano(args, instantJump) {
  await changePanoAsyncAbortController.refresh();

  // Do nothing if it's the same pano
  if (prev_pano && instance.getPano() !== prev_pano) console.log("[AISV-sv] Prev pano not equal to current!", prev_pano, instance.getPano());
  if (prev_pano === args.pano) return;
  let service_pano;
  try {
    // @ts-expect-error For some reason getPanoramaById is not included in the types
    service_pano = await service.getPanoramaById(prev_pano);
  } catch (_unused) {
    // prev_pano may be invalid post-void
    // @ts-expect-error For some reason getPanoramaById is not included in the types
    service_pano = await service.getPanoramaById(instance.getPano());
  }
  let links = service_pano.data.links;

  // If the pano is linked, great, just go there
  if (links.some(({
    pano
  }) => pano === args.pano)) {
    console.debug("[AISV-sv] Pano is linked, jumping directly");
    await changePanoAsyncAbortController.signal.protect(async () => await withFadeTransition(async () => {
      // Generally, overriding the clear is a good trade-off as it
      // prevents the worst kind of artefact - the canvas going fully blank.
      // Unfortunately, sometimes this leads to "glittery" artefacts on coverage
      // with no LIDAR data (I think), where the two image planes intersect.
      // This is most visible on single jumps, so for single jumps I let the canvas
      // clear, and for all other transition types I accept the risk of jitter
      // to remove the risk of the canvas blanking entirely.
      setOverrideCanvasClear(false);
      await setPanoAndWait(args.pano);
      setOverrideCanvasClear(true);
    }, settings.fadeSmoothTransitions));
    return;
  } else if (settings.animateFurtherStraights && !instantJump && args.optionsN === 1) {
    // Also filter by angle
    // The pano is not linked. Sigh.
    // We won't get a nice animation if we jump straight into it.
    // Since there was only one option, this could have been
    // a further straight, in which case we may be able to get there
    // in a couple of jumps.
    const path = [];
    for (let i = 0; i < 5; i++) {
      if (changePanoAsyncAbortController.signal.aborted) {
        return;
      }
      const closestLink = closestLinkToHeading(links, args.currentHeading);
      if (!closestLink) break;
      path.push(closestLink.pano);
      if (closestLink.pano == args.pano) {
        // Congrats, we've found a path!
        console.debug("[AISV-sv] Further straight found, executing jumps", path);
        await withFadeTransition(async () => {
          for (const [index, pano] of path.entries()) {
            await changePanoAsyncAbortController.signal.protect(() => setPanoAndWait(pano));
            // Increase the wait time between these to reduce artefacts
            if (index < path.length - 1) await asyncTimeout(70);
          }
        }, settings.fadeSmoothTransitions);
        return;
      } else {
        // @ts-expect-error For some reason getPanoramaById is not included in the types
        service_pano = await service.getPanoramaById(closestLink.pano);
        links = service_pano.data.links;
      }
    }
  }
  if (changePanoAsyncAbortController.signal.aborted) {
    return;
  }

  // The pano is not linked, and we weren't able to find a further straight
  console.debug("[AISV-sv] Pano not linked, no further straight found");
  await changePanoAsyncAbortController.signal.protect(async () => await withFadeTransition(async () => {
    // setPanoAndWait is not perfect, this seems like a decent heuristic
    await asyncTimeout(50);
    await setPanoAndWait(args.pano);
    await asyncTimeout(100);
  }, settings.fadeSharpTransitions));
}
async function setPanoAndWait(pano) {
  return new Promise(resolve => {
    let last_pov_changed = undefined;
    let status_changed = false;
    // Usually no more pov_change events after 50ms have elapsed, leave a bit of margin
    const wait_time = 175;
    function checkAndResolve() {
      if (status_changed && last_pov_changed && Date.now() - last_pov_changed > wait_time || last_pov_changed && Date.now() - last_pov_changed > 600 // timeout
      ) {
        console.debug("[AISV-sv] Assuming done", Date.now() - last_pov_changed);
        povChangedListener.remove();
        resolve();
      } else {
        setTimeout(checkAndResolve, 10);
      }
    }
    const povChangedListener = instance.addListener('pov_changed', () => {
      last_pov_changed = Date.now();
    });
    const statusChangedListener = instance.addListener('status_changed', () => {
      console.debug("[AISV-sv] Status changed");
      status_changed = true;
      statusChangedListener.remove();
    });
    console.debug("[AISV-sv] Setting pano and waiting", pano);
    instance.setPano(pano);
    setTimeout(checkAndResolve, wait_time);
  });
}

// Reset the POV to canonical
function resetPov() {
  internalHeading = canonicalPov.heading;
  animatePov({
    heading: canonicalPov.heading,
    pitch: canonicalPov.pitch,
    zoom: fovToZoom(canonicalPov.fov)
  }, 250);
  messenger.send("setFrosted", {
    thing: "resetPovBtn",
    frosted: true
  });
  setTimeout(() => {
    messenger.send("setFrosted", {
      thing: "resetPovBtn",
      frosted: false
    });
  }, 200);
}

// Send a message to the parent window to verify that it is neal.fun
messenger.send("marco");
messenger.addEventListener("polo", handleInitialResponse);
function handleInitialResponse() {
  // We are an iframe inside the Internet Roadtrip.
  // Install all of the required hooks.
  console.log("[AISV-sv] Roadtrip connection confirmed!", instance, service);
  messenger.removeEventListener("polo", handleInitialResponse);

  // Inject styles and SV instance options
  GM.addStyle(css_248z);
  instance.setOptions({
    clickToGo: false,
    disableDefaultUI: true
  });

  // Add message hooks
  messenger.addEventListener("setPano", handleSetPano);
  messenger.addEventListener("resetPov", resetPov);
  messenger.addEventListener("togglePaused", toggleManualPause);
  messenger.addEventListener("settingChanged", event => {
    settings[event.args.identifier] = event.args.value;
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", event => {
    if (event.key === settings.pauseKey) toggleManualPause();
    if (event.key === settings.resetViewKey) resetPov();
    messenger.send("keyDown", {
      key: event.key
    });
  });

  // Let the parent frame know when the heading changes
  {
    let lastHeading = null;
    let lastZoom = null;
    instance.addListener('pov_changed', () => {
      var _instance$getPov, _instance$getPov2;
      const heading = (_instance$getPov = instance.getPov()) == null ? void 0 : _instance$getPov.heading;
      if (heading && heading !== lastHeading) {
        lastHeading = heading;
        messenger.send("setHeading", {
          heading
        });
      }

      // The types don't include zoom, but it's always returned
      const zoom = (_instance$getPov2 = instance.getPov()) == null ? void 0 : _instance$getPov2.zoom;
      if (zoom && zoom !== lastZoom) {
        lastZoom = zoom;
        messenger.send("zoomChanged", {
          zoom
        });
      }
    });
  }
}

})();

}

})(IRF);
