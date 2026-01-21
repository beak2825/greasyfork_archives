// ==UserScript==
// @name         My Fingerprint Tampermonkey Lite + Clean
// @namespace    https://github.com/omegaee/my-fingerprint
// @version      0.2.0
// @description  每次打开页面清站点数据，并伪装 Canvas/WebGL/Audio/WebGPU/Fonts/DOMRect/屏幕尺寸，每标签页随机，其它保持系统值，适配手机浏览器
// @author       anonymous
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563360/My%20Fingerprint%20Tampermonkey%20Lite%20%2B%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/563360/My%20Fingerprint%20Tampermonkey%20Lite%20%2B%20Clean.meta.js
// ==/UserScript==

;(function () {
  if (window.__my_fp_tampermonkey_injected__) return
  Object.defineProperty(window, '__my_fp_tampermonkey_injected__', { value: true, configurable: false })

  function clearSiteStorage() {
    try {
      const parts = document.cookie.split(';')
      for (let i = 0; i < parts.length; i++) {
        const c = parts[i]
        const eq = c.indexOf('=')
        const name = (eq > -1 ? c.substring(0, eq) : c).trim()
        if (!name) continue
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
      }
    } catch (e) {}

    try {
      if (window.localStorage) {
        localStorage.clear()
      }
    } catch (e) {}

    try {
      if (window.sessionStorage) {
        sessionStorage.clear()
      }
    } catch (e) {}

    try {
      if (window.indexedDB && indexedDB.databases) {
        indexedDB.databases().then(function (dbs) {
          if (!dbs) return
          dbs.forEach(function (db) {
            if (db && db.name) {
              try {
                indexedDB.deleteDatabase(db.name)
              } catch (e) {}
            }
          })
        })
      }
    } catch (e) {}

    try {
      if (window.caches && caches.keys) {
        caches.keys().then(function (keys) {
          keys.forEach(function (k) {
            caches.delete(k)
          })
        })
      }
    } catch (e) {}
  }

  clearSiteStorage()

  function seedRandom(seed) {
    let x = seed >>> 0
    return function () {
      x ^= x << 13
      x ^= x >>> 17
      x ^= x << 5
      return (x >>> 0) / 4294967296
    }
  }

  function hashString(str) {
    let h = 2166136261
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    return h >>> 0
  }

  function getTabSeed() {
    const nav = navigator || {}
    const ua = nav.userAgent || ''
    const platform = nav.platform || ''
    const lang = nav.language || ''
    const t = Date.now()
    const rnd =
      typeof crypto !== 'undefined' && crypto.getRandomValues
        ? crypto.getRandomValues(new Uint32Array(1))[0]
        : Math.floor(Math.random() * 0xffffffff)
    return hashString([ua, platform, lang, String(t), String(rnd)].join('::'))
  }

  const TAB_SEED = getTabSeed()
  const rand = seedRandom(TAB_SEED)

  function smallNoise(scale) {
    const v = rand() - 0.5
    return v * 2 * scale
  }

  function stableNoiseForKey(key, scale) {
    const localRand = seedRandom(hashString(key + '::' + String(TAB_SEED)))
    const v = localRand() - 0.5
    return v * 2 * scale
  }

  function defineSafe(obj, prop, value) {
    try {
      Object.defineProperty(obj, prop, {
        configurable: true,
        enumerable: false,
        writable: true,
        value
      })
    } catch (e) {
      try {
        obj[prop] = value
      } catch (_e) {}
    }
  }

  function patchCanvas() {
    const HTMLCanvasElement = window.HTMLCanvasElement
    const OffscreenCanvas = window.OffscreenCanvas
    const CanvasRenderingContext2D = window.CanvasRenderingContext2D

    function addNoiseToImageData(imgData, keyPrefix, scale) {
      try {
        const data = imgData.data
        for (let i = 0; i < data.length; i += 4) {
          const n = stableNoiseForKey(keyPrefix + ':' + i, scale)
          data[i] = Math.max(0, Math.min(255, data[i] + n))
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n))
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n))
        }
      } catch (_e) {}
    }

    function wrapToDataURL(proto) {
      if (!proto || !proto.toDataURL) return
      const orig = proto.toDataURL
      defineSafe(proto, 'toDataURL', function () {
        const ctx2d = this.getContext && this.getContext('2d')
        if (ctx2d && ctx2d.getImageData) {
          try {
            const w = Math.min(this.width, 32)
            const h = Math.min(this.height, 32)
            const imgData = ctx2d.getImageData(0, 0, w, h)
            addNoiseToImageData(imgData, 'canvas2d', 1.1)
            ctx2d.putImageData(imgData, 0, 0)
          } catch (_e) {}
          return orig.apply(this, arguments)
        }

        const gl =
          this.getContext &&
          (this.getContext('webgl') ||
            this.getContext('experimental-webgl') ||
            this.getContext('webgl2'))

        if (gl && typeof document !== 'undefined' && document.createElement) {
          try {
            const w = this.width
            const h = this.height
            const tmp = document.createElement('canvas')
            tmp.width = w
            tmp.height = h
            const tctx = tmp.getContext('2d')
            if (tctx) {
              tctx.drawImage(this, 0, 0)
              const imgData = tctx.getImageData(0, 0, Math.min(w, 32), Math.min(h, 32))
              addNoiseToImageData(imgData, 'canvas-webgl', 1.3)
              tctx.putImageData(imgData, 0, 0)
              return orig.apply(tmp, arguments)
            }
          } catch (_e) {}
        }

        return orig.apply(this, arguments)
      })
    }

    function wrapGetImageData(proto) {
      if (!proto || !proto.getImageData) return
      const orig = proto.getImageData
      defineSafe(proto, 'getImageData', function () {
        const res = orig.apply(this, arguments)
        addNoiseToImageData(res, 'getImageData', 0.5)
        return res
      })
    }

    function wrapMeasureText() {
      if (!CanvasRenderingContext2D || !CanvasRenderingContext2D.prototype.measureText) return
      const proto = CanvasRenderingContext2D.prototype
      const orig = proto.measureText
      defineSafe(proto, 'measureText', function (text) {
        const res = orig.apply(this, arguments)
        try {
          const key = 'font-' + String(text) + '|' + String(this.font || '')
          const dx = stableNoiseForKey(key + ':w', 0.3)
          const adv = res.width || 0
          defineSafe(res, 'width', adv + dx)
        } catch (_e) {}
        return res
      })
    }

    if (HTMLCanvasElement && HTMLCanvasElement.prototype) {
      wrapToDataURL(HTMLCanvasElement.prototype)
      if (CanvasRenderingContext2D && CanvasRenderingContext2D.prototype) {
        wrapGetImageData(CanvasRenderingContext2D.prototype)
      }
    }
    if (OffscreenCanvas && OffscreenCanvas.prototype) {
      wrapToDataURL(OffscreenCanvas.prototype)
    }
    wrapMeasureText()
  }

  function patchWebGL() {
    const glClasses = [window.WebGLRenderingContext, window.WebGL2RenderingContext].filter(Boolean)

    function clamp255(v) {
      return Math.max(0, Math.min(255, v))
    }

    glClasses.forEach(function (Ctor) {
      if (!Ctor || !Ctor.prototype) return
      const proto = Ctor.prototype

      if (proto.getParameter) {
        const origGetParameter = proto.getParameter
        defineSafe(proto, 'getParameter', function (pname) {
          try {
            if (typeof window.WebGLRenderingContext !== 'undefined') {
              const glEnum = window.WebGLRenderingContext
              if (pname === glEnum.UNMASKED_VENDOR_WEBGL || pname === glEnum.UNMASKED_RENDERER_WEBGL) {
                return origGetParameter.call(this, pname)
              }
            }
          } catch (_e) {}
          const res = origGetParameter.call(this, pname)
          if (typeof res === 'number') {
            const noise = smallNoise(1.5)
            return res + noise
          }
          return res
        })
      }

      if (proto.getSupportedExtensions) {
        const origExt = proto.getSupportedExtensions
        defineSafe(proto, 'getSupportedExtensions', function () {
          const res = origExt.call(this)
          if (!Array.isArray(res)) return res
          const copy = res.slice()
          if (copy.length > 0) {
            const idx = Math.floor(rand() * copy.length)
            const key = 'webgl-ext-' + idx
            const inject =
              stableNoiseForKey(key, 1) > 0
                ? 'EXT_' + Math.abs(stableNoiseForKey(key + ':n', 1e4)).toFixed(0)
                : null
            if (inject && copy.indexOf(inject) === -1) copy.push(inject)
          }
          return copy
        })
      }

      if (proto.readPixels) {
        const origReadPixels = proto.readPixels
        defineSafe(proto, 'readPixels', function (x, y, width, height, format, type, pixels) {
          const res = origReadPixels.apply(this, arguments)
          try {
            if (pixels && pixels.length && typeof pixels[0] === 'number') {
              const len = pixels.length
              for (let i = 0; i < len; i += 4) {
                const n = smallNoise(3)
                pixels[i] = clamp255(pixels[i] + n)
                if (i + 1 < len) pixels[i + 1] = clamp255(pixels[i + 1] + n)
                if (i + 2 < len) pixels[i + 2] = clamp255(pixels[i + 2] + n)
              }
            }
          } catch (_e) {}
          return res
        })
      }
    })
  }

  function patchAudio() {
    const AudioBuffer = window.AudioBuffer
    if (AudioBuffer && AudioBuffer.prototype && AudioBuffer.prototype.getChannelData) {
      const proto = AudioBuffer.prototype
      const orig = proto.getChannelData
      defineSafe(proto, 'getChannelData', function () {
        const data = orig.apply(this, arguments)
        try {
          const len = data.length
          const step = Math.max(1, Math.floor(len / 128))
          for (let i = 0; i < len; i += step) {
            const n = smallNoise(0.0005)
            data[i] = data[i] + n
          }
        } catch (_e) {}
        return data
      })
    }
  }

  function patchDOMRect() {
    const ElementProto = window.Element && window.Element.prototype
    const RangeProto = window.Range && window.Range.prototype

    function wrapRectObj(rect, keyPrefix) {
      if (!rect) return rect
      try {
        const keys = ['x', 'y', 'width', 'height', 'top', 'left', 'right', 'bottom']
        keys.forEach(function (k) {
          if (!(k in rect)) return
          const origVal = rect[k]
          if (typeof origVal !== 'number') return
          const noiseKey = keyPrefix + ':' + k
          const n = stableNoiseForKey(noiseKey, 0.7)
          const v = origVal + n
          try {
            Object.defineProperty(rect, k, {
              configurable: false,
              enumerable: true,
              get: function () {
                return v
              }
            })
          } catch (_e) {}
        })
      } catch (_e) {}
      return rect
    }

    if (ElementProto && ElementProto.getBoundingClientRect) {
      const orig = ElementProto.getBoundingClientRect
      defineSafe(ElementProto, 'getBoundingClientRect', function () {
        const rect = orig.apply(this, arguments)
        const tag = this.tagName || ''
        const id = this.id || ''
        const cls = this.className || ''
        const key = 'el:' + tag + '#' + id + '.' + cls
        return wrapRectObj(rect, key)
      })
    }

    if (ElementProto && ElementProto.getClientRects) {
      const origRects = ElementProto.getClientRects
      defineSafe(ElementProto, 'getClientRects', function () {
        const list = origRects.apply(this, arguments)
        try {
          for (let i = 0; i < list.length; i++) {
            const rect = list[i]
            const tag = this.tagName || ''
            const id = this.id || ''
            const cls = this.className || ''
            const key = 'elrect:' + tag + '#' + id + '.' + cls + ':' + i
            wrapRectObj(rect, key)
          }
        } catch (_e) {}
        return list
      })
    }

    if (RangeProto && RangeProto.getBoundingClientRect) {
      const origR = RangeProto.getBoundingClientRect
      defineSafe(RangeProto, 'getBoundingClientRect', function () {
        const rect = origR.apply(this, arguments)
        const key = 'range:' + String(this.startOffset) + '-' + String(this.endOffset)
        return wrapRectObj(rect, key)
      })
    }
  }

  function patchScreen() {
    const screen = window.screen
    if (!screen) return

    function wrapNumber(obj, prop, scale) {
      if (!obj || !(prop in obj)) return
      const val = obj[prop]
      if (typeof val !== 'number') return
      const noise = stableNoiseForKey('screen:' + prop, scale)
      const v = val + noise
      try {
        Object.defineProperty(obj, prop, {
          configurable: false,
          enumerable: true,
          get: function () {
            return v
          }
        })
      } catch (_e) {}
    }

    wrapNumber(screen, 'width', 3)
    wrapNumber(screen, 'height', 3)
    wrapNumber(screen, 'availWidth', 3)
    wrapNumber(screen, 'availHeight', 3)

    function wrapWindowSize(prop) {
      try {
        const desc = Object.getOwnPropertyDescriptor(window, prop)
        const base = desc && desc.get && desc.get.call ? desc.get.call(window) : window[prop]
        if (typeof base !== 'number') return
        const noise = stableNoiseForKey('win:' + prop, 3)
        const v = base + noise
        Object.defineProperty(window, prop, {
          configurable: false,
          enumerable: true,
          get: function () {
            return v
          }
        })
      } catch (_e) {}
    }

    wrapWindowSize('innerWidth')
    wrapWindowSize('innerHeight')
    wrapWindowSize('outerWidth')
    wrapWindowSize('outerHeight')
  }

  function patchWebGPU() {
    const nav = navigator
    if (!nav) return
    const gpu = nav.gpu
    if (!gpu || !gpu.requestAdapter) return

    const origRequestAdapter = gpu.requestAdapter.bind(gpu)

    function wrapLimits(limits) {
      if (!limits) return limits
      const clone = Object.create(Object.getPrototypeOf(limits) || null)
      for (const k in limits) {
        const v = limits[k]
        if (typeof v === 'number') {
          const n = stableNoiseForKey('webgpu:' + k, 4)
          clone[k] = Math.max(1, v + n)
        } else {
          clone[k] = v
        }
      }
      return clone
    }

    function wrapAdapter(adapter) {
      if (!adapter) return adapter
      if (adapter.__my_fp_wrapped) return adapter
      const proxy = new Proxy(adapter, {
        get(target, prop, receiver) {
          const v = Reflect.get(target, prop, receiver)
          if (prop === 'limits') {
            return wrapLimits(v)
          }
          return v
        }
      })
      Object.defineProperty(proxy, '__my_fp_wrapped', { value: true })
      return proxy
    }

    Object.defineProperty(nav.gpu, 'requestAdapter', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: function () {
        const p = origRequestAdapter.apply(this, arguments)
        if (!p || typeof p.then !== 'function') return p
        return p.then(function (adapter) {
          return wrapAdapter(adapter)
        })
      }
    })
  }

  try {
    patchCanvas()
  } catch (_e) {}
  try {
    patchWebGL()
  } catch (_e) {}
  try {
    patchAudio()
  } catch (_e) {}
  try {
    patchDOMRect()
  } catch (_e) {}
  try {
    patchScreen()
  } catch (_e) {}
  try {
    patchWebGPU()
  } catch (_e) {}
})()
