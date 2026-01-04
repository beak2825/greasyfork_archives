// ==UserScript==
// @namespace          runonstof
// @name               Jump Block
// @version            1.0.1
// @description        A configurable jump block. It will take the model from its neighbor, by checking the blocks down and around it.
// @author             Runonstof
// @license            MIT
// @minecraft          1.20.1
// @match              https://customnpcs.com
// @scripttype         block
// @downloadURL https://update.greasyfork.org/scripts/549551/Jump%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/549551/Jump%20Block.meta.js
// ==/UserScript==

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(t, "prototype", {
    writable: !1
  }), e && _setPrototypeOf(t, e);
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

if (!Array.from) {
  Object.defineProperty(Array, 'from', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(arrayLike) {
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // Handle array-like objects
      var len = arrayLike.length >>> 0;
      var result = new Array(len);
      for (var i = 0; i < len; i++) {
        result[i] = arrayLike[i];
      }
      return result;
    }
  });
}
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(callback) {
      for (var i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
          return this[i];
        }
      }
      return undefined;
    }
  });
}
if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    value: function value(depth) {

      var array = this;
      var maxDepth = depth === Infinity ? Number.MAX_SAFE_INTEGER : parseInt((depth === null || depth === void 0 ? void 0 : depth.toString()) || '1', 10) || 1;
      var currentDepth = 0;

      // It's not an array or it's an empty array, return the object.
      if (!Array.isArray(array) || !array.length) {
        return array;
      }

      // If the first element is itself an array and we're not at maxDepth,
      // flatten it with a recursive call first.
      // If the first element is not an array, an array with just that element IS the
      // flattened representation.
      // **Edge case**: If the first element is an empty element/an "array hole", skip it.
      // (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#Examples)
      var firstElemFlattened = Array.isArray(array[0]) && currentDepth < maxDepth ? array[0].flat(maxDepth - 1) : array[0] === undefined ? [] : [array[0]];
      return firstElemFlattened.concat(array.slice(1).flat(maxDepth - 1));
    },
    enumerable: false,
    configurable: true,
    writable: true
  });
}
if (!String.prototype.includes) {
  Object.defineProperty(String.prototype, 'includes', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(search, start) {
      if (typeof start !== 'number') {
        start = 0;
      }
      if (start + search.length > this.length) {
        return false;
      }
      return this.indexOf(search, start) !== -1;
    }
  });
}
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(target) {
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }
      var to = Object(target);
      for (var i = 0; i < (arguments.length <= 1 ? 0 : arguments.length - 1); i++) {
        var nextSource = i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0; nextIndex < keysArray.length; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}
if (!Object.entries) {
  Object.defineProperty(Object, 'entries', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(obj) {
      var ownProps = Object.keys(obj);
      var i = ownProps.length;
      var resArray = new Array(i);
      while (i--) {
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
      }
      return resArray;
    }
  });
}
if (!Object.fromEntries) {
  Object.defineProperty(Object, 'fromEntries', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(entries) {
      var obj = {};
      var entriesArray = Array.from(entries);
      for (var i = 0; i < entriesArray.length; i++) {
        var _entriesArray$i = _slicedToArray(entriesArray[i], 2),
          key = _entriesArray$i[0],
          value = _entriesArray$i[1];
        obj[key] = value;
      }
      return obj;
    }
  });
}
Java.type('java.util.Base64');
Java.type('java.lang.String');

var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
API.getIWorld('minecraft:overworld');

