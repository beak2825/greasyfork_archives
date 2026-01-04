// ==UserScript==
// @name         Simple Gamepad Navigation
// @namespace    https://miniwangdali.github.io/simple-gamepad-navigation/
// @version      0.0.3
// @author       miniwangdali@gmail.com
// @description  Navigate (almost) any accessible website with a controller.
// @license      MIT
// @icon         https://raw.githubusercontent.com/miniwangdali/SimpleGamepadNavigation/refs/heads/main/packages/monkey-script/asset/icon.svg
// @match        *://*/*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/548737/Simple%20Gamepad%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/548737/Simple%20Gamepad%20Navigation.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var NavigationDirection;
  (function(NavigationDirection2) {
    NavigationDirection2["Up"] = "up";
    NavigationDirection2["Down"] = "down";
    NavigationDirection2["Left"] = "left";
    NavigationDirection2["Right"] = "right";
  })(NavigationDirection || (NavigationDirection = {}));
  var ScrollDirection;
  (function(ScrollDirection2) {
    ScrollDirection2["Vertical"] = "vertical";
    ScrollDirection2["Horizontal"] = "horizontal";
  })(ScrollDirection || (ScrollDirection = {}));
  const isSliderElement = (element) => {
    return !!element && element instanceof HTMLInputElement && (element.type === "range" || element.role === "slider");
  };
  const isTabListElement = (element) => {
    return element.role === "tablist";
  };
  const getTabListElementOfTarget = (target) => {
    let el = target;
    while (el) {
      if (el.previousSibling instanceof Element && isTabListElement(el.previousSibling)) {
        return el.previousSibling;
      }
      if (el.nextSibling instanceof Element && isTabListElement(el.nextSibling)) {
        return el.nextSibling;
      }
      if (isTabListElement(el)) {
        return el;
      }
      el = el.parentElement;
    }
    return el;
  };
  const getTabItemsOfTabList = (tabList) => {
    return tabList.querySelectorAll('[role="tab"]');
  };
  function debounce(func, debounceMs, { signal, edges } = {}) {
    let pendingThis = void 0;
    let pendingArgs = null;
    const leading = edges != null && edges.includes("leading");
    const trailing = edges == null || edges.includes("trailing");
    const invoke = () => {
      if (pendingArgs !== null) {
        func.apply(pendingThis, pendingArgs);
        pendingThis = void 0;
        pendingArgs = null;
      }
    };
    const onTimerEnd = () => {
      if (trailing) {
        invoke();
      }
      cancel();
    };
    let timeoutId = null;
    const schedule = () => {
      if (timeoutId != null) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        timeoutId = null;
        onTimerEnd();
      }, debounceMs);
    };
    const cancelTimer = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
    const cancel = () => {
      cancelTimer();
      pendingThis = void 0;
      pendingArgs = null;
    };
    const flush = () => {
      invoke();
    };
    const debounced = function(...args) {
      if (signal?.aborted) {
        return;
      }
      pendingThis = this;
      pendingArgs = args;
      const isFirstCall = timeoutId == null;
      schedule();
      if (leading && isFirstCall) {
        invoke();
      }
    };
    debounced.schedule = schedule;
    debounced.cancel = cancel;
    debounced.flush = flush;
    signal?.addEventListener("abort", cancel, { once: true });
    return debounced;
  }
  function throttle(func, throttleMs, { signal, edges = ["leading", "trailing"] } = {}) {
    let pendingAt = null;
    const debounced = debounce(func, throttleMs, { signal, edges });
    const throttled = function(...args) {
      if (pendingAt == null) {
        pendingAt = Date.now();
      } else {
        if (Date.now() - pendingAt >= throttleMs) {
          pendingAt = Date.now();
          debounced.cancel();
        }
      }
      debounced(...args);
    };
    throttled.cancel = debounced.cancel;
    throttled.flush = debounced.flush;
    return throttled;
  }
  const calculateDistanceOfTwoPoints = (pointA, pointB) => {
    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;
    return Math.sqrt(dx * dx + dy * dy);
  };
  const DISTANCE_BUFFER = 4;
  const getDistanceOfTwoElements = (sourceElementRect, targetElementRect, side) => {
    switch (side) {
      case "top": {
        const sourceTopMiddlePoint = {
          x: (sourceElementRect.left + sourceElementRect.right) / 2,
          y: sourceElementRect.top
        };
        const targetBottomMiddlePoint = {
          x: (targetElementRect.left + targetElementRect.right) / 2,
          y: targetElementRect.bottom
        };
        let distance = calculateDistanceOfTwoPoints(sourceTopMiddlePoint, targetBottomMiddlePoint);
        if (sourceTopMiddlePoint.y < targetBottomMiddlePoint.y - DISTANCE_BUFFER) {
          distance = Infinity;
        }
        return distance;
      }
      case "bottom": {
        const sourceBottomMiddlePoint = {
          x: (sourceElementRect.left + sourceElementRect.right) / 2,
          y: sourceElementRect.bottom
        };
        const targetTopMiddlePoint = {
          x: (targetElementRect.left + targetElementRect.right) / 2,
          y: targetElementRect.top
        };
        let distance = calculateDistanceOfTwoPoints(sourceBottomMiddlePoint, targetTopMiddlePoint);
        if (sourceBottomMiddlePoint.y > targetTopMiddlePoint.y + DISTANCE_BUFFER) {
          distance = Infinity;
        }
        return distance;
      }
      case "left": {
        const sourceLeftMiddlePoint = {
          x: sourceElementRect.left,
          y: (sourceElementRect.top + sourceElementRect.bottom) / 2
        };
        const targetRightMiddlePoint = {
          x: targetElementRect.right,
          y: (targetElementRect.top + targetElementRect.bottom) / 2
        };
        let distance = calculateDistanceOfTwoPoints(sourceLeftMiddlePoint, targetRightMiddlePoint);
        if (sourceLeftMiddlePoint.x < targetRightMiddlePoint.x - DISTANCE_BUFFER) {
          distance = Infinity;
        }
        return distance;
      }
      case "right": {
        const sourceRightMiddlePoint = {
          x: sourceElementRect.right,
          y: (sourceElementRect.top + sourceElementRect.bottom) / 2
        };
        const targetLeftMiddlePoint = {
          x: targetElementRect.left,
          y: (targetElementRect.top + targetElementRect.bottom) / 2
        };
        let distance = calculateDistanceOfTwoPoints(sourceRightMiddlePoint, targetLeftMiddlePoint);
        if (sourceRightMiddlePoint.x > targetLeftMiddlePoint.x + DISTANCE_BUFFER) {
          distance = Infinity;
        }
        return distance;
      }
    }
  };
  const isElementInRect = (elementRect, containerRect) => {
    return elementRect.top >= containerRect.top - DISTANCE_BUFFER && elementRect.bottom <= containerRect.bottom + DISTANCE_BUFFER && elementRect.left >= containerRect.left - DISTANCE_BUFFER && elementRect.right <= containerRect.right + DISTANCE_BUFFER;
  };
  const isDialogElement = (element) => {
    return element instanceof HTMLDialogElement || element.role === "dialog" || element.getAttribute("aria-modal") === "true";
  };
  const getDialogElementOfTarget = (target) => {
    let el = target;
    while (el) {
      if (isDialogElement(el)) {
        return el;
      }
      el = el.parentElement;
    }
    return el;
  };
  const INPUT_ROLES = ["textbox", "searchbox", "combobox", "slider", "spinbutton"];
  const INTERACTABLE_ROLES = ["button", "link", "checkbox", "radio", "slider", "tab", ...INPUT_ROLES];
  const isContentEditable = (element) => {
    return element.hasAttribute("contenteditable") && element.getAttribute("contenteditable") !== "false";
  };
  const hasInputRole = (element) => {
    return element.hasAttribute("role") && INPUT_ROLES.includes(element.getAttribute("role"));
  };
  const hasInteractableRole = (element) => {
    return element.hasAttribute("role") && INTERACTABLE_ROLES.includes(element.getAttribute("role"));
  };
  const isInputElement = (element) => {
    return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || hasInputRole(element) || isContentEditable(element);
  };
  const isVisibleElement = (element) => {
    if (!(element instanceof HTMLElement))
      return false;
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0 && rect.x === 0 && rect.y === 0)
      return false;
    const style = getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
  };
  const isInteractableElement = (element) => {
    return element instanceof HTMLButtonElement || element instanceof HTMLAnchorElement || isInputElement(element) || hasInteractableRole(element);
  };
  const getInteractableElements = (restriction) => {
    const treeWalker = document.createTreeWalker(restriction?.restrictedRootElement || document.body, NodeFilter.SHOW_ELEMENT);
    const interactableElements = [];
    while (treeWalker.nextNode()) {
      const currentNode = treeWalker.currentNode;
      if ((currentNode instanceof Element || currentNode.nodeType === Node.ELEMENT_NODE) && isInteractableElement(currentNode)) {
        const interactableRect = currentNode.getBoundingClientRect();
        const inRestrictedRect = !restriction?.restrictedRect || isElementInRect(interactableRect, restriction.restrictedRect);
        if (inRestrictedRect && isVisibleElement(currentNode)) {
          interactableElements.push(currentNode);
        }
      }
    }
    return interactableElements;
  };
  const findNewInteractableElement = (currentElement, direction) => {
    const currentRect = currentElement.getBoundingClientRect();
    const restrictedRootElement = getDialogElementOfTarget(currentElement);
    const allInteractableElements = getInteractableElements({ restrictedRootElement });
    let candidate = void 0;
    let candidateDistance = Infinity;
    for (const element of allInteractableElements) {
      if (element === currentElement)
        continue;
      const elementRect = element.getBoundingClientRect();
      let distance = 0;
      switch (direction) {
        case "up":
          distance = getDistanceOfTwoElements(currentRect, elementRect, "top");
          break;
        case "down":
          distance = getDistanceOfTwoElements(currentRect, elementRect, "bottom");
          break;
        case "left":
          distance = getDistanceOfTwoElements(currentRect, elementRect, "left");
          break;
        case "right":
          distance = getDistanceOfTwoElements(currentRect, elementRect, "right");
          break;
      }
      if (distance >= 0 && distance < candidateDistance) {
        candidate = element;
        candidateDistance = distance;
      }
    }
    return candidate;
  };
  const getNearestScrollContainer = (element) => {
    let el = element;
    while (el) {
      if (el instanceof HTMLElement) {
        const style = getComputedStyle(el);
        const overflowY = style.overflowY;
        const isScrollableY = (overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight;
        const overflowX = style.overflowX;
        const isScrollableX = (overflowX === "auto" || overflowX === "scroll") && el.scrollWidth > el.clientWidth;
        if (isScrollableY || isScrollableX) {
          return el;
        }
      }
      el = el.parentElement;
      if (el === document.documentElement) {
        break;
      }
    }
    return el instanceof HTMLElement ? el : null;
  };
  const canScroll = (scrollContainer, direction, speed) => {
    switch (direction) {
      case ScrollDirection.Vertical: {
        const reverse = getComputedStyle(scrollContainer).flexDirection === "column-reverse";
        if (speed >= 0) {
          return reverse ? scrollContainer.scrollTop < 0 : scrollContainer.scrollTop + scrollContainer.clientHeight < scrollContainer.scrollHeight;
        } else if (speed < 0) {
          return reverse ? -scrollContainer.scrollTop + scrollContainer.clientHeight < scrollContainer.scrollHeight : scrollContainer.scrollTop > 0;
        }
        break;
      }
      case ScrollDirection.Horizontal: {
        const reverse = getComputedStyle(scrollContainer).flexDirection === "row-reverse";
        if (speed >= 0) {
          return reverse ? scrollContainer.scrollLeft < 0 : scrollContainer.scrollLeft + scrollContainer.clientWidth < scrollContainer.scrollWidth;
        } else if (speed < 0) {
          return reverse ? -scrollContainer.scrollLeft + scrollContainer.clientWidth < scrollContainer.scrollWidth : scrollContainer.scrollLeft > 0;
        }
        break;
      }
    }
    return false;
  };
  const isElementPositionedUnrelatedToScrollContainer = (element, scrollContainer) => {
    let el = element;
    let unrelatedPosition = false;
    const treeWalker = document.createTreeWalker(scrollContainer, NodeFilter.SHOW_ELEMENT);
    const elementsInScrollContainer = new Set();
    while (treeWalker.nextNode()) {
      elementsInScrollContainer.add(treeWalker.currentNode);
    }
    while (el && elementsInScrollContainer.has(el)) {
      if (el === scrollContainer) {
        return false;
      }
      const position = getComputedStyle(el).position;
      if (position === "absolute" || position === "fixed") {
        unrelatedPosition = true;
      }
      el = el.offsetParent;
    }
    return unrelatedPosition;
  };
  const THROTTLE_DELAY$1 = 250;
  const scroll = (direction, speed, originalPosition, immediate) => {
    if (document.activeElement) {
      const scrollContainer = getNearestScrollContainer(document.activeElement);
      if (scrollContainer) {
        originalPosition.x = scrollContainer.scrollLeft;
        originalPosition.y = scrollContainer.scrollTop;
        const style = getComputedStyle(scrollContainer);
        const overflowY = style.overflowY;
        const isScrollableY = (overflowY === "auto" || overflowY === "scroll" || scrollContainer === document.documentElement) && scrollContainer.scrollHeight > scrollContainer.clientHeight;
        const overflowX = style.overflowX;
        const isScrollableX = (overflowX === "auto" || overflowX === "scroll" || scrollContainer === document.documentElement) && scrollContainer.scrollWidth > scrollContainer.clientWidth;
        const scrollAmount = scrollContainer.clientHeight * speed;
        switch (direction) {
          case ScrollDirection.Vertical:
            if (isScrollableY) {
              scrollContainer.scrollBy({ top: scrollAmount, behavior: immediate ? "auto" : "smooth" });
            }
            break;
          case ScrollDirection.Horizontal:
            if (isScrollableX) {
              scrollContainer.scrollBy({ left: scrollAmount, behavior: immediate ? "auto" : "smooth" });
            }
            break;
        }
        return true;
      }
    }
    return false;
  };
  const throttledScroll = throttle((direction, speed, state, immediate) => {
    state.result = scroll(direction, speed, state.originalPosition, immediate);
  }, THROTTLE_DELAY$1, { edges: ["leading"] });
  const THROTTLE_DELAY = 250;
  const focusInteractableElement = (target) => {
    if (target instanceof HTMLElement) {
      document.activeElement.blur();
      target.focus();
      target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      return true;
    }
    return false;
  };
  const focusNextInteractableElement = (current, direction) => {
    let nextElement = findNewInteractableElement(current, direction);
    const scrollContainer = getNearestScrollContainer(current);
    const scrollDirection = direction === NavigationDirection.Up || direction === NavigationDirection.Down ? ScrollDirection.Vertical : ScrollDirection.Horizontal;
    const speed = direction === NavigationDirection.Up || direction === NavigationDirection.Left ? -0.5 : 0.5;
    while (true) {
      if (scrollContainer && nextElement && canScroll(scrollContainer, scrollDirection, speed) && isElementPositionedUnrelatedToScrollContainer(nextElement, scrollContainer)) {
        const originalPosition = { x: 0, y: 0 };
        throttledScroll(scrollDirection, speed, { result: false, originalPosition }, true);
        const newNextElement = findNewInteractableElement(current, direction);
        if (newNextElement === nextElement) {
          scrollContainer.scrollTo(originalPosition.x, originalPosition.y);
          break;
        }
        nextElement = newNextElement;
        continue;
      }
      break;
    }
    if (nextElement instanceof HTMLElement) {
      return focusInteractableElement(nextElement);
    }
    return false;
  };
  const navigate = (direction) => {
    const viewportRect = new DOMRect(0, 0, window.innerWidth, window.innerHeight);
    if (document.activeElement && document.activeElement !== document.body && isElementInRect(document.activeElement.getBoundingClientRect(), viewportRect)) {
      return focusNextInteractableElement(document.activeElement, direction);
    } else {
      const allInteractableElements = getInteractableElements({ restrictedRect: viewportRect });
      let candidate;
      let candidateRect;
      switch (direction) {
        case NavigationDirection.Up:
          candidateRect = new DOMRect(Infinity, 0, 0, 0);
          break;
        case NavigationDirection.Right:
        case NavigationDirection.Down:
          candidateRect = new DOMRect(Infinity, Infinity, 0, 0);
          break;
        case NavigationDirection.Left:
          candidateRect = new DOMRect(0, Infinity, 0, 0);
          break;
      }
      for (const element of allInteractableElements) {
        const elementRect = element.getBoundingClientRect();
        switch (direction) {
          case NavigationDirection.Up:
            if (elementRect.bottom > candidateRect.bottom || elementRect.bottom === candidateRect.bottom && elementRect.left < candidateRect.left) {
              candidate = element;
              candidateRect = elementRect;
            }
            break;
          case NavigationDirection.Right:
            if (elementRect.left < candidateRect.left || elementRect.left === candidateRect.left && elementRect.top < candidateRect.top) {
              candidate = element;
              candidateRect = elementRect;
            }
            break;
          case NavigationDirection.Down:
            if (elementRect.top < candidateRect.top || elementRect.top === candidateRect.top && elementRect.left < candidateRect.left) {
              candidate = element;
              candidateRect = elementRect;
            }
            break;
          case NavigationDirection.Left:
            if (elementRect.right > candidateRect.right || elementRect.right === candidateRect.right && elementRect.top < candidateRect.top) {
              candidate = element;
              candidateRect = elementRect;
            }
            break;
        }
      }
      if (candidate) {
        return focusInteractableElement(candidate);
      }
    }
    return false;
  };
  const throttledNavigate = throttle((direction, state) => {
    state.result = navigate(direction);
  }, THROTTLE_DELAY, { edges: ["leading"] });
  const LEFT_THUMBSTICK_DEFAULT_THRESHOLD = 0.6;
  const RIGHT_THUMBSTICK_DEFAULT_THRESHOLD = 0.4;
  var XboxButton;
  (function(XboxButton2) {
    XboxButton2[XboxButton2["A"] = 0] = "A";
    XboxButton2[XboxButton2["B"] = 1] = "B";
    XboxButton2[XboxButton2["X"] = 2] = "X";
    XboxButton2[XboxButton2["Y"] = 3] = "Y";
    XboxButton2[XboxButton2["LeftBumper"] = 4] = "LeftBumper";
    XboxButton2[XboxButton2["RightBumper"] = 5] = "RightBumper";
    XboxButton2[XboxButton2["LeftTrigger"] = 6] = "LeftTrigger";
    XboxButton2[XboxButton2["RightTrigger"] = 7] = "RightTrigger";
    XboxButton2[XboxButton2["View"] = 8] = "View";
    XboxButton2[XboxButton2["Menu"] = 9] = "Menu";
    XboxButton2[XboxButton2["LeftThumbStick"] = 10] = "LeftThumbStick";
    XboxButton2[XboxButton2["RightThumbStick"] = 11] = "RightThumbStick";
    XboxButton2[XboxButton2["DpadUp"] = 12] = "DpadUp";
    XboxButton2[XboxButton2["DpadDown"] = 13] = "DpadDown";
    XboxButton2[XboxButton2["DpadLeft"] = 14] = "DpadLeft";
    XboxButton2[XboxButton2["DpadRight"] = 15] = "DpadRight";
    XboxButton2[XboxButton2["Nexus"] = 16] = "Nexus";
  })(XboxButton || (XboxButton = {}));
  const buttonKeyMap = {
    [XboxButton.A]: "Enter",
    [XboxButton.B]: "Escape",
    [XboxButton.LeftTrigger]: "Shift",
    [XboxButton.RightTrigger]: "Control",
    [XboxButton.DpadUp]: "ArrowUp",
    [XboxButton.DpadDown]: "ArrowDown",
    [XboxButton.DpadLeft]: "ArrowLeft",
    [XboxButton.DpadRight]: "ArrowRight"
  };
  class XboxStandardController {
    constructor() {
      Object.defineProperty(this, "pressedKeys", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new Set()
      });
      Object.defineProperty(this, "workingTabListElement", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null
      });
      Object.defineProperty(this, "workingOnSlider", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false
      });
      Object.defineProperty(this, "getValidGamepad", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (gamepadId) => {
          const gamepads = GamepadManager.getInstance().getGamepads();
          if (!gamepads.has(gamepadId)) {
            return null;
          }
          return gamepads.get(gamepadId);
        }
      });
      Object.defineProperty(this, "checkNavigation", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (gamepadId) => {
          const gamepad = this.getValidGamepad(gamepadId);
          if (!gamepad) {
            return false;
          }
          const x = gamepad.axes[0];
          const y = gamepad.axes[1];
          const resultState = { result: false };
          if (x > LEFT_THUMBSTICK_DEFAULT_THRESHOLD) {
            throttledNavigate(NavigationDirection.Right, resultState);
          } else if (x < -LEFT_THUMBSTICK_DEFAULT_THRESHOLD) {
            throttledNavigate(NavigationDirection.Left, resultState);
          }
          if (y > RIGHT_THUMBSTICK_DEFAULT_THRESHOLD) {
            throttledNavigate(NavigationDirection.Down, resultState);
          } else if (y < -RIGHT_THUMBSTICK_DEFAULT_THRESHOLD) {
            throttledNavigate(NavigationDirection.Up, resultState);
          }
          const dpadUp = gamepad.buttons[XboxButton.DpadUp];
          const dpadDown = gamepad.buttons[XboxButton.DpadDown];
          const dpadLeft = gamepad.buttons[XboxButton.DpadLeft];
          const dpadRight = gamepad.buttons[XboxButton.DpadRight];
          if (!this.workingOnSlider) {
            if (dpadUp.pressed) {
              throttledNavigate(NavigationDirection.Up, resultState);
            }
            if (dpadDown.pressed) {
              throttledNavigate(NavigationDirection.Down, resultState);
            }
            if (dpadLeft.pressed) {
              throttledNavigate(NavigationDirection.Left, resultState);
            }
            if (dpadRight.pressed) {
              throttledNavigate(NavigationDirection.Right, resultState);
            }
          }
          return resultState.result;
        }
      });
      Object.defineProperty(this, "checkScrolling", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (gamepadId) => {
          const gamepad = this.getValidGamepad(gamepadId);
          if (!gamepad) {
            return false;
          }
          const x = gamepad.axes[2];
          const y = gamepad.axes[3];
          const resultState = { result: false, originalPosition: { x: 0, y: 0 } };
          if (x > RIGHT_THUMBSTICK_DEFAULT_THRESHOLD || x < -RIGHT_THUMBSTICK_DEFAULT_THRESHOLD) {
            throttledScroll(ScrollDirection.Horizontal, x, resultState);
          }
          if (y > RIGHT_THUMBSTICK_DEFAULT_THRESHOLD || y < -RIGHT_THUMBSTICK_DEFAULT_THRESHOLD) {
            throttledScroll(ScrollDirection.Vertical, y, resultState);
          }
          return resultState.result;
        }
      });
      Object.defineProperty(this, "checkButtonKeyEvent", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (buttonIndex, gamepad) => {
          const button = gamepad.buttons[buttonIndex];
          if (button.pressed) {
            const hasPressedKey = this.pressedKeys.has(buttonIndex);
            if (!hasPressedKey) {
              this.pressedKeys.add(buttonIndex);
            }
            const eventTarget = document.activeElement || document.body;
            if (!hasPressedKey) {
              if (eventTarget instanceof HTMLAnchorElement && buttonIndex === XboxButton.A) {
                eventTarget.click();
              }
            }
            const enterKeyDownEvent = new KeyboardEvent("keydown", { key: buttonKeyMap[buttonIndex], bubbles: true });
            eventTarget.dispatchEvent(enterKeyDownEvent);
          } else if (this.pressedKeys.has(buttonIndex)) {
            this.pressedKeys.delete(buttonIndex);
            if (buttonIndex === XboxButton.A && isSliderElement(document.activeElement)) {
              this.workingOnSlider = true;
            }
            if (this.workingOnSlider && buttonIndex === XboxButton.B) {
              this.workingOnSlider = false;
            }
            const eventTarget = document.activeElement || document.body;
            const enterKeyUpEvent = new KeyboardEvent("keyup", { key: buttonKeyMap[buttonIndex], bubbles: true });
            eventTarget.dispatchEvent(enterKeyUpEvent);
          }
        }
      });
      Object.defineProperty(this, "checkMenuButton", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (gamepadId) => {
          const gamepad = this.getValidGamepad(gamepadId);
          if (!gamepad) {
            return;
          }
          const menuButton = gamepad.buttons[XboxButton.Menu];
          if (menuButton.pressed) {
            if (!this.pressedKeys.has(XboxButton.Menu)) {
              this.pressedKeys.add(XboxButton.Menu);
              const eventTarget = document.activeElement || document.body;
              const eventInit = {
                bubbles: true,
                cancelable: true,
                button: 2,
                buttons: 2,
                view: window
              };
              eventTarget.dispatchEvent(new MouseEvent("mousedown", eventInit));
              eventTarget.dispatchEvent(new MouseEvent("contextmenu", eventInit));
            }
          } else if (this.pressedKeys.has(XboxButton.Menu)) {
            this.pressedKeys.delete(XboxButton.Menu);
            const eventTarget = document.activeElement || document.body;
            const eventInit = {
              bubbles: true,
              cancelable: true,
              button: 2,
              buttons: 0,
              view: window
            };
            eventTarget.dispatchEvent(new MouseEvent("mouseup", eventInit));
          }
        }
      });
      Object.defineProperty(this, "checkViewButton", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (gamepadId) => {
          const gamepad = this.getValidGamepad(gamepadId);
          if (!gamepad) {
            return;
          }
          const viewButton = gamepad.buttons[XboxButton.View];
          if (viewButton.pressed) {
            if (!this.pressedKeys.has(XboxButton.View)) {
              this.pressedKeys.add(XboxButton.View);
            }
          } else if (this.pressedKeys.has(XboxButton.View)) {
            this.pressedKeys.delete(XboxButton.View);
            if (this.pressedKeys.has(XboxButton.LeftTrigger)) {
              window.close();
            }
          }
        }
      });
      Object.defineProperty(this, "checkButton", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (gamepadId) => {
          const gamepad = this.getValidGamepad(gamepadId);
          if (!gamepad) {
            return;
          }
          this.checkButtonKeyEvent(XboxButton.A, gamepad);
          this.checkButtonKeyEvent(XboxButton.B, gamepad);
          this.checkButtonKeyEvent(XboxButton.LeftTrigger, gamepad);
          this.checkButtonKeyEvent(XboxButton.RightTrigger, gamepad);
          if (this.workingOnSlider) {
            this.checkButtonKeyEvent(XboxButton.DpadLeft, gamepad);
            this.checkButtonKeyEvent(XboxButton.DpadRight, gamepad);
            this.checkButtonKeyEvent(XboxButton.DpadUp, gamepad);
            this.checkButtonKeyEvent(XboxButton.DpadDown, gamepad);
          }
          this.checkMenuButton(gamepadId);
          this.checkViewButton(gamepadId);
        }
      });
      Object.defineProperty(this, "checkBumper", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (bumper, gamepad) => {
          const button = gamepad.buttons[bumper];
          if (button.pressed) {
            if (!this.pressedKeys.has(bumper)) {
              this.pressedKeys.add(bumper);
            }
          } else if (this.pressedKeys.has(bumper)) {
            this.pressedKeys.delete(bumper);
            if (this.pressedKeys.has(XboxButton.RightTrigger)) {
              if (bumper === XboxButton.LeftBumper) {
                history.back();
              } else {
                history.forward();
              }
              return true;
            }
            const tabList = this.workingTabListElement || (document.activeElement ? getTabListElementOfTarget(document.activeElement) : null);
            if (tabList) {
              this.workingTabListElement = tabList;
              const tabItems = getTabItemsOfTabList(tabList);
              const selectedTabIndex = Array.from(tabItems).findIndex((tab) => tab.getAttribute("aria-selected") === "true");
              let nextTabItem = 0;
              if (bumper === XboxButton.LeftBumper) {
                nextTabItem = Math.max(0, selectedTabIndex - 1);
              } else {
                nextTabItem = Math.min(tabItems.length - 1, selectedTabIndex + 1);
              }
              tabItems.item(nextTabItem).click();
              tabItems.item(nextTabItem).focus();
              return nextTabItem !== selectedTabIndex;
            }
          }
          return false;
        }
      });
      Object.defineProperty(this, "checkBumpers", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (gamepadId) => {
          const gamepad = this.getValidGamepad(gamepadId);
          if (!gamepad) {
            return;
          }
          let result = false;
          result || (result = this.checkBumper(XboxButton.LeftBumper, gamepad));
          result || (result = this.checkBumper(XboxButton.RightBumper, gamepad));
          return result;
        }
      });
    }
    checkInput(gamepad) {
      const navigated = this.checkNavigation(gamepad.index);
      this.checkScrolling(gamepad.index);
      this.checkButton(gamepad.index);
      if (navigated) {
        this.workingTabListElement = null;
        this.workingOnSlider = false;
      }
      this.checkBumpers(gamepad.index);
    }
  }
  const defaultAdapter = new XboxStandardController();
  class GamepadManager {
    static getInstance() {
      if (!GamepadManager.instance) {
        GamepadManager.instance = new GamepadManager();
      }
      return GamepadManager.instance;
    }
    constructor() {
      Object.defineProperty(this, "gamepads", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new Map()
      });
      Object.defineProperty(this, "pollingHandle", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null
      });
      Object.defineProperty(this, "gamepadConnectedListener", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (e) => {
          const gamepad = navigator.getGamepads()[e.gamepad.index];
          if (gamepad && (gamepad.mapping === "standard" || gamepad.mapping === "xr-standard") && !this.gamepads.has(gamepad.index)) {
            this.addGamepad(gamepad);
          }
        }
      });
      Object.defineProperty(this, "gamepadDisconnectedListener", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (e) => {
          if (this.gamepads.has(e.gamepad.index)) {
            this.removeGamepad(e.gamepad);
          }
        }
      });
      Object.defineProperty(this, "windowFocusedListener", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: () => {
          this.startPolling();
        }
      });
      Object.defineProperty(this, "windowBlurredListener", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: () => {
          this.stopPolling();
        }
      });
      Object.defineProperty(this, "addGamepad", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (gamepad) => {
          this.gamepads.set(gamepad.index, gamepad);
        }
      });
      Object.defineProperty(this, "removeGamepad", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (gamepad) => {
          this.gamepads.delete(gamepad.index);
        }
      });
      Object.defineProperty(this, "updateGamepad", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: (gamepad) => {
          this.gamepads.set(gamepad.index, gamepad);
        }
      });
      Object.defineProperty(this, "startPolling", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: () => {
          if (this.pollingHandle !== null) {
            this.stopPolling();
          }
          const gamepads = navigator.getGamepads().filter((gp) => this.gamepads.has(gp?.index ?? -1));
          for (const gamepad of gamepads) {
            this.updateGamepad(gamepad);
            const adapter = defaultAdapter;
            adapter.checkInput(gamepad);
          }
          this.pollingHandle = requestAnimationFrame(this.startPolling);
        }
      });
      Object.defineProperty(this, "stopPolling", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: () => {
          if (this.pollingHandle !== null) {
            cancelAnimationFrame(this.pollingHandle);
            this.pollingHandle = null;
          }
        }
      });
      this.initialize();
    }
    initialize() {
      window.addEventListener("gamepadconnected", this.gamepadConnectedListener);
      window.addEventListener("gamepaddisconnected", this.gamepadDisconnectedListener);
      window.addEventListener("focus", this.windowFocusedListener);
      window.addEventListener("blur", this.windowBlurredListener);
      this.startPolling();
    }
    getGamepads() {
      return this.gamepads;
    }
    cleanUp() {
      this.gamepads.clear();
      this.stopPolling();
      window.removeEventListener("focus", this.windowFocusedListener);
      window.removeEventListener("blur", this.windowBlurredListener);
      window.removeEventListener("gamepadconnected", this.gamepadConnectedListener);
      window.removeEventListener("gamepaddisconnected", this.gamepadDisconnectedListener);
    }
  }
  const tag = "[SimpleGamepadNavigation]";
  let gamepadManager;
  const initializeGamepadNavigation = () => {
    const globalThis = window;
    if (globalThis.SimpleGamepadNavigation?.initialized) {
      console.info(`${tag} Already initialized.`);
      return;
    }
    window.addEventListener("load", () => {
      gamepadManager = GamepadManager.getInstance();
    });
    window.addEventListener("beforeunload", () => {
      gamepadManager.cleanUp();
    });
    if (!globalThis.SimpleGamepadNavigation) {
      globalThis.SimpleGamepadNavigation = { initialized: true };
    } else {
      globalThis.SimpleGamepadNavigation.initialized = true;
    }
    console.info(`${tag} Initialized.`);
  };
  initializeGamepadNavigation();

})();