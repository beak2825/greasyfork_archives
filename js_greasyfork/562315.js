// ==UserScript==
// @name         WIRED Font Engine
// @version      1.0
// @description  Yazı, Emoji ve Gölge efektleri için piksel matrisi kütüphanesi.
// @author       WIRED
// @license      MIT
// ==/UserScript==

class WiredFont {
    static DATA = {
        'A': [[0,2],[1,1],[1,3],[2,0],[2,4],[3,0],[3,1],[3,2],[3,3],[3,4],[4,0],[4,4]],
        'B': [[0,0],[0,1],[0,2],[0,3],[1,0],[1,4],[2,0],[2,1],[2,2],[2,3],[3,0],[3,4],[4,0],[4,1],[4,2],[4,3]],
        ' ': [], // Boşluk
        '❤': [[0,1],[0,3],[1,0],[1,1],[1,2],[1,3],[1,4],[2,0],[2,1],[2,2],[2,3],[2,4],[3,1],[3,2],[3,3],[4,2]],
        '🔥': [[0,2],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[2,3],[2,4],[3,0],[3,1],[3,2],[3,3],[4,1],[4,2]],
        // Alfabenin tamamı buraya eklenecek...
    };

    static getShadow(pixels) {
        // Her pikselin sağ altına siyah bir gölge pikseli hesaplar
        return pixels.map(([y, x]) => [y + 1, x + 1]);
    }

    static getCharWidth(char) {
        return 6; // Harfler arası standart mesafe
    }
}