var _GUI_IDS = {};
var _GUI_EVENT_LISTENERS = {};
function id(name) {
  // generate random name if name is not provided
  if (!name) {
    name = Math.random().toString(36).substring(2, 15);
  }
  return _GUI_IDS[name] = _GUI_IDS[name] || Object.keys(_GUI_IDS).length + 1;
}
function listen(id, callback) {
  if (!_GUI_EVENT_LISTENERS[id]) {
    _GUI_EVENT_LISTENERS[id] = [];
  }
  _GUI_EVENT_LISTENERS[id].push(callback);
}
function unlistenAll(id) {
  if (!_GUI_EVENT_LISTENERS[id]) {
    return;
  }
  _GUI_EVENT_LISTENERS[id] = [];
}
function emit(id, data) {
  if (!_GUI_EVENT_LISTENERS[id]) {
    return;
  }
  _GUI_EVENT_LISTENERS[id].forEach(function (callback) {
    return callback(data);
  });
}
var BaseGui = /*#__PURE__*/function () {
  function BaseGui(id, width, height, player) {
    _classCallCheck(this, BaseGui);
    this.gui = API.createCustomGui(id, width, height, false, player);
    this.state = {};
    this.lastState = null;
    this.player = player;
  }
  return _createClass(BaseGui, [{
    key: "clearGui",
    value: function clearGui() {
      var gui = this.player.getCustomGui();
      if (!gui) {
        return;
      }
      var components = Java.from(gui.getComponents());
      components.forEach(function (component) {
        gui.removeComponent(component.getID());
      });
      var scrollpanel = gui.getScrollingPanel();
      var scrollComponents = Java.from(scrollpanel.getComponents());
      scrollComponents.forEach(function (component) {
        scrollpanel.removeComponent(component.getID());
      });
    }

    /**
     * Sets the current state as the last state
     * Warning: Only shallow copy of the state is made
     */
  }, {
    key: "pushState",
    value: function pushState() {
      this.lastState = _objectSpread2({}, this.state);
    }
  }, {
    key: "stateChanged",
    value: function stateChanged(key) {
      return this.lastState[key] !== this.state[key];
    }
  }, {
    key: "init",
    value: function init() {
      // Optional override
    }
  }, {
    key: "render",
    value: function render() {
      throw new Error('render method must be implemented');
    }
  }, {
    key: "update",
    value: function update() {
      throw new Error('update method must be implemented');
    }
  }, {
    key: "onClose",
    value: function onClose() {
      // Optional override
    }
  }]);
}();
var gui = {
  id: id,
  listen: listen,
  emit: emit,
  unlistenAll: unlistenAll
};

var _excluded = ["children"],
  _excluded2 = ["children"];
function createElement(type, _ref) {
  var _ref$children = _ref.children,
    children = _ref$children === void 0 ? [] : _ref$children,
    props = _objectWithoutProperties(_ref, _excluded);
  if (typeof children === 'function') {
    children = [children];
  }
  // Flatten children array
  children = children.flat(Infinity).filter(function (child) {
    return child !== null && child !== undefined && child !== false;
  });

  // Handle different element types
  if (typeof type === 'string') {
    return createGuiElementCallback(type, _objectSpread2(_objectSpread2({}, props), {}, {
      children: children
    }));
  } else if (typeof type === 'function') {
    // Handle functional components
    return type(_objectSpread2(_objectSpread2({}, props), {}, {
      children: children
    }));
  } else {
    throw new Error("Unknown element type: ".concat(type));
  }
}

// jsx function for single child elements
function jsx(type, props, key) {
  return createElement(type, props);
}

// jsxs function for multiple children elements
function jsxs(type, props, key) {
  return createElement(type, props);
}

