// ==UserScript==
// @name                WME Graticule
// @author		davielde
// @description         Adds OpenLayers Graticule Control to WME
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             0.6
// @grant               none
// @namespace           https://greasyfork.org/users/5252
// @downloadURL https://update.greasyfork.org/scripts/8244/WME%20Graticule.user.js
// @updateURL https://update.greasyfork.org/scripts/8244/WME%20Graticule.meta.js
// ==/UserScript==


function bootstrapGraticule(){
    var bGreasemonkeyServiceDefined = false;
    
    try {
        bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
    }
    catch (err) { /* Ignore */ }
    
    if (typeof unsafeWindow === "undefined" || ! bGreasemonkeyServiceDefined) {
        unsafeWindow    = ( function () {
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window;');
            return dummyElem.onclick();
        }) ();
    }
    
    setTimeout(initializeGraticule, 999);
}

function initializeGraticule(){  
    AddGraticuleOLControl();
    var graticule = new OpenLayers.Control.Graticule({
        labelled: true,
        labelFormat: 'dm',
        lineSymbolizer:{strokeColor: "#ffffff", strokeWidth: 1, strokeOpacity: 0.5},
        labelSymbolizer:{fontColor: "#ffffff", fontOpacity: 0.8},
        intervals: [((45/60), (30/60), (20/60), (10/60), (5/60), (2/60), (1/60))]
    });
    Waze.map.addControl(graticule);
}

