// ==UserScript==
// @name BigFloat
// @namespace -
// @version 1.0.0
// @description Uses BigInt to make BigFloats
// @author NotYou
// @grant none
// @license MIT
// ==/UserScript==

/*
* @typedef IStringifyOptions
* @property {boolean} [trailingZero=true]
* @property {boolean} [headZero=true]
* @property {number} [precision=3] recommended max value is 15. Higher values may result in incorrect result
* @property {boolean} [fixedPointNotation=false] if value is 12.3, precision is 3, but fixedPointNotation is true, then stringified value will be 12.300
*/

/*
* @typedef IToNumberOptions
* @property {number} [precision=3] recommended max value is 15. Higher values may result in incorrect result
*/

/*
* @typedef {number | `${number}` | BigInt | InstanceType<typeof BigFloat>} AcceptableValue
*/

!function() {
    'use strict';

    /* global BigInt */

    class BigFloat {
        /*
        * @param {AcceptableValue} value
        */
        constructor(value) {
            const valueData = this._handleValue(value)

            if (valueData === null) this._invalidValue(value)
            /*
        	* @type {number}
        	*/
            this._scale = valueData.scale
            /*
        	* @type {number}
        	*/
            this._value = valueData.value
        }

        /*
        * @returns {string | number}
        */
        [Symbol.toPrimitive](hint) {
            if (hint === 'number') {
                return this.toNumber()
            }

            return this.stringify()
        }

        /*
        * @returns {string}
        */
        get [Symbol.toStringTag]() {
            return this.constructor.name
        }

        /*
        * Throws an invalid value error. Stringifies value
        *
        * @param {AcceptableValue} value
        * @returns {never}
        */
        _invalidValue(value) {
            let stringifiedValue = ''

            try {
                if (!Number.isFinite(value) || Number.isNaN(value) || typeof value === 'function') {
                    throw void 0
                }

                stringifiedValue = JSON.stringify(value)
            } catch(_) {
                stringifiedValue = String(value)
            }

            throw new Error(`"${stringifiedValue}" is invalid value and cannot be handled`)
        }

        /**
        * Parses float number
        *
        * @param {number} value (must be float number)
        * @returns { { value: string, scale: number } }
        */
        _parseFloat(value) {
            const parts = String(value).split('.')

            return {
                value: parts[0] + parts[1],
                scale: -parts[1].length
            }
        }

        /**
        * Tries to return value as bigint and, also returns its scale
        *
        * @param {AcceptableValue} value
        * @returns { { value: BigInt, scale: number } | null }
        */
        _handleValue(value) {
            const handleInt = value => {
                return {
                    value: BigInt(value),
                    scale: 0
                }
            }

            const handleFloat = value => {
                const floatData = this._parseFloat(value)

                return {
                    value: BigInt(floatData.value),
                    scale: floatData.scale
                }
            }

            if (typeof value === 'bigint') {
                return {
                    value,
                    scale: 0,
                }
            } else if (typeof value === 'number' && Number.isInteger(value)) { // is integer
                return handleInt(value)
            } else if (typeof value === 'number') { // is float
                return handleFloat(value)
            } else if (typeof value === 'string' && !isNaN(value)) { // is stringified number
                const number = Number(value)

                if (Number.isInteger(number)) {
                    return handleInt(number)
                }

                return handleFloat(number)
            } else if (value instanceof this.constructor) {
                return {
                    value: value.getRawValue(),
                    scale: value.getScale()
                }
            }

            return null
        }

        /*
        * Returns the value of the big float as a raw bigint
        *
        * @returns {bigint}
        */
        getRawValue() {
            return this._value
        }

        /*
        * Returns the scale of the value
        *
        * For example, when: `value = 1234` and `scale = -1``
        * Then result would be equal to 123.4
        *
        * @returns {number}
        */
        getScale() {
            return this._scale
        }

        /*
        * @type {IStringifyOptions}
        */
        _defaultStringifyOptions = {
            trailingZero: true,
            headZero: true,
            precision: 3,
            fixedPointNotation: false
        }

        /*
        * Stringifies big float
        *
        * Note: toString is reserved for Symbol.toStringTag method
        *
        * @param {Optional<IStringifyOptions>} options
        * @returns {string}
        */
        stringify(options = {}) {
            options = Object.assign({}, this._defaultStringifyOptions, options)

            const scale = this.getScale()
            const raw = this.getRawValue().toString()

            if (scale === 0) {
                if (!options.trailingZero) return raw

                const zeros = options.fixedPointNotation
                ? options.precision
                : 1

                return raw + '.' + '0'.repeat(zeros)
            }

            const leftPart = raw.slice(0, scale)
            let rightPart = raw.slice(scale)

            rightPart = rightPart.slice(0, options.precision)

            if (options.fixedPointNotation) {
                rightPart = rightPart.padEnd(options.precision, '0')
            }

            if (leftPart === '' && options.headZero) {
                return '0.' + rightPart
            }

            return leftPart + '.' + rightPart
        }

        /*
        * @type {IToNumberOptions}
        */
        _defaultToNumberOptions = {
            precision: 3
        }

        /*
        * Firstly stringfies the number using stringify (with default params) method, and then converts it to number
        *
        * @param {Optional<IToNumberOptions>} options
        * @returns {number}
        */
        toNumber(options) {
            options = Object.assign({}, this._defaultToNumberOptions, options)

            return Number(this.stringify(options))
        }

        /*
        * @param {AcceptableValue} value Value that will be added or subtracted
        * @param {0 | 1} sign zero for minus, one for plus
        * @returns {this}
        */
        _addOrSubtract(value, sign) {
            const valueData = this._handleValue(value)
            if (valueData === null) this._invalidValue(value)

            let aValue = this._value
            let aScale = this._scale
            let bValue = valueData.value
            let bScale = valueData.scale

            if (aScale !== bScale) {
                const minScale = Math.min(aScale, bScale)

                if (aScale !== minScale) {
                    aValue *= 10n ** BigInt(aScale - minScale)
                }

                if (bScale !== minScale) {
                    bValue *= 10n ** BigInt(bScale - minScale)
                }

                aScale = minScale
            }

            this._value = sign === 1 ? aValue + bValue : aValue - bValue
            this._scale = aScale

            return this
        }

        /*
        * @param {AcceptableValue} value
        * @returns {this}
        */
        add(value) {
            return this._addOrSubtract(value, 1)
        }

        /*
        * @param {AcceptableValue} value
        * @returns {this}
        */
        subtract(value) {
            return this._addOrSubtract(value, -1)
        }

        /*
        * @param {AcceptableValue} value
        * @returns {this}
        */
        multiply(value) {
            const valueData = this._handleValue(value)
            if (valueData === null) this._invalidValue(value)

            this._value *= valueData.value
            this._scale += valueData.scale

            return this
        }

        /*
        * @param {AcceptableValue} value
        * @param {number} precision
        * @returns {this}
        */
        divide(value, precision = 3) {
            const valueData = this._handleValue(value)
            if (valueData === null) this._invalidValue(value)

            if (valueData.value === 0n) {
                throw new Error('Division by zero')
            }

            const factor = 10n ** BigInt(precision)

            this._value = (this._value * factor) / valueData.value

            this._scale = this._scale - valueData.scale - precision

            return this
        }
    }

    window.BigFloat = BigFloat
}();