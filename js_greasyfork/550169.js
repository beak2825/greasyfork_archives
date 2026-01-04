// ==UserScript==
// @name         Classes
// @namespace    http://tampermonkey.net/
// @version      2025-09-20
// @description  Arras classes for scripting
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    class BroadcastInfo {
  constructor() {
    this.clear();
  }

  clear() {
    this.global_minimap = {};
    this.team_minimap = {};
    this.leaderboard = new Map();
  }

  // get the id of a leaderboard item by rank
  get_lb_rank_id(rank) {
    let i = 0;
    for (const [id, lb_obj] of this.leaderboard.entries()) {
      if (i === rank) {
        return id;
      }
      i++;
    }
    return null;
  }

  serialize_team_minimap() {
    let bytes = (this.team_minimap.length * 7) + 2;
    let buf = new ArrayBuffer(bytes);
    let view = new DataView(buf);

    view.setUint16(0, this.team_minimap.length);

    let offset = 2;
    for (let id in this.team_minimap) {
      let obj = this.team_minimap[id];
      view.setUint32(offset, id);
      view.setUint8(offset + 4, obj.x);
      view.setUint8(offset + 5, obj.y);
      view.setUint8(offset + 6, obj.color);
      offset += 7;
    }

    return buf;
  }

  deserialize_team_minimap(buf) {

    let view = new DataView(buf);
    let len = view.getUint16(0);

    let offset = 2;
    for (let i = 0; i < len; i++) {
      let id = view.getUint32(offset);
      let x = view.getUint8(offset + 4);
      let y = view.getUint8(offset + 5);
      let color = view.getUint8(offset + 6);
      this.team_minimap[id] = { x, y, color };
      offset += 7;
    }
  }

  draw_global_minimap(ctx, rx, ry, norm_to_canvas) {

    // do global first
    ctx.globalAlpha = 0.5;

    for (const [id, global_mmap_obj] of Object.entries(this.global_minimap)) {
      const { x, y, color, type, size } = global_mmap_obj;
      const { cx, cy } = norm_to_canvas(x, y);

      ctx.fillStyle = COLOR_ID_MAP[color] || 'black';

      switch (type) {
        case 0: // boss, rock
        case 1: {
          ctx.beginPath();
          ctx.arc(cx, cy, size * c_factor, 0, 2 * Math.PI);
          ctx.fill();
          ctx.closePath();
          break;
        }

        // wall
        case 2: {
          let c_size = 2 * size * c_factor + 0.5;
          ctx.fillRect_c(cx, cy, c_size, c_size);
          break;
        }
      }

    }
    ctx.globalAlpha = 1.0;
  }



  draw(ctx, room_info) {
    // console.log(`team minimap length: ${Object.keys(this.team_minimap).length}`);
    const { x_min, y_min, x_max, y_max } = room_info;
    // minimap
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    // -x -y to +x +y (room)
    // divide by 10
    let rx = x_max - x_min;
    let ry = y_max - y_min;
    let c_rx = rx * c_factor;
    let c_ry = ry * c_factor;

    // define a function to convert norm x,y to canvas x,y
    const norm_to_canvas = (nx, ny) => {
      return {
        cx: (nx - 0.5) * c_rx,
        cy: (ny - 0.5) * c_ry,
      };
    };

    this.draw_global_minimap(ctx, rx, ry, norm_to_canvas);
    this.draw_team_minimap(ctx, norm_to_canvas);
  }

  draw_team_minimap(ctx, norm_to_canvas) {

    ctx.font = 'bold 10px Ubuntu';

    let queued_draws = [];

    for (const [id, team_mmap_obj] of Object.entries(this.team_minimap)) {
      let { x, y, color } = team_mmap_obj;
      x /= 255;
      y /= 255;
      // get the lb obj
      const lb_obj = this.leaderboard.get(Number(id));
      let text = '';
      if (lb_obj) {
        const { name, score, mockup_index } = lb_obj;
        let mockup_name = window.mockups.get_mockup_name(mockup_index);
        text = `${name} | ${mockup_name} | ${make_score_str(score)}`;
      }

      const { cx, cy } = norm_to_canvas(x, y);

      let is_target = target_id === Number(id);
      if (is_target) {
        window.target_player.update_target(x, y, color);
      }


      let score = lb_obj?.score;

      if (id == window.game_update.player.entity_id) {
        color = 19; // black
        score = 1e5;

        window.target_player.update_self(x, y);
      }

      let q = draw_minimap_dot(ctx, cx, cy, color, score, is_target);
      if (q) {
        queued_draws.push(q);
      }

      if (text) {
        // ctx.fillText(text, cx, cy);
      }
    }

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    for (const q of queued_draws) {
      let {x, y, radius, alpha} = q;
      radius *= 1.5;

      ctx.globalAlpha = alpha;


      let base_angle = curr_t / 5;
      for (let i = 0; i < 4; i++) {
        let angle = base_angle + i * Math.PI / 2;
        let dx = Math.cos(angle) * radius;
        let dy = Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + dx, y + dy);
        ctx.stroke();
        ctx.closePath();

      }

      ctx.globalAlpha = 1;
    }
  }

  parse_broadcast_packet(packet, room_info) {
    let r = new Rotator(packet);

    // console.log(packet);

    this.parse_global_minimap_dels(r);
    this.parse_global_minimap(r);

    this.parse_team_minimap_dels(r);
    this.parse_team_minimap(r);

    this.parse_leaderboard_dels(r);
    this.parse_leaderboard(r);

  }

  parse_global_minimap_dels(r) {
    let len = r.next;

    for (let iter = 0; iter < len; iter++) {
      delete this.global_minimap[r.next];
    }
  }

  parse_global_minimap(r) {
    let len = r.next;

    for (let iter = 0; iter < len; iter++) {
      this.global_minimap[r.next] = {
        type: r.next,
        x: r.next_n255,
        y: r.next_n255,
        color: r.next,
        size: r.next,
      };
    }
  }

  parse_team_minimap_dels(r) {
    let len = r.next;

    for (let iter = 0; iter < len; iter++) {
      delete this.team_minimap[r.next];
    }
  }

  parse_team_minimap(r) {
    let len = r.next;

    for (let iter = 0; iter < len; iter++) {
      let id = r.next;
      this.team_minimap[id] = {
        x: r.next,
        y: r.next,
        color: r.next,
      };
    }
  }

  parse_leaderboard_dels(r) {
    let len = r.next;

    for (let iter = 0; iter < len; iter++) {
      this.leaderboard.delete(r.next);
    }
  }

  parse_leaderboard(r) {
    let len = r.next;

    for (let iter = 0; iter < len; iter++) {
      this.leaderboard.set(r.next, {
        score: r.next,
        mockup_index: r.next,
        name: r.str_sm5,
        color: r.next,
        bar_color: r.next,
      });
    }

    // sort by score, descending
    this.leaderboard = new Map([...this.leaderboard.entries()].sort((a, b) => b[1].score - a[1].score));
  }
}
class RoomInfo {
  constructor() {
    this.x_min = 0;
    this.y_min = 0;
    this.x_max = 0;
    this.y_max = 0;

    this.x_size = 0;
    this.y_size = 0;

    this.wall_size = 1e9;
    this.walls_init = false;

    this.layout = [];
  }

