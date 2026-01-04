// ==UserScript==
// @name         CodeHS Mommy
// @namespace    https://thetridentguy.com
// @version      2025-10-07
// @description  Mommy's here to support you when doing your CodeHS~ ❤️
// @author       TheTridentGuy
// @match        https://codehs.com/*
// @match        https://*.codehs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codehs.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551893/CodeHS%20Mommy.user.js
// @updateURL https://update.greasyfork.org/scripts/551893/CodeHS%20Mommy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const old_send = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
        let framing_prefix_and_data = data.match(/(^\d+)(.*)/m);
        let framing_prefix = framing_prefix_and_data[1];
        let json_data = framing_prefix_and_data[2];
        if(framing_prefix == "42"){
            json_data = JSON.parse(json_data);
            if(json_data[0] == "spawn"){
                json_data[1].args[2] = `set -e\n\nsource "./.pyvenv311/bin/activate"\npip install pythonmommy colorama termcolor > /dev/null 2>&1\nalias python='python -B -m python_mommy'\nif [ -f requirements.txt ]; then\n    echo "Installing Packages..."\n    if pip install -r requirements.txt > /dev/null 2>&1; then\n        echo "Packages Installed!"\n    fi\nfi\n\nif (( DEBUG_MODE )); then\n    python -B -m pdb "$MAIN_FILE"\nelse\n    python -B "$MAIN_FILE"\nfi`;
                json_data[1].options.env.PYTHON_MOMMYS_LITTLE = "boy";
                json_data[1].options.env.PYTHON_MOMMYS_MOODS = "thirsty/yikes";
                data = framing_prefix + JSON.stringify(json_data);
            }
        }
        return old_send.call(this, data);
    };
})();