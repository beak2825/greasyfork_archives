// ==UserScript==
// @name        BiliDataManager
// @namespace   https://github.com/ZBpine/bili-data-manager
// @description BiliDataManager 是一个 Bilibili 数据管理工具库，旨在为开发者提供简洁的接口来抓取和处理 Bilibili 的各种数据。
// @version     1.0.0
// @author      ZBpine
// @icon        https://www.bilibili.com/favicon.ico
// @license     MIT
// ==/UserScript==

(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === "object" && typeof module === "object") module.exports = factory(); else if (typeof define === "function" && define.amd) define([], factory); else if (typeof exports === "object") exports["BiliDataManager"] = factory(); else root["BiliDataManager"] = factory();
})(Object(typeof self !== "undefined" ? self : this), () => /******/ (() => {
    // webpackBootstrap
    /******/ var __webpack_modules__ = {
        /***/ 45(module) {
            "use strict";
            module.exports = asPromise;
            /**
 * Callback as used by {@link util.asPromise}.
 * @typedef asPromiseCallback
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {...*} params Additional arguments
 * @returns {undefined}
 */
            /**
 * Returns a promise from a node-style callback function.
 * @memberof util
 * @param {asPromiseCallback} fn Function to call
 * @param {*} ctx Function context
 * @param {...*} params Function arguments
 * @returns {Promise<*>} Promisified function
 */            function asPromise(fn, ctx /*, varargs */) {
                var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
                while (index < arguments.length) params[offset++] = arguments[index++];
                return new Promise(function executor(resolve, reject) {
                    params[offset] = function callback(err /*, varargs */) {
                        if (pending) {
                            pending = false;
                            if (err) reject(err); else {
                                var params = new Array(arguments.length - 1), offset = 0;
                                while (offset < params.length) params[offset++] = arguments[offset];
                                resolve.apply(null, params);
                            }
                        }
                    };
                    try {
                        fn.apply(ctx || null, params);
                    } catch (err) {
                        if (pending) {
                            pending = false;
                            reject(err);
                        }
                    }
                });
            }
            /***/        },
        /***/ 47(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            /**
 * Streaming RPC helpers.
 * @namespace
 */            var rpc = exports;
            /**
 * RPC implementation passed to {@link Service#create} performing a service request on network level, i.e. by utilizing http requests or websockets.
 * @typedef RPCImpl
 * @type {function}
 * @param {Method|rpc.ServiceMethod<Message<{}>,Message<{}>>} method Reflected or static method being called
 * @param {Uint8Array} requestData Request data
 * @param {RPCImplCallback} callback Callback function
 * @returns {undefined}
 * @example
 * function rpcImpl(method, requestData, callback) {
 *     if (protobuf.util.lcFirst(method.name) !== "myMethod") // compatible with static code
 *         throw Error("no such method");
 *     asynchronouslyObtainAResponse(requestData, function(err, responseData) {
 *         callback(err, responseData);
 *     });
 * }
 */
            /**
 * Node-style callback as used by {@link RPCImpl}.
 * @typedef RPCImplCallback
 * @type {function}
 * @param {Error|null} error Error, if any, otherwise `null`
 * @param {Uint8Array|null} [response] Response data or `null` to signal end of stream, if there hasn't been an error
 * @returns {undefined}
 */            rpc.Service = __webpack_require__(595);
            /***/        },
        /***/ 153(module) {
            "use strict";
            module.exports = inquire;
            /**
 * Requires a module only if available.
 * @memberof util
 * @param {string} moduleName Module to require
 * @returns {?Object} Required module if available and not empty, otherwise `null`
 */            function inquire(moduleName) {
                try {
                    var mod = eval("quire".replace(/^/, "re"))(moduleName);
 // eslint-disable-line no-eval
                                        if (mod && (mod.length || Object.keys(mod).length)) return mod;
                } catch (e) {}
 // eslint-disable-line no-empty
                                return null;
            }
            /***/        },
        /***/ 158(module, __unused_webpack_exports, __webpack_require__) {
            "use strict";
            module.exports = BufferReader;
            // extends Reader
                        var Reader = __webpack_require__(237);
            (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
            var util = __webpack_require__(610);
            /**
 * Constructs a new buffer reader instance.
 * @classdesc Wire format reader using node buffers.
 * @extends Reader
 * @constructor
 * @param {Buffer} buffer Buffer to read from
 */            function BufferReader(buffer) {
                Reader.call(this, buffer);
                /**
     * Read buffer.
     * @name BufferReader#buf
     * @type {Buffer}
     */            }
            BufferReader._configure = function() {
                /* istanbul ignore else */
                if (util.Buffer) BufferReader.prototype._slice = util.Buffer.prototype.slice;
            };
            /**
 * @override
 */            BufferReader.prototype.string = function read_string_buffer() {
                var len = this.uint32();
 // modifies pos
                                return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
            };
            /**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @name BufferReader#bytes
 * @function
 * @returns {Buffer} Value read
 */            BufferReader._configure();
            /***/        },
        /***/ 237(module, __unused_webpack_exports, __webpack_require__) {
            "use strict";
            module.exports = Reader;
            var util = __webpack_require__(610);
            var BufferReader;
 // cyclic
                        var LongBits = util.LongBits, utf8 = util.utf8;
            /* istanbul ignore next */            function indexOutOfRange(reader, writeLength) {
                return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
            }
            /**
 * Constructs a new reader instance using the specified buffer.
 * @classdesc Wire format reader using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 * @param {Uint8Array} buffer Buffer to read from
 */            function Reader(buffer) {
                /**
     * Read buffer.
     * @type {Uint8Array}
     */
                this.buf = buffer;
                /**
     * Read buffer position.
     * @type {number}
     */                this.pos = 0;
                /**
     * Read buffer length.
     * @type {number}
     */                this.len = buffer.length;
            }
            var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer) {
                if (buffer instanceof Uint8Array || Array.isArray(buffer)) return new Reader(buffer);
                throw Error("illegal buffer");
            }
            /* istanbul ignore next */ : function create_array(buffer) {
                if (Array.isArray(buffer)) return new Reader(buffer);
                throw Error("illegal buffer");
            };
            var create = function create() {
                return util.Buffer ? function create_buffer_setup(buffer) {
                    return (Reader.create = function create_buffer(buffer) {
                        return util.Buffer.isBuffer(buffer) ? new BufferReader(buffer)
                        /* istanbul ignore next */ : create_array(buffer);
                    })(buffer);
                }
                /* istanbul ignore next */ : create_array;
            };
            /**
 * Creates a new reader using the specified buffer.
 * @function
 * @param {Uint8Array|Buffer} buffer Buffer to read from
 * @returns {Reader|BufferReader} A {@link BufferReader} if `buffer` is a Buffer, otherwise a {@link Reader}
 * @throws {Error} If `buffer` is not a valid buffer
 */            Reader.create = create();
            Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */ util.Array.prototype.slice;
            /**
 * Reads a varint as an unsigned 32 bit value.
 * @function
 * @returns {number} Value read
 */            Reader.prototype.uint32 = function read_uint32_setup() {
                var value = 4294967295;
 // optimizer type-hint, tends to deopt otherwise (?!)
                                return function read_uint32() {
                    value = (this.buf[this.pos] & 127) >>> 0;
                    if (this.buf[this.pos++] < 128) return value;
                    value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
                    if (this.buf[this.pos++] < 128) return value;
                    value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
                    if (this.buf[this.pos++] < 128) return value;
                    value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
                    if (this.buf[this.pos++] < 128) return value;
                    value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
                    if (this.buf[this.pos++] < 128) return value;
                    /* istanbul ignore if */                    if ((this.pos += 5) > this.len) {
                        this.pos = this.len;
                        throw indexOutOfRange(this, 10);
                    }
                    return value;
                };
            }();
            /**
 * Reads a varint as a signed 32 bit value.
 * @returns {number} Value read
 */            Reader.prototype.int32 = function read_int32() {
                return this.uint32() | 0;
            };
            /**
 * Reads a zig-zag encoded varint as a signed 32 bit value.
 * @returns {number} Value read
 */            Reader.prototype.sint32 = function read_sint32() {
                var value = this.uint32();
                return value >>> 1 ^ -(value & 1) | 0;
            };
            /* eslint-disable no-invalid-this */            function readLongVarint() {
                // tends to deopt with local vars for octet etc.
                var bits = new LongBits(0, 0);
                var i = 0;
                if (this.len - this.pos > 4) {
                    // fast route (lo)
                    for (;i < 4; ++i) {
                        // 1st..4th
                        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
                        if (this.buf[this.pos++] < 128) return bits;
                    }
                    // 5th
                                        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
                    bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
                    if (this.buf[this.pos++] < 128) return bits;
                    i = 0;
                } else {
                    for (;i < 3; ++i) {
                        /* istanbul ignore if */
                        if (this.pos >= this.len) throw indexOutOfRange(this);
                        // 1st..3th
                                                bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
                        if (this.buf[this.pos++] < 128) return bits;
                    }
                    // 4th
                                        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
                    return bits;
                }
                if (this.len - this.pos > 4) {
                    // fast route (hi)
                    for (;i < 5; ++i) {
                        // 6th..10th
                        bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
                        if (this.buf[this.pos++] < 128) return bits;
                    }
                } else {
                    for (;i < 5; ++i) {
                        /* istanbul ignore if */
                        if (this.pos >= this.len) throw indexOutOfRange(this);
                        // 6th..10th
                                                bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
                        if (this.buf[this.pos++] < 128) return bits;
                    }
                }
                /* istanbul ignore next */                throw Error("invalid varint encoding");
            }
            /* eslint-enable no-invalid-this */
            /**
 * Reads a varint as a signed 64 bit value.
 * @name Reader#int64
 * @function
 * @returns {Long} Value read
 */
            /**
 * Reads a varint as an unsigned 64 bit value.
 * @name Reader#uint64
 * @function
 * @returns {Long} Value read
 */
            /**
 * Reads a zig-zag encoded varint as a signed 64 bit value.
 * @name Reader#sint64
 * @function
 * @returns {Long} Value read
 */
            /**
 * Reads a varint as a boolean.
 * @returns {boolean} Value read
 */            Reader.prototype.bool = function read_bool() {
                return this.uint32() !== 0;
            };
            function readFixed32_end(buf, end) {
                // note that this uses `end`, not `pos`
                return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
            }
            /**
 * Reads fixed 32 bits as an unsigned 32 bit integer.
 * @returns {number} Value read
 */            Reader.prototype.fixed32 = function read_fixed32() {
                /* istanbul ignore if */
                if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
                return readFixed32_end(this.buf, this.pos += 4);
            };
            /**
 * Reads fixed 32 bits as a signed 32 bit integer.
 * @returns {number} Value read
 */            Reader.prototype.sfixed32 = function read_sfixed32() {
                /* istanbul ignore if */
                if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
                return readFixed32_end(this.buf, this.pos += 4) | 0;
            };
            /* eslint-disable no-invalid-this */            function readFixed64() {
                /* istanbul ignore if */
                if (this.pos + 8 > this.len) throw indexOutOfRange(this, 8);
                return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
            }
            /* eslint-enable no-invalid-this */
            /**
 * Reads fixed 64 bits.
 * @name Reader#fixed64
 * @function
 * @returns {Long} Value read
 */
            /**
 * Reads zig-zag encoded fixed 64 bits.
 * @name Reader#sfixed64
 * @function
 * @returns {Long} Value read
 */
            /**
 * Reads a float (32 bit) as a number.
 * @function
 * @returns {number} Value read
 */            Reader.prototype.float = function read_float() {
                /* istanbul ignore if */
                if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
                var value = util.float.readFloatLE(this.buf, this.pos);
                this.pos += 4;
                return value;
            };
            /**
 * Reads a double (64 bit float) as a number.
 * @function
 * @returns {number} Value read
 */            Reader.prototype.double = function read_double() {
                /* istanbul ignore if */
                if (this.pos + 8 > this.len) throw indexOutOfRange(this, 4);
                var value = util.float.readDoubleLE(this.buf, this.pos);
                this.pos += 8;
                return value;
            };
            /**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @returns {Uint8Array} Value read
 */            Reader.prototype.bytes = function read_bytes() {
                var length = this.uint32(), start = this.pos, end = this.pos + length;
                /* istanbul ignore if */                if (end > this.len) throw indexOutOfRange(this, length);
                this.pos += length;
                if (Array.isArray(this.buf)) // plain array
                return this.buf.slice(start, end);
                if (start === end) {
                    // fix for IE 10/Win8 and others' subarray returning array of size 1
                    var nativeBuffer = util.Buffer;
                    return nativeBuffer ? nativeBuffer.alloc(0) : new this.buf.constructor(0);
                }
                return this._slice.call(this.buf, start, end);
            };
            /**
 * Reads a string preceeded by its byte length as a varint.
 * @returns {string} Value read
 */            Reader.prototype.string = function read_string() {
                var bytes = this.bytes();
                return utf8.read(bytes, 0, bytes.length);
            };
            /**
 * Skips the specified number of bytes if specified, otherwise skips a varint.
 * @param {number} [length] Length if known, otherwise a varint is assumed
 * @returns {Reader} `this`
 */            Reader.prototype.skip = function skip(length) {
                if (typeof length === "number") {
                    /* istanbul ignore if */
                    if (this.pos + length > this.len) throw indexOutOfRange(this, length);
                    this.pos += length;
                } else {
                    do {
                        /* istanbul ignore if */
                        if (this.pos >= this.len) throw indexOutOfRange(this);
                    } while (this.buf[this.pos++] & 128);
                }
                return this;
            };
            /**
 * Skips the next element of the specified wire type.
 * @param {number} wireType Wire type received
 * @returns {Reader} `this`
 */            Reader.prototype.skipType = function(wireType) {
                switch (wireType) {
                  case 0:
                    this.skip();
                    break;

                  case 1:
                    this.skip(8);
                    break;

                  case 2:
                    this.skip(this.uint32());
                    break;

                  case 3:
                    while ((wireType = this.uint32() & 7) !== 4) {
                        this.skipType(wireType);
                    }
                    break;

                  case 5:
                    this.skip(4);
                    break;

                    /* istanbul ignore next */                  default:
                    throw Error("invalid wire type " + wireType + " at offset " + this.pos);
                }
                return this;
            };
            Reader._configure = function(BufferReader_) {
                BufferReader = BufferReader_;
                Reader.create = create();
                BufferReader._configure();
                var fn = util.Long ? "toLong" : /* istanbul ignore next */ "toNumber";
                util.merge(Reader.prototype, {
                    int64: function read_int64() {
                        return readLongVarint.call(this)[fn](false);
                    },
                    uint64: function read_uint64() {
                        return readLongVarint.call(this)[fn](true);
                    },
                    sint64: function read_sint64() {
                        return readLongVarint.call(this).zzDecode()[fn](false);
                    },
                    fixed64: function read_fixed64() {
                        return readFixed64.call(this)[fn](true);
                    },
                    sfixed64: function read_sfixed64() {
                        return readFixed64.call(this)[fn](false);
                    }
                });
            };
            /***/        },
        /***/ 239(module, __unused_webpack_exports, __webpack_require__) {
            "use strict";
            module.exports = LongBits;
            var util = __webpack_require__(610);
            /**
 * Constructs new long bits.
 * @classdesc Helper class for working with the low and high bits of a 64 bit value.
 * @memberof util
 * @constructor
 * @param {number} lo Low 32 bits, unsigned
 * @param {number} hi High 32 bits, unsigned
 */            function LongBits(lo, hi) {
                // note that the casts below are theoretically unnecessary as of today, but older statically
                // generated converter code might still call the ctor with signed 32bits. kept for compat.
                /**
     * Low bits.
     * @type {number}
     */
                this.lo = lo >>> 0;
                /**
     * High bits.
     * @type {number}
     */                this.hi = hi >>> 0;
            }
            /**
 * Zero bits.
 * @memberof util.LongBits
 * @type {util.LongBits}
 */            var zero = LongBits.zero = new LongBits(0, 0);
            zero.toNumber = function() {
                return 0;
            };
            zero.zzEncode = zero.zzDecode = function() {
                return this;
            };
            zero.length = function() {
                return 1;
            };
            /**
 * Zero hash.
 * @memberof util.LongBits
 * @type {string}
 */            var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
            /**
 * Constructs new long bits from the specified number.
 * @param {number} value Value
 * @returns {util.LongBits} Instance
 */            LongBits.fromNumber = function fromNumber(value) {
                if (value === 0) return zero;
                var sign = value < 0;
                if (sign) value = -value;
                var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
                if (sign) {
                    hi = ~hi >>> 0;
                    lo = ~lo >>> 0;
                    if (++lo > 4294967295) {
                        lo = 0;
                        if (++hi > 4294967295) hi = 0;
                    }
                }
                return new LongBits(lo, hi);
            };
            /**
 * Constructs new long bits from a number, long or string.
 * @param {Long|number|string} value Value
 * @returns {util.LongBits} Instance
 */            LongBits.from = function from(value) {
                if (typeof value === "number") return LongBits.fromNumber(value);
                if (util.isString(value)) {
                    /* istanbul ignore else */
                    if (util.Long) value = util.Long.fromString(value); else return LongBits.fromNumber(parseInt(value, 10));
                }
                return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
            };
            /**
 * Converts this long bits to a possibly unsafe JavaScript number.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {number} Possibly unsafe number
 */            LongBits.prototype.toNumber = function toNumber(unsigned) {
                if (!unsigned && this.hi >>> 31) {
                    var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
                    if (!lo) hi = hi + 1 >>> 0;
                    return -(lo + hi * 4294967296);
                }
                return this.lo + this.hi * 4294967296;
            };
            /**
 * Converts this long bits to a long.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long} Long
 */            LongBits.prototype.toLong = function toLong(unsigned) {
                return util.Long ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
                /* istanbul ignore next */ : {
                    low: this.lo | 0,
                    high: this.hi | 0,
                    unsigned: Boolean(unsigned)
                };
            };
            var charCodeAt = String.prototype.charCodeAt;
            /**
 * Constructs new long bits from the specified 8 characters long hash.
 * @param {string} hash Hash
 * @returns {util.LongBits} Bits
 */            LongBits.fromHash = function fromHash(hash) {
                if (hash === zeroHash) return zero;
                return new LongBits((charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0, (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0);
            };
            /**
 * Converts this long bits to a 8 characters long hash.
 * @returns {string} Hash
 */            LongBits.prototype.toHash = function toHash() {
                return String.fromCharCode(this.lo & 255, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, this.hi & 255, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24);
            };
            /**
 * Zig-zag encodes this long bits.
 * @returns {util.LongBits} `this`
 */            LongBits.prototype.zzEncode = function zzEncode() {
                var mask = this.hi >> 31;
                this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
                this.lo = (this.lo << 1 ^ mask) >>> 0;
                return this;
            };
            /**
 * Zig-zag decodes this long bits.
 * @returns {util.LongBits} `this`
 */            LongBits.prototype.zzDecode = function zzDecode() {
                var mask = -(this.lo & 1);
                this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
                this.hi = (this.hi >>> 1 ^ mask) >>> 0;
                return this;
            };
            /**
 * Calculates the length of this longbits when encoded as a varint.
 * @returns {number} Length
 */            LongBits.prototype.length = function length() {
                var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
                return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
            };
            /***/        },
        /***/ 358(module) {
            "use strict";
            module.exports = EventEmitter;
            /**
 * Constructs a new event emitter instance.
 * @classdesc A minimal event emitter.
 * @memberof util
 * @constructor
 */            function EventEmitter() {
                /**
     * Registered listeners.
     * @type {Object.<string,*>}
     * @private
     */
                this._listeners = {};
            }
            /**
 * Registers an event listener.
 * @param {string} evt Event name
 * @param {function} fn Listener
 * @param {*} [ctx] Listener context
 * @returns {util.EventEmitter} `this`
 */            EventEmitter.prototype.on = function on(evt, fn, ctx) {
                (this._listeners[evt] || (this._listeners[evt] = [])).push({
                    fn,
                    ctx: ctx || this
                });
                return this;
            };
            /**
 * Removes an event listener or any matching listeners if arguments are omitted.
 * @param {string} [evt] Event name. Removes all listeners if omitted.
 * @param {function} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
 * @returns {util.EventEmitter} `this`
 */            EventEmitter.prototype.off = function off(evt, fn) {
                if (evt === undefined) this._listeners = {}; else {
                    if (fn === undefined) this._listeners[evt] = []; else {
                        var listeners = this._listeners[evt];
                        for (var i = 0; i < listeners.length; ) if (listeners[i].fn === fn) listeners.splice(i, 1); else ++i;
                    }
                }
                return this;
            };
            /**
 * Emits an event by calling its listeners with the specified arguments.
 * @param {string} evt Event name
 * @param {...*} args Arguments
 * @returns {util.EventEmitter} `this`
 */            EventEmitter.prototype.emit = function emit(evt) {
                var listeners = this._listeners[evt];
                if (listeners) {
                    var args = [], i = 1;
                    for (;i < arguments.length; ) args.push(arguments[i++]);
                    for (i = 0; i < listeners.length; ) listeners[i].fn.apply(listeners[i++].ctx, args);
                }
                return this;
            };
            /***/        },
        /***/ 390(module) {
            "use strict";
            module.exports = pool;
            /**
 * An allocator as used by {@link util.pool}.
 * @typedef PoolAllocator
 * @type {function}
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */
            /**
 * A slicer as used by {@link util.pool}.
 * @typedef PoolSlicer
 * @type {function}
 * @param {number} start Start offset
 * @param {number} end End offset
 * @returns {Uint8Array} Buffer slice
 * @this {Uint8Array}
 */
            /**
 * A general purpose buffer pool.
 * @memberof util
 * @function
 * @param {PoolAllocator} alloc Allocator
 * @param {PoolSlicer} slice Slicer
 * @param {number} [size=8192] Slab size
 * @returns {PoolAllocator} Pooled allocator
 */            function pool(alloc, slice, size) {
                var SIZE = size || 8192;
                var MAX = SIZE >>> 1;
                var slab = null;
                var offset = SIZE;
                return function pool_alloc(size) {
                    if (size < 1 || size > MAX) return alloc(size);
                    if (offset + size > SIZE) {
                        slab = alloc(SIZE);
                        offset = 0;
                    }
                    var buf = slice.call(slab, offset, offset += size);
                    if (offset & 7) // align to 32 bit
                    offset = (offset | 7) + 1;
                    return buf;
                };
            }
            /***/        },
        /***/ 394(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var protobuf = exports;
            /**
 * Build type, one of `"full"`, `"light"` or `"minimal"`.
 * @name build
 * @type {string}
 * @const
 */            protobuf.build = "minimal";
            // Serialization
                        protobuf.Writer = __webpack_require__(449);
            protobuf.BufferWriter = __webpack_require__(818);
            protobuf.Reader = __webpack_require__(237);
            protobuf.BufferReader = __webpack_require__(158);
            // Utility
                        protobuf.util = __webpack_require__(610);
            protobuf.rpc = __webpack_require__(47);
            protobuf.roots = __webpack_require__(529);
            protobuf.configure = configure;
            /* istanbul ignore next */
            /**
 * Reconfigures the library according to the environment.
 * @returns {undefined}
 */            function configure() {
                protobuf.util._configure();
                protobuf.Writer._configure(protobuf.BufferWriter);
                protobuf.Reader._configure(protobuf.BufferReader);
            }
            // Set up buffer utility according to the environment
                        configure();
            /***/        },
        /***/ 410(module) {
            "use strict";
            module.exports = factory(factory);
            /**
 * Reads / writes floats / doubles from / to buffers.
 * @name util.float
 * @namespace
 */
            /**
 * Writes a 32 bit float to a buffer using little endian byte order.
 * @name util.float.writeFloatLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */
            /**
 * Writes a 32 bit float to a buffer using big endian byte order.
 * @name util.float.writeFloatBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */
            /**
 * Reads a 32 bit float from a buffer using little endian byte order.
 * @name util.float.readFloatLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */
            /**
 * Reads a 32 bit float from a buffer using big endian byte order.
 * @name util.float.readFloatBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */
            /**
 * Writes a 64 bit double to a buffer using little endian byte order.
 * @name util.float.writeDoubleLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */
            /**
 * Writes a 64 bit double to a buffer using big endian byte order.
 * @name util.float.writeDoubleBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */
            /**
 * Reads a 64 bit double from a buffer using little endian byte order.
 * @name util.float.readDoubleLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */
            /**
 * Reads a 64 bit double from a buffer using big endian byte order.
 * @name util.float.readDoubleBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */
            // Factory function for the purpose of node-based testing in modified global environments
                        function factory(exports) {
                // float: typed array
                if (typeof Float32Array !== "undefined") (function() {
                    var f32 = new Float32Array([ -0 ]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
                    function writeFloat_f32_cpy(val, buf, pos) {
                        f32[0] = val;
                        buf[pos] = f8b[0];
                        buf[pos + 1] = f8b[1];
                        buf[pos + 2] = f8b[2];
                        buf[pos + 3] = f8b[3];
                    }
                    function writeFloat_f32_rev(val, buf, pos) {
                        f32[0] = val;
                        buf[pos] = f8b[3];
                        buf[pos + 1] = f8b[2];
                        buf[pos + 2] = f8b[1];
                        buf[pos + 3] = f8b[0];
                    }
                    /* istanbul ignore next */                    exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
                    /* istanbul ignore next */                    exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
                    function readFloat_f32_cpy(buf, pos) {
                        f8b[0] = buf[pos];
                        f8b[1] = buf[pos + 1];
                        f8b[2] = buf[pos + 2];
                        f8b[3] = buf[pos + 3];
                        return f32[0];
                    }
                    function readFloat_f32_rev(buf, pos) {
                        f8b[3] = buf[pos];
                        f8b[2] = buf[pos + 1];
                        f8b[1] = buf[pos + 2];
                        f8b[0] = buf[pos + 3];
                        return f32[0];
                    }
                    /* istanbul ignore next */                    exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
                    /* istanbul ignore next */                    exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
                    // float: ieee754
                                })(); else (function() {
                    function writeFloat_ieee754(writeUint, val, buf, pos) {
                        var sign = val < 0 ? 1 : 0;
                        if (sign) val = -val;
                        if (val === 0) writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos); else if (isNaN(val)) writeUint(2143289344, buf, pos); else if (val > 34028234663852886e22) // +-Infinity
                        writeUint((sign << 31 | 2139095040) >>> 0, buf, pos); else if (val < 11754943508222875e-54) // denormal
                        writeUint((sign << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf, pos); else {
                            var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
                            writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
                        }
                    }
                    exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
                    exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
                    function readFloat_ieee754(readUint, buf, pos) {
                        var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
                        return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
                    }
                    exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
                    exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
                })();
                // double: typed array
                                if (typeof Float64Array !== "undefined") (function() {
                    var f64 = new Float64Array([ -0 ]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
                    function writeDouble_f64_cpy(val, buf, pos) {
                        f64[0] = val;
                        buf[pos] = f8b[0];
                        buf[pos + 1] = f8b[1];
                        buf[pos + 2] = f8b[2];
                        buf[pos + 3] = f8b[3];
                        buf[pos + 4] = f8b[4];
                        buf[pos + 5] = f8b[5];
                        buf[pos + 6] = f8b[6];
                        buf[pos + 7] = f8b[7];
                    }
                    function writeDouble_f64_rev(val, buf, pos) {
                        f64[0] = val;
                        buf[pos] = f8b[7];
                        buf[pos + 1] = f8b[6];
                        buf[pos + 2] = f8b[5];
                        buf[pos + 3] = f8b[4];
                        buf[pos + 4] = f8b[3];
                        buf[pos + 5] = f8b[2];
                        buf[pos + 6] = f8b[1];
                        buf[pos + 7] = f8b[0];
                    }
                    /* istanbul ignore next */                    exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
                    /* istanbul ignore next */                    exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
                    function readDouble_f64_cpy(buf, pos) {
                        f8b[0] = buf[pos];
                        f8b[1] = buf[pos + 1];
                        f8b[2] = buf[pos + 2];
                        f8b[3] = buf[pos + 3];
                        f8b[4] = buf[pos + 4];
                        f8b[5] = buf[pos + 5];
                        f8b[6] = buf[pos + 6];
                        f8b[7] = buf[pos + 7];
                        return f64[0];
                    }
                    function readDouble_f64_rev(buf, pos) {
                        f8b[7] = buf[pos];
                        f8b[6] = buf[pos + 1];
                        f8b[5] = buf[pos + 2];
                        f8b[4] = buf[pos + 3];
                        f8b[3] = buf[pos + 4];
                        f8b[2] = buf[pos + 5];
                        f8b[1] = buf[pos + 6];
                        f8b[0] = buf[pos + 7];
                        return f64[0];
                    }
                    /* istanbul ignore next */                    exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
                    /* istanbul ignore next */                    exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
                    // double: ieee754
                                })(); else (function() {
                    function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
                        var sign = val < 0 ? 1 : 0;
                        if (sign) val = -val;
                        if (val === 0) {
                            writeUint(0, buf, pos + off0);
                            writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos + off1);
                        } else if (isNaN(val)) {
                            writeUint(0, buf, pos + off0);
                            writeUint(2146959360, buf, pos + off1);
                        } else if (val > 17976931348623157e292) {
                            // +-Infinity
                            writeUint(0, buf, pos + off0);
                            writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
                        } else {
                            var mantissa;
                            if (val < 22250738585072014e-324) {
                                // denormal
                                mantissa = val / 5e-324;
                                writeUint(mantissa >>> 0, buf, pos + off0);
                                writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
                            } else {
                                var exponent = Math.floor(Math.log(val) / Math.LN2);
                                if (exponent === 1024) exponent = 1023;
                                mantissa = val * Math.pow(2, -exponent);
                                writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                                writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
                            }
                        }
                    }
                    exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
                    exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
                    function readDouble_ieee754(readUint, off0, off1, buf, pos) {
                        var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
                        var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
                        return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
                    }
                    exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
                    exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
                })();
                return exports;
            }
            // uint helpers
                        function writeUintLE(val, buf, pos) {
                buf[pos] = val & 255;
                buf[pos + 1] = val >>> 8 & 255;
                buf[pos + 2] = val >>> 16 & 255;
                buf[pos + 3] = val >>> 24;
            }
            function writeUintBE(val, buf, pos) {
                buf[pos] = val >>> 24;
                buf[pos + 1] = val >>> 16 & 255;
                buf[pos + 2] = val >>> 8 & 255;
                buf[pos + 3] = val & 255;
            }
            function readUintLE(buf, pos) {
                return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
            }
            function readUintBE(buf, pos) {
                return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
            }
            /***/        },
        /***/ 447(__unused_webpack_module, exports) {
            "use strict";
            /**
 * A minimal UTF8 implementation for number arrays.
 * @memberof util
 * @namespace
 */            var utf8 = exports;
            /**
 * Calculates the UTF8 byte length of a string.
 * @param {string} string String
 * @returns {number} Byte length
 */            utf8.length = function utf8_length(string) {
                var len = 0, c = 0;
                for (var i = 0; i < string.length; ++i) {
                    c = string.charCodeAt(i);
                    if (c < 128) len += 1; else if (c < 2048) len += 2; else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
                        ++i;
                        len += 4;
                    } else len += 3;
                }
                return len;
            };
            /**
 * Reads UTF8 bytes as a string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} String read
 */            utf8.read = function utf8_read(buffer, start, end) {
                var len = end - start;
                if (len < 1) return "";
                var parts = null, chunk = [], i = 0, // char offset
                t;
 // temporary
                                while (start < end) {
                    t = buffer[start++];
                    if (t < 128) chunk[i++] = t; else if (t > 191 && t < 224) chunk[i++] = (t & 31) << 6 | buffer[start++] & 63; else if (t > 239 && t < 365) {
                        t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 65536;
                        chunk[i++] = 55296 + (t >> 10);
                        chunk[i++] = 56320 + (t & 1023);
                    } else chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
                    if (i > 8191) {
                        (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
                        i = 0;
                    }
                }
                if (parts) {
                    if (i) parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
                    return parts.join("");
                }
                return String.fromCharCode.apply(String, chunk.slice(0, i));
            };
            /**
 * Writes a string as UTF8 bytes.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Bytes written
 */            utf8.write = function utf8_write(string, buffer, offset) {
                var start = offset, c1, // character 1
                c2;
 // character 2
                                for (var i = 0; i < string.length; ++i) {
                    c1 = string.charCodeAt(i);
                    if (c1 < 128) {
                        buffer[offset++] = c1;
                    } else if (c1 < 2048) {
                        buffer[offset++] = c1 >> 6 | 192;
                        buffer[offset++] = c1 & 63 | 128;
                    } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
                        c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
                        ++i;
                        buffer[offset++] = c1 >> 18 | 240;
                        buffer[offset++] = c1 >> 12 & 63 | 128;
                        buffer[offset++] = c1 >> 6 & 63 | 128;
                        buffer[offset++] = c1 & 63 | 128;
                    } else {
                        buffer[offset++] = c1 >> 12 | 224;
                        buffer[offset++] = c1 >> 6 & 63 | 128;
                        buffer[offset++] = c1 & 63 | 128;
                    }
                }
                return offset - start;
            };
            /***/        },
        /***/ 449(module, __unused_webpack_exports, __webpack_require__) {
            "use strict";
            module.exports = Writer;
            var util = __webpack_require__(610);
            var BufferWriter;
 // cyclic
                        var LongBits = util.LongBits, base64 = util.base64, utf8 = util.utf8;
            /**
 * Constructs a new writer operation instance.
 * @classdesc Scheduled writer operation.
 * @constructor
 * @param {function(*, Uint8Array, number)} fn Function to call
 * @param {number} len Value byte length
 * @param {*} val Value to write
 * @ignore
 */            function Op(fn, len, val) {
                /**
     * Function to call.
     * @type {function(Uint8Array, number, *)}
     */
                this.fn = fn;
                /**
     * Value byte length.
     * @type {number}
     */                this.len = len;
                /**
     * Next operation.
     * @type {Writer.Op|undefined}
     */                this.next = undefined;
                /**
     * Value to write.
     * @type {*}
     */                this.val = val;
 // type varies
                        }
            /* istanbul ignore next */            function noop() {}
 // eslint-disable-line no-empty-function
            /**
 * Constructs a new writer state instance.
 * @classdesc Copied writer state.
 * @memberof Writer
 * @constructor
 * @param {Writer} writer Writer to copy state from
 * @ignore
 */            function State(writer) {
                /**
     * Current head.
     * @type {Writer.Op}
     */
                this.head = writer.head;
                /**
     * Current tail.
     * @type {Writer.Op}
     */                this.tail = writer.tail;
                /**
     * Current buffer length.
     * @type {number}
     */                this.len = writer.len;
                /**
     * Next state.
     * @type {State|null}
     */                this.next = writer.states;
            }
            /**
 * Constructs a new writer instance.
 * @classdesc Wire format writer using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 */            function Writer() {
                /**
     * Current length.
     * @type {number}
     */
                this.len = 0;
                /**
     * Operations head.
     * @type {Object}
     */                this.head = new Op(noop, 0, 0);
                /**
     * Operations tail
     * @type {Object}
     */                this.tail = this.head;
                /**
     * Linked forked states.
     * @type {Object|null}
     */                this.states = null;
                // When a value is written, the writer calculates its byte length and puts it into a linked
                // list of operations to perform when finish() is called. This both allows us to allocate
                // buffers of the exact required size and reduces the amount of work we have to do compared
                // to first calculating over objects and then encoding over objects. In our case, the encoding
                // part is just a linked list walk calling operations with already prepared values.
                        }
            var create = function create() {
                return util.Buffer ? function create_buffer_setup() {
                    return (Writer.create = function create_buffer() {
                        return new BufferWriter;
                    })();
                }
                /* istanbul ignore next */ : function create_array() {
                    return new Writer;
                };
            };
            /**
 * Creates a new writer.
 * @function
 * @returns {BufferWriter|Writer} A {@link BufferWriter} when Buffers are supported, otherwise a {@link Writer}
 */            Writer.create = create();
            /**
 * Allocates a buffer of the specified size.
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */            Writer.alloc = function alloc(size) {
                return new util.Array(size);
            };
            // Use Uint8Array buffer pool in the browser, just like node does with buffers
            /* istanbul ignore else */            if (util.Array !== Array) Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);
            /**
 * Pushes a new operation to the queue.
 * @param {function(Uint8Array, number, *)} fn Function to call
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @returns {Writer} `this`
 * @private
 */            Writer.prototype._push = function push(fn, len, val) {
                this.tail = this.tail.next = new Op(fn, len, val);
                this.len += len;
                return this;
            };
            function writeByte(val, buf, pos) {
                buf[pos] = val & 255;
            }
            function writeVarint32(val, buf, pos) {
                while (val > 127) {
                    buf[pos++] = val & 127 | 128;
                    val >>>= 7;
                }
                buf[pos] = val;
            }
            /**
 * Constructs a new varint writer operation instance.
 * @classdesc Scheduled varint writer operation.
 * @extends Op
 * @constructor
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @ignore
 */            function VarintOp(len, val) {
                this.len = len;
                this.next = undefined;
                this.val = val;
            }
            VarintOp.prototype = Object.create(Op.prototype);
            VarintOp.prototype.fn = writeVarint32;
            /**
 * Writes an unsigned 32 bit value as a varint.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */            Writer.prototype.uint32 = function write_uint32(value) {
                // here, the call to this.push has been inlined and a varint specific Op subclass is used.
                // uint32 is by far the most frequently used operation and benefits significantly from this.
                this.len += (this.tail = this.tail.next = new VarintOp((value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5, value)).len;
                return this;
            };
            /**
 * Writes a signed 32 bit value as a varint.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */            Writer.prototype.int32 = function write_int32(value) {
                return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
            };
            /**
 * Writes a 32 bit value as a varint, zig-zag encoded.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */            Writer.prototype.sint32 = function write_sint32(value) {
                return this.uint32((value << 1 ^ value >> 31) >>> 0);
            };
            function writeVarint64(val, buf, pos) {
                while (val.hi) {
                    buf[pos++] = val.lo & 127 | 128;
                    val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
                    val.hi >>>= 7;
                }
                while (val.lo > 127) {
                    buf[pos++] = val.lo & 127 | 128;
                    val.lo = val.lo >>> 7;
                }
                buf[pos++] = val.lo;
            }
            /**
 * Writes an unsigned 64 bit value as a varint.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */            Writer.prototype.uint64 = function write_uint64(value) {
                var bits = LongBits.from(value);
                return this._push(writeVarint64, bits.length(), bits);
            };
            /**
 * Writes a signed 64 bit value as a varint.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */            Writer.prototype.int64 = Writer.prototype.uint64;
            /**
 * Writes a signed 64 bit value as a varint, zig-zag encoded.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */            Writer.prototype.sint64 = function write_sint64(value) {
                var bits = LongBits.from(value).zzEncode();
                return this._push(writeVarint64, bits.length(), bits);
            };
            /**
 * Writes a boolish value as a varint.
 * @param {boolean} value Value to write
 * @returns {Writer} `this`
 */            Writer.prototype.bool = function write_bool(value) {
                return this._push(writeByte, 1, value ? 1 : 0);
            };
            function writeFixed32(val, buf, pos) {
                buf[pos] = val & 255;
                buf[pos + 1] = val >>> 8 & 255;
                buf[pos + 2] = val >>> 16 & 255;
                buf[pos + 3] = val >>> 24;
            }
            /**
 * Writes an unsigned 32 bit value as fixed 32 bits.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */            Writer.prototype.fixed32 = function write_fixed32(value) {
                return this._push(writeFixed32, 4, value >>> 0);
            };
            /**
 * Writes a signed 32 bit value as fixed 32 bits.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */            Writer.prototype.sfixed32 = Writer.prototype.fixed32;
            /**
 * Writes an unsigned 64 bit value as fixed 64 bits.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */            Writer.prototype.fixed64 = function write_fixed64(value) {
                var bits = LongBits.from(value);
                return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
            };
            /**
 * Writes a signed 64 bit value as fixed 64 bits.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */            Writer.prototype.sfixed64 = Writer.prototype.fixed64;
            /**
 * Writes a float (32 bit).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */            Writer.prototype.float = function write_float(value) {
                return this._push(util.float.writeFloatLE, 4, value);
            };
            /**
 * Writes a double (64 bit float).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */            Writer.prototype.double = function write_double(value) {
                return this._push(util.float.writeDoubleLE, 8, value);
            };
            var writeBytes = util.Array.prototype.set ? function writeBytes_set(val, buf, pos) {
                buf.set(val, pos);
 // also works for plain array values
                        }
            /* istanbul ignore next */ : function writeBytes_for(val, buf, pos) {
                for (var i = 0; i < val.length; ++i) buf[pos + i] = val[i];
            };
            /**
 * Writes a sequence of bytes.
 * @param {Uint8Array|string} value Buffer or base64 encoded string to write
 * @returns {Writer} `this`
 */            Writer.prototype.bytes = function write_bytes(value) {
                var len = value.length >>> 0;
                if (!len) return this._push(writeByte, 1, 0);
                if (util.isString(value)) {
                    var buf = Writer.alloc(len = base64.length(value));
                    base64.decode(value, buf, 0);
                    value = buf;
                }
                return this.uint32(len)._push(writeBytes, len, value);
            };
            /**
 * Writes a string.
 * @param {string} value Value to write
 * @returns {Writer} `this`
 */            Writer.prototype.string = function write_string(value) {
                var len = utf8.length(value);
                return len ? this.uint32(len)._push(utf8.write, len, value) : this._push(writeByte, 1, 0);
            };
            /**
 * Forks this writer's state by pushing it to a stack.
 * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
 * @returns {Writer} `this`
 */            Writer.prototype.fork = function fork() {
                this.states = new State(this);
                this.head = this.tail = new Op(noop, 0, 0);
                this.len = 0;
                return this;
            };
            /**
 * Resets this instance to the last state.
 * @returns {Writer} `this`
 */            Writer.prototype.reset = function reset() {
                if (this.states) {
                    this.head = this.states.head;
                    this.tail = this.states.tail;
                    this.len = this.states.len;
                    this.states = this.states.next;
                } else {
                    this.head = this.tail = new Op(noop, 0, 0);
                    this.len = 0;
                }
                return this;
            };
            /**
 * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
 * @returns {Writer} `this`
 */            Writer.prototype.ldelim = function ldelim() {
                var head = this.head, tail = this.tail, len = this.len;
                this.reset().uint32(len);
                if (len) {
                    this.tail.next = head.next;
 // skip noop
                                        this.tail = tail;
                    this.len += len;
                }
                return this;
            };
            /**
 * Finishes the write operation.
 * @returns {Uint8Array} Finished buffer
 */            Writer.prototype.finish = function finish() {
                var head = this.head.next, // skip noop
                buf = this.constructor.alloc(this.len), pos = 0;
                while (head) {
                    head.fn(head.val, buf, pos);
                    pos += head.len;
                    head = head.next;
                }
                // this.head = this.tail = null;
                                return buf;
            };
            Writer._configure = function(BufferWriter_) {
                BufferWriter = BufferWriter_;
                Writer.create = create();
                BufferWriter._configure();
            };
            /***/        },
        /***/ 529(module) {
            "use strict";
            module.exports = {};
            /**
 * Named roots.
 * This is where pbjs stores generated structures (the option `-r, --root` specifies a name).
 * Can also be used manually to make roots available across modules.
 * @name roots
 * @type {Object.<string,Root>}
 * @example
 * // pbjs -r myroot -o compiled.js ...
 *
 * // in another module:
 * require("./compiled.js");
 *
 * // in any subsequent module:
 * var root = protobuf.roots["myroot"];
 */
            /***/        },
        /***/ 595(module, __unused_webpack_exports, __webpack_require__) {
            "use strict";
            module.exports = Service;
            var util = __webpack_require__(610);
            // Extends EventEmitter
                        (Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
            /**
 * A service method callback as used by {@link rpc.ServiceMethod|ServiceMethod}.
 *
 * Differs from {@link RPCImplCallback} in that it is an actual callback of a service method which may not return `response = null`.
 * @typedef rpc.ServiceMethodCallback
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {TRes} [response] Response message
 * @returns {undefined}
 */
            /**
 * A service method part of a {@link rpc.Service} as created by {@link Service.create}.
 * @typedef rpc.ServiceMethod
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} [callback] Node-style callback called with the error, if any, and the response message
 * @returns {Promise<Message<TRes>>} Promise if `callback` has been omitted, otherwise `undefined`
 */
            /**
 * Constructs a new RPC service instance.
 * @classdesc An RPC service as returned by {@link Service#create}.
 * @exports rpc.Service
 * @extends util.EventEmitter
 * @constructor
 * @param {RPCImpl} rpcImpl RPC implementation
 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
 */            function Service(rpcImpl, requestDelimited, responseDelimited) {
                if (typeof rpcImpl !== "function") throw TypeError("rpcImpl must be a function");
                util.EventEmitter.call(this);
                /**
     * RPC implementation. Becomes `null` once the service is ended.
     * @type {RPCImpl|null}
     */                this.rpcImpl = rpcImpl;
                /**
     * Whether requests are length-delimited.
     * @type {boolean}
     */                this.requestDelimited = Boolean(requestDelimited);
                /**
     * Whether responses are length-delimited.
     * @type {boolean}
     */                this.responseDelimited = Boolean(responseDelimited);
            }
            /**
 * Calls a service method through {@link rpc.Service#rpcImpl|rpcImpl}.
 * @param {Method|rpc.ServiceMethod<TReq,TRes>} method Reflected or static method
 * @param {Constructor<TReq>} requestCtor Request constructor
 * @param {Constructor<TRes>} responseCtor Response constructor
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} callback Service callback
 * @returns {undefined}
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 */            Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
                if (!request) throw TypeError("request must be specified");
                var self = this;
                if (!callback) return util.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);
                if (!self.rpcImpl) {
                    setTimeout(function() {
                        callback(Error("already ended"));
                    }, 0);
                    return undefined;
                }
                try {
                    return self.rpcImpl(method, requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(), function rpcCallback(err, response) {
                        if (err) {
                            self.emit("error", err, method);
                            return callback(err);
                        }
                        if (response === null) {
                            self.end(/* endedByRPC */ true);
                            return undefined;
                        }
                        if (!(response instanceof responseCtor)) {
                            try {
                                response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
                            } catch (err) {
                                self.emit("error", err, method);
                                return callback(err);
                            }
                        }
                        self.emit("data", response, method);
                        return callback(null, response);
                    });
                } catch (err) {
                    self.emit("error", err, method);
                    setTimeout(function() {
                        callback(err);
                    }, 0);
                    return undefined;
                }
            };
            /**
 * Ends this service and emits the `end` event.
 * @param {boolean} [endedByRPC=false] Whether the service has been ended by the RPC implementation.
 * @returns {rpc.Service} `this`
 */            Service.prototype.end = function end(endedByRPC) {
                if (this.rpcImpl) {
                    if (!endedByRPC) // signal end to rpcImpl
                    this.rpcImpl(null, null, null);
                    this.rpcImpl = null;
                    this.emit("end").off();
                }
                return this;
            };
            /***/        },
        /***/ 610(__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var util = exports;
            // used to return a Promise where callback is omitted
                        util.asPromise = __webpack_require__(45);
            // converts to / from base64 encoded strings
                        util.base64 = __webpack_require__(839);
            // base class of rpc.Service
                        util.EventEmitter = __webpack_require__(358);
            // float handling accross browsers
                        util.float = __webpack_require__(410);
            // requires modules optionally and hides the call from bundlers
                        util.inquire = __webpack_require__(153);
            // converts to / from utf8 encoded strings
                        util.utf8 = __webpack_require__(447);
            // provides a node-like buffer pool in the browser
                        util.pool = __webpack_require__(390);
            // utility to work with the low and high bits of a 64 bit value
                        util.LongBits = __webpack_require__(239);
            /**
 * Whether running within node or not.
 * @memberof util
 * @type {boolean}
 */            util.isNode = Boolean(typeof __webpack_require__.g !== "undefined" && __webpack_require__.g && __webpack_require__.g.process && __webpack_require__.g.process.versions && __webpack_require__.g.process.versions.node);
            /**
 * Global object reference.
 * @memberof util
 * @type {Object}
 */            util.global = util.isNode && __webpack_require__.g || typeof window !== "undefined" && window || typeof self !== "undefined" && self || this;
 // eslint-disable-line no-invalid-this
            /**
 * An immuable empty array.
 * @memberof util
 * @type {Array.<*>}
 * @const
 */            util.emptyArray = Object.freeze ? Object.freeze([]) : /* istanbul ignore next */ [];
 // used on prototypes
            /**
 * An immutable empty object.
 * @type {Object}
 * @const
 */            util.emptyObject = Object.freeze ? Object.freeze({}) : /* istanbul ignore next */ {};
 // used on prototypes
            /**
 * Tests if the specified value is an integer.
 * @function
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is an integer
 */            util.isInteger = Number.isInteger || /* istanbul ignore next */ function isInteger(value) {
                return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
            };
            /**
 * Tests if the specified value is a string.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a string
 */            util.isString = function isString(value) {
                return typeof value === "string" || value instanceof String;
            };
            /**
 * Tests if the specified value is a non-null object.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a non-null object
 */            util.isObject = function isObject(value) {
                return value && typeof value === "object";
            };
            /**
 * Checks if a property on a message is considered to be present.
 * This is an alias of {@link util.isSet}.
 * @function
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */            util.isset = 
            /**
 * Checks if a property on a message is considered to be present.
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
            util.isSet = function isSet(obj, prop) {
                var value = obj[prop];
                if (value != null && obj.hasOwnProperty(prop)) // eslint-disable-line eqeqeq, no-prototype-builtins
                return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
                return false;
            };
            /**
 * Any compatible Buffer instance.
 * This is a minimal stand-alone definition of a Buffer instance. The actual type is that exported by node's typings.
 * @interface Buffer
 * @extends Uint8Array
 */
            /**
 * Node's Buffer class if available.
 * @type {Constructor<Buffer>}
 */            util.Buffer = function() {
                try {
                    var Buffer = util.inquire("buffer").Buffer;
                    // refuse to use non-node buffers if not explicitly assigned (perf reasons):
                                        return Buffer.prototype.utf8Write ? Buffer : /* istanbul ignore next */ null;
                } catch (e) {
                    /* istanbul ignore next */
                    return null;
                }
            }();
            // Internal alias of or polyfull for Buffer.from.
                        util._Buffer_from = null;
            // Internal alias of or polyfill for Buffer.allocUnsafe.
                        util._Buffer_allocUnsafe = null;
            /**
 * Creates a new buffer of whatever type supported by the environment.
 * @param {number|number[]} [sizeOrArray=0] Buffer size or number array
 * @returns {Uint8Array|Buffer} Buffer
 */            util.newBuffer = function newBuffer(sizeOrArray) {
                /* istanbul ignore next */
                return typeof sizeOrArray === "number" ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
            };
            /**
 * Array implementation used in the browser. `Uint8Array` if supported, otherwise `Array`.
 * @type {Constructor<Uint8Array>}
 */            util.Array = typeof Uint8Array !== "undefined" ? Uint8Array /* istanbul ignore next */ : Array;
            /**
 * Any compatible Long instance.
 * This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
 * @interface Long
 * @property {number} low Low bits
 * @property {number} high High bits
 * @property {boolean} unsigned Whether unsigned or not
 */
            /**
 * Long.js's Long class if available.
 * @type {Constructor<Long>}
 */            util.Long = /* istanbul ignore next */ util.global.dcodeIO && /* istanbul ignore next */ util.global.dcodeIO.Long || /* istanbul ignore next */ util.global.Long || util.inquire("long");
            /**
 * Regular expression used to verify 2 bit (`bool`) map keys.
 * @type {RegExp}
 * @const
 */            util.key2Re = /^true|false|0|1$/;
            /**
 * Regular expression used to verify 32 bit (`int32` etc.) map keys.
 * @type {RegExp}
 * @const
 */            util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
            /**
 * Regular expression used to verify 64 bit (`int64` etc.) map keys.
 * @type {RegExp}
 * @const
 */            util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
            /**
 * Converts a number or long to an 8 characters long hash string.
 * @param {Long|number} value Value to convert
 * @returns {string} Hash
 */            util.longToHash = function longToHash(value) {
                return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
            };
            /**
 * Converts an 8 characters long hash string to a long or number.
 * @param {string} hash Hash
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long|number} Original value
 */            util.longFromHash = function longFromHash(hash, unsigned) {
                var bits = util.LongBits.fromHash(hash);
                if (util.Long) return util.Long.fromBits(bits.lo, bits.hi, unsigned);
                return bits.toNumber(Boolean(unsigned));
            };
            /**
 * Merges the properties of the source object into the destination object.
 * @memberof util
 * @param {Object.<string,*>} dst Destination object
 * @param {Object.<string,*>} src Source object
 * @param {boolean} [ifNotSet=false] Merges only if the key is not already set
 * @returns {Object.<string,*>} Destination object
 */            function merge(dst, src, ifNotSet) {
                // used by converters
                for (var keys = Object.keys(src), i = 0; i < keys.length; ++i) if (dst[keys[i]] === undefined || !ifNotSet) dst[keys[i]] = src[keys[i]];
                return dst;
            }
            util.merge = merge;
            /**
 * Converts the first character of a string to lower case.
 * @param {string} str String to convert
 * @returns {string} Converted string
 */            util.lcFirst = function lcFirst(str) {
                return str.charAt(0).toLowerCase() + str.substring(1);
            };
            /**
 * Creates a custom error constructor.
 * @memberof util
 * @param {string} name Error name
 * @returns {Constructor<Error>} Custom error constructor
 */            function newError(name) {
                function CustomError(message, properties) {
                    if (!(this instanceof CustomError)) return new CustomError(message, properties);
                    // Error.call(this, message);
                    // ^ just returns a new error instance because the ctor can be called as a function
                                        Object.defineProperty(this, "message", {
                        get: function() {
                            return message;
                        }
                    });
                    /* istanbul ignore next */                    if (Error.captureStackTrace) // node
                    Error.captureStackTrace(this, CustomError); else Object.defineProperty(this, "stack", {
                        value: (new Error).stack || ""
                    });
                    if (properties) merge(this, properties);
                }
                CustomError.prototype = Object.create(Error.prototype, {
                    constructor: {
                        value: CustomError,
                        writable: true,
                        enumerable: false,
                        configurable: true
                    },
                    name: {
                        get: function get() {
                            return name;
                        },
                        set: undefined,
                        enumerable: false,
                        // configurable: false would accurately preserve the behavior of
                        // the original, but I'm guessing that was not intentional.
                        // For an actual error subclass, this property would
                        // be configurable.
                        configurable: true
                    },
                    toString: {
                        value: function value() {
                            return this.name + ": " + this.message;
                        },
                        writable: true,
                        enumerable: false,
                        configurable: true
                    }
                });
                return CustomError;
            }
            util.newError = newError;
            /**
 * Constructs a new protocol error.
 * @classdesc Error subclass indicating a protocol specifc error.
 * @memberof util
 * @extends Error
 * @template T extends Message<T>
 * @constructor
 * @param {string} message Error message
 * @param {Object.<string,*>} [properties] Additional properties
 * @example
 * try {
 *     MyMessage.decode(someBuffer); // throws if required fields are missing
 * } catch (e) {
 *     if (e instanceof ProtocolError && e.instance)
 *         console.log("decoded so far: " + JSON.stringify(e.instance));
 * }
 */            util.ProtocolError = newError("ProtocolError");
            /**
 * So far decoded message instance.
 * @name util.ProtocolError#instance
 * @type {Message<T>}
 */
            /**
 * A OneOf getter as returned by {@link util.oneOfGetter}.
 * @typedef OneOfGetter
 * @type {function}
 * @returns {string|undefined} Set field name, if any
 */
            /**
 * Builds a getter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfGetter} Unbound getter
 */            util.oneOfGetter = function getOneOf(fieldNames) {
                var fieldMap = {};
                for (var i = 0; i < fieldNames.length; ++i) fieldMap[fieldNames[i]] = 1;
                /**
     * @returns {string|undefined} Set field name, if any
     * @this Object
     * @ignore
     */                return function() {
                    // eslint-disable-line consistent-return
                    for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i) if (fieldMap[keys[i]] === 1 && this[keys[i]] !== undefined && this[keys[i]] !== null) return keys[i];
                };
            };
            /**
 * A OneOf setter as returned by {@link util.oneOfSetter}.
 * @typedef OneOfSetter
 * @type {function}
 * @param {string|undefined} value Field name
 * @returns {undefined}
 */
            /**
 * Builds a setter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfSetter} Unbound setter
 */            util.oneOfSetter = function setOneOf(fieldNames) {
                /**
     * @param {string} name Field name
     * @returns {undefined}
     * @this Object
     * @ignore
     */
                return function(name) {
                    for (var i = 0; i < fieldNames.length; ++i) if (fieldNames[i] !== name) delete this[fieldNames[i]];
                };
            };
            /**
 * Default conversion options used for {@link Message#toJSON} implementations.
 *
 * These options are close to proto3's JSON mapping with the exception that internal types like Any are handled just like messages. More precisely:
 *
 * - Longs become strings
 * - Enums become string keys
 * - Bytes become base64 encoded strings
 * - (Sub-)Messages become plain objects
 * - Maps become plain objects with all string keys
 * - Repeated fields become arrays
 * - NaN and Infinity for float and double fields become strings
 *
 * @type {IConversionOptions}
 * @see https://developers.google.com/protocol-buffers/docs/proto3?hl=en#json
 */            util.toJSONOptions = {
                longs: String,
                enums: String,
                bytes: String,
                json: true
            };
            // Sets up buffer utility according to the environment (called in index-minimal)
                        util._configure = function() {
                var Buffer = util.Buffer;
                /* istanbul ignore if */                if (!Buffer) {
                    util._Buffer_from = util._Buffer_allocUnsafe = null;
                    return;
                }
                // because node 4.x buffers are incompatible & immutable
                // see: https://github.com/dcodeIO/protobuf.js/pull/665
                                util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from || 
                /* istanbul ignore next */
                function Buffer_from(value, encoding) {
                    return new Buffer(value, encoding);
                };
                util._Buffer_allocUnsafe = Buffer.allocUnsafe || 
                /* istanbul ignore next */
                function Buffer_allocUnsafe(size) {
                    return new Buffer(size);
                };
            };
            /***/        },
        /***/ 818(module, __unused_webpack_exports, __webpack_require__) {
            "use strict";
            module.exports = BufferWriter;
            // extends Writer
                        var Writer = __webpack_require__(449);
            (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
            var util = __webpack_require__(610);
            /**
 * Constructs a new buffer writer instance.
 * @classdesc Wire format writer using node buffers.
 * @extends Writer
 * @constructor
 */            function BufferWriter() {
                Writer.call(this);
            }
            BufferWriter._configure = function() {
                /**
     * Allocates a buffer of the specified size.
     * @function
     * @param {number} size Buffer size
     * @returns {Buffer} Buffer
     */
                BufferWriter.alloc = util._Buffer_allocUnsafe;
                BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf, pos) {
                    buf.set(val, pos);
 // faster than copy (requires node >= 4 where Buffers extend Uint8Array and set is properly inherited)
                    // also works for plain array values
                                }
                /* istanbul ignore next */ : function writeBytesBuffer_copy(val, buf, pos) {
                    if (val.copy) // Buffer values
                    val.copy(buf, pos, 0, val.length); else for (var i = 0; i < val.length; ) // plain array values
                    buf[pos++] = val[i++];
                };
            };
            /**
 * @override
 */            BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
                if (util.isString(value)) value = util._Buffer_from(value, "base64");
                var len = value.length >>> 0;
                this.uint32(len);
                if (len) this._push(BufferWriter.writeBytesBuffer, len, value);
                return this;
            };
            function writeStringBuffer(val, buf, pos) {
                if (val.length < 40) // plain js is faster for short strings (probably due to redundant assertions)
                util.utf8.write(val, buf, pos); else if (buf.utf8Write) buf.utf8Write(val, pos); else buf.write(val, pos);
            }
            /**
 * @override
 */            BufferWriter.prototype.string = function write_string_buffer(value) {
                var len = util.Buffer.byteLength(value);
                this.uint32(len);
                if (len) this._push(writeStringBuffer, len, value);
                return this;
            };
            /**
 * Finishes the write operation.
 * @name BufferWriter#finish
 * @function
 * @returns {Buffer} Finished buffer
 */            BufferWriter._configure();
            /***/        },
        /***/ 839(__unused_webpack_module, exports) {
            "use strict";
            /**
 * A minimal base64 implementation for number arrays.
 * @memberof util
 * @namespace
 */            var base64 = exports;
            /**
 * Calculates the byte length of a base64 encoded string.
 * @param {string} string Base64 encoded string
 * @returns {number} Byte length
 */            base64.length = function length(string) {
                var p = string.length;
                if (!p) return 0;
                var n = 0;
                while (--p % 4 > 1 && string.charAt(p) === "=") ++n;
                return Math.ceil(string.length * 3) / 4 - n;
            };
            // Base64 encoding table
                        var b64 = new Array(64);
            // Base64 decoding table
                        var s64 = new Array(123);
            // 65..90, 97..122, 48..57, 43, 47
                        for (var i = 0; i < 64; ) s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
            /**
 * Encodes a buffer to a base64 encoded string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} Base64 encoded string
 */            base64.encode = function encode(buffer, start, end) {
                var parts = null, chunk = [];
                var i = 0, // output index
                j = 0, // goto index
                t;
 // temporary
                                while (start < end) {
                    var b = buffer[start++];
                    switch (j) {
                      case 0:
                        chunk[i++] = b64[b >> 2];
                        t = (b & 3) << 4;
                        j = 1;
                        break;

                      case 1:
                        chunk[i++] = b64[t | b >> 4];
                        t = (b & 15) << 2;
                        j = 2;
                        break;

                      case 2:
                        chunk[i++] = b64[t | b >> 6];
                        chunk[i++] = b64[b & 63];
                        j = 0;
                        break;
                    }
                    if (i > 8191) {
                        (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
                        i = 0;
                    }
                }
                if (j) {
                    chunk[i++] = b64[t];
                    chunk[i++] = 61;
                    if (j === 1) chunk[i++] = 61;
                }
                if (parts) {
                    if (i) parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
                    return parts.join("");
                }
                return String.fromCharCode.apply(String, chunk.slice(0, i));
            };
            var invalidEncoding = "invalid encoding";
            /**
 * Decodes a base64 encoded string to a buffer.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Number of bytes written
 * @throws {Error} If encoding is invalid
 */            base64.decode = function decode(string, buffer, offset) {
                var start = offset;
                var j = 0, // goto index
                t;
 // temporary
                                for (var i = 0; i < string.length; ) {
                    var c = string.charCodeAt(i++);
                    if (c === 61 && j > 1) break;
                    if ((c = s64[c]) === undefined) throw Error(invalidEncoding);
                    switch (j) {
                      case 0:
                        t = c;
                        j = 1;
                        break;

                      case 1:
                        buffer[offset++] = t << 2 | (c & 48) >> 4;
                        t = c;
                        j = 2;
                        break;

                      case 2:
                        buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
                        t = c;
                        j = 3;
                        break;

                      case 3:
                        buffer[offset++] = (t & 3) << 6 | c;
                        j = 0;
                        break;
                    }
                }
                if (j === 1) throw Error(invalidEncoding);
                return offset - start;
            };
            /**
 * Tests if the specified string appears to be base64 encoded.
 * @param {string} string String to test
 * @returns {boolean} `true` if probably base64 encoded, otherwise false
 */            base64.test = function test(string) {
                return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
            };
            /***/        },
        /***/ 922(module, exports, __webpack_require__) {
            var __WEBPACK_AMD_DEFINE_RESULT__;
            /*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
            /* global define */
            /* eslint-disable strict */            (function($) {
                "use strict";
                /**
   * Add integers, wrapping at 2^32.
   * This uses 16-bit operations internally to work around bugs in interpreters.
   *
   * @param {number} x First integer
   * @param {number} y Second integer
   * @returns {number} Sum
   */                function safeAdd(x, y) {
                    var lsw = (x & 65535) + (y & 65535);
                    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                    return msw << 16 | lsw & 65535;
                }
                /**
   * Bitwise rotate a 32-bit number to the left.
   *
   * @param {number} num 32-bit number
   * @param {number} cnt Rotation count
   * @returns {number} Rotated number
   */                function bitRotateLeft(num, cnt) {
                    return num << cnt | num >>> 32 - cnt;
                }
                /**
   * Basic operation the algorithm uses.
   *
   * @param {number} q q
   * @param {number} a a
   * @param {number} b b
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */                function md5cmn(q, a, b, x, s, t) {
                    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
                }
                /**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */                function md5ff(a, b, c, d, x, s, t) {
                    return md5cmn(b & c | ~b & d, a, b, x, s, t);
                }
                /**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */                function md5gg(a, b, c, d, x, s, t) {
                    return md5cmn(b & d | c & ~d, a, b, x, s, t);
                }
                /**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */                function md5hh(a, b, c, d, x, s, t) {
                    return md5cmn(b ^ c ^ d, a, b, x, s, t);
                }
                /**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */                function md5ii(a, b, c, d, x, s, t) {
                    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
                }
                /**
   * Calculate the MD5 of an array of little-endian words, and a bit length.
   *
   * @param {Array} x Array of little-endian words
   * @param {number} len Bit length
   * @returns {Array<number>} MD5 Array
   */                function binlMD5(x, len) {
                    /* append padding */
                    x[len >> 5] |= 128 << len % 32;
                    x[(len + 64 >>> 9 << 4) + 14] = len;
                    var i;
                    var olda;
                    var oldb;
                    var oldc;
                    var oldd;
                    var a = 1732584193;
                    var b = -271733879;
                    var c = -1732584194;
                    var d = 271733878;
                    for (i = 0; i < x.length; i += 16) {
                        olda = a;
                        oldb = b;
                        oldc = c;
                        oldd = d;
                        a = md5ff(a, b, c, d, x[i], 7, -680876936);
                        d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
                        c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
                        b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
                        a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
                        d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
                        c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
                        b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
                        a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
                        d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
                        c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
                        b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
                        a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
                        d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
                        c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
                        b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
                        a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
                        d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
                        c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
                        b = md5gg(b, c, d, a, x[i], 20, -373897302);
                        a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
                        d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
                        c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
                        b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
                        a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
                        d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
                        c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
                        b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
                        a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
                        d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
                        c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
                        b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
                        a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
                        d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
                        c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
                        b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
                        a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
                        d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
                        c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
                        b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
                        a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
                        d = md5hh(d, a, b, c, x[i], 11, -358537222);
                        c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
                        b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
                        a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
                        d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
                        c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
                        b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
                        a = md5ii(a, b, c, d, x[i], 6, -198630844);
                        d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
                        c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
                        b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
                        a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
                        d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
                        c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
                        b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
                        a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
                        d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
                        c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
                        b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
                        a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
                        d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
                        c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
                        b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
                        a = safeAdd(a, olda);
                        b = safeAdd(b, oldb);
                        c = safeAdd(c, oldc);
                        d = safeAdd(d, oldd);
                    }
                    return [ a, b, c, d ];
                }
                /**
   * Convert an array of little-endian words to a string
   *
   * @param {Array<number>} input MD5 Array
   * @returns {string} MD5 string
   */                function binl2rstr(input) {
                    var i;
                    var output = "";
                    var length32 = input.length * 32;
                    for (i = 0; i < length32; i += 8) {
                        output += String.fromCharCode(input[i >> 5] >>> i % 32 & 255);
                    }
                    return output;
                }
                /**
   * Convert a raw string to an array of little-endian words
   * Characters >255 have their high-byte silently ignored.
   *
   * @param {string} input Raw input string
   * @returns {Array<number>} Array of little-endian words
   */                function rstr2binl(input) {
                    var i;
                    var output = [];
                    output[(input.length >> 2) - 1] = undefined;
                    for (i = 0; i < output.length; i += 1) {
                        output[i] = 0;
                    }
                    var length8 = input.length * 8;
                    for (i = 0; i < length8; i += 8) {
                        output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << i % 32;
                    }
                    return output;
                }
                /**
   * Calculate the MD5 of a raw string
   *
   * @param {string} s Input string
   * @returns {string} Raw MD5 string
   */                function rstrMD5(s) {
                    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
                }
                /**
   * Calculates the HMAC-MD5 of a key and some data (raw strings)
   *
   * @param {string} key HMAC key
   * @param {string} data Raw input string
   * @returns {string} Raw MD5 string
   */                function rstrHMACMD5(key, data) {
                    var i;
                    var bkey = rstr2binl(key);
                    var ipad = [];
                    var opad = [];
                    var hash;
                    ipad[15] = opad[15] = undefined;
                    if (bkey.length > 16) {
                        bkey = binlMD5(bkey, key.length * 8);
                    }
                    for (i = 0; i < 16; i += 1) {
                        ipad[i] = bkey[i] ^ 909522486;
                        opad[i] = bkey[i] ^ 1549556828;
                    }
                    hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
                    return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));
                }
                /**
   * Convert a raw string to a hex string
   *
   * @param {string} input Raw input string
   * @returns {string} Hex encoded string
   */                function rstr2hex(input) {
                    var hexTab = "0123456789abcdef";
                    var output = "";
                    var x;
                    var i;
                    for (i = 0; i < input.length; i += 1) {
                        x = input.charCodeAt(i);
                        output += hexTab.charAt(x >>> 4 & 15) + hexTab.charAt(x & 15);
                    }
                    return output;
                }
                /**
   * Encode a string as UTF-8
   *
   * @param {string} input Input string
   * @returns {string} UTF8 string
   */                function str2rstrUTF8(input) {
                    return unescape(encodeURIComponent(input));
                }
                /**
   * Encodes input string as raw MD5 string
   *
   * @param {string} s Input string
   * @returns {string} Raw MD5 string
   */                function rawMD5(s) {
                    return rstrMD5(str2rstrUTF8(s));
                }
                /**
   * Encodes input string as Hex encoded string
   *
   * @param {string} s Input string
   * @returns {string} Hex encoded string
   */                function hexMD5(s) {
                    return rstr2hex(rawMD5(s));
                }
                /**
   * Calculates the raw HMAC-MD5 for the given key and data
   *
   * @param {string} k HMAC key
   * @param {string} d Input string
   * @returns {string} Raw MD5 string
   */                function rawHMACMD5(k, d) {
                    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
                }
                /**
   * Calculates the Hex encoded HMAC-MD5 for the given key and data
   *
   * @param {string} k HMAC key
   * @param {string} d Input string
   * @returns {string} Raw MD5 string
   */                function hexHMACMD5(k, d) {
                    return rstr2hex(rawHMACMD5(k, d));
                }
                /**
   * Calculates MD5 value for a given string.
   * If a key is provided, calculates the HMAC-MD5 value.
   * Returns a Hex encoded string unless the raw argument is given.
   *
   * @param {string} string Input string
   * @param {string} [key] HMAC key
   * @param {boolean} [raw] Raw output switch
   * @returns {string} MD5 output
   */                function md5(string, key, raw) {
                    if (!key) {
                        if (!raw) {
                            return hexMD5(string);
                        }
                        return rawMD5(string);
                    }
                    if (!raw) {
                        return hexHMACMD5(key, string);
                    }
                    return rawHMACMD5(key, string);
                }
                if (true) {
                    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
                        return md5;
                    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
 // removed by dead control flow
                                } else {}
            })(this)
            /***/;
        },
        /***/ 946(module, __unused_webpack_exports, __webpack_require__) {
            "use strict";
            // minimal library entry point.
                        module.exports = __webpack_require__(394);
            /***/        }
        /******/    };
    /************************************************************************/
    /******/ // The module cache
    /******/    var __webpack_module_cache__ = {};
    /******/
    /******/ // The require function
    /******/    function __webpack_require__(moduleId) {
        /******/ // Check if module is in cache
        /******/ var cachedModule = __webpack_module_cache__[moduleId];
        /******/        if (cachedModule !== undefined) {
            /******/ return cachedModule.exports;
            /******/        }
        /******/ // Create a new module (and put it into the cache)
        /******/        var module = __webpack_module_cache__[moduleId] = {
            /******/ // no module.id needed
            /******/ // no module.loaded needed
            /******/ exports: {}
            /******/        };
        /******/
        /******/ // Execute the module function
        /******/        __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ // Return the exports of the module
        /******/        return module.exports;
        /******/    }
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/define property getters */
    /******/    (() => {
        /******/ // define getter functions for harmony exports
        /******/ __webpack_require__.d = (exports, definition) => {
            /******/ for (var key in definition) {
                /******/ if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                    /******/ Object.defineProperty(exports, key, {
                        enumerable: true,
                        get: definition[key]
                    });
                    /******/                }
                /******/            }
            /******/        };
        /******/    })();
    /******/
    /******/ /* webpack/runtime/global */
    /******/    (() => {
        /******/ __webpack_require__.g = function() {
            /******/ if (typeof globalThis === "object") return globalThis;
            /******/            try {
                /******/ return this || new Function("return this")();
                /******/            } catch (e) {
                /******/ if (typeof window === "object") return window;
                /******/            }
            /******/        }();
        /******/    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/    (() => {
        /******/ __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
        /******/;
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/    (() => {
        /******/ // define __esModule on exports
        /******/ __webpack_require__.r = exports => {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(exports, Symbol.toStringTag, {
                    value: "Module"
                });
                /******/            }
            /******/            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            /******/        };
        /******/    })();
    /******/
    /************************************************************************/    var __webpack_exports__ = {};
    // This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
        (() => {
        "use strict";
        // ESM COMPAT FLAG
                __webpack_require__.r(__webpack_exports__);
        // EXPORTS
                __webpack_require__.d(__webpack_exports__, {
            BiliArchive: () => /* reexport */ BiliArchive,
            BiliClient: () => /* reexport */ BiliClient,
            BiliComment: () => /* reexport */ BiliComment,
            BiliDanmaku: () => /* reexport */ BiliDanmaku,
            create: () => /* binding */ create,
            handler: () => /* reexport */ handler
        });
        // ./src/BiliClient.js
        // src/BiliClient.js
        const md5 = __webpack_require__(922);
        class BiliClient {
            constructor(httpRequest, logger) {
                this.headers = {
                    "User-Agent": navigator.userAgent,
                    Referer: "https://www.bilibili.com/"
                };
                this.wbiKey = "";
                this.buvid3 = "";
                this.httpRequest = httpRequest;
                this.logger = logger || new Proxy({}, {
                    get: () => () => {}
                });
            }
            getMixinKey(origin) {
                const table = [ 46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52 ];
                return table.map(i => origin[i]).join("").slice(0, 32);
            }
            async ensureWbiKey() {
                // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/sign/wbi.md
                const currentHour = Math.floor(Date.now() / 36e5);
                if (this.wbiKey && this.wbiKeyUpdateHour === currentHour) return;
                if (this.wbiKeyPromise) return this.wbiKeyPromise;
                this.wbiKeyPromise = (async () => {
                    try {
                        this.wbiKeyUpdateHour = Math.floor(Date.now() / 36e5);
                        const navData = await this.request({
                            url: "https://api.bilibili.com/x/web-interface/nav",
                            desc: "获取WBI key",
                            sign: false
                        });
                        const img_url = navData?.data?.wbi_img?.img_url;
                        const sub_url = navData?.data?.wbi_img?.sub_url;
                        if (!img_url || !sub_url) {
                            throw new Error("获取 WBI 失败");
                        }
                        const imgKey = img_url.slice(img_url.lastIndexOf("/") + 1, img_url.lastIndexOf("."));
                        const subKey = sub_url.slice(sub_url.lastIndexOf("/") + 1, sub_url.lastIndexOf("."));
                        this.wbiKey = this.getMixinKey(imgKey + subKey);
                        this.wbiKeyUpdateHour = currentHour;
                    } catch (e) {
                        this.logger.error("❌ 更新 WBI Key 失败", e);
                    } finally {
                        this.wbiKeyPromise = null;
 // 完成后释放锁
                                        }
                })();
                return this.wbiKeyPromise;
            }
            getQuery(params = {}, sign = false) {
                if (!sign || !this.wbiKey) {
                    return Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join("&");
                } else {
                    params.wts = Math.round(Date.now() / 1e3);
                    const query = Object.keys(params).sort().map(key => {
                        const value = String(params[key]).replace(/[!'()*]/g, "");
                        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                    }).join("&");
                    const w_rid = md5(query + this.wbiKey);
                    return query + "&w_rid=" + w_rid;
                }
            }
            async ensureBuvid3() {
                // 若浏览器登陆过B站，GM_xmlHttpRequest 自然会携带 Cookie；否则需要自己请求buvid3字段
                if (this.buvidPromise) return this.buvidPromise;
                this.buvidPromise = new Promise((resolve, reject) => {
                    this.httpRequest({
                        method: "GET",
                        url: "https://api.bilibili.com/x/web-frontend/getbuvid",
                        onload: res => {
                            try {
                                const json = JSON.parse(res.responseText);
                                const newBuvid = json?.data?.buvid;
                                if (newBuvid) {
                                    this.buvid3 = newBuvid;
                                    resolve(this.buvid3);
                                } else {
                                    reject({
                                        message: "未成功获取到 buvid3",
                                        response: json
                                    });
                                }
                            } catch (e) {
                                reject(e);
                            }
                        },
                        onerror: reject
                    });
                }).finally(() => {
                    this.buvidPromise = null;
                });
                return this.buvidPromise;
            }
            async request({url, params = {}, responseType = "json", sign = false, desc = ""}) {
                if (sign) {
                    await this.ensureWbiKey();
                }
                const query = this.getQuery(params, sign);
                const fullUrl = query ? `${url}?${query}` : url;
                const doRequest = () => new Promise((resolve, reject) => {
                    const headers = {
                        ...this.headers
                    };
                    if (this.buvid3) {
                        headers.Cookie = `buvid3=${this.buvid3}`;
                    }
                    this.httpRequest({
                        method: "GET",
                        url: fullUrl,
                        headers,
                        responseType,
                        onload: res => {
                            if (res.status == 412) {
                                return reject({
                                    code: 412,
                                    message: "请求被拦截",
                                    desc,
                                    res
                                });
                            }
                            this.logger.log(`🌐 [${desc}]`, res);
                            resolve(res.response ?? res.responseText);
                        },
                        onerror: err => {
                            this.logger.error(`❌ [${desc}] 网络错误`, err);
                            reject(err);
                        }
                    });
                });
                return doRequest().catch(async err => {
                    if (err.code === 412) {
                        if (!this.buvid3) {
                            this.logger.warn(`⚠️ [${desc}] 请求被拦截，尝试刷新 buvid3 重试`);
                            await this.ensureBuvid3();
                            return doRequest();
                        }
                    }
                    throw err;
                });
            }
        }
        // ./src/utils.js
        // src/utils.js
        /**
 * 并发控制辅助函数
 * @param {Array} list 任务参数列表
 * @param {number} limit 并发上限
 * @param {Function} taskFn 任务执行函数 (接收 list 中的一项)
 */
        async function promiseLimit(list, limit, taskFn) {
            const results = [];
            const executing = new Set;
 // 正在执行的任务
                        for (const item of list) {
                // 创建任务 Promise
                const p = Promise.resolve().then(() => taskFn(item));
                results.push(p);
                executing.add(p);
                // 任务完成后从执行队列删除
                                const clean = () => executing.delete(p);
                p.then(clean).catch(clean);
                // 如果达到上限，等待最快的一个完成
                                if (executing.size >= limit) {
                    await Promise.race(executing);
                }
            }
            return Promise.all(results);
        }
        /**
 * 将 URL 中的 http 协议替换为 https
 * @param {string} url 目标 URL
 * @returns {string} 替换后的 URL
 */        function httptoHttps(url) {
            return typeof url === "string" ? url.replace(/^http:/, "https:") : url;
        }
        /**
 * 将日期字符串（北京时间）转换为时间戳（秒）
 * @param {string} date 日期字符串，格式为 "YYYY-MM-DD"
 * @returns {number} 对应的时间戳（秒）
 */        function dateToTimestamp(date, hour = 0, minute = 0, second = 0) {
            if (!date) return null;
            const toTwoDigit = num => num.toString().padStart(2, "0");
            const ts = Date.parse(`${date}T${toTwoDigit(hour)}:${toTwoDigit(minute)}:${toTwoDigit(second)}+08:00`);
            return isNaN(ts) ? null : Math.floor(ts / 1e3);
        }
        /**
 * 将时间戳（秒）转换为日期字符串（YYYY-MM-DD）
 * @param {number} ts 时间戳（秒）
 * @returns {string} 日期字符串，格式为 "YYYY-MM-DD"
 */        function timestampToDate(ts) {
            const d = new Date(ts * 1e3);
            const toTwoDigit = num => num.toString().padStart(2, "0");
            return `${d.getFullYear()}-${toTwoDigit(d.getMonth() + 1)}-${toTwoDigit(d.getDate())}`;
        }
        /** * 生成指定范围内的随机整数
 * @param {number} min 最小值（包含）
 * @param {number} max 最大值（包含）
 * @returns {number} 生成的随机整数
 */        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        /** * 延迟指定时间，并执行回调函数
 * @param {Object} options 延迟选项
 * @param {number} [options.base=500] 延迟基础时间，单位毫秒
 * @param {number} [options.jitter=500] 延迟抖动时间，单位毫秒
 * @param {Function} [options.beforeFn] 延迟开始前的回调函数
 * @param {Function} [options.afterFn] 延迟结束后的回调函数
 * @returns {Promise} 延迟结束后的 Promise
 */        async function sleep({base = 0, jitter = 0, beforeFn = () => {}, afterFn = () => {}} = {}) {
            if (base <= 0 || jitter <= 0) return 0;
            const delay = randomInt(base, base + jitter);
            beforeFn(delay);
            await new Promise(resolve => setTimeout(resolve, delay));
            afterFn(delay);
            return delay;
        }
        // ./src/handlers/video.js
        // src/handlers/video.js
        const videoHandler = {
            name: "video",
            keys: [ "video_view" ],
            match(url) {
                return /BV[a-zA-Z0-9]+/.test(url);
            },
            parse(url) {
                const idObj = {};
                const bvid = (url.match(/BV[a-zA-Z0-9]+/) || [])[0];
                if (!bvid) throw new Error("Video parse: no bvid");
                idObj.bvid = bvid;
                idObj.id = "video/" + bvid;
                const pMatch = url.match(/[?&]p=(\d+)/);
                if (pMatch) {
                    const p = parseInt(pMatch[1], 10);
                    if (!isNaN(p) && p >= 1) {
                        idObj.p = p;
                        idObj.id = `video/${bvid}?p=${p}`;
                    }
                }
                idObj.url = "https://www.bilibili.com/" + idObj.id;
                return idObj;
            },
            async fetch(ctx, idObj) {
                const {bvid} = idObj;
                if (!bvid) throw new Error("Video fetch: no bvid");
                const res = await ctx.client.request({
                    url: "https://api.bilibili.com/x/web-interface/view",
                    params: {
                        bvid
                    },
                    desc: `获取视频信息 ${bvid}`
                });
                const videoView = res.data || {};
                return {
                    ...idObj,
                    video_view: videoView
                };
            },
            extract(data) {
                const info = {};
                const videoView = data?.video_view;
                if (videoView) {
                    const bvid = videoView.bvid || data.bvid;
                    Object.assign(info, {
                        id: `video/${bvid}`,
                        aid: videoView.aid,
                        cid: videoView.cid,
                        oid: videoView.aid,
                        bvid,
                        type: 1,
                        duration: videoView.duration,
                        title: videoView.title,
                        desc: videoView.desc,
                        cover: videoView.pic,
                        pubtime: videoView.pubdate,
                        owner: {
                            mid: videoView.owner?.mid,
                            name: videoView.owner?.name,
                            face: videoView.owner?.face
                        },
                        stat: {
                            view: videoView.stat?.view,
                            like: videoView.stat?.like,
                            coin: videoView.stat?.coin,
                            favorite: videoView.stat?.favorite,
                            share: videoView.stat?.share,
                            danmaku: videoView.stat?.danmaku,
                            reply: videoView.stat?.reply
                        }
                    });
                    if (videoView.staff) {
                        info.staff = [];
                        videoView.staff.forEach(stf => {
                            info.staff.push({
                                mid: stf.mid,
                                name: stf.name,
                                face: stf.face,
                                role: stf.title
                            });
                        });
                    }
                    const pages = videoView.pages;
                    if (Array.isArray(pages)) {
                        let p = data.p ? data.p - 1 : 0;
                        const page = pages[p];
                        if (p > 0) info.id = `video/${bvid}?p=${p + 1}`;
                        if (pages.length > 1) info.subtitle = `第 ${p + 1} P：${page?.part || ""}`;
                        if (page) {
                            info.cid = page.cid ?? info.cid;
                            info.duration = page.duration ?? info.duration;
                        }
                    }
                    info.cover = httptoHttps(info.cover);
                    info.owner.face = httptoHttps(info.owner.face);
                    info.url = "https://www.bilibili.com/" + info.id;
                }
                return info;
            },
            getCustomConfig(ctx, info) {
                //能获取被删视频是谁删的
                const {aid, bvid} = info;
                if (!bvid) throw new Error("no bvid");
                const params = {
                    bvid
                };
                if (aid) params.aid = aid;
                return ctx.client.request({
                    url: "https://api.bilibili.com/x/web-interface/archive/custom/config",
                    params,
                    desc: `获取稿件自定义配置 ${bvid}`
                });
            }
        };
 // ./src/handlers/bangumi.js
        // src/handlers/bangumi.js
                const bangumiHandler = {
            name: "bangumi",
            keys: [ "bangumi_season_view", "bangumi_episode_info" ],
            match(url) {
                return /(ep|ss)\d+/.test(url) && !/cheese/i.test(url);
            },
            parse(url) {
                const m = url.match(/(ep|ss)(\d+)/i);
                if (!m) throw new Error("Bangumi parse: no ep/ss");
                const kind = m[1].toLowerCase();
 // ep | ss
                                const num = parseInt(m[2], 10);
                const idKey = kind === "ss" ? "season_id" : "ep_id";
                return {
                    [idKey]: num,
                    id: `bangumi/play/${kind}${num}`,
                    url: `https://www.bilibili.com/bangumi/play/${kind}${num}`
                };
            },
            async fetch(ctx, idObj) {
                let {ep_id, season_id} = idObj;
                if (!ep_id && !season_id) throw new Error("Bangumi fetch: no ep_id or season_id");
                const seasonParams = ep_id ? {
                    ep_id
                } : {
                    season_id
                };
                const seasonRes = await ctx.client.request({
                    url: "https://api.bilibili.com/pgc/view/web/season",
                    params: seasonParams,
                    desc: `获取剧集明细 ${ep_id ? "ep" + ep_id : "ss" + season_id}`
                });
                const seasonView = seasonRes.result || {};
                if (!ep_id) {
                    if (seasonView?.user_status?.progress?.last_ep_id) {
                        ep_id = seasonView.user_status.progress.last_ep_id;
                        idObj.ep_id = ep_id;
                    }
                }
                if (ep_id) {
                    const episodeRes = await ctx.client.request({
                        url: "https://api.bilibili.com/pgc/season/episode/web/info",
                        params: {
                            ep_id
                        },
                        desc: `获取剧集信息 ${ep_id}`
                    });
                    const episodeInfo = episodeRes.data || {};
                    return {
                        ...idObj,
                        bangumi_season_view: seasonView,
                        bangumi_episode_info: episodeInfo
                    };
                } else {
                    return {
                        ...idObj,
                        bangumi_season_view: seasonView
                    };
                }
            },
            extract(data) {
                const info = {};
                const seasonView = data?.bangumi_season_view;
                if (seasonView) {
                    const season_id = seasonView.season_id || data.season_id;
                    Object.assign(info, {
                        id: `bangumi/play/ss${season_id}`,
                        season_id,
                        type: 1,
                        title: seasonView.season_title,
                        desc: seasonView.evaluate,
                        cover: seasonView.cover,
                        pubtime: Math.floor(Date.parse(seasonView.publish?.pub_time) / 1e3),
                        owner: {
                            mid: seasonView.up_info?.mid,
                            name: seasonView.up_info?.uname,
                            face: seasonView.up_info?.avatar
                        },
                        stat: {
                            view: seasonView.stat?.views,
                            like: seasonView.stat?.likes,
                            coin: seasonView.stat?.coins,
                            favorite: seasonView.stat?.favorites,
                            share: seasonView.stat?.share,
                            danmaku: seasonView.stat?.danmakus,
                            reply: seasonView.stat?.reply
                        }
                    });
                    const ep_id = data.bangumi_episode_info?.episode_id || data.ep_id;
                    if (ep_id) {
                        let ep = null;
                        let sectionTitle = null;
                        if (Array.isArray(seasonView.episodes)) {
                            ep = seasonView.episodes.find(e => e.ep_id === ep_id || e.id === ep_id);
                            if (ep) {
                                sectionTitle = "正片";
                            }
                        }
                        if (!ep && Array.isArray(seasonView.section)) {
                            for (const section of seasonView.section) {
                                ep = section.episodes?.find(e => e.ep_id === ep_id || e.id === ep_id);
                                if (ep) {
                                    sectionTitle = section.title;
                                    break;
                                }
                            }
                        }
                        if (!ep) throw new Error("Bangumi extract: ep not found");
                        Object.assign(info, {
                            id: `bangumi/play/ep${ep_id}`,
                            ep_id,
                            aid: ep.aid,
                            cid: ep.cid,
                            oid: ep.aid,
                            bvid: ep.bvid,
                            duration: Math.floor(ep.duration / 1e3),
                            subtitle: `${sectionTitle}：${ep.show_title}`,
                            cover: ep.cover,
                            pubtime: ep.pub_time
                        });
                        const episodeInfo = data.bangumi_episode_info;
                        if (episodeInfo) {
                            Object.assign(info, {
                                owner: {
                                    mid: episodeInfo.related_up?.[0]?.mid,
                                    name: episodeInfo.related_up?.[0]?.uname,
                                    face: episodeInfo.related_up?.[0]?.avatar
                                },
                                stat: {
                                    view: episodeInfo.stat.view,
                                    like: episodeInfo.stat.like,
                                    coin: episodeInfo.stat.coin,
                                    favorite: episodeInfo.stat.favorite,
                                    share: episodeInfo.stat.share,
                                    danmaku: episodeInfo.stat.dm,
                                    comment: episodeInfo.stat.reply
                                }
                            });
                            if (episodeInfo.related_up?.length > 1) {
                                info.staff = [];
                                episodeInfo.related_up.forEach(stf => {
                                    info.staff.push({
                                        mid: stf.mid,
                                        name: stf.uname,
                                        face: stf.avatar
                                    });
                                });
                            }
                        }
                    }
                    info.cover = httptoHttps(info.cover);
                    info.owner.face = httptoHttps(info.owner.face);
                    info.url = "https://www.bilibili.com/" + info.id;
                }
                return info;
            }
        };
 // ./src/handlers/dynamic.js
        // src/handlers/dynamic.js
                const dynamicHandler = {
            name: "dynamic",
            keys: [ "dynamic_detail" ],
            match(url) {
                if (/BV[a-zA-Z0-9]+/.test(url)) return false;
                if (/(ep|ss)\d+/i.test(url)) return false;
                return /(^|[^A-Za-z])\d+\b/.test(url);
            },
            parse(url) {
                const m = url.match(/(^|[^A-Za-z])(\d+)\b/);
                if (!m) throw new Error("Dynamic parse: no dynamic_id");
                const dynamic_id = m[2];
                return {
                    dynamic_id,
                    id: dynamic_id,
                    url: `https://t.bilibili.com/${dynamic_id}`
                };
            },
            async fetch(ctx, idObj) {
                const {dynamic_id} = idObj;
                if (!dynamic_id) throw new Error("Dynamic fetch: no dynamic_id");
                const dynamicRes = await ctx.client.request({
                    url: "https://api.bilibili.com/x/polymer/web-dynamic/v1/detail",
                    params: {
                        id: dynamic_id
                    },
                    desc: `获取动态 ${dynamic_id} 详情`
                });
                const dynamicDetail = dynamicRes.data || {};
                return {
                    ...idObj,
                    dynamic_detail: dynamicDetail
                };
            },
            extract(data) {
                const info = {};
                const dynamicItem = data?.dynamic_detail?.item;
                if (dynamicItem) {
                    const {comment_type, comment_id_str, rid_str} = dynamicItem.basic || {};
                    if (!comment_type || !comment_id_str) throw new Error("Dynamic extract: missing comment_type or comment_id_str");
                    Object.assign(info, {
                        id: dynamicItem.id_str,
                        oid: comment_id_str,
                        type: comment_type,
                        dynamic_type: dynamicItem.type
                    });
                    if (rid_str) {
                        info.rid = rid_str;
                    }
                    const {modules} = dynamicItem;
                    if (modules) {
                        Object.assign(info, {
                            pubtime: modules.module_author?.pub_ts,
                            owner: {
                                mid: modules.module_author?.mid,
                                name: modules.module_author?.name,
                                face: modules.module_author?.face
                            },
                            stat: {
                                like: modules.module_stat?.like?.count,
                                share: modules.module_stat?.forward?.count,
                                reply: modules.module_stat?.comment?.count
                            }
                        });
                        info.owner.face = httptoHttps(info.owner.face);
                    }
                    info.url = "https://t.bilibili.com/" + info.id;
                }
                return info;
            }
        };
 // ./src/handlers/cheese.js
        // src/handlers/cheese.js
                const cheeseHandler = {
            name: "cheese",
            keys: [ "cheese_season_view" ],
            match(url) {
                return /(ep|ss)\d+/.test(url) && !/bangumi/i.test(url);
            },
            parse(url) {
                const m = url.match(/(ep|ss)(\d+)/i);
                if (!m) throw new Error("Cheese parse: no ep/ss");
                const kind = m[1].toLowerCase();
                const num = parseInt(m[2], 10);
                const idKey = kind === "ss" ? "season_id" : "ep_id";
                return {
                    [idKey]: num,
                    id: `cheese/play/${kind}${num}`,
                    url: `https://www.bilibili.com/cheese/play/${kind}${num}`
                };
            },
            async fetch(ctx, idObj) {
                let {ep_id, season_id} = idObj;
                if (!ep_id && !season_id) throw new Error("Cheese fetch: no ep_id or season_id");
                const seasonParams = ep_id ? {
                    ep_id
                } : {
                    season_id
                };
                const seasonRes = await ctx.client.request({
                    url: "https://api.bilibili.com/pugv/view/web/season/v2",
                    params: seasonParams,
                    desc: `获取课程明细 ${ep_id ? "ep" + ep_id : "ss" + season_id}`
                });
                const seasonView = seasonRes.data || {};
                if (!ep_id) {
                    if (seasonView?.user_status?.progress?.last_ep_id) {
                        ep_id = seasonView.user_status.progress.last_ep_id;
                        idObj.ep_id = ep_id;
                    }
                }
                return {
                    ...idObj,
                    cheese_season_view: seasonView
                };
            },
            extract(data) {
                const info = {};
                const seasonView = data?.cheese_season_view;
                if (seasonView) {
                    const season_id = seasonView.season_id || data.season_id;
                    Object.assign(info, {
                        id: `cheese/play/ss${season_id}`,
                        season_id,
                        type: 33,
                        title: seasonView.title,
                        desc: seasonView.subtitle,
                        cover: seasonView.cover,
                        owner: {
                            mid: seasonView.up_info?.mid,
                            name: seasonView.up_info?.uname,
                            face: seasonView.up_info?.avatar
                        },
                        stat: {
                            view: seasonView.stat?.play,
                            favorite: seasonView.stat?.fav,
                            share: seasonView.stat?.share
                        }
                    });
                    if (seasonView.cooperators?.length > 0) {
                        info.staff = [];
                        seasonView.cooperators.forEach(stf => {
                            info.staff.push({
                                mid: stf.mid,
                                name: stf.nick_name,
                                face: stf.avatar,
                                role: stf.role
                            });
                        });
                    }
                    const ep_id = data.ep_id;
                    if (ep_id) {
                        let ep = null;
                        let sectionTitle = null;
                        if (Array.isArray(seasonView.sections)) {
                            for (const section of seasonView.sections) {
                                ep = section.episodes?.find(e => e.id === ep_id);
                                if (ep) {
                                    sectionTitle = section.title;
                                    break;
                                }
                            }
                        }
                        if (!ep) throw new Error("Cheese extract: ep not found");
                        Object.assign(info, {
                            id: `cheese/play/ep${ep_id}`,
                            ep_id,
                            aid: ep.aid,
                            cid: ep.cid,
                            oid: ep.id,
                            duration: ep.duration,
                            subtitle: `${sectionTitle}：${ep.title}`,
                            cover: ep.cover,
                            pubtime: ep.release_date
                        });
                        Object.assign(info.stat, {
                            view: ep.play
                        });
                    }
                    info.cover = httptoHttps(info.cover);
                    info.owner.face = httptoHttps(info.owner.face);
                    info.url = "https://www.bilibili.com/" + info.id;
                }
                return info;
            }
        };
 // ./src/handlers/handler.js
        // src/handlers/handler.js
                const handlerList = [ videoHandler, bangumiHandler, dynamicHandler, cheeseHandler ];
        const handler = {};
        for (const h of handlerList) {
            handler[h.name] = h;
        }
        // ./src/BiliArchive.js
        // src/BiliArchive.js
        class BiliArchive {
            constructor(ctx, handlers) {
                this.ctx = ctx;
                this.logger = ctx.logger || new Proxy({}, {
                    get: () => () => {}
                });
                this.handlers = [];
                handlers = Array.isArray(handlers) ? handlers : handlers ? [ handlers ] : handlerList;
                for (const h of handlers) {
                    if (typeof h === "string" && handler[h]) h = handler[h];
                    if (h && h.name) this.handlers.push(h);
                }
                this.info = {};
                this.data = {};
                this._handler = null;
            }
            static parseUrl(url, handlers) {
                handlers = handlers || [];
                const h = handlers.find(x => x.match(url));
                return h ? h.parse(url) : {};
            }
            _pickHandler(input) {
                let handler = null;
                if (typeof input === "object" && input !== null) {
                    handler = this.handlers.find(h => h.keys && Array.isArray(h.keys) && h.keys.some(key => Object.prototype.hasOwnProperty.call(input, key)));
                }
                if (!handler) {
                    const url = typeof input === "string" ? input : input?.url;
                    if (url) handler = this.handlers.find(h => h.match(url));
                }
                if (!handler) throw new Error("No handler matched");
                this._handler = handler;
            }
            clearData() {
                this.info = {};
                this.data = {};
                this._handler = null;
            }
            async getData(url) {
                try {
                    this.clearData();
                    this._pickHandler(url);
                    const idObj = this._handler.parse(url);
                    this.data = {
                        ...idObj
                    };
                    const raw = await this._handler.fetch(this.ctx, idObj);
                    this.data.fetchtime = Math.floor(Date.now() / 1e3);
                    Object.assign(this.data, raw);
                    this.info = this._handler.extract(this.data);
                    this.info.fetchtime = this.data.fetchtime;
                    return this.info;
                } catch (e) {
                    this.logger.error("BiliArchive getData error:", e);
                    return null;
                }
            }
            setData(data) {
                try {
                    this.clearData();
                    this._pickHandler(data);
                    Object.assign(this.data, data);
                    this.info = this._handler.extract(this.data);
                    return this.info;
                } catch (e) {
                    this.logger.error("BiliArchive setData error:", e);
                    return null;
                }
            }
        }
        // EXTERNAL MODULE: ./node_modules/protobufjs/minimal.js
                var minimal = __webpack_require__(946);
        // ./src/proto/dm.js
        /*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
        const $Reader = minimal.Reader, $util = minimal.util;
        const $root = minimal.roots["default"] || (minimal.roots["default"] = {});
        const bilibili = $root.bilibili = (() => {
            const bilibili = {};
            bilibili.community = function() {
                const community = {};
                community.service = function() {
                    const service = {};
                    service.dm = function() {
                        const dm = {};
                        dm.v1 = function() {
                            const v1 = {};
                            v1.DmSegMobileReply = function() {
                                function DmSegMobileReply(p) {
                                    this.elems = [];
                                    this.colorfulSrc = [];
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                DmSegMobileReply.prototype.elems = $util.emptyArray;
                                DmSegMobileReply.prototype.state = 0;
                                DmSegMobileReply.prototype.aiFlag = null;
                                DmSegMobileReply.prototype.colorfulSrc = $util.emptyArray;
                                DmSegMobileReply.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.DmSegMobileReply;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                if (!(m.elems && m.elems.length)) m.elems = [];
                                                m.elems.push($root.bilibili.community.service.dm.v1.DanmakuElem.decode(r, r.uint32()));
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.state = r.int32();
                                                break;
                                            }

                                          case 3:
                                            {
                                                m.aiFlag = $root.bilibili.community.service.dm.v1.DanmakuAIFlag.decode(r, r.uint32());
                                                break;
                                            }

                                          case 5:
                                            {
                                                if (!(m.colorfulSrc && m.colorfulSrc.length)) m.colorfulSrc = [];
                                                m.colorfulSrc.push($root.bilibili.community.service.dm.v1.DmColorful.decode(r, r.uint32()));
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                DmSegMobileReply.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.DmSegMobileReply) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.DmSegMobileReply;
                                    if (d.elems) {
                                        if (!Array.isArray(d.elems)) throw TypeError(".bilibili.community.service.dm.v1.DmSegMobileReply.elems: array expected");
                                        m.elems = [];
                                        for (var i = 0; i < d.elems.length; ++i) {
                                            if (typeof d.elems[i] !== "object") throw TypeError(".bilibili.community.service.dm.v1.DmSegMobileReply.elems: object expected");
                                            m.elems[i] = $root.bilibili.community.service.dm.v1.DanmakuElem.fromObject(d.elems[i]);
                                        }
                                    }
                                    if (d.state != null) {
                                        m.state = d.state | 0;
                                    }
                                    if (d.aiFlag != null) {
                                        if (typeof d.aiFlag !== "object") throw TypeError(".bilibili.community.service.dm.v1.DmSegMobileReply.aiFlag: object expected");
                                        m.aiFlag = $root.bilibili.community.service.dm.v1.DanmakuAIFlag.fromObject(d.aiFlag);
                                    }
                                    if (d.colorfulSrc) {
                                        if (!Array.isArray(d.colorfulSrc)) throw TypeError(".bilibili.community.service.dm.v1.DmSegMobileReply.colorfulSrc: array expected");
                                        m.colorfulSrc = [];
                                        for (var i = 0; i < d.colorfulSrc.length; ++i) {
                                            if (typeof d.colorfulSrc[i] !== "object") throw TypeError(".bilibili.community.service.dm.v1.DmSegMobileReply.colorfulSrc: object expected");
                                            m.colorfulSrc[i] = $root.bilibili.community.service.dm.v1.DmColorful.fromObject(d.colorfulSrc[i]);
                                        }
                                    }
                                    return m;
                                };
                                DmSegMobileReply.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.arrays || o.defaults) {
                                        d.elems = [];
                                        d.colorfulSrc = [];
                                    }
                                    if (o.defaults) {
                                        d.state = 0;
                                        d.aiFlag = null;
                                    }
                                    if (m.elems && m.elems.length) {
                                        d.elems = [];
                                        for (var j = 0; j < m.elems.length; ++j) {
                                            d.elems[j] = $root.bilibili.community.service.dm.v1.DanmakuElem.toObject(m.elems[j], o);
                                        }
                                    }
                                    if (m.state != null && m.hasOwnProperty("state")) {
                                        d.state = m.state;
                                    }
                                    if (m.aiFlag != null && m.hasOwnProperty("aiFlag")) {
                                        d.aiFlag = $root.bilibili.community.service.dm.v1.DanmakuAIFlag.toObject(m.aiFlag, o);
                                    }
                                    if (m.colorfulSrc && m.colorfulSrc.length) {
                                        d.colorfulSrc = [];
                                        for (var j = 0; j < m.colorfulSrc.length; ++j) {
                                            d.colorfulSrc[j] = $root.bilibili.community.service.dm.v1.DmColorful.toObject(m.colorfulSrc[j], o);
                                        }
                                    }
                                    return d;
                                };
                                DmSegMobileReply.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                DmSegMobileReply.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.DmSegMobileReply";
                                };
                                return DmSegMobileReply;
                            }();
                            v1.DmWebViewReply = function() {
                                function DmWebViewReply(p) {
                                    this.specialDms = [];
                                    this.commandDms = [];
                                    this.reportFilterContent = [];
                                    this.expressions = [];
                                    this.postPanel = [];
                                    this.activityMeta = [];
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                DmWebViewReply.prototype.state = 0;
                                DmWebViewReply.prototype.text = "";
                                DmWebViewReply.prototype.textSide = "";
                                DmWebViewReply.prototype.dmSge = null;
                                DmWebViewReply.prototype.flag = null;
                                DmWebViewReply.prototype.specialDms = $util.emptyArray;
                                DmWebViewReply.prototype.checkBox = false;
                                DmWebViewReply.prototype.count = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                DmWebViewReply.prototype.commandDms = $util.emptyArray;
                                DmWebViewReply.prototype.playerConfig = null;
                                DmWebViewReply.prototype.reportFilterContent = $util.emptyArray;
                                DmWebViewReply.prototype.expressions = $util.emptyArray;
                                DmWebViewReply.prototype.postPanel = $util.emptyArray;
                                DmWebViewReply.prototype.activityMeta = $util.emptyArray;
                                DmWebViewReply.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.DmWebViewReply;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                m.state = r.int32();
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.text = r.string();
                                                break;
                                            }

                                          case 3:
                                            {
                                                m.textSide = r.string();
                                                break;
                                            }

                                          case 4:
                                            {
                                                m.dmSge = $root.bilibili.community.service.dm.v1.DmSegConfig.decode(r, r.uint32());
                                                break;
                                            }

                                          case 5:
                                            {
                                                m.flag = $root.bilibili.community.service.dm.v1.DanmakuFlagConfig.decode(r, r.uint32());
                                                break;
                                            }

                                          case 6:
                                            {
                                                if (!(m.specialDms && m.specialDms.length)) m.specialDms = [];
                                                m.specialDms.push(r.string());
                                                break;
                                            }

                                          case 7:
                                            {
                                                m.checkBox = r.bool();
                                                break;
                                            }

                                          case 8:
                                            {
                                                m.count = r.int64();
                                                break;
                                            }

                                          case 9:
                                            {
                                                if (!(m.commandDms && m.commandDms.length)) m.commandDms = [];
                                                m.commandDms.push($root.bilibili.community.service.dm.v1.CommandDm.decode(r, r.uint32()));
                                                break;
                                            }

                                          case 10:
                                            {
                                                m.playerConfig = $root.bilibili.community.service.dm.v1.DanmuWebPlayerConfig.decode(r, r.uint32());
                                                break;
                                            }

                                          case 11:
                                            {
                                                if (!(m.reportFilterContent && m.reportFilterContent.length)) m.reportFilterContent = [];
                                                m.reportFilterContent.push(r.string());
                                                break;
                                            }

                                          case 12:
                                            {
                                                if (!(m.expressions && m.expressions.length)) m.expressions = [];
                                                m.expressions.push($root.bilibili.community.service.dm.v1.Expressions.decode(r, r.uint32()));
                                                break;
                                            }

                                          case 13:
                                            {
                                                if (!(m.postPanel && m.postPanel.length)) m.postPanel = [];
                                                m.postPanel.push($root.bilibili.community.service.dm.v1.PostPanel.decode(r, r.uint32()));
                                                break;
                                            }

                                          case 14:
                                            {
                                                if (!(m.activityMeta && m.activityMeta.length)) m.activityMeta = [];
                                                m.activityMeta.push(r.string());
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                DmWebViewReply.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.DmWebViewReply) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.DmWebViewReply;
                                    if (d.state != null) {
                                        m.state = d.state | 0;
                                    }
                                    if (d.text != null) {
                                        m.text = String(d.text);
                                    }
                                    if (d.textSide != null) {
                                        m.textSide = String(d.textSide);
                                    }
                                    if (d.dmSge != null) {
                                        if (typeof d.dmSge !== "object") throw TypeError(".bilibili.community.service.dm.v1.DmWebViewReply.dmSge: object expected");
                                        m.dmSge = $root.bilibili.community.service.dm.v1.DmSegConfig.fromObject(d.dmSge);
                                    }
                                    if (d.flag != null) {
                                        if (typeof d.flag !== "object") throw TypeError(".bilibili.community.service.dm.v1.DmWebViewReply.flag: object expected");
                                        m.flag = $root.bilibili.community.service.dm.v1.DanmakuFlagConfig.fromObject(d.flag);
                                    }
                                    if (d.specialDms) {
                                        if (!Array.isArray(d.specialDms)) throw TypeError(".bilibili.community.service.dm.v1.DmWebViewReply.specialDms: array expected");
                                        m.specialDms = [];
                                        for (var i = 0; i < d.specialDms.length; ++i) {
                                            m.specialDms[i] = String(d.specialDms[i]);
                                        }
                                    }
                                    if (d.checkBox != null) {
                                        m.checkBox = Boolean(d.checkBox);
                                    }
                                    if (d.count != null) {
                                        if ($util.Long) (m.count = $util.Long.fromValue(d.count)).unsigned = false; else if (typeof d.count === "string") m.count = parseInt(d.count, 10); else if (typeof d.count === "number") m.count = d.count; else if (typeof d.count === "object") m.count = new $util.LongBits(d.count.low >>> 0, d.count.high >>> 0).toNumber();
                                    }
                                    if (d.commandDms) {
                                        if (!Array.isArray(d.commandDms)) throw TypeError(".bilibili.community.service.dm.v1.DmWebViewReply.commandDms: array expected");
                                        m.commandDms = [];
                                        for (var i = 0; i < d.commandDms.length; ++i) {
                                            if (typeof d.commandDms[i] !== "object") throw TypeError(".bilibili.community.service.dm.v1.DmWebViewReply.commandDms: object expected");
                                            m.commandDms[i] = $root.bilibili.community.service.dm.v1.CommandDm.fromObject(d.commandDms[i]);
                                        }
                                    }
                                    if (d.playerConfig != null) {
                                        if (typeof d.playerConfig !== "object") throw TypeError(".bilibili.community.service.dm.v1.DmWebViewReply.playerConfig: object expected");
                                        m.playerConfig = $root.bilibili.community.service.dm.v1.DanmuWebPlayerConfig.fromObject(d.playerConfig);
                                    }
                                    if (d.reportFilterContent) {
                                        if (!Array.isArray(d.reportFilterContent)) throw TypeError(".bilibili.community.service.dm.v1.DmWebViewReply.reportFilterContent: array expected");
                                        m.reportFilterContent = [];
                                        for (var i = 0; i < d.reportFilterContent.length; ++i) {
                                            m.reportFilterContent[i] = String(d.reportFilterContent[i]);
                                        }
                                    }
                                    if (d.expressions) {
                                        if (!Array.isArray(d.expressions)) throw TypeError(".bilibili.community.service.dm.v1.DmWebViewReply.expressions: array expected");
                                        m.expressions = [];
                                        for (var i = 0; i < d.expressions.length; ++i) {
                                            if (typeof d.expressions[i] !== "object") throw TypeError(".bilibili.community.service.dm.v1.DmWebViewReply.expressions: object expected");
                                            m.expressions[i] = $root.bilibili.community.service.dm.v1.Expressions.fromObject(d.expressions[i]);
                                        }
                                    }
                                    if (d.postPanel) {
                                        if (!Array.isArray(d.postPanel)) throw TypeError(".bilibili.community.service.dm.v1.DmWebViewReply.postPanel: array expected");
                                        m.postPanel = [];
                                        for (var i = 0; i < d.postPanel.length; ++i) {
                                            if (typeof d.postPanel[i] !== "object") throw TypeError(".bilibili.community.service.dm.v1.DmWebViewReply.postPanel: object expected");
                                            m.postPanel[i] = $root.bilibili.community.service.dm.v1.PostPanel.fromObject(d.postPanel[i]);
                                        }
                                    }
                                    if (d.activityMeta) {
                                        if (!Array.isArray(d.activityMeta)) throw TypeError(".bilibili.community.service.dm.v1.DmWebViewReply.activityMeta: array expected");
                                        m.activityMeta = [];
                                        for (var i = 0; i < d.activityMeta.length; ++i) {
                                            m.activityMeta[i] = String(d.activityMeta[i]);
                                        }
                                    }
                                    return m;
                                };
                                DmWebViewReply.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.arrays || o.defaults) {
                                        d.specialDms = [];
                                        d.commandDms = [];
                                        d.reportFilterContent = [];
                                        d.expressions = [];
                                        d.postPanel = [];
                                        d.activityMeta = [];
                                    }
                                    if (o.defaults) {
                                        d.state = 0;
                                        d.text = "";
                                        d.textSide = "";
                                        d.dmSge = null;
                                        d.flag = null;
                                        d.checkBox = false;
                                        if ($util.Long) {
                                            var n = new $util.Long(0, 0, false);
                                            d.count = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                        } else d.count = o.longs === String ? "0" : 0;
                                        d.playerConfig = null;
                                    }
                                    if (m.state != null && m.hasOwnProperty("state")) {
                                        d.state = m.state;
                                    }
                                    if (m.text != null && m.hasOwnProperty("text")) {
                                        d.text = m.text;
                                    }
                                    if (m.textSide != null && m.hasOwnProperty("textSide")) {
                                        d.textSide = m.textSide;
                                    }
                                    if (m.dmSge != null && m.hasOwnProperty("dmSge")) {
                                        d.dmSge = $root.bilibili.community.service.dm.v1.DmSegConfig.toObject(m.dmSge, o);
                                    }
                                    if (m.flag != null && m.hasOwnProperty("flag")) {
                                        d.flag = $root.bilibili.community.service.dm.v1.DanmakuFlagConfig.toObject(m.flag, o);
                                    }
                                    if (m.specialDms && m.specialDms.length) {
                                        d.specialDms = [];
                                        for (var j = 0; j < m.specialDms.length; ++j) {
                                            d.specialDms[j] = m.specialDms[j];
                                        }
                                    }
                                    if (m.checkBox != null && m.hasOwnProperty("checkBox")) {
                                        d.checkBox = m.checkBox;
                                    }
                                    if (m.count != null && m.hasOwnProperty("count")) {
                                        if (typeof m.count === "number") d.count = o.longs === String ? String(m.count) : m.count; else d.count = o.longs === String ? $util.Long.prototype.toString.call(m.count) : o.longs === Number ? new $util.LongBits(m.count.low >>> 0, m.count.high >>> 0).toNumber() : m.count;
                                    }
                                    if (m.commandDms && m.commandDms.length) {
                                        d.commandDms = [];
                                        for (var j = 0; j < m.commandDms.length; ++j) {
                                            d.commandDms[j] = $root.bilibili.community.service.dm.v1.CommandDm.toObject(m.commandDms[j], o);
                                        }
                                    }
                                    if (m.playerConfig != null && m.hasOwnProperty("playerConfig")) {
                                        d.playerConfig = $root.bilibili.community.service.dm.v1.DanmuWebPlayerConfig.toObject(m.playerConfig, o);
                                    }
                                    if (m.reportFilterContent && m.reportFilterContent.length) {
                                        d.reportFilterContent = [];
                                        for (var j = 0; j < m.reportFilterContent.length; ++j) {
                                            d.reportFilterContent[j] = m.reportFilterContent[j];
                                        }
                                    }
                                    if (m.expressions && m.expressions.length) {
                                        d.expressions = [];
                                        for (var j = 0; j < m.expressions.length; ++j) {
                                            d.expressions[j] = $root.bilibili.community.service.dm.v1.Expressions.toObject(m.expressions[j], o);
                                        }
                                    }
                                    if (m.postPanel && m.postPanel.length) {
                                        d.postPanel = [];
                                        for (var j = 0; j < m.postPanel.length; ++j) {
                                            d.postPanel[j] = $root.bilibili.community.service.dm.v1.PostPanel.toObject(m.postPanel[j], o);
                                        }
                                    }
                                    if (m.activityMeta && m.activityMeta.length) {
                                        d.activityMeta = [];
                                        for (var j = 0; j < m.activityMeta.length; ++j) {
                                            d.activityMeta[j] = m.activityMeta[j];
                                        }
                                    }
                                    return d;
                                };
                                DmWebViewReply.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                DmWebViewReply.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.DmWebViewReply";
                                };
                                return DmWebViewReply;
                            }();
                            v1.DanmakuElem = function() {
                                function DanmakuElem(p) {
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                DanmakuElem.prototype.id = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                DanmakuElem.prototype.progress = 0;
                                DanmakuElem.prototype.mode = 0;
                                DanmakuElem.prototype.fontsize = 0;
                                DanmakuElem.prototype.color = 0;
                                DanmakuElem.prototype.midHash = "";
                                DanmakuElem.prototype.content = "";
                                DanmakuElem.prototype.ctime = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                DanmakuElem.prototype.weight = 0;
                                DanmakuElem.prototype.action = "";
                                DanmakuElem.prototype.pool = 0;
                                DanmakuElem.prototype.idStr = "";
                                DanmakuElem.prototype.attr = 0;
                                DanmakuElem.prototype.animation = "";
                                DanmakuElem.prototype.colorful = 0;
                                DanmakuElem.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.DanmakuElem;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                m.id = r.int64();
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.progress = r.int32();
                                                break;
                                            }

                                          case 3:
                                            {
                                                m.mode = r.int32();
                                                break;
                                            }

                                          case 4:
                                            {
                                                m.fontsize = r.int32();
                                                break;
                                            }

                                          case 5:
                                            {
                                                m.color = r.uint32();
                                                break;
                                            }

                                          case 6:
                                            {
                                                m.midHash = r.string();
                                                break;
                                            }

                                          case 7:
                                            {
                                                m.content = r.string();
                                                break;
                                            }

                                          case 8:
                                            {
                                                m.ctime = r.int64();
                                                break;
                                            }

                                          case 9:
                                            {
                                                m.weight = r.int32();
                                                break;
                                            }

                                          case 10:
                                            {
                                                m.action = r.string();
                                                break;
                                            }

                                          case 11:
                                            {
                                                m.pool = r.int32();
                                                break;
                                            }

                                          case 12:
                                            {
                                                m.idStr = r.string();
                                                break;
                                            }

                                          case 13:
                                            {
                                                m.attr = r.int32();
                                                break;
                                            }

                                          case 22:
                                            {
                                                m.animation = r.string();
                                                break;
                                            }

                                          case 24:
                                            {
                                                m.colorful = r.int32();
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                DanmakuElem.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.DanmakuElem) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.DanmakuElem;
                                    if (d.id != null) {
                                        if ($util.Long) (m.id = $util.Long.fromValue(d.id)).unsigned = false; else if (typeof d.id === "string") m.id = parseInt(d.id, 10); else if (typeof d.id === "number") m.id = d.id; else if (typeof d.id === "object") m.id = new $util.LongBits(d.id.low >>> 0, d.id.high >>> 0).toNumber();
                                    }
                                    if (d.progress != null) {
                                        m.progress = d.progress | 0;
                                    }
                                    if (d.mode != null) {
                                        m.mode = d.mode | 0;
                                    }
                                    if (d.fontsize != null) {
                                        m.fontsize = d.fontsize | 0;
                                    }
                                    if (d.color != null) {
                                        m.color = d.color >>> 0;
                                    }
                                    if (d.midHash != null) {
                                        m.midHash = String(d.midHash);
                                    }
                                    if (d.content != null) {
                                        m.content = String(d.content);
                                    }
                                    if (d.ctime != null) {
                                        if ($util.Long) (m.ctime = $util.Long.fromValue(d.ctime)).unsigned = false; else if (typeof d.ctime === "string") m.ctime = parseInt(d.ctime, 10); else if (typeof d.ctime === "number") m.ctime = d.ctime; else if (typeof d.ctime === "object") m.ctime = new $util.LongBits(d.ctime.low >>> 0, d.ctime.high >>> 0).toNumber();
                                    }
                                    if (d.weight != null) {
                                        m.weight = d.weight | 0;
                                    }
                                    if (d.action != null) {
                                        m.action = String(d.action);
                                    }
                                    if (d.pool != null) {
                                        m.pool = d.pool | 0;
                                    }
                                    if (d.idStr != null) {
                                        m.idStr = String(d.idStr);
                                    }
                                    if (d.attr != null) {
                                        m.attr = d.attr | 0;
                                    }
                                    if (d.animation != null) {
                                        m.animation = String(d.animation);
                                    }
                                    switch (d.colorful) {
                                      default:
                                        if (typeof d.colorful === "number") {
                                            m.colorful = d.colorful;
                                            break;
                                        }
                                        break;

                                      case "NoneType":
                                      case 0:
                                        m.colorful = 0;
                                        break;

                                      case "VipGradualColor":
                                      case 60001:
                                        m.colorful = 60001;
                                        break;
                                    }
                                    return m;
                                };
                                DanmakuElem.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        if ($util.Long) {
                                            var n = new $util.Long(0, 0, false);
                                            d.id = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                        } else d.id = o.longs === String ? "0" : 0;
                                        d.progress = 0;
                                        d.mode = 0;
                                        d.fontsize = 0;
                                        d.color = 0;
                                        d.midHash = "";
                                        d.content = "";
                                        if ($util.Long) {
                                            var n = new $util.Long(0, 0, false);
                                            d.ctime = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                        } else d.ctime = o.longs === String ? "0" : 0;
                                        d.weight = 0;
                                        d.action = "";
                                        d.pool = 0;
                                        d.idStr = "";
                                        d.attr = 0;
                                        d.animation = "";
                                        d.colorful = o.enums === String ? "NoneType" : 0;
                                    }
                                    if (m.id != null && m.hasOwnProperty("id")) {
                                        if (typeof m.id === "number") d.id = o.longs === String ? String(m.id) : m.id; else d.id = o.longs === String ? $util.Long.prototype.toString.call(m.id) : o.longs === Number ? new $util.LongBits(m.id.low >>> 0, m.id.high >>> 0).toNumber() : m.id;
                                    }
                                    if (m.progress != null && m.hasOwnProperty("progress")) {
                                        d.progress = m.progress;
                                    }
                                    if (m.mode != null && m.hasOwnProperty("mode")) {
                                        d.mode = m.mode;
                                    }
                                    if (m.fontsize != null && m.hasOwnProperty("fontsize")) {
                                        d.fontsize = m.fontsize;
                                    }
                                    if (m.color != null && m.hasOwnProperty("color")) {
                                        d.color = m.color;
                                    }
                                    if (m.midHash != null && m.hasOwnProperty("midHash")) {
                                        d.midHash = m.midHash;
                                    }
                                    if (m.content != null && m.hasOwnProperty("content")) {
                                        d.content = m.content;
                                    }
                                    if (m.ctime != null && m.hasOwnProperty("ctime")) {
                                        if (typeof m.ctime === "number") d.ctime = o.longs === String ? String(m.ctime) : m.ctime; else d.ctime = o.longs === String ? $util.Long.prototype.toString.call(m.ctime) : o.longs === Number ? new $util.LongBits(m.ctime.low >>> 0, m.ctime.high >>> 0).toNumber() : m.ctime;
                                    }
                                    if (m.weight != null && m.hasOwnProperty("weight")) {
                                        d.weight = m.weight;
                                    }
                                    if (m.action != null && m.hasOwnProperty("action")) {
                                        d.action = m.action;
                                    }
                                    if (m.pool != null && m.hasOwnProperty("pool")) {
                                        d.pool = m.pool;
                                    }
                                    if (m.idStr != null && m.hasOwnProperty("idStr")) {
                                        d.idStr = m.idStr;
                                    }
                                    if (m.attr != null && m.hasOwnProperty("attr")) {
                                        d.attr = m.attr;
                                    }
                                    if (m.animation != null && m.hasOwnProperty("animation")) {
                                        d.animation = m.animation;
                                    }
                                    if (m.colorful != null && m.hasOwnProperty("colorful")) {
                                        d.colorful = o.enums === String ? $root.bilibili.community.service.dm.v1.DmColorfulType[m.colorful] === undefined ? m.colorful : $root.bilibili.community.service.dm.v1.DmColorfulType[m.colorful] : m.colorful;
                                    }
                                    return d;
                                };
                                DanmakuElem.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                DanmakuElem.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.DanmakuElem";
                                };
                                return DanmakuElem;
                            }();
                            v1.DanmakuAIFlag = function() {
                                function DanmakuAIFlag(p) {
                                    this.dmFlags = [];
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                DanmakuAIFlag.prototype.dmFlags = $util.emptyArray;
                                DanmakuAIFlag.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.DanmakuAIFlag;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                if (!(m.dmFlags && m.dmFlags.length)) m.dmFlags = [];
                                                m.dmFlags.push($root.bilibili.community.service.dm.v1.DanmakuFlag.decode(r, r.uint32()));
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                DanmakuAIFlag.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.DanmakuAIFlag) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.DanmakuAIFlag;
                                    if (d.dmFlags) {
                                        if (!Array.isArray(d.dmFlags)) throw TypeError(".bilibili.community.service.dm.v1.DanmakuAIFlag.dmFlags: array expected");
                                        m.dmFlags = [];
                                        for (var i = 0; i < d.dmFlags.length; ++i) {
                                            if (typeof d.dmFlags[i] !== "object") throw TypeError(".bilibili.community.service.dm.v1.DanmakuAIFlag.dmFlags: object expected");
                                            m.dmFlags[i] = $root.bilibili.community.service.dm.v1.DanmakuFlag.fromObject(d.dmFlags[i]);
                                        }
                                    }
                                    return m;
                                };
                                DanmakuAIFlag.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.arrays || o.defaults) {
                                        d.dmFlags = [];
                                    }
                                    if (m.dmFlags && m.dmFlags.length) {
                                        d.dmFlags = [];
                                        for (var j = 0; j < m.dmFlags.length; ++j) {
                                            d.dmFlags[j] = $root.bilibili.community.service.dm.v1.DanmakuFlag.toObject(m.dmFlags[j], o);
                                        }
                                    }
                                    return d;
                                };
                                DanmakuAIFlag.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                DanmakuAIFlag.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.DanmakuAIFlag";
                                };
                                return DanmakuAIFlag;
                            }();
                            v1.DmColorful = function() {
                                function DmColorful(p) {
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                DmColorful.prototype.type = 0;
                                DmColorful.prototype.src = "";
                                DmColorful.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.DmColorful;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                m.type = r.int32();
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.src = r.string();
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                DmColorful.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.DmColorful) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.DmColorful;
                                    switch (d.type) {
                                      default:
                                        if (typeof d.type === "number") {
                                            m.type = d.type;
                                            break;
                                        }
                                        break;

                                      case "NoneType":
                                      case 0:
                                        m.type = 0;
                                        break;

                                      case "VipGradualColor":
                                      case 60001:
                                        m.type = 60001;
                                        break;
                                    }
                                    if (d.src != null) {
                                        m.src = String(d.src);
                                    }
                                    return m;
                                };
                                DmColorful.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        d.type = o.enums === String ? "NoneType" : 0;
                                        d.src = "";
                                    }
                                    if (m.type != null && m.hasOwnProperty("type")) {
                                        d.type = o.enums === String ? $root.bilibili.community.service.dm.v1.DmColorfulType[m.type] === undefined ? m.type : $root.bilibili.community.service.dm.v1.DmColorfulType[m.type] : m.type;
                                    }
                                    if (m.src != null && m.hasOwnProperty("src")) {
                                        d.src = m.src;
                                    }
                                    return d;
                                };
                                DmColorful.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                DmColorful.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.DmColorful";
                                };
                                return DmColorful;
                            }();
                            v1.DmSegConfig = function() {
                                function DmSegConfig(p) {
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                DmSegConfig.prototype.pageSize = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                DmSegConfig.prototype.total = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                DmSegConfig.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.DmSegConfig;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                m.pageSize = r.int64();
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.total = r.int64();
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                DmSegConfig.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.DmSegConfig) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.DmSegConfig;
                                    if (d.pageSize != null) {
                                        if ($util.Long) (m.pageSize = $util.Long.fromValue(d.pageSize)).unsigned = false; else if (typeof d.pageSize === "string") m.pageSize = parseInt(d.pageSize, 10); else if (typeof d.pageSize === "number") m.pageSize = d.pageSize; else if (typeof d.pageSize === "object") m.pageSize = new $util.LongBits(d.pageSize.low >>> 0, d.pageSize.high >>> 0).toNumber();
                                    }
                                    if (d.total != null) {
                                        if ($util.Long) (m.total = $util.Long.fromValue(d.total)).unsigned = false; else if (typeof d.total === "string") m.total = parseInt(d.total, 10); else if (typeof d.total === "number") m.total = d.total; else if (typeof d.total === "object") m.total = new $util.LongBits(d.total.low >>> 0, d.total.high >>> 0).toNumber();
                                    }
                                    return m;
                                };
                                DmSegConfig.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        if ($util.Long) {
                                            var n = new $util.Long(0, 0, false);
                                            d.pageSize = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                        } else d.pageSize = o.longs === String ? "0" : 0;
                                        if ($util.Long) {
                                            var n = new $util.Long(0, 0, false);
                                            d.total = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                        } else d.total = o.longs === String ? "0" : 0;
                                    }
                                    if (m.pageSize != null && m.hasOwnProperty("pageSize")) {
                                        if (typeof m.pageSize === "number") d.pageSize = o.longs === String ? String(m.pageSize) : m.pageSize; else d.pageSize = o.longs === String ? $util.Long.prototype.toString.call(m.pageSize) : o.longs === Number ? new $util.LongBits(m.pageSize.low >>> 0, m.pageSize.high >>> 0).toNumber() : m.pageSize;
                                    }
                                    if (m.total != null && m.hasOwnProperty("total")) {
                                        if (typeof m.total === "number") d.total = o.longs === String ? String(m.total) : m.total; else d.total = o.longs === String ? $util.Long.prototype.toString.call(m.total) : o.longs === Number ? new $util.LongBits(m.total.low >>> 0, m.total.high >>> 0).toNumber() : m.total;
                                    }
                                    return d;
                                };
                                DmSegConfig.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                DmSegConfig.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.DmSegConfig";
                                };
                                return DmSegConfig;
                            }();
                            v1.DanmakuFlagConfig = function() {
                                function DanmakuFlagConfig(p) {
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                DanmakuFlagConfig.prototype.recFlag = 0;
                                DanmakuFlagConfig.prototype.recText = "";
                                DanmakuFlagConfig.prototype.recSwitch = 0;
                                DanmakuFlagConfig.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.DanmakuFlagConfig;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                m.recFlag = r.int32();
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.recText = r.string();
                                                break;
                                            }

                                          case 3:
                                            {
                                                m.recSwitch = r.int32();
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                DanmakuFlagConfig.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.DanmakuFlagConfig) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.DanmakuFlagConfig;
                                    if (d.recFlag != null) {
                                        m.recFlag = d.recFlag | 0;
                                    }
                                    if (d.recText != null) {
                                        m.recText = String(d.recText);
                                    }
                                    if (d.recSwitch != null) {
                                        m.recSwitch = d.recSwitch | 0;
                                    }
                                    return m;
                                };
                                DanmakuFlagConfig.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        d.recFlag = 0;
                                        d.recText = "";
                                        d.recSwitch = 0;
                                    }
                                    if (m.recFlag != null && m.hasOwnProperty("recFlag")) {
                                        d.recFlag = m.recFlag;
                                    }
                                    if (m.recText != null && m.hasOwnProperty("recText")) {
                                        d.recText = m.recText;
                                    }
                                    if (m.recSwitch != null && m.hasOwnProperty("recSwitch")) {
                                        d.recSwitch = m.recSwitch;
                                    }
                                    return d;
                                };
                                DanmakuFlagConfig.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                DanmakuFlagConfig.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.DanmakuFlagConfig";
                                };
                                return DanmakuFlagConfig;
                            }();
                            v1.CommandDm = function() {
                                function CommandDm(p) {
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                CommandDm.prototype.id = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                CommandDm.prototype.oid = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                CommandDm.prototype.mid = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                CommandDm.prototype.command = "";
                                CommandDm.prototype.content = "";
                                CommandDm.prototype.progress = 0;
                                CommandDm.prototype.ctime = "";
                                CommandDm.prototype.mtime = "";
                                CommandDm.prototype.extra = "";
                                CommandDm.prototype.idStr = "";
                                CommandDm.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.CommandDm;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                m.id = r.int64();
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.oid = r.int64();
                                                break;
                                            }

                                          case 3:
                                            {
                                                m.mid = r.int64();
                                                break;
                                            }

                                          case 4:
                                            {
                                                m.command = r.string();
                                                break;
                                            }

                                          case 5:
                                            {
                                                m.content = r.string();
                                                break;
                                            }

                                          case 6:
                                            {
                                                m.progress = r.int32();
                                                break;
                                            }

                                          case 7:
                                            {
                                                m.ctime = r.string();
                                                break;
                                            }

                                          case 8:
                                            {
                                                m.mtime = r.string();
                                                break;
                                            }

                                          case 9:
                                            {
                                                m.extra = r.string();
                                                break;
                                            }

                                          case 10:
                                            {
                                                m.idStr = r.string();
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                CommandDm.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.CommandDm) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.CommandDm;
                                    if (d.id != null) {
                                        if ($util.Long) (m.id = $util.Long.fromValue(d.id)).unsigned = false; else if (typeof d.id === "string") m.id = parseInt(d.id, 10); else if (typeof d.id === "number") m.id = d.id; else if (typeof d.id === "object") m.id = new $util.LongBits(d.id.low >>> 0, d.id.high >>> 0).toNumber();
                                    }
                                    if (d.oid != null) {
                                        if ($util.Long) (m.oid = $util.Long.fromValue(d.oid)).unsigned = false; else if (typeof d.oid === "string") m.oid = parseInt(d.oid, 10); else if (typeof d.oid === "number") m.oid = d.oid; else if (typeof d.oid === "object") m.oid = new $util.LongBits(d.oid.low >>> 0, d.oid.high >>> 0).toNumber();
                                    }
                                    if (d.mid != null) {
                                        if ($util.Long) (m.mid = $util.Long.fromValue(d.mid)).unsigned = false; else if (typeof d.mid === "string") m.mid = parseInt(d.mid, 10); else if (typeof d.mid === "number") m.mid = d.mid; else if (typeof d.mid === "object") m.mid = new $util.LongBits(d.mid.low >>> 0, d.mid.high >>> 0).toNumber();
                                    }
                                    if (d.command != null) {
                                        m.command = String(d.command);
                                    }
                                    if (d.content != null) {
                                        m.content = String(d.content);
                                    }
                                    if (d.progress != null) {
                                        m.progress = d.progress | 0;
                                    }
                                    if (d.ctime != null) {
                                        m.ctime = String(d.ctime);
                                    }
                                    if (d.mtime != null) {
                                        m.mtime = String(d.mtime);
                                    }
                                    if (d.extra != null) {
                                        m.extra = String(d.extra);
                                    }
                                    if (d.idStr != null) {
                                        m.idStr = String(d.idStr);
                                    }
                                    return m;
                                };
                                CommandDm.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        if ($util.Long) {
                                            var n = new $util.Long(0, 0, false);
                                            d.id = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                        } else d.id = o.longs === String ? "0" : 0;
                                        if ($util.Long) {
                                            var n = new $util.Long(0, 0, false);
                                            d.oid = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                        } else d.oid = o.longs === String ? "0" : 0;
                                        if ($util.Long) {
                                            var n = new $util.Long(0, 0, false);
                                            d.mid = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                        } else d.mid = o.longs === String ? "0" : 0;
                                        d.command = "";
                                        d.content = "";
                                        d.progress = 0;
                                        d.ctime = "";
                                        d.mtime = "";
                                        d.extra = "";
                                        d.idStr = "";
                                    }
                                    if (m.id != null && m.hasOwnProperty("id")) {
                                        if (typeof m.id === "number") d.id = o.longs === String ? String(m.id) : m.id; else d.id = o.longs === String ? $util.Long.prototype.toString.call(m.id) : o.longs === Number ? new $util.LongBits(m.id.low >>> 0, m.id.high >>> 0).toNumber() : m.id;
                                    }
                                    if (m.oid != null && m.hasOwnProperty("oid")) {
                                        if (typeof m.oid === "number") d.oid = o.longs === String ? String(m.oid) : m.oid; else d.oid = o.longs === String ? $util.Long.prototype.toString.call(m.oid) : o.longs === Number ? new $util.LongBits(m.oid.low >>> 0, m.oid.high >>> 0).toNumber() : m.oid;
                                    }
                                    if (m.mid != null && m.hasOwnProperty("mid")) {
                                        if (typeof m.mid === "number") d.mid = o.longs === String ? String(m.mid) : m.mid; else d.mid = o.longs === String ? $util.Long.prototype.toString.call(m.mid) : o.longs === Number ? new $util.LongBits(m.mid.low >>> 0, m.mid.high >>> 0).toNumber() : m.mid;
                                    }
                                    if (m.command != null && m.hasOwnProperty("command")) {
                                        d.command = m.command;
                                    }
                                    if (m.content != null && m.hasOwnProperty("content")) {
                                        d.content = m.content;
                                    }
                                    if (m.progress != null && m.hasOwnProperty("progress")) {
                                        d.progress = m.progress;
                                    }
                                    if (m.ctime != null && m.hasOwnProperty("ctime")) {
                                        d.ctime = m.ctime;
                                    }
                                    if (m.mtime != null && m.hasOwnProperty("mtime")) {
                                        d.mtime = m.mtime;
                                    }
                                    if (m.extra != null && m.hasOwnProperty("extra")) {
                                        d.extra = m.extra;
                                    }
                                    if (m.idStr != null && m.hasOwnProperty("idStr")) {
                                        d.idStr = m.idStr;
                                    }
                                    return d;
                                };
                                CommandDm.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                CommandDm.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.CommandDm";
                                };
                                return CommandDm;
                            }();
                            v1.DanmuWebPlayerConfig = function() {
                                function DanmuWebPlayerConfig(p) {
                                    this.aiLevelV2Map = {};
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                DanmuWebPlayerConfig.prototype.dmSwitch = false;
                                DanmuWebPlayerConfig.prototype.aiSwitch = false;
                                DanmuWebPlayerConfig.prototype.aiLevel = 0;
                                DanmuWebPlayerConfig.prototype.blocktop = false;
                                DanmuWebPlayerConfig.prototype.blockscroll = false;
                                DanmuWebPlayerConfig.prototype.blockbottom = false;
                                DanmuWebPlayerConfig.prototype.blockcolor = false;
                                DanmuWebPlayerConfig.prototype.blockspecial = false;
                                DanmuWebPlayerConfig.prototype.preventshade = false;
                                DanmuWebPlayerConfig.prototype.dmask = false;
                                DanmuWebPlayerConfig.prototype.opacity = 0;
                                DanmuWebPlayerConfig.prototype.dmarea = 0;
                                DanmuWebPlayerConfig.prototype.speedplus = 0;
                                DanmuWebPlayerConfig.prototype.fontsize = 0;
                                DanmuWebPlayerConfig.prototype.screensync = false;
                                DanmuWebPlayerConfig.prototype.speedsync = false;
                                DanmuWebPlayerConfig.prototype.fontfamily = "";
                                DanmuWebPlayerConfig.prototype.bold = false;
                                DanmuWebPlayerConfig.prototype.fontborder = 0;
                                DanmuWebPlayerConfig.prototype.drawType = "";
                                DanmuWebPlayerConfig.prototype.seniorModeSwitch = 0;
                                DanmuWebPlayerConfig.prototype.aiLevelV2 = 0;
                                DanmuWebPlayerConfig.prototype.aiLevelV2Map = $util.emptyObject;
                                DanmuWebPlayerConfig.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.DanmuWebPlayerConfig, k, value;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                m.dmSwitch = r.bool();
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.aiSwitch = r.bool();
                                                break;
                                            }

                                          case 3:
                                            {
                                                m.aiLevel = r.int32();
                                                break;
                                            }

                                          case 4:
                                            {
                                                m.blocktop = r.bool();
                                                break;
                                            }

                                          case 5:
                                            {
                                                m.blockscroll = r.bool();
                                                break;
                                            }

                                          case 6:
                                            {
                                                m.blockbottom = r.bool();
                                                break;
                                            }

                                          case 7:
                                            {
                                                m.blockcolor = r.bool();
                                                break;
                                            }

                                          case 8:
                                            {
                                                m.blockspecial = r.bool();
                                                break;
                                            }

                                          case 9:
                                            {
                                                m.preventshade = r.bool();
                                                break;
                                            }

                                          case 10:
                                            {
                                                m.dmask = r.bool();
                                                break;
                                            }

                                          case 11:
                                            {
                                                m.opacity = r.float();
                                                break;
                                            }

                                          case 12:
                                            {
                                                m.dmarea = r.int32();
                                                break;
                                            }

                                          case 13:
                                            {
                                                m.speedplus = r.float();
                                                break;
                                            }

                                          case 14:
                                            {
                                                m.fontsize = r.float();
                                                break;
                                            }

                                          case 15:
                                            {
                                                m.screensync = r.bool();
                                                break;
                                            }

                                          case 16:
                                            {
                                                m.speedsync = r.bool();
                                                break;
                                            }

                                          case 17:
                                            {
                                                m.fontfamily = r.string();
                                                break;
                                            }

                                          case 18:
                                            {
                                                m.bold = r.bool();
                                                break;
                                            }

                                          case 19:
                                            {
                                                m.fontborder = r.int32();
                                                break;
                                            }

                                          case 20:
                                            {
                                                m.drawType = r.string();
                                                break;
                                            }

                                          case 21:
                                            {
                                                m.seniorModeSwitch = r.int32();
                                                break;
                                            }

                                          case 22:
                                            {
                                                m.aiLevelV2 = r.int32();
                                                break;
                                            }

                                          case 23:
                                            {
                                                if (m.aiLevelV2Map === $util.emptyObject) m.aiLevelV2Map = {};
                                                var c2 = r.uint32() + r.pos;
                                                k = 0;
                                                value = 0;
                                                while (r.pos < c2) {
                                                    var tag2 = r.uint32();
                                                    switch (tag2 >>> 3) {
                                                      case 1:
                                                        k = r.int32();
                                                        break;

                                                      case 2:
                                                        value = r.int32();
                                                        break;

                                                      default:
                                                        r.skipType(tag2 & 7);
                                                        break;
                                                    }
                                                }
                                                m.aiLevelV2Map[k] = value;
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                DanmuWebPlayerConfig.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.DanmuWebPlayerConfig) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.DanmuWebPlayerConfig;
                                    if (d.dmSwitch != null) {
                                        m.dmSwitch = Boolean(d.dmSwitch);
                                    }
                                    if (d.aiSwitch != null) {
                                        m.aiSwitch = Boolean(d.aiSwitch);
                                    }
                                    if (d.aiLevel != null) {
                                        m.aiLevel = d.aiLevel | 0;
                                    }
                                    if (d.blocktop != null) {
                                        m.blocktop = Boolean(d.blocktop);
                                    }
                                    if (d.blockscroll != null) {
                                        m.blockscroll = Boolean(d.blockscroll);
                                    }
                                    if (d.blockbottom != null) {
                                        m.blockbottom = Boolean(d.blockbottom);
                                    }
                                    if (d.blockcolor != null) {
                                        m.blockcolor = Boolean(d.blockcolor);
                                    }
                                    if (d.blockspecial != null) {
                                        m.blockspecial = Boolean(d.blockspecial);
                                    }
                                    if (d.preventshade != null) {
                                        m.preventshade = Boolean(d.preventshade);
                                    }
                                    if (d.dmask != null) {
                                        m.dmask = Boolean(d.dmask);
                                    }
                                    if (d.opacity != null) {
                                        m.opacity = Number(d.opacity);
                                    }
                                    if (d.dmarea != null) {
                                        m.dmarea = d.dmarea | 0;
                                    }
                                    if (d.speedplus != null) {
                                        m.speedplus = Number(d.speedplus);
                                    }
                                    if (d.fontsize != null) {
                                        m.fontsize = Number(d.fontsize);
                                    }
                                    if (d.screensync != null) {
                                        m.screensync = Boolean(d.screensync);
                                    }
                                    if (d.speedsync != null) {
                                        m.speedsync = Boolean(d.speedsync);
                                    }
                                    if (d.fontfamily != null) {
                                        m.fontfamily = String(d.fontfamily);
                                    }
                                    if (d.bold != null) {
                                        m.bold = Boolean(d.bold);
                                    }
                                    if (d.fontborder != null) {
                                        m.fontborder = d.fontborder | 0;
                                    }
                                    if (d.drawType != null) {
                                        m.drawType = String(d.drawType);
                                    }
                                    if (d.seniorModeSwitch != null) {
                                        m.seniorModeSwitch = d.seniorModeSwitch | 0;
                                    }
                                    if (d.aiLevelV2 != null) {
                                        m.aiLevelV2 = d.aiLevelV2 | 0;
                                    }
                                    if (d.aiLevelV2Map) {
                                        if (typeof d.aiLevelV2Map !== "object") throw TypeError(".bilibili.community.service.dm.v1.DanmuWebPlayerConfig.aiLevelV2Map: object expected");
                                        m.aiLevelV2Map = {};
                                        for (var ks = Object.keys(d.aiLevelV2Map), i = 0; i < ks.length; ++i) {
                                            m.aiLevelV2Map[ks[i]] = d.aiLevelV2Map[ks[i]] | 0;
                                        }
                                    }
                                    return m;
                                };
                                DanmuWebPlayerConfig.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.objects || o.defaults) {
                                        d.aiLevelV2Map = {};
                                    }
                                    if (o.defaults) {
                                        d.dmSwitch = false;
                                        d.aiSwitch = false;
                                        d.aiLevel = 0;
                                        d.blocktop = false;
                                        d.blockscroll = false;
                                        d.blockbottom = false;
                                        d.blockcolor = false;
                                        d.blockspecial = false;
                                        d.preventshade = false;
                                        d.dmask = false;
                                        d.opacity = 0;
                                        d.dmarea = 0;
                                        d.speedplus = 0;
                                        d.fontsize = 0;
                                        d.screensync = false;
                                        d.speedsync = false;
                                        d.fontfamily = "";
                                        d.bold = false;
                                        d.fontborder = 0;
                                        d.drawType = "";
                                        d.seniorModeSwitch = 0;
                                        d.aiLevelV2 = 0;
                                    }
                                    if (m.dmSwitch != null && m.hasOwnProperty("dmSwitch")) {
                                        d.dmSwitch = m.dmSwitch;
                                    }
                                    if (m.aiSwitch != null && m.hasOwnProperty("aiSwitch")) {
                                        d.aiSwitch = m.aiSwitch;
                                    }
                                    if (m.aiLevel != null && m.hasOwnProperty("aiLevel")) {
                                        d.aiLevel = m.aiLevel;
                                    }
                                    if (m.blocktop != null && m.hasOwnProperty("blocktop")) {
                                        d.blocktop = m.blocktop;
                                    }
                                    if (m.blockscroll != null && m.hasOwnProperty("blockscroll")) {
                                        d.blockscroll = m.blockscroll;
                                    }
                                    if (m.blockbottom != null && m.hasOwnProperty("blockbottom")) {
                                        d.blockbottom = m.blockbottom;
                                    }
                                    if (m.blockcolor != null && m.hasOwnProperty("blockcolor")) {
                                        d.blockcolor = m.blockcolor;
                                    }
                                    if (m.blockspecial != null && m.hasOwnProperty("blockspecial")) {
                                        d.blockspecial = m.blockspecial;
                                    }
                                    if (m.preventshade != null && m.hasOwnProperty("preventshade")) {
                                        d.preventshade = m.preventshade;
                                    }
                                    if (m.dmask != null && m.hasOwnProperty("dmask")) {
                                        d.dmask = m.dmask;
                                    }
                                    if (m.opacity != null && m.hasOwnProperty("opacity")) {
                                        d.opacity = o.json && !isFinite(m.opacity) ? String(m.opacity) : m.opacity;
                                    }
                                    if (m.dmarea != null && m.hasOwnProperty("dmarea")) {
                                        d.dmarea = m.dmarea;
                                    }
                                    if (m.speedplus != null && m.hasOwnProperty("speedplus")) {
                                        d.speedplus = o.json && !isFinite(m.speedplus) ? String(m.speedplus) : m.speedplus;
                                    }
                                    if (m.fontsize != null && m.hasOwnProperty("fontsize")) {
                                        d.fontsize = o.json && !isFinite(m.fontsize) ? String(m.fontsize) : m.fontsize;
                                    }
                                    if (m.screensync != null && m.hasOwnProperty("screensync")) {
                                        d.screensync = m.screensync;
                                    }
                                    if (m.speedsync != null && m.hasOwnProperty("speedsync")) {
                                        d.speedsync = m.speedsync;
                                    }
                                    if (m.fontfamily != null && m.hasOwnProperty("fontfamily")) {
                                        d.fontfamily = m.fontfamily;
                                    }
                                    if (m.bold != null && m.hasOwnProperty("bold")) {
                                        d.bold = m.bold;
                                    }
                                    if (m.fontborder != null && m.hasOwnProperty("fontborder")) {
                                        d.fontborder = m.fontborder;
                                    }
                                    if (m.drawType != null && m.hasOwnProperty("drawType")) {
                                        d.drawType = m.drawType;
                                    }
                                    if (m.seniorModeSwitch != null && m.hasOwnProperty("seniorModeSwitch")) {
                                        d.seniorModeSwitch = m.seniorModeSwitch;
                                    }
                                    if (m.aiLevelV2 != null && m.hasOwnProperty("aiLevelV2")) {
                                        d.aiLevelV2 = m.aiLevelV2;
                                    }
                                    var ks2;
                                    if (m.aiLevelV2Map && (ks2 = Object.keys(m.aiLevelV2Map)).length) {
                                        d.aiLevelV2Map = {};
                                        for (var j = 0; j < ks2.length; ++j) {
                                            d.aiLevelV2Map[ks2[j]] = m.aiLevelV2Map[ks2[j]];
                                        }
                                    }
                                    return d;
                                };
                                DanmuWebPlayerConfig.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                DanmuWebPlayerConfig.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.DanmuWebPlayerConfig";
                                };
                                return DanmuWebPlayerConfig;
                            }();
                            v1.Expressions = function() {
                                function Expressions(p) {
                                    this.data = [];
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                Expressions.prototype.data = $util.emptyArray;
                                Expressions.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.Expressions;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                if (!(m.data && m.data.length)) m.data = [];
                                                m.data.push($root.bilibili.community.service.dm.v1.Expression.decode(r, r.uint32()));
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                Expressions.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.Expressions) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.Expressions;
                                    if (d.data) {
                                        if (!Array.isArray(d.data)) throw TypeError(".bilibili.community.service.dm.v1.Expressions.data: array expected");
                                        m.data = [];
                                        for (var i = 0; i < d.data.length; ++i) {
                                            if (typeof d.data[i] !== "object") throw TypeError(".bilibili.community.service.dm.v1.Expressions.data: object expected");
                                            m.data[i] = $root.bilibili.community.service.dm.v1.Expression.fromObject(d.data[i]);
                                        }
                                    }
                                    return m;
                                };
                                Expressions.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.arrays || o.defaults) {
                                        d.data = [];
                                    }
                                    if (m.data && m.data.length) {
                                        d.data = [];
                                        for (var j = 0; j < m.data.length; ++j) {
                                            d.data[j] = $root.bilibili.community.service.dm.v1.Expression.toObject(m.data[j], o);
                                        }
                                    }
                                    return d;
                                };
                                Expressions.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                Expressions.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.Expressions";
                                };
                                return Expressions;
                            }();
                            v1.PostPanel = function() {
                                function PostPanel(p) {
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                PostPanel.prototype.start = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                PostPanel.prototype.end = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                PostPanel.prototype.priority = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                PostPanel.prototype.bizId = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                PostPanel.prototype.bizType = 0;
                                PostPanel.prototype.clickButton = null;
                                PostPanel.prototype.textInput = null;
                                PostPanel.prototype.checkBox = null;
                                PostPanel.prototype.toast = null;
                                PostPanel.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.PostPanel;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                m.start = r.int64();
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.end = r.int64();
                                                break;
                                            }

                                          case 3:
                                            {
                                                m.priority = r.int64();
                                                break;
                                            }

                                          case 4:
                                            {
                                                m.bizId = r.int64();
                                                break;
                                            }

                                          case 5:
                                            {
                                                m.bizType = r.int32();
                                                break;
                                            }

                                          case 6:
                                            {
                                                m.clickButton = $root.bilibili.community.service.dm.v1.ClickButton.decode(r, r.uint32());
                                                break;
                                            }

                                          case 7:
                                            {
                                                m.textInput = $root.bilibili.community.service.dm.v1.TextInput.decode(r, r.uint32());
                                                break;
                                            }

                                          case 8:
                                            {
                                                m.checkBox = $root.bilibili.community.service.dm.v1.CheckBox.decode(r, r.uint32());
                                                break;
                                            }

                                          case 9:
                                            {
                                                m.toast = $root.bilibili.community.service.dm.v1.Toast.decode(r, r.uint32());
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                PostPanel.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.PostPanel) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.PostPanel;
                                    if (d.start != null) {
                                        if ($util.Long) (m.start = $util.Long.fromValue(d.start)).unsigned = false; else if (typeof d.start === "string") m.start = parseInt(d.start, 10); else if (typeof d.start === "number") m.start = d.start; else if (typeof d.start === "object") m.start = new $util.LongBits(d.start.low >>> 0, d.start.high >>> 0).toNumber();
                                    }
                                    if (d.end != null) {
                                        if ($util.Long) (m.end = $util.Long.fromValue(d.end)).unsigned = false; else if (typeof d.end === "string") m.end = parseInt(d.end, 10); else if (typeof d.end === "number") m.end = d.end; else if (typeof d.end === "object") m.end = new $util.LongBits(d.end.low >>> 0, d.end.high >>> 0).toNumber();
                                    }
                                    if (d.priority != null) {
                                        if ($util.Long) (m.priority = $util.Long.fromValue(d.priority)).unsigned = false; else if (typeof d.priority === "string") m.priority = parseInt(d.priority, 10); else if (typeof d.priority === "number") m.priority = d.priority; else if (typeof d.priority === "object") m.priority = new $util.LongBits(d.priority.low >>> 0, d.priority.high >>> 0).toNumber();
                                    }
                                    if (d.bizId != null) {
                                        if ($util.Long) (m.bizId = $util.Long.fromValue(d.bizId)).unsigned = false; else if (typeof d.bizId === "string") m.bizId = parseInt(d.bizId, 10); else if (typeof d.bizId === "number") m.bizId = d.bizId; else if (typeof d.bizId === "object") m.bizId = new $util.LongBits(d.bizId.low >>> 0, d.bizId.high >>> 0).toNumber();
                                    }
                                    switch (d.bizType) {
                                      default:
                                        if (typeof d.bizType === "number") {
                                            m.bizType = d.bizType;
                                            break;
                                        }
                                        break;

                                      case "PostPanelBizTypeNone":
                                      case 0:
                                        m.bizType = 0;
                                        break;

                                      case "PostPanelBizTypeEncourage":
                                      case 1:
                                        m.bizType = 1;
                                        break;

                                      case "PostPanelBizTypeColorDM":
                                      case 2:
                                        m.bizType = 2;
                                        break;

                                      case "PostPanelBizTypeNFTDM":
                                      case 3:
                                        m.bizType = 3;
                                        break;

                                      case "PostPanelBizTypeFragClose":
                                      case 4:
                                        m.bizType = 4;
                                        break;

                                      case "PostPanelBizTypeRecommend":
                                      case 5:
                                        m.bizType = 5;
                                        break;
                                    }
                                    if (d.clickButton != null) {
                                        if (typeof d.clickButton !== "object") throw TypeError(".bilibili.community.service.dm.v1.PostPanel.clickButton: object expected");
                                        m.clickButton = $root.bilibili.community.service.dm.v1.ClickButton.fromObject(d.clickButton);
                                    }
                                    if (d.textInput != null) {
                                        if (typeof d.textInput !== "object") throw TypeError(".bilibili.community.service.dm.v1.PostPanel.textInput: object expected");
                                        m.textInput = $root.bilibili.community.service.dm.v1.TextInput.fromObject(d.textInput);
                                    }
                                    if (d.checkBox != null) {
                                        if (typeof d.checkBox !== "object") throw TypeError(".bilibili.community.service.dm.v1.PostPanel.checkBox: object expected");
                                        m.checkBox = $root.bilibili.community.service.dm.v1.CheckBox.fromObject(d.checkBox);
                                    }
                                    if (d.toast != null) {
                                        if (typeof d.toast !== "object") throw TypeError(".bilibili.community.service.dm.v1.PostPanel.toast: object expected");
                                        m.toast = $root.bilibili.community.service.dm.v1.Toast.fromObject(d.toast);
                                    }
                                    return m;
                                };
                                PostPanel.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        if ($util.Long) {
                                            var n = new $util.Long(0, 0, false);
                                            d.start = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                        } else d.start = o.longs === String ? "0" : 0;
                                        if ($util.Long) {
                                            var n = new $util.Long(0, 0, false);
                                            d.end = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                        } else d.end = o.longs === String ? "0" : 0;
                                        if ($util.Long) {
                                            var n = new $util.Long(0, 0, false);
                                            d.priority = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                        } else d.priority = o.longs === String ? "0" : 0;
                                        if ($util.Long) {
                                            var n = new $util.Long(0, 0, false);
                                            d.bizId = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                        } else d.bizId = o.longs === String ? "0" : 0;
                                        d.bizType = o.enums === String ? "PostPanelBizTypeNone" : 0;
                                        d.clickButton = null;
                                        d.textInput = null;
                                        d.checkBox = null;
                                        d.toast = null;
                                    }
                                    if (m.start != null && m.hasOwnProperty("start")) {
                                        if (typeof m.start === "number") d.start = o.longs === String ? String(m.start) : m.start; else d.start = o.longs === String ? $util.Long.prototype.toString.call(m.start) : o.longs === Number ? new $util.LongBits(m.start.low >>> 0, m.start.high >>> 0).toNumber() : m.start;
                                    }
                                    if (m.end != null && m.hasOwnProperty("end")) {
                                        if (typeof m.end === "number") d.end = o.longs === String ? String(m.end) : m.end; else d.end = o.longs === String ? $util.Long.prototype.toString.call(m.end) : o.longs === Number ? new $util.LongBits(m.end.low >>> 0, m.end.high >>> 0).toNumber() : m.end;
                                    }
                                    if (m.priority != null && m.hasOwnProperty("priority")) {
                                        if (typeof m.priority === "number") d.priority = o.longs === String ? String(m.priority) : m.priority; else d.priority = o.longs === String ? $util.Long.prototype.toString.call(m.priority) : o.longs === Number ? new $util.LongBits(m.priority.low >>> 0, m.priority.high >>> 0).toNumber() : m.priority;
                                    }
                                    if (m.bizId != null && m.hasOwnProperty("bizId")) {
                                        if (typeof m.bizId === "number") d.bizId = o.longs === String ? String(m.bizId) : m.bizId; else d.bizId = o.longs === String ? $util.Long.prototype.toString.call(m.bizId) : o.longs === Number ? new $util.LongBits(m.bizId.low >>> 0, m.bizId.high >>> 0).toNumber() : m.bizId;
                                    }
                                    if (m.bizType != null && m.hasOwnProperty("bizType")) {
                                        d.bizType = o.enums === String ? $root.bilibili.community.service.dm.v1.PostPanelBizType[m.bizType] === undefined ? m.bizType : $root.bilibili.community.service.dm.v1.PostPanelBizType[m.bizType] : m.bizType;
                                    }
                                    if (m.clickButton != null && m.hasOwnProperty("clickButton")) {
                                        d.clickButton = $root.bilibili.community.service.dm.v1.ClickButton.toObject(m.clickButton, o);
                                    }
                                    if (m.textInput != null && m.hasOwnProperty("textInput")) {
                                        d.textInput = $root.bilibili.community.service.dm.v1.TextInput.toObject(m.textInput, o);
                                    }
                                    if (m.checkBox != null && m.hasOwnProperty("checkBox")) {
                                        d.checkBox = $root.bilibili.community.service.dm.v1.CheckBox.toObject(m.checkBox, o);
                                    }
                                    if (m.toast != null && m.hasOwnProperty("toast")) {
                                        d.toast = $root.bilibili.community.service.dm.v1.Toast.toObject(m.toast, o);
                                    }
                                    return d;
                                };
                                PostPanel.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                PostPanel.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.PostPanel";
                                };
                                return PostPanel;
                            }();
                            v1.DmColorfulType = function() {
                                const valuesById = {}, values = Object.create(valuesById);
                                values[valuesById[0] = "NoneType"] = 0;
                                values[valuesById[60001] = "VipGradualColor"] = 60001;
                                return values;
                            }();
                            v1.DanmakuFlag = function() {
                                function DanmakuFlag(p) {
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                DanmakuFlag.prototype.dmid = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                DanmakuFlag.prototype.flag = 0;
                                DanmakuFlag.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.DanmakuFlag;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                m.dmid = r.int64();
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.flag = r.uint32();
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                DanmakuFlag.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.DanmakuFlag) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.DanmakuFlag;
                                    if (d.dmid != null) {
                                        if ($util.Long) (m.dmid = $util.Long.fromValue(d.dmid)).unsigned = false; else if (typeof d.dmid === "string") m.dmid = parseInt(d.dmid, 10); else if (typeof d.dmid === "number") m.dmid = d.dmid; else if (typeof d.dmid === "object") m.dmid = new $util.LongBits(d.dmid.low >>> 0, d.dmid.high >>> 0).toNumber();
                                    }
                                    if (d.flag != null) {
                                        m.flag = d.flag >>> 0;
                                    }
                                    return m;
                                };
                                DanmakuFlag.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        if ($util.Long) {
                                            var n = new $util.Long(0, 0, false);
                                            d.dmid = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                        } else d.dmid = o.longs === String ? "0" : 0;
                                        d.flag = 0;
                                    }
                                    if (m.dmid != null && m.hasOwnProperty("dmid")) {
                                        if (typeof m.dmid === "number") d.dmid = o.longs === String ? String(m.dmid) : m.dmid; else d.dmid = o.longs === String ? $util.Long.prototype.toString.call(m.dmid) : o.longs === Number ? new $util.LongBits(m.dmid.low >>> 0, m.dmid.high >>> 0).toNumber() : m.dmid;
                                    }
                                    if (m.flag != null && m.hasOwnProperty("flag")) {
                                        d.flag = m.flag;
                                    }
                                    return d;
                                };
                                DanmakuFlag.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                DanmakuFlag.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.DanmakuFlag";
                                };
                                return DanmakuFlag;
                            }();
                            v1.Expression = function() {
                                function Expression(p) {
                                    this.keyword = [];
                                    this.period = [];
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                Expression.prototype.keyword = $util.emptyArray;
                                Expression.prototype.url = "";
                                Expression.prototype.period = $util.emptyArray;
                                Expression.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.Expression;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                if (!(m.keyword && m.keyword.length)) m.keyword = [];
                                                m.keyword.push(r.string());
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.url = r.string();
                                                break;
                                            }

                                          case 3:
                                            {
                                                if (!(m.period && m.period.length)) m.period = [];
                                                m.period.push($root.bilibili.community.service.dm.v1.Period.decode(r, r.uint32()));
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                Expression.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.Expression) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.Expression;
                                    if (d.keyword) {
                                        if (!Array.isArray(d.keyword)) throw TypeError(".bilibili.community.service.dm.v1.Expression.keyword: array expected");
                                        m.keyword = [];
                                        for (var i = 0; i < d.keyword.length; ++i) {
                                            m.keyword[i] = String(d.keyword[i]);
                                        }
                                    }
                                    if (d.url != null) {
                                        m.url = String(d.url);
                                    }
                                    if (d.period) {
                                        if (!Array.isArray(d.period)) throw TypeError(".bilibili.community.service.dm.v1.Expression.period: array expected");
                                        m.period = [];
                                        for (var i = 0; i < d.period.length; ++i) {
                                            if (typeof d.period[i] !== "object") throw TypeError(".bilibili.community.service.dm.v1.Expression.period: object expected");
                                            m.period[i] = $root.bilibili.community.service.dm.v1.Period.fromObject(d.period[i]);
                                        }
                                    }
                                    return m;
                                };
                                Expression.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.arrays || o.defaults) {
                                        d.keyword = [];
                                        d.period = [];
                                    }
                                    if (o.defaults) {
                                        d.url = "";
                                    }
                                    if (m.keyword && m.keyword.length) {
                                        d.keyword = [];
                                        for (var j = 0; j < m.keyword.length; ++j) {
                                            d.keyword[j] = m.keyword[j];
                                        }
                                    }
                                    if (m.url != null && m.hasOwnProperty("url")) {
                                        d.url = m.url;
                                    }
                                    if (m.period && m.period.length) {
                                        d.period = [];
                                        for (var j = 0; j < m.period.length; ++j) {
                                            d.period[j] = $root.bilibili.community.service.dm.v1.Period.toObject(m.period[j], o);
                                        }
                                    }
                                    return d;
                                };
                                Expression.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                Expression.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.Expression";
                                };
                                return Expression;
                            }();
                            v1.PostPanelBizType = function() {
                                const valuesById = {}, values = Object.create(valuesById);
                                values[valuesById[0] = "PostPanelBizTypeNone"] = 0;
                                values[valuesById[1] = "PostPanelBizTypeEncourage"] = 1;
                                values[valuesById[2] = "PostPanelBizTypeColorDM"] = 2;
                                values[valuesById[3] = "PostPanelBizTypeNFTDM"] = 3;
                                values[valuesById[4] = "PostPanelBizTypeFragClose"] = 4;
                                values[valuesById[5] = "PostPanelBizTypeRecommend"] = 5;
                                return values;
                            }();
                            v1.ClickButton = function() {
                                function ClickButton(p) {
                                    this.portraitText = [];
                                    this.landscapeText = [];
                                    this.portraitTextFocus = [];
                                    this.landscapeTextFocus = [];
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                ClickButton.prototype.portraitText = $util.emptyArray;
                                ClickButton.prototype.landscapeText = $util.emptyArray;
                                ClickButton.prototype.portraitTextFocus = $util.emptyArray;
                                ClickButton.prototype.landscapeTextFocus = $util.emptyArray;
                                ClickButton.prototype.renderType = 0;
                                ClickButton.prototype.show = false;
                                ClickButton.prototype.bubble = null;
                                ClickButton.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.ClickButton;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                if (!(m.portraitText && m.portraitText.length)) m.portraitText = [];
                                                m.portraitText.push(r.string());
                                                break;
                                            }

                                          case 2:
                                            {
                                                if (!(m.landscapeText && m.landscapeText.length)) m.landscapeText = [];
                                                m.landscapeText.push(r.string());
                                                break;
                                            }

                                          case 3:
                                            {
                                                if (!(m.portraitTextFocus && m.portraitTextFocus.length)) m.portraitTextFocus = [];
                                                m.portraitTextFocus.push(r.string());
                                                break;
                                            }

                                          case 4:
                                            {
                                                if (!(m.landscapeTextFocus && m.landscapeTextFocus.length)) m.landscapeTextFocus = [];
                                                m.landscapeTextFocus.push(r.string());
                                                break;
                                            }

                                          case 5:
                                            {
                                                m.renderType = r.int32();
                                                break;
                                            }

                                          case 6:
                                            {
                                                m.show = r.bool();
                                                break;
                                            }

                                          case 7:
                                            {
                                                m.bubble = $root.bilibili.community.service.dm.v1.Bubble.decode(r, r.uint32());
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                ClickButton.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.ClickButton) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.ClickButton;
                                    if (d.portraitText) {
                                        if (!Array.isArray(d.portraitText)) throw TypeError(".bilibili.community.service.dm.v1.ClickButton.portraitText: array expected");
                                        m.portraitText = [];
                                        for (var i = 0; i < d.portraitText.length; ++i) {
                                            m.portraitText[i] = String(d.portraitText[i]);
                                        }
                                    }
                                    if (d.landscapeText) {
                                        if (!Array.isArray(d.landscapeText)) throw TypeError(".bilibili.community.service.dm.v1.ClickButton.landscapeText: array expected");
                                        m.landscapeText = [];
                                        for (var i = 0; i < d.landscapeText.length; ++i) {
                                            m.landscapeText[i] = String(d.landscapeText[i]);
                                        }
                                    }
                                    if (d.portraitTextFocus) {
                                        if (!Array.isArray(d.portraitTextFocus)) throw TypeError(".bilibili.community.service.dm.v1.ClickButton.portraitTextFocus: array expected");
                                        m.portraitTextFocus = [];
                                        for (var i = 0; i < d.portraitTextFocus.length; ++i) {
                                            m.portraitTextFocus[i] = String(d.portraitTextFocus[i]);
                                        }
                                    }
                                    if (d.landscapeTextFocus) {
                                        if (!Array.isArray(d.landscapeTextFocus)) throw TypeError(".bilibili.community.service.dm.v1.ClickButton.landscapeTextFocus: array expected");
                                        m.landscapeTextFocus = [];
                                        for (var i = 0; i < d.landscapeTextFocus.length; ++i) {
                                            m.landscapeTextFocus[i] = String(d.landscapeTextFocus[i]);
                                        }
                                    }
                                    switch (d.renderType) {
                                      default:
                                        if (typeof d.renderType === "number") {
                                            m.renderType = d.renderType;
                                            break;
                                        }
                                        break;

                                      case "RenderTypeNone":
                                      case 0:
                                        m.renderType = 0;
                                        break;

                                      case "RenderTypeSingle":
                                      case 1:
                                        m.renderType = 1;
                                        break;

                                      case "RenderTypeRotation":
                                      case 2:
                                        m.renderType = 2;
                                        break;
                                    }
                                    if (d.show != null) {
                                        m.show = Boolean(d.show);
                                    }
                                    if (d.bubble != null) {
                                        if (typeof d.bubble !== "object") throw TypeError(".bilibili.community.service.dm.v1.ClickButton.bubble: object expected");
                                        m.bubble = $root.bilibili.community.service.dm.v1.Bubble.fromObject(d.bubble);
                                    }
                                    return m;
                                };
                                ClickButton.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.arrays || o.defaults) {
                                        d.portraitText = [];
                                        d.landscapeText = [];
                                        d.portraitTextFocus = [];
                                        d.landscapeTextFocus = [];
                                    }
                                    if (o.defaults) {
                                        d.renderType = o.enums === String ? "RenderTypeNone" : 0;
                                        d.show = false;
                                        d.bubble = null;
                                    }
                                    if (m.portraitText && m.portraitText.length) {
                                        d.portraitText = [];
                                        for (var j = 0; j < m.portraitText.length; ++j) {
                                            d.portraitText[j] = m.portraitText[j];
                                        }
                                    }
                                    if (m.landscapeText && m.landscapeText.length) {
                                        d.landscapeText = [];
                                        for (var j = 0; j < m.landscapeText.length; ++j) {
                                            d.landscapeText[j] = m.landscapeText[j];
                                        }
                                    }
                                    if (m.portraitTextFocus && m.portraitTextFocus.length) {
                                        d.portraitTextFocus = [];
                                        for (var j = 0; j < m.portraitTextFocus.length; ++j) {
                                            d.portraitTextFocus[j] = m.portraitTextFocus[j];
                                        }
                                    }
                                    if (m.landscapeTextFocus && m.landscapeTextFocus.length) {
                                        d.landscapeTextFocus = [];
                                        for (var j = 0; j < m.landscapeTextFocus.length; ++j) {
                                            d.landscapeTextFocus[j] = m.landscapeTextFocus[j];
                                        }
                                    }
                                    if (m.renderType != null && m.hasOwnProperty("renderType")) {
                                        d.renderType = o.enums === String ? $root.bilibili.community.service.dm.v1.RenderType[m.renderType] === undefined ? m.renderType : $root.bilibili.community.service.dm.v1.RenderType[m.renderType] : m.renderType;
                                    }
                                    if (m.show != null && m.hasOwnProperty("show")) {
                                        d.show = m.show;
                                    }
                                    if (m.bubble != null && m.hasOwnProperty("bubble")) {
                                        d.bubble = $root.bilibili.community.service.dm.v1.Bubble.toObject(m.bubble, o);
                                    }
                                    return d;
                                };
                                ClickButton.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                ClickButton.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.ClickButton";
                                };
                                return ClickButton;
                            }();
                            v1.TextInput = function() {
                                function TextInput(p) {
                                    this.portraitPlaceholder = [];
                                    this.landscapePlaceholder = [];
                                    this.avatar = [];
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                TextInput.prototype.portraitPlaceholder = $util.emptyArray;
                                TextInput.prototype.landscapePlaceholder = $util.emptyArray;
                                TextInput.prototype.renderType = 0;
                                TextInput.prototype.placeholderPost = false;
                                TextInput.prototype.show = false;
                                TextInput.prototype.avatar = $util.emptyArray;
                                TextInput.prototype.postStatus = 0;
                                TextInput.prototype.label = null;
                                TextInput.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.TextInput;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                if (!(m.portraitPlaceholder && m.portraitPlaceholder.length)) m.portraitPlaceholder = [];
                                                m.portraitPlaceholder.push(r.string());
                                                break;
                                            }

                                          case 2:
                                            {
                                                if (!(m.landscapePlaceholder && m.landscapePlaceholder.length)) m.landscapePlaceholder = [];
                                                m.landscapePlaceholder.push(r.string());
                                                break;
                                            }

                                          case 3:
                                            {
                                                m.renderType = r.int32();
                                                break;
                                            }

                                          case 4:
                                            {
                                                m.placeholderPost = r.bool();
                                                break;
                                            }

                                          case 5:
                                            {
                                                m.show = r.bool();
                                                break;
                                            }

                                          case 6:
                                            {
                                                if (!(m.avatar && m.avatar.length)) m.avatar = [];
                                                m.avatar.push($root.bilibili.community.service.dm.v1.Avatar.decode(r, r.uint32()));
                                                break;
                                            }

                                          case 7:
                                            {
                                                m.postStatus = r.int32();
                                                break;
                                            }

                                          case 8:
                                            {
                                                m.label = $root.bilibili.community.service.dm.v1.Label.decode(r, r.uint32());
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                TextInput.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.TextInput) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.TextInput;
                                    if (d.portraitPlaceholder) {
                                        if (!Array.isArray(d.portraitPlaceholder)) throw TypeError(".bilibili.community.service.dm.v1.TextInput.portraitPlaceholder: array expected");
                                        m.portraitPlaceholder = [];
                                        for (var i = 0; i < d.portraitPlaceholder.length; ++i) {
                                            m.portraitPlaceholder[i] = String(d.portraitPlaceholder[i]);
                                        }
                                    }
                                    if (d.landscapePlaceholder) {
                                        if (!Array.isArray(d.landscapePlaceholder)) throw TypeError(".bilibili.community.service.dm.v1.TextInput.landscapePlaceholder: array expected");
                                        m.landscapePlaceholder = [];
                                        for (var i = 0; i < d.landscapePlaceholder.length; ++i) {
                                            m.landscapePlaceholder[i] = String(d.landscapePlaceholder[i]);
                                        }
                                    }
                                    switch (d.renderType) {
                                      default:
                                        if (typeof d.renderType === "number") {
                                            m.renderType = d.renderType;
                                            break;
                                        }
                                        break;

                                      case "RenderTypeNone":
                                      case 0:
                                        m.renderType = 0;
                                        break;

                                      case "RenderTypeSingle":
                                      case 1:
                                        m.renderType = 1;
                                        break;

                                      case "RenderTypeRotation":
                                      case 2:
                                        m.renderType = 2;
                                        break;
                                    }
                                    if (d.placeholderPost != null) {
                                        m.placeholderPost = Boolean(d.placeholderPost);
                                    }
                                    if (d.show != null) {
                                        m.show = Boolean(d.show);
                                    }
                                    if (d.avatar) {
                                        if (!Array.isArray(d.avatar)) throw TypeError(".bilibili.community.service.dm.v1.TextInput.avatar: array expected");
                                        m.avatar = [];
                                        for (var i = 0; i < d.avatar.length; ++i) {
                                            if (typeof d.avatar[i] !== "object") throw TypeError(".bilibili.community.service.dm.v1.TextInput.avatar: object expected");
                                            m.avatar[i] = $root.bilibili.community.service.dm.v1.Avatar.fromObject(d.avatar[i]);
                                        }
                                    }
                                    switch (d.postStatus) {
                                      default:
                                        if (typeof d.postStatus === "number") {
                                            m.postStatus = d.postStatus;
                                            break;
                                        }
                                        break;

                                      case "PostStatusNormal":
                                      case 0:
                                        m.postStatus = 0;
                                        break;

                                      case "PostStatusClosed":
                                      case 1:
                                        m.postStatus = 1;
                                        break;
                                    }
                                    if (d.label != null) {
                                        if (typeof d.label !== "object") throw TypeError(".bilibili.community.service.dm.v1.TextInput.label: object expected");
                                        m.label = $root.bilibili.community.service.dm.v1.Label.fromObject(d.label);
                                    }
                                    return m;
                                };
                                TextInput.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.arrays || o.defaults) {
                                        d.portraitPlaceholder = [];
                                        d.landscapePlaceholder = [];
                                        d.avatar = [];
                                    }
                                    if (o.defaults) {
                                        d.renderType = o.enums === String ? "RenderTypeNone" : 0;
                                        d.placeholderPost = false;
                                        d.show = false;
                                        d.postStatus = o.enums === String ? "PostStatusNormal" : 0;
                                        d.label = null;
                                    }
                                    if (m.portraitPlaceholder && m.portraitPlaceholder.length) {
                                        d.portraitPlaceholder = [];
                                        for (var j = 0; j < m.portraitPlaceholder.length; ++j) {
                                            d.portraitPlaceholder[j] = m.portraitPlaceholder[j];
                                        }
                                    }
                                    if (m.landscapePlaceholder && m.landscapePlaceholder.length) {
                                        d.landscapePlaceholder = [];
                                        for (var j = 0; j < m.landscapePlaceholder.length; ++j) {
                                            d.landscapePlaceholder[j] = m.landscapePlaceholder[j];
                                        }
                                    }
                                    if (m.renderType != null && m.hasOwnProperty("renderType")) {
                                        d.renderType = o.enums === String ? $root.bilibili.community.service.dm.v1.RenderType[m.renderType] === undefined ? m.renderType : $root.bilibili.community.service.dm.v1.RenderType[m.renderType] : m.renderType;
                                    }
                                    if (m.placeholderPost != null && m.hasOwnProperty("placeholderPost")) {
                                        d.placeholderPost = m.placeholderPost;
                                    }
                                    if (m.show != null && m.hasOwnProperty("show")) {
                                        d.show = m.show;
                                    }
                                    if (m.avatar && m.avatar.length) {
                                        d.avatar = [];
                                        for (var j = 0; j < m.avatar.length; ++j) {
                                            d.avatar[j] = $root.bilibili.community.service.dm.v1.Avatar.toObject(m.avatar[j], o);
                                        }
                                    }
                                    if (m.postStatus != null && m.hasOwnProperty("postStatus")) {
                                        d.postStatus = o.enums === String ? $root.bilibili.community.service.dm.v1.PostStatus[m.postStatus] === undefined ? m.postStatus : $root.bilibili.community.service.dm.v1.PostStatus[m.postStatus] : m.postStatus;
                                    }
                                    if (m.label != null && m.hasOwnProperty("label")) {
                                        d.label = $root.bilibili.community.service.dm.v1.Label.toObject(m.label, o);
                                    }
                                    return d;
                                };
                                TextInput.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                TextInput.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.TextInput";
                                };
                                return TextInput;
                            }();
                            v1.CheckBox = function() {
                                function CheckBox(p) {
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                CheckBox.prototype.text = "";
                                CheckBox.prototype.type = 0;
                                CheckBox.prototype.defaultValue = false;
                                CheckBox.prototype.show = false;
                                CheckBox.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.CheckBox;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                m.text = r.string();
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.type = r.int32();
                                                break;
                                            }

                                          case 3:
                                            {
                                                m.defaultValue = r.bool();
                                                break;
                                            }

                                          case 4:
                                            {
                                                m.show = r.bool();
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                CheckBox.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.CheckBox) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.CheckBox;
                                    if (d.text != null) {
                                        m.text = String(d.text);
                                    }
                                    switch (d.type) {
                                      default:
                                        if (typeof d.type === "number") {
                                            m.type = d.type;
                                            break;
                                        }
                                        break;

                                      case "CheckboxTypeNone":
                                      case 0:
                                        m.type = 0;
                                        break;

                                      case "CheckboxTypeEncourage":
                                      case 1:
                                        m.type = 1;
                                        break;

                                      case "CheckboxTypeColorDM":
                                      case 2:
                                        m.type = 2;
                                        break;
                                    }
                                    if (d.defaultValue != null) {
                                        m.defaultValue = Boolean(d.defaultValue);
                                    }
                                    if (d.show != null) {
                                        m.show = Boolean(d.show);
                                    }
                                    return m;
                                };
                                CheckBox.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        d.text = "";
                                        d.type = o.enums === String ? "CheckboxTypeNone" : 0;
                                        d.defaultValue = false;
                                        d.show = false;
                                    }
                                    if (m.text != null && m.hasOwnProperty("text")) {
                                        d.text = m.text;
                                    }
                                    if (m.type != null && m.hasOwnProperty("type")) {
                                        d.type = o.enums === String ? $root.bilibili.community.service.dm.v1.CheckboxType[m.type] === undefined ? m.type : $root.bilibili.community.service.dm.v1.CheckboxType[m.type] : m.type;
                                    }
                                    if (m.defaultValue != null && m.hasOwnProperty("defaultValue")) {
                                        d.defaultValue = m.defaultValue;
                                    }
                                    if (m.show != null && m.hasOwnProperty("show")) {
                                        d.show = m.show;
                                    }
                                    return d;
                                };
                                CheckBox.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                CheckBox.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.CheckBox";
                                };
                                return CheckBox;
                            }();
                            v1.Toast = function() {
                                function Toast(p) {
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                Toast.prototype.text = "";
                                Toast.prototype.duration = 0;
                                Toast.prototype.show = false;
                                Toast.prototype.button = null;
                                Toast.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.Toast;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                m.text = r.string();
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.duration = r.int32();
                                                break;
                                            }

                                          case 3:
                                            {
                                                m.show = r.bool();
                                                break;
                                            }

                                          case 4:
                                            {
                                                m.button = $root.bilibili.community.service.dm.v1.Button.decode(r, r.uint32());
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                Toast.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.Toast) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.Toast;
                                    if (d.text != null) {
                                        m.text = String(d.text);
                                    }
                                    if (d.duration != null) {
                                        m.duration = d.duration | 0;
                                    }
                                    if (d.show != null) {
                                        m.show = Boolean(d.show);
                                    }
                                    if (d.button != null) {
                                        if (typeof d.button !== "object") throw TypeError(".bilibili.community.service.dm.v1.Toast.button: object expected");
                                        m.button = $root.bilibili.community.service.dm.v1.Button.fromObject(d.button);
                                    }
                                    return m;
                                };
                                Toast.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        d.text = "";
                                        d.duration = 0;
                                        d.show = false;
                                        d.button = null;
                                    }
                                    if (m.text != null && m.hasOwnProperty("text")) {
                                        d.text = m.text;
                                    }
                                    if (m.duration != null && m.hasOwnProperty("duration")) {
                                        d.duration = m.duration;
                                    }
                                    if (m.show != null && m.hasOwnProperty("show")) {
                                        d.show = m.show;
                                    }
                                    if (m.button != null && m.hasOwnProperty("button")) {
                                        d.button = $root.bilibili.community.service.dm.v1.Button.toObject(m.button, o);
                                    }
                                    return d;
                                };
                                Toast.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                Toast.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.Toast";
                                };
                                return Toast;
                            }();
                            v1.Period = function() {
                                function Period(p) {
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                Period.prototype.start = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                Period.prototype.end = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                Period.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.Period;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                m.start = r.int64();
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.end = r.int64();
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                Period.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.Period) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.Period;
                                    if (d.start != null) {
                                        if ($util.Long) (m.start = $util.Long.fromValue(d.start)).unsigned = false; else if (typeof d.start === "string") m.start = parseInt(d.start, 10); else if (typeof d.start === "number") m.start = d.start; else if (typeof d.start === "object") m.start = new $util.LongBits(d.start.low >>> 0, d.start.high >>> 0).toNumber();
                                    }
                                    if (d.end != null) {
                                        if ($util.Long) (m.end = $util.Long.fromValue(d.end)).unsigned = false; else if (typeof d.end === "string") m.end = parseInt(d.end, 10); else if (typeof d.end === "number") m.end = d.end; else if (typeof d.end === "object") m.end = new $util.LongBits(d.end.low >>> 0, d.end.high >>> 0).toNumber();
                                    }
                                    return m;
                                };
                                Period.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        if ($util.Long) {
                                            var n = new $util.Long(0, 0, false);
                                            d.start = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                        } else d.start = o.longs === String ? "0" : 0;
                                        if ($util.Long) {
                                            var n = new $util.Long(0, 0, false);
                                            d.end = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                        } else d.end = o.longs === String ? "0" : 0;
                                    }
                                    if (m.start != null && m.hasOwnProperty("start")) {
                                        if (typeof m.start === "number") d.start = o.longs === String ? String(m.start) : m.start; else d.start = o.longs === String ? $util.Long.prototype.toString.call(m.start) : o.longs === Number ? new $util.LongBits(m.start.low >>> 0, m.start.high >>> 0).toNumber() : m.start;
                                    }
                                    if (m.end != null && m.hasOwnProperty("end")) {
                                        if (typeof m.end === "number") d.end = o.longs === String ? String(m.end) : m.end; else d.end = o.longs === String ? $util.Long.prototype.toString.call(m.end) : o.longs === Number ? new $util.LongBits(m.end.low >>> 0, m.end.high >>> 0).toNumber() : m.end;
                                    }
                                    return d;
                                };
                                Period.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                Period.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.Period";
                                };
                                return Period;
                            }();
                            v1.RenderType = function() {
                                const valuesById = {}, values = Object.create(valuesById);
                                values[valuesById[0] = "RenderTypeNone"] = 0;
                                values[valuesById[1] = "RenderTypeSingle"] = 1;
                                values[valuesById[2] = "RenderTypeRotation"] = 2;
                                return values;
                            }();
                            v1.Bubble = function() {
                                function Bubble(p) {
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                Bubble.prototype.text = "";
                                Bubble.prototype.url = "";
                                Bubble.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.Bubble;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                m.text = r.string();
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.url = r.string();
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                Bubble.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.Bubble) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.Bubble;
                                    if (d.text != null) {
                                        m.text = String(d.text);
                                    }
                                    if (d.url != null) {
                                        m.url = String(d.url);
                                    }
                                    return m;
                                };
                                Bubble.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        d.text = "";
                                        d.url = "";
                                    }
                                    if (m.text != null && m.hasOwnProperty("text")) {
                                        d.text = m.text;
                                    }
                                    if (m.url != null && m.hasOwnProperty("url")) {
                                        d.url = m.url;
                                    }
                                    return d;
                                };
                                Bubble.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                Bubble.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.Bubble";
                                };
                                return Bubble;
                            }();
                            v1.Avatar = function() {
                                function Avatar(p) {
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                Avatar.prototype.id = "";
                                Avatar.prototype.url = "";
                                Avatar.prototype.avatarType = 0;
                                Avatar.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.Avatar;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                m.id = r.string();
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.url = r.string();
                                                break;
                                            }

                                          case 3:
                                            {
                                                m.avatarType = r.int32();
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                Avatar.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.Avatar) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.Avatar;
                                    if (d.id != null) {
                                        m.id = String(d.id);
                                    }
                                    if (d.url != null) {
                                        m.url = String(d.url);
                                    }
                                    switch (d.avatarType) {
                                      default:
                                        if (typeof d.avatarType === "number") {
                                            m.avatarType = d.avatarType;
                                            break;
                                        }
                                        break;

                                      case "AvatarTypeNone":
                                      case 0:
                                        m.avatarType = 0;
                                        break;

                                      case "AvatarTypeNFT":
                                      case 1:
                                        m.avatarType = 1;
                                        break;
                                    }
                                    return m;
                                };
                                Avatar.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        d.id = "";
                                        d.url = "";
                                        d.avatarType = o.enums === String ? "AvatarTypeNone" : 0;
                                    }
                                    if (m.id != null && m.hasOwnProperty("id")) {
                                        d.id = m.id;
                                    }
                                    if (m.url != null && m.hasOwnProperty("url")) {
                                        d.url = m.url;
                                    }
                                    if (m.avatarType != null && m.hasOwnProperty("avatarType")) {
                                        d.avatarType = o.enums === String ? $root.bilibili.community.service.dm.v1.AvatarType[m.avatarType] === undefined ? m.avatarType : $root.bilibili.community.service.dm.v1.AvatarType[m.avatarType] : m.avatarType;
                                    }
                                    return d;
                                };
                                Avatar.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                Avatar.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.Avatar";
                                };
                                return Avatar;
                            }();
                            v1.PostStatus = function() {
                                const valuesById = {}, values = Object.create(valuesById);
                                values[valuesById[0] = "PostStatusNormal"] = 0;
                                values[valuesById[1] = "PostStatusClosed"] = 1;
                                return values;
                            }();
                            v1.Label = function() {
                                function Label(p) {
                                    this.content = [];
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                Label.prototype.title = "";
                                Label.prototype.content = $util.emptyArray;
                                Label.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.Label;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                m.title = r.string();
                                                break;
                                            }

                                          case 2:
                                            {
                                                if (!(m.content && m.content.length)) m.content = [];
                                                m.content.push(r.string());
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                Label.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.Label) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.Label;
                                    if (d.title != null) {
                                        m.title = String(d.title);
                                    }
                                    if (d.content) {
                                        if (!Array.isArray(d.content)) throw TypeError(".bilibili.community.service.dm.v1.Label.content: array expected");
                                        m.content = [];
                                        for (var i = 0; i < d.content.length; ++i) {
                                            m.content[i] = String(d.content[i]);
                                        }
                                    }
                                    return m;
                                };
                                Label.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.arrays || o.defaults) {
                                        d.content = [];
                                    }
                                    if (o.defaults) {
                                        d.title = "";
                                    }
                                    if (m.title != null && m.hasOwnProperty("title")) {
                                        d.title = m.title;
                                    }
                                    if (m.content && m.content.length) {
                                        d.content = [];
                                        for (var j = 0; j < m.content.length; ++j) {
                                            d.content[j] = m.content[j];
                                        }
                                    }
                                    return d;
                                };
                                Label.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                Label.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.Label";
                                };
                                return Label;
                            }();
                            v1.CheckboxType = function() {
                                const valuesById = {}, values = Object.create(valuesById);
                                values[valuesById[0] = "CheckboxTypeNone"] = 0;
                                values[valuesById[1] = "CheckboxTypeEncourage"] = 1;
                                values[valuesById[2] = "CheckboxTypeColorDM"] = 2;
                                return values;
                            }();
                            v1.Button = function() {
                                function Button(p) {
                                    if (p) for (var ks = Object.keys(p), i = 0; i < ks.length; ++i) if (p[ks[i]] != null) this[ks[i]] = p[ks[i]];
                                }
                                Button.prototype.text = "";
                                Button.prototype.action = 0;
                                Button.decode = function decode(r, l, e) {
                                    if (!(r instanceof $Reader)) r = $Reader.create(r);
                                    var c = l === undefined ? r.len : r.pos + l, m = new $root.bilibili.community.service.dm.v1.Button;
                                    while (r.pos < c) {
                                        var t = r.uint32();
                                        if (t === e) break;
                                        switch (t >>> 3) {
                                          case 1:
                                            {
                                                m.text = r.string();
                                                break;
                                            }

                                          case 2:
                                            {
                                                m.action = r.int32();
                                                break;
                                            }

                                          default:
                                            r.skipType(t & 7);
                                            break;
                                        }
                                    }
                                    return m;
                                };
                                Button.fromObject = function fromObject(d) {
                                    if (d instanceof $root.bilibili.community.service.dm.v1.Button) return d;
                                    var m = new $root.bilibili.community.service.dm.v1.Button;
                                    if (d.text != null) {
                                        m.text = String(d.text);
                                    }
                                    switch (d.action) {
                                      default:
                                        if (typeof d.action === "number") {
                                            m.action = d.action;
                                            break;
                                        }
                                        break;

                                      case "ToastFunctionTypeNone":
                                      case 0:
                                        m.action = 0;
                                        break;

                                      case "ToastFunctionTypePostPanel":
                                      case 1:
                                        m.action = 1;
                                        break;
                                    }
                                    return m;
                                };
                                Button.toObject = function toObject(m, o) {
                                    if (!o) o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        d.text = "";
                                        d.action = o.enums === String ? "ToastFunctionTypeNone" : 0;
                                    }
                                    if (m.text != null && m.hasOwnProperty("text")) {
                                        d.text = m.text;
                                    }
                                    if (m.action != null && m.hasOwnProperty("action")) {
                                        d.action = o.enums === String ? $root.bilibili.community.service.dm.v1.ToastFunctionType[m.action] === undefined ? m.action : $root.bilibili.community.service.dm.v1.ToastFunctionType[m.action] : m.action;
                                    }
                                    return d;
                                };
                                Button.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, minimal.util.toJSONOptions);
                                };
                                Button.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                                    if (typeUrlPrefix === undefined) {
                                        typeUrlPrefix = "type.googleapis.com";
                                    }
                                    return typeUrlPrefix + "/bilibili.community.service.dm.v1.Button";
                                };
                                return Button;
                            }();
                            v1.AvatarType = function() {
                                const valuesById = {}, values = Object.create(valuesById);
                                values[valuesById[0] = "AvatarTypeNone"] = 0;
                                values[valuesById[1] = "AvatarTypeNFT"] = 1;
                                return values;
                            }();
                            v1.ToastFunctionType = function() {
                                const valuesById = {}, values = Object.create(valuesById);
                                values[valuesById[0] = "ToastFunctionTypeNone"] = 0;
                                values[valuesById[1] = "ToastFunctionTypePostPanel"] = 1;
                                return values;
                            }();
                            return v1;
                        }();
                        return dm;
                    }();
                    return service;
                }();
                return community;
            }();
            return bilibili;
        })();
        // ./src/BiliDanmaku.js
        // src/BiliDanmaku.js
        const dmPbRoot = bilibili.community.service.dm.v1;
        class BiliDmApi {
            constructor(client) {
                this.client = client;
            }
            async getXml(cid, responseType = "document") {
                return await this.client.request({
                    url: "https://api.bilibili.com/x/v1/dm/list.so",
                    params: {
                        oid: cid
                    },
                    responseType,
                    desc: `获取弹幕 XML cid=${cid}`
                });
            }
            async getPbWebView(cid, avid, duration) {
                return await this.client.request({
                    url: "https://api.bilibili.com/x/v2/dm/web/view",
                    params: {
                        type: 1,
                        oid: cid,
                        pid: avid,
                        duration
                    },
                    responseType: "arraybuffer",
                    desc: `获取弹幕元数据 cid=${cid}`
                });
            }
            async getPbSeg(cid, avid, segment_index) {
                return await this.client.request({
                    url: "https://api.bilibili.com/x/v2/dm/web/seg.so",
                    params: {
                        type: 1,
                        oid: cid,
                        pid: avid,
                        segment_index
                    },
                    responseType: "arraybuffer",
                    desc: `获取弹幕片段 ${segment_index} cid=${cid}`
                });
            }
            async getHisDate(cid, month) {
                const res = await this.client.request({
                    url: "https://api.bilibili.com/x/v2/dm/history/index",
                    params: {
                        type: 1,
                        oid: cid,
                        month
                    },
                    responseType: "json",
                    desc: `获取弹幕历史日期 month=${month} cid=${cid}`
                });
                return res.data || [];
            }
            async getHisPb(cid, date) {
                return await this.client.request({
                    url: "https://api.bilibili.com/x/v2/dm/web/history/seg.so",
                    params: {
                        type: 1,
                        oid: cid,
                        date
                    },
                    responseType: "arraybuffer",
                    desc: `获取弹幕历史片段 date=${date} cid=${cid}`
                });
            }
            async getLikes(cid, idList) {
                if (!idList.length) {
                    return {};
                }
                const ids = idList.join(",");
                const res = await this.client.request({
                    url: "https://api.bilibili.com/x/v2/dm/thumbup/stats",
                    params: {
                        oid: cid,
                        ids
                    },
                    desc: `获取弹幕点赞数 cid=${cid} ids=${ids}`
                });
                return res.data || {};
            }
        }
        class BiliDanmaku {
            constructor(ctx, info) {
                this.ctx = ctx;
                this.info = info || {};
                this.client = ctx.client;
                this.logger = ctx.logger || new Proxy({}, {
                    get: () => () => {}
                });
                this.api = new BiliDmApi(this.client);
                this.data = {};
                this.dmDict = {};
                this.dmCount = 0;
                this.errors = {
                    segments: [],
                    //分片错误记录
                    dates: []
                };
                this.dateError = [];
 //历史日期错误记录
                        }
            static parsePb(buffer, type) {
                const protoType = dmPbRoot[type];
                if (!protoType) {
                    throw new Error(`未知的 protobuf 类型: ${type}`);
                }
                const uint8Array = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
                const message = protoType.decode(uint8Array);
                return protoType.toObject(message, {
                    enums: String,
                    // 枚举转为字符串，易读
                    // longs: String, // 关键：B站很多 ID 是长整型，转为字符串防止丢失精度
                    bytes: String
                });
            }
            static parseXml(xml) {
                if (!xml) return [];
                const dmList = [];
                const pushDm = (p, content) => {
                    if (!p) return;
                    const parts = p.split(",");
                    if (parts.length < 7) return;
                    dmList.push({
                        progress: Math.trunc(parseFloat(parts[0]) * 1e3),
                        mode: parseInt(parts[1]),
                        fontsize: parseInt(parts[2]),
                        color: parseInt(parts[3]),
                        ctime: parseInt(parts[4]),
                        pool: parseInt(parts[5]),
                        midHash: parts[6],
                        id: parseInt(parts[7]),
                        idStr: parts[7],
                        weight: parseInt(parts[8] || "0"),
                        content
                    });
                };
                if (typeof xml === "string") {
                    const regex = /<d p="([^"]+)">([^<]*)<\/d>/g;
                    let match;
                    while ((match = regex.exec(xml)) !== null) {
                        pushDm(match[1], match[2]);
                    }
                } else {
                    const dElements = xml.getElementsByTagName("d");
                    for (const d of dElements) {
                        pushDm(d.getAttribute("p"), d.textContent);
                    }
                }
                return dmList;
            }
            setData(data) {
                this.clearData();
                if (data.danmaku_view) this.data.danmaku_view = data.danmaku_view;
                const danmaku_list = data.danmaku_list;
                if (danmaku_list?.length) {
                    danmaku_list.forEach(dm => this.addDm(dm));
                }
                this.buildData();
            }
            clearData() {
                this.dmDict = {};
                this.buildData();
                if (this.data.danmaku_view) delete this.data.danmaku_view;
            }
            buildData() {
                this.data.danmaku_list = Object.values(this.dmDict);
                this.dmCount = this.data.danmaku_list.length;
            }
            addDm(danmaku) {
                const dmid = danmaku.idStr ?? String(danmaku.id);
                danmaku.progress ??= 0;
                if (this.dmDict[dmid]) {
                    Object.assign(this.dmDict[dmid], danmaku);
                } else {
                    this.dmDict[dmid] = {
                        ...danmaku
                    };
                }
            }
            async getDmXml() {
                const desc = "获取XML实时弹幕";
                const cid = this.info.cid;
                if (!cid) {
                    this.logger.warn(desc + "失败，未找到cid，请检查info");
                    return -1;
                }
                this.logger.time(desc + " 总耗时");
                const startDmCount = this.dmCount;
                const xml = await this.api.getXml(cid);
                const dmList = this.constructor.parseXml(xml);
                dmList.forEach(d => this.addDm(d));
                this.buildData();
                this.logger.timeEnd(desc + " 总耗时");
                this.logger.log("新增弹幕", this.dmCount - startDmCount);
                return this.dmCount - startDmCount;
            }
            async getDmPb(onProgress = () => {}, concurrentLimit = 10, retry = false) {
                const desc = "获取Protobuf实时弹幕";
                const {cid, aid, duration} = this.info;
                if (!cid || !aid || !duration) {
                    this.logger.warn(desc + "失败，未找到cid/aid/duration，请检查info");
                    return -1;
                }
                this.logger.time(desc + " 总耗时");
                const startDmCount = this.dmCount;
                let segments = [];
                let segCount = 0;
                if (retry) {
                    segments = [ ...this.errors.segments ];
                    segCount = segments.length;
                    this.errors.segments = [];
                } else {
                    const pbViewBuf = await this.api.getPbWebView(cid, aid, duration);
                    const pbView = this.constructor.parsePb(pbViewBuf, "DmWebViewReply");
                    if (pbView) this.data.danmaku_view = pbView;
                    const pageSize = pbView?.dmSge?.pageSize / 1e3 || 360;
                    segCount = Math.floor(duration / pageSize) + 1;
                    segments = Array.from({
                        length: segCount
                    }, (_, i) => i + 1);
                }
                let finished = 0;
                await promiseLimit(segments, concurrentLimit, async segIndex => {
                    let segDmCount = 0;
                    try {
                        const segBuf = await this.api.getPbSeg(cid, aid, segIndex);
                        const segData = this.constructor.parsePb(segBuf, "DmSegMobileReply");
                        if (segData?.elems?.length) {
                            segData.elems.forEach(elem => this.addDm(elem));
                            segDmCount = segData.elems.length;
                        }
                    } catch (e) {
                        this.logger.error(desc + `分片 ${segIndex} 失败`, e);
                        this.errors.segments.push(segIndex);
                    } finally {
                        finished++;
                        onProgress(finished, segCount, `第 ${segIndex} 段`, segDmCount);
 // 注意：并发模式下，单个分片弹幕数需自行记录
                                        }
                });
                this.buildData();
                this.logger.timeEnd(desc + " 总耗时");
                this.logger.log("新增弹幕", this.dmCount - startDmCount);
                return this.dmCount - startDmCount;
            }
            async getDmPbHisByD(dates, onProgress = () => {}) {
                const dateCount = dates?.length || 0;
                if (!Array.isArray(dates) || dateCount === 0) {
                    return 0;
                }
                const desc = `获取 ${dateCount} 天历史弹幕`;
                const cid = this.info.cid;
                if (!cid) {
                    this.logger.warn(desc + "失败，未找到cid，请检查info");
                    return -1;
                }
                this.logger.time(desc + " 总耗时");
                const startDmCount = this.dmCount;
                let finished = 0;
                let minCtime = Infinity;
                const sortedDates = [ ...dates ].sort((a, b) => b.localeCompare(a));
                for (const date of sortedDates) {
                    let segDmCount = 0;
                    const dayStartTime = dateToTimestamp(date);
                    if (minCtime <= dayStartTime) {
                        finished++;
                        onProgress(finished, dateCount, `${date} (跳过)`, 0);
                        continue;
                    }
                    try {
                        const segBuf = await this.api.getHisPb(cid, date);
                        const segData = this.constructor.parsePb(segBuf, "DmSegMobileReply");
                        if (segData?.elems?.length) {
                            segData.elems.forEach(elem => {
                                this.addDm(elem);
                                if (elem.ctime < minCtime) {
                                    minCtime = elem.ctime;
                                }
                            });
                            segDmCount = segData.elems.length;
                        } else {
                            if (minCtime > dayStartTime) {
                                minCtime = dayStartTime;
                            }
                        }
                    } catch (e) {
                        this.logger.error(`获取历史日期 ${date} 弹幕失败`, e);
                        this.errors.dates.push(date);
                    } finally {
                        finished++;
                        onProgress(finished, dateCount, date, segDmCount);
                    }
                }
                this.buildData();
                this.logger.timeEnd(desc + " 总耗时");
                this.logger.log("新增弹幕", this.dmCount - startDmCount);
                return this.dmCount - startDmCount;
            }
            async getDmPbHisByM(month, onProgress = () => {}) {
                const desc = `获取 ${month} 历史弹幕`;
                const cid = this.info.cid;
                if (!cid) {
                    this.logger.warn(desc + "失败，未找到cid，请检查info");
                    return -1;
                }
                if (!/^\d{4}-\d{2}$/.test(month)) {
                    this.logger.warn(desc + '失败，参数不合法，应为 "YYYY-MM" 格式');
                    return -1;
                }
                this.logger.time(desc + " 总耗时");
                const dates = await this.api.getHisDate(cid, month);
                const dmRise = await this.getDmPbHisByD(dates, onProgress);
                this.logger.timeEnd(desc + " 总耗时");
                return dmRise;
            }
            async getDmPbHisRange(range = {}, onProgress = () => {}) {
                const desc = `获取范围历史弹幕`;
                const {cid, pubtime} = this.info;
                if (!cid || !pubtime) {
                    this.logger.warn(desc + "失败，未找到cid或pubtime，请检查info");
                    return -1;
                }
                const nowSec = Math.floor(Date.now() / 1e3);
                let startSec = Math.max(dateToTimestamp(range.start) ?? pubtime, pubtime);
                let endSec = Math.min(dateToTimestamp(range.end, 24) ?? nowSec, nowSec);
                if (endSec < startSec) {
                    this.logger.warn(desc + "错误，结束时间早于起始时间");
                    return -1;
                }
                const generateMonthList = (startSec, endSec) => {
                    const start = new Date(startSec * 1e3);
                    const end = new Date(endSec * 1e3);
                    const months = [];
                    let curr = new Date(start.getFullYear(), start.getMonth(), 1);
                    while (curr <= end) {
                        const yyyy = curr.getFullYear();
                        const mm = String(curr.getMonth() + 1).padStart(2, "0");
                        months.push(`${yyyy}-${mm}`);
                        curr.setMonth(curr.getMonth() + 1);
                    }
                    return months;
                };
                this.logger.time(desc + " 总耗时");
                const months = generateMonthList(startSec, endSec);
                let dates = [];
                let scannedMonths = 0;
                for (const month of months) {
                    let dateCount = 0;
                    try {
                        const oneMonthDates = await this.api.getHisDate(cid, month);
                        if (Array.isArray(oneMonthDates)) {
                            dates.push(...oneMonthDates);
                            dateCount = oneMonthDates.length;
                        }
                    } catch (e) {
                        this.logger.error(`扫描月份 ${month} 失败`, e);
                    } finally {
                        scannedMonths++;
                        onProgress(scannedMonths, months.length, `扫描月份: ${month}`, dateCount);
                    }
                }
                const startDateStr = timestampToDate(startSec);
                const endDateStr = timestampToDate(endSec);
                dates = [ ...new Set(dates) ].filter(d => d >= startDateStr && d <= endDateStr);
                const dmRise = await this.getDmPbHisByD(dates, onProgress);
                this.logger.timeEnd(desc + " 总耗时");
                return dmRise;
            }
            async retryErrors(onProgress = () => {}) {
                if (this.errors.segments.length) {
                    await this.getDmPb(onProgress, 1, true);
                }
                if (this.errors.dates.length) {
                    const dates = [ ...this.errors.dates ];
                    this.errors.dates = [];
                    await this.getDmPbHisByD(dates, onProgress);
                }
            }
        }
        // ./src/BiliComment.js
        // src/BiliComment.js
        class BiliCmtApi {
            constructor(client) {
                this.client = client;
            }
            async getMain(type, oid, mode = 2, offset = "") {
                const params = {
                    type,
                    oid,
                    mode
                };
                if (typeof offset === "string") params.pagination_str = JSON.stringify({
                    offset
                });
                const res = await this.client.request({
                    url: "https://api.bilibili.com/x/v2/reply/wbi/main",
                    params,
                    responseType: "json",
                    sign: true,
                    desc: `获取评论主列表 oid=${oid} type=${type} mode=${mode} offset=${offset}`
                });
                return res?.data;
            }
            async getReply({type, oid, root, pn = 1, ps = 10}) {
                const res = await this.client.request({
                    url: "https://api.bilibili.com/x/v2/reply/reply",
                    params: {
                        type,
                        oid,
                        root,
                        pn,
                        ps
                    },
                    responseType: "json",
                    desc: `获取子评论列表 oid=${oid} type=${type} root=${root} pn=${pn} ps=${ps}`
                });
                return res?.data || {};
            }
            async getCount({type, oid}) {
                const res = await this.client.request({
                    url: "https://api.bilibili.com/x/v2/reply/count",
                    params: {
                        type,
                        oid
                    },
                    responseType: "json",
                    desc: `获取评论总数 oid=${oid} type=${type}`
                });
                return res?.data;
            }
        }
        class ReplyTree {
            constructor() {
                this.clear();
            }
            clear() {
                this.dict = {};
 // rpid -> full reply
                                this.nodes = {};
 // rpid -> { rpid, root,parent,dialog, rcount }
                                this.topSet = new Set;
            }
            pickId(r, key) {
                const v = r?.[`${key}_str`] ?? r?.[key];
                return v ? String(v) : "0";
            }
            validId(id) {
                return id && id !== "0";
            }
            setTop(topReplies) {
                this.topSet.clear();
                const arr = Array.isArray(topReplies) ? topReplies : [];
                arr.forEach(r => {
                    const rpid = this.pickId(r, "rpid");
                    if (this.validId(rpid)) {
                        this.topSet.add(rpid);
                    }
                });
            }
            _add(reply) {
                if (!reply) return;
                const rpid = this.pickId(reply, "rpid");
                if (!this.validId(rpid)) return;
                if (this.dict[rpid]) Object.assign(this.dict[rpid], reply); else this.dict[rpid] = {
                    ...reply
                };
            }
            add(reply) {
                this._add(reply);
                if (Array.isArray(reply?.replies)) {
                    for (const sub of reply.replies) this._add(sub);
                }
            }
            addList(list) {
                if (!Array.isArray(list)) return;
                for (const r of list) this.add(r);
            }
            _ensureNode(rpid, init) {
                if (!this.nodes[rpid]) {
                    this.nodes[rpid] = {
                        rpid,
                        root: "0",
                        dialog: "0",
                        parent: "0",
                        rcount: 0,
                        level: 0,
                        // 0:占位 1:根评论 2:二级评论 3:三级评论 4:三级以上评论
                        isPlaceholder: true,
                        // 占位
                        isLinked: false,
                        // 是否已链接
                        childrenSet: new Set,
                        dialogSet: null,
                        // 二级 才有
                        subSet: null,
                        // 根 才有
                        ...init
                    };
                }
                return this.nodes[rpid];
            }
            _linkNode(node) {
                if (node.isLinked) return;
                const {rpid, root, parent, dialog} = node;
                if (this.validId(root)) {
                    const rootNode = this._ensureNode(root, {
                        level: 1
                    });
                    rootNode.subSet ??= new Set;
                    rootNode.subSet.add(rpid);
                    if (rootNode.isPlaceholder) this._linkNode(rootNode);
                }
                if (this.validId(dialog) && rpid !== dialog) {
                    const dialogNode = this._ensureNode(dialog, {
                        root,
                        dialog,
                        parent: root,
                        level: 2
                    });
                    dialogNode.dialogSet ??= new Set;
                    dialogNode.dialogSet.add(rpid);
                    if (dialogNode.isPlaceholder) this._linkNode(dialogNode);
                }
                if (this.validId(parent)) {
                    let init = {
                        level: node.level - 1
                    };
                    if (node.level === 3) init = {
                        root,
                        dialog,
                        parent: root,
                        level: 2
                    }; else if (node.level > 3) init = {
                        root,
                        dialog,
                        parent: dialog,
                        level: 3
                    };
                    const parentNode = this._ensureNode(parent, init);
                    parentNode.childrenSet.add(rpid);
                    if (parentNode.isPlaceholder) this._linkNode(parentNode);
                }
                node.isLinked = true;
            }
            buildNodes() {
                this.nodes = {};
                for (const [rpid, reply] of Object.entries(this.dict)) {
                    const root = this.pickId(reply, "root");
                    const parent = this.pickId(reply, "parent");
                    const dialog = this.pickId(reply, "dialog");
                    const node = this._ensureNode(rpid, {
                        root,
                        dialog,
                        parent
                    });
                    node.isPlaceholder = false;
                    if (root === "0") node.level = 1; else if (root === parent) node.level = 2; else if (parent === dialog) node.level = 3; else node.level = 4;
                    node.rcount = reply.rcount ?? 0;
                }
                Object.values(this.nodes).forEach(node => this._linkNode(node));
                return this.nodes;
            }
            getIncompleteRoots() {
                return Object.values(this.nodes).filter(node => {
                    if (node.isPlaceholder) return false;
                    if (node.level !== 1) return false;
                    const sub = node.subSet;
                    let localRealCount = 0;
                    if (sub) {
                        for (const id of sub) {
                            const n = this.nodes[id];
                            if (n && !n.isPlaceholder) localRealCount++;
                        }
                    }
                    return node.rcount !== localRealCount;
                }).map(node => node.rpid);
            }
            toTree({depth = 2, sort = "like"} = {}) {
                if (!this.nodes || Object.keys(this.nodes).length === 0) {
                    this.buildNodes();
                }
                const nodes = this.nodes;
                const dict = this.dict;
                const getTime = id => {
                    const r = dict?.[id];
                    const num = Number(r?.ctime ?? 0);
                    return Number.isFinite(num) ? num : 0;
                };
                const getLike = id => {
                    const r = dict?.[id];
                    const num = Number(r?.like ?? 0);
                    return Number.isFinite(num) ? num : 0;
                };
                const getReplyCount = id => {
                    const r = dict?.[id];
                    const num = Number(r?.rcount ?? 0);
                    return Number.isFinite(num) ? num : 0;
                };
                const sortIds = (ids, isRoot = false) => ids.sort((a, b) => {
                    if (isRoot) {
                        const at = this.topSet?.has(a) ? 0 : 1;
                        const bt = this.topSet?.has(b) ? 0 : 1;
                        if (at !== bt) return at - bt;
                        if (sort === "like") {
                            const la = getLike(a), lb = getLike(b);
                            if (la !== lb) return lb - la;
 // 点赞：高到低
                                                } else if (sort === "reply") {
                            const ra = getReplyCount(a), rb = getReplyCount(b);
                            if (ra !== rb) return rb - ra;
 // 回复数：高到低
                                                }
                    }
                    const ta = getTime(a), tb = getTime(b);
                    if (ta !== tb) return ta - tb;
 // 时间：旧到新
                                        return String(a).localeCompare(String(b));
                });
                const items = {};
                for (const [rpid] of Object.entries(nodes)) {
                    items[rpid] = {
                        rpid,
                        reply: dict?.[rpid] ?? null
                    };
                    if (this.topSet?.has(rpid)) items[rpid].isTop = true;
                }
                const idsToNodes = (ids, childBuilder) => {
                    if (!ids) return [];
                    return sortIds([ ...ids ]).map(cid => childBuilder(cid)).filter(Boolean);
                };
                const built = new Map;
                const buildNode = id => {
                    const it = items[id];
                    if (!it) return null;
                    if (built.has(id)) return built.get(id);
                    const node = nodes?.[id];
                    built.set(id, it);
                    if (depth === 1) {
                        if (node?.level === 1) {
                            it.children = idsToNodes(node?.subSet, cid => items[cid]);
                        }
                    } else if (depth === 2) {
                        if (node?.level === 1) {
                            it.children = idsToNodes(node?.childrenSet, cid => buildNode(cid));
                        } else if (node?.level === 2) {
                            it.children = idsToNodes(node?.dialogSet, cid => items[cid]);
                        }
                    } else {
                        it.children = idsToNodes(node?.childrenSet, cid => buildNode(cid));
                    }
                    if (it.children && it.children.length > 0) {
                        it.rcount = it.children.reduce((acc, child) => {
                            if (child.reply) {
                                return acc + 1 + (child.rcount || 0);
                            } else {
                                return acc + (child.rcount || 0);
                            }
                        }, 0);
                    } else {
                        it.rcount = 0;
                    }
                    return it;
                };
                const rootIds = Object.values(nodes).filter(n => n && n.level === 1 && items[n.rpid]).map(n => n.rpid);
                return sortIds(rootIds, true).map(buildNode).filter(Boolean);
            }
        }
        class BiliComment {
            constructor(ctx, info) {
                this.ctx = ctx;
                this.info = info || {};
                this.client = ctx.client;
                this.logger = ctx.logger || new Proxy({}, {
                    get: () => () => {}
                });
                this.api = new BiliCmtApi(this.client);
                this.data = {};
                this.replyTree = new ReplyTree;
                this.replyCount = 0;
                this.sleepTime = {
                    long: {
                        base: 2e3,
                        jitter: 2e3
                    },
                    short: {
                        base: 500,
                        jitter: 500
                    }
                };
            }
            setData(data) {
                this.clearData();
                const topReplies = data.top_comment_list || [];
                if (topReplies.length) {
                    this.data.top_comment_list = topReplies;
                    this.replyTree.setTop(topReplies);
                    this.replyTree.addList(topReplies);
                }
                const replies = data.comment_list || [];
                this.replyTree.addList(replies);
                this.buildData();
            }
            clearData() {
                this.replyTree.clear();
                this.buildData();
                if (this.data.top_comment_list) delete this.data.top_comment_list;
            }
            buildData() {
                this.replyTree.buildNodes();
                this.data.comment_list = Object.values(this.replyTree.dict);
                this.replyCount = this.data.comment_list.length;
            }
            async getMainPage(mode = 2, offset = "") {
                const {type, oid} = this.info;
                if (!type || !oid) {
                    this.logger.warn("获取主评论失败：未找到 type/oid，请检查 info");
                    return {
                        rise: -1,
                        nextOffset: "",
                        pageData: null
                    };
                }
                const startCount = this.replyCount;
                const pageData = await this.api.getMain(type, oid, mode, offset);
                if (!pageData) {
                    throw new Error("获取主评论失败：无返回数据");
                }
                const replies = pageData.replies || [];
                const topReplies = pageData.top_replies || [];
                if (topReplies.length) {
                    this.data.top_comment_list = topReplies;
                    this.replyTree.setTop(topReplies);
                    this.replyTree.addList(topReplies);
                }
                this.replyTree.addList(replies);
                this.buildData();
                const next = pageData?.cursor?.pagination_reply?.next_offset;
                const nextOffset = next ? String(next) : "";
                return {
                    rise: this.replyCount - startCount,
                    nextOffset,
                    pageData
                };
            }
            async getMain({mode = 2, within = -1, sub = false} = {}) {
                const desc = "获取评论主列表";
                let stopCtime = null;
                if (within < 0) {
                    stopCtime = null;
                } else if (within === 0) {
                    let latest = 0;
                    for (const r of Object.values(this.replyTree?.dict || {})) {
                        // 只统计根评论
                        const rootId = this.replyTree.pickId(r, "root");
                        if (rootId === "0") {
                            const t = Number(r?.ctime ?? 0);
                            if (Number.isFinite(t) && t > latest) latest = t;
                        }
                    }
                    stopCtime = latest;
                } else {
                    const now = Math.floor(Date.now() / 1e3);
                    stopCtime = now - within;
                }
                this.logger.time(desc + " 总耗时");
                const startCount = this.replyCount;
                let offset = "";
                let page = 0;
                while (true) {
                    try {
                        const {nextOffset, pageData} = await this.getMainPage(mode, offset);
                        page++;
                        if (stopCtime !== null) {
                            const list = pageData?.replies || [];
                            let hitOlder = false;
                            for (const r of list) {
                                const t = Number(r?.ctime ?? 0);
                                if (Number.isFinite(t) && t > 0 && t < stopCtime) {
                                    hitOlder = true;
                                    break;
                                }
                            }
                            if (hitOlder) break;
                        }
                        await sleep({
                            ...this.sleepTime?.long,
                            beforeFn: d => this.logger.log(`${desc} 第${page + 1}页，延时 ${d} 毫秒`)
                        });
                        if (sub) await this.getSub();
                        if (!nextOffset) break;
                        offset = nextOffset;
                    } catch (e) {
                        this.logger.error(`${desc} 第${page + 1}页失败 offset=${offset}`, e);
                        break;
                    }
                }
                this.logger.timeEnd(desc + " 总耗时");
                this.logger.log("新增评论", this.replyCount - startCount);
                return this.replyCount - startCount;
            }
            async getSub(rootId = null) {
                const {type, oid} = this.info;
                if (!type || !oid) {
                    this.logger.warn("获取子评论列表 失败：未找到 type/oid，请检查参数");
                    return -1;
                }
                let roots = [];
                if (!rootId) {
                    roots = this.replyTree.getIncompleteRoots();
                } else if (Array.isArray(rootId)) {
                    roots = rootId;
                } else {
                    roots = [ rootId ];
                }
                if (roots.length === 0) {
                    return 0;
                }
                const startCount = this.replyCount;
                for (let i = 0; i < roots.length; i++) {
                    const root = roots[i];
                    const desc = `获取子评论列表 root=${root}`;
                    this.logger.time(desc + " 总耗时");
                    const rootObj = this.replyTree.dict[root];
                    let pn = 1;
                    while (true) {
                        try {
                            const data = await this.api.getReply({
                                type,
                                oid,
                                root,
                                pn,
                                ps: 20
                            });
                            const replies = data?.replies || [];
                            if (!replies.length) break;
                            this.replyTree.addList(replies);
                            const page = data?.page;
                            if (!page) break;
                            const num = Number(page.num || pn);
                            const size = Number(page.size || 20);
                            const count = Number(page.count || 0);
                            if (rootObj) rootObj.rcount = count;
                            if (num * size >= count) break;
                            pn = num + 1;
                            await sleep({
                                ...this.sleepTime.short,
                                beforeFn: d => this.logger.log(`${desc} 第${pn}页，延时 ${d} 毫秒`)
                            });
                        } catch (e) {
                            this.logger.error(`${desc} 页码 ${pn} 失败`, e);
                            break;
                        }
                    }
                    this.logger.timeEnd(desc + " 总耗时");
                    if (i < roots.length - 1) {
                        await sleep({
                            ...this.sleepTime.short,
                            beforeFn: d => this.logger.log(`${desc} [${i + 1}/${roots.length}]，延时 ${d} 毫秒`)
                        });
                    }
                }
                this.buildData();
                this.logger.log("新增评论", this.replyCount - startCount);
                return this.replyCount - startCount;
            }
            async getReply() {
                await this.getMain({
                    sub: true
                });
                await this.getSub();
            }
            async getCount() {
                const {type, oid} = this.info;
                if (!type || !oid) throw new Error("获取评论数量失败：未找到 type/oid，请检查 info");
                return this.api.getCount({
                    type,
                    oid
                });
            }
        }
        // ./src/index.js
        // src/index.js
        function create(config) {
            let {name, httpRequest, handlers, isLog, loggerColor} = config || {};
            if (!httpRequest) throw new Error("httpRequest is required");
            name = name || "BiliDataManager";
            isLog = isLog !== false;
            loggerColor = loggerColor || "#01a1d6";
            const logger = new Proxy(console, {
                get(target, prop) {
                    if (!isLog) {
                        return () => {};
                    }
                    const original = target[prop];
                    if (typeof original !== "function") return original;
                    // 需要添加样式前缀的方法列表
                                        const styledMethods = [ "log", "warn", "error", "info", "debug" ];
                    if (styledMethods.includes(prop)) {
                        return (...args) => original.bind(target, `%c${name}`, `background:${loggerColor};color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold;`, ...args)();
                    }
                    return original.bind(target);
                }
            });
            const client = new BiliClient(httpRequest, logger);
            const ctx = {
                client,
                logger
            };
            const BoundArchive = class extends BiliArchive {
                constructor() {
                    super(ctx, handlers);
                }
            };
            const BoundDanmaku = class extends BiliDanmaku {
                constructor(info) {
                    super(ctx, info);
                }
            };
            const BoundComment = class extends BiliComment {
                constructor(info) {
                    super(ctx, info);
                }
            };
            return {
                name,
                client,
                logger,
                BiliArchive: BoundArchive,
                BiliDanmaku: BoundDanmaku,
                BiliComment: BoundComment
            };
        }
    })();
    /******/    return __webpack_exports__;
    /******/})());