// Fragment support
function Fragment(_ref2) {
  var children = _ref2.children,
    _ref2$x = _ref2.x,
    x = _ref2$x === void 0 ? 0 : _ref2$x,
    _ref2$y = _ref2.y,
    y = _ref2$y === void 0 ? 0 : _ref2$y;
  var parentContext = {
    x: x,
    y: y
  };
  return function (gui) {
    var higherParentContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _higherParentContext$ = higherParentContext.x,
      hpX = _higherParentContext$ === void 0 ? 0 : _higherParentContext$,
      _higherParentContext$2 = higherParentContext.y,
      hpY = _higherParentContext$2 === void 0 ? 0 : _higherParentContext$2;
    var useParentContext = {
      x: hpX + parentContext.x,
      y: hpY + parentContext.y
    };
    children.forEach(function (child) {
      return typeof child === 'function' ? child(gui, useParentContext) : child;
    });
    return {
      children: children
    };
  };
}
function createGuiElementCallback(type, _ref3) {
  var children = _ref3.children,
    props = _objectWithoutProperties(_ref3, _excluded2);
  if (typeof props.id === 'undefined') {
    throw new Error("id property is required for ".concat(type));
  }
  var dynamicProps = ['enabled', 'visible', 'scale', 'centered', 'text', 'label', 'color', 'hoverText', 'thickness', 'hasSearch', 'list'];

  /**
   *
   * @param {ICustomGui} gui
   * @returns {ICustomGuiComponent}
   */
  var findOrCreateComponent = function findOrCreateComponent(gui) {
    var parentContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var component;
    if (type !== 'scrollpanel' && (component = gui.getComponent(id(props.id)))) {
      return component;
    }
    var sumParentContextProperty = function sumParentContextProperty(localProp) {
      var parentProp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var localDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      parentProp = parentProp || localProp;
      if (typeof parentContext[parentProp] === 'undefined') {
        return;
      }
      var localValue = props.hasOwnProperty(localProp) ? props[localProp] : localDefault;

      // CHECK: this can have side effects
      props[localProp] = parentContext[parentProp] + localValue;
    };
    sumParentContextProperty('x');
    sumParentContextProperty('y');
    switch (type) {
      case 'button':
        return gui.addButton(id(props.id), props.text, props.x || 0, props.y || 0, props.width || 0, props.height || 0);
      case 'label':
        return gui.addLabel(id(props.id), props.text, props.x || 0, props.y || 0, props.width || 0, props.height || 0, props.color || 0xFFFFFFFF);
      case 'textfield':
        return gui.addTextField(id(props.id), props.x || 0, props.y || 0, props.width || 0, props.height || 0);
      case 'scroll':
        return gui.addScroll(id(props.id), props.x || 0, props.y || 0, props.width || 0, props.height || 0, props.list || []);
      case 'line':
        sumParentContextProperty('x1', 'x');
        sumParentContextProperty('y1', 'y');
        sumParentContextProperty('x2', 'x');
        sumParentContextProperty('y2', 'y');
        return gui.addColoredLine(id(props.id), props.x1 || 0, props.y1 || 0, props.x2 || 0, props.y2 || 0, props.color || 0xFFFFFFFF, props.thickness || 1);
      case 'scrollpanel':
        var panel = gui.getScrollingPanel();
        if (!props.initialized) {
          panel.init(props.x || 0, props.y || 0, props.width || 0, props.height || 0);
        }
        children.forEach(function (child) {
          return typeof child === 'function' ? child(panel) : child;
        });
        return panel;
    }
    throw new Error("Unknown element type: ".concat(type));
  };
  return function (gui$1) {
    var parentContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var component = findOrCreateComponent(gui$1, parentContext);
    gui.unlistenAll(id(props.id));
    if (props.hasOwnProperty('onClick')) {
      gui.listen(id(props.id), props.onClick);
    }
    if (props.hasOwnProperty('onSelect')) {
      gui.listen(id(props.id), props.onSelect);
    }
    for (var _i = 0, _dynamicProps = dynamicProps; _i < _dynamicProps.length; _i++) {
      var dynamicProp = _dynamicProps[_i];
      if (!props.hasOwnProperty(dynamicProp)) {
        continue;
      }

      // const getterFunction = `get${dynamicProp.charAt(0).toUpperCase() + dynamicProp.slice(1)}`;
      var setterFunction = "set".concat(dynamicProp.charAt(0).toUpperCase() + dynamicProp.slice(1));
      try {
        component[setterFunction](props[dynamicProp]);
      } catch (error) {
        throw new Error("Failed to set ".concat(dynamicProp, " using ").concat(setterFunction, "() on ").concat(type, " with id ").concat(props.id, ": ").concat(error));
      }
    }
    return {
      component: component
    };
  };
}
function renderToGui(gui, element) {
  return element(gui);
}

