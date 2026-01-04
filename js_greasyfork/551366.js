// ==UserScript==

// @name         just a little treat
// @description  just a little treat..
// @namespace    https://twitter.com/cvsilly_?mx=1

// @icon         data:image/octet-stream;base64,UklGRgQDAABXRUJQVlA4TPcCAAAvY8AYEBcw1ZM5ofMfgAe6te2GraWLgCVQ9VCBc761eNEDUI/gHsA2SUn+Mw1E9H8C8L/tLL8arL+Kqegky6sWU2WQrO/y638x59QCkG+4qWikPDFaTCVTwfQfna/O+GpFCz9TTQDeSXy1AHeNcnd5BTCMxsVedaN9HpDNZKSC/ORXTxNwaeRp0lNPkvnVZtI2TKdJCz9zanhd0om2w115kBrTBcM+MT1U+jL9Qbe6wbizOmiClkoyDlwqjUY0K/0VsCPaEnNVXAfQTBZ5Jg/CSRMylWQ6rwP9QwE255M4MCoBjJhTz3Tm1PTwOBAHAPSlPWs7jJhHyzmVZEzPo+Wu/4PU2mLOOTXnVKtM3YzUgkcfpsoSXoFrWdXO/DoBtPDyCwFaqgAjd077hKbvAPS7j9WbbhUgY86pOfVMHakUYFhBe9JS/1IJ4PKCll+NxdnCP3lgU59JOHcjtTQLHVytjFSrS0+tyx9ZSKs91crSYurHwgUAmdpCKQtiKndtkVBiO2IqaQXo6eFyuex6zIPdKjDeYKSihRLXfNNTBaGUdy28YKSTxtC/0DuEV/S7EYr7kQcaY65HeH3Q8wBuNLw8aAsGSSNT5VW/w5NY0BnO1PoEu7Erj67NNZ3pFT8rL3QZ5GmUNwKgk82IPTfDFgAt9U6W/kh2xgKgPXHe1XeyyallKeSG6eWuLiQFAJheNzGnAi00nUtjarkTYCMAwNS6DAsvwKUMJwmQeSzdwitwHTtpd82YClyKEXM6m52hu79UwaXSN6dJqGxOWsHlgsuZTpNhO6HVF/2uhWKY4NKT+VVpdwiVvsGCJ8NK25Axj0fd6q9aHt0EI+ec74YJ+i9CLxc0kgxFf4DQcAF2Mp4MCxdipUn4g27hJwVAo513BWjx1dMIgKlM3VUA8dVmFLQdljgAXN+jpZNMj+l1wU/K5lIAI4/GnHM6GSo3AvQ8cNNDsXMBWh5oXAXXO2yAS+XV7eX/vWE/6y+sPmhWnpVH9Zk8QBw/uzYA
// @icon64       data:image/octet-stream;base64,UklGRugBAABXRUJQVlA4TNsBAAAvP8APEBcw1ZM5ofMfgAdJzrbHbfNx8fMGYobT0At3TQP8CJDrjDpNkorpsCYL8L+maBnoCSL6PwH4L2lu8MN50hwIw4UbSqmqROSVlEfieurlin3O4sepZHhzxWASZNIcsNFlfAg8L3YrF9Zvyb4KotKG90/larIfRKda/3zRlHz2Y53gmZpcmDyfaNES6YJDJZ4lWGyq6oLFh6AmWvbEutL6i2A7FM4GYaiMNIrWZDcLIKoZmkj9Z9tuS6arFtV+7g7wQ9B03y9/i7lJ4FeDbbe2cx6CkBA4tGhqrifBh0N7qVp0iaVZIKzSni8k38N4litnCt9P49kAfqTeLTyHdAIAldUhaLXN7vyQkOXjmM/LEbSEXpgqu5nEgthV9VJmoQCRlT3hFjfzGfAcLDLDTtNwOMTlXXYCoBsAGJPlprIAbZYMAC0G7UQAVAHQVRC/VwF8TwBqdQipFornMMBWE8KPWrjMPria4HzXdLJdgI9zlfCIRqWNFviQ6MIDns71W8IkJP+AJ3PAZ/OAJ1LNDOP0gE31QOcjAlnlSkyPEUC0fRbSYzQAZwt8dk8L4uAwQHgEsm2FdR3FAP4R6DYOVTIB8OXaQrdbgWZB0oR0ZB/KTfkWf8BMkA0AAA==

