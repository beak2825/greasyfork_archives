// ==UserScript==
// @name         ShikiTreeLib
// @namespace    https://shikimori.one/
// @version      2.0.0.0.0.0
// @description  Lib для графиков
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// ==/UserScript==

; (function () {
    'use strict';
    /* eslint camelcase:0 */
    class ShikiMath {
        // detecting whether point is above or below a line
        // x,y - point
        // x1,y1 - point 1 of line
        // x2,y2 - point 2 of line
        static is_above(x, y, x1, y1, x2, y2) {
            const dx = x2 - x1;
            const dy = y2 - y1;

            return ((((dy * x) - (dx * y)) + (dx * y1)) - (dy * x1)) <= 0;
        }

        // detecting in which "sector" point x2,y2 is located accordingly to
        // rectangular node with center in x1,y1 and width=rx*2 and height=ry*2
        static sector(x1, y1, x2, y2, rx, ry) {
            // left_bottom to right_top
            const lb_to_rt = this.is_above(x2, y2, x1 - rx, y1 - ry, x1, y1);
            // left_top to right_bottom
            const lt_to_rb = this.is_above(x2, y2, x1 - rx, y1 + ry, x1, y1);

            if (lb_to_rt && lt_to_rb) {
                return 'top';
            } if (!lb_to_rt && lt_to_rb) {
                return 'right';
            } if (!lb_to_rt && !lt_to_rb) {
                return 'bottom';
            }
            return 'left';
        }

        // math for obtaining coords for link between two rectangular nodes
        // with center in xN,yN and width=rxN*2 and height=ryN*2
        static square_cutted_line(x1, y1, x2, y2, rx1, ry1, rx2, ry2) {
            let f_x1;
            let f_x2;
            let f_y1;
            let f_y2;
            const dx = x2 - x1;
            const dy = y2 - y1;

            const y = x => (((dy * x) + (dx * y1)) - (dy * x1)) / dx;
            const x = y => (((dx * y) - (dx * y1)) + (dy * x1)) / dy;

            const target_sector = this.sector(x1, y1, x2, y2, rx1, ry1);

            if (target_sector === 'right') {
                f_x1 = x1 + rx1;
                f_y1 = y(f_x1);

                f_x2 = x2 - rx2;
                f_y2 = y(f_x2);
            } else if (target_sector === 'left') {
                f_x1 = x1 - rx1;
                f_y1 = y(f_x1);

                f_x2 = x2 + rx2;
                f_y2 = y(f_x2);
            }

            if (target_sector === 'top') {
                f_y1 = y1 + ry1;
                f_x1 = x(f_y1);

                f_y2 = y2 - ry2;
                f_x2 = x(f_y2);
            }

            if (target_sector === 'bottom') {
                f_y1 = y1 - ry1;
                f_x1 = x(f_y1);

                f_y2 = y2 + ry2;
                f_x2 = x(f_y2);
            }

            return {
                x1: f_x1,
                y1: f_y1,
                x2: f_x2,
                y2: f_y2,
                sector: target_sector
            };
        }

        // tests for math
        static rspec() {
            // is_above
            this._assert(true, this.is_above(-1, 2, -1, -1, 1, 1));
            this._assert(true, this.is_above(0, 2, -1, -1, 1, 1));
            this._assert(true, this.is_above(0, 0, -1, -1, 1, 1));
            this._assert(true, this.is_above(1, 2, -1, -1, 1, 1));
            this._assert(false, this.is_above(2, 1, -1, -1, 1, 1));
            this._assert(false, this.is_above(-1, -2, -1, -1, 1, 1));

            // sector test
            this._assert('top', this.sector(0, 0, 0, 10, 1, 1));
            this._assert('top', this.sector(0, 0, 10, 10, 1, 1));
            this._assert('right', this.sector(0, 0, 10, 0, 1, 1));
            this._assert('right', this.sector(0, 0, 10, -10, 1, 1));
            this._assert('bottom', this.sector(0, 0, 0, -10, 1, 1));
            this._assert('left', this.sector(0, 0, -10, 0, 1, 1));

            // square_cutted_line
            this._assert(
                { x1: -9, y1: 0, x2: 9, y2: 0, sector: 'right' },
                this.square_cutted_line(-10, 0, 10, 0, 1, 1, 1, 1)
            );
            this._assert(
                { x1: 5, y1: 0, x2: -5, y2: 0, sector: 'left' },
                this.square_cutted_line(10, 0, -10, 0, 5, 1, 5, 1)
            );
            this._assert(
                { x1: 0, y1: 5, x2: 0, y2: -5, sector: 'bottom' },
                this.square_cutted_line(0, 10, 0, -10, 1, 5, 1, 5)
            );
            this._assert(
                { x1: 0, y1: -5, x2: 0, y2: 5, sector: 'top' },
                this.square_cutted_line(0, -10, 0, 10, 1, 5, 1, 5)
            );

            this._assert(
                { x1: 5, y1: 5, x2: -5, y2: -5, sector: 'left' },
                this.square_cutted_line(10, 10, -10, -10, 5, 5, 5, 5)
            );
            this._assert(
                { x1: 0.5, y1: 1, x2: 1.5, y2: 3, sector: 'top' },
                this.square_cutted_line(0, 0, 2, 4, 1, 1, 1, 1)
            );
        }

        static _assert(left, right) {
            if (JSON.stringify(left) !== JSON.stringify(right)) {
                throw `math error: expected ${JSON.stringify(left)}, got ${JSON.stringify(right)}`;
            }
        }
    }

    const START_MARKERS = ['prequel'];
    const END_MARKERS = ['sequel'];
    class FranchiseGraph {
        constructor(data) {
            this._bound_x = this._bound_x.bind(this);
            this._bound_y = this._bound_y.bind(this);
            this._y_by_date = this._y_by_date.bind(this);
            this._node_selected = this._node_selected.bind(this);
            this._tick = this._tick.bind(this);
            this._link_truncated = this._link_truncated.bind(this);
            this._collide = this._collide.bind(this);
            this.image_w = 64;
            this.image_h = 64;

            this.links_data = data.links;
            this.nodes_data = data.nodes.map(node => (
                new FranchiseNode(node, this.image_w, this.image_h, node.id === data.current_id)
            ));

            this._prepare_data();
            this._position_nodes();
            this._prepare_force();
            this._check_non_symmetrical_links();
        }

        _prepare_data() {
            let original_size;
            this.links_data.forEach(link => {
                link.source = this.nodes_data.find(n => n.id === link.source_id);
                link.target = this.nodes_data.find(n => n.id === link.target_id);

                if (!link.source || !link.target) {
                    console.warn(`Link skipped: ${link.source_id} -> ${link.target_id}`);
                }
            });
            this.max_weight = _.max(this.links_data.map(v => v.weight)) * 1.0;
            this.size = (original_size = this.nodes_data.length);
            // console.log "nodes: #{@size}, max_weight: #{@max_weight}"

            // screen sizes
            this.screen_width =
                this.size < 30 ?
                    this._scale(this.size, {
                        from_min: 0,
                        from_max: 30,
                        to_min: 480,
                        to_max: 1300
                    }
                    ) :
                    this._scale(this.size, {
                        from_min: 0,
                        from_max: 100,
                        to_min: 1600,
                        to_max: 2461
                    }
                    );

            this.screen_height = this.screen_width;

            // dates for positioning on Y axis
            const min_date = _.max(this.nodes_data.map(v => v.date));
            const max_date = _.max(this.nodes_data.map(v => v.date));

            // do not use min/max dates if they belong to multiple entries
            if (this.nodes_data.filter(v => v.date === min_date).length === 1) {
                this.min_date = min_date * 1.0;
            }

            if (this.nodes_data.filter(v => v.date === max_date).length === 1) {
                return this.max_date = max_date * 1.0;
            }
        }

        // initial nodes positioning
        _position_nodes() {
            // return unless @min_date && @max_date
            return this.nodes_data.forEach(d => {
                d.y = this._y_by_date(d.date);
                d.x = (this.screen_width / 2.0) - d.rx;

                if (d.date === this.min_date) {
                    d.fixed = true;
                    // move it proportionally to its relations count
                    d.y += this._scale(d.weight, { from_min: 4, from_max: 20, to_min: 0, to_max: 700 });
                }

                if (d.date === this.max_date) {
                    d.fixed = true;
                    d.y -= 20;
                    // move it proportionally to its relations count
                    return d.y -= this._scale(d.weight, { from_min: 4, from_max: 9, to_min: 0, to_max: 150 });
                }
            });
        }

        // configure d3 force object
        _prepare_force() {
            return window.d3_force = (this.d3_force = d3.layout.force()
                .charge(function (d) {
                    if (d.selected) {
                        if (d.weight > 100) {
                            return -9000;
                        } else {
                            return -5000;
                        }
                    } else if (d.weight > 100) {
                        return -7000;
                    } else if (d.weight > 20) {
                        return -4000;
                    } else if (d.weight > 7) {
                        return -3000;
                    } else {
                        return -2000;
                    }
                }).friction(0.9)
                .linkDistance(d => {
                    const max_width =
                        this.max_weight < 3 ?
                            this._scale(this.size, { from_min: 2, from_max: 6, to_min: 100, to_max: 300 }) :
                            this.max_weight > 100 ?
                                this._scale(this.max_weight, { from_min: 30, from_max: 80, to_min: 300, to_max: 1000 }) :
                                this._scale(this.max_weight, { from_min: 30, from_max: 80, to_min: 300, to_max: 1500 });

                    return this._scale(300 * (d.weight / this.max_weight), {
                        from_min: 0,
                        from_max: 300,
                        to_min: 150,
                        to_max: max_width
                    }
                    );
                }).size([this.screen_width, this.screen_height])
                .nodes(this.nodes_data)
                .links(this.links_data));
        }

        _check_non_symmetrical_links() {
            return this.links_data.forEach(entry_1 => {
                const symmetrical_link = this.links_data
                    .find(entry_2 => (entry_2.source_id === entry_1.target_id) && (entry_2.target_id === entry_1.source_id));

                if (!symmetrical_link) {
                    console.warn(`non symmetical link [${entry_1.source_id}, ${entry_1.target_id}]`, entry_1);
                }
            });
        }

        // scale X which expected to be in [from_min..from_max] to new value in [to_min...to_max]
        _scale(x, opt) {
            let percent = (x - opt.from_min) / (opt.from_max - opt.from_min);
            percent = Math.min(1, Math.max(percent, 0));
            return opt.to_min + ((opt.to_max - opt.to_min) * percent);
        }

        // bound X coord to be within screen area
        _bound_x(d, x = d.x) {
            const min = d.rx + 5;
            const max = this.screen_width - d.rx - 5;
            return Math.max(min, Math.min(max, x));
        }

        // bound Y coord to be within screen area
        _bound_y(d, y = d.y) {
            const min = d.ry + 5;
            const max = this.screen_width - d.ry - 5;
            return Math.max(min, Math.min(max, y));
        }

        // determine Y coord by date (oldest to top, newest to bottom)
        _y_by_date(date) {
            return this._scale(date, {
                from_min: this.min_date,
                from_max: this.max_date,
                to_min: this.image_h / 2.0,
                to_max: this.screen_height - (this.image_h / 2.0)
            }
            );
        }

        render_to(target) {
            this._append_svg(target);
            this._append_markers();
            this._append_links();
            this._append_nodes();

            this.d3_force.start().on('tick', this._tick);
            for (let i = 0, end = this.size * this.size, asc = end >= 0; asc ? i <= end : i >= end; asc ? i++ : i--) { this.d3_force.tick(); }
            return this.d3_force.stop();
        }

        // handler for node selection
        _node_selected(d) {
            if (this.selected_node) {
                this.selected_node.deselect(this._bound_x, this._bound_y, this._tick);

                if (this.selected_node === d) {
                    this.selected_node = null;
                    return;
                }
            }

            this.selected_node = d;
            return this.selected_node.select(this._bound_x, this._bound_y, this._tick);
        }

        // svg tag
        _append_svg(target) {
            return this.d3_svg = d3.select(target)
                .append('svg')
                .attr({ width: this.screen_width, height: this.screen_height });
        }

        // lines between nodes
        _append_links() {
            return this.d3_link = this.d3_svg.append('svg:g').selectAll('.link')
                .data(this.links_data)
                .enter().append('svg:path')
                .attr({
                    class(d) { return `${d.source_id}-${d.target_id} link ${d.relation}`; },
                    'marker-start'(d) {
                        if (START_MARKERS.find(v => v === d.relation)) { return `url(#${d.relation})`; }
                    },
                    'marker-end'(d) {
                        if (END_MARKERS.find(v => v === d.relation)) { return `url(#${d.relation})`; }
                    },
                    'marker-mid'(d) { return `url(#${d.relation}_label)`; }
                });
        }

        // nodes (images + borders + year)
        _append_nodes() {
            this.d3_node = this.d3_svg.append('.svg:g').selectAll('.node')
                .data(this.nodes_data)
                .enter().append('svg:g')
                .attr({
                    class: 'node',
                    id(d) { return d.id; }
                }).call(this.d3_force.drag())
                .on('click', d => {
                    if (d3.event != null ? d3.event.defaultPrevented : undefined) { return; }
                    return this._node_selected(d);
                });
            // .call(@d3_force.drag().on('dragstart', -> $(@).children('text').hide()).on('dragend', -> $(@).children('text').show()))
            // .on 'mouseover', (d) ->
            // $(@).children('text').show()
            // .on 'mouseleave', (d) ->
            // $(@).children('text').hide()

            this.d3_node.append('svg:path').attr({ class: 'border_outer', d: '' });
            this.d3_image_container = this.d3_node.append('svg:g').attr({ class: 'image-container' });

            this.d3_image_container.append('svg:image')
                .attr({
                    width(d) { return d.width; },
                    height(d) { return d.height; },
                    'xlink:href'(d) { return d.image_url; }
                });

            this.d3_image_container.append('svg:path')
                .attr({
                    class: 'border_inner',
                    d(d) { return `M 0,0 ${d.width},0 ${d.width},${d.height} 0,${d.height} 0,0`; }
                });

            // year
            this.d3_image_container.append('svg:text')
                .attr({
                    x(d) { return d.yearX(); },
                    y(d) { return d.yearY(); },
                    class: 'year shadow'
                }).text(d => d.year);
            return this.d3_image_container.append('svg:text')
                .attr({
                    x(d) { return d.yearX(); },
                    y(d) { return d.yearY(); },
                    class: 'year'
                }).text(d => d.year);
        }

        // kind
        // @d3_image_container.append('svg:text')
        // .attr x: @image_w - 2, y: 0 , class: 'kind shadow'
        // .text (d) -> d.kind
        // @d3_image_container.append('svg:text')
        // .attr x: @image_w - 2, y: 0, class: 'kind'
        // .text (d) -> d.kind

        // markers for links between nodes
        _append_markers() {
            this.d3_defs = this.d3_svg.append('svg:defs');

            // arrow size
            const aw = 8;
            this.d3_defs.append('svg:marker')
                .attr({
                    id: 'sequel',
                    orient: 'auto',
                    refX: aw,
                    refY: aw / 2,
                    markerWidth: aw,
                    markerHeight: aw,
                    stroke: '#123',
                    fill: '#333'
                }).append('svg:polyline')
                .attr({ points: `0,0 ${aw},${aw / 2} 0,${aw} ${aw / 4},${aw / 2} 0,0` });
            return this.d3_defs.append('svg:marker')
                .attr({
                    id: 'prequel',
                    orient: 'auto',
                    refX: 0,
                    refY: aw / 2,
                    markerWidth: aw,
                    markerHeight: aw,
                    stroke: '#123',
                    fill: '#333'
                }).append('svg:polyline')
                .attr({ points: `${aw},${aw} 0,${aw / 2} ${aw},0 ${(aw * 3) / 4},${aw / 2} ${aw},${aw}` });
        }

        // @d3_svg.append('svg:defs').selectAll('marker')
        // .data(['sequel', 'prequel'])
        // .enter().append('svg:marker')
        // .attr
        // refX: 10, refY: 0
        // id: String,
        // markerWidth: 6, markerHeight: 6, orient: 'auto'
        // stroke: '#123', fill: '#123'
        // viewBox: '0 -5 10 10'
        // .append('svg:path')
        // .attr
        // d: (d) ->
        // if START_MARKERS.find(d)
        // "M10,-5L0,0L10,5"
        // else
        // "M0,-5L10,0L0,5"

        // move nodes and links accordingly to coords calculated by d3.force
        _tick() {
            this.d3_node.attr({
                transform: d => `translate(${this._bound_x(d) - d.rx}, ${this._bound_y(d) - d.ry})`
            });

            this.d3_link.attr({
                d: this._link_truncated
            });

            // collistion detection between nodes
            return this.d3_node.forEach(this._collide(0.5));
        }

        // math for obtaining coords for links between rectangular nodes
        _link_truncated(d) {
            if (!d.source || !d.target) return '';  // защита от undefined

            // if (!location.href.endsWith('?test')) {
            // if (d.source.id >= d.target.id) { return ''; }
            // }

            const rx1 = d.source.rx;
            const ry1 = d.source.ry;
            const rx2 = d.target.rx;
            const ry2 = d.target.ry;

            const x1 = this._bound_x(d.source);
            const y1 = this._bound_y(d.source);
            const x2 = this._bound_x(d.target);
            const y2 = this._bound_y(d.target);

            const coords = ShikiMath.square_cutted_line(x1, y1, x2, y2, rx1, ry1, rx2, ry2);

            if (!Number.isNaN(coords.x1) && !Number.isNaN(coords.y1) &&
                !Number.isNaN(coords.x2) && !Number.isNaN(coords.y2)) {
                return `M${coords.x1},${coords.y1} L${coords.x2},${coords.y2}`;
            } else {
                return `M${x1},${y1} L${x2},${y2}`;
            }
        }

        // math for collision detection. originally it was designed for circle
        // nodes so it is not absolutely accurate for rectangular nodes
        _collide(alpha) {
            const quadtree = d3.geom.quadtree(this.nodes_data);

            return d => {
                const nx1 = d.x - d.width;
                const nx2 = d.x + d.width;

                const ny1 = d.y - d.height;
                const ny2 = d.y + d.height;

                return quadtree.visit((quad, x1, y1, x2, y2) => {
                    if (quad.point && (quad.point !== d)) {
                        const rb = Math.max(d.rx + quad.point.rx, d.ry + quad.point.ry) * 1.15;

                        let x = d.x - quad.point.x;
                        let y = d.y - quad.point.y;
                        let l = Math.sqrt((x * x) + (y * y));

                        if ((l < rb) && (l !== 0)) {
                            l = ((l - rb) / l) * alpha;

                            x *= l;
                            y *= l;

                            d.x = this._bound_x(d, d.x - x);
                            d.y = this._bound_y(d, d.y - y);
                            quad.point.x = this._bound_x(quad.point, quad.point.x + x);
                            quad.point.y = this._bound_y(quad.point, quad.point.y + y);
                        }
                    }

                    return (x1 > nx2) || (x2 < nx1) || (y1 > ny2) || (y2 < ny1);
                });
            };
        }
    }

    const SELECT_SCALE = 2;
    const BORDER_OFFSET = 3;
    class FranchiseNode {
        constructor(data, width, height, isCurrent) {
            this.width = width;
            this.height = height;
            this.isCurrent = isCurrent;

            Object.assign(this, data);

            this.selected = false;
            this.fixed = false;

            if (this.isCurrent) {
                this.width = Math.ceil(this.width * 1.3);
                this.height = Math.ceil(this.height * 1.3);
            }

            this.initialWidth = this.width;
            this.initialHeight = this.height;
            this._calcRs();
        }

        get d3Node() {
            if (!this._d3Node) this._d3Node = d3.select($(`.node#${this.id}`)[0]);
            return this._d3Node;
        }

        get d3ImageContainer() {
            if (!this._d3ImageContainer) this._d3ImageContainer = this.d3Node.selectAll('.image-container');
            return this._d3ImageContainer;
        }

        get d3Image() {
            if (!this._d3Image) this._d3Image = this.d3Node.selectAll('image');
            return this._d3Image;
        }

        get d3Year() {
            if (!this._d3Year) this._d3Year = this.d3Node.selectAll('.year');
            return this._d3Year;
        }

        get d3OuterBorder() {
            if (!this._d3OuterBorder) this._d3OuterBorder = this.d3Node.selectAll('path.border_outer');
            return this._d3OuterBorder;
        }

        get d3InnerBorder() {
            if (!this._d3InnerBorder) this._d3InnerBorder = this.d3Node.selectAll('path.border_inner');
            return this._d3InnerBorder;
        }

        deselect(boundX, boundY, tick) {
            this.selected = false;
            this.fixed = this.pfixed;

            this._hideTooltip();
            this._animate(this.initialWidth, this.initialHeight, boundX, boundY, tick);
        }

        select(boundX, boundY, tick) {
            this.selected = true;
            this.pfixed = this.fixed; // prior fixed
            this.fixed = true;

            this._loadTooltip();
            this._animate(
                this.initialWidth * SELECT_SCALE,
                this.initialHeight * SELECT_SCALE,
                boundX,
                boundY,
                tick
            );
        }

        yearX(w = this.width) {
            return w - 2;
        }

        yearY(h = this.height) {
            return h - 2;
        }

        _calcRs() {
            this.rx = this.width / 2.0;
            return this.ry = this.height / 2.0;
        }

        _animate(newWidth, newHeight, boundX, boundY, tick) {
            let ih;
            let io;
            let iw;

            if (this.selected) {
                io = d3.interpolate(0, BORDER_OFFSET);
                iw = d3.interpolate(this.width, newWidth);
                ih = d3.interpolate(this.height, newHeight);

                this.d3Node.attr({ class: 'node selected' });
            } else {
                io = d3.interpolate(BORDER_OFFSET, 0);
                iw = d3.interpolate(this.width - (BORDER_OFFSET * 2), newWidth);
                ih = d3.interpolate(this.height - (BORDER_OFFSET * 2), newHeight);

                this.d3Node.attr({ class: 'node' });
            }

            return this.d3Node
                .transition()
                .duration(500)
                .tween('animation', () => t => {
                    // t = 1
                    const o = io(t);
                    const o2 = o * 2;
                    const w = iw(t);
                    const h = ih(t);

                    const widthIncrement = (w + o2) - this.width;
                    const heightIncrement = (h + o2) - this.height;

                    this.width += widthIncrement;
                    this.height += heightIncrement;

                    this._calcRs();

                    const outerBorderPath = `M 0,0 ${w + o2},0 ${w + o2},${h + o2} 0,${h + o2} 0,0`;

                    this.d3Node.attr({
                        transform: `translate(${boundX(this) - this.rx}, ${boundY(this) - this.ry})`
                    });
                    this.d3OuterBorder.attr({ d: outerBorderPath });
                    this.d3ImageContainer.attr({ transform: `translate(${o}, ${o})` });
                    this.d3InnerBorder.attr({ d: `M 0,0 ${w},0 ${w},${h} 0,${h} 0,0` });

                    this.d3Image.attr({ width: w, height: h });
                    this.d3Year.attr({ x: this.yearX(w), y: this.yearY(h) });

                    return tick();
                });
        }

        _hideTooltip() {
            $('.sticky-tooltip').hide();
        }

        async _loadTooltip() {
            $('.sticky-tooltip').show().addClass('b-ajax');

            const { data } = await axios.get(`https://shikimori.one/comments/${this.id}/tooltip`);
            const $temp = $('<div>').html(data);

            $temp.find('.l-top_menu-v2, .l-footer').remove();

            $('.sticky-tooltip').removeClass('b-ajax');
            $('.sticky-tooltip > .inner').html($temp.html()).process();
        }

    }


    window.ShikiMath = ShikiMath;
    window.FranchiseGraph = FranchiseGraph;
    window.FranchiseNode = FranchiseNode;
})();
