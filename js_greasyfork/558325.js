// ==UserScript==
// @name         SPDPO-CCC-Helper (Tampermonkey)
// @namespace    https://github.com/Gentle-Lijie/SPDPO-CCC-Helper
// @version      1.0.0
// @description  在 nottingham.edu.cn 捕获“查看详情/开始报名”ID，生成访问/二维码，并支持持久化定时提交。
// @license      MIT
// @match        https://*.nottingham.edu.cn/*
// @match        https://nottingham.edu.cn/*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// (已移除外部 @require，库代码已内联以满足用户脚本政策)
// @downloadURL https://update.greasyfork.org/scripts/558325/SPDPO-CCC-Helper%20%28Tampermonkey%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558325/SPDPO-CCC-Helper%20%28Tampermonkey%29.meta.js
// ==/UserScript==

/* QRCode library inlined from extension/qrcode.js (MIT) - avoids external @require */
/* BEGIN inlined qrcode.js */
var QRCode; (function () {
    function QR8bitByte(data) {
        this.mode = QRMode.MODE_8BIT_BYTE;
        this.data = data;
    }
    QR8bitByte.prototype = {
        getLength: function (buffer) { return this.data.length; },
        write: function (buffer) {
            for (var i = 0; i < this.data.length; i++) {
                buffer.put(this.data.charCodeAt(i), 8);
            }
        }
    };

    var QRMode = { MODE_8BIT_BYTE: 1 }; // simplified
    var QRErrorCorrectLevel = { L: 1, M: 0, Q: 3, H: 2 };

    function QRCodeModel(typeNumber, errorCorrectLevel) {
        this.typeNumber = typeNumber;
        this.errorCorrectLevel = errorCorrectLevel;
        this.modules = null;
        this.moduleCount = 0;
        this.dataCache = null;
        this.dataList = [];
    }

    QRCodeModel.prototype = {
        addData: function (data) {
            var newData = new QR8bitByte(data);
            this.dataList.push(newData);
            this.dataCache = null;
        },
        isDark: function (row, col) {
            if (this.modules[row][col] != null) return this.modules[row][col];
            else return false;
        },
        getModuleCount: function () { return this.moduleCount; },
        make: function () {
            this.typeNumber = this._getMinimumTypeNumber();
            this._makeImpl(false, this.getBestMaskPattern());
        },
        _getMinimumTypeNumber: function () {
            var length = 0;
            for (var i = 0; i < this.dataList.length; i++) {
                length += this.dataList[i].data.length;
            }
            var capacities = [
                0, 17, 32, 53, 78, 106, 134, 154, 192, 230, 271, 321, 367, 425, 458, 520, 586, 644, 718, 792, 858, 929, 1003, 1091, 1171, 1273, 1367, 1465, 1528, 1628, 1732, 1840, 1952, 2068, 2188, 2303, 2431, 2563, 2699, 2809, 2953
            ];
            for (var t = 1; t < capacities.length; t++) {
                if (length + 2 <= capacities[t]) return t;
            }
            return 10;
        },
        _makeImpl: function (test, maskPattern) {
            this.moduleCount = this.typeNumber * 4 + 17;
            this.modules = new Array(this.moduleCount);
            for (var row = 0; row < this.moduleCount; row++) {
                this.modules[row] = new Array(this.moduleCount);
                for (var col = 0; col < this.moduleCount; col++) this.modules[row][col] = null;
            }
            this._setupPositionProbePattern(0, 0);
            this._setupPositionProbePattern(this.moduleCount - 7, 0);
            this._setupPositionProbePattern(0, this.moduleCount - 7);
            this._setupPositionAdjustPattern();
            this._setupTimingPattern();
            this._setupTypeInfo(test, maskPattern);
            if (this.typeNumber >= 7) this._setupTypeNumber(test);
            if (this.dataCache == null) this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
            this._mapData(this.dataCache, maskPattern);
        },
        _setupPositionProbePattern: function (row, col) {
            for (var r = -1; r <= 7; r++) {
                if (row + r <= -1 || this.moduleCount <= row + r) continue;
                for (var c = -1; c <= 7; c++) {
                    if (col + c <= -1 || this.moduleCount <= col + c) continue;
                    if ((0 <= r && r <= 6 && (c == 0 || c == 6)) || (0 <= c && c <= 6 && (r == 0 || r == 6)) || (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
                        this.modules[row + r][col + c] = true;
                    } else {
                        this.modules[row + r][col + c] = false;
                    }
                }
            }
        },
        _getBestMaskPattern: function () {
            var minLostPoint = 0;
            var pattern = 0;
            for (var i = 0; i < 8; i++) {
                this._makeImpl(true, i);
                var lostPoint = QRUtil.getLostPoint(this);
                if (i == 0 || minLostPoint > lostPoint) { minLostPoint = lostPoint; pattern = i; }
            }
            return pattern;
        },
        _setupTimingPattern: function () {
            for (var r = 8; r < this.moduleCount - 8; r++) {
                if (this.modules[r][6] != null) continue;
                this.modules[r][6] = (r % 2 == 0);
            }
            for (var c = 8; c < this.moduleCount - 8; c++) {
                if (this.modules[6][c] != null) continue;
                this.modules[6][c] = (c % 2 == 0);
            }
        },
        _setupPositionAdjustPattern: function () {
            var pos = QRUtil.getPatternPosition(this.typeNumber);
            for (var i = 0; i < pos.length; i++) {
                for (var j = 0; j < pos.length; j++) {
                    var row = pos[i], col = pos[j];
                    if (this.modules[row][col] != null) continue;
                    for (var r = -2; r <= 2; r++) {
                        for (var c = -2; c <= 2; c++) {
                            if (r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0)) this.modules[row + r][col + c] = true;
                            else this.modules[row + r][col + c] = false;
                        }
                    }
                }
            }
        },
        _setupTypeNumber: function (test) {
            var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
            for (var i = 0; i < 18; i++) {
                var mod = (!test && ((bits >> i) & 1) == 1);
                this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
                this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
            }
        },
        _setupTypeInfo: function (test, maskPattern) {
            var data = (QRErrorCorrectLevel.M << 3) | maskPattern;
            var bits = QRUtil.getBCHTypeInfo(data);
            for (var i = 0; i < 15; i++) {
                var mod = (!test && ((bits >> i) & 1) == 1);
                if (i < 6) this.modules[i][8] = mod; else if (i < 8) this.modules[i + 1][8] = mod; else this.modules[this.moduleCount - 15 + i][8] = mod;
            }
            for (var j = 0; j < 15; j++) {
                var mod = (!test && ((bits >> j) & 1) == 1);
                if (j < 8) this.modules[8][this.moduleCount - 1 - j] = mod; else if (j < 9) this.modules[8][15 - j - 1] = mod; else this.modules[8][15 - j - 1] = mod;
            }
            this.modules[this.moduleCount - 8][8] = !test;
        },
        _mapData: function (data, maskPattern) {
            var inc = -1;
            var row = this.moduleCount - 1;
            var bitIndex = 7;
            var byteIndex = 0;
            for (var col = this.moduleCount - 1; col > 0; col -= 2) {
                if (col == 6) col--;
                while (true) {
                    for (var c = 0; c < 2; c++) {
                        if (this.modules[row][col - c] == null) {
                            var dark = false;
                            if (byteIndex < data.length) dark = (((data[byteIndex] >>> bitIndex) & 1) == 1);
                            var mask = QRUtil.getMask(maskPattern, row, col - c);
                            if (mask) dark = !dark;
                            this.modules[row][col - c] = dark;
                            bitIndex--;
                            if (bitIndex == -1) { byteIndex++; bitIndex = 7; }
                        }
                    }
                    row += inc;
                    if (row < 0 || this.moduleCount <= row) { row -= inc; inc = -inc; break; }
                }
            }
        }
    };

    QRCodeModel.PAD0 = 0xEC; QRCodeModel.PAD1 = 0x11;

    QRCodeModel.createData = function (typeNumber, errorCorrectLevel, dataList) {
        var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
        var buffer = new QRBitBuffer();
        for (var i = 0; i < dataList.length; i++) {
            var data = dataList[i];
            buffer.put(4, 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
            data.write(buffer);
        }
        var totalDataCount = 0;
        for (var i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
        if (buffer.getLengthInBits() > totalDataCount * 8) throw new Error("code length overflow.");
        if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) buffer.put(0, 4);
        while (buffer.getLengthInBits() % 8 != 0) buffer.putBit(false);
        while (true) {
            if (buffer.getLengthInBits() >= totalDataCount * 8) break;
            buffer.put(QRCodeModel.PAD0, 8);
            if (buffer.getLengthInBits() >= totalDataCount * 8) break;
            buffer.put(QRCodeModel.PAD1, 8);
        }
        return QRCodeModel.createBytes(buffer, rsBlocks);
    };

    QRCodeModel.createBytes = function (buffer, rsBlocks) {
        var offset = 0;
        var maxDcCount = 0, maxEcCount = 0;
        var dcdata = new Array(rsBlocks.length);
        var ecdata = new Array(rsBlocks.length);
        for (var r = 0; r < rsBlocks.length; r++) {
            var dcCount = rsBlocks[r].dataCount;
            var ecCount = rsBlocks[r].totalCount - dcCount;
            maxDcCount = Math.max(maxDcCount, dcCount);
            maxEcCount = Math.max(maxEcCount, ecCount);
            dcdata[r] = new Array(dcCount);
            for (var i = 0; i < dcdata[r].length; i++) dcdata[r][i] = 0xff & buffer.buffer[i + offset];
            offset += dcCount;
            var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
            var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
            var modPoly = rawPoly.mod(rsPoly);
            ecdata[r] = new Array(rsPoly.getLength() - 1);
            for (var i = 0; i < ecdata[r].length; i++) {
                var modIndex = i + modPoly.getLength() - ecdata[r].length;
                ecdata[r][i] = (modIndex >= 0) ? modPoly.getAt(modIndex) : 0;
            }
        }
        var totalCodeCount = 0;
        for (var i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
        var data = new Array(totalCodeCount);
        var index = 0;
        for (var i = 0; i < maxDcCount; i++) {
            for (var r = 0; r < rsBlocks.length; r++) if (i < dcdata[r].length) data[index++] = dcdata[r][i];
        }
        for (var i = 0; i < maxEcCount; i++) {
            for (var r = 0; r < rsBlocks.length; r++) if (i < ecdata[r].length) data[index++] = ecdata[r][i];
        }
        return data;
    };

    function QRPolynomial(num, shift) {
        var offset = 0;
        while (offset < num.length && num[offset] == 0) offset++;
        this.num = new Array(num.length - offset + shift);
        for (var i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
    }
    QRPolynomial.prototype = {
        getAt: function (index) { return this.num[index]; },
        getLength: function () { return this.num.length; },
        multiply: function (e) {
            var num = new Array(this.getLength() + e.getLength() - 1);
            for (var i = 0; i < num.length; i++) num[i] = 0;
            for (var i = 0; i < this.getLength(); i++) {
                for (var j = 0; j < e.getLength(); j++) num[i + j] ^= QRUtil.gexp(QRUtil.glog(this.getAt(i)) + QRUtil.glog(e.getAt(j)));
            }
            return new QRPolynomial(num, 0);
        },
        mod: function (e) {
            if (this.getLength() - e.getLength() < 0) return this;
            var ratio = QRUtil.glog(this.getAt(0)) - QRUtil.glog(e.getAt(0));
            var num = new Array(this.getLength());
            for (var i = 0; i < this.getLength(); i++) num[i] = this.getAt(i);
            for (var i = 0; i < e.getLength(); i++) num[i] ^= QRUtil.gexp(QRUtil.glog(e.getAt(i)) + ratio);
            return new QRPolynomial(num, 0).mod(e);
        }
    };

    function QRRSBlock(totalCount, dataCount) { this.totalCount = totalCount; this.dataCount = dataCount; }
    QRRSBlock.getRSBlocks = function (typeNumber, errorCorrectLevel) {
        var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
        if (!rsBlock) throw new Error('bad rs block');
        var list = [];
        for (var i = 0; i < rsBlock.length / 3; i++) {
            var count = rsBlock[i * 3 + 0];
            var totalCount = rsBlock[i * 3 + 1];
            var dataCount = rsBlock[i * 3 + 2];
            for (var j = 0; j < count; j++) list.push(new QRRSBlock(totalCount, dataCount));
        }
        return list;
    };
    QRRSBlock.getRsBlockTable = function (typeNumber, errorCorrectLevel) {
        var rsTables = [null,
            [1, 26, 16],
            [1, 44, 28],
            [1, 70, 44],
            [1, 100, 64],
            [1, 134, 86],
            [2, 86, 62],
            [2, 98, 74],
            [2, 121, 86],
            [2, 146, 108],
            [2, 86, 68, 2, 87, 69],
            [4, 101, 81],
            [2, 116, 92, 2, 117, 93],
            [4, 133, 107],
            [3, 145, 115, 1, 146, 116],
            [5, 109, 87, 1, 110, 88],
            [5, 122, 98, 1, 123, 99],
            [1, 135, 107, 5, 136, 108],
            [5, 150, 120, 1, 151, 121],
            [3, 141, 113, 4, 142, 114],
            [3, 135, 107, 5, 136, 108],
            [4, 144, 116, 4, 145, 117],
            [2, 139, 111, 7, 140, 112],
            [4, 151, 121, 5, 152, 122],
            [6, 147, 117, 4, 148, 118],
            [8, 132, 106, 4, 133, 107],
            [10, 142, 114, 2, 143, 115],
            [8, 152, 122, 4, 153, 123],
            [3, 147, 117, 10, 148, 118],
            [7, 146, 116, 7, 147, 117],
            [5, 145, 115, 10, 146, 116],
            [13, 145, 115, 3, 146, 116],
            [17, 145, 115],
            [17, 145, 115, 1, 146, 116],
            [13, 145, 115, 6, 146, 116],
            [12, 151, 121, 7, 152, 122],
            [6, 151, 121, 14, 152, 122],
            [17, 152, 122, 4, 153, 123],
            [4, 152, 122, 18, 153, 123],
            [20, 147, 117, 4, 148, 118],
            [19, 148, 118, 6, 149, 119]
        ];
        return rsTables[typeNumber];
    };

    var QRUtil = {
        PATTERN_POSITION_TABLE: [
            [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]
        ],
        G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1),
        G18: (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1),
        G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),
        getBCHTypeInfo: function (data) {
            var d = data << 10;
            while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15)));
            return ((data << 10) | d) ^ QRUtil.G15_MASK;
        },
        getBCHTypeNumber: function (data) {
            var d = data << 12;
            while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18)));
            return (data << 12) | d;
        },
        getBCHDigit: function (data) {
            var digit = 0;
            while (data != 0) { digit++; data >>>= 1; }
            return digit;
        },
        getPatternPosition: function (typeNumber) { return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1]; },
        getMask: function (maskPattern, i, j) {
            switch (maskPattern) {
                case 0: return (i + j) % 2 == 0;
                case 1: return i % 2 == 0;
                case 2: return j % 3 == 0;
                case 3: return (i + j) % 3 == 0;
                case 4: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
                case 5: return (i * j) % 2 + (i * j) % 3 == 0;
                case 6: return ((i * j) % 2 + (i * j) % 3) % 2 == 0;
                case 7: return ((i + j) % 2 + (i * j) % 3) % 2 == 0;
                default: throw new Error('bad maskPattern:' + maskPattern);
            }
        },
        getErrorCorrectPolynomial: function (errorCorrectLength) {
            var a = new QRPolynomial([1], 0);
            for (var i = 0; i < errorCorrectLength; i++) a = a.multiply(new QRPolynomial([1, QRUtil.gexp(i)], 0));
            return a;
        },
        getLengthInBits: function (mode, type) {
            if (1 <= type && type < 10) { return 8; }
            else if (type < 27) { return 16; }
            else if (type < 41) { return 16; }
            else throw new Error('type:' + type);
        },
        glog: function (n) { if (n < 1) throw new Error('glog(' + n + ')'); return QRUtil.LOG_TABLE[n]; },
        gexp: function (n) { while (n < 0) n += 255; while (n >= 256) n -= 255; return QRUtil.EXP_TABLE[n]; },
        getLostPoint: function (qr) {
            var moduleCount = qr.getModuleCount();
            var lostPoint = 0;
            for (var row = 0; row < moduleCount; row++) {
                for (var col = 0; col < moduleCount; col++) {
                    var sameCount = 0;
                    var dark = qr.isDark(row, col);
                    for (var r = -1; r <= 1; r++) {
                        if (row + r < 0 || moduleCount <= row + r) continue;
                        for (var c = -1; c <= 1; c++) {
                            if (col + c < 0 || moduleCount <= col + c) continue;
                            if (r == 0 && c == 0) continue;
                            if (dark == qr.isDark(row + r, col + c)) sameCount++;
                        }
                    }
                    if (sameCount > 5) lostPoint += (3 + sameCount - 5);
                }
            }
            for (var row = 0; row < moduleCount - 1; row++) {
                for (var col = 0; col < moduleCount - 1; col++) {
                    var count = 0;
                    if (qr.isDark(row, col)) count++;
                    if (qr.isDark(row + 1, col)) count++;
                    if (qr.isDark(row, col + 1)) count++;
                    if (qr.isDark(row + 1, col + 1)) count++;
                    if (count == 0 || count == 4) lostPoint += 3;
                }
            }
            for (var row = 0; row < moduleCount; row++) {
                for (var col = 0; col < moduleCount - 6; col++) {
                    if (qr.isDark(row, col) && !qr.isDark(row, col + 1) && qr.isDark(row, col + 2) && qr.isDark(row, col + 3) && qr.isDark(row, col + 4) && !qr.isDark(row, col + 5) && qr.isDark(row, col + 6)) lostPoint += 40;
                }
            }
            for (var col = 0; col < moduleCount; col++) {
                for (var row = 0; row < moduleCount - 6; row++) {
                    if (qr.isDark(row, col) && !qr.isDark(row + 1, col) && qr.isDark(row + 2, col) && qr.isDark(row + 3, col) && qr.isDark(row + 4, col) && !qr.isDark(row + 5, col) && qr.isDark(row + 6, col)) lostPoint += 40;
                }
            }
            var darkCount = 0;
            for (var col = 0; col < moduleCount; col++) {
                for (var row = 0; row < moduleCount; row++) {
                    if (qr.isDark(row, col)) darkCount++;
                }
            }
            var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
            lostPoint += ratio * 10;
            return lostPoint;
        },
        EXP_TABLE: new Array(256),
        LOG_TABLE: new Array(256)
    };
    for (var i = 0; i < 8; i++) QRUtil.EXP_TABLE[i] = 1 << i;
    for (var i = 8; i < 256; i++) QRUtil.EXP_TABLE[i] = QRUtil.EXP_TABLE[i - 4] ^ QRUtil.EXP_TABLE[i - 5] ^ QRUtil.EXP_TABLE[i - 6] ^ QRUtil.EXP_TABLE[i - 8];
    for (var i = 0; i < 255; i++) QRUtil.LOG_TABLE[QRUtil.EXP_TABLE[i]] = i;

    function QRBitBuffer() { this.buffer = []; this.length = 0; }
    QRBitBuffer.prototype = {
        get: function (index) { return ((this.buffer[Math.floor(index / 8)] >>> (7 - index % 8)) & 1) == 1; },
        put: function (num, length) {
            for (var i = 0; i < length; i++) this.putBit(((num >>> (length - i - 1)) & 1) == 1);
        },
        getLengthInBits: function () { return this.length; },
        putBit: function (bit) {
            var bufIndex = Math.floor(this.length / 8);
            if (this.buffer.length <= bufIndex) this.buffer.push(0);
            if (bit) this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
            this.length++;
        }
    };

    function QRCode(typeNumber, errorCorrectLevel) {
        this._htOption = { text: '', width: 160, height: 160, correctLevel: QRErrorCorrectLevel.M };
        this.typeNumber = 4;
        this.errorCorrectLevel = errorCorrectLevel || QRErrorCorrectLevel.M;
        this.qr = null;
        this._el = null;
    }
    QRCode.prototype = {
        makeCode: function (text) {
            this._htOption.text = text;
            this.qr = new QRCodeModel(-1, this.errorCorrectLevel);
            this.qr.addData(text);
            this.qr.make();
            return this;
        },
        renderTo: function (el, opts) {
            opts = opts || {};
            var size = opts.size || 200;
            var qrcanvas = document.createElement('canvas');
            qrcanvas.width = size; qrcanvas.height = size;
            var ctx = qrcanvas.getContext('2d');
            var count = this.qr.getModuleCount();
            var tileW = size / count;
            var tileH = size / count;
            ctx.fillStyle = opts.background || '#fff';
            ctx.fillRect(0, 0, size, size);
            ctx.fillStyle = opts.color || '#000';
            for (var r = 0; r < count; r++) {
                for (var c = 0; c < count; c++) {
                    if (this.qr.isDark(r, c)) {
                        ctx.fillRect(Math.round(c * tileW), Math.round(r * tileH), Math.ceil(tileW), Math.ceil(tileH));
                    }
                }
            }
            el.innerHTML = '';
            el.appendChild(qrcanvas);
        }
    };

    QRCode.stringToBytes = function (s) { var out = []; for (var i = 0; i < s.length; i++) out.push(s.charCodeAt(i)); return out; };

    window.QRCode = QRCode;
})();
/* END inlined qrcode.js */