var JumpBlockSettingsGui = /*#__PURE__*/function (_BaseGui) {
  function JumpBlockSettingsGui(player, block) {
    var _this;
    _classCallCheck(this, JumpBlockSettingsGui);
    _this = _callSuper(this, JumpBlockSettingsGui, [id('gui_jumpblock_settings'), 384, 192, player]);
    _this.block = block;
    _this.state = {
      jumpHeight: parseFloat(_this.block.storeddata.get('jump_height')) || 1
    };
    _this.pushState();
    _this.render();
    return _this;
  }
  _inherits(JumpBlockSettingsGui, _BaseGui);
  return _createClass(JumpBlockSettingsGui, [{
    key: "render",
    value: function render() {
      var _this2 = this;
      return renderToGui(this.gui, jsx(Fragment, {
        children: jsxs(Fragment, {
          x: 96,
          y: 0,
          children: [jsxs(Fragment, {
            children: [jsx("label", {
              id: "lbl_jump_height",
              text: "Jump Velocity",
              hoverText: "The velocity of the jump, can be decimal. Example: 0.5",
              x: 0,
              y: 0,
              width: 100,
              height: 16
            }), jsx("textfield", {
              id: "txt_jump_height",
              text: this.state.jumpHeight,
              x: 0,
              y: 12,
              width: 100,
              height: 18
            })]
          }), jsx("button", {
            id: "btn_save",
            label: "Save",
            x: 200 - 64,
            y: 60,
            width: 64,
            height: 20,
            onClick: function onClick(e) {
              return _this2.onBtnSaveClick(e);
            }
          })]
        })
      }));
    }
  }, {
    key: "onBtnSaveClick",
    value: function onBtnSaveClick() {
      var textfield = this.gui.getComponent(id('txt_jump_height'));
      var jumpHeight = parseFloat(textfield.getText()) || 0;
      this.block.storeddata.put('jump_height', jumpHeight);
      this.gui.close();
    }
  }]);
}(BaseGui);

var LAST_JUMPED = {}; // entity id -> timestamp
var JUMP_COOLDOWN = 500; // 500ms
var DEFAULT_JUMP_HEIGHT = 0.5;
function getNeighborModelSource(block) {
  var checkPositions = [block.pos.down(), block.pos.north(), block.pos.east(), block.pos.south(), block.pos.west()];
  for (var _i = 0, _checkPositions = checkPositions; _i < _checkPositions.length; _i++) {
    var pos = _checkPositions[_i];
    var neighbor = block.world.getBlock(pos);
    if (neighbor.isAir()) {
      continue;
    }
    return neighbor.getName();
  }
  return null;
}
function updateBlockModel(block) {
  var neighborModelSource = getNeighborModelSource(block);
  if (!neighborModelSource) {
    block.world.broadcast('§cNo neighbor model source found');
    return;
  }
  block.setModel(neighborModelSource);
}
function canJump(entity) {
  var lastJumped = LAST_JUMPED[entity.id] || 0;
  var now = Date.now();
  return now - lastJumped > JUMP_COOLDOWN;
}
function init(e) {
  if (!e.block.storeddata.has('jump_height')) {
    e.block.storeddata.put('jump_height', DEFAULT_JUMP_HEIGHT);
  }
  updateBlockModel(e.block);
}
function neighborChanged(e) {
  updateBlockModel(e.block);
}
function collide(e) {
  if (!canJump(e.entity)) {
    return;
  }
  LAST_JUMPED[e.entity.id] = Date.now();
  var jumpHeight = parseFloat(e.block.storeddata.get('jump_height')) || DEFAULT_JUMP_HEIGHT;
  if (jumpHeight === 0) {
    return;
  }
  e.entity.setMotionY(jumpHeight);
}
function interact(e) {
  if (e.player.gamemode !== 1) return;
  var settingsGui = new JumpBlockSettingsGui(e.player, e.block);
  e.player.showCustomGui(settingsGui.gui);
}
function customGuiButton(e) {
  var shouldCancel = !e.button.getEnabled();
  if (shouldCancel) {
    return;
  }
  gui.emit(e.buttonId, e);
}