  // normalized [0,1] (may be slightly outside bounds) to grid coord (0 to xsize, 0 to ysize)
  normalized_coord_to_grid_coord(nx, ny) {
    return {
      gx: Math.floor(nx * (this.x_size - 2)) + 1,
      gy: Math.floor(ny * (this.y_size - 2)) + 1,
    };
  }

  // invert
  grid_coord_to_normalized_coord(gx, gy) {
    return {
      nx: (gx-1) / (this.x_size - 2),
      ny: (gy-1) / (this.y_size - 2),
    }
  }

  grid_coord_to_global_coord(gx, gy) {
    let { nx, ny } = this.grid_coord_to_normalized_coord(gx, gy);
    return {
      gx: (nx - 0.5) * this.x_size,
      gy: (ny - 0.5) * this.y_size,
    };
  }

  draw(ctx) {
    const { x_min, y_min, x_max, y_max } = this;

    let rx = x_max - x_min;
    let ry = y_max - y_min;

    let wx = rx / (this.x_size);
    let wy = ry / (this.y_size);

    let c_rx = rx * c_factor;
    let c_ry = ry * c_factor;


    // minimap
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    ctx.globalAlpha = bg_opacity;
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect_c(0, 0, c_rx, c_ry);
    ctx.strokeRect_c(0, 0, c_rx, c_ry);
    ctx.globalAlpha = 1;

  }

