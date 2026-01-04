// ==UserScript==
// @name         Snapchat Turbo ZIP
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Parallel download of all memories into a single ZIP with binary format detection
// @author       You
// @match        file:///*/memories_history.html*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561361/Snapchat%20Turbo%20ZIP.user.js
// @updateURL https://update.greasyfork.org/scripts/561361/Snapchat%20Turbo%20ZIP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONCURRENCY_LIMIT = 15; // Number of simultaneous downloads

    // Create the interface
    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;background:#000;color:#fff;padding:20px;border-radius:8px;font-family:sans-serif;width:280px;border:2px solid #FFFC00;';
    panel.innerHTML = `
        <h3 style="margin:0 0 10px 0;color:#FFFC00;">Snap Turbo V2.2</h3>
        <button id="startTurbo" style="background:#FFFC00;color:black;padding:12px;cursor:pointer;width:100%;border:none;font-weight:bold;border-radius:4px;">GENERATE ZIP</button>
        <div id="progressContainer" style="display:none;margin-top:15px;">
            <div style="width:100%;background:#333;height:8px;border-radius:4px;"><div id="progressBar" style="width:0%;background:#FFFC00;height:100%;"></div></div>
            <p id="statusMsg" style="margin:10px 0 5px 0;font-size:13px;">Binary analysis...</p>
            <p id="statDetails" style="margin:0;font-size:11px;color:#aaa;"></p>
        </div>
    `;
    document.body.appendChild(panel);

    // Detect real file extension using "Magic Bytes" (binary signatures)
    async function getRealExtension(blob) {
        const buffer = await blob.slice(0, 12).arrayBuffer(); // Read first 12 bytes
        const view = new Uint8Array(buffer);
        const header = Array.from(view).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join("");

        // 1. ZIP Detection (Signature: 50 4B 03 04)
        if (header.startsWith("504B0304")) return "zip";

        // 2. Image Detection (JPEG: FF D8 FF, PNG: 89 50 4E 47)
        if (header.startsWith("FFD8FF")) return "jpg";
        if (header.startsWith("89504E47")) return "png";

        // 3. Video Detection (MP4: look for "ftyp" or standard 00 00 00 header)
        if (header.includes("66747970") || header.startsWith("000000")) return "mp4";
        
        // 4. Default fallback
        return "mp4";
    }

    document.getElementById('startTurbo').onclick = async function() {
        const links = Array.from(document.querySelectorAll('a[onclick*="downloadMemories"]'));
        const status = document.getElementById('statusMsg');
        const stats = document.getElementById('statDetails');
        const progressBar = document.getElementById('progressBar');
        
        this.disabled = true;
        this.style.opacity = "0.5";
        document.getElementById('progressContainer').style.display = 'block';

        const zip = new JSZip();
        let completed = 0;
        let errors = 0;

        // Individual file download function
        const downloadFile = async (link, index) => {
            const onclickAttr = link.getAttribute('onclick');
            const match = onclickAttr.match(/downloadMemories\('(.*?)'/);
            if (!match) return;

            const url = match[1].replace(/&amp;/g, '&');
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                
                // DETECT THE REAL FORMAT
                const ext = await getRealExtension(blob);
                zip.file(`snap_${index + 1}.${ext}`, blob);
                completed++;
            } catch (e) {
                console.error("Error on link " + index, e);
                errors++;
            }

            // Update Progress UI
            const percent = Math.round((completed / links.length) * 100);
            progressBar.style.width = percent + "%";
            status.innerText = `Files: ${completed} / ${links.length}`;
            stats.innerText = `ZIP detection: OK | Errors: ${errors}`;
        };

        // Parallel Queue Manager
        const queue = [...links.entries()];
        const workers = Array(CONCURRENCY_LIMIT).fill(0).map(async () => {
            while (queue.length > 0) {
                const item = queue.shift();
                if (item) await downloadFile(item[1], item[0]);
            }
        });

        // Wait for all downloads to finish
        await Promise.all(workers);

        status.innerText = "Finalizing archive... (Please wait)";
        // Using "STORE" (no compression) for maximum speed
        const content = await zip.generateAsync({type:"blob", compression: "STORE"});
        const zipUrl = window.URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = zipUrl;
        a.download = `Snapchat_Backup_${new Date().toLocaleDateString().replace(/\//g, '-')}.zip`;
        a.click();
        
        status.innerText = "DONE! Check your downloads.";
        progressBar.style.background = "#2ecc71";
    };
})();