// ==UserScript==
// @name        GM_fetch
// @author      xihale
// @description CORS Bypass script
// @namespace   xihale.top
// @license     GPL version 3
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @connect     *
// @match       localhost
// @match       q.xihale.top
// @run-at      document-start
// @version     0.0.2
// @downloadURL https://update.greasyfork.org/scripts/550823/GM_fetch.user.js
// @updateURL https://update.greasyfork.org/scripts/550823/GM_fetch.meta.js
// ==/UserScript==

// reference: https://github.com/Tampermonkey/tampermonkey/issues/1278#issuecomment-1004568936

;(function () {
  'use strict'

  const PREFIX = '[GMFetch]'
  const nativeFetch =
    typeof unsafeWindow.fetch === 'function' ? unsafeWindow.fetch.bind(unsafeWindow) : null
  const RESPONSE_TYPE = GM_xmlhttpRequest?.RESPONSE_TYPE_STREAM ? 'stream' : 'arraybuffer'

  function toPlainHeaders(headersInit = {}) {
    try {
      return Object.fromEntries(new Headers(headersInit).entries())
    } catch (error) {
      console.warn(`${PREFIX} 无法解析请求头`, headersInit, error)
      return {}
    }
  }

  function parseHeaders(raw) {
    const headers = new Headers()
    if (!raw) {
      return headers
    }
    raw
      .trim()
      .split(/\r?\n/)
      .forEach((line) => {
        if (!line) return
        const index = line.indexOf(':')
        if (index === -1) return
        const key = line.slice(0, index).trim()
        const value = line.slice(index + 1).trim()
        try {
          headers.append(key, value)
        } catch (err) {
          console.warn(`${PREFIX} 无法解析响应头`, line, err)
        }
      })
    return headers
  }

  const toBody = (body, binary = false) => ({ body, binary })
  const emptyBody = () => toBody()
  const binaryBody = (body) => toBody(body, true)

  const matchAsync = async (value, cases, fallback) => {
    for (const [predicate, resolver] of cases) {
      if (await predicate(value)) {
        return resolver(value)
      }
    }
    return fallback(value)
  }

  const isInstance = (Ctor) => (value) => typeof Ctor !== 'undefined' && value instanceof Ctor

  async function normalizeBody(body) {
    return matchAsync(
      body,
      [
        [(value) => value == null, () => emptyBody()],
        [(value) => typeof value === 'string', (value) => toBody(value)],
        [isInstance(URLSearchParams), (value) => toBody(value.toString())],
        [isInstance(FormData), (value) => toBody(value)],
        [isInstance(Blob), async (value) => binaryBody(await value.arrayBuffer())],
        [isInstance(ArrayBuffer), (value) => binaryBody(value)],
        [ArrayBuffer.isView, (value) => binaryBody(value.buffer)],
      ],
      (value) => toBody(value),
    )
  }

  async function resolveBody(request, init = {}) {
    if (init.body !== undefined) {
      return normalizeBody(init.body)
    }

    if (!(request instanceof Request)) {
      return emptyBody()
    }

    const method = request.method?.toUpperCase?.() ?? 'GET'
    if (method === 'GET' || method === 'HEAD') {
      return emptyBody()
    }

    const readers = [
      async () => {
        const text = await request.clone().text()
        return text ? toBody(text) : null
      },
      async () => {
        const buffer = await request.clone().arrayBuffer()
        return buffer && buffer.byteLength > 0 ? binaryBody(buffer) : null
      },
    ]

    for (const read of readers) {
      try {
        const result = await read()
        if (result) {
          return result
        }
      } catch {}
    }

    return emptyBody()
  }

  function buildResponse(gmResponse) {
    const headers = parseHeaders(gmResponse.responseHeaders)
    const status = gmResponse.status || 0
    const init = {
      headers,
      status: status === 0 ? 200 : status,
      statusText: gmResponse.statusText || 'OK',
    }
    if (status === 0) {
      console.warn(`${PREFIX} 接收到状态码 0，自动回退为 200`, gmResponse)
    }
    const body = gmResponse.response ?? null
    return new Response(body, init)
  }

  function toRequest(input, init) {
    if (input instanceof Request) {
      return new Request(input, init)
    }
    return new Request(String(input), init)
  }

  async function gmFetch(input, fetchInit = {}) {
    const request = toRequest(input, fetchInit)
    const requestUrl = request.url

    if (!requestUrl) {
      throw new TypeError('Failed to execute fetch: URL is required')
    }

    if (typeof GM_xmlhttpRequest !== 'function') {
      if (nativeFetch) {
        return nativeFetch(input, fetchInit)
      }
      throw new ReferenceError('GM_xmlhttpRequest is not available')
    }

    const headers = toPlainHeaders(fetchInit.headers ?? request.headers)
    const { body, binary } = await resolveBody(request, fetchInit)

    return new Promise((resolve, reject) => {
      let settled = false

      const settleWith = (factory) => (response) => {
        if (settled) return
        settled = true
        try {
          resolve(factory(response))
        } catch (error) {
          reject(error)
        }
      }

      const finalize = settleWith(buildResponse)

      const config = {
        url: requestUrl,
        method: (fetchInit.method ?? request.method ?? 'GET').toUpperCase(),
        headers,
        data: body,
        binary: Boolean(binary),
        responseType: RESPONSE_TYPE,
        onload: finalize,
        onerror: (error) => {
          if (settled) return
          settled = true
          reject(error?.error || error || new Error('GM_xmlhttpRequest failed'))
        },
      }

      if (RESPONSE_TYPE === 'stream') {
        config.onreadystatechange = (response) => {
          if (response.readyState === 2 && !settled) {
            finalize(response)
          }
        }
      }

      GM_xmlhttpRequest(config)
    })
  }

  Object.defineProperty(gmFetch, 'native', {
    value: nativeFetch,
    writable: false,
    enumerable: false,
    configurable: false,
  })

  unsafeWindow.gm_fetch = gmFetch

  console.info(`${PREFIX} Tampermonkey 通用 CORS 代理已启用`)
})()