function AddGraticuleOLControl(){
    OpenLayers.Control.Graticule = OpenLayers.Class(OpenLayers.Control, {
    autoActivate: !0,
    intervals: [45, 30, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.01, 0.005, 0.002, 0.001],
    displayInLayerSwitcher: !0,
    visible: !0,
    numPoints: 50,
    targetSize: 200,
    layerName: null,
    labelled: !0,
    labelFormat: "dm",
    lineSymbolizer: {
        strokeColor: "#333",
        strokeWidth: 1,
        strokeOpacity: 0.5
    },
    labelSymbolizer: {},
    gratLayer: null,
    initialize: function(a) {
        a = a || {};
        a.layerName = a.layerName || OpenLayers.i18n("Graticule");
        OpenLayers.Control.prototype.initialize.apply(this, [a]);
        this.labelSymbolizer.stroke = !1;
        this.labelSymbolizer.fill = !1;
        this.labelSymbolizer.label = "${label}";
        this.labelSymbolizer.labelAlign = "${labelAlign}";
        this.labelSymbolizer.labelXOffset = "${xOffset}";
        this.labelSymbolizer.labelYOffset = "${yOffset}"
    },
    destroy: function() {
        this.deactivate();
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
        this.gratLayer && (this.gratLayer.destroy(), this.gratLayer = null)
    },
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        if (!this.gratLayer) {
            var a = new OpenLayers.Style({}, {
                rules: [new OpenLayers.Rule({
                    symbolizer: {
                        Point: this.labelSymbolizer,
                        Line: this.lineSymbolizer
                    }
                })]
            });
            this.gratLayer = new OpenLayers.Layer.Vector(this.layerName, {
                styleMap: new OpenLayers.StyleMap({
                    "default": a
                }),
                visibility: this.visible,
                displayInLayerSwitcher: this.displayInLayerSwitcher
            })
        }
        return this.div
    },
    activate: function() {
        return OpenLayers.Control.prototype.activate.apply(this, arguments) ? (this.map.addLayer(this.gratLayer), this.map.events.register("moveend", this, this.update), this.update(), !0) : !1
    },
    deactivate: function() {
        return OpenLayers.Control.prototype.deactivate.apply(this,
            arguments) ? (this.map.events.unregister("moveend", this, this.update), this.map.removeLayer(this.gratLayer), !0) : !1
    },
    update: function() {
        var a = this.map.getExtent();
        if (a) {
            this.gratLayer.destroyFeatures();
            var b = new OpenLayers.Projection("EPSG:4326"),
                c = this.map.getProjectionObject(),
                d = this.map.getResolution();
            c.proj && "longlat" == c.proj.projName && (this.numPoints = 1);
            var e = this.map.getCenter(),
                f = new OpenLayers.Pixel(e.lon, e.lat);
            OpenLayers.Projection.transform(f, c, b);
            for (var e = this.targetSize * d, e = e * e, g, d = 0; d < this.intervals.length; ++d) {
                g =
                    this.intervals[d];
                var h = g / 2,
                    k = f.offset({
                        x: -h,
                        y: -h
                    }),
                    h = f.offset({
                        x: h,
                        y: h
                    });
                OpenLayers.Projection.transform(k, b, c);
                OpenLayers.Projection.transform(h, b, c);
                if ((k.x - h.x) * (k.x - h.x) + (k.y - h.y) * (k.y - h.y) <= e) break
            }
            f.x = Math.floor(f.x / g) * g;
            f.y = Math.floor(f.y / g) * g;
            var d = 0,
                e = [f.clone()],
                h = f.clone(),
                l;
            do h = h.offset({
                x: 0,
                y: g
            }), l = OpenLayers.Projection.transform(h.clone(), b, c), e.unshift(h); while (a.containsPixel(l) && 1E3 > ++d);
            h = f.clone();
            do h = h.offset({
                x: 0,
                y: -g
            }), l = OpenLayers.Projection.transform(h.clone(), b, c), e.push(h);
            while (a.containsPixel(l) && 1E3 > ++d);
            d = 0;
            k = [f.clone()];
            h = f.clone();
            do h = h.offset({
                x: -g,
                y: 0
            }), l = OpenLayers.Projection.transform(h.clone(), b, c), k.unshift(h); while (a.containsPixel(l) && 1E3 > ++d);
            h = f.clone();
            do h = h.offset({
                x: g,
                y: 0
            }), l = OpenLayers.Projection.transform(h.clone(), b, c), k.push(h); while (a.containsPixel(l) && 1E3 > ++d);
            g = [];
            for (d = 0; d < k.length; ++d) {
                l = k[d].x;
                for (var f = [], m = null, n = Math.min(e[0].y, 90), h = Math.max(e[e.length - 1].y, -90), p = (n - h) / this.numPoints, n = h, h = 0; h <= this.numPoints; ++h) {
                    var q = new OpenLayers.Geometry.Point(l,
                        n);
                    q.transform(b, c);
                    f.push(q);
                    n += p;
                    q.y >= a.bottom && !m && (m = q)
                }
                this.labelled && (m = new OpenLayers.Geometry.Point(m.x, a.bottom), l = {
                    value: l,
                    label: this.labelled ? OpenLayers.Util.getFormattedLonLat(l, "lon", this.labelFormat) : "",
                    labelAlign: "cb",
                    xOffset: 0,
                    yOffset: 2
                }, this.gratLayer.addFeatures(new OpenLayers.Feature.Vector(m, l)));
                f = new OpenLayers.Geometry.LineString(f);
                g.push(new OpenLayers.Feature.Vector(f))
            }
            for (h = 0; h < e.length; ++h)
                if (n = e[h].y, !(-90 > n || 90 < n)) {
                    f = [];
                    d = k[0].x;
                    p = (k[k.length - 1].x - d) / this.numPoints;
                    l = d;
                    m = null;
                    for (d = 0; d <= this.numPoints; ++d) q = new OpenLayers.Geometry.Point(l, n), q.transform(b, c), f.push(q), l += p, q.x < a.right && (m = q);
                    this.labelled && (m = new OpenLayers.Geometry.Point(a.right, m.y), l = {
                        value: n,
                        label: this.labelled ? OpenLayers.Util.getFormattedLonLat(n, "lat", this.labelFormat) : "",
                        labelAlign: "rb",
                        xOffset: -2,
                        yOffset: 2
                    }, this.gratLayer.addFeatures(new OpenLayers.Feature.Vector(m, l)));
                    f = new OpenLayers.Geometry.LineString(f);
                    g.push(new OpenLayers.Feature.Vector(f))
                }
            this.gratLayer.addFeatures(g)
        }
    },
    CLASS_NAME: "OpenLayers.Control.Graticule"
});
}

bootstrapGraticule();