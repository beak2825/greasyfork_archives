// ==UserScript==
// @name         WIRED Border AI
// @version      1.0
// @description  Yapay zeka destekli alan algılama ve otomatik border çizme modülü.
// @author       WIRED
// @license      MIT
// ==/UserScript==

class WiredBorder {
    static createRect(x, y, w, h) {
        let borderTasks = [];
        // Üst ve Alt kenarlar
        for (let i = x; i <= x + w; i++) {
            borderTasks.push([i, y]);
            borderTasks.push([i, y + h]);
        }
        // Sağ ve Sol kenarlar
        for (let j = y; j <= y + h; j++) {
            borderTasks.push([x, j]);
            borderTasks.push([x + w, j]);
        }
        return borderTasks;
    }

    static createCircle(centerX, centerY, radius) {
        let tasks = [];
        for (let i = 0; i < 360; i++) {
            let angle = i * Math.PI / 180;
            let x = Math.round(centerX + radius * Math.cos(angle));
            let y = Math.round(centerY + radius * Math.sin(angle));
            tasks.push([x, y]);
        }
        return tasks;
    }
}