// @version      v1.0.4
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551366/just%20a%20little%20treat.user.js
// @updateURL https://update.greasyfork.org/scripts/551366/just%20a%20little%20treat.meta.js
// ==/UserScript==

(function() {
    "use strict";

    if (window.top !== window.self) return;

    let style = document.createElement("style");
    style.textContent = `
    .coolfade {
        position: fixed !important;
        left: 50vw !important;
        top: 50vh !important;
        transform: translate(-50%, -35%) !important;
        z-index: 2147483647 !important;
        pointer-events: none !important;
        opacity: 0;
        transition: opacity 0.5s, transform 0.7s;
        will-change: opacity, transform;
    }
    .coolfade.fadein {
        opacity: 1;
        transform: translate(-50%, -50%) !important;
        transition: opacity 0.5s, transform 0.7s;
    }
    .coolfade.fadeout {
        opacity: 0;
        transform: translate(-50%, -35%) !important;
        transition: opacity 0.5s, transform 0.7s;
    }
    `;
    document.head.appendChild(style);

    let buffer = "";
    let animating = false;

    function radiate() {
        if (animating) return;

        animating = true;

        const shouldplay = Math.random() < 0.1;

        const radiation = document.createElement("img");
        radiation.src = "data:image/webp;base64,UklGRkIBAABXRUJQVlA4TDUBAAAvN8ARABcgEEjyB1xnDYFAkj/CsgsEkvwxFn3+A38VyE4kyZKkpL+WlGLv3YQ+92ppmvpaSookoSFxNau6elaDiP5PwO9PvVg+XnGu6Q07V+SlUtzwAdHyLiAzyVmDVrNNuE4nFcelMoR1UnZcQqjoFDnD7JwRQsVGwXHhp2LbI6oPnLLC36sNKsx225k4mJntehsabGYm9jguEtz2U9U4LoJWtgcxaWSBaDl4ZYCqM3CSKMJnjY4vOApRfabCzSoWIFUzhmismGIJcZdDDT/uYnLO2IbLir4BqiGDTgBt0ui4kX0iHFekJpTotLrJwe+akNldd4A7TdJnfAhUbehDsHncNDYLavBhfBIP8iZf0of+wJ/VS/SKXsSKnuSD/qDIFYo2YZJsS85WK5ydJfzB4if9/lQA";
        radiation.className = "coolfade";
        radiation.style.height = `min(50vw, 50vh)`;
        radiation.style.maxHeight = `min(50vw, 50vh)`;
        radiation.style.width = "auto";
        radiation.style.imageRendering = "pixelated";

        document.body.appendChild(radiation);

        void radiation.offsetWidth;
        radiation.classList.add("fadein");

        setTimeout(() => {
            radiation.classList.remove("fadein");
            radiation.classList.add("fadeout");

            setTimeout(() => {
                radiation.remove();
                animating = false;

                if (shouldplay) {
                    setTimeout(() => {
                        try {
                            // craziest compression ever LOL the ogg file weighs 1.87kb
                            const tts = document.createElement("audio");
                            tts.src = "data:audio/ogg;base64,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";
                            // if you were wondering about the voice:
                            // voice provider - microsoft -> english -> david (us english)
                            tts.style.display = "none"; tts.preload = "auto";
                            tts.autoplay = true; console.log("just a little treat");
                            document.body.appendChild(tts);
                            tts.onended = () => tts.remove();
                            setTimeout(() => tts.remove(), 5000);
                        } catch (e) {console.log("no treat");}
                    }, 9000);
                }
            }, 700);
        }, 3000);
    }

    // at random
    setInterval(() => {
        if (Math.random() < 0.1) {
            radiate();
        }
    }, 60000);

    // manual
    window.addEventListener("keydown", function(e) {
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        if (e.key.length === 1) {buffer += e.key}
        else if (e.key === "Backspace") {buffer = buffer.slice(0, -1)}
        else {return}

        if (buffer.length > 32) buffer = buffer.slice(-32);

        if (!animating && buffer.toLowerCase().includes("radiation")) {
            buffer = "";
            radiate();
        }
    }, true);
})();