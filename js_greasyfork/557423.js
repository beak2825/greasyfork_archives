// ==UserScript==
// @name         PonyTownImportPony
// @name:en      PonyTownImportPony
// @name:zh      PonyTown小马皮肤导入
// @name:zh-CN   PonyTown小马皮肤导入
// @name:zh-TW   PonyTown小馬角色導入
// @namespace    https://pony.town/
// @version      0.124.0-alpha
// @description        Use Edit character modal to import your character from the PTC file!!
// @description:en     Use Edit character modal to import your character from the PTC file!!
// @description:zh     使用角色编辑页面从PTC文件导入你的小马皮肤
// @description:zh-CN  使用角色编辑页面从PTC文件导入你的小马皮肤
// @description:zh-TW  使用角色編輯頁面從PTC文件導入妳的小馬角色
// @author       pony
// @tag          PonyTown
// @match        https://pony.town/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEk0AABJNAfOXxKcAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAACiElEQVQ4T2VTz08TQRT+9kd36RZF2lAtUWkqIQoag6goVKOe1JMJF7141EQTT95N/Bs86AUlXozBqOFAYiIXNASbABpQE2OEisRWDKS23Xa3u+s3y1Yh/ZK3M2/mvW++92ZWWpm+5mEz6MmqBK1JRUhVYFVqqFZrwWYj5GD8B6NZw8T4F9y8MoqRe9NYzq4jFFKC3UY0ENhWDSdOdSC2XcMwCW5ffYYsScLhUBCxFf8JKD2kKahICuRYM+48GsKx9F4sr1dRsDwUhQqqEzEitg7V/3JBC6v4kSshOzoJe6kMI7ULRReIxQysjc1h5nEJiLcidbkXiXjE742A30SV7CurZfx+OI507wC051NYncohw4BtVN5HorADkAJve9rQMXwJrYoMx/E2SpB1FcuZRRx+n4dW1OB070BswMCFwQjSXU1QYipMCYjQogu/MP9mCXpEE6mQJUlijQ7k2SxaPgLm3aewXuZRyZgwM2WYnypw8pTLZJfHiZpnXnyGabsQub4C23EhFytBQ4jVNaDGxthBt4JWSyzlD0e1VkWVBAKy53mI8NHY0RaYIkgEC+OJvgUQSyXy5Tg5cDwBXZUhcn1uQ5agn0xhkXN90xVthk6bp+UTIXSe6YIWkPsEVsnCvtNJzBxNwCVBE9dEQn0M075x/QPH1rNJtHfGeY02vYDAZVaUktpu9OMB/SWWN8eE17Sv9Cfoj3EuxSUkLx70ianeh08gUKGKI/27oV7vw336kwx4R3vC5AX6Rguw59YgUj3tsEzLzxHY8jcqfBwen+qrkVkUZr9j56E4cj+rMAoFJM93ofvcfp5k+4rraPidZdFQvvkyr0kjoUyNpuVC53qNJ9elbwD4C/cI7P9NzQfEAAAAAElFTkSuQmCC
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557423/PonyTownImportPony.user.js
// @updateURL https://update.greasyfork.org/scripts/557423/PonyTownImportPony.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const CG = 2533654996;
    const yG = 742503514;

    const nl = 609298432;
    const nx = 5;

    const KP = 4294967295; //2^32
    const A_o = 2786829884; //pony
    const B_o = 3957164208; //plush

    const Safe_Mode = true;

    const version = "0.124.0-alpha";
    const api_version = "KniIkVlo6N";
    
    const zh = navigator.language.startsWith("zh");

    const PonyImportModule = (() => {
        const CONFIG = {
            FILE_EXT: /\.(txt|ptc)( \(\d\))?$/u,
            IMPORT_INTERVAL_TIP: "Can't import all characters at once, wait 15 minutes and try again",
            DEPRECATED_FORMAT_WARN: "WARNING! The current file format is deprecated and support for it will soon be removed"
        };

        const formatImportTips = (importedCount, skippedCount, failureCount, reachLimit, importLimit, isDeprecated) => {
            let tip = `Imported ${importedCount} new character${importedCount !== 1 ? "s" : ""}\n`;
            if (skippedCount) tip += `Skipped ${skippedCount} character${skippedCount !== 1 ? "s" : ""} due to matching the existing ones\n`;
            if (failureCount) tip += `Failed to import ${failureCount} character${failureCount !== 1 ? "s" : ""} due to invalid data or permissions\n`;
            if (reachLimit) tip += "Reached character limit\n";
            if (importLimit) tip += CONFIG.IMPORT_INTERVAL_TIP + "\n";
            if (isDeprecated) tip += CONFIG.DEPRECATED_FORMAT_WARN;
            return tip.trim();
        };

        const validateFileFormat = (file) => {
            return CONFIG.FILE_EXT.test(file.name);
        };

        const isPonyDuplicated = (pony, existingPonies) => {
            return existingPonies.some(item =>
                item.look === pony.look &&
                item.name === pony.name &&
                item.desc === (pony.desc || "") &&
                item.toy === (pony.toy || 0)
            );
        };

        function parsePonyFileContent(content) {
            if (!content.startsWith("{")) {
                const parsedFormat = parseLegacyPonyFormat(content);
                if (parsedFormat) {
                    return { ponies: parsedFormat, deprecated: false };
                }
            }

            if (content.endsWith("\r\n")) {
                return { ponies: parseDeprecatedPonyFormat(content), deprecated: true };
            }

            return null;
        }

        function parsePlushFileContent(content) {
            if (!content.startsWith("{")) {
                const parsedFormat = parseLegacyPlushFormat(content);
                if (parsedFormat) {
                    return { plushes: parsedFormat, deprecated: false };
                }
            }

            return null;
        }

        function jRo(t) {
			if (void 0 !== t) return new Date(t).toISOString()
		}

        function URo(t) {
			return {
				id: rxi(t),
				name: gxi(t),
				look: (i => sT(i, i.byteLength))(pxi(t)), //base64
				lastUsed: jRo(aRo(t))
			}
		}

        function WRo(t) {
			return uxi(_ki(t), URo)
		}

        function IGo(t, i) {
			return !t && i ? 1 : !i && t ? -1 : t || i ? (t || "").localeCompare(i || "") : 0
		}

		function SGo(t, i) {
			return IGo(t.name, i.name) || IGo(t.id, i.id)
		}

        function ParsePlushReturn(t) {
            return WRo(t).sort(SGo);
        }

        function hxi(t, i) {
			const e = vxi(t);
			if (-1 === e) return;
			const n = [];
			for (let o = 0; o < e; o++) n.push(i(t));
			return n
		}

		function uxi(t, i) {
			const e = hxi(t, i);
			if (void 0 === e) throw new Error("Unexpected undefined array");
			return e
		}

        function cxi(t, i, e = t.copyOnRead) {
            const n = t.dataOffset;
            t.dataOffset += i;
            const o = new Uint8Array(t.dataView.buffer, t.dataView.byteOffset + n, i);
            return e ? o.slice() : o
        }

        function vxi(t) {
            if (t.legacyMode) {
                let e = 0,
                    n = 0,
                    o = 0;
                do {
                    var i = Zki(t);
                    e |= (127 & i) << n, n += 7, o++
                } while (128 & i);
                return 2 === o && 0 === e ? -1 : e
            }
            return oxi(t) - 1
        }

        function Axi(t, i = t.copyOnRead) {
            const e = vxi(t);
            if (-1 !== e) return cxi(t, e, i)
        }

        function pxi(t, i = t.copyOnRead) {
            const e = Axi(t, i);
            if (void 0 === e) throw new Error("Unexpected undefined Uint8Array");
            return e
        }

        const parseDeprecatedPonyFormat = (content) => {
            return b_o(content);
        };

        function getPonyDataVersion(parsed) {
            return Zki(parsed);
        }

        function getPonyItemCount(parsed) {
            return vxi(parsed);
        }

        function getPonyName(parsed) {
            return gxi(parsed);
        }

        function getPonyLook(parsed) {
            return pxi(parsed);
        }

        function getPonyDesc(parsed) {
            return gxi(parsed);
        }

        function getPonyDescOld(parsed) {
            return fxi(parsed);
        }

        function getPonySupporterTag(parsed) {
            return Zki(parsed);
        }

        function getPonyBackgroundColor(parsed) {
            return ixi(parsed);
        }

        function getPonyToy(parsed) {
            return $ki(parsed);
        }

        function checkLegacyFlag(parsed) {
            return dxi(parsed);
        }

        function createPonyData(t, i, e, n, o, s, r) {
            return w_o(t, i, e, n, o, s, r);
        }

        function _ki(t, i, e) {
            let n;
            return t instanceof Uint8Array ? (n = t.buffer, null != i || (i = t.byteOffset), null != e || (e = t.byteLength)) : n = t, {
                dataView: new DataView(n, i, e),
                dataOffset: 0,
                readCustomType: void 0,
                copyOnRead: !1
            }
        }

        function dxi(t) {
            return 1 === Zki(t)
        }

        function qki(t) {
            const i = t.dataOffset;
            return t.dataOffset += 1, t.dataView.getInt8(i)
        }

        function Zki(t) {
            const i = t.dataOffset;
            return t.dataOffset += 1, t.dataView.getUint8(i)
        }

        function Xki(t) {
            const i = t.dataOffset;
            return t.dataOffset += 2, t.dataView.getInt16(i, !0)
        }

        function $ki(t) {
            const i = t.dataOffset;
            return t.dataOffset += 2, t.dataView.getUint16(i, !0)
        }

        function txi(t) {
            const i = t.dataOffset;
            return t.dataOffset += 4, t.dataView.getInt32(i, !0)
        }

        function ixi(t) {
            const i = t.dataOffset;
            return t.dataOffset += 4, t.dataView.getUint32(i, !0)
        }

        function exi(t) {
            const i = t.dataOffset;
            return t.dataOffset += 4, t.dataView.getFloat32(i, !0)
        }

        function nxi(t) {
            const i = t.dataOffset;
            return t.dataOffset += 8, t.dataView.getFloat64(i, !0)
        }

        const RY = new TextEncoder,
              PY = new TextDecoder;

        const TY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        const $Y = new ArrayBuffer(4283),
              tT = new Uint8Array($Y, 0, 4096),
              [iT, eT] = (() => {
                  const t = new Uint8Array($Y, 4096, 64),
                        i = new Uint8Array($Y, 4160, 123);
                  for (let e = 0; e < 64; ++e) {
                      const n = TY.charCodeAt(e);
                      t[e] = n, i[n] = e
                  }
                  return i["-".charCodeAt(0)] = 62, i["_".charCodeAt(0)] = 63, [t, i]
              })();

        function sT(t, i = t.byteLength) {
            const e = function({
                byteLength: t
            }) {
                return Math.ceil(4 * t / 3)
            }(t);
            let n;
            n = e <= tT.byteLength ? tT : new Uint8Array(e);
            const o = i % 3,
                  s = i - o;
            let r = 0;
            for (let i = 0; i < s;) {
                const e = t[i++] << 16 | t[i++] << 8 | t[i++];
                n[r++] = iT[e >>> 18], n[r++] = iT[e >>> 12 & 63], n[r++] = iT[e >>> 6 & 63], n[r++] = iT[63 & e]
            }
            if (2 === o) {
                const e = t[i - 2],
                      o = t[i - 1];
                n[r++] = iT[e >>> 2], n[r++] = iT[e << 4 & 63 | o >>> 4], n[r++] = iT[o << 2 & 63]
            } else if (1 === o) {
                const e = t[i - 1];
                n[r++] = iT[e >>> 2], n[r++] = iT[e << 4 & 63]
            }
            return PY.decode(n.byteLength > r ? n.subarray(0, r) : n)
        }

        function oT(t, i) {
            let e = t.length;
            for (; "=" === t[e - 1];) --e;
            const n = Math.floor(3 * e / 4);
            let o;
            void 0 === i ? (i = new Uint8Array(n), o = n) : o = i.byteLength;
            const s = e % 4,
                  r = e - s;
            let a = 0;
            for (let e = 0; e < r && a < o;) {
                const n = eT[t.charCodeAt(e++)],
                      o = eT[t.charCodeAt(e++)],
                      s = eT[t.charCodeAt(e++)],
                      r = eT[t.charCodeAt(e++)];
                if (void 0 === n || void 0 === o || void 0 === s || void 0 === r) throw new Error("Invalid base64 string. Unrecognized character");
                const c = n << 18 | o << 12 | s << 6 | r;
                i[a++] = c >>> 16, i[a++] = c >>> 8, i[a++] = c >>> 0
            }
            if (a >= o) return i;
            if (3 === s) {
                const n = eT[t.charCodeAt(e - 3)],
                      o = eT[t.charCodeAt(e - 2)],
                      s = eT[t.charCodeAt(e - 1)];
                if (void 0 === n || void 0 === o || void 0 === s) throw new Error("Invalid base64 string. Unrecognized character");
                const r = n << 10 | o << 4 | s >>> 2;
                i[a++] = r >>> 8, i[a++] = r
            } else if (2 === s) {
                const n = eT[t.charCodeAt(e - 2)],
                      o = eT[t.charCodeAt(e - 1)];
                if (void 0 === n || void 0 === o) throw new Error("Invalid base64 string. Unrecognized character");
                const s = n << 2 | o >>> 4;
                i[a++] = s
            } else if (1 === s) throw new Error("Invalid base64 string. Got 1 unread character");
            return i
        }

        const parseLegacyPonyFormat = (content) => {
            try {
                const parsed = _ki(oT(content));
                if (!parsed) {
                    console.log("Legacy pony format parse failed: empty parsed data", "warn");
                    return null;
                }
                if (!(ixi(parsed) === A_o)) {
                    PonyButtonModule.showCustomAlert(zh ? "格式错误" : "Format Error", zh ? `文件格式错误: 未知的标记值.<br>请检查选择的小马皮肤文件是否正确.` : `File format error: Unknown tag value.<br>Please check if the selected pony character file is correct.`);
                    console.log(`Legacy pony format parse failed: NO=${A_o}`, "warn");
                    return null;
                }
                const version = getPonyDataVersion(parsed);
                if (version > 4) return null;
                if (version < 3) parsed.legacyMode = true;
                if (Zki(parsed) > 25) return null;
                const ponyList = [];
                const count = getPonyItemCount(parsed);
                for (let i = 0; i < count; ++i) {
                    let ponyData;
                    if (version >= 4) {
                        const e = Zki(parsed);
                        const type = (flag) => CY(e, flag);
                        const name = getPonyName(parsed);
                        const look = getPonyLook(parsed);
                        const desc = type(1) ? getPonyDesc(parsed) : void 0;
                        const respawnAtSpawn = type(2);
                        const supporterTag = type(4) ? getPonySupporterTag(parsed) : void 0;
                        const backgroundColor = type(8) ? getPonyBackgroundColor(parsed) : void 0;
                        const toy = type(16) ? getPonyToy(parsed) : 0;
                        if(!Safe_Mode) ponyData = createPonyData(name, look, desc, respawnAtSpawn, supporterTag, backgroundColor, toy);
                        else ponyData = createPonyData(name == "Pony" ? name + i.toString() : name, look, "", void 0, void 0, backgroundColor, 0);
                    }
                    else {
                        const name = getPonyName(parsed);
                        const look = getPonyLook(parsed);
                        const desc = getPonyDescOld(parsed);
                        const respawnAtSpawn = version >= 1 && checkLegacyFlag(parsed);
                        const supporterTag = version >= 1 ? getPonySupporterTag(parsed) : 0;
                        let backgroundColor;
                        if (version >= 2 && checkLegacyFlag(parsed)) backgroundColor = getPonyBackgroundColor(parsed);
                        if(!Safe_Mode) ponyData = createPonyData(name, look, desc, respawnAtSpawn, supporterTag, backgroundColor, 0);
                        else ponyData = createPonyData(name == "Pony" ? name + i.toString() : name, look, "", void 0, 0, backgroundColor, 0);
                    }
                    ponyData && ponyList.push(ponyData);
                }
                return ponyList.length ? ponyList : null;
            } catch (err) {
                console.log(`Legacy format parse error: ${err.message}`, "error");
                return null;
            }
        };

        const parseLegacyPlushFormat = (content) => {
            try {
                const parsed = _ki(oT(content));
                if (!parsed) {
                    console.log("Legacy plush format parse failed: empty parsed data", "warn");
                    return null;
                }
                if (!(ixi(parsed) === B_o)) {
                    PonyButtonModule.showCustomAlert(zh ? "格式错误" : "Format Error", zh ? `文件格式错误: 未知的标记值.<br>请检查选择的小马玩偶文件是否正确.` : `File format error: Unknown tag value.<br>Please check if the selected plush toy file is correct.`);
                    console.log(`Legacy plush format parse failed: NO=${B_o}`, "warn");
                    return null;
                }
                const version = getPonyDataVersion(parsed);
                if (version > 1) return null;
                if (version < 1) parsed.legacyMode = true;
                if (Zki(parsed) > 1) return null;
                const plushList = [];
                const count = getPonyItemCount(parsed);
                for (let i = 0; i < count; ++i) {
                    let plushData;
                    if (version) {
                        const name = getPonyName(parsed);
                        const look = getPonyLook(parsed);
                        if(!Safe_Mode) plushData = {
                            id: void 0,
                            name: look ? name : void 0,
                            look: look ? sT(look, look.byteLength) : void 0,
                            lastUsed: void 0,
                        };
                        else plushData = {
                            id: void 0,
                            name: look ? (name == "Plush" ? name + i.toString() : name) : void 0,
                            look: look ? sT(look, look.byteLength) : void 0,
                            lastUsed: void 0,
                        }
                    }
                    plushData && plushList.push(plushData);
                }
                return plushList.length ? plushList : null;
            } catch (err) {
                console.log(`Legacy format parse error: ${err.message}`, "error");
                return null;
            }
        };

        function Huo(t) {
            return new Promise((i, e) => {
                const n = new FileReader;
                n.onload = t => {
                    var e;
                    return i((null === (e = t.target) || void 0 === e ? void 0 : e.result) || "")
                }, n.onerror = () => e(new Error("Failed to read file")), n.readAsText(t)
            })
        }

        const CY = (t, i) => !!(t & i);
        const w_o = (t, i, e, n, o, s, r) => {
            if (t && i) try {
                return {
                    name: t,
                    //look: sT(nlo(Yho("string" == typeof i ? oT(i) : i), !1)),
                    look: sT(i,i.byteLength),
                    desc: e,
                    respawnAtSpawn: n,
                    supporterTag: o,
                    backgroundColor: s,
                    toy: r || void 0
                }
            } catch (t) {
                return
            }
        };

        const b_o = (t) => {
            const i = [],
                  e = t.split(/\r?\n/gu);
            for (const t of e) {
                if (!t.trim()) continue; // 跳过空行
                const [e, n, o = ""] = t.split(/\t/gu);
                const s = w_o(e, n, o, !1, 0, void 0, 0);
                s && i.push(s);
            }
            return i;
        };

        const p_o = (t) => {
            try {
                return {
                    name: t.name,
                    id: "",
                    lookCompressed: t.look,
                    desc: t.desc,
                    respawnAtSpawn: t.respawnAtSpawn,
                    supporterTag: t.supporterTag,
                    backgroundColor: t.backgroundColor,
                    toy: t.toy
                }
            } catch (t) {
                console.log(`Process pony error: ${t.message}`, "error");
                return;
            }
        };

        function oxi(t) {
            let i = 0;
            for (let e = 0;; e += 7) {
                const n = Zki(t);
                if (!(128 & n)) {
                    i |= n << e;
                    break
                }
                i |= (127 & n) << e
            }
            return i
        }

        function $gi(t, i, e) {
            const n = new Uint8Array(t.buffer, t.byteOffset + i, e);
            return PY.decode(n);
        }

        function fxi(t) {
            const i = vxi(t);
            if (-1 === i) return;
            const e = $gi(t.dataView, t.dataOffset, i);
            return t.dataOffset += i, e
        }

        function gxi(t) {
            const i = fxi(t);
            if (void 0 === i) throw new Error("Unexpected undefined string");
            return i
        }

        function aRo(t) {
            const i = ixi(t);
            if (i !== KP) return Date.now() - 1e3 * i
        }

        function rxi(t) {
            for (let i = 0; i < 24; i += 8) {
                let e = ixi(t);
                for (let t = 7; t >= 0; --t) {
                    let n = 15 & e;
                    n += n < 10 ? 48 : 87, Tvi[i + t] = n, e >>>= 4
                }
            }
            return PY.decode(Tvi)
        }

        class JJ {
            constructor(t, i) {
                this.create = i, this.offsetBytes = 0, i === Uint16Array || i === Int16Array ? this.sizeof = 2 : i === Uint32Array || i === Int32Array || i === Float32Array ? this.sizeof = 4 : i === Float64Array ? this.sizeof = 8 : this.sizeof = 1, this.capacityBytes = t * this.sizeof >>> 0
            }
            allocate(t) {
                const i = t * this.sizeof >>> 0;
                if (i >= this.capacityBytes / 2) return new this.create(t);
                (!this.current || this.offsetBytes + i > this.capacityBytes) && (this.current = new ArrayBuffer(this.capacityBytes), this.offsetBytes = 0);
                const e = new this.create(this.current, this.offsetBytes, t);
                return this.offsetBytes = this.offsetBytes + i >>> 0, e
            }
            from(t) {
                const i = this.allocate(t.length);
                return i.set(t), i
            }
        }

        const Fvi = new JJ(4160, Uint8Array),
              Rvi = Fvi.allocate(4),
              Pvi = (Fvi.allocate(8), Fvi.allocate(16)),
              Yvi = Fvi.allocate(4096),
              Tvi = Fvi.allocate(24),
              Gvi = (Fvi.allocate(12), new JJ(2048, Uint8Array)),
              Jvi = jvi(),
              Hvi = jvi(255, 255, 255, 255, 255);

        function jvi(t = 1, i = 1, e = 0, n = 0, o = 0, s = 0) {
            return {
                rightEye: t,
                leftEye: i,
                muzzle: e,
                rightIris: n,
                leftIris: o,
                extra: s
            }
        }

        function NRo(t) {
            return "string" == typeof t && (t = oT(t)), t instanceof Uint8Array && (t = _ki(t)),
                function(t) {
                const i = $ki(t),
                      e = t => CY(i, t);
                return {
                    id: rxi(t),
                    name: gxi(t),
                    desc: e(16) ? fxi(t) : void 0,
                    lookCompressed: sT(pxi(t)),
                    site: e(8) ? rxi(t) : void 0,
                    specialTag: e(512) ? Zki(t) : void 0,
                    lastUsed: e(32) ? new Date(aRo(t)).toISOString() : void 0,
                    supporterTag: e(64) ? Zki(t) : void 0,
                    backgroundColor: e(4) ? ixi(t) : void 0,
                    toy: e(128) ? e(256) ? $ki(t) : rxi(t) : void 0,
                    respawnAtSpawn: e(1),
                    persistentTag: e(2)
                }
            }(t)
        }

        function ParsePonyReturn(t) {
            return NRo(t);
        }

        async function importPonies(content) {
            try {
                const fileContent = content;
                //console.log(`文件内容读取完成，长度: ${fileContent.length} 字符`, "info");

                const parsedResult = parsePonyFileContent(fileContent);
                if (!parsedResult?.ponies) {
                    console.log("解析失败：无效或损坏的文件", "error");
                    return;
                }
                console.log(`解析成功，找到 ${parsedResult.ponies.length} 个小马数据`, "success");
                if (parsedResult.deprecated) {
                    console.log("警告：文件格式已弃用", "warn");
                }

                const { ponies: ponyList, deprecated: isDeprecated } = parsedResult;
                const total = ponyList.length;
                const { updateProgress, removeProgress } = PonyButtonModule.createProgressBar(total);

                let importedCount = 0;
                let failureCount = 0;
                let skippedCount = 0;
                let reachLimit = false;
                let importLimit = false;

                const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

                for (const [index, pony] of ponyList.entries()) {
                    try {
                        const processedPony = p_o(pony);
                        if (!processedPony) {
                            skippedCount++;
                            failureCount++;
                            updateProgress(index + 1, importedCount, failureCount, skippedCount);
                            //console.log(`第 ${index + 1} 个小马数据预处理失败，跳过`, "warn");
                            continue;
                        }
                        //console.log(`第 ${index + 1} 个小马数据解析成功: ${JSON.stringify(processedPony)}`, "success");
                        let ponysaveData = PonySaveModule.savePony(processedPony, SendPonyModule.account_id());
                        //console.log(`第 ${index + 1} 个小马数据编译成功: ${ponysaveData}`, "success");
                        try {
                            const result = await SendPonyModule.sendPony(ponysaveData);
                            //const result = { status:true };
                            if (result.status) {
                                importedCount++;
                                console.log(`第 ${index + 1} 个小马数据导入成功: ${processedPony.name || "未知"}`, "success");
                            } else {
                                failureCount++;
                                console.log(`第 ${index + 1} 个小马数据导入失败: ${processedPony.name || "未知"}, 原因: ${result.content || "未知"}`, "error");
                            }
                        } catch (err) {
                            failureCount++;
                            console.error(`第 ${index + 1} 个小马数据导入失败: ${processedPony.name || "未知"}, 原因: ${err.message || err || "未知"}`, "error");
                        }
                    } catch (error) {
                        failureCount++;
                        console.error(`第 ${index + 1} 个小马数据编译失败: ${error.message}`, "error");
                    }
                    updateProgress(index + 1, importedCount, failureCount, skippedCount);
                    await delay(300);
                }

                removeProgress();

                const resultTip = formatImportTips(importedCount, skippedCount, reachLimit, importLimit, isDeprecated);
                console.log(`导入完成：${resultTip}`, "success");
                
                PonyButtonModule.showCustomAlert(zh ? "导入小马" : "Import Ponies", zh ? `共 ${total} 个小马皮肤<br>成功导入 ${importedCount} 个<br>导入失败 ${failureCount} 个` : `A total of ${total} pony character${total !== 1 ? 's' : ''}<br> ${importedCount} successfully imported<br> ${failureCount} failed to import`,true);

                //alert(`文件内共 ${total} 个小马皮肤\n成功导入 ${importedCount} 个小马皮肤\n导入失败 ${failureCount} 个小马皮肤 `)

            } catch (error) {
                removeProgress();
                console.log(`全局导入错误: ${error.message}`, "error");
            }
        }

        async function importPlushes(content) {
            try {
                const fileContent = content;
                //console.log(`文件内容读取完成，长度: ${fileContent.length} 字符`, "info");

                //const parsedResult = (t => ({ plushes: t, deprecated: false }))(JSON.parse(new TextDecoder().decode(oT(fileContent))));
                const parsedResult = parsePlushFileContent(fileContent);
                if (!parsedResult?.plushes) {
                    console.log("解析失败：无效或损坏的文件", "error");
                    return;
                }
                console.log(`解析成功，找到 ${parsedResult.plushes.length} 个玩偶数据`, "success");
                if (parsedResult.deprecated) {
                    console.log("警告：文件格式已弃用", "warn");
                }

                console.log(parsedResult);

                const { plushes: plushList, deprecated: isDeprecated } = parsedResult;
                const total = plushList.length;
                const { updateProgress, removeProgress } = PonyButtonModule.createProgressBar(total);

                let importedCount = 0;
                let failureCount = 0;
                let skippedCount = 0;
                let reachLimit = false;
                let importLimit = false;

                const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

                for (const [index, plush] of plushList.entries()) {
                    try {
                        const processedPlush = plush;
                        if (!processedPlush) {
                            skippedCount++;
                            failureCount++;
                            updateProgress(index + 1, importedCount, failureCount, skippedCount);
                            //console.log(`第 ${index + 1} 个玩偶数据预处理失败，跳过`, "warn");
                            continue;
                        }
                        //console.log(`第 ${index + 1} 个玩偶数据解析成功: ${JSON.stringify(processedPlush)}`, "success");
                        let plushsaveData = PonySaveModule.savePlush(processedPlush, SendPonyModule.account_id());
                        //console.log(`第 ${index + 1} 个玩偶数据编译成功: ${plushsaveData}`, "success");
                        try {
                            const result = await SendPonyModule.sendPlush(plushsaveData);
                            //const result = { status:true };
                            if (result.status) {
                                importedCount++;
                                console.log(`第 ${index + 1} 个玩偶数据导入成功: ${processedPlush.name || "未知"}`, "success");
                            } else {
                                failureCount++;
                                console.log(`第 ${index + 1} 个玩偶数据导入失败: ${processedPlush.name || "未知"}, 原因: ${result.content || "未知"}`, "error");
                            }
                        } catch (err) {
                            failureCount++;
                            console.error(`第 ${index + 1} 个玩偶数据导入失败: ${processedPlush.name || "未知"}, 原因: ${err.message || err || "未知"}`, "error");
                        }
                    } catch (error) {
                        failureCount++;
                        console.error(`第 ${index + 1} 个玩偶数据编译失败: ${error.message}`, "error");
                    }
                    updateProgress(index + 1, importedCount, failureCount, skippedCount);
                    await delay(300);
                }

                removeProgress();

                const resultTip = formatImportTips(importedCount, skippedCount, reachLimit, importLimit, isDeprecated);
                console.log(`导入完成：${resultTip}`, "success");
                
                PonyButtonModule.showCustomAlert(zh ? "导入玩偶" : "Import Plush", zh ? `共 ${total} 个小马玩偶<br>成功导入 ${importedCount} 个<br>导入失败 ${failureCount} 个` : `A total of ${total} plush toy${total !== 1 ? 's' : ''}<br> ${importedCount} successfully imported<br> ${failureCount} failed to import`,true);

            } catch (error) {
                removeProgress();
                console.log(`全局导入错误: ${error.message}`, "error");
            }
        }

        return { importPonies, ParsePonyReturn, importPlushes, ParsePlushReturn};
    })();

    const PonySaveModule = (() => {
        function IG(t, i = 0, e = t.length, n = 0) {
            const o = i + e;
            let s = 3735928559 ^ n,
                r = 1103547991 ^ n;
            for (let e = i; e < o; e++) {
                const i = t.charCodeAt(e);
                s = Math.imul(s ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677)
            }
            return s = Math.imul(s ^ s >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(s ^ s >>> 13, 3266489909), 4294967296 * (2097151 & r) + (s >>> 0)
        }
        function uSo(t) {
            return IG(t || "") >>> 0
        }

        function HG(t, i) {
            if (i) {
                let e = 0;
                for (let n = 0; n < t.length; n = n + 1 | 0) t[n] ^= i >>> e & 255, e += 8, 32 === e && (e = 0)
            }
            return t
        }

        function JG(t) {
            let i = nl,
                e = 0;
            for (let n = nx; n < t.length; n = n + 1 | 0) i ^= t[n] << e, e += 8, 32 === e && (e = 0);
            return i >>> 0
        }

        const RY = new TextEncoder,
              PY = new TextDecoder;

        const [UY, KY] = (() => {
            const t = RY.encode(String.raw`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 _-+/*.<>="\':;#@$&()?!|^%~`),
                  i = RY.encode(String.raw`kAamRScltPMfJxBdOFEvuNVUIWCg5Yne6L1srbHX4Q3y2j8z9qw7GiKTZo0Dph~@?"#$*^%)(>:!-/ =\<'&|.+;_`),
                  e = function*() {
                      for (let e = 0; e < t.length; ++e) yield [t[e], i[e]]
                  }(),
                  n = function*() {
                      for (let e = 0; e < t.length; ++e) yield [i[e], t[e]]
                  }();
            return [Object.fromEntries(e), Object.fromEntries(n)]
        })();

        const TY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        const $Y = new ArrayBuffer(4283),
              tT = new Uint8Array($Y, 0, 4096),
              [iT, eT] = (() => {
                  const t = new Uint8Array($Y, 4096, 64),
                        i = new Uint8Array($Y, 4160, 123);
                  for (let e = 0; e < 64; ++e) {
                      const n = TY.charCodeAt(e);
                      t[e] = n, i[n] = e
                  }
                  return i["-".charCodeAt(0)] = 62, i["_".charCodeAt(0)] = 63, [t, i]
              })();

        function sT(t, i = t.byteLength) {
            const e = function({
                byteLength: t
            }) {
                return Math.ceil(4 * t / 3)
            }(t);
            let n;
            n = e <= tT.byteLength ? tT : new Uint8Array(e);
            const o = i % 3,
                    s = i - o;
            let r = 0;
            for (let i = 0; i < s;) {
                const e = t[i++] << 16 | t[i++] << 8 | t[i++];
                n[r++] = iT[e >>> 18], n[r++] = iT[e >>> 12 & 63], n[r++] = iT[e >>> 6 & 63], n[r++] = iT[63 & e]
            }
            if (2 === o) {
                const e = t[i - 2],
                        o = t[i - 1];
                n[r++] = iT[e >>> 2], n[r++] = iT[e << 4 & 63 | o >>> 4], n[r++] = iT[o << 2 & 63]
            } else if (1 === o) {
                const e = t[i - 1];
                n[r++] = iT[e >>> 2], n[r++] = iT[e << 4 & 63]
            }
            return PY.decode(n.byteLength > r ? n.subarray(0, r) : n)
        }

        function oT(t, i) {
            let e = t.length;
            for (;
                 "=" === t[e - 1];) --e;
            const n = Math.floor(3 * e / 4);
            let o;
            void 0 === i ? (i = new Uint8Array(n), o = n) : o = i.byteLength;
            const s = e % 4,
                  r = e - s;
            let a = 0;
            for (let e = 0; e < r && a < o;) {
                const n = eT[t.charCodeAt(e++)],
                      o = eT[t.charCodeAt(e++)],
                      s = eT[t.charCodeAt(e++)],
                      r = eT[t.charCodeAt(e++)];
                if (void 0 === n || void 0 === o || void 0 === s || void 0 === r) throw new Error("Invalid base64 string. Unrecognized character");
                const c = n << 18 | o << 12 | s << 6 | r;
                i[a++] = c >>> 16, i[a++] = c >>> 8, i[a++] = c >>> 0
            }
            if (a >= o) return i;
            if (3 === s) {
                const n = eT[t.charCodeAt(e - 3)],
                      o = eT[t.charCodeAt(e - 2)],
                      s = eT[t.charCodeAt(e - 1)];
                if (void 0 === n || void 0 === o || void 0 === s) throw new Error("Invalid base64 string. Unrecognized character");
                const r = n << 10 | o << 4 | s >>> 2;
                i[a++] = r >>> 8, i[a++] = r
            } else if (2 === s) {
                const n = eT[t.charCodeAt(e - 2)],
                      o = eT[t.charCodeAt(e - 1)];
                if (void 0 === n || void 0 === o) throw new Error("Invalid base64 string. Unrecognized character");
                const s = n << 2 | o >>> 4;
                i[a++] = s
            } else if (1 === s) throw new Error("Invalid base64 string. Got 1 unread character");
            return i
        }

        const tAo = /^[.,_-]+$/u;

        function iAo(t) {
            return !!(null == t ? void 0 : t.length) && t.length <= 30 && !tAo.test(t)
        }

        function WY(t, i) {
            return t.length > i ? t.slice(0, i) : t
        }

        function SY(t, i) {
            try {
                return new RegExp(t, i)
            } catch (t) {
                return t.message, /(?!.*)/u
            }
        }

        const Hvo = /[\uff01-\uff5e]/gu,
              jvo = /[\u1160\u2800\u3000\u3164\uffa0]+/gu;

        function Uvo(t) {
            return String.fromCharCode(t.charCodeAt(0) - 65248)
        }

        const Kvo = SY(String.raw`\s+`, "g"),
              Wvo = SY(String.raw`^[\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u200b\u200d]+$`, "u"),
              Nvo = SY(String.raw`[\ufe00-\ufe0f]`, "ug");

        function zvo(t) {
            const i = $vo(null == t ? void 0 : t.replaceAll(Nvo, ""), Yvo).replaceAll(jvo, " ").replaceAll(Kvo, " ").replaceAll(Hvo, Uvo).trim();
            return Wvo.test(i) ? "" : i
        }

        function Fvo(t) {
            return t >= 32 && t <= 126 || t >= 160 && t <= 255 || t >= 256 && t <= 383 || t >= 384 && t <= 591 || t >= 7680 && t <= 7935 || t >= 880 && t <= 1023 || t >= 1024 && t <= 1153 || t >= 1162 && t <= 1279 || t >= 12353 && t <= 12438 || t >= 12448 && t <= 12543 || t >= 13312 && t <= 19893 || t >= 19968 && t <= 40907 || t >= 63744 && t <= 64106 || t >= 12032 && t <= 12255 || t >= 12288 && t <= 12333 || t >= 7424 && t <= 7551 || t >= 592 && t <= 687 || t >= 42784 && t <= 43007 || t >= 3584 && t <= 3711 || t >= 65281 && t <= 65374 || t >= 8704 && t <= 8959 || t >= 9632 && t <= 9727 || t >= 9728 && t <= 9983 || t >= 9984 && t <= 10175 || t >= 11008 && t <= 11247 || t >= 128512 && t <= 128591 || t >= 128640 && t <= 128758 || t >= 127744 && t <= 128511 || t >= 8986 && t <= 8987 || t >= 9193 && t <= 9210 || t >= 129280 && t <= 129535 || 65039 === t || 129668 === t || 58656 === t || 9940 === t || 129704 === t || 58880 === t || 129730 === t || 129656 === t || 8265 === t || 58640 === t || 58641 === t || 58642 === t || 58643 === t || 58644 === t || 58645 === t || 58646 === t || 58647 === t || 58648 === t || 129655 === t || 129653 === t || 129654 === t || 58649 === t || 58650 === t || 58651 === t || 58652 === t || 58653 === t || 58654 === t || 58655 === t || 58663 === t || 58676 === t || 58677 === t || 58664 === t || 58665 === t || 58666 === t || 58667 === t || 58668 === t || 58669 === t || 58670 === t || 58671 === t || 58672 === t || 58673 === t || 58674 === t || 58675 === t || 129762 === t || 129765 === t || 129713 === t || 129721 === t || 129722 === t || 129767 === t || 129702 === t || Lvo.has(t)
        }

        function Rvo(t) {
            return t >= 688 && t <= 767 || t >= 1329 && t <= 1366 || t >= 1369 && t <= 1375 || t >= 1377 && t <= 1415 || t >= 1417 && t <= 1418 || t >= 1420 && t <= 1423 || t >= 1425 && t <= 1479 || t >= 1488 && t <= 1514 || t >= 1520 && t <= 1524 || t >= 1536 && t <= 1791 || t >= 1984 && t <= 2042 || t >= 2304 && t <= 2431 || 2960 === t || 2972 === t || t >= 3205 && t <= 3212 || t >= 3214 && t <= 3216 || t >= 3217 && t <= 3240 || t >= 3242 && t <= 3251 || t >= 3253 && t <= 3257 || t >= 3302 && t <= 3311 || t >= 4256 && t <= 4293 || 4295 === t || 4301 === t || t >= 4304 && t <= 4351 || t >= 4352 && t <= 4607 || t >= 12592 && t <= 12687 || t >= 44032 && t <= 55215 || t >= 5120 && t <= 5759 || t >= 8208 && t <= 8231 || t >= 8240 && t <= 8286 || t >= 8352 && t <= 8383 || t >= 8448 && t <= 8527 || t >= 8528 && t <= 8587 || t >= 8960 && t <= 9114 || t >= 9140 && t <= 9210 || t >= 9472 && t <= 9599 || t >= 10240 && t <= 10495 || t >= 12288 && t <= 12351 || t >= 12549 && t <= 12589 || t >= 65072 && t <= 65103 || t >= 65281 && t <= 65519 || t >= 126976 && t <= 127019 || t >= 127136 && t <= 127150 || t >= 127153 && t <= 127167 || t >= 127169 && t <= 127183 || t >= 127185 && t <= 127199 || t >= 127200 && t <= 127221 || t >= 127462 && t <= 127487
        }

        function Pvo(t) {
            return 128405 === t || 173 === t
        }

        function Yvo(t) {
            return Fvo(t) && !Pvo(t)
        }

        function Xgo(t) {
            return t >= 55296 && t <= 56319
        }

        function $go(t) {
            return 56320 == (64512 & t)
        }

        function tvo(t, i) {
            return ((1023 & t) << 10) + (1023 & i) + 65536 | 0
        }

        const _6n = {
            SeasonSummer: "",
            SeasonAutumn: "",
            SeasonWinter: "",
            SeasonSpring: "",
            Calendar: "",
            Brush: "",
            WallAuto: "",
            WallShort: "",
            WallTall: "",
            UiRotate: "",
            ChatRotate: "",
            Mod_Muted: "",
            Mod_Note: "",
            Mod_BadCM: "",
            Mod_NewAcc: "",
            Mod_1_Star: "",
            Mod_2_Stars: "",
            Mod_3_Stars: "",
            Mod_Dupes: "",
            Mod_BannedDupes: "",
            Mod_Phone: "",
            Mod_Shadowed: "",
            EasterEgg: "",
            ChickenFace: "",
            PenguinFace: "",
            DuckFace: "",
            BabyChickFace: "",
            OwlFace: "",
            Eyes_R: "",
            EagleFace: "",
            SheepFace: "",
            LookingForChat: "",
            Busy: "",
            LookingForRP: "",
            AFK: "",
            UsingModal: "",
            Tiny_Smile: "",
            Tiny_Derp: "",
            Tiny_Angry: "",
            Tiny_Neutral: "",
            Tiny_Expressionless: "",
            Tiny_Laughing: "",
            Tiny_Worried: "",
            Tiny_UpsideDown: "",
            Tiny_Kiss: "",
            Tiny_Smirk: "",
            Tiny_Unamused: "",
            Tiny_KissSmile: "",
            Tiny_Relieved: "",
            Tiny_Pensive: "",
            Tiny_Disappointed: "",
            Tiny_KissClosedEyes: "",
            Tiny_HeartEyes: "",
            Tiny_Evil: "",
            Tiny_Imp: "",
            Tiny_Thinking: "",
            Tiny_Sunglasses: "",
            Tiny_StarEyes: ""
        },
              q6n = new Set([_6n.Tiny_Smile, _6n.Tiny_Derp, _6n.Tiny_Angry, _6n.Tiny_Neutral, _6n.Tiny_Expressionless, _6n.Tiny_Laughing, _6n.Tiny_Worried, _6n.Tiny_UpsideDown, _6n.Tiny_Kiss, _6n.Tiny_Smirk, _6n.Tiny_Unamused, _6n.Tiny_KissSmile, _6n.Tiny_Relieved, _6n.Tiny_Pensive, _6n.Tiny_Disappointed, _6n.Tiny_KissClosedEyes, "™", "♀", "♂", "⚧", "👃"]),
              Z6n = new Set(["👀", _6n.Eyes_R]),
              X6n = new Set([...q6n, _6n.Tiny_Thinking, _6n.Tiny_Sunglasses, _6n.Tiny_HeartEyes, _6n.Tiny_StarEyes, ...Z6n]),
              $6n = [
                  [_6n.Tiny_Smile, "face", "tiny", "tinyface", "tiny_slight_smile"],
                  [_6n.Tiny_Derp, "derp", "tiny_dizzy"],
                  [_6n.Tiny_Angry, "tiny_angry"],
                  [_6n.Tiny_Neutral, "tiny_neutral"],
                  [_6n.Tiny_Expressionless, "tiny_expressionless"],
                  [_6n.Tiny_Laughing, "tiny_laughing"],
                  [_6n.Tiny_Worried, "tiny_worried"],
                  [_6n.Tiny_UpsideDown, "tiny_upside_down"],
                  [_6n.Tiny_Kiss, "tiny_kiss"],
                  [_6n.Tiny_Smirk, "tiny_smirk"],
                  [_6n.Tiny_Unamused, "tiny_unamused"],
                  [_6n.Tiny_KissSmile, "tiny_kiss_smile", "tiny_kissing_smiling_eyes"],
                  [_6n.Tiny_Relieved, "tiny_relieved"],
                  [_6n.Tiny_Pensive, "tiny_pensive"],
                  [_6n.Tiny_Disappointed, "tiny_disappointed"],
                  [_6n.Tiny_KissClosedEyes, "tiny_kiss_closed_eyes"],
                  [_6n.Tiny_HeartEyes, "tiny_heart_eyes"],
                  [_6n.Tiny_Evil, "tiny_evil", "tiny_smiling_imp"],
                  [_6n.Tiny_Imp, "tiny_imp", "tiny_angry_evil"],
                  [_6n.Tiny_Thinking, "tiny_thinking"],
                  [_6n.Tiny_Sunglasses, "tiny_cool", "tiny_sunglasses"],
                  [_6n.Tiny_StarEyes, "tiny_star_eyes", "tiny_star_struck"],
                  ["👃", "nose", "c"],
                  ["😀", "grinning"],
                  ["😃", "smiley"],
                  ["😄", "smile"],
                  ["😁", "grin"],
                  ["😆", "laughing", "satisfied"],
                  ["🥹", "face_holding_back_tears"],
                  ["😅", "sweat_smile"],
                  ["😂", "joy"],
                  ["🤣", "rofl", "rolling_on_the_floor_laughing"],
                  ["🥲", "smiling_face_with_tear"],
                  ["😊", "relaxed"],
                  ["☺", "blush"],
                  ["😇", "innocent"],
                  ["🙂", "slight_smile"],
                  ["🙃", "upside_down"],
                  ["😉", "wink"],
                  ["😌", "relieved"],
                  ["😍", "heart_eyes"],
                  ["🥰", "smiling_face_with_hearts"],
                  ["😘", "kissing_heart"],
                  ["😗", "kiss"],
                  ["😙", "kiss_smile", "kissing_smiling_eyes"],
                  ["😚", "kiss_closed_eyes"],
                  ["😋", "yum"],
                  ["😛", "stuck_out_tongue"],
                  ["😝", "stuck_out_tongue_closed_eyes"],
                  ["😜", "stuck_out_tongue_winking_eye"],
                  ["🤪", "zany_face"],
                  ["🤨", "face_with_raised_eyebrow"],
                  ["🧐", "face_with_monocle"],
                  ["🤓", "face_with_glasses", "nerd"],
                  ["😎", "cool", "sunglasses_face", "sunglasses"],
                  ["🥸", "disguised_face"],
                  ["🤩", "star_eyes", "star_struck"],
                  ["🥳", "partying_face"],
                  ["😏", "smirk"],
                  ["😒", "unamused"],
                  ["😞", "disappointed"],
                  ["😔", "pensive"],
                  ["😟", "worried"],
                  ["😕", "confused"],
                  ["🙁", "slight_frown", "slightly_frowning_face"],
                  ["☹", "frowning_face"],
                  ["😣", "persevere"],
                  ["😖", "confounded"],
                  ["😫", "tired_face"],
                  ["😩", "weary"],
                  ["🥺", "pleading_face"],
                  ["😢", "cry"],
                  ["😭", "sob"],
                  ["😤", "triumph"],
                  ["😠", "angry"],
                  ["😡", "rage", "very_angry"],
                  ["🤬", "swearing", "face_with_symbols_over_mouth"],
                  ["🤯", "exploding_head"],
                  ["😳", "flushed"],
                  ["🥵", "hot_face"],
                  ["🥶", "cold_face"],
                  ["😶‍🌫️", "face_in_clouds"],
                  ["😱", "scream"],
                  ["😨", "fearful"],
                  ["😰", "cold_sweat"],
                  ["😥", "disappointed_relieved"],
                  ["😓", "sweat"],
                  ["🤗", "hugging", "hugging_face"],
                  ["🤔", "thinking", "thinking_face"],
                  ["🫣", "peeking_face", "face_with_peeking_eye"],
                  ["🤭", "smiling_face_with_hoof_over_mouth", "smiling_face_with_hand_over_mouth"],
                  ["🫢", "face_with_hoof_over_mouth", "face_with_open_eyes_and_hand_over_mouth"],
                  ["🫡", "saluting_face"],
                  ["🤫", "shushing_face", "shush"],
                  ["🫠", "melting_face"],
                  ["🤥", "lying_face", "liar"],
                  ["😶", "no_mouth"],
                  ["🫥", "dotted_line_face"],
                  ["😐", "neutral", "neutral_face"],
                  ["🫤", "face_with_diagonal_mouth"],
                  ["😑", "expressionless"],
                  ["😬", "grimacing"],
                  ["🙄", "rolling_eyes", "face_with_rolling_eyes"],
                  ["😯", "hushed"],
                  ["😦", "frowning_face_with_open_mouth"],
                  ["😧", "anguished"],
                  ["😮", "open_mouth"],
                  ["😲", "astonished"],
                  ["🫨", "shaking_face"],
                  ["🥱", "yawning_face"],
                  ["😴", "sleeping"],
                  ["😮‍💨", "exhale", "sigh"],
                  ["🤤", "drooling_face"],
                  ["😪", "sleepy"],
                  ["😵", "dizzy_face"],
                  ["😵‍💫", "face_with_spiral_eyes"],
                  ["🤐", "zipper_mouth_face"],
                  ["🥴", "woozy_face"],
                  ["🤢", "nauseated_face", "sick"],
                  ["🤮", "vomiting_face", "puking_face", "puke"],
                  ["🤧", "sneezing_face", "sneeze"],
                  ["😷", "face_mask"],
                  ["🤒", "thermometer_face"],
                  ["🤕", "face_with_head_bandage"],
                  ["🤑", "money_mouth_face"],
                  ["🤠", "cowboy_face", "face_with_cowboy_hat"],
                  ["😈", "evil", "smiling_imp"],
                  ["👿", "imp", "angry_evil"],
                  ["😺", "smiley_cat"],
                  ["😸", "smile_cat"],
                  ["😹", "joy_cat"],
                  ["😻", "heart_eyes_cat"],
                  ["😼", "smirk_cat"],
                  ["😽", "kissing_cat"],
                  ["🙀", "scream_cat"],
                  ["😿", "crying_cat", "crying_cat_face"],
                  ["😾", "pouting_cat"],
                  ["🙌", "raised_hands"],
                  ["👏", "clap"],
                  ["👍", "thumbs_up", "thumb_up", "+1"],
                  ["👎", "thumbs_down", "thumb_down", "-1"],
                  ["👊", "punch"],
                  ["✊", "fist"],
                  ["✌", "v", "victory_hand", "peace_hand"],
                  ["🤟", "love_you_gesture"],
                  ["🤘", "metal", "sign_of_the_horns"],
                  ["👌", "ok_hand"],
                  ["👉", "point_right"],
                  ["👈", "point_left"],
                  ["☝", "point_up"],
                  ["✋", "raised_hand"],
                  ["🤚", "raised_back_of_hand"],
                  ["🖐", "hand_splayed", "raised_hand_with_fingers_splayed"],
                  ["👋", "wave", "waving_hand"],
                  ["🤙", "call_me", "call_me_hand"],
                  ["🫲", "leftwards_hand"],
                  ["🫱", "rightwards_hand"],
                  ["💪", "muscle"],
                  ["🙏", "pray", "please"],
                  [_6n.Eyes_R, "eyes_r", "eyes_right"],
                  ["👀", "eyes"],
                  ["🐎", "pony", "horse"],
                  ["🏃", "running", "pony_running", "galloping", "pony_galloping"],
                  ["🧍", "pony_standing", "front_facing_pony"],
                  ["🤷", "shrug", "pony_shrugging"],
                  ["🫂", "hug", "ponies_hugging"],
                  ["👮", "police_officer"],
                  ["👷", "construction_worker"],
                  ["🕵", "spy", "detective"],
                  ["🧑‍⚕️", "doctor", "health_worker"],
                  ["🧑‍🌾", "farmer", "gardener"],
                  ["🧑‍🍳", "cook"],
                  ["🧑‍🎓", "student", "graduate"],
                  ["🧑‍🏫", "teacher"],
                  ["🧑‍🔧", "mechanic"],
                  ["🧑‍🔬", "scientist"],
                  ["🧑‍🚒", "firefighter"],
                  ["🧑‍🚀", "astronaut", "cosmonaut"],
                  ["👰", "pony_with_veil", "bride"],
                  ["🤵", "pony_in_tuxedo", "groom"],
                  ["🦸", "hero", "superhero"],
                  ["🥷", "ninja"],
                  ["🧙", "witch", "wizard"],
                  ["🧛", "vampire"],
                  ["🧟", "zombie"],
                  ["🧜", "merpony", "mermaid", "seapony"],
                  ["🧚", "fairy"]
              ].map(h7n),
              t7n = [
                  ["🐴", "pony_face", "fez", "default", "horse_face"],
                  ["🦄", "unicorn"],
                  ["🦓", "zebra"],
                  ["🦌", "deer"],
                  ["🐮", "cow_face"],
                  [_6n.SheepFace, "sheep_face"],
                  ["🐲", "dragon_face"],
                  ["🤖", "robot", "fezbot"],
                  ["🤡", "clown", "clown_face"],
                  ["👽", "alien", "alien_face"],
                  ["👾", "alien_monster", "space_invader"],
                  ["🐶", "dog_face"],
                  ["🐱", "cat_face"],
                  ["🐭", "mouse_face"],
                  ["🐹", "hamster_face"],
                  ["🐰", "bunny_face", "rabbit_face"],
                  ["🦊", "fox"],
                  ["🐻", "bear_face"],
                  ["🐼", "panda_face"],
                  ["🐻‍❄️", "polar_bear_face"],
                  ["🐨", "koala_face"],
                  ["🐯", "tiger_face"],
                  ["🦁", "lion_face"],
                  ["🐷", "pig_face"],
                  ["🐽", "pig_nose"],
                  ["🐸", "frog_face"],
                  ["🐵", "monkey_face"],
                  ["🐺", "wolf_face"],
                  ["🐗", "boar_face", "warthog_face", "wild_pig_face"],
                  [_6n.ChickenFace, "chicken_face"],
                  [_6n.PenguinFace, "penguin_face"],
                  [_6n.DuckFace, "duck_face"],
                  [_6n.BabyChickFace, "baby_chick_face", "chick_face"],
                  [_6n.OwlFace, "owl_face"],
                  [_6n.EagleFace, "eagle_face"],
                  ["🦇", "bat"],
                  ["🐝", "bee", "honeybee"],
                  ["🐛", "bug", "caterpillar"],
                  ["🦋", "butterfly"],
                  ["🐞", "ladybug", "lady_beetle", "ladybird"],
                  ["🪱", "worm"],
                  ["🕷", "spider"],
                  ["🕸", "web", "spider_web"],
                  ["🐢", "turtle", "tortoise"],
                  ["🐍", "snake"],
                  ["🦖", "t_rex", "dino_t_rex"],
                  ["🐟", "fish"],
                  ["🐬", "dolphin"],
                  ["🐋", "whale"],
                  ["🐳", "spouting_whale"],
                  ["🦈", "shark"],
                  ["🐑", "sheep", "ewe"],
                  ["🐏", "ram", "sheep_ram"],
                  ["🐕", "dog"],
                  ["🐈", "cat", "cat2"],
                  ["🐈‍⬛", "black_cat"],
                  ["🐇", "bunny", "rabbit"],
                  ["🐔", "chicken", "hen"],
                  ["🐧", "penguin"],
                  ["🐦", "bird", "finch", "bullfinch"],
                  ["🐤", "baby_chick", "baby_bird", "chick"],
                  ["🦆", "duck"],
                  ["🦤", "dodo"],
                  ["🦅", "eagle"],
                  ["🦉", "owl"],
                  ["🐉", "dragon"],
                  ["👻", "ghost"],
                  ["🧠", "brain"],
                  ["💀", "skull"],
                  ["☠", "crossbones", "skull_crossbones", "skull_and_crossbones"],
                  ["👣", "hooves", "hoof", "hoof_prints"],
                  ["🐾", "paws", "paw", "feet", "paw_prints"],
                  ["🌵", "cactus"],
                  ["🎄", "holiday_tree", "christmas_tree"],
                  ["🌲", "evergreen_tree", "pinetree", "pine"],
                  ["🌱", "seedling", "sapling"],
                  ["☘", "shamrock", "clover"],
                  ["🍀", "four_leaf_clover"],
                  ["🪹", "empty_nest"],
                  ["🪺", "nest_with_eggs"],
                  ["🍃", "leaf", "leaves"],
                  ["🍂", "fallen_leaf", "fallen_leaves", "autumn_leaves"],
                  ["🍁", "maple_leaf"],
                  ["🍄", "mushroom"],
                  ["🪨", "rock", "stone"],
                  ["💐", "holly"],
                  ["🌿", "mistletoe"],
                  ["🌷", "tulip"],
                  ["🌹", "rose"],
                  ["🥀", "wilted_flower"],
                  ["🌺", "hibiscus"],
                  ["🌸", "cherry_blossom"],
                  ["🌼", "blossom", "flower"],
                  ["🌻", "sunflower"],
                  ["🌞", "sun_with_face"],
                  ["🌜", "last_quarter_moon_face"],
                  ["🌛", "first_quarter_moon_with_face"],
                  ["🌚", "new_moon_with_face"],
                  ["🌝", "full_moon_with_face"],
                  ["🌕", "full_moon"],
                  ["🌖", "waning_gibbous_moon"],
                  ["🌗", "last_quarter_moon"],
                  ["🌘", "waning_crescent_moon"],
                  ["🌑", "new_moon"],
                  ["🌒", "waxing_crescent_moon"],
                  ["🌓", "first_quarter_moon"],
                  ["🌔", "waxing_gibbous_moon"],
                  ["🌙", "moon", "crescent_moon"],
                  ["💫", "dizzy"],
                  ["⭐", "star"],
                  ["🌟", "star2"],
                  ["🌠", "shooting_star"],
                  ["☄", "comet"],
                  ["✨", "sparkles"],
                  ["⚡", "zap"],
                  ["💥", "boom", "bang", "explosion", "collision"],
                  ["🔥", "fire"],
                  ["🌈", "rainbow"],
                  ["☀", "sun", "sunny"],
                  ["☁", "cloud", "cloudy"],
                  ["❄", "snow", "snowflake"],
                  ["⛄", "snowpony", "snowman"],
                  ["💧", "drop", "droplet", "water_drop", "water_droplet"],
                  ["💦", "sweat_drops", "drops", "droplets", "water_drops"],
                  ["🫧", "bubbles"],
                  ["☂", "umbrella"],
                  ["🌊", "ocean", "water_wave"]
              ].map(h7n),
              i7n = [
                  ["🍎", "apple"],
                  ["🍏", "green_apple", "gapple"],
                  ["🍐", "pear"],
                  ["🍊", "orange", "tangerine"],
                  ["🍋", "lemon"],
                  ["🍌", "banana"],
                  ["🍉", "melon_slice", "watermelon_slice"],
                  ["🍇", "grapes"],
                  ["🍓", "strawberry"],
                  ["🍒", "cherry", "cherries"],
                  ["🍑", "peach"],
                  ["🥭", "mango"],
                  ["🥕", "carrot"],
                  ["🏀", "pumpkin"],
                  ["🎃", "jacko", "jack_o_lantern"],
                  ["🥚", "egg"],
                  [_6n.EasterEgg, "easter_egg"],
                  ["🍞", "bread", "bread_loaf"],
                  ["🥖", "baguette"],
                  ["🍕", "pizza"],
                  ["🥪", "sandwich"],
                  ["🍥", "fish_cake"],
                  ["🍦", "ice_cream", "soft_ice_cream", "soft_ice"],
                  ["🧁", "cupcake"],
                  ["🍨", "ice_cream_bowl"],
                  ["🍰", "cake", "cake_slice"],
                  ["🎂", "birthday", "birthday_cake"],
                  ["🍭", "lollipop"],
                  ["🍬", "candy"],
                  ["🍡", "candy_cane"],
                  ["🍫", "chocolate", "chocolate_bar"],
                  ["🍪", "cookie"],
                  ["☕", "coffee", "hot_beverage"],
                  ["🍵", "tea", "tea_cup"],
                  ["🍷", "wine", "wine_glass"]
              ].map(h7n),
              e7n = [
                  ["🕯", "candle"],
                  ["🔔", "bell"],
                  ["💎", "gem"],
                  ["⚪", "pearl"],
                  ["🧰", "toolbox"],
                  ["🔧", "wrench"],
                  ["🔨", "hammer"],
                  ["⛏", "pick"],
                  ["🏑", "crowbar"],
                  ["🪄", "wand", "magic_wand"],
                  ["🖌️", "brush", "paint_brush"],
                  ["⚙", "gear"],
                  ["⛓", "chains", "chain"],
                  ["💣", "bomb", "explosive"],
                  ["🔪", "knife", "kitchen_knife"],
                  ["🗡", "dagger", "sword"],
                  ["⚔", "crossed_swords", "sword_fight"],
                  ["🪦", "headstone", "tombstone", "gravestone"],
                  ["🔮", "crystal_ball"],
                  ["💊", "pill"],
                  ["💉", "syringe"],
                  ["🩸", "drop_of_blood", "blood_drop", "blood_droplet"],
                  ["🧸", "teddy", "teddy_bear"],
                  ["🎅", "santa_hat", "santa_claus", "santa"],
                  ["🎁", "gift", "present"],
                  ["🎈", "balloon"],
                  ["🎀", "ribbon", "bow"],
                  ["🎊", "confetti", "confetti_ball"],
                  ["🎉", "tada", "party", "party_popper"],
                  ["🎩", "top_hat"],
                  ["👑", "crown"],
                  ["💍", "ring", "diamond_ring"],
                  ["💌", "love_letter"],
                  ["📅", "calendar", "date"],
                  ["🗞", "newspaper_roll", "rolled_up_newspaper"],
                  ["📓", "notebook"],
                  ["📔", "pink_notebook", "notebook_with_decorative_cover"],
                  ["📒", "ledger", "binder"],
                  ["📕", "book", "red_book"],
                  ["📗", "green_book"],
                  ["📘", "blue_book"],
                  ["📙", "orange_book"],
                  ["📚", "books", "stack_of_books", "book_stack"],
                  ["📖", "open_book"],
                  ["📌", "pin", "pushpin"],
                  ["📍", "round_pin", "round_pushpin"],
                  ["🎭", "performing_arts", "theater_masks"],
                  ["🎤", "microphone"],
                  ["🎧", "headphones"],
                  ["🎸", "guitar"],
                  ["🎲", "die", "dice", "game_die"],
                  ["🏠", "house"],
                  ["🌌", "galaxy", "milky_way"],
                  ["🗿", "statue", "moai", "moyai"],
                  ["🏳", "white_flag"]
              ].map(h7n),
              n7n = [
                  ["❤", "heart"],
                  ["🧡", "orange_heart"],
                  ["💛", "yellow_heart"],
                  ["💚", "green_heart"],
                  ["🩵", "light_blue_heart"],
                  ["💙", "blue_heart"],
                  ["💜", "purple_heart"],
                  ["🩷", "pink_heart"],
                  ["🤍", "white_heart"],
                  ["🩶", "grey_heart"],
                  ["🖤", "black_heart"],
                  ["🤎", "brown_heart"],
                  ["💔", "broken_heart"],
                  ["❣", "heart_exclamation", "heart_exclamation_mark", "heart_exclamation_point"],
                  ["💕", "two_hearts"],
                  ["💞", "revolving_hearts", "circling_hearts"],
                  ["💓", "heart_beat", "beating_heart"],
                  ["💗", "heart_pulse"],
                  ["💖", "sparkling_heart"],
                  ["💘", "cupid", "heart_arrow", "heart_with_arrow"],
                  ["💝", "gift_heart", "heart_with_ribbon"],
                  ["❤️‍🩹", "mending_heart", "bandaged_heart"],
                  ["⛎", "ophiuchus"],
                  ["♈", "aries"],
                  ["♉", "taurus"],
                  ["♊", "gemini"],
                  ["♋", "cancer"],
                  ["♌", "leo"],
                  ["♍", "virgo"],
                  ["♎", "libra"],
                  ["♏", "scorpius", "scorpio"],
                  ["♐", "sagittarius"],
                  ["♑", "capricorn"],
                  ["♒", "aquarius"],
                  ["♓", "pisces"],
                  ["☯", "yin_yang"],
                  ["💮", "white_flower"],
                  ["✔", "check", "check_mark", "yes"],
                  ["❌", "x", "no", "cross_mark"],
                  ["⛔", "no_entry", "deny"],
                  ["🚫", "prohibit", "no_entry_sign"],
                  ["💢", "anger"],
                  ["❗", "exclamation", "red_exclamation", "exclamation_mark", "red_exclamation_mark", "red_exclamation_point", "exclamation_point"],
                  ["❕", "grey_exclamation", "grey_exclamation_mark", "grey_exclamation_point", "gray_exclamation", "gray_exclamation_mark", "gray_exclamation_point"],
                  ["❓", "question", "red_question", "red_question_mark", "question_mark"],
                  ["❔", "grey_question", "gray_question", "grey_question_mark", "gray_question_mark"],
                  ["‼", "double_exclamation", "double_exclamation_mark", "double_exclamation_point", "bangbang"],
                  ["⁉", "exclamation_question", "exclamation_question_mark", "exclamation_question_point"],
                  ["⚠", "warning"],
                  ["💤", "zzz"],
                  ["🎵", "musical_note"],
                  ["🎶", "notes"],
                  ["™", "tm"],
                  ["♀", "female"],
                  ["♂", "male"],
                  ["⚧", "trans", "transgender"]
              ].map(h7n),
              o7n = [].map(h7n),
              s7n = ["face", "derp", "tiny_kiss", "tiny_kiss_smile", "tiny_kiss_closed_eyes", "tiny_angry", "tiny_neutral", "tiny_expressionless", "tiny_laughing", "tiny_smirk", "tiny_unamused", "tiny_relieved", "tiny_pensive", "tiny_disappointed", "tiny_heart_eyes", "tiny_star_eyes", "tiny_cool", "tiny_worried", "tiny_thinking", "tiny_upside_down"],
              r7n = [...$6n, ...t7n, ...i7n, ...e7n, ...n7n, ...o7n],
              a7n = new Map,
              c7n = new Map,
              l7n = new Map;
        for (const t of r7n) {
            const {
                names: i,
                symbol: e
            } = t;
            l7n.set(e, t);
            for (const n of i) {
                const i = `:${n}:`;
                a7n.set(i, e), c7n.set(i, t)
            }
        }

        function h7n([t, ...i]) {
            return {
                symbol: t.replace("️", ""),
                names: [...i, ...i.filter(t => t.includes("_")).map(t => t.replaceAll("_", ""))]
            }
        }

        const ivo = [...r7n.map(t => t.symbol.replace("️", "")), ...Object.keys(_6n).map(t => _6n[t])].sort((t, i) => i.length - t.length).join("|"),
              evo = new RegExp(Object.keys(_6n).map(t => _6n[t]).join("|"), "iu"),
              nvo = new RegExp(`(${ivo})`, "iu"),
              ovo = new RegExp(`^(${ivo})`, "iu");

        SY("[a-zа-я0-9]", "u"), SY(String.raw`\)\(`, "gui");
        const Lvo = new Set(["♂♀⚲⚥⚧☿♁⚨⚩⚦⚢⚣⚤", "⁴⁵⁶⁷⁸⁹⁰⓪①②③④⑤⑥⑦⑧⑨⑩⓿❶❷❸❹❺❻❼❽❾❿⒈⒉⒊⒋⒌⒍⒎⒏⒐⒑⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞⅟↉", "™®♥♦♣♠❥♡♢♤♧ღஐ·´°•◦✿❀◆◇◈◉◊｡¥€«»，：■□—℃℉ⁿ‰⌘⌥⌫↩⎋⇧⏻⏼‽※⁺⁻„‚“‘”’‹›‛", "〈〉「」『』【】《》♪♫☼►◄↕‼¶§▬↨↑↓→←↖↗↘↙∟↔▲▼№●○◌★☆✰✦✧▪▫･┌┬┐├┼┤└┴┘─│╳╭╮╰╯︵︶", "ᅠ　ㅤ"].join("").split("").map(t => t.charCodeAt(0)));

        function dvo(t) {
            var i;
            return null === (i = ovo.exec(t)) || void 0 === i ? void 0 : i[0].length
        }

        function $vo(t, i) {
            if (!t) return "";
            for (let e = 0; e < t.length; e++) {
                const n = dvo(t.slice(e));
                if (n) e += n - 1;
                else {
                    let n = t.charCodeAt(e),
                        o = 1,
                        s = !1;
                    if (Xgo(n) && e + 1 < t.length) {
                        const i = t.charCodeAt(e + 1);
                        $go(i) ? (n = tvo(n, i), e++, o++) : s = !0
                    }!s && i(n) || (e -= o, t = t.slice(0, e + 1) + t.slice(e + o + 1))
                }
            }
            return t
        }

        const IY = /DataView size/u;

        function Dvi(t, i) {
            if (!((e = t) instanceof RangeError || IY.test(e.message))) throw t;
            var e;
            ! function(t) {
                const i = Math.max(1, 2 * t.dataView.byteLength);
                t.dataView = new DataView(new ArrayBuffer(i)), t.dataOffset = 0
            }(i)
        }

        function Lvi(t, i) {
            for (null != t || (t = tvi());;) try {
                i(t);
                break
            } catch (i) {
                Dvi(i, t)
            }
            return t
        }
        tvi();

        function tvi(t = 32) {
            return {
                dataView: "number" == typeof t ? new DataView(new ArrayBuffer(t)) : new DataView(t.buffer, t.byteOffset, t.byteLength),
                dataOffset: 0
            }
        }

        function WG(t) {
			if (void 0 === t) return [];
			let i = 0;
			for (let e = 0; e < t.length; ++e) {
				const n = t[e];
				n && (t[i++] = n)
			}
			return t.length = i, t
		}

        function DownloadExportPlush(t, i) {
            !function(t, i) {
                const e = tvi(1024);
                
                Lvi(e, () => {
                    Avi(e, B_o),
                    uvi(e, 1),           // 大版本
                    uvi(e, 1),           // 小版本
                    cvi(e, i.length);    // 总数
                    
                    for (const t of i) {
                        evi(e, t.name),
                        ovi(e, oT(t.look))
                    }
                });
                
                const n = sT(lvi(e));
                window.saveAs(
                    new Blob([n], { type: "text/plain;charset=utf-8" }), 
                    `${t}.ptp`
                );
            }(t, WG(i.map(item => ({...item, id: null, lastUsed: null})))); // 预处理输入数据（过滤假值并映射）
        }

        function ivi(t, i) {
            uvi(t, i ? 1 : 0)
        }

        function evi(t, i) {
            void 0 === i ? avi(t) : (cvi(t, Vgi(i)), Ivi(t, i))
        }

        function nvi(t, i) {
            return i && (i = function(t) {
                return function(t, i) {
                    const e = new Uint8Array(t.length);
                    for (let n = 0; n < t.length; ++n) e[n] = i[t.charCodeAt(n)];
                    return PY.decode(e)
                }(t, UY)
            }(i)), evi(t, i)
        }

        function ovi(t, i) {
            void 0 === i ? avi(t) : (cvi(t, i.byteLength), xvi(t, i, 0, i.byteLength))
        }

        function svi(t, i) {
            void 0 === i ? avi(t) : (cvi(t, i.byteLength), xvi(t, new Uint8Array(i), 0, i.byteLength))
        }

        function rvi(t, i, e) {
            if (function(t, i) {
                return void 0 === i ? (avi(t), !1) : (cvi(t, i.length), !0)
            }(t, i))
                for (let n = 0, {
                    length: o
                } = i; n < o; ++n) e(t, i[n])
        }

        function avi(t) {
            uvi(t, 0)
        }

        function cvi(t, i) {
            if (i < 0 || i === KP) throw new RangeError("Invalid length value");
            Cvi(t, i + 1)
        }

        function lvi({
            dataView: t,
            dataOffset: i
        }) {
            return new Uint8Array(t.buffer, t.byteOffset, i)
        }

        function dvi(t) {
            t.dataOffset = 0
        }

        function hvi(t, i) {
            t.dataView.setInt8(t.dataOffset, 0 | i), t.dataOffset += 1
        }

        function uvi(t, i) {
            t.dataView.setUint8(t.dataOffset, i >>> 0), t.dataOffset += 1
        }

        function fvi(t, i) {
            t.dataView.setInt16(t.dataOffset, 0 | i, !0), t.dataOffset += 2
        }

        function gvi(t, i) {
            t.dataView.setUint16(t.dataOffset, i >>> 0, !0), t.dataOffset += 2
        }

        function vvi(t, i) {
            t.dataView.setInt32(t.dataOffset, 0 | i, !0), t.dataOffset += 4
        }

        function Avi(t, i) {
            t.dataView.setUint32(t.dataOffset, i >>> 0, !0), t.dataOffset += 4
        }

        function pvi(t, i) {
            gvi(t, i >>> 0), uvi(t, i >>> 16)
        }

        function mvi(t, i) {
            t.dataView.setFloat32(t.dataOffset, +i, !0), t.dataOffset += 4
        }

        function wvi(t, i) {
            t.dataView.setFloat64(t.dataOffset, +i, !0), t.dataOffset += 8
        }

        function Cvi(t, i) {
            for (;;) {
                const e = 127 & i;
                if (0 == (i >>>= 7)) {
                    uvi(t, e);
                    break
                }
                uvi(t, 128 | e)
            }
        }

        function bvi(t, i) {
            i < 255 ? uvi(t, i) : (uvi(t, 255), i < 65535 ? gvi(t, i) : (gvi(t, 65535), i < 16777215 ? pvi(t, i) : (pvi(t, 16777215), Avi(t, i))))
        }

        function zgi(t) {
            return 4294967168 & t ? 4294965248 & t ? 4294901760 & t ? 4 : 3 : 2 : 1
        }

        function Vgi(t) {
            let i = 0;
            for (let e = 0; e < t.length; e++) {
                const n = t.charCodeAt(e);
                if (n >= 55296 && n <= 56319) {
                    if (e + 1 < t.length) {
                        const o = t.charCodeAt(e + 1);
                        56320 == (64512 & o) && (e++, i += zgi(((1023 & n) << 10) + (1023 & o) + 65536))
                    }
                } else i += zgi(n)
            }
            return i
        }

        function yvi(t, i) {
            for (let e = 0; e < 24;) {
                let n = 0;
                for (let t = 0; t < 8; ++t) {
                    let t = i.charCodeAt(e++);
                    t -= t <= 57 ? 48 : 87, n = n << 4 | t
                }
                Avi(t, n)
            }
        }

        function kvi(t, i) {
            void 0 !== i ? (ivi(t, !0), yvi(t, i)) : ivi(t, !1)
        }

        function xvi(t, i, e, n) {
            const o = t.dataView;
            let s = t.dataOffset,
                r = e;
            const a = t.dataOffset = s + n;
            for (; s < a; s = s + 1 | 0, r = r + 1 | 0) o.setUint8(s, i[r])
        }

        function qgi(t, i, e) {
            if (e.length > 512) {
                const {
                    read: n,
                    written: o
                } = RY.encodeInto(e, new Uint8Array(t.buffer, t.byteOffset + i));
                if (n !== e.length) throw new RangeError("Buffer is too small to encode string");
                return i + (o >>> 0)
            }
            const {
                length: n
            } = e;
            for (let o = 0; o < n; ++o) {
                const s = e.charCodeAt(o);
                if (s >= 55296 && s <= 56319) {
                    if (o + 1 < n) {
                        const n = e.charCodeAt(o + 1);
                        56320 == (64512 & n) && (++o, i += _gi(t, i, ((1023 & s) << 10) + (1023 & n) + 65536))
                    }
                } else i += _gi(t, i, s)
            }
            return i
        }

        function _gi(t, i, e) {
            const n = zgi(e);
            switch (n) {
                case 1:
                    t.setUint8(i, e);
                    break;
                case 2:
                    t.setUint8(i, e >> 6 & 31 | 192), t.setUint8(i + 1, 63 & e | 128);
                    break;
                case 3:
                    t.setUint8(i, e >> 12 & 15 | 224), t.setUint8(i + 1, e >> 6 & 63 | 128), t.setUint8(i + 2, 63 & e | 128);
                    break;
                default:
                    t.setUint8(i, e >> 18 & 7 | 240), t.setUint8(i + 1, e >> 12 & 63 | 128), t.setUint8(i + 2, e >> 6 & 63 | 128), t.setUint8(i + 3, 63 & e | 128)
            }
            return n
        }

        function Ivi(t, i) {
            if (t.dataOffset = qgi(t.dataView, t.dataOffset, i), t.dataOffset > t.dataView.byteLength) throw new RangeError("Exceeded DataView size")
        }

        function ATo(t, i, e, n) { //pony
            var o;
            const s = tvi((null !== (o = null == i ? void 0 : i.length) && void 0 !== o ? o : 0) + 512);
            return Lvi(s, () => {
                var o, r, a, c, l;
                n && uvi(s, 6), kvi(s, t.id || void 0), evi(s, t.name), ovi(s, i), uvi(s, null !== (o = t.specialTag) && void 0 !== o ? o : 0), kvi(s, t.site), evi(s, t.desc), uvi(s, null !== (r = t.supporterTag) && void 0 !== r ? r : 255), ivi(s, null !== (a = t.respawnAtSpawn) && void 0 !== a && a), ivi(s, null !== (c = t.persistentTag) && void 0 !== c && c), Avi(s, e), n || Avi(s, yG);
                const d = void 0 !== t.backgroundColor;
                ivi(s, d), d && Avi(s, t.backgroundColor), void 0 === t.toy || "number" == typeof t.toy ? (ivi(s, !0), gvi(s, null !== (l = t.toy) && void 0 !== l ? l : 0)) : (ivi(s, !1), yvi(s, t.toy))
            }), lvi(s)
        }

        function vIo(t, i, e, n) { //plush
			var o;
			const s = tvi((null !== (o = null == i ? void 0 : i.length) && void 0 !== o ? o : 0) + 512);
			return Lvi(s, () => {
				n && uvi(s, 2), kvi(s, t.id || void 0), evi(s, t.name), ovi(s, i), Avi(s, e), n || Avi(s, yG)
			}), lvi(s)
		}


        function cHo(t, i) { //pony
            t.name = zvo(t.name), t.desc = t.desc ? WY(t.desc, 40) : "", iAo(t.name) || (t.name && t.name, t.name = "Pony");
            //const e = t.ponyLook ? olo(t.ponyLook) : oT(t.lookCompressed),
            const e = oT(t.lookCompressed),
                  n = JG(e);
            return ATo(t, HG(e, CG ^ n ^ uSo(i)), n, !1)
        }

        function EGo(t, i) { //plush
			t.name = zvo(t.name), "" === t.name || iAo(t.name) || (t.name, t.name = "Plush");
			//const e = t.characterCustomToyLook ? Lho(t.characterCustomToyLook) : t.look,
            const e = oT(t.look), //解
				n = JG(e);
			return vIo(t, HG(e, CG ^ n ^ uSo(i)), n, !1)
		}

        function savePony(pony, accountid) {
            return cHo(pony, accountid);
        }
        function savePlush(plush, accountid) {
            return EGo(plush, accountid);
        }

        return { savePony, savePlush, DownloadExportPlush };
    })();

    const SendPonyModule = (() => {
        const RY = new TextEncoder,
              PY = new TextDecoder;

        const TY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        const $Y = new ArrayBuffer(4283),
              tT = new Uint8Array($Y, 0, 4096),
              [iT, eT] = (() => {
                  const t = new Uint8Array($Y, 4096, 64),
                        i = new Uint8Array($Y, 4160, 123);
                  for (let e = 0; e < 64; ++e) {
                      const n = TY.charCodeAt(e);
                      t[e] = n, i[n] = e
                  }
                  return i["-".charCodeAt(0)] = 62, i["_".charCodeAt(0)] = 63, [t, i]
              })();

        function sT(t, i = t.byteLength) {
            const e = function({
                byteLength: t
            }) {
                return Math.ceil(4 * t / 3)
            }(t);
            let n;
            n = e <= tT.byteLength ? tT : new Uint8Array(e);
            const o = i % 3,
                  s = i - o;
            let r = 0;
            for (let i = 0; i < s;) {
                const e = t[i++] << 16 | t[i++] << 8 | t[i++];
                n[r++] = iT[e >>> 18], n[r++] = iT[e >>> 12 & 63], n[r++] = iT[e >>> 6 & 63], n[r++] = iT[63 & e]
            }
            if (2 === o) {
                const e = t[i - 2],
                      o = t[i - 1];
                n[r++] = iT[e >>> 2], n[r++] = iT[e << 4 & 63 | o >>> 4], n[r++] = iT[o << 2 & 63]
            } else if (1 === o) {
                const e = t[i - 1];
                n[r++] = iT[e >>> 2], n[r++] = iT[e << 4 & 63]
            }
            return PY.decode(n.byteLength > r ? n.subarray(0, r) : n)
        }

        function oT(t, i) {
            let e = t.length;
            for (;
                 "=" === t[e - 1];) --e;
            const n = Math.floor(3 * e / 4);
            let o;
            void 0 === i ? (i = new Uint8Array(n), o = n) : o = i.byteLength;
            const s = e % 4,
                  r = e - s;
            let a = 0;
            for (let e = 0; e < r && a < o;) {
                const n = eT[t.charCodeAt(e++)],
                      o = eT[t.charCodeAt(e++)],
                      s = eT[t.charCodeAt(e++)],
                      r = eT[t.charCodeAt(e++)];
                if (void 0 === n || void 0 === o || void 0 === s || void 0 === r) throw new Error("Invalid base64 string. Unrecognized character");
                const c = n << 18 | o << 12 | s << 6 | r;
                i[a++] = c >>> 16, i[a++] = c >>> 8, i[a++] = c >>> 0
            }
            if (a >= o) return i;
            if (3 === s) {
                const n = eT[t.charCodeAt(e - 3)],
                      o = eT[t.charCodeAt(e - 2)],
                      s = eT[t.charCodeAt(e - 1)];
                if (void 0 === n || void 0 === o || void 0 === s) throw new Error("Invalid base64 string. Unrecognized character");
                const r = n << 10 | o << 4 | s >>> 2;
                i[a++] = r >>> 8, i[a++] = r
            } else if (2 === s) {
                const n = eT[t.charCodeAt(e - 2)],
                      o = eT[t.charCodeAt(e - 1)];
                if (void 0 === n || void 0 === o) throw new Error("Invalid base64 string. Unrecognized character");
                const s = n << 2 | o >>> 4;
                i[a++] = s
            } else if (1 === s) throw new Error("Invalid base64 string. Got 1 unread character");
            return i
        }

        async function sendRequest(url, account = {}, ponyData = []) {
            let headers = {};

            headers = {
                'authority': 'pony.town',
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'accept': 'application/octet-stream',
                'content-type': 'application/octet-stream',
                'origin': 'https://pony.town',
                'referer': 'https://pony.town/character'
            }


            if (account) {
                headers['account-name'] = account['account-name'] || '';
                headers['account-id'] = account['account-id'] || '';
                headers['api-bid'] = account['api-bid'] || '';
                headers['api-version'] = account['api-version'] || '';
                headers['api-time'] = account['api-time'] || '';
                headers['api-perf'] = account['api-perf'] || '';
            }

            const requestData = ponyData instanceof Uint8Array ? ponyData : new Uint8Array(ponyData);

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: requestData,
                    credentials: 'include'
                });

                const contentType = response.headers.get('content-type') || '';

                if (contentType.includes('application/octet-stream')) {
                    const buffer = await response.arrayBuffer();
                    return {
                        status: response.status,
                        content: buffer,
                        contentType: contentType
                    };
                }
                else {
                    const text = await response.text();
                    return {
                        status: response.status,
                        content: text,
                        contentType: contentType
                    };
                }
            } catch (error) {
                return {
                    status: 404,
                    content: error.message,
                    contentType: "",
                    error: error
                };
            }
        }

        const Auo = (() => {
            try {
                return !!Intl.DateTimeFormat().resolvedOptions().timeZone
            } catch (t) {
                return !1
            }
        })();

        function login_name() {
            return document.querySelector('div.account-name').textContent;
        }

        function account_id() {
            return localStorage.getItem('vid');
        }

        function bid() {
            return localStorage.getItem('bid');
        }

        function api_perf() {
            return Math.min("undefined" == typeof navigator ? void 0 : navigator.hardwareConcurrency, 4095).toString(16);
        }

        function api_time() {
            return Auo ? Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase() : void 0;
        }

        function account_name(loginname) {
            return sT(RY.encode(loginname));
        }

        function get_account() {
            return {
                "account-id": account_id(),
                "account-name": account_name(login_name()),
                "api-bid": bid(),
                "api-version": api_version,
                "api-time": api_time(),
                "api-perf": api_perf()
            };
        }
        async function sendPony(ponyData) {
            try {
                const result = await sendRequest("https://pony.town/api/pony/save", get_account(), ponyData);
                if (result.status === 200) {
                    if (result.contentType === "application/octet-stream") {
                        //const content = PonyImportModule.ParsePonyReturn(new Uint8Array(result.content));
                        //console.log("导入成功:", content.name || "未知");
                    } else {
                        //console.log("导入成功:", result.content || "无返回内容");
                    }
                } else {
                    //console.error("导入失败:", result.status, result.content);
                }
                return result;
            } catch (err) {
                console.error("请求失败（网络或解析错误）:", err.message || err);
                //throw new Error(`请求失败：${err.message || err}`);
                return { error: err.message || err, status: 0, content: "" };
            }
        }
        async function exportPlush(i = -1) {
            try {
                const result = await getPlush();
                if (result.status === 200) {
                    if (result.contentType === "application/octet-stream" && result.content?.length) {
                        const content = result.content;
                        const searchInput = document.querySelector("character-plush-select .character-select-search input");
                        const searchTerm = searchInput?.value.trim().toLowerCase();
                        const filteredData = searchTerm ? content.filter(item => item.name.toLowerCase().includes(searchTerm)) : content; //过滤
                        const plush = i >= 0 ? [filteredData[i]] : filteredData;
                        PonySaveModule.DownloadExportPlush(`pony-town-${i>=0 ? plush[0]?.name || "plush" : "plushes"}`, plush);
                        result.content = plush;
                        //const base64 = sT(new TextEncoder().encode(JSON.stringify(plush)));
                        //window.saveAs(new Blob([base64], {type: "text/plain;charset=utf-8"}), `pony-town-${i>=0 ? plush[0]?.name || "plush" : "plushes"}.ptp`);
                        //console.log("成功:", plush || "未知")
                    }
                }
                return result;
            } catch (err) {
                console.error("保存失败（网络或解析错误）:", err.message || err);
                return { error: err.message || err, status: 0, content: "" };
            }
        }

        async function getPlush() {
            try {
                const result = await sendRequest("https://pony.town/api/account-plushies", get_account());
                if (result.status === 200) {
                    if (result.contentType === "application/octet-stream") {
                        result.content = PonyImportModule.ParsePlushReturn(new Uint8Array(result.content));
                    }
                }
                return result;
            } catch (err) {
                console.error("请求失败（网络或解析错误）:", err.message || err);
                return { error: err.message || err, status: 0, content: "" };
            }
        }
        async function sendPlush(plushData) {
            try {
                const result = await sendRequest("https://pony.town/api/customtoy/save", get_account(), plushData);
                return result;
            } catch (err) {
                console.error("请求失败（网络或解析错误）:", err.message || err);
                return { error: err.message || err, status: 0, content: "" };
            }
        }
        return { sendPony, exportPlush, getPlush, sendPlush, get_account, account_id };
    })();

    const PonyButtonModule = (() => {
        function checkAndAddButtonPony() {
            const targetBtn = document.querySelector('button[aria-label="Export / Import"]');
            
            if (targetBtn && !document.getElementById('importButtonPony')) {
                const xpath = `//div[contains(@class, 'tab-content')]//div[contains(@class, 'character-tab')]//label[contains(text(), 'Export')]`;
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const label = result.singleNodeValue;
                if (label) label.textContent = "Export/Import";

                const oldfileInput = document.querySelector('input[type="file"].d-none[accept=".txt, .ptc"]');
                if (oldfileInput) oldfileInput.parentNode.removeChild(oldfileInput);

                const importBtn = document.createElement('button');
                importBtn.id = 'importButtonPony';
                importBtn.title = 'Import Pony';
                importBtn.className = 'btn btn-default';
                importBtn.style = "border-top-right-radius: 3px; border-bottom-right-radius: 3px;";
                importBtn.innerHTML = `
                  <fa-icon class="ng-fa-icon">
                    <svg data-prefix="fas" data-icon="upload" class="svg-inline--fa fa-upload" role="img" viewBox="0 0 448 512">
                      <path fill="currentColor" d="M256 109.3L256 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-210.7-41.4 41.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l96-96c12.5-12.5 32.8-12.5 45.3 0l96 96c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 109.3zM224 400c44.2 0 80-35.8 80-80l80 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64l80 0c0 44.2 35.8 80 80 80zm144 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
                    </svg>
                  </fa-icon>
                `;

                const fileInput = document.createElement('input');
                fileInput.id = 'fileInputPony';
                fileInput.type = 'file';
                fileInput.accept = '.txt, .ptc';
                fileInput.style.display = 'none';
                importBtn.appendChild(fileInput);
                
                targetBtn.style = "border-top-right-radius: 0; border-bottom-right-radius: 0;";
                targetBtn.insertAdjacentElement('afterend', importBtn);

                importBtn.addEventListener('click', () => {
                    if (PonyVersionModule.get_version() == version) {
                        fileInput.click();
                    } else {
                        PonyVersionModule.getScriptVersion().then(scriptversion => {
                            if (scriptversion != version) {
                                window.open(`${PonyVersionModule.getScriptUrl()}&version=${version}`, '_blank');
                            } else {
                                PonyButtonModule.showCustomAlert(zh ? "版本过旧" : "Version Outdated", zh ? `小马导入脚本版本: ${scriptversion} 过旧.<br>不适用于游戏版本: ${PonyVersionModule.get_version()}.<br>请耐心等待小马导入脚本更新.` : `The ponyimport version: ${scriptversion} is outdated.<br>It is not compatible with the game version: ${PonyVersionModule.get_version()}.<br>Please wait patiently for the ponyimport to be updated.`);
                            }
                        });
                    }
                });

                fileInput.addEventListener('change', (event) => {
                    const file = event.target.files[0];
                    if (!file) return;

                    //console.log('Selected file:', file.name);

                    const isValidFileType = (file) => {
                        const mimeType = file.type;
                        const fileName = file.name.toLowerCase();

                        const isTextOrJson = mimeType.includes('text/')
                        const isTargetExtension = fileName.endsWith('.txt') || fileName.endsWith('.ptc');

                        return isTextOrJson || isTargetExtension;
                    };

                    if (isValidFileType(file)) {
                        const reader = new FileReader();
                        reader.onload = async (e) => {
                            const content = e.target.result;
                            try {
                                await PonyImportModule.importPonies(content);
                                console.log("文件导入完成：", file.name);
                            } catch (error) {
                                console.error("文件导入失败：", error.message || error);
                            } finally {
                                event.target.value = '';
                            }
                        };
                        reader.onerror = () => {
                            console.error("文件读取失败");
                            event.target.value = '';
                        };
                        reader.readAsText(file);
                    } else {
                        console.warn("不支持的文件类型：", file.name);
                        event.target.value = '';
                    }
                });
            }
        }
        
        function getSelectedPonyItemId(list = "character-plush-list") {
            const selectionList = document.querySelector(`${list} .selection-list`);
            if (!selectionList) return -1;
            const ponyItems = selectionList.querySelectorAll('[id^="pony-item-"]');
            for (const item of ponyItems) {
                if (item.classList.contains('selected')) {
                    const match = item.id.match(/pony-item-(\d+)/);
                    return match ? parseInt(match[1], 10) : -1;
                }
            } 
            return -1;
        }

        function countPonyItems(list = "character-plush-list") {
            const selectionList = document.querySelector(`${list} .selection-list`);
            if (!selectionList) return 0;
            
            const ponyItems = selectionList.querySelectorAll('[id^="pony-item-"]');
            return ponyItems.length;
        }

        function checkAndAddButtonImportPlush() {
            const targetBtn = document.querySelector('button[aria-label="Create new plush"]');

            if (targetBtn && !document.getElementById('importButtonPlush')) {

                const importBtn = document.createElement('button');
                importBtn.id = 'importButtonPlush';
                importBtn.title = 'Import Plush';
                importBtn.className = 'btn btn-default ms-1 align-self-start';
                importBtn.setAttribute('aria-label', 'Import character plush');
                importBtn.setAttribute('ngbtooltip', 'Import plush');
                importBtn.innerHTML = `
                  <fa-icon class="ng-fa-icon">
                    <svg data-prefix="fas" data-icon="upload" class="svg-inline--fa fa-upload fa-width-auto" role="img" viewBox="0 0 448 512">
                      <path fill="currentColor" d="M256 109.3L256 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-210.7-41.4 41.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l96-96c12.5-12.5 32.8-12.5 45.3 0l96 96c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 109.3zM224 400c44.2 0 80-35.8 80-80l80 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64l80 0c0 44.2 35.8 80 80 80zm144 24a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
                    </svg>
                  </fa-icon>
                `;
                
                const fileInput = document.createElement('input');
                fileInput.id = 'fileInputPlush';
                fileInput.type = 'file';
                fileInput.accept = '.txt, .ptp';
                fileInput.style.display = 'none';
                importBtn.appendChild(fileInput);

                const targetBtnParent = targetBtn.parentNode;
                targetBtnParent.insertAdjacentElement('beforebegin', importBtn);

                importBtn.addEventListener('click', () => {
                    if (PonyVersionModule.get_version() == version) {
                        fileInput.click();
                    } else {
                        PonyVersionModule.getScriptVersion().then(scriptversion => {
                            if (scriptversion != version) {
                                window.open(`${PonyVersionModule.getScriptUrl()}&version=${version}`, '_blank');
                            } else {
                                PonyButtonModule.showCustomAlert(zh ? "版本过旧" : "Version Outdated", zh ? `小马导入脚本版本: ${scriptversion} 过旧.<br>不适用于游戏版本: ${PonyVersionModule.get_version()}.<br>请耐心等待小马导入脚本更新.` : `The ponyimport version: ${scriptversion} is outdated.<br>It is not compatible with the game version: ${PonyVersionModule.get_version()}.<br>Please wait patiently for the ponyimport to be updated.`);
                            }
                        });
                    }
                });

                fileInput.addEventListener('change', (event) => {
                    const file = event.target.files[0];
                    if (!file) return;

                    //console.log('Selected file:', file.name);

                    const isValidFileType = (file) => {
                        const mimeType = file.type;
                        const fileName = file.name.toLowerCase();

                        const isTextOrJson = mimeType.includes('text/')
                        const isTargetExtension = fileName.endsWith('.txt') || fileName.endsWith('.ptp');

                        return isTextOrJson || isTargetExtension;
                    };

                    if (isValidFileType(file)) {
                        const reader = new FileReader();
                        reader.onload = async (e) => {
                            const content = e.target.result;
                            try {
                                await PonyImportModule.importPlushes(content);
                                console.log("文件导入完成：", file.name);
                            } catch (error) {
                                console.error("文件导入失败：", error.message || error);
                            } finally {
                                event.target.value = '';
                            }
                        };
                        reader.onerror = () => {
                            console.error("文件读取失败");
                            event.target.value = '';
                        };
                        reader.readAsText(file);
                    } else {
                        console.warn("不支持的文件类型：", file.name);
                        event.target.value = '';
                    }
                });
            }
        }

        function checkAndAddButtonExportPlush() {
            const targetBtn = document.querySelector('button[aria-label="Edit character plush"]');
            if (targetBtn) {
                let exportBtn = document.getElementById('exportButtonPlush');
                if (!exportBtn) {
                    const exportBtn = document.createElement('button');
                    exportBtn.id = 'exportButtonPlush';
                    exportBtn.title = 'Export Plush';
                    exportBtn.className = 'btn btn-default ms-1';
                    exportBtn.setAttribute('aria-label', 'Export character plush');
                    exportBtn.setAttribute('ngbtooltip', 'Export plush');

                    const icon = document.createElement('fa-icon');
                    icon.className = 'ng-fa-icon fa-width-auto me-1';
                    icon.innerHTML = `
                        <svg data-prefix="fas" data-icon="download" class="svg-inline--fa fa-download fa-undefined fa-pull-undefined" role="img" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M256 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 210.7-41.4-41.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 242.7 256 32zM64 320c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-46.9 0-56.6 56.6c-31.2 31.2-81.9 31.2-113.1 0L110.9 320 64 320zm304 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>
                        </svg>
                    `;
                    
                    const text = document.createTextNode('Export all');
                    exportBtn.appendChild(icon);
                    exportBtn.appendChild(text);

                    targetBtn.insertAdjacentElement('afterend', exportBtn);

                    exportBtn.addEventListener('click', () => {
                        if (PonyVersionModule.get_version() == version) {
                            SendPonyModule.exportPlush(getSelectedPonyItemId("character-plush-list"));
                        } else {
                            PonyVersionModule.getScriptVersion().then(scriptversion => {
                                if (scriptversion != version) {
                                    window.open(`${PonyVersionModule.getScriptUrl()}&version=${version}`, '_blank');
                                } else {
                                    PonyButtonModule.showCustomAlert(zh ? "版本过旧" : "Version Outdated", zh ? `小马导入脚本版本: ${scriptversion} 过旧.<br>不适用于游戏版本: ${PonyVersionModule.get_version()}.<br>请耐心等待小马导入脚本更新.` : `The ponyimport version: ${scriptversion} is outdated.<br>It is not compatible with the game version: ${PonyVersionModule.get_version()}.<br>Please wait patiently for the ponyimport to be updated.`);
                                }
                            });
                        }
                    });
                }
            }
        }

        function checkAndUpdateButtonExportPlush() {
            let exportBtn = document.getElementById('exportButtonPlush');
            if (exportBtn) {
                const disableBtn = document.querySelector('button[aria-label="Can\'t duplicate this plush as it hasn\'t been saved yet"]');
                exportBtn.disabled = (disableBtn || !countPonyItems()) ? true : false 
                const plushid = getSelectedPonyItemId("character-plush-list");
                const plushtext = plushid >= 0 ? 'Export' : 'Export all';
                if (exportBtn.textContent.trim() !== plushtext) {
                    const icon = exportBtn.querySelector('fa-icon');
                    exportBtn.innerHTML = '';
                    if (icon) exportBtn.appendChild(icon.cloneNode(true));
                    exportBtn.appendChild(document.createTextNode(plushtext));
                }
            }
        }

        function checkAndAddButtonInterval() {
            let isChecking = false;

            const throttleCheck = () => {
                if (isChecking) {
                    return;
                }
                isChecking = true;
                requestAnimationFrame(() => {
                    checkAndAddButtonPony();
                    if (document.querySelector('character tabset .character-tab character-plush-select')) {
                        checkAndAddButtonImportPlush();
                        checkAndAddButtonExportPlush();
                    }
                    isChecking = false;
                });
            };

            const observerplush = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        checkAndUpdateButtonExportPlush();
                        return;
                    }
                });
            });

            const observedElements = new WeakMap();

            MutationObserver.prototype.isObserving = function (element) {
                return observedElements.has(element);
            };

            const originalObserve = MutationObserver.prototype.observe;
            const originalDisconnect = MutationObserver.prototype.disconnect;

            MutationObserver.prototype.observe = function (element, options) {
                observedElements.set(element, true);
                originalObserve.call(this, element, options);
            };

            MutationObserver.prototype.disconnect = function () {
                originalDisconnect.call(this);
            };
        
            const parentContainer = document.body;
            let debounceTimer;
            const observer = new MutationObserver((mutations) => {
                clearTimeout(debounceTimer);
                
                debounceTimer = setTimeout(() => {
                    const target = document.querySelector('character tabset .character-tab');
                    if (target) throttleCheck();
                }, 100);

                const targetElement = document.querySelector('character-plush-list .selection-list .selection-list-inner');
                if (targetElement) {
                    if (!observerplush.isObserving(targetElement)) {
                        observerplush.observe(targetElement, {
                            subtree: true,
                            attributes: true,
                            attributeFilter: ['class'],
                        });
                    }
                } else {
                    observerplush.disconnect();
                }
            });
            observer.observe(parentContainer, {
                childList: true,
                subtree: true
            });
        
            throttleCheck();
        }

        function createProgressBar(total) {
            const progressContainer = document.createElement("div");
            progressContainer.id = "progressContainer";
            Object.assign(progressContainer.style, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                background: "#212121",
                zIndex: "999999",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                borderBottom: "1px solid #444444"
            });
        
            const progressBar = document.createElement("div");
            progressBar.id = "progressBar";
            Object.assign(progressBar.style, {
                height: "4px",
                width: "0%",
                background: "#EAEAEA",
                transition: "width 0.3s ease-out"
            });
        
            const progressText = document.createElement("div");
            progressText.id = "progressText";
            Object.assign(progressText.style, {
                padding: "8px 15px",
                fontSize: "14px",
                color: "#EEE",
                fontWeight: "500",
                textAlign: "center"
            });
            progressText.textContent = navigator.language.startsWith("zh") 
                ? `导入中... 0/${total}` 
                : `Importing... 0/${total}`;
        
            progressContainer.appendChild(progressBar);
            progressContainer.appendChild(progressText);
            document.body.appendChild(progressContainer);
        
            function updateProgress(current, imported, failed, skipped) {
                const progress = Math.round((current / total) * 100);
                progressBar.style.width = `${progress}%`;
                
                const isChinese = navigator.language.startsWith("zh");
                progressText.textContent = isChinese
                    ? `导入中... ${current}/${total} (${imported} 成功, ${failed} 失败${skipped > 0 ? `, ${skipped} 跳过` : ''})`
                    : `Importing... ${current}/${total} (${imported} succeeded, ${failed} failed${skipped > 0 ? `, ${skipped} skipped` : ''})`;
            }
        
            function removeProgress() {
                if (progressContainer && document.body.contains(progressContainer)) {
                    document.body.removeChild(progressContainer);
                }
            }
        
            return {
                updateProgress,
                removeProgress
            };
        }

        const showCustomAlert = (title, message, reload=false) => {
            const modal_style = document.createElement("style");
            modal_style.textContent = `
                ngb-modal-window .component-host-scrollable {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
            `;

            const modal_backdrop = document.createElement("ngb-modal-backdrop");
            modal_backdrop.style = "z-index: 1055;";
            modal_backdrop.setAttribute("aria-hidden", "true");
            modal_backdrop.classList.add("modal-backdrop", "fade");

            const modal_window =  document.createElement("ngb-modal-window");
            modal_window.setAttribute("tabindex", "-1");
            modal_window.setAttribute("aria-modal", "true");
            modal_window.setAttribute("role", "dialog");
            modal_window.classList.add("d-block", "modal", "fade", "show");
            
            const modal_document =  document.createElement("div");
            modal_document.setAttribute("role", "document");
            modal_document.classList.add("modal-dialog");

            const modal_content =  document.createElement("div");
            modal_content.classList.add("modal-content");

            const modal_header = document.createElement("div");
            modal_header.classList.add("modal-header");
            modal_header.innerHTML = `
                <h4 labelledby=".modal" class="modal-title unselectable">
                    <span>${title}</span>
                </h4>
            `;
            const btnClose = document.createElement("button");
            btnClose.className = "btn-close";
            btnClose.setAttribute("aria-label", "Close");

            modal_header.appendChild(btnClose);

            const modal_body = document.createElement("div");
            modal_body.classList.add("modal-body", "modal-checkboxes");
            modal_body.innerHTML = `
                <div class="content">
                    <div class=" text-center text-muted">${message}</div>
                </div>
            `;

            const modal_footer = document.createElement("div");
            modal_footer.classList.add("modal-footer", "d-flex");

            const close_button = document.createElement("button");
            close_button.className = "btn btn-outline-secondary ms-2";
            close_button.textContent = zh ? "关闭" : "Close";
            
            modal_footer.appendChild(close_button);
            
            const reload_button = document.createElement("button");
            reload_button.className = "btn btn-success";
            reload_button.textContent = zh ? "刷新" : "Reload";

            if (reload) {
                modal_footer.appendChild(reload_button);
            }

            modal_content.appendChild(modal_header);
            modal_content.appendChild(modal_body);
            modal_content.appendChild(modal_footer);

            modal_document.appendChild(modal_content);
            modal_window.appendChild(modal_document);

            document.head.appendChild(modal_style);

            openModal();

            function openModal() {
                document.body.appendChild(modal_backdrop);
                document.body.appendChild(modal_window);
            
                void modal_window.offsetWidth;

                modal_backdrop.classList.add("show");
            }
            
            function closeModal() {
                modal_backdrop.classList.remove("show");
                modal_window.classList.remove("show");
            
                const onTransitionEnd = () => {
                    modal_backdrop.remove();
                    modal_window.remove();
                    document.removeEventListener("keydown", handleKeyDown);
                    modal_backdrop.removeEventListener("transitionend", onTransitionEnd);
                    modal_window.removeEventListener("transitionend", onTransitionEnd);
                };
            
                modal_backdrop.addEventListener("transitionend", onTransitionEnd);
                modal_window.addEventListener("transitionend", onTransitionEnd);
            
                if (modal_style) modal_style.remove();
            }
            
            btnClose.addEventListener("click", closeModal);
            
            close_button.onclick = closeModal;

            if (reload) {
                reload_button.onclick = () => {
                    closeModal();
                    location.reload(true);
                };
            }
            
            const handleKeyDown = (e) => {
                if (e.key === "Escape") {
                    closeModal();
                }
            };
            document.addEventListener("keydown", handleKeyDown);
        };

        return { checkAndAddButtonInterval, createProgressBar, showCustomAlert };
    })();

    const PonyVersionModule = (() => {
        function get_version() {
            return document.body.getAttribute('data-version');
        }

        function getScriptUrl() {
            const timestamp = Math.floor(Date.now() / 1000);
            const url = `https://ponyjs.lonel.uno/ponyimport/?_=${timestamp}`;
            return url;
        }

        async function getScriptVersion() {
            const response = await fetch(getScriptUrl());
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const version = doc.querySelector('meta[name="script-version"]').getAttribute('content');
            return version;
        }

        function runAfterDOMLoaded(callback) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', callback);
            } else {
                callback();
            }
        }
        
        function runScript() {
            runAfterDOMLoaded(function() {
                if (SendPonyModule.account_id() != "---") {
                    PonyButtonModule.checkAndAddButtonInterval();
                }
            });
        }

        return { runScript, get_version, getScriptUrl, getScriptVersion };
    })();

    PonyVersionModule.runScript();
})();