  parse_room_packet(packet) {

    // x min, y min, x max, y max, ?, ?, size_x, size_y, ...
    this.x_min = packet[0];
    this.y_min = packet[1];
    this.x_max = packet[2];
    this.y_max = packet[3];
    console.log(`room bounds: ${this.x_min}, ${this.y_min}, ${this.x_max}, ${this.y_max}`);

    console.log(`first 10 packet: ${packet.slice(0, 10)}`);
    let sx = packet[6];
    let sy = packet[7];
    // at their smallest, walls are half the size - so we need to double the size
    // we also include outer edge tiles (i.e. 2 extra, 1 on each side), since players can go there as well
    this.x_size = sx * 2 + 2;
    this.y_size = sy * 2 + 2;

    console.log(`true layout size: ${sx}, ${sy}`);

    let layout = [];
    // allocate the layout sx by sy (2d array)
    for (let x = 0; x < this.x_size; x++) {
      layout.push([]);
      for (let y = 0; y < this.y_size; y++) {
        layout[x].push(1);
      }
    }

    let offset = 8;

    for (let x = 0; x < sx; x++) {
      for (let y = 0; y < sy; y++) {
        let p_index = offset + x * sy + y;
        let val = packet[p_index];
        if (!val) val = 18;
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            let x_ = 1 + 2*x+i;
            let y_ = 1 + 2*y+j;
            layout[y_][x_] = val == 18? 1 : val;
          }
        }
      }
    }

    this.layout = layout;


  }
}
class Mockups {
  constructor() {
    this.mockups = new Map();
  }

  get_mockup_name(id) {
    return this.mockups.get(id) || 'Unknown Entity';
  }

  parse_mockup_packet(packet) {
    let strs = extract_strings(packet);

    for (let s of strs) {
      const { start, end, string } = s;
      if (string.length > 2) {

        // loc.start - 2 is the mockup id
        let mockup_id = packet[start - 2];
        if (!this.mockups.has(mockup_id)) {
          this.mockups.set(mockup_id, string);
        }
      }

    }

    // sort the mockups by id
    let sorted_mockups = Array.from(this.mockups.entries()).sort((a, b) => a[0] - b[0]);
    this.mockups = new Map(sorted_mockups);
  }
}
class Entity {
  constructor() {
    this.x = undefined;
    this.y = undefined;
    this.angle = undefined;

    this.mockup_id = 0;

    // rendering flags probably (i.e. dmg immunity flash, etc)
    this.flags = 0;
    this.health = 255;
    this.shield = 255;
    this.opacity = 255;

    this.size = 0;

    this.score = 0;
    this.name = "";
    this.color_id = 0;
    this.type = 0;
  }
}
class Player {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.fov = 0;

    this.mockup_id = 0;
    this.color_id = undefined;
    this.entity_id = 0;
    this.score = 0;
  }
}
class GameUpdate {
  constructor() {
    this.player = new Player();
    this.entities = new Map();
  }

  parse_update_packet(packet) {
    let r = new Rotator(packet);

    let res = this.parse_player(r);

    if (!res) return;

    let next;
    // read until -1
    while ((next = r.next) != -1) {
      // do nothing
    }

    this.parse_deleted_entities(r);
    this.parse_updated_entities(r);
  }

  parse_player(r) {
    this.player.x = r.next;
    this.player.y = r.next;
    this.player.fov = r.next;

    if (r.eop) return false;

    let flags = r.next;

    if (flags === 4094) {
      r.skip(1);
      this.player.mockup_id = r.next;
      r.skip(1);
      this.player.color_id = r.next;
      this.player.entity_id = r.next;
      this.player.score = r.next;
    }

    return true;
  }

  parse_deleted_entities(r) {
    let deleted_entities = [];
    let next;

    while ((next = r.next) != -1) {
      deleted_entities.push(next);
    }

    for (let id of deleted_entities) {
      this.entities.delete(id);
    }
  }

  parse_updated_entities(r, self_only = false) {
    while (!r.eop) {
      let id = r.next;
      let entity = this.entities.get(id) ?? new Entity();
      let is_self = id === this.player.entity_id;

      if (self_only && !is_self) {
        continue;
      }
      entity = this.parse_entity(entity, r);
      if (is_self) {
        // copy all properties to player
        for (let key in entity) {
          this.player[key] = entity[key];
        }

        our_pos = {x: this.player.x, y: this.player.y};
      }

      this.entities.set(id, entity);
    }
  }

