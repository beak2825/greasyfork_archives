// ==UserScript==
// @name               Set npm Trusted Publisher
// @name:zh-CN         设置 npm Trusted Publisher
// @name:zh-TW         設定 npm Trusted Publisher
// @version            1.2.0
// @description        Set npm Trusted Publisher for packages on npmjs.com.
// @description:zh-CN  为 npmjs.com 上的包设置 npm Trusted Publisher。
// @description:zh-TW  為 npmjs.com 上的包設定 npm Trusted Publisher。
// @author             Kevin Deng <sxzz@sxzz.moe>
// @homepage           https://github.com/sxzz/userscripts
// @supportURL         https://github.com/sxzz/userscripts/issues
// @license            MIT
// @contributionURL    https://github.com/sponsors/sxzz
// @run-at             document-end
// @include            https://www.npmjs.com/package/*
// @grant              GM_xmlhttpRequest
// @namespace          https://github.com/sxzz/userscripts/blob/main/dist/npm-trusted-publisher.user.js
// @downloadURL https://update.greasyfork.org/scripts/550405/Set%20npm%20Trusted%20Publisher.user.js
// @updateURL https://update.greasyfork.org/scripts/550405/Set%20npm%20Trusted%20Publisher.meta.js
// ==/UserScript==
(function() {
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __esmMin = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
	var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
	var __export = (all, symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	var __toCommonJS = (mod) => __hasOwnProp.call(mod, "module.exports") ? mod["module.exports"] : __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	var require_commonjs = /* @__PURE__ */ __commonJSMin(((exports) => {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.LRUCache = void 0;
		const defaultPerf = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date;
		const warned = /* @__PURE__ */ new Set();
		/* c8 ignore start */
		const PROCESS = typeof process === "object" && !!process ? process : {};
		/* c8 ignore start */
		const emitWarning = (msg, type, code, fn) => {
			typeof PROCESS.emitWarning === "function" ? PROCESS.emitWarning(msg, type, code, fn) : console.error(`[${code}] ${type}: ${msg}`);
		};
		let AC = globalThis.AbortController;
		let AS = globalThis.AbortSignal;
		/* c8 ignore start */
		if (typeof AC === "undefined") {
			AS = class AbortSignal {
				onabort;
				_onabort = [];
				reason;
				aborted = false;
				addEventListener(_, fn) {
					this._onabort.push(fn);
				}
			};
			AC = class AbortController {
				constructor() {
					warnACPolyfill();
				}
				signal = new AS();
				abort(reason) {
					if (this.signal.aborted) return;
					this.signal.reason = reason;
					this.signal.aborted = true;
					for (const fn of this.signal._onabort) fn(reason);
					this.signal.onabort?.(reason);
				}
			};
			let printACPolyfillWarning = PROCESS.env?.LRU_CACHE_IGNORE_AC_WARNING !== "1";
			const warnACPolyfill = () => {
				if (!printACPolyfillWarning) return;
				printACPolyfillWarning = false;
				emitWarning("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", warnACPolyfill);
			};
		}
		/* c8 ignore stop */
		const shouldWarn = (code) => !warned.has(code);
		const isPosInt = (n) => n && n === Math.floor(n) && n > 0 && isFinite(n);
		/* c8 ignore start */
		const getUintArray = (max) => !isPosInt(max) ? null : max <= Math.pow(2, 8) ? Uint8Array : max <= Math.pow(2, 16) ? Uint16Array : max <= Math.pow(2, 32) ? Uint32Array : max <= Number.MAX_SAFE_INTEGER ? ZeroArray : null;
		/* c8 ignore stop */
		var ZeroArray = class extends Array {
			constructor(size) {
				super(size);
				this.fill(0);
			}
		};
		var Stack = class Stack {
			heap;
			length;
			static #constructing = false;
			static create(max) {
				const HeapCls = getUintArray(max);
				if (!HeapCls) return [];
				Stack.#constructing = true;
				const s = new Stack(max, HeapCls);
				Stack.#constructing = false;
				return s;
			}
			constructor(max, HeapCls) {
				/* c8 ignore start */
				if (!Stack.#constructing) throw new TypeError("instantiate Stack using Stack.create(n)");
				/* c8 ignore stop */
				this.heap = new HeapCls(max);
				this.length = 0;
			}
			push(n) {
				this.heap[this.length++] = n;
			}
			pop() {
				return this.heap[--this.length];
			}
		};
		exports.LRUCache = class LRUCache$1 {
			#max;
			#maxSize;
			#dispose;
			#onInsert;
			#disposeAfter;
			#fetchMethod;
			#memoMethod;
			#perf;
			get perf() {
				return this.#perf;
			}
			ttl;
			ttlResolution;
			ttlAutopurge;
			updateAgeOnGet;
			updateAgeOnHas;
			allowStale;
			noDisposeOnSet;
			noUpdateTTL;
			maxEntrySize;
			sizeCalculation;
			noDeleteOnFetchRejection;
			noDeleteOnStaleGet;
			allowStaleOnFetchAbort;
			allowStaleOnFetchRejection;
			ignoreFetchAbort;
			#size;
			#calculatedSize;
			#keyMap;
			#keyList;
			#valList;
			#next;
			#prev;
			#head;
			#tail;
			#free;
			#disposed;
			#sizes;
			#starts;
			#ttls;
			#autopurgeTimers;
			#hasDispose;
			#hasFetchMethod;
			#hasDisposeAfter;
			#hasOnInsert;
			static unsafeExposeInternals(c) {
				return {
					starts: c.#starts,
					ttls: c.#ttls,
					autopurgeTimers: c.#autopurgeTimers,
					sizes: c.#sizes,
					keyMap: c.#keyMap,
					keyList: c.#keyList,
					valList: c.#valList,
					next: c.#next,
					prev: c.#prev,
					get head() {
						return c.#head;
					},
					get tail() {
						return c.#tail;
					},
					free: c.#free,
					isBackgroundFetch: (p) => c.#isBackgroundFetch(p),
					backgroundFetch: (k, index, options, context) => c.#backgroundFetch(k, index, options, context),
					moveToTail: (index) => c.#moveToTail(index),
					indexes: (options) => c.#indexes(options),
					rindexes: (options) => c.#rindexes(options),
					isStale: (index) => c.#isStale(index)
				};
			}
			get max() {
				return this.#max;
			}
			get maxSize() {
				return this.#maxSize;
			}
			get calculatedSize() {
				return this.#calculatedSize;
			}
			get size() {
				return this.#size;
			}
			get fetchMethod() {
				return this.#fetchMethod;
			}
			get memoMethod() {
				return this.#memoMethod;
			}
			get dispose() {
				return this.#dispose;
			}
			get onInsert() {
				return this.#onInsert;
			}
			get disposeAfter() {
				return this.#disposeAfter;
			}
			constructor(options) {
				const { max = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, onInsert, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, memoMethod, noDeleteOnFetchRejection, noDeleteOnStaleGet, allowStaleOnFetchRejection, allowStaleOnFetchAbort, ignoreFetchAbort, perf } = options;
				if (perf !== void 0) {
					if (typeof perf?.now !== "function") throw new TypeError("perf option must have a now() method if specified");
				}
				this.#perf = perf ?? defaultPerf;
				if (max !== 0 && !isPosInt(max)) throw new TypeError("max option must be a nonnegative integer");
				const UintArray = max ? getUintArray(max) : Array;
				if (!UintArray) throw new Error("invalid max value: " + max);
				this.#max = max;
				this.#maxSize = maxSize;
				this.maxEntrySize = maxEntrySize || this.#maxSize;
				this.sizeCalculation = sizeCalculation;
				if (this.sizeCalculation) {
					if (!this.#maxSize && !this.maxEntrySize) throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
					if (typeof this.sizeCalculation !== "function") throw new TypeError("sizeCalculation set to non-function");
				}
				if (memoMethod !== void 0 && typeof memoMethod !== "function") throw new TypeError("memoMethod must be a function if defined");
				this.#memoMethod = memoMethod;
				if (fetchMethod !== void 0 && typeof fetchMethod !== "function") throw new TypeError("fetchMethod must be a function if specified");
				this.#fetchMethod = fetchMethod;
				this.#hasFetchMethod = !!fetchMethod;
				this.#keyMap = /* @__PURE__ */ new Map();
				this.#keyList = new Array(max).fill(void 0);
				this.#valList = new Array(max).fill(void 0);
				this.#next = new UintArray(max);
				this.#prev = new UintArray(max);
				this.#head = 0;
				this.#tail = 0;
				this.#free = Stack.create(max);
				this.#size = 0;
				this.#calculatedSize = 0;
				if (typeof dispose === "function") this.#dispose = dispose;
				if (typeof onInsert === "function") this.#onInsert = onInsert;
				if (typeof disposeAfter === "function") {
					this.#disposeAfter = disposeAfter;
					this.#disposed = [];
				} else {
					this.#disposeAfter = void 0;
					this.#disposed = void 0;
				}
				this.#hasDispose = !!this.#dispose;
				this.#hasOnInsert = !!this.#onInsert;
				this.#hasDisposeAfter = !!this.#disposeAfter;
				this.noDisposeOnSet = !!noDisposeOnSet;
				this.noUpdateTTL = !!noUpdateTTL;
				this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
				this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
				this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
				this.ignoreFetchAbort = !!ignoreFetchAbort;
				if (this.maxEntrySize !== 0) {
					if (this.#maxSize !== 0) {
						if (!isPosInt(this.#maxSize)) throw new TypeError("maxSize must be a positive integer if specified");
					}
					if (!isPosInt(this.maxEntrySize)) throw new TypeError("maxEntrySize must be a positive integer if specified");
					this.#initializeSizeTracking();
				}
				this.allowStale = !!allowStale;
				this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
				this.updateAgeOnGet = !!updateAgeOnGet;
				this.updateAgeOnHas = !!updateAgeOnHas;
				this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
				this.ttlAutopurge = !!ttlAutopurge;
				this.ttl = ttl || 0;
				if (this.ttl) {
					if (!isPosInt(this.ttl)) throw new TypeError("ttl must be a positive integer if specified");
					this.#initializeTTLTracking();
				}
				if (this.#max === 0 && this.ttl === 0 && this.#maxSize === 0) throw new TypeError("At least one of max, maxSize, or ttl is required");
				if (!this.ttlAutopurge && !this.#max && !this.#maxSize) {
					const code = "LRU_CACHE_UNBOUNDED";
					if (shouldWarn(code)) {
						warned.add(code);
						emitWarning("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.", "UnboundedCacheWarning", code, LRUCache$1);
					}
				}
			}
			getRemainingTTL(key) {
				return this.#keyMap.has(key) ? Infinity : 0;
			}
			#initializeTTLTracking() {
				const ttls = new ZeroArray(this.#max);
				const starts = new ZeroArray(this.#max);
				this.#ttls = ttls;
				this.#starts = starts;
				const purgeTimers = this.ttlAutopurge ? new Array(this.#max) : void 0;
				this.#autopurgeTimers = purgeTimers;
				this.#setItemTTL = (index, ttl, start = this.#perf.now()) => {
					starts[index] = ttl !== 0 ? start : 0;
					ttls[index] = ttl;
					if (purgeTimers?.[index]) {
						clearTimeout(purgeTimers[index]);
						purgeTimers[index] = void 0;
					}
					if (ttl !== 0 && purgeTimers) {
						const t = setTimeout(() => {
							if (this.#isStale(index)) this.#delete(this.#keyList[index], "expire");
						}, ttl + 1);
						/* c8 ignore start */
						if (t.unref) t.unref();
						/* c8 ignore stop */
						purgeTimers[index] = t;
					}
				};
				this.#updateItemAge = (index) => {
					starts[index] = ttls[index] !== 0 ? this.#perf.now() : 0;
				};
				this.#statusTTL = (status, index) => {
					if (ttls[index]) {
						const ttl = ttls[index];
						const start = starts[index];
						/* c8 ignore next */
						if (!ttl || !start) return;
						status.ttl = ttl;
						status.start = start;
						status.now = cachedNow || getNow();
						status.remainingTTL = ttl - (status.now - start);
					}
				};
				let cachedNow = 0;
				const getNow = () => {
					const n = this.#perf.now();
					if (this.ttlResolution > 0) {
						cachedNow = n;
						const t = setTimeout(() => cachedNow = 0, this.ttlResolution);
						/* c8 ignore start */
						if (t.unref) t.unref();
					}
					return n;
				};
				this.getRemainingTTL = (key) => {
					const index = this.#keyMap.get(key);
					if (index === void 0) return 0;
					const ttl = ttls[index];
					const start = starts[index];
					if (!ttl || !start) return Infinity;
					return ttl - ((cachedNow || getNow()) - start);
				};
				this.#isStale = (index) => {
					const s = starts[index];
					const t = ttls[index];
					return !!t && !!s && (cachedNow || getNow()) - s > t;
				};
			}
			#updateItemAge = () => {};
			#statusTTL = () => {};
			#setItemTTL = () => {};
			/* c8 ignore stop */
			#isStale = () => false;
			#initializeSizeTracking() {
				const sizes = new ZeroArray(this.#max);
				this.#calculatedSize = 0;
				this.#sizes = sizes;
				this.#removeItemSize = (index) => {
					this.#calculatedSize -= sizes[index];
					sizes[index] = 0;
				};
				this.#requireSize = (k, v, size, sizeCalculation) => {
					if (this.#isBackgroundFetch(v)) return 0;
					if (!isPosInt(size)) if (sizeCalculation) {
						if (typeof sizeCalculation !== "function") throw new TypeError("sizeCalculation must be a function");
						size = sizeCalculation(v, k);
						if (!isPosInt(size)) throw new TypeError("sizeCalculation return invalid (expect positive integer)");
					} else throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
					return size;
				};
				this.#addItemSize = (index, size, status) => {
					sizes[index] = size;
					if (this.#maxSize) {
						const maxSize = this.#maxSize - sizes[index];
						while (this.#calculatedSize > maxSize) this.#evict(true);
					}
					this.#calculatedSize += sizes[index];
					if (status) {
						status.entrySize = size;
						status.totalCalculatedSize = this.#calculatedSize;
					}
				};
			}
			#removeItemSize = (_i) => {};
			#addItemSize = (_i, _s, _st) => {};
			#requireSize = (_k, _v, size, sizeCalculation) => {
				if (size || sizeCalculation) throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
				return 0;
			};
			*#indexes({ allowStale = this.allowStale } = {}) {
				if (this.#size) for (let i = this.#tail;;) {
					if (!this.#isValidIndex(i)) break;
					if (allowStale || !this.#isStale(i)) yield i;
					if (i === this.#head) break;
					else i = this.#prev[i];
				}
			}
			*#rindexes({ allowStale = this.allowStale } = {}) {
				if (this.#size) for (let i = this.#head;;) {
					if (!this.#isValidIndex(i)) break;
					if (allowStale || !this.#isStale(i)) yield i;
					if (i === this.#tail) break;
					else i = this.#next[i];
				}
			}
			#isValidIndex(index) {
				return index !== void 0 && this.#keyMap.get(this.#keyList[index]) === index;
			}
			*entries() {
				for (const i of this.#indexes()) if (this.#valList[i] !== void 0 && this.#keyList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) yield [this.#keyList[i], this.#valList[i]];
			}
			*rentries() {
				for (const i of this.#rindexes()) if (this.#valList[i] !== void 0 && this.#keyList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) yield [this.#keyList[i], this.#valList[i]];
			}
			*keys() {
				for (const i of this.#indexes()) {
					const k = this.#keyList[i];
					if (k !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) yield k;
				}
			}
			*rkeys() {
				for (const i of this.#rindexes()) {
					const k = this.#keyList[i];
					if (k !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) yield k;
				}
			}
			*values() {
				for (const i of this.#indexes()) if (this.#valList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) yield this.#valList[i];
			}
			*rvalues() {
				for (const i of this.#rindexes()) if (this.#valList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) yield this.#valList[i];
			}
			[Symbol.iterator]() {
				return this.entries();
			}
			[Symbol.toStringTag] = "LRUCache";
			find(fn, getOptions = {}) {
				for (const i of this.#indexes()) {
					const v = this.#valList[i];
					const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
					if (value === void 0) continue;
					if (fn(value, this.#keyList[i], this)) return this.get(this.#keyList[i], getOptions);
				}
			}
			forEach(fn, thisp = this) {
				for (const i of this.#indexes()) {
					const v = this.#valList[i];
					const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
					if (value === void 0) continue;
					fn.call(thisp, value, this.#keyList[i], this);
				}
			}
			rforEach(fn, thisp = this) {
				for (const i of this.#rindexes()) {
					const v = this.#valList[i];
					const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
					if (value === void 0) continue;
					fn.call(thisp, value, this.#keyList[i], this);
				}
			}
			purgeStale() {
				let deleted = false;
				for (const i of this.#rindexes({ allowStale: true })) if (this.#isStale(i)) {
					this.#delete(this.#keyList[i], "expire");
					deleted = true;
				}
				return deleted;
			}
			info(key) {
				const i = this.#keyMap.get(key);
				if (i === void 0) return void 0;
				const v = this.#valList[i];
				/* c8 ignore start - this isn't tested for the info function,
				* but it's the same logic as found in other places. */
				const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
				if (value === void 0) return void 0;
				/* c8 ignore end */
				const entry = { value };
				if (this.#ttls && this.#starts) {
					const ttl = this.#ttls[i];
					const start = this.#starts[i];
					if (ttl && start) {
						entry.ttl = ttl - (this.#perf.now() - start);
						entry.start = Date.now();
					}
				}
				if (this.#sizes) entry.size = this.#sizes[i];
				return entry;
			}
			dump() {
				const arr = [];
				for (const i of this.#indexes({ allowStale: true })) {
					const key = this.#keyList[i];
					const v = this.#valList[i];
					const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
					if (value === void 0 || key === void 0) continue;
					const entry = { value };
					if (this.#ttls && this.#starts) {
						entry.ttl = this.#ttls[i];
						const age = this.#perf.now() - this.#starts[i];
						entry.start = Math.floor(Date.now() - age);
					}
					if (this.#sizes) entry.size = this.#sizes[i];
					arr.unshift([key, entry]);
				}
				return arr;
			}
			load(arr) {
				this.clear();
				for (const [key, entry] of arr) {
					if (entry.start) {
						const age = Date.now() - entry.start;
						entry.start = this.#perf.now() - age;
					}
					this.set(key, entry.value, entry);
				}
			}
			set(k, v, setOptions = {}) {
				if (v === void 0) {
					this.delete(k);
					return this;
				}
				const { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, sizeCalculation = this.sizeCalculation, status } = setOptions;
				let { noUpdateTTL = this.noUpdateTTL } = setOptions;
				const size = this.#requireSize(k, v, setOptions.size || 0, sizeCalculation);
				if (this.maxEntrySize && size > this.maxEntrySize) {
					if (status) {
						status.set = "miss";
						status.maxEntrySizeExceeded = true;
					}
					this.#delete(k, "set");
					return this;
				}
				let index = this.#size === 0 ? void 0 : this.#keyMap.get(k);
				if (index === void 0) {
					index = this.#size === 0 ? this.#tail : this.#free.length !== 0 ? this.#free.pop() : this.#size === this.#max ? this.#evict(false) : this.#size;
					this.#keyList[index] = k;
					this.#valList[index] = v;
					this.#keyMap.set(k, index);
					this.#next[this.#tail] = index;
					this.#prev[index] = this.#tail;
					this.#tail = index;
					this.#size++;
					this.#addItemSize(index, size, status);
					if (status) status.set = "add";
					noUpdateTTL = false;
					if (this.#hasOnInsert) this.#onInsert?.(v, k, "add");
				} else {
					this.#moveToTail(index);
					const oldVal = this.#valList[index];
					if (v !== oldVal) {
						if (this.#hasFetchMethod && this.#isBackgroundFetch(oldVal)) {
							oldVal.__abortController.abort(/* @__PURE__ */ new Error("replaced"));
							const { __staleWhileFetching: s } = oldVal;
							if (s !== void 0 && !noDisposeOnSet) {
								if (this.#hasDispose) this.#dispose?.(s, k, "set");
								if (this.#hasDisposeAfter) this.#disposed?.push([
									s,
									k,
									"set"
								]);
							}
						} else if (!noDisposeOnSet) {
							if (this.#hasDispose) this.#dispose?.(oldVal, k, "set");
							if (this.#hasDisposeAfter) this.#disposed?.push([
								oldVal,
								k,
								"set"
							]);
						}
						this.#removeItemSize(index);
						this.#addItemSize(index, size, status);
						this.#valList[index] = v;
						if (status) {
							status.set = "replace";
							const oldValue = oldVal && this.#isBackgroundFetch(oldVal) ? oldVal.__staleWhileFetching : oldVal;
							if (oldValue !== void 0) status.oldValue = oldValue;
						}
					} else if (status) status.set = "update";
					if (this.#hasOnInsert) this.onInsert?.(v, k, v === oldVal ? "update" : "replace");
				}
				if (ttl !== 0 && !this.#ttls) this.#initializeTTLTracking();
				if (this.#ttls) {
					if (!noUpdateTTL) this.#setItemTTL(index, ttl, start);
					if (status) this.#statusTTL(status, index);
				}
				if (!noDisposeOnSet && this.#hasDisposeAfter && this.#disposed) {
					const dt = this.#disposed;
					let task;
					while (task = dt?.shift()) this.#disposeAfter?.(...task);
				}
				return this;
			}
			pop() {
				try {
					while (this.#size) {
						const val = this.#valList[this.#head];
						this.#evict(true);
						if (this.#isBackgroundFetch(val)) {
							if (val.__staleWhileFetching) return val.__staleWhileFetching;
						} else if (val !== void 0) return val;
					}
				} finally {
					if (this.#hasDisposeAfter && this.#disposed) {
						const dt = this.#disposed;
						let task;
						while (task = dt?.shift()) this.#disposeAfter?.(...task);
					}
				}
			}
			#evict(free) {
				const head = this.#head;
				const k = this.#keyList[head];
				const v = this.#valList[head];
				if (this.#hasFetchMethod && this.#isBackgroundFetch(v)) v.__abortController.abort(/* @__PURE__ */ new Error("evicted"));
				else if (this.#hasDispose || this.#hasDisposeAfter) {
					if (this.#hasDispose) this.#dispose?.(v, k, "evict");
					if (this.#hasDisposeAfter) this.#disposed?.push([
						v,
						k,
						"evict"
					]);
				}
				this.#removeItemSize(head);
				if (this.#autopurgeTimers?.[head]) {
					clearTimeout(this.#autopurgeTimers[head]);
					this.#autopurgeTimers[head] = void 0;
				}
				if (free) {
					this.#keyList[head] = void 0;
					this.#valList[head] = void 0;
					this.#free.push(head);
				}
				if (this.#size === 1) {
					this.#head = this.#tail = 0;
					this.#free.length = 0;
				} else this.#head = this.#next[head];
				this.#keyMap.delete(k);
				this.#size--;
				return head;
			}
			has(k, hasOptions = {}) {
				const { updateAgeOnHas = this.updateAgeOnHas, status } = hasOptions;
				const index = this.#keyMap.get(k);
				if (index !== void 0) {
					const v = this.#valList[index];
					if (this.#isBackgroundFetch(v) && v.__staleWhileFetching === void 0) return false;
					if (!this.#isStale(index)) {
						if (updateAgeOnHas) this.#updateItemAge(index);
						if (status) {
							status.has = "hit";
							this.#statusTTL(status, index);
						}
						return true;
					} else if (status) {
						status.has = "stale";
						this.#statusTTL(status, index);
					}
				} else if (status) status.has = "miss";
				return false;
			}
			peek(k, peekOptions = {}) {
				const { allowStale = this.allowStale } = peekOptions;
				const index = this.#keyMap.get(k);
				if (index === void 0 || !allowStale && this.#isStale(index)) return;
				const v = this.#valList[index];
				return this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
			}
			#backgroundFetch(k, index, options, context) {
				const v = index === void 0 ? void 0 : this.#valList[index];
				if (this.#isBackgroundFetch(v)) return v;
				const ac = new AC();
				const { signal } = options;
				signal?.addEventListener("abort", () => ac.abort(signal.reason), { signal: ac.signal });
				const fetchOpts = {
					signal: ac.signal,
					options,
					context
				};
				const cb = (v$1, updateCache = false) => {
					const { aborted } = ac.signal;
					const ignoreAbort = options.ignoreFetchAbort && v$1 !== void 0;
					if (options.status) if (aborted && !updateCache) {
						options.status.fetchAborted = true;
						options.status.fetchError = ac.signal.reason;
						if (ignoreAbort) options.status.fetchAbortIgnored = true;
					} else options.status.fetchResolved = true;
					if (aborted && !ignoreAbort && !updateCache) return fetchFail(ac.signal.reason);
					const bf$1 = p;
					const vl = this.#valList[index];
					if (vl === p || ignoreAbort && updateCache && vl === void 0) if (v$1 === void 0) if (bf$1.__staleWhileFetching !== void 0) this.#valList[index] = bf$1.__staleWhileFetching;
					else this.#delete(k, "fetch");
					else {
						if (options.status) options.status.fetchUpdated = true;
						this.set(k, v$1, fetchOpts.options);
					}
					return v$1;
				};
				const eb = (er) => {
					if (options.status) {
						options.status.fetchRejected = true;
						options.status.fetchError = er;
					}
					return fetchFail(er);
				};
				const fetchFail = (er) => {
					const { aborted } = ac.signal;
					const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
					const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
					const noDelete = allowStale || options.noDeleteOnFetchRejection;
					const bf$1 = p;
					if (this.#valList[index] === p) {
						if (!noDelete || bf$1.__staleWhileFetching === void 0) this.#delete(k, "fetch");
						else if (!allowStaleAborted) this.#valList[index] = bf$1.__staleWhileFetching;
					}
					if (allowStale) {
						if (options.status && bf$1.__staleWhileFetching !== void 0) options.status.returnedStale = true;
						return bf$1.__staleWhileFetching;
					} else if (bf$1.__returned === bf$1) throw er;
				};
				const pcall = (res, rej) => {
					const fmp = this.#fetchMethod?.(k, v, fetchOpts);
					if (fmp && fmp instanceof Promise) fmp.then((v$1) => res(v$1 === void 0 ? void 0 : v$1), rej);
					ac.signal.addEventListener("abort", () => {
						if (!options.ignoreFetchAbort || options.allowStaleOnFetchAbort) {
							res(void 0);
							if (options.allowStaleOnFetchAbort) res = (v$1) => cb(v$1, true);
						}
					});
				};
				if (options.status) options.status.fetchDispatched = true;
				const p = new Promise(pcall).then(cb, eb);
				const bf = Object.assign(p, {
					__abortController: ac,
					__staleWhileFetching: v,
					__returned: void 0
				});
				if (index === void 0) {
					this.set(k, bf, {
						...fetchOpts.options,
						status: void 0
					});
					index = this.#keyMap.get(k);
				} else this.#valList[index] = bf;
				return bf;
			}
			#isBackgroundFetch(p) {
				if (!this.#hasFetchMethod) return false;
				const b = p;
				return !!b && b instanceof Promise && b.hasOwnProperty("__staleWhileFetching") && b.__abortController instanceof AC;
			}
			async fetch(k, fetchOptions = {}) {
				const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, ttl = this.ttl, noDisposeOnSet = this.noDisposeOnSet, size = 0, sizeCalculation = this.sizeCalculation, noUpdateTTL = this.noUpdateTTL, noDeleteOnFetchRejection = this.noDeleteOnFetchRejection, allowStaleOnFetchRejection = this.allowStaleOnFetchRejection, ignoreFetchAbort = this.ignoreFetchAbort, allowStaleOnFetchAbort = this.allowStaleOnFetchAbort, context, forceRefresh = false, status, signal } = fetchOptions;
				if (!this.#hasFetchMethod) {
					if (status) status.fetch = "get";
					return this.get(k, {
						allowStale,
						updateAgeOnGet,
						noDeleteOnStaleGet,
						status
					});
				}
				const options = {
					allowStale,
					updateAgeOnGet,
					noDeleteOnStaleGet,
					ttl,
					noDisposeOnSet,
					size,
					sizeCalculation,
					noUpdateTTL,
					noDeleteOnFetchRejection,
					allowStaleOnFetchRejection,
					allowStaleOnFetchAbort,
					ignoreFetchAbort,
					status,
					signal
				};
				let index = this.#keyMap.get(k);
				if (index === void 0) {
					if (status) status.fetch = "miss";
					const p = this.#backgroundFetch(k, index, options, context);
					return p.__returned = p;
				} else {
					const v = this.#valList[index];
					if (this.#isBackgroundFetch(v)) {
						const stale = allowStale && v.__staleWhileFetching !== void 0;
						if (status) {
							status.fetch = "inflight";
							if (stale) status.returnedStale = true;
						}
						return stale ? v.__staleWhileFetching : v.__returned = v;
					}
					const isStale = this.#isStale(index);
					if (!forceRefresh && !isStale) {
						if (status) status.fetch = "hit";
						this.#moveToTail(index);
						if (updateAgeOnGet) this.#updateItemAge(index);
						if (status) this.#statusTTL(status, index);
						return v;
					}
					const p = this.#backgroundFetch(k, index, options, context);
					const staleVal = p.__staleWhileFetching !== void 0 && allowStale;
					if (status) {
						status.fetch = isStale ? "stale" : "refresh";
						if (staleVal && isStale) status.returnedStale = true;
					}
					return staleVal ? p.__staleWhileFetching : p.__returned = p;
				}
			}
			async forceFetch(k, fetchOptions = {}) {
				const v = await this.fetch(k, fetchOptions);
				if (v === void 0) throw new Error("fetch() returned undefined");
				return v;
			}
			memo(k, memoOptions = {}) {
				const memoMethod = this.#memoMethod;
				if (!memoMethod) throw new Error("no memoMethod provided to constructor");
				const { context, forceRefresh, ...options } = memoOptions;
				const v = this.get(k, options);
				if (!forceRefresh && v !== void 0) return v;
				const vv = memoMethod(k, v, {
					options,
					context
				});
				this.set(k, vv, options);
				return vv;
			}
			get(k, getOptions = {}) {
				const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, status } = getOptions;
				const index = this.#keyMap.get(k);
				if (index !== void 0) {
					const value = this.#valList[index];
					const fetching = this.#isBackgroundFetch(value);
					if (status) this.#statusTTL(status, index);
					if (this.#isStale(index)) {
						if (status) status.get = "stale";
						if (!fetching) {
							if (!noDeleteOnStaleGet) this.#delete(k, "expire");
							if (status && allowStale) status.returnedStale = true;
							return allowStale ? value : void 0;
						} else {
							if (status && allowStale && value.__staleWhileFetching !== void 0) status.returnedStale = true;
							return allowStale ? value.__staleWhileFetching : void 0;
						}
					} else {
						if (status) status.get = "hit";
						if (fetching) return value.__staleWhileFetching;
						this.#moveToTail(index);
						if (updateAgeOnGet) this.#updateItemAge(index);
						return value;
					}
				} else if (status) status.get = "miss";
			}
			#connect(p, n) {
				this.#prev[n] = p;
				this.#next[p] = n;
			}
			#moveToTail(index) {
				if (index !== this.#tail) {
					if (index === this.#head) this.#head = this.#next[index];
					else this.#connect(this.#prev[index], this.#next[index]);
					this.#connect(this.#tail, index);
					this.#tail = index;
				}
			}
			delete(k) {
				return this.#delete(k, "delete");
			}
			#delete(k, reason) {
				let deleted = false;
				if (this.#size !== 0) {
					const index = this.#keyMap.get(k);
					if (index !== void 0) {
						if (this.#autopurgeTimers?.[index]) {
							clearTimeout(this.#autopurgeTimers?.[index]);
							this.#autopurgeTimers[index] = void 0;
						}
						deleted = true;
						if (this.#size === 1) this.#clear(reason);
						else {
							this.#removeItemSize(index);
							const v = this.#valList[index];
							if (this.#isBackgroundFetch(v)) v.__abortController.abort(/* @__PURE__ */ new Error("deleted"));
							else if (this.#hasDispose || this.#hasDisposeAfter) {
								if (this.#hasDispose) this.#dispose?.(v, k, reason);
								if (this.#hasDisposeAfter) this.#disposed?.push([
									v,
									k,
									reason
								]);
							}
							this.#keyMap.delete(k);
							this.#keyList[index] = void 0;
							this.#valList[index] = void 0;
							if (index === this.#tail) this.#tail = this.#prev[index];
							else if (index === this.#head) this.#head = this.#next[index];
							else {
								const pi = this.#prev[index];
								this.#next[pi] = this.#next[index];
								const ni = this.#next[index];
								this.#prev[ni] = this.#prev[index];
							}
							this.#size--;
							this.#free.push(index);
						}
					}
				}
				if (this.#hasDisposeAfter && this.#disposed?.length) {
					const dt = this.#disposed;
					let task;
					while (task = dt?.shift()) this.#disposeAfter?.(...task);
				}
				return deleted;
			}
			clear() {
				return this.#clear("delete");
			}
			#clear(reason) {
				for (const index of this.#rindexes({ allowStale: true })) {
					const v = this.#valList[index];
					if (this.#isBackgroundFetch(v)) v.__abortController.abort(/* @__PURE__ */ new Error("deleted"));
					else {
						const k = this.#keyList[index];
						if (this.#hasDispose) this.#dispose?.(v, k, reason);
						if (this.#hasDisposeAfter) this.#disposed?.push([
							v,
							k,
							reason
						]);
					}
				}
				this.#keyMap.clear();
				this.#valList.fill(void 0);
				this.#keyList.fill(void 0);
				if (this.#ttls && this.#starts) {
					this.#ttls.fill(0);
					this.#starts.fill(0);
					for (const t of this.#autopurgeTimers ?? []) if (t !== void 0) clearTimeout(t);
					this.#autopurgeTimers?.fill(void 0);
				}
				if (this.#sizes) this.#sizes.fill(0);
				this.#head = 0;
				this.#tail = 0;
				this.#free.length = 0;
				this.#calculatedSize = 0;
				this.#size = 0;
				if (this.#hasDisposeAfter && this.#disposed) {
					const dt = this.#disposed;
					let task;
					while (task = dt?.shift()) this.#disposeAfter?.(...task);
				}
			}
		};
	}));
	var require_hosts = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		const maybeJoin = (...args) => args.every((arg) => arg) ? args.join("") : "";
		const maybeEncode = (arg) => arg ? encodeURIComponent(arg) : "";
		const formatHashFragment = (f) => f.toLowerCase().replace(/^\W+/g, "").replace(/(?<!\W)\W+$/, "").replace(/\//g, "").replace(/\W+/g, "-");
		const defaults = {
			sshtemplate: ({ domain, user, project, committish }) => `git@${domain}:${user}/${project}.git${maybeJoin("#", committish)}`,
			sshurltemplate: ({ domain, user, project, committish }) => `git+ssh://git@${domain}/${user}/${project}.git${maybeJoin("#", committish)}`,
			edittemplate: ({ domain, user, project, committish, editpath, path }) => `https://${domain}/${user}/${project}${maybeJoin("/", editpath, "/", maybeEncode(committish || "HEAD"), "/", path)}`,
			browsetemplate: ({ domain, user, project, committish, treepath }) => `https://${domain}/${user}/${project}${maybeJoin("/", treepath, "/", maybeEncode(committish))}`,
			browsetreetemplate: ({ domain, user, project, committish, treepath, path, fragment, hashformat }) => `https://${domain}/${user}/${project}/${treepath}/${maybeEncode(committish || "HEAD")}/${path}${maybeJoin("#", hashformat(fragment || ""))}`,
			browseblobtemplate: ({ domain, user, project, committish, blobpath, path, fragment, hashformat }) => `https://${domain}/${user}/${project}/${blobpath}/${maybeEncode(committish || "HEAD")}/${path}${maybeJoin("#", hashformat(fragment || ""))}`,
			docstemplate: ({ domain, user, project, treepath, committish }) => `https://${domain}/${user}/${project}${maybeJoin("/", treepath, "/", maybeEncode(committish))}#readme`,
			httpstemplate: ({ auth, domain, user, project, committish }) => `git+https://${maybeJoin(auth, "@")}${domain}/${user}/${project}.git${maybeJoin("#", committish)}`,
			filetemplate: ({ domain, user, project, committish, path }) => `https://${domain}/${user}/${project}/raw/${maybeEncode(committish || "HEAD")}/${path}`,
			shortcuttemplate: ({ type, user, project, committish }) => `${type}:${user}/${project}${maybeJoin("#", committish)}`,
			pathtemplate: ({ user, project, committish }) => `${user}/${project}${maybeJoin("#", committish)}`,
			bugstemplate: ({ domain, user, project }) => `https://${domain}/${user}/${project}/issues`,
			hashformat: formatHashFragment
		};
		const hosts$1 = {};
		hosts$1.github = {
			protocols: [
				"git:",
				"http:",
				"git+ssh:",
				"git+https:",
				"ssh:",
				"https:"
			],
			domain: "github.com",
			treepath: "tree",
			blobpath: "blob",
			editpath: "edit",
			filetemplate: ({ auth, user, project, committish, path }) => `https://${maybeJoin(auth, "@")}raw.githubusercontent.com/${user}/${project}/${maybeEncode(committish || "HEAD")}/${path}`,
			gittemplate: ({ auth, domain, user, project, committish }) => `git://${maybeJoin(auth, "@")}${domain}/${user}/${project}.git${maybeJoin("#", committish)}`,
			tarballtemplate: ({ domain, user, project, committish }) => `https://codeload.${domain}/${user}/${project}/tar.gz/${maybeEncode(committish || "HEAD")}`,
			extract: (url$1) => {
				let [, user, project, type, committish] = url$1.pathname.split("/", 5);
				if (type && type !== "tree") return;
				if (!type) committish = url$1.hash.slice(1);
				if (project && project.endsWith(".git")) project = project.slice(0, -4);
				if (!user || !project) return;
				return {
					user,
					project,
					committish
				};
			}
		};
		hosts$1.bitbucket = {
			protocols: [
				"git+ssh:",
				"git+https:",
				"ssh:",
				"https:"
			],
			domain: "bitbucket.org",
			treepath: "src",
			blobpath: "src",
			editpath: "?mode=edit",
			edittemplate: ({ domain, user, project, committish, treepath, path, editpath }) => `https://${domain}/${user}/${project}${maybeJoin("/", treepath, "/", maybeEncode(committish || "HEAD"), "/", path, editpath)}`,
			tarballtemplate: ({ domain, user, project, committish }) => `https://${domain}/${user}/${project}/get/${maybeEncode(committish || "HEAD")}.tar.gz`,
			extract: (url$1) => {
				let [, user, project, aux] = url$1.pathname.split("/", 4);
				if (["get"].includes(aux)) return;
				if (project && project.endsWith(".git")) project = project.slice(0, -4);
				if (!user || !project) return;
				return {
					user,
					project,
					committish: url$1.hash.slice(1)
				};
			}
		};
		hosts$1.gitlab = {
			protocols: [
				"git+ssh:",
				"git+https:",
				"ssh:",
				"https:"
			],
			domain: "gitlab.com",
			treepath: "tree",
			blobpath: "tree",
			editpath: "-/edit",
			tarballtemplate: ({ domain, user, project, committish }) => `https://${domain}/${user}/${project}/repository/archive.tar.gz?ref=${maybeEncode(committish || "HEAD")}`,
			extract: (url$1) => {
				const path = url$1.pathname.slice(1);
				if (path.includes("/-/") || path.includes("/archive.tar.gz")) return;
				const segments = path.split("/");
				let project = segments.pop();
				if (project.endsWith(".git")) project = project.slice(0, -4);
				const user = segments.join("/");
				if (!user || !project) return;
				return {
					user,
					project,
					committish: url$1.hash.slice(1)
				};
			}
		};
		hosts$1.gist = {
			protocols: [
				"git:",
				"git+ssh:",
				"git+https:",
				"ssh:",
				"https:"
			],
			domain: "gist.github.com",
			editpath: "edit",
			sshtemplate: ({ domain, project, committish }) => `git@${domain}:${project}.git${maybeJoin("#", committish)}`,
			sshurltemplate: ({ domain, project, committish }) => `git+ssh://git@${domain}/${project}.git${maybeJoin("#", committish)}`,
			edittemplate: ({ domain, user, project, committish, editpath }) => `https://${domain}/${user}/${project}${maybeJoin("/", maybeEncode(committish))}/${editpath}`,
			browsetemplate: ({ domain, project, committish }) => `https://${domain}/${project}${maybeJoin("/", maybeEncode(committish))}`,
			browsetreetemplate: ({ domain, project, committish, path, hashformat }) => `https://${domain}/${project}${maybeJoin("/", maybeEncode(committish))}${maybeJoin("#", hashformat(path))}`,
			browseblobtemplate: ({ domain, project, committish, path, hashformat }) => `https://${domain}/${project}${maybeJoin("/", maybeEncode(committish))}${maybeJoin("#", hashformat(path))}`,
			docstemplate: ({ domain, project, committish }) => `https://${domain}/${project}${maybeJoin("/", maybeEncode(committish))}`,
			httpstemplate: ({ domain, project, committish }) => `git+https://${domain}/${project}.git${maybeJoin("#", committish)}`,
			filetemplate: ({ user, project, committish, path }) => `https://gist.githubusercontent.com/${user}/${project}/raw${maybeJoin("/", maybeEncode(committish))}/${path}`,
			shortcuttemplate: ({ type, project, committish }) => `${type}:${project}${maybeJoin("#", committish)}`,
			pathtemplate: ({ project, committish }) => `${project}${maybeJoin("#", committish)}`,
			bugstemplate: ({ domain, project }) => `https://${domain}/${project}`,
			gittemplate: ({ domain, project, committish }) => `git://${domain}/${project}.git${maybeJoin("#", committish)}`,
			tarballtemplate: ({ project, committish }) => `https://codeload.github.com/gist/${project}/tar.gz/${maybeEncode(committish || "HEAD")}`,
			extract: (url$1) => {
				let [, user, project, aux] = url$1.pathname.split("/", 4);
				if (aux === "raw") return;
				if (!project) {
					if (!user) return;
					project = user;
					user = null;
				}
				if (project.endsWith(".git")) project = project.slice(0, -4);
				return {
					user,
					project,
					committish: url$1.hash.slice(1)
				};
			},
			hashformat: function(fragment) {
				return fragment && "file-" + formatHashFragment(fragment);
			}
		};
		hosts$1.sourcehut = {
			protocols: ["git+ssh:", "https:"],
			domain: "git.sr.ht",
			treepath: "tree",
			blobpath: "tree",
			filetemplate: ({ domain, user, project, committish, path }) => `https://${domain}/${user}/${project}/blob/${maybeEncode(committish) || "HEAD"}/${path}`,
			httpstemplate: ({ domain, user, project, committish }) => `https://${domain}/${user}/${project}.git${maybeJoin("#", committish)}`,
			tarballtemplate: ({ domain, user, project, committish }) => `https://${domain}/${user}/${project}/archive/${maybeEncode(committish) || "HEAD"}.tar.gz`,
			bugstemplate: () => null,
			extract: (url$1) => {
				let [, user, project, aux] = url$1.pathname.split("/", 4);
				if (["archive"].includes(aux)) return;
				if (project && project.endsWith(".git")) project = project.slice(0, -4);
				if (!user || !project) return;
				return {
					user,
					project,
					committish: url$1.hash.slice(1)
				};
			}
		};
		for (const [name, host] of Object.entries(hosts$1)) hosts$1[name] = Object.assign({}, defaults, host);
		module.exports = hosts$1;
	}));
	var url_polyfill_exports = /* @__PURE__ */ __export({ URL: () => URL$1 });
	var URL$1;
	var init_url_polyfill = __esmMin((() => {
		URL$1 = globalThis.URL;
	}));
	var require_parse_url = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		const url = (init_url_polyfill(), __toCommonJS(url_polyfill_exports));
		const lastIndexOfBefore = (str, char, beforeChar) => {
			const startPosition = str.indexOf(beforeChar);
			return str.lastIndexOf(char, startPosition > -1 ? startPosition : Infinity);
		};
		const safeUrl = (u) => {
			try {
				return new url.URL(u);
			} catch {}
		};
		const correctProtocol = (arg, protocols) => {
			const firstColon = arg.indexOf(":");
			const proto = arg.slice(0, firstColon + 1);
			if (Object.prototype.hasOwnProperty.call(protocols, proto)) return arg;
			if (arg.substr(firstColon, 3) === "://") return arg;
			const firstAt = arg.indexOf("@");
			if (firstAt > -1) if (firstAt > firstColon) return `git+ssh://${arg}`;
			else return arg;
			return `${arg.slice(0, firstColon + 1)}//${arg.slice(firstColon + 1)}`;
		};
		const correctUrl = (giturl) => {
			const firstAt = lastIndexOfBefore(giturl, "@", "#");
			const lastColonBeforeHash = lastIndexOfBefore(giturl, ":", "#");
			if (lastColonBeforeHash > firstAt) giturl = giturl.slice(0, lastColonBeforeHash) + "/" + giturl.slice(lastColonBeforeHash + 1);
			if (lastIndexOfBefore(giturl, ":", "#") === -1 && giturl.indexOf("//") === -1) giturl = `git+ssh://${giturl}`;
			return giturl;
		};
		module.exports = (giturl, protocols) => {
			const withProtocol = protocols ? correctProtocol(giturl, protocols) : giturl;
			return safeUrl(withProtocol) || safeUrl(correctUrl(withProtocol));
		};
	}));
	var require_from_url = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		const parseUrl$1 = require_parse_url();
		const isGitHubShorthand = (arg) => {
			const firstHash = arg.indexOf("#");
			const firstSlash = arg.indexOf("/");
			const secondSlash = arg.indexOf("/", firstSlash + 1);
			const firstColon = arg.indexOf(":");
			const firstSpace = /\s/.exec(arg);
			const firstAt = arg.indexOf("@");
			const spaceOnlyAfterHash = !firstSpace || firstHash > -1 && firstSpace.index > firstHash;
			const atOnlyAfterHash = firstAt === -1 || firstHash > -1 && firstAt > firstHash;
			const colonOnlyAfterHash = firstColon === -1 || firstHash > -1 && firstColon > firstHash;
			const secondSlashOnlyAfterHash = secondSlash === -1 || firstHash > -1 && secondSlash > firstHash;
			const hasSlash = firstSlash > 0;
			const doesNotEndWithSlash = firstHash > -1 ? arg[firstHash - 1] !== "/" : !arg.endsWith("/");
			const doesNotStartWithDot = !arg.startsWith(".");
			return spaceOnlyAfterHash && hasSlash && doesNotEndWithSlash && doesNotStartWithDot && atOnlyAfterHash && colonOnlyAfterHash && secondSlashOnlyAfterHash;
		};
		module.exports = (giturl, opts, { gitHosts, protocols }) => {
			if (!giturl) return;
			const parsed = parseUrl$1(isGitHubShorthand(giturl) ? `github:${giturl}` : giturl, protocols);
			if (!parsed) return;
			const gitHostShortcut = gitHosts.byShortcut[parsed.protocol];
			const gitHostDomain = gitHosts.byDomain[parsed.hostname.startsWith("www.") ? parsed.hostname.slice(4) : parsed.hostname];
			const gitHostName = gitHostShortcut || gitHostDomain;
			if (!gitHostName) return;
			const gitHostInfo = gitHosts[gitHostShortcut || gitHostDomain];
			let auth = null;
			if (protocols[parsed.protocol]?.auth && (parsed.username || parsed.password)) auth = `${parsed.username}${parsed.password ? ":" + parsed.password : ""}`;
			let committish = null;
			let user = null;
			let project = null;
			let defaultRepresentation = null;
			try {
				if (gitHostShortcut) {
					let pathname = parsed.pathname.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname;
					const firstAt = pathname.indexOf("@");
					if (firstAt > -1) pathname = pathname.slice(firstAt + 1);
					const lastSlash = pathname.lastIndexOf("/");
					if (lastSlash > -1) {
						user = decodeURIComponent(pathname.slice(0, lastSlash));
						if (!user) user = null;
						project = decodeURIComponent(pathname.slice(lastSlash + 1));
					} else project = decodeURIComponent(pathname);
					if (project.endsWith(".git")) project = project.slice(0, -4);
					if (parsed.hash) committish = decodeURIComponent(parsed.hash.slice(1));
					defaultRepresentation = "shortcut";
				} else {
					if (!gitHostInfo.protocols.includes(parsed.protocol)) return;
					const segments = gitHostInfo.extract(parsed);
					if (!segments) return;
					user = segments.user && decodeURIComponent(segments.user);
					project = decodeURIComponent(segments.project);
					committish = decodeURIComponent(segments.committish);
					defaultRepresentation = protocols[parsed.protocol]?.name || parsed.protocol.slice(0, -1);
				}
			} catch (err) {
				/* istanbul ignore else */
				if (err instanceof URIError) return;
				else throw err;
			}
			return [
				gitHostName,
				user,
				auth,
				project,
				committish,
				defaultRepresentation,
				opts
			];
		};
	}));
	var import_lib = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
		const { LRUCache } = require_commonjs();
		const hosts = require_hosts();
		const fromUrl = require_from_url();
		const parseUrl = require_parse_url();
		const cache = new LRUCache({ max: 1e3 });
		function unknownHostedUrl(url$1) {
			try {
				const { protocol, hostname, pathname } = new URL(url$1);
				if (!hostname) return null;
				return `${/(?:git\+)http:$/.test(protocol) ? "http:" : "https:"}//${hostname}${pathname.replace(/\.git$/, "")}`;
			} catch {
				return null;
			}
		}
		var GitHost$1 = class GitHost$1 {
			constructor(type, user, auth, project, committish, defaultRepresentation, opts = {}) {
				Object.assign(this, GitHost$1.#gitHosts[type], {
					type,
					user,
					auth,
					project,
					committish,
					default: defaultRepresentation,
					opts
				});
			}
			static #gitHosts = {
				byShortcut: {},
				byDomain: {}
			};
			static #protocols = {
				"git+ssh:": { name: "sshurl" },
				"ssh:": { name: "sshurl" },
				"git+https:": {
					name: "https",
					auth: true
				},
				"git:": { auth: true },
				"http:": { auth: true },
				"https:": { auth: true },
				"git+http:": { auth: true }
			};
			static addHost(name, host) {
				GitHost$1.#gitHosts[name] = host;
				GitHost$1.#gitHosts.byDomain[host.domain] = name;
				GitHost$1.#gitHosts.byShortcut[`${name}:`] = name;
				GitHost$1.#protocols[`${name}:`] = { name };
			}
			static fromUrl(giturl, opts) {
				if (typeof giturl !== "string") return;
				const key = giturl + JSON.stringify(opts || {});
				if (!cache.has(key)) {
					const hostArgs = fromUrl(giturl, opts, {
						gitHosts: GitHost$1.#gitHosts,
						protocols: GitHost$1.#protocols
					});
					cache.set(key, hostArgs ? new GitHost$1(...hostArgs) : void 0);
				}
				return cache.get(key);
			}
			static fromManifest(manifest, opts = {}) {
				if (!manifest || typeof manifest !== "object") return;
				const r = manifest.repository;
				const rurl = r && (typeof r === "string" ? r : typeof r === "object" && typeof r.url === "string" ? r.url : null);
				if (!rurl) throw new Error("no repository");
				const info = rurl && GitHost$1.fromUrl(rurl.replace(/^git\+/, ""), opts) || null;
				if (info) return info;
				const unk = unknownHostedUrl(rurl);
				return GitHost$1.fromUrl(unk, opts) || unk;
			}
			static parseUrl(url$1) {
				return parseUrl(url$1);
			}
			#fill(template, opts) {
				if (typeof template !== "function") return null;
				const options = {
					...this,
					...this.opts,
					...opts
				};
				if (!options.path) options.path = "";
				if (options.path.startsWith("/")) options.path = options.path.slice(1);
				if (options.noCommittish) options.committish = null;
				const result = template(options);
				return options.noGitPlus && result.startsWith("git+") ? result.slice(4) : result;
			}
			hash() {
				return this.committish ? `#${this.committish}` : "";
			}
			ssh(opts) {
				return this.#fill(this.sshtemplate, opts);
			}
			sshurl(opts) {
				return this.#fill(this.sshurltemplate, opts);
			}
			browse(path, ...args) {
				if (typeof path !== "string") return this.#fill(this.browsetemplate, path);
				if (typeof args[0] !== "string") return this.#fill(this.browsetreetemplate, {
					...args[0],
					path
				});
				return this.#fill(this.browsetreetemplate, {
					...args[1],
					fragment: args[0],
					path
				});
			}
			browseFile(path, ...args) {
				if (typeof args[0] !== "string") return this.#fill(this.browseblobtemplate, {
					...args[0],
					path
				});
				return this.#fill(this.browseblobtemplate, {
					...args[1],
					fragment: args[0],
					path
				});
			}
			docs(opts) {
				return this.#fill(this.docstemplate, opts);
			}
			bugs(opts) {
				return this.#fill(this.bugstemplate, opts);
			}
			https(opts) {
				return this.#fill(this.httpstemplate, opts);
			}
			git(opts) {
				return this.#fill(this.gittemplate, opts);
			}
			shortcut(opts) {
				return this.#fill(this.shortcuttemplate, opts);
			}
			path(opts) {
				return this.#fill(this.pathtemplate, opts);
			}
			tarball(opts) {
				return this.#fill(this.tarballtemplate, {
					...opts,
					noCommittish: false
				});
			}
			file(path, opts) {
				return this.#fill(this.filetemplate, {
					...opts,
					path
				});
			}
			edit(path, opts) {
				return this.#fill(this.edittemplate, {
					...opts,
					path
				});
			}
			getDefaultRepresentation() {
				return this.default;
			}
			toString(opts) {
				if (this.default && typeof this[this.default] === "function") return this[this.default](opts);
				return this.sshurl(opts);
			}
		};
		for (const [name, host] of Object.entries(hosts)) GitHost$1.addHost(name, host);
		module.exports = GitHost$1;
	})))(), 1);
	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	function fetch(url$1) {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				url: url$1,
				method: "GET",
				responseType: "json",
				fetch: true,
				onload: (response) => {
					if (response.status >= 200 && response.status < 300) resolve(response.response);
					else reject(/* @__PURE__ */ new Error(`Request failed with status ${response.status}`));
				},
				onerror: (error) => {
					reject(/* @__PURE__ */ new Error(`Network error: ${error}`));
				}
			});
		});
	}
	observe();
	function observe() {
		const observer = new MutationObserver(() => {
			if (document.querySelector("#deleteOidc")) {
				observer.disconnect();
				return;
			}
			const button = document.querySelector("button[aria-label=\"Add Trusted Publisher connection for GitHub Actions\"]");
			if (!button) return;
			autofill(button);
			observer.disconnect();
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}
	async function autofill(button) {
		button?.click();
		const [repoInfo] = await Promise.all([fetchRepoInfo(), sleep(100)]);
		if (!repoInfo) return;
		while (true) {
			const ownerInput = document.querySelector("#oidc #oidc_repositoryOwner");
			const repoInput = document.querySelector("#oidc #oidc_repositoryName");
			if (!ownerInput || !repoInput) {
				console.warn("Failed to find input fields, retrying...");
				await sleep(100);
			} else {
				ownerInput.value = repoInfo.user;
				repoInput.value = repoInfo.project;
				break;
			}
		}
		const workflowInput = document.querySelector("#oidc #oidc_workflowName");
		if (workflowInput) {
			const storageKey = "trusted-publisher-workflow";
			workflowInput.value = localStorage.getItem(storageKey) || "release.yml";
			workflowInput.addEventListener("change", (e) => {
				localStorage.setItem(storageKey, e.target.value);
			});
		}
		const submitButton = document.querySelector("#oidc button[type=\"submit\"]");
		if (submitButton) {
			submitButton.style.fontSize = "30px";
			submitButton.style.fontWeight = "bold";
			submitButton.addEventListener("click", async (event) => {
				event.stopPropagation();
				event.preventDefault();
				await submitOidc();
				location.reload();
			});
		}
	}
	async function submitOidc() {
		const form = document.querySelector("#oidc");
		if (!form) {
			alert("Failed to find OIDC form");
			return;
		}
		form.target = "oidc";
		await createWindow("oidc", 0, () => form.submit());
	}
	async function fetchRepoInfo() {
		const pkgName = new URL(location.href).pathname.split("/").slice(2, -1).join("/");
		const pkg = await fetch(`https://registry.npmjs.org/${pkgName}`);
		const repositoryURL = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
		if (!repositoryURL) {
			console.warn(`No repository field found in package ${pkgName}.`);
			return;
		}
		const gitHost = import_lib.default.fromUrl(repositoryURL, {
			noCommittish: true,
			noGitPlus: true
		});
		if (!gitHost) {
			console.error(`Invalid repository URL`);
			return;
		}
		if (gitHost.type !== "github") {
			console.warn(`Only GitHub repositories are supported.`);
			return;
		}
		return gitHost;
	}
	async function createWindow(name, i, onReady) {
		const win = window.open("about:blank", name, `width=400,height=400,left=${i * 400}`);
		if (!win) {
			alert("Please allow popups for this website");
			return;
		}
		win.document.title = name;
		await onReady(win);
		await waitWindow(win);
		win.close();
	}
	async function waitWindow(win) {
		while (true) {
			await sleep(100);
			let host;
			let text;
			try {
				host = win.location.host;
				text = win.document.body.textContent;
			} catch {}
			if (host === "www.npmjs.com" && !text?.includes("Two-Factor Authentication")) break;
		}
	}
})();