(function () {
    'use strict';

    const LABEL = '课程详情捕获';
    const host = location.hostname || '';
    const isCCC = host.includes('ccc.nottingham.edu.cn');
    const isSPDPO = host.includes('spdpo.nottingham.edu.cn');
    const enabled = isCCC || isSPDPO;
    if (!enabled) return;

    const CSS = `
    .ccc-helper-panel {
        position: fixed;
        right: 18px;
        bottom: 18px;
        width: 340px;
        background: #ffffff;
        color: #111827;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
        z-index: 2147483647;
        overflow: hidden;
    }
    .ccc-helper-header {
        padding: 12px 14px 8px 14px;
        font-weight: 700;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
    }
    .ccc-helper-close { border:none; background:transparent; color:#6b7280; cursor:pointer; font-size:16px; line-height:1; padding:4px; border-radius:6px; }
    .ccc-helper-close:hover { background:#f3f4f6; color:#111827; }
    .ccc-helper-body { padding: 0 14px 14px 14px; display: grid; gap: 10px; }
    .ccc-helper-id { font-size: 12px; color: #6b7280; word-break: break-all; }
    .ccc-helper-tag { display:inline-flex; padding:2px 6px; border-radius: 999px; border:1px solid #e5e7eb; background:#f3f4f6; color:#6b7280; font-size:11px; }
    .ccc-helper-card { border:1px solid #e5e7eb; border-radius:10px; padding:10px; background:#f9fafb; display:grid; gap:6px; }
    .ccc-helper-row { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
    .ccc-helper-btn { cursor:pointer; border:none; border-radius:6px; padding:8px 10px; font-weight:700; font-size:13px; background:#1677ff; color:#fff; box-shadow: 0 1px 2px rgba(0,0,0,0.06); }
    .ccc-helper-btn.secondary { background:#f5f5f5; color:#111827; border:1px solid #e5e7eb; box-shadow:none; }
    .ccc-helper-qr { display:none; justify-content:center; align-items:center; padding:6px; background:#fff; border-radius:8px; border:1px dashed #e5e7eb; }
    .ccc-helper-qr.show { display:flex; }
    .ccc-helper-trigger {
        position: fixed;
        right: 16px;
        bottom: 16px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #1677ff;
        color: #fff;
        border: none;
        box-shadow: 0 6px 18px rgba(0,0,0,0.15);
        cursor: pointer;
        z-index: 2147483646;
        font-weight: 900;
        display:flex;align-items:center;justify-content:center;padding:0;
    }
    .ccc-helper-list { border:1px solid #e5e7eb; border-radius:10px; background:#fff; max-height:180px; overflow:auto; padding:6px; display:grid; gap:6px; }
        .ccc-helper-list { position:relative; }
        .ccc-helper-list::before, .ccc-helper-list::after {
            content: '';
            position: absolute;
            left: 0; right: 0; height: 22px;
            pointer-events: none;
            transition: opacity 160ms ease;
            opacity: 0;
        }
        .ccc-helper-list::before { top: 0; background: linear-gradient(180deg, rgba(249,250,251,1), rgba(249,250,251,0)); }
        .ccc-helper-list::after { bottom: 0; background: linear-gradient(0deg, rgba(249,250,251,1), rgba(249,250,251,0)); }
        .ccc-helper-list.has-top::before { opacity: 1; }
        .ccc-helper-list.has-bottom::after { opacity: 1; }
        .ccc-scroll-indicator { position:absolute; right:8px; bottom:8px; width:18px; height:18px; display:flex; align-items:center; justify-content:center; pointer-events:none; opacity:0; transition:opacity 180ms ease; }
        .ccc-scroll-indicator.show { opacity:1; }
        .ccc-scroll-indicator svg { width:14px; height:14px; fill:#9ca3af; transform-origin:50% 50%; }
        @keyframes ccc-bob { 0% { transform: translateY(0);} 50% { transform: translateY(-4px);} 100% { transform: translateY(0);} }
    .ccc-match-item { padding:8px 10px; border:1px solid #e5e7eb; border-radius:8px; background:#f9fafb; cursor:pointer; transition: border-color 0.15s, box-shadow 0.15s; }
    .ccc-match-item:hover { border-color:#1677ff; box-shadow:0 2px 6px rgba(22,119,255,0.15); }
    .ccc-match-item.active { border-color:#1677ff; background:#eef4ff; }
    .ccc-match-title { font-weight:600; color:#111827; font-size:13px; }
    .ccc-match-sub { font-size:12px; color:#6b7280; margin-top:2px; word-break: break-all; }
    .ccc-list-hint { font-size:12px; color:#6b7280; padding:6px 8px; }
    .ccc-toast { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); background: rgba(0,0,0,0.82); color: #fff; padding: 10px 14px; border-radius: 10px; font-size: 13px; z-index: 2147483647; box-shadow:0 4px 12px rgba(0,0,0,0.25); }
  `;

    const STORAGE_KEY = 'ccc_helper_jobs_v1';
    const JOB_EXPIRE_MS = 7 * 24 * 60 * 60 * 1000; // keep completed jobs for 7 days
    let panelEl = null;
    let triggerEl = null;
    let toastEl = null;
    let matches = [];
    let currentId = null;
    let currentTitle = '';
    let currentNode = null;
    let currentIsSignup = false;
    let jobs = [];
    let schedulerTimer = null;

    function injectStyle() {
        if (typeof GM_addStyle === 'function') {
            GM_addStyle(CSS);
        } else {
            const st = document.createElement('style');
            st.textContent = CSS;
            document.head.appendChild(st);
        }
    }

    function buildUrl(kind, id) {
        const ts = Date.now();
        if (kind === 'cn') return `https://ccc.nottingham.edu.cn/study/attendance?scheduleId=${id}&time=${ts}`;
        if (kind === 'in') return `https://spdpo.nottingham.edu.cn/study/attendance?type=1&scheduleId=${id}&time=${ts}`;
        if (kind === 'out') return `https://spdpo.nottingham.edu.cn/study/attendance?type=2&scheduleId=${id}&time=${ts}`;
        return '';
    }

    function openUrl(kind) {
        if (!currentId) return;
        const url = buildUrl(kind, currentId);
        if (url) window.open(url, '_blank', 'noopener');
    }

    function renderQr(targetEl, kind) {
        if (!currentId) return;
        const url = buildUrl(kind, currentId);
        if (!url) return;
        targetEl.innerHTML = '';
        const qrWrap = document.createElement('div');
        qrWrap.className = 'ccc-helper-qr show';
        const qrHolder = document.createElement('div');
        qrWrap.appendChild(qrHolder);
        targetEl.appendChild(qrWrap);

        const apiImg = new Image();
        apiImg.alt = '二维码加载中...';
        apiImg.width = 200;
        apiImg.height = 200;
        apiImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url);
        apiImg.onload = () => {
            qrHolder.innerHTML = '';
            qrHolder.appendChild(apiImg);
        };
        apiImg.onerror = () => {
            try {
                const qr = new QRCode(0, undefined);
                qr.makeCode(url);
                qr.renderTo(qrHolder, { size: 180, background: '#fff', color: '#000' });
            } catch (err) {
                qrHolder.textContent = '生成二维码失败';
            }
        };
        qrHolder.appendChild(apiImg);
    }

    function hidePanel() {
        if (panelEl && panelEl.parentNode) {
            panelEl.parentNode.removeChild(panelEl);
        }
        panelEl = null;
    }

    function createPanel() {
        if (panelEl) return panelEl;
        panelEl = document.createElement('div');
        panelEl.className = 'ccc-helper-panel';
        const cards = `
                ${isCCC ? `
                <div class="ccc-helper-card" data-kind="cn">
                    <div class="ccc-helper-row"><strong>中国文化课</strong><span class="ccc-helper-tag">签到</span></div>
                    <div class="ccc-helper-row">
                        <button class="ccc-helper-btn" data-action="open">访问</button>
                        <button class="ccc-helper-btn secondary" data-action="qr">二维码</button>
                    </div>
                    <div class="ccc-helper-qr" data-qr></div>
                </div>
                ` : ''}
                ${isSPDPO ? `
                <div class="ccc-helper-card" data-kind="in">
                    <div class="ccc-helper-row"><strong>学分活动签到</strong><span class="ccc-helper-tag">type=1</span></div>
                    <div class="ccc-helper-row">
                        <button class="ccc-helper-btn" data-action="open">访问</button>
                        <button class="ccc-helper-btn" data-action="timed">定时提交</button>
                        <button class="ccc-helper-btn secondary" data-action="qr">二维码</button>
                    </div>
                    <div class="ccc-helper-qr" data-qr></div>
                </div>
                <div class="ccc-helper-card" data-kind="out">
                    <div class="ccc-helper-row"><strong>学分活动签退</strong><span class="ccc-helper-tag">type=2</span></div>
                    <div class="ccc-helper-row">
                        <button class="ccc-helper-btn" data-action="open">访问</button>
                        <button class="ccc-helper-btn" data-action="timed">定时提交</button>
                        <button class="ccc-helper-btn secondary" data-action="qr">二维码</button>
                    </div>
                    <div class="ccc-helper-qr" data-qr></div>
                </div>
                <div class="ccc-helper-card" id="ccc-signup-card" data-kind="signup" style="display:none;">
                    <div class="ccc-helper-row"><strong>开始报名</strong><span class="ccc-helper-tag">仅定时提交</span></div>
                    <div class="ccc-helper-row">
                        <button class="ccc-helper-btn" data-action="timed">定时提交</button>
                    </div>
                </div>
                ` : ''}
                `;

        panelEl.innerHTML = `
            <div class="ccc-helper-header">
                <span>${LABEL}</span>
                <div style="display:flex;align-items:center;gap:8px;">
                    <span class="ccc-helper-tag" id="ccc-status">待捕获</span>
                    <button class="ccc-helper-close" id="ccc-close" title="关闭">×</button>
                </div>
            </div>
            <div class="ccc-helper-body">
                <div class="ccc-helper-id" id="ccc-id">未捕获</div>
                <div class="ccc-list-hint" id="ccc-list-hint" style="display:none;">向下滑动查看更多</div>
                <div class="ccc-helper-list" id="ccc-list"></div>
                ${cards}
            </div>
        `;
        panelEl.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            if (btn.id === 'ccc-close') {
                hidePanel();
                return;
            }
            const card = btn.closest('.ccc-helper-card');
            if (!card) return;
            const kind = card.getAttribute('data-kind');
            const action = btn.getAttribute('data-action');
            const qrBox = card.querySelector('[data-qr]');
            if (action === 'open') {
                openUrl(kind);
            } else if (action === 'qr') {
                if (qrBox) {
                    qrBox.classList.add('show');
                    renderQr(qrBox, kind);
                }
            } else if (action === 'timed') {
                scheduleSelection(kind);
            }
        });
        document.body.appendChild(panelEl);
        updateModeForSignup();
        return panelEl;
    }

    function createTrigger() {
        if (triggerEl) return triggerEl;
        triggerEl = document.createElement('button');
        triggerEl.className = 'ccc-helper-trigger';
        triggerEl.innerHTML = `<svg t="1765169038591" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1757" width="20" height="20"><path d="M607.272365 705.564507c-17.152658 0-31.147394 13.508665-31.147394 30.172183l0 103.540168c0 16.664541 13.995759 30.230512 31.147394 30.230512 17.206894 0 31.233352-13.56597 31.233352-30.230512L638.505717 735.737714C638.50674 719.074196 624.480282 705.564507 607.272365 705.564507" fill="#fff" p-id="1758"></path><path d="M506.514567 197.184965c-2.294252-42.707684-35.736922-77.884858-78.500888-82.531692l0-0.644683L202.31838 114.00859c-46.981011 0-85.657892 36.95568-88.153736 83.176374l-0.143263 213.461673c0 2.696412 0.472767 5.349845 1.320065 7.78736 7.198959 42.434461 43.782156 73.2677 86.976934 73.2677l221.363643 0 4.330632-0.258896 0-0.358157c39.206954-4.187369 70.729901-33.528628 77.153194-72.003917 1.004887-3.054569 1.51961-5.736655 1.51961-8.43409L506.685459 201.500247l0-4.315282L506.514567 197.184965zM453.85523 206.405977l0 192.897312c0 21.912056-17.897625 39.709397-39.925315 39.709397L206.706317 439.012685c-21.999037 0-39.895639-17.797341-39.895639-39.709397L166.810678 206.405977c0-21.914102 17.896602-39.73805 39.895639-39.73805l207.223598 0C435.957605 166.667927 453.85523 184.492898 453.85523 206.405977" fill="#fff" p-id="1759"></path><path d="M496.158708 623.190405c-2.295276-41.530882-34.790364-75.747171-76.378551-80.308047l0-0.630357L200.051757 542.252001c-45.746904 0-83.405595 35.93749-85.872786 80.938404l-0.186242 207.797673c0 2.725064 0.531096 5.478781 1.304715 7.628748 7.013741 41.330314 42.678008 71.38891 84.754313 71.38891l215.427444 0 4.301979-0.230244 0-0.401136c38.175461-4.101411 68.835761-32.66905 75.030857-70.039169 1.032516-2.726088 1.548262-5.508457 1.548262-8.347109L496.3603 627.523083l-0.057305-4.331655L496.158708 623.191428zM444.733479 632.254851l0 187.720406c0 21.25407-17.352203 38.547944-38.71986 38.547944L204.325084 858.523201c-21.339004 0-38.692231-17.293875-38.692231-38.547944L165.632853 632.254851c0-21.224394 17.353227-38.546921 38.692231-38.546921l201.688535 0C427.381275 593.70793 444.733479 611.030457 444.733479 632.254851" fill="#fff" p-id="1760"></path><path d="M723.2324 576.068178c-17.181311 0-31.17707 13.537318-31.17707 30.200836l0 103.59952c0 16.634866 13.995759 30.200836 31.17707 30.200836 17.151635 0 31.176047-13.56597 31.176047-30.200836l0-103.59952C754.408447 589.605495 740.383012 576.068178 723.2324 576.068178" fill="#fff" p-id="1761"></path><path d="M909.977595 195.147562l-0.115634 0c-2.322905-41.645492-34.903951-75.948763-76.607772-80.536244l0-0.618077L635.811352 113.993241c-45.776579 0-83.550904 36.038798-86.074378 81.154321l-0.144286 208.356398c0 2.752694 0.51677 5.580089 1.319042 7.600095 6.999414 41.444924 42.736337 71.546499 84.899622 71.546499l193.140858 0 4.300956-0.24457 0-0.343831c38.261419-4.173043 68.978001-32.81129 75.28873-70.255087 0.975211-2.824325 1.463328-5.606695 1.463328-8.30413L910.005224 199.464891 909.977595 195.147562zM858.26584 204.226335l0 188.193173c0 21.324678-17.412578 38.662555-38.835494 38.662555L640.170636 431.082062c-21.453614 0-38.864146-17.336854-38.864146-38.662555L601.30649 204.226335c0-21.296025 17.411555-38.619576 38.864146-38.619576l179.25971 0C840.853261 165.606759 858.26584 182.930309 858.26584 204.226335" fill="#fff" p-id="1762"></path><path d="M837.699432 576.038502c-17.181311 0-31.17707 13.566994-31.17707 30.229488l0 51.77213c0 16.662495 13.995759 30.200836 31.17707 30.200836 17.180288 0 31.205723-13.537318 31.205723-30.200836l0-51.77213C868.905154 589.605495 854.87972 576.038502 837.699432 576.038502" fill="#fff" p-id="1763"></path><path d="M837.699432 731.406059c-17.181311 0-31.17707 13.537318-31.17707 30.201859l0 77.66894c0 16.693194 13.995759 30.230512 31.17707 30.230512 17.180288 0 31.205723-13.537318 31.205723-30.230512l0-77.66894C868.905154 744.943376 854.87972 731.406059 837.699432 731.406059" fill="#fff" p-id="1764"></path><path d="M723.2324 757.334591c-17.181311 0-31.17707 13.537318-31.17707 30.173207l0 51.798736c0 16.634866 13.995759 30.200836 31.17707 30.200836 17.151635 0 31.176047-13.56597 31.176047-30.200836L754.408447 787.508821C754.408447 770.872932 740.383012 757.334591 723.2324 757.334591" fill="#fff" p-id="1765"></path><path d="M607.272365 576.038502c-17.152658 0-31.147394 13.566994-31.147394 30.229488l0 25.900903c0 16.635889 13.995759 30.201859 31.147394 30.201859 17.206894 0 31.233352-13.56597 31.233352-30.201859l0-25.900903C638.50674 589.605495 624.480282 576.038502 607.272365 576.038502" fill="#fff" p-id="1766"></path></svg>`;
        triggerEl.title = '点击捕获详情并生成二维码';
        triggerEl.addEventListener('click', () => {
            const found = scanOnce();
            if (found && currentId) createPanel(); else showToast('未找到任何详情条目');
        });
        document.body.appendChild(triggerEl);
        return triggerEl;
    }

    function setCurrent(idx) {
        if (idx < 0 || idx >= matches.length) return;
        const m = matches[idx];
        currentId = m.id;
        currentTitle = m.title || '';
        currentNode = m.node || null;
        currentIsSignup = !!m.isSignup;
        const el = createPanel().querySelector('#ccc-id');
        const status = panelEl.querySelector('#ccc-status');
        if (el) el.textContent = `已捕获: ${currentTitle} | ${currentId}`;
        if (status) status.textContent = '已捕获';
        updateListActive(idx);
        updateModeForSignup();
    }

    function updateModeForSignup() {
        if (!panelEl) return;
        const signupCard = panelEl.querySelector('#ccc-signup-card');
        const regularCards = panelEl.querySelectorAll('.ccc-helper-card[data-kind="cn"], .ccc-helper-card[data-kind="in"], .ccc-helper-card[data-kind="out"]');
        if (currentIsSignup) {
            regularCards.forEach(card => card.style.display = 'none');
            if (signupCard) signupCard.style.display = 'block';
        } else {
            regularCards.forEach(card => card.style.display = '');
            if (signupCard) signupCard.style.display = 'none';
        }
    }

    function updateListActive(idx) {
        const listEl = panelEl && panelEl.querySelector('#ccc-list');
        if (!listEl) return;
        [...listEl.querySelectorAll('.ccc-match-item')].forEach((item, i) => {
            if (i === idx) item.classList.add('active'); else item.classList.remove('active');
        });
    }

    function renderMatchList() {
        if (!panelEl) return;
        const listEl = panelEl.querySelector('#ccc-list');
        if (!listEl) return;
        listEl.innerHTML = '';
        matches.forEach((m, i) => {
            const item = document.createElement('div');
            item.className = 'ccc-match-item';
            item.innerHTML = `<div class="ccc-match-title">${m.title || '未命名'}</div><div class="ccc-match-sub">${m.id}</div>`;
            item.addEventListener('click', () => setCurrent(i));
            listEl.appendChild(item);
        });
        let indicator = listEl.querySelector('.ccc-scroll-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'ccc-scroll-indicator';
            indicator.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>';
            listEl.appendChild(indicator);
        }
        const onScroll = () => updateScrollHints(listEl, indicator);
        listEl.removeEventListener('scroll', listEl._ccc_scroll_handler || (() => { }));
        listEl.addEventListener('scroll', onScroll);
        listEl._ccc_scroll_handler = onScroll;
        updateScrollHints(listEl, indicator);
    }

    function updateScrollHints(listEl, indicator) {
        if (!listEl) return;
        const scrollTop = listEl.scrollTop;
        const maxScroll = listEl.scrollHeight - listEl.clientHeight;
        if (scrollTop > 2) listEl.classList.add('has-top'); else listEl.classList.remove('has-top');
        if (scrollTop < maxScroll - 2) {
            listEl.classList.add('has-bottom');
            if (indicator) indicator.classList.add('show');
            const hint = panelEl && panelEl.querySelector('#ccc-list-hint');
            if (hint) hint.style.display = 'block';
        } else {
            listEl.classList.remove('has-bottom');
            if (indicator) indicator.classList.remove('show');
            const hint = panelEl && panelEl.querySelector('#ccc-list-hint');
            if (hint) hint.style.display = 'none';
        }
    }

    function setMatches(list) {
        matches = list || [];
        if (!matches.length) {
            currentId = null; currentTitle = ''; currentIsSignup = false;
            if (panelEl) {
                const el = panelEl.querySelector('#ccc-id');
                const status = panelEl.querySelector('#ccc-status');
                if (el) el.textContent = '未捕获';
                if (status) status.textContent = '待捕获';
                renderMatchList();
            }
            return;
        }
        if (!panelEl) createPanel();
        renderMatchList();
        setCurrent(0);
    }

    function extractIdFromHref(href) {
        if (!href) return null;
        let m = href.match(/details\?id=([0-9a-fA-F-]{8,})/i);
        if (m) return m[1];
        m = href.match(/details\/([0-9a-fA-F-]{8,})/i);
        if (m) return m[1];
        m = href.match(/activitydetail\/([0-9a-fA-F-]{8,})/i);
        if (m) return m[1];
        return null;
    }

    function findTitle(el) {
        const titleEl = el.closest('.divDataList')?.querySelector('.dviTitleCont');
        if (titleEl && titleEl.textContent) return titleEl.textContent.trim();
        const txt = (el.textContent || '').trim();
        if (txt) return txt;
        return '';
    }

    function scanLinks(container) {
        const out = [];
        const candidates = Array.from(container.querySelectorAll('a,button,div,span'));
        for (const el of candidates) {
            const text = (el.textContent || '').trim();
            let matchedText = text.includes('查看详情') || text.includes('开始报名') || text.includes('活动详情');
            const isSignup = text.includes('开始报名');
            let href = '';
            if (el.tagName.toLowerCase() === 'a' && el.href) href = el.href;
            if (!href && el.getAttribute('data-href')) href = el.getAttribute('data-href');
            if (!href && el.getAttribute('href')) href = el.getAttribute('href');
            if (!href && el.getAttribute('data-url')) href = el.getAttribute('data-url');
            if (!href && el.onclick) {
                const s = el.onclick.toString();
                const m = s.match(/details\?id=([0-9a-fA-F-]{8,})/i);
                if (m) href = 'details?id=' + m[1];
            }
            if (!href) {
                const dataId = el.getAttribute('data-id');
                if (dataId && dataId.length >= 8) href = 'details?id=' + dataId;
            }
            const id = extractIdFromHref(href);
            if (id && (matchedText || href.toLowerCase().includes('details?id=') || href.toLowerCase().includes('activitydetail'))) {
                const containerNode = el.closest('.divDataList') || el;
                out.push({ id, title: findTitle(el) || text || id, node: containerNode, isSignup });
            }
        }
        return out;
    }

    function scanIframes() {
        const out = [];
        const frames = Array.from(document.querySelectorAll('iframe'));
        for (const f of frames) {
            const src = f.getAttribute('src') || '';
            const id = extractIdFromHref(src);
            if (id) {
                out.push({ id, title: src, node: null });
            }
            try {
                const doc = f.contentDocument;
                if (doc) out.push(...scanLinks(doc));
            } catch (e) {
                // cross-origin ignore
            }
        }
        return out;
    }

    function scanOnce() {
        const list = dedupeMatches([...scanLinks(document), ...scanIframes()]);
        setMatches(list);
        return list.length > 0;
    }

    function attachClickCapture() {
        document.addEventListener('click', (e) => {
            const el = e.target.closest('a,button');
            if (!el) return;
            const text = (el.textContent || '').trim();
            let href = '';
            if (el.tagName.toLowerCase() === 'a' && el.href) href = el.href;
            if (!href && el.getAttribute('data-href')) href = el.getAttribute('data-href');
            if (!href && el.getAttribute('href')) href = el.getAttribute('href');
            if (!href && el.getAttribute('data-url')) href = el.getAttribute('data-url');
            if (!href && el.onclick) {
                const s = el.onclick.toString();
                const m = s.match(/details\?id=([0-9a-fA-F-]{8,})/i);
                if (m) href = 'details?id=' + m[1];
            }
            if (!href) {
                const dataId = el.getAttribute('data-id');
                if (dataId && dataId.length >= 8) href = 'details?id=' + dataId;
            }
            const id = extractIdFromHref(href);
            if (id && (text.includes('查看详情') || text.includes('开始报名') || href.includes('details?id='))) {
                const title = findTitle(el) || text || id;
                const isSignup = text.includes('开始报名');
                setMatches([{ id, title, isSignup, node: el.closest('.divDataList') || el }]);
                createPanel();
            }
        }, true);
    }

    function attachOutsideCloser() {
        document.addEventListener('click', (e) => {
            if (!panelEl) return;
            const target = e.target;
            if (panelEl.contains(target)) return;
            if (triggerEl && triggerEl.contains(target)) return;
            hidePanel();
        }, true);
    }

    function dedupeMatches(arr) {
        const seen = new Set();
        const result = [];
        for (const item of arr) {
            if (!item || !item.id) continue;
            if (seen.has(item.id)) continue;
            seen.add(item.id);
            result.push(item);
        }
        return result;
    }

    async function sendSelection(id) {
        if (!id) throw new Error('no id');
        const url = `https://${host}/study/Selection/StudentSelection`;
        const ref = `https://${host}/study/selection/activitydetail/${id}`;
        const body = `ScheduleId=${encodeURIComponent(id)}`;
        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'DNT': '1',
            'Referer': ref
        };
        const resp = await fetch(url, {
            method: 'POST',
            headers,
            body,
            credentials: 'include'
        });
        return resp.ok;
    }

    function parseWhen(input, fallback) {
        if (!input) return null;
        const trimmed = input.trim();
        if (/^\d+$/.test(trimmed)) {
            const secs = parseInt(trimmed, 10);
            return Date.now() + secs * 1000;
        }
        const normalized = trimmed.replace(/-/g, '/');
        const d = new Date(normalized);
        if (!isNaN(d.getTime())) return d.getTime();
        if (fallback) return parseWhen(fallback, null);
        return null;
    }

    function extractStartTimeFromNode(node) {
        if (!node) return null;
        try {
            const container = node.closest ? node.closest('.divDataList') : null;
            const searchRoot = container || node;
            const infoEls = Array.from(searchRoot.querySelectorAll('.divInfoCont'));
            for (const el of infoEls) {
                const txt = (el.textContent || '').trim();
                const m = txt.match(/报名开始时间[:：]?\s*([0-9]{4}-[0-9]{2}-[0-9]{2}\s+[0-9]{2}:[0-9]{2}(:[0-9]{2})?)/);
                if (m) {
                    let t = m[1];
                    if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}\s+[0-9]{2}:[0-9]{2}$/.test(t)) t += ':00';
                    return t;
                }
            }
            const allText = (searchRoot.textContent || '');
            const m2 = allText.match(/报名开始时间[:：]?\s*([0-9]{4}-[0-9]{2}-[0-9]{2}\s+[0-9]{2}:[0-9]{2}(:[0-9]{2})?)/);
            if (m2) {
                let t = m2[1];
                if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}\s+[0-9]{2}:[0-9]{2}$/.test(t)) t += ':00';
                return t;
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    function extractStartEndFromNode(node) {
        if (!node) return null;
        try {
            const container = node.closest ? node.closest('.divDataList') : null;
            const searchRoot = container || node;
            const infoEls = Array.from(searchRoot.querySelectorAll('.divInfoCont'));
            for (const el of infoEls) {
                const txt = (el.textContent || '').trim();
                let m = txt.match(/([0-9]{4}-[0-9]{2}-[0-9]{2})\s*([0-9]{2}:[0-9]{2})(?:[:0-9]*)?\s*-\s*([0-9]{2}:[0-9]{2})(?::[0-9]{2})?/);
                if (m) {
                    const date = m[1];
                    const start = `${date} ${m[2]}:00`;
                    const end = `${date} ${m[3]}:00`;
                    return { start, end };
                }
                m = txt.match(/([0-9]{4}-[0-9]{2}-[0-9]{2}\s+[0-9]{2}:[0-9]{2}(?::[0-9]{2})?)\s*-\s*([0-9]{4}-[0-9]{2}-[0-9]{2}\s+[0-9]{2}:[0-9]{2}(?::[0-9]{2})?)/);
                if (m) {
                    const fmt = (str) => (/^[0-9]{4}-[0-9]{2}-[0-9]{2}\s+[0-9]{2}:[0-9]{2}$/.test(str) ? str + ':00' : str);
                    return { start: fmt(m[1]), end: fmt(m[2]) };
                }
            }
            const allText = (searchRoot.textContent || '');
            let m2 = allText.match(/([0-9]{4}-[0-9]{2}-[0-9]{2})\s*([0-9]{2}:[0-9]{2})\s*-\s*([0-9]{2}:[0-9]{2})/);
            if (m2) {
                const date = m2[1];
                return { start: `${date} ${m2[2]}:00`, end: `${date} ${m2[3]}:00` };
            }
            m2 = allText.match(/([0-9]{4}-[0-9]{2}-[0-9]{2}\s+[0-9]{2}:[0-9]{2}(?::[0-9]{2})?)\s*-\s*([0-9]{4}-[0-9]{2}-[0-9]{2}\s+[0-9]{2}:[0-9]{2}(?::[0-9]{2})?)/);
            if (m2) {
                const fmt = (str) => (/^[0-9]{4}-[0-9]{2}-[0-9]{2}\s+[0-9]{2}:[0-9]{2}$/.test(str) ? str + ':00' : str);
                return { start: fmt(m2[1]), end: fmt(m2[2]) };
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    function toastAndNotify(msg) {
        showToast(msg);
        if (typeof GM_notification === 'function') {
            GM_notification({ text: msg, title: 'SPDPO-CCC-Helper', timeout: 3000 });
        }
    }

    async function scheduleSelection(kind) {
        if (!isSPDPO) {
            showToast('仅在 spdpo.nottingham.edu.cn 可用');
            return;
        }
        if (!currentId) {
            showToast('请先捕获一个 scheduleId');
            return;
        }
        if (typeof GM_setValue !== 'function' || typeof GM_getValue !== 'function') {
            showToast('当前环境无法持久化任务，已取消');
            return;
        }
        const times = extractStartEndFromNode(currentNode) || {};
        let defaultTime = '0';
        if (kind === 'out') defaultTime = times.end || times.start || '0'; else defaultTime = times.start || '0';
        if (!defaultTime && currentIsSignup) defaultTime = extractStartTimeFromNode(currentNode) || '';
        const input = prompt('请输入定时发送时间，格式 YYYY-MM-DD HH:MM:SS（本地时间），或输入秒数延迟：', defaultTime);
        if (!input) return;
        const when = parseWhen(input, defaultTime);
        if (!when) {
            showToast('无法解析时间');
            return;
        }
        const job = { id: currentId, when, kind, createdAt: Date.now(), status: 'pending', key: `${currentId}-${when}-${kind}` };
        await addJob(job);
        toastAndNotify(`已安排 ${new Date(when).toLocaleString()}`);
        ensureScheduler();
    }

    async function loadJobs() {
        try {
            const val = await GM_getValue(STORAGE_KEY, []);
            if (Array.isArray(val)) return val;
            return [];
        } catch (e) {
            console.error('loadJobs error', e);
            return [];
        }
    }

    async function saveJobs(list) {
        jobs = list;
        try {
            await GM_setValue(STORAGE_KEY, jobs);
        } catch (e) {
            console.error('saveJobs error', e);
        }
    }

    async function addJob(job) {
        jobs = await loadJobs();
        const exists = jobs.some(j => j.key === job.key);
        if (!exists) jobs.push(job);
        jobs = pruneJobs(jobs);
        await saveJobs(jobs);
    }

    function pruneJobs(list) {
        const now = Date.now();
        return (list || []).filter(j => !j.doneAt || (now - j.doneAt) < JOB_EXPIRE_MS);
    }

    function ensureScheduler() {
        if (schedulerTimer) return;
        schedulerTimer = setInterval(runSchedulerTick, 1500);
        runSchedulerTick();
    }

    async function runSchedulerTick() {
        const now = Date.now();
        jobs = await loadJobs();
        let changed = false;
        for (const job of jobs) {
            if (!job || job.status === 'done' || job.status === 'failed') continue;
            if (job.status === 'running' && now - (job.runningAt || 0) < 60000) continue;
            if (now >= job.when) {
                job.status = 'running';
                job.runningAt = now;
                changed = true;
                await saveJobs(jobs);
                try {
                    const ok = await sendSelection(job.id);
                    job.status = ok ? 'done' : 'failed';
                    job.doneAt = Date.now();
                    toastAndNotify(ok ? `定时提交成功: ${job.id}` : `定时提交失败: ${job.id}`);
                } catch (e) {
                    job.status = 'failed';
                    job.doneAt = Date.now();
                    toastAndNotify(`请求出错: ${job.id}`);
                }
            }
        }
        if (changed) {
            jobs = pruneJobs(jobs);
            await saveJobs(jobs);
        }
    }

    function listJobsMenu() {
        if (typeof GM_registerMenuCommand !== 'function') return;
        GM_registerMenuCommand('查看定时任务', async () => {
            const arr = await loadJobs();
            if (!arr.length) {
                alert('暂无定时任务');
                return;
            }
            const lines = arr.map(j => `${j.status || 'pending'} | ${j.id} | ${new Date(j.when).toLocaleString()} (${j.kind || ''})`);
            alert(lines.join('\n'));
        });
        GM_registerMenuCommand('清空已完成任务', async () => {
            const arr = await loadJobs();
            const pending = arr.filter(j => j.status !== 'done' && j.status !== 'failed');
            await saveJobs(pending);
            alert('已清理');
        });
    }

    function showToast(msg) {
        if (toastEl) toastEl.remove();
        toastEl = document.createElement('div');
        toastEl.className = 'ccc-toast';
        toastEl.textContent = msg;
        document.body.appendChild(toastEl);
        setTimeout(() => { if (toastEl) { toastEl.remove(); toastEl = null; } }, 2200);
    }

    function initValueListener() {
        if (typeof GM_addValueChangeListener === 'function') {
            GM_addValueChangeListener(STORAGE_KEY, (_name, _old, newVal) => {
                if (Array.isArray(newVal)) jobs = newVal;
            });
        }
    }

    injectStyle();
    createTrigger();
    attachClickCapture();
    attachOutsideCloser();
    initValueListener();
    listJobsMenu();
    ensureScheduler();
})();