  parse_entity(entity, r) {
    let flags = r.next;
    let next;

    if (flags & (1<<0)) {
      let dx = r.next / 4;
      let dy = r.next / 4;
      if (entity.x === undefined || entity.y === undefined) {
        entity.x = dx;
        entity.y = dy;
      } else {
        entity.x += dx;
        entity.y += dy;
      }
    }

    if (flags & (1<<1)) {
      let v = r.next * Math.PI / 512;
      entity.angle = (entity.angle === undefined) ? v : entity.angle + v;
    }

    if (flags & (1<<2)) {
      entity.mockup_id = r.next;
    }

    if (flags & (1<<3)) {
      let l = r.index;
      while ((next = r.next) !== -1) {
        let gun_index = next;
        let gun_flags = r.next;
        let time, power;
        if (gun_flags & (1<<0)) { time = r.next; }
        if (gun_flags & (1<<1)) { power = r.next; }
      }
    }

    if (flags & (1<<4)) {
      while ((next = r.next) !== -1) {
        let turret_index = next;
        let _ = this.parse_entity(new Entity(), r, false);
      }
    }

    if (flags & (1<<5)) { entity.flags = r.next; }
    if (flags & (1<<6)) { entity.health = r.next; }
    if (flags & (1<<7)) { entity.shield = r.next; }
    if (flags & (1<<8)) { entity.opacity = r.next; }
    if (flags & (1<<9)) { entity.size = r.abs_next * 0.0625; }
    if (flags & (1<<10)) { entity.score = r.next; }
    if (flags & (1<<11)) { entity.name = r.str_sm5; }
    if (flags & (1<<12)) { entity.color_id = r.next; }
    if (flags & (1<<13)) { entity.type = r.next; }

    return entity;
  }

}
class TargetPlayer {
  constructor() {
    this.x = null;
    this.y = null;
    this.color = null;

    this.px = null;
    this.py = null;

    this.last_x = null;
    this.last_y = null;
    this.last_px = null;
    this.last_py = null;

    this.has_target = false;

    this.result = null;

    this.last_tile = {};
  }

  get updated_positions() {
    return this.x !== this.last_x || this.y !== this.last_y || this.px !== this.last_px || this.py !== this.last_py;
  }

  get updated_self_positions() {
    return this.px !== this.last_px || this.py !== this.last_py;
  }

  get updated_target_positions() {
    return this.x !== this.last_x || this.y !== this.last_y;
  }

  update_lasts() {
    this.last_x = this.x;
    this.last_y = this.y;
    this.last_px = this.px;
    this.last_py = this.py;
  }

  update_self(nx, ny) {
    let res = window.room_info.normalized_coord_to_grid_coord(nx, ny);
    this.px = clamp(res.gx, 0, window.room_info.x_size - 1);
    this.py = clamp(res.gy, 0, window.room_info.y_size - 1);
  }

  peace() {
    this.has_target = false;
  }

}
class Rotator {
  constructor(packet, index = 0) {
    this.packet = packet;
    this._index = index;
  }

  get index() {
    return this._index;
  }

  set index(index) {
    this._index = index;
  }

  get next() {
    return this.packet[this._index++];
  }

  // next / 255
  get next_n255() {
    return this.next / 255;
  }

  get abs_next() {
    return Math.abs(this.next);
  }

  get undo() {
    return this.packet[--this._index];
  }

  // skip n vals
  skip(n) {
      this._index += n;
  }

  // w/ len.
  str(len) {
    if (len > 1000) {
      console.log(`WARNING: string length is ${len}, skipping`);
      this.skip(len);
      return '';
    }

    let remaining = len;
    let s = '';

    while (remaining > 0) {
      let a = this.next;
      let b = this.next;
      if (-64 <= b && b < 0 && !(16 < a && a < 160)) {
        s += "💀"; // still dont have the full algo so im just gotta put a skull here as long as the length is right
        if (a > 3000) { // to be exact the smallest a for 4 byte is 36992, but lets just put 3000 here
          remaining -= 4;
        } else if (-16 <= a && a < 16) {
          remaining -= 2;
        } else {
          remaining -= 3;
        }

        // u+7ff or less, -2 bytes

      } else {
        s += String.fromCharCode(a);
        this.undo;
        remaining--;
      }

    }

    return s;
  }

  // 5 bit sign-magnitude
  get str_sm5() {
    let len = this.next;

    if (len < 0) {
      len = 32 + len;
    }

    return this.str(len);
  }

  get eop() {
    return this._index >= this.packet.length;
  }
}
})();