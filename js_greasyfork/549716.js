// ==UserScript==
// @name         js加密算法自动逆向
// @description  拦截加解密框架函数，获取密钥、IV等关键数据
// @author       ejfkdev
// @namespace    @ejfkdev
// @version      1.0
// @license      MIT
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549716/js%E5%8A%A0%E5%AF%86%E7%AE%97%E6%B3%95%E8%87%AA%E5%8A%A8%E9%80%86%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/549716/js%E5%8A%A0%E5%AF%86%E7%AE%97%E6%B3%95%E8%87%AA%E5%8A%A8%E9%80%86%E5%90%91.meta.js
// ==/UserScript==

function arraysEqual(a, b) {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const containsAllUnique = (A, B) =>
  Array.isArray(A) && Array.isArray(B) &&
  [...new Set(B)].every(x => A.includes(x));

function wordArrayToHex(t) {
  const { words, sigBytes } = t;
  const u8 = new Uint8Array(sigBytes);
  for (let n = 0; n < sigBytes; n++) {
    u8[n] = (words[n >>> 2] >>> (24 - (n % 4) * 8)) & 0xff;
  }
  return Array.from(u8, b => b.toString(16).padStart(2, "0")).join("");
}

function wordArrayToBase64(wordArray) {
  const { words, sigBytes } = wordArray;
  const bytes = new Uint8Array(sigBytes);

  for (let i = 0; i < sigBytes; i++) {
    bytes[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }

  // 内置函数 btoa 只能处理字符串，所以要先转成 binary string
  let binary = String.fromCharCode(...bytes);
  return btoa(binary);
}

function utf8Stringify(wordArray) {
  const { words, sigBytes } = wordArray;
  const bytes = new Uint8Array(sigBytes);

  // 提取有效字节
  for (let i = 0; i < sigBytes; i++) {
    bytes[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return ""
  }
}

function detectAlgorithm(algo) {
  if (!algo) return "Unknown";

  // DES/3DES/AES 区分
  if (algo.blockSize === 2 && algo.keySize === 2 && algo.ivSize === 2) return "DES";
  if (algo.blockSize === 2 && algo.keySize === 6 && algo.ivSize === 2) return "TripleDES";
  if (algo.blockSize === 4 && algo.ivSize === 4) return "AES";

  // 可扩展更多算法特征
  return "Unknown";
}

function detectPadding(pad) {
  if (!pad || !pad.pad) return "Unknown";

  const len = pad.pad.length;
  if (len === 2) {
    // Pkcs7 / AnsiX923 / Iso10126 都是 2 参数，进一步根据函数名字或 toString 内容
    const fnStr = pad.pad.toString();
    if (fnStr.includes("Pkcs7")) return "Pkcs7";
    if (fnStr.includes("AnsiX923")) return "AnsiX923";
    if (fnStr.includes("Iso10126")) return "Iso10126";
    return "Pkcs7"; // 默认
  }
  if (len === 1) return "ZeroPadding";
  return "Unknown";
}

function detectMode(mode, algo) {
  if (!mode) return "Unknown";

  const s = mode.$super;
  if (!s) return "Unknown";

  // ECB：没有 ivSize 或 iv = undefined
  if (!algo.ivSize || algo.ivSize === 0) return "ECB";

  // 根据内部方法区分 CBC / CFB / OFB / CTR
  if (s._doCryptBlock && s.createEncryptor && s.createDecryptor) {
    // 进一步区分
    if (s.hasOwnProperty('processBlock')) return "CFB";
    if (s.ivSize && s._doCryptBlock.length === 3) return "CBC";
    return "OFB"; // fallback
  }
  return "Unknown";
}

const getLog = (ctx) => {
  const { rule, self, thisArg, argArray, caller } = ctx;
  rule?.encrypt(ctx)
  let encryptSource;
  try {
    encryptSource = rule?.encryptSource(ctx)
  } catch { }
  return ({ plaintext, cipherText }) => {
    const table = {
      ...(rule.lib !== undefined ? { lib: rule.lib } : {}),
      ...(rule.mode ? { mode: rule.mode(ctx) } : {}),
      ...(rule.padding ? { padding: rule.padding(ctx) } : {}),
      ...(rule.key ? { key: rule.key(ctx) } : {}),
      ...(rule.keyHex ? { keyHex: rule.keyHex(ctx) } : {}),
      ...(rule.keyBase64 ? { keyBase64: rule.keyBase64(ctx) } : {}),
      ...(rule.iv ? { iv: rule.iv(ctx) } : {}),
      ...(rule.ivHex ? { ivHex: rule.ivHex(ctx) } : {}),
      ...(rule.ivBase64 ? { ivBase64: rule.ivBase64(ctx) } : {}),
      ...(rule.algorithm ? { algorithm: rule.algorithm(ctx) } : {}),
      ...(plaintext ? { plaintext: rule?.plaintext({ ...ctx, plaintext }) ?? plaintext } : {}),
      ...(cipherText ? { cipherText: rule?.cipherText?.({ ...ctx, cipherText }) ?? cipherText } : {}),
    };
    console.table(table)
    encryptSource && console.log(encryptSource)
  }
}

const findTargetCaller = (rootCaller, targetSeq) => {
  function tryMatch(node, seqIndex) {
    if (!node) return null;
    if (node.name !== targetSeq[seqIndex]) return null;


    if (seqIndex === targetSeq.length - 1) {
      // 匹配完成，返回最后一个节点的 caller
      return node.caller || null;
    }
    return tryMatch(node.caller, seqIndex + 1);
  }
  function search(node) {
    if (!node) return null;
    const match = tryMatch(node, 0);
    if (match) return match;
    // 从下一个 caller 开始重新尝试
    return search(node.caller);
  }
  return search(rootCaller);
}

const rules = [{
  lib: 'CryptoJS',
  hook: 'apply',
  argsLength: 3,
  funcName: '',
  thisKeys: ['init', '$super', 'cfg', '_xformMode', '_key', '_data', '_nDataBytes', '_mode'],
  argsKeys: [[], ['words', 'sigBytes'], ['init', '$super']],
  chain: ['create', 'createEncryptor', 'encrypt', 'encrypt'],
  key: ({ rule, self, thisArg, argArray }) => argArray[1]?.toString({ stringify: utf8Stringify }),
  keyHex: ({ rule, self, thisArg, argArray }) => argArray[1]?.toString({ stringify: wordArrayToHex }),
  keyBase64: ({ rule, self, thisArg, argArray }) => argArray[1]?.toString({ stringify: wordArrayToBase64 }),
  iv: ({ rule, self, thisArg, argArray }) => argArray[2]?.iv?.toString({ stringify: utf8Stringify }),
  ivHex: ({ rule, self, thisArg, argArray }) => argArray[2]?.iv?.toString({ stringify: wordArrayToHex }),
  ivBase64: ({ rule, self, thisArg, argArray }) => argArray[2]?.iv?.toString({ stringify: wordArrayToBase64 }),
  algorithm: ({ rule, self, thisArg, argArray }) => detectAlgorithm(argArray[2]?.algorithm),
  padding: ({ rule, self, thisArg, argArray }) => detectPadding(argArray[2]?.padding),
  // mode: ({ rule, self, thisArg, argArray }) => argArray[2]?.mode,
  plaintext: ({ rule, self, thisArg, argArray, plaintext }) => plaintext?.toString({ stringify: utf8Stringify }),
  cipherText: ({ rule, self, thisArg, argArray, cipherText }) => cipherText?.toString(),
  encrypt: ({ rule, self, thisArg, argArray, encrypt }) => encrypt && (window.__encrypt__ = (plaintext) => encrypt(plaintext).toString()),
  encryptSource: ({ rule, self, thisArg, argArray, caller }) => findTargetCaller(caller, rule.chain),
  return: ({ returnValue, log, rule, self, thisArg, argArray }) => {
    const finalize_original = thisArg.finalize;
    rule?.encrypt({ returnValue, log, rule, self, thisArg, argArray, encrypt: finalize_original.bind(thisArg) })
    thisArg.finalize = (...args) => {
      const plaintext = args[0];
      const cipherText = finalize_original.apply_original(thisArg, args);
      log({ plaintext, cipherText });
      return cipherText
    }
    return returnValue;
  },
}]

function getCallerDepth(args, depth = 1) {
  try {
    let callee = args?.callee
    while (callee && depth--) {
      callee = callee.caller
    }
    return callee
  } catch {
  }
}

Function.prototype.apply_original = Function.prototype.apply_original ?? Function.prototype.apply;
Function.prototype.call_original = Function.prototype.call_original ?? Function.prototype.call;

// 覆盖 apply
Function.prototype.apply = function (thisArg, argArray) {
  let returnValue = this.apply_original(thisArg, argArray)
  try {
    argArray = argArray ?? []
    const caller = getCallerDepth(arguments, 32)
    if (caller) return returnValue
    const self = this;
    const rule = rules.find(rule =>
      rule.hook === 'apply' &&
      argArray.length === rule.argsLength &&
      this.name === rule.funcName &&
      containsAllUnique(Object.keys(thisArg ?? 0), rule.thisKeys) &&
      Array.from(argArray).every((arg, i) => containsAllUnique(Object.keys(arg), rule.argsKeys[i])));
    if (!rule) return returnValue;
    const log = getLog({ rule, self, thisArg, argArray, caller: arguments?.callee })
    if (rule.return) returnValue = rule.return({ returnValue, log, rule, self, thisArg, argArray });
    else log(returnValue);
  } catch (error) {
    console.error('apply 错误:', error);
  }
  return returnValue;
};

Function.prototype.call = function (thisArg, ...argArray) {
  let returnValue = this.call_original(thisArg, ...argArray)
  try {
    const caller = getCallerDepth(arguments, 32)
    if (caller) return returnValue
    let rule;
    const self = this;
    for (const r of rules) {
      if (argArray.length ===
        r.hook === 'call' &&
        r.argsLength &&
        this.name === r.funcName &&
        containsAllUnique(Object.keys(thisArg ?? 0), r.thisKeys) &&
        Array.from(argArray).every((arg, i) => containsAllUnique(Object.keys(arg), r.argsKeys[i]))) {
        rule = r;
        break;
      }
    }
    if (!rule) return returnValue;
    const log = getLog({ rule, self, thisArg, argArray, caller: arguments?.callee })
    if (rule.return) returnValue = rule.return({ returnValue, log, rule, self, thisArg, argArray });
    else log(returnValue);
  } catch (error) {
    console.error('call 错误:', error);
  }
  return returnValue;
};
