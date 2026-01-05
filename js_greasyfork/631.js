// ==UserScript==
// @name       Image Viewer
// @namespace  https://gist.github.com/bradenbest/04bd0fc2d57ec650449f
// @version    1.6.1
// @description  inject this script into any page, and right-click on the image you want to view full-size
// @copyright  2014 - 2017, Braden Best
//
// @match *
// @downloadURL https://update.greasyfork.org/scripts/631/Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/631/Image%20Viewer.meta.js
// ==/UserScript==

const firefox = /Firefox/i.test(navigator.userAgent);

function mk_node({
    name = "span",
    props = [],
    styles = [],
    events = [],
    extra = null
} = {}){
    let el = document.createElement(name);

    props.forEach(function([name, value]){
        el[name] = value;
    });

    styles.forEach(function([name, value]){
        el.style[name] = value;
    });

    events.forEach(function([name, callback]){
        el.addEventListener(name, function(ev){
            callback(ev, el);
        });
    });

    if(extra)
        extra(el);

    return el;
}

function mk_img(url){
    return mk_node({
        name: "img",
        props: [
            ["src",        url],
            ["className",  "img_viewer"],
            ["draggable",  "false"],
            ["dragging",   0],
            ["mousepos",   [0,0]],
            ["tabIndex",   0]
        ],
        styles: [
            ["position",  "absolute"],
            ["left",      "0px"],
            ["top",       (80 + document.body.scrollTop) + "px"],
            ["zIndex",    "2147483647"]
        ],
        events: [
            ["mousedown", function(ev, self){
                self.dragging = firefox
                    ? !self.dragging
                    : 1;

                self.mousepos[0] = (ev.clientX || ev.pageX);
                self.mousepos[1] = (ev.clientY || ev.pageY);
            }],
            ["mouseup", function(unused, self){
                if(firefox)
                    return false;

                self.dragging = 0;
            }],
            ["mousemove", function(ev, self){
                let curX = (ev.clientX || ev.pageX);
                let curY = (ev.clientY || ev.pageY);
                let diffX = curX - self.mousepos[0];
                let diffY = curY - self.mousepos[1];

                if(!self.dragging || (!diffX && !diffY))
                    return false;

                self.mousepos = [curX, curY];
                self.style.left = parseInt(self.style.left) + diffX + "px";
                self.style.top  = parseInt(self.style.top)  + diffY + "px";
            }],
            ["keydown", function(ev, self){
                let dispatch = ({
                    "ArrowUp":    ["height", -10],
                    "ArrowDown":  ["height", +10],
                    "ArrowLeft":  ["width",  -10],
                    "ArrowRight": ["width",  +10]
                })[ev.key] || ["width", 0];

                self[dispatch[0]] = +self[dispatch[0]] + dispatch[1];
            }]
        ]
    });
}

function mk_img_helper({img, img_helper_link}){
    let el = mk_node({
        name: "div",
        props: [
            ["innerHTML", "Click here to close image"],
            ["className", "img_viewer"]
        ],
        styles: [
            ["position",     "fixed"],
            ["left",         "0px"],
            ["top",          "0px"],
            ["margin",       "0"],
            ["padding",      "5px 0"],
            ["width",        "100%"],
            ["height",       "50px"],
            ["background",   "#fff"],
            ["borderBottom", "1px solid #ccc"],
            ["color",        "#000"],
            ["fontSize",     "12px"],
            ["textAlign",    "center"],
            ["zIndex",       "2147483647"]
        ],
        events: [
            ["click", function(unused, unused2){
                document.body.removeChild(img);
                document.body.removeChild(el);
                document.body.removeChild(img_helper_link);
            }]
        ]
    });

    return el;
}

function mk_img_helper_link(url){
    return mk_node({
        name: "a",
        props: [
            ["innerHTML", "Direct URL"],
            ["href", url],
            ["target", "_blank"],
            ["className", "img_viewer"]
        ],
        styles: [
            ["margin", "0"],
            ["padding", "0"],
            ["background", "#fff"],
            ["borderBottom", "1px solid #ccc"],
            ["display", "block"],
            ["width", "100%"],
            ["height", "20px"],
            ["position", "fixed"],
            ["left", "0"],
            ["top", "50px"],
            ["fontSize", "12px"],
            ["textAlign", "center"],
            ["zIndex", "2147483647"]
        ]
    });
}

function mk_img_group(url){
    let img = mk_img(url);
    let img_helper_link = mk_img_helper_link(url);
    let img_helper = mk_img_helper({img, img_helper_link});

    [img, img_helper, img_helper_link].forEach(function(node){
        document.body.appendChild(node);
    });

    return { img, img_helper, img_helper_link };
}

function clear(){
    [...document.querySelectorAll(".img_viewer")]
        .forEach(function(viewer){
            document.body.removeChild(viewer);
        });
}

function init(){
    [...document.querySelectorAll("img")].forEach(function(img){
        img.addEventListener("contextmenu", function(ev){
            mk_img_group(img.src);
            ev.preventDefault();
        });
    });

    document.body.addEventListener("mouseup", function(ev){
        if(firefox)
            return false;

        [...document.querySelectorAll(".img_viewer")]
            .forEach(function(viewer){
                viewer.dragging = 0;
            });
    });

    document.body.addEventListener("keydown", function(ev){
        let dispatch = ({
            "Escape":  clear,
            "Control": init
        })[ev.key] || (()=>null);

        dispatch();
    });
}

init();
console.log("Image Viewer started up.");
console.log("Try right-clicking an image");
