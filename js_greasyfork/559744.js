// ==UserScript==
// @name         Snap! anti-crash
// @namespace    http://tampermonkey.net/
// @version      2025-12-21
// @description  prevents a crash and reports the error
// @author       YeesterPlus
// @match        https://snap.berkeley.edu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559744/Snap%21%20anti-crash.user.js
// @updateURL https://update.greasyfork.org/scripts/559744/Snap%21%20anti-crash.meta.js
// ==/UserScript==


Morph.prototype.drawOn = function (ctx, rect) {
    var clipped = rect.intersect(this.bounds),
        pos = this.position(),
        pic, src, w, h, sl, st;

    if (!clipped.extent().gt(ZERO)) {return; }
    ctx.save();
    ctx.globalAlpha = this.alpha;
    if (this.isCachingImage) {
        pic = this.getImage();
        src = clipped.translateBy(pos.neg());
        sl = src.left();
        st = src.top();
        w = Math.min(src.width(), pic.width - sl);
        h = Math.min(src.height(), pic.height - st);
        if (w < 1 || h < 1) {return; }
        ctx.drawImage(
            pic,
            sl,
            st,
            w,
            h,
            clipped.left(),
            clipped.top(),
            w,
            h
        );
    } else { // render directly on target canvas
        ctx.beginPath();
        ctx.rect(clipped.left(), clipped.top(), clipped.width(), clipped.height());
        ctx.clip();
        ctx.translate(pos.x, pos.y);
        try{
            this.render(ctx);
        }catch(error){
            console.error(error);
            ctx.fillStyle='#f00';
            ctx.fillRect(0,0,clipped.width(),clipped.height());
		    ctx.fillStyle='#fff';
		    ctx.strokeStyle='#000';
            ctx.lineWidth=2;
            ctx.font = "14px serif";
            var errorText='RenderError!\n' + error.toString() + '\nplease report the bug';
		    ctx.strokeText(errorText,0,0);
		    ctx.fillText(errorText,0,0);
        }
        if (MorphicPreferences.showHoles) { // debug hole rendering
            ctx.translate(-pos.x, -pos.y);
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = 'white';
            this.holes.forEach(hole => {
                var sect = hole.translateBy(pos).intersect(clipped);
                ctx.fillRect(
                    sect.left(),
                    sect.top(),
                    sect.width(),
                    sect.height()
                );
            });
        }
    }
    ctx.restore();
};