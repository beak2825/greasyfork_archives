// ==UserScript==
// @name         Simple Router
// @description  A Simple Router based on the HTML5 History
// @namespace    https://github.com/dzist
// @version      0.0.1
// @author       Dylan Zhang
// ==/UserScript==

class SimpleRouter {
    constructor() {
        this.routes = new Map()
        this.beforeCbs = new Set()
        this.currentMatcher = null
        this.overrideHistory()
    }
    overrideHistory() {
        const { history } = window
        const hook = () => this.handle()
        const override = (fn) => {
            return (...args) => {
                const result = fn.apply(history, args)
                hook()
                return result
            }
        }

        history.pushState = override(history.pushState)
        history.replaceState = override(history.replaceState)
        window.addEventListener('popstate', hook)
    }

    // use(path: string | () => void, cb?: () => void): Router
    use(path, cb) {
        let matcher

        if (typeof path === 'string') {
            matcher = this.getMatcher(path)
            if (!matcher) {
                matcher = {
                    path,
                    regexp: new RegExp(`^${path}$`)
                }
            }
            this.currentMatcher = matcher
        }
        if (typeof path === 'function') {
            cb = path
            matcher = this.currentMatcher
        }
        if (cb) {
            const cbs = this.routes.get(matcher)
            cbs
                ? cbs.add(cb)
                : this.routes.set(matcher, new Set([cb]))
        }

        return this
    }
    // disuse(path: string, cb?: () => void): boolean
    disuse(path, cb) {
        const matcher = this.getMatcher(path)
        if (!matcher) return true

        const cbs = this.routes.get(matcher)
        if (!cbs) return true

        if (!cb) {
            cbs.clear()
            return true
        }

        return cbs.delete(cb)
    }
    getMatcher(path) {
        return this.routes
            .keys()
            .find(m => m.path === path)
    }
    once(path, cb) {
        if (typeof path === 'string' && !cb) {
            throw new Error(
                `It is not the path, but the corresponding function that can only be used once.` +
                `Please specify a callback function for the path: ${path}\n` +
                `such as once('/', () => {...})`
            )
        }

        if (typeof path === 'function') {
            cb = path
            path = this.currentMatcher?.path
            if (!path) {
                throw new Error(
                    `Please specify the path for the callback function first:\n${cb}\n` +
                    `such as use('/') or once('/', () => {...})`
                )
            }
        }
        const fnOnce = (...args) => {
            cb(...args)
            this.disuse(path, fnOnce)
        }

        return this.use(path, fnOnce)
    }
    before(cb) {
        this.beforeCbs.add(cb)
        return this
    }
    beforeOnce(cb) {
        const fnOnce = (...args) => {
            cb(...args)
            this.beforeCbs.delete(fnOnce)
        }
        return this.before(fnOnce)
    }
    handle(path = this.path) {
        this.beforeCbs.forEach(cb => cb())

        for(const [matcher, cbs] of this.routes) {
            if (matcher.regexp.test(path)) {
                cbs.forEach(cb => cb())
                break
            }
        }
    }
    get path() {
        const segments = location.pathname.split('/')
        const path = segments[1]
        return path ? `/${path}` : '/'
    }
}