// ==UserScript==
// @name         WIRED Core Library
// @version      1.0
// @description  Harita ve WebSocket motoru.
// @author       WIRED
// @license      MIT
// ==/UserScript==

class WiredPalette {
    static STATIC_COLORS = [16777215, 12895428, 8947848, 5592405, 2236962, 0, 13880, 26112, 1799168, 4681808, 2273612, 179713, 5366041, 9756740, 10025880, 16514907, 15063296, 15121932, 15045888, 16740352, 16726276, 15007744, 13510969, 16728426, 10420224, 7012352, 16741727, 10512962, 6503455, 10048269, 12275456, 16762015, 16768972, 16754641, 13594340, 8201933, 15468780, 8519808, 3342455, 132963, 5308671, 234, 281599, 23457, 6652879, 3586815, 33735, 54237, 4587464, 11921646, 10921638, 7303023, 3815994, 3470187, 7722665, 13315248, 16763904, 12690658, 5048364, 4457492, 16744507, 12262892, 5840017];
    static STATIC_INDEX = [0, 1, 2, 3, 4, 5, 39, 6, 49, 40, 7, 8, 9, 10, 41, 11, 12, 13, 14, 42, 21, 20, 43, 44, 19, 18, 23, 15, 17, 16, 22, 24, 25, 26, 27, 45, 28, 29, 46, 31, 30, 32, 33, 47, 34, 35, 36, 37, 38, 48, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62];
    
    constructor() {
        this.colors = WiredPalette.STATIC_COLORS;
        this.indexes = WiredPalette.STATIC_INDEX;
    }

    getIndex(rgb) {
        const [r, g, b] = rgb;
        const hex = (r << 16) | (g << 8) | b;
        const idx = this.colors.indexOf(hex);
        return idx !== -1 ? this.indexes[idx] : -1;
    }
}

class WiredWS {
    constructor() {
        this.ws = null;
        const self = this;
        const OriginalWS = window.WebSocket;
        window.WebSocket = function(a, b) {
            const socket = new OriginalWS(a, b);
            self.ws = socket;
            return socket;
        };
    }
}

class WiredMap {
    constructor(palette) {
        this.palette = palette;
        this.cache = null;
        this.width = 0;
        this.height = 0;
    }
    async load() {
        const id = parseInt(location.pathname.replace("/", ""));
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = `https://pixelplace.io/canvas/${id}.png?v=${Date.now()}`;
        await new Promise(r => img.onload = r);
        this.width = img.width;
        this.height = img.height;
        const canvas = document.createElement("canvas");
        canvas.width = this.width; canvas.height = this.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, this.width, this.height).data;
        this.cache = new Int8Array(this.width * this.height);
        for(let i=0; i<data.length; i+=4) {
            this.cache[i>>2] = this.palette.getIndex([data[i], data[i+1], data[i+2]]);
        }
    }
    getPixel(x, y) { return this.cache[y * this.width + x]; }
}