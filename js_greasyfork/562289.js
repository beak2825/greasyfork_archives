// ==UserScript==
// @name        Google AI Studio File Upload Bypass
// @namespace   http://tampermonkey.net/
// @version     4.1
// @description Removes arbitrary restriction on file type & size on Google AI studio.
// @author      Jeffrey Epstein
// @match       https://aistudio.google.com/*
// @run-at      document-start
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/562289/Google%20AI%20Studio%20File%20Upload%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/562289/Google%20AI%20Studio%20File%20Upload%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Userscript] AI Studio File Upload Bypass is active");

    // --- CONFIGURATION ---
    const FAKE_TYPE = "text/plain";
    const FAKE_EXT = ".txt";
    const MAX_ALLOWED_SIZE = 1048576; // 1MB in bytes
    // ---------------------

    const originalFilesDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'files');
    const originalAcceptDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'accept');
    const fileCache = new WeakMap();


    // Unlock the 'accept' attribute

    Object.defineProperty(HTMLInputElement.prototype, 'accept', {
        set: function(val) {
            if (val && val.trim() !== "") this.dataset.savedAccept = val;
            return originalAcceptDescriptor.set.call(this, "");
        },
        get: function() {
            return this.dataset.savedAccept || originalAcceptDescriptor.get.call(this);
        },
        configurable: true
    });


    // ====================================================================
    // PART 2: THE EVALUATOR
    // ====================================================================

    function isTypeAllowed(file, acceptString) {
        if (!acceptString || acceptString.trim() === "") return true;
        // Reject empty/unknown types to force spoofing
        if (!file.type || file.type === "") return false;

        const rules = acceptString.split(',').map(s => s.trim().toLowerCase());
        const fileName = file.name.toLowerCase();
        const fileType = file.type.toLowerCase();

        for (let rule of rules) {
            if (rule.startsWith(".")) {
                if (fileName.endsWith(rule)) return true;
            } else if (rule.endsWith("/*")) {
                if (fileType.startsWith(rule.replace("/*", ""))) return true;
            } else {
                if (fileType === rule) return true;
            }
        }
        return false;
    }

    // ====================================================================
    // PART 3: THE SPOOFER
    // ====================================================================

    Object.defineProperty(HTMLInputElement.prototype, 'files', {
        get: function() {
            const realFileList = originalFilesDescriptor.get.call(this);
            if (!realFileList || realFileList.length === 0) return realFileList;
            if (fileCache.has(realFileList)) return fileCache.get(realFileList);

            const strictRules = this.dataset.savedAccept;
            const finalFiles = [];
            let modified = false;

            console.log(`[Check] Input Rules: [${strictRules || 'None'}]`);

            for (let i = 0; i < realFileList.length; i++) {
                const realFile = realFileList[i];
                let needsTypeSpoof = !isTypeAllowed(realFile, strictRules);
                let needsSizeSpoof = realFile.size > MAX_ALLOWED_SIZE;

                if (!needsTypeSpoof && !needsSizeSpoof) {
                    // File is perfect (Right type AND small enough)
                    console.log(`   -> Valid: ${realFile.name}`);
                    finalFiles.push(realFile);
                    continue;
                }

                modified = true;

                // --- CONSTRUCT THE LIE ---

                // 1. Determine Name & Type
                let finalName = realFile.name;
                let finalType = realFile.type;

                if (needsTypeSpoof) {
                    finalName = realFile.name + FAKE_EXT;
                    finalType = FAKE_TYPE;
                    console.log(`   -> Type Bypass: '${realFile.name}' -> '${finalName}'`);
                }

                // 2. Clone the data
                // We pass finalType to slice so the new Blob has the correct MIME
                const blobData = realFile.slice(0, realFile.size, finalType);

                // 3. Create the Impostor
                const impostorFile = new File([blobData], finalName, {
                    type: finalType,
                    lastModified: realFile.lastModified
                });

                // 4. SIZE BYPASS (The Magic)
                if (needsSizeSpoof) {
                    // Generate a fake size between 900KB and 1MB
                    const fakeSize = Math.floor(900000 + Math.random() * 100000);
                    console.log(`   -> Size Bypass: Real ${realFile.size} bytes -> Reporting ${fakeSize} bytes`);

                    // Overwrite the .size property getter
                    Object.defineProperty(impostorFile, 'size', {
                        get: function() { return fakeSize; },
                        configurable: true
                    });
                }

                finalFiles.push(impostorFile);
            }

            if (!modified) {
                fileCache.set(realFileList, realFileList);
                return realFileList;
            }

            finalFiles.item = function(index) { return this[index]; };
            fileCache.set(realFileList, finalFiles);
            return finalFiles;
        },
        configurable: true
    });

})();