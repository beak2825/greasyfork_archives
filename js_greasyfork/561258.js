// ==UserScript==
// @name         脚本设置界面模块
// @namespace    https://greasyfork.org/zh-CN/users/1553511
// @version      1.1.0
// @description  一个通用的脚本设置界面模块
// @author       Ling77
// @license      MIT
// @grant        none
// @homepageURL  https://greasyfork.org/zh-CN/users/1553511-ling77
// ==/UserScript==

(function() {
  class GM_ConfigUI {
    constructor({config, onSave, defaultData, prefix} = {}) {
      this.config = config;
      this.onSave = onSave;
      this.defaultData = {};
      this.data = {};
      this.prefix = prefix ? prefix : 'gm-ui-' + Math.random().toString(36).slice(2, 7);
      this.css = null;
      if (defaultData && typeof defaultData === 'object' && Object.keys(defaultData).length === 0) {
        this.defaultData = JSON.parse(JSON.stringify(defaultData));
        this.data = JSON.parse(JSON.stringify(defaultData));
      } else this.initData();
      this.initStyles();
    }
    open() {
      if (!document.getElementById(this.prefix + '-modal')) this.render();
      document.getElementById(this.prefix + '-modal').style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
    close() {
      const modal = document.getElementById(this.prefix + '-modal');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    }
    initData() {
      const traverse = (source, target, depth) => {
        for (const key in source) {
          const item = source[key];
          switch (depth) {
           case 1:
           case 2:
            target[key] = {};
            const nextSource = depth === 1 ? item.groups : item.items;
            traverse(nextSource, target[key], depth + 1);
            break;

           case 3:
            let val = item.value;
            if (val === void 0) if (item.type === 'boolean') val = false; else if (item.type === 'number') val = 0; else if (item.type.includes('multi')) val = []; else val = "";
            target[key] = val;
          }
        }
      };
      traverse(this.config.fields, this.defaultData, 1);
      this.data = JSON.parse(JSON.stringify(this.defaultData));
    }
    updateData(newData) {
      this.data = JSON.parse(JSON.stringify(newData));
      if (document.getElementById(this.prefix + '-modal')) {
        const isOpen = document.getElementById(this.prefix + '-modal').style.display === 'flex';
        document.getElementById(this.prefix + '-modal').remove();
        this.render();
        if (isOpen) this.open();
      }
    }
    exportData() {
      return JSON.parse(JSON.stringify(this.data));
    }
    initStyles() {
      this.css = `.${this.prefix}-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:none;justify-content:center;align-items:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;}.${this.prefix}-container{background:#fff;width:800px;max-width:95%;height:600px;max-height:90%;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.2);display:flex;flex-direction:column;overflow:hidden;animation:${this.prefix}-fadein 0.2s ease-out;}@keyframes ${this.prefix}-fadein{from{opacity:0;transform:scale(0.95);}to{opacity:1;transform:scale(1);}}.${this.prefix}-header{padding:15px 20px;border-bottom:1px solid#eee;display:flex;justify-content:space-between;align-items:center;background:#f9f9f9;}.${this.prefix}-title-group{display:flex;flex-direction:column;gap:4px;}.${this.prefix}-title{font-size:18px;font-weight:600;color:#333;margin:0;}.${this.prefix}-title-desp{font-size:13px;color:#666;}.${this.prefix}-close{cursor:pointer;font-size:24px;color:#999;line-height:1;}.${this.prefix}-close:hover{color:#333;}.${this.prefix}-body{display:flex;flex:1;overflow:hidden;min-height:300px;}.${this.prefix}-sidebar{width:180px;background:#f5f7fa;border-right:1px solid#eee;overflow-y:auto;display:flex;flex-direction:column;}.${this.prefix}-category-item{padding:12px 20px;cursor:pointer;color:#666;transition:all 0.2s;border-left:3px solid transparent;font-size:14px;}.${this.prefix}-category-item:hover{background:#eef1f5;color:#333;}.${this.prefix}-category-item.active{background:#fff;color:#2196F3;border-left-color:#2196F3;font-weight:500;}.${this.prefix}-content-area{flex:1;overflow-y:auto;padding:20px;scroll-behavior:smooth;}.${this.prefix}-category-content{animation:${this.prefix}-slide 0.2s;}@keyframes ${this.prefix}-slide{from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:translateY(0);}}.${this.prefix}-group{margin-bottom:25px;border:1px solid#eee;border-radius:6px;overflow:hidden;}.${this.prefix}-group-header{background:#f0f2f5;padding:10px 15px;border-bottom:1px solid#eee;}.${this.prefix}-group-title{font-weight:600;color:#333;}.${this.prefix}-group-desp{font-size:12px;color:#888;margin-top:4px;}.${this.prefix}-group-body{background:#fff;}.${this.prefix}-item{padding:12px 15px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px dashed#f0f0f0;min-height:40px;}.${this.prefix}-item:last-child{border-bottom:none;}.${this.prefix}-item.stacked{flex-direction:column;align-items:flex-start;}.${this.prefix}-item.stacked.${this.prefix}-item-right{width:100%;margin-top:8px;}.${this.prefix}-item-left{flex:1;padding-right:20px;}.${this.prefix}-item-name{font-size:14px;color:#333;}.${this.prefix}-item-desp{font-size:12px;color:#999;margin-top:4px;}.${this.prefix}-item-right{display:flex;align-items:center;justify-content:flex-end;}.${this.prefix}-suffix{margin-left:8px;font-size:12px;color:#888;}.${this.prefix}-input-text,.${this.prefix}-select,.${this.prefix}-input-num{border:1px solid#ddd;padding:6px 8px;border-radius:4px;font-size:14px;transition:border 0.2s;}.${this.prefix}-input-text:focus,.${this.prefix}-select:focus,.${this.prefix}-input-num:focus{border-color:#2196F3;outline:none;}.${this.prefix}-input-text{width:200px;}textarea.${this.prefix}-input-text{width:100%;min-height:80px;resize:vertical;box-sizing:border-box;}.${this.prefix}-switch{position:relative;display:inline-block;width:40px;height:20px;}.${this.prefix}-switch input{opacity:0;width:0;height:0;}.${this.prefix}-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:20px;}.${this.prefix}-slider:before{position:absolute;content:"";height:16px;width:16px;left:2px;bottom:2px;background-color:white;transition:.4s;border-radius:50%;}input:checked+.${this.prefix}-slider{background-color:#2196F3;}input:checked+.${this.prefix}-slider:before{transform:translateX(20px);}.${this.prefix}-range-wrap{display:flex;align-items:center;gap:10px;}.${this.prefix}-input-num{width:60px;}.${this.prefix}-range-slider{width:120px;cursor:pointer;}.${this.prefix}-check-group{display:flex;flex-wrap:wrap;gap:10px;}.${this.prefix}-check-label{display:flex;align-items:center;font-size:13px;cursor:pointer;min-width:80px;}.${this.prefix}-check-label input{margin-right:6px;}.${this.prefix}-footer{padding:15px 20px;border-top:1px solid#eee;background:#f9f9f9;display:flex;justify-content:space-between;}.${this.prefix}-btn{padding:8px 20px;border:none;border-radius:4px;cursor:pointer;font-size:14px;transition:0.2s;}.${this.prefix}-btn:hover{transform:translateY(1px);filter:brightness(90%);}.${this.prefix}-btn-reset{background:#f44336;color:white;}.${this.prefix}-btn-cancel{background:#e0e0e0;color:#333;margin-right:10px;}.${this.prefix}-btn-save{background:#2196F3;color:white;}`;
      const style = document.createElement('style');
      style.id = this.prefix + '-style';
      style.textContent = this.css;
      document.head.appendChild(style);
    }
    render() {
      const overlay = document.createElement('div');
      overlay.id = `${this.prefix}-modal`;
      overlay.className = `${this.prefix}-overlay`;
      const container = document.createElement('div');
      container.className = `${this.prefix}-container`;
      const header = document.createElement('div');
      header.className = `${this.prefix}-header`;
      const descHtml = this.config.desp ? `<div class="${this.prefix}-title-desp">${this.config.desp}</div>` : '';
      header.innerHTML = `<div class="${this.prefix}-title-group">\n<h3 class="${this.prefix}-title">${this.config.title || 'Settings'}</h3>${descHtml}</div>\n<span class="${this.prefix}-close">×</span>`;
      header.querySelector(`.${this.prefix}-close`).onclick = () => this.close();
      const body = document.createElement('div');
      body.className = `${this.prefix}-body`;
      const sidebar = document.createElement('div');
      sidebar.className = `${this.prefix}-sidebar`;
      const contentArea = document.createElement('div');
      contentArea.className = `${this.prefix}-content-area`;
      const categories = Object.keys(this.config.fields);
      const hasSidebar = categories.length > 1;
      if (!hasSidebar) {
        sidebar.style.display = 'none';
        contentArea.style.width = '100%';
      }
      categories.forEach((catKey, index) => {
        const catConfig = this.config.fields[catKey];
        if (hasSidebar) {
          const tab = document.createElement('div');
          tab.className = `${this.prefix}-category-item ${index === 0 ? 'active' : ''}`;
          tab.textContent = catConfig.label || catKey;
          tab.onclick = () => {
            sidebar.querySelectorAll(`.${this.prefix}-category-item`).forEach(el => el.classList.remove('active'));
            tab.classList.add('active');
            contentArea.querySelectorAll(`.${this.prefix}-category-content`).forEach(el => el.style.display = 'none');
            contentDiv.style.display = 'block';
          };
          sidebar.appendChild(tab);
        }
        const contentDiv = document.createElement('div');
        contentDiv.className = `${this.prefix}-category-content`;
        contentDiv.style.display = index === 0 ? 'block' : 'none';
        const groups = catConfig.groups || {};
        for (const groupKey in groups) {
          const groupConfig = groups[groupKey];
          contentDiv.appendChild(this.renderGroup(groupKey, groupConfig, catKey));
        }
        contentArea.appendChild(contentDiv);
      });
      const footer = document.createElement('div');
      footer.className = `${this.prefix}-footer`;
      const btnReset = document.createElement('button');
      btnReset.className = `${this.prefix}-btn ${this.prefix}-btn-reset`;
      btnReset.textContent = '重置';
      btnReset.onclick = () => {
        if (confirm('确定恢复默认设置吗？')) {
          this.data = JSON.parse(JSON.stringify(this.defaultData));
          this.updateData(this.data);
          if (this.onSave) this.onSave(this.exportData());
        }
      };
      const btnCancel = document.createElement('button');
      btnCancel.className = `${this.prefix}-btn ${this.prefix}-btn-cancel`;
      btnCancel.textContent = '取消';
      btnCancel.onclick = () => this.close();
      const btnSave = document.createElement('button');
      btnSave.className = `${this.prefix}-btn ${this.prefix}-btn-save`;
      btnSave.textContent = '保存设置';
      btnSave.onclick = () => {
        if (this.onSave) this.onSave(this.exportData());
        this.close();
      };
      footer.appendChild(btnReset);
      const rightBtns = document.createElement('div');
      rightBtns.appendChild(btnCancel);
      rightBtns.appendChild(btnSave);
      footer.appendChild(rightBtns);
      body.appendChild(sidebar);
      body.appendChild(contentArea);
      container.appendChild(header);
      container.appendChild(body);
      container.appendChild(footer);
      overlay.appendChild(container);
      document.body.appendChild(overlay);
      overlay.addEventListener('click', e => {
        if (e.target === overlay) this.close();
      });
    }
    renderGroup(groupKey, groupConfig, catKey) {
      const groupDiv = document.createElement('div');
      groupDiv.className = `${this.prefix}-group`;
      if (groupConfig.label) {
        const groupHead = document.createElement('div');
        groupHead.className = `${this.prefix}-group-header`;
        groupHead.innerHTML = `<div class="${this.prefix}-group-title">${groupConfig.label}</div>`;
        if (groupConfig.desp) groupHead.innerHTML += `<div class="${this.prefix}-group-desp">${groupConfig.desp}</div>`;
        groupDiv.appendChild(groupHead);
      }
      const items = groupConfig.items || {};
      const groupBody = document.createElement('div');
      groupBody.className = `${this.prefix}-group-body`;
      for (const itemKey in items) {
        const itemConfig = items[itemKey];
        const currentVal = this.data[catKey][groupKey][itemKey];
        const itemEl = this.renderItem(itemKey, itemConfig, currentVal, newVal => {
          this.data[catKey][groupKey][itemKey] = newVal;
        });
        groupBody.appendChild(itemEl);
      }
      groupDiv.appendChild(groupBody);
      return groupDiv;
    }
    renderItem(key, config, value, onChange) {
      const row = document.createElement('div');
      row.className = `${this.prefix}-item`;
      if (config.type === 'multiline') row.classList.add('stacked');
      if (config.type === 'multiselect' && config.style !== 'dropdown') row.classList.add('stacked');
      const left = document.createElement('div');
      left.className = `${this.prefix}-item-left`;
      left.innerHTML = `<div class="${this.prefix}-item-name">${config.label || key}</div>`;
      if (config.desp) left.innerHTML += `<div class="${this.prefix}-item-desp">${config.desp}</div>`;
      row.appendChild(left);
      const right = document.createElement('div');
      right.className = `${this.prefix}-item-right`;
      const control = this.createControl(key, config, value, onChange);
      right.appendChild(control);
      if (config.suffix) {
        const suffix = document.createElement('span');
        suffix.className = `${this.prefix}-suffix`;
        suffix.textContent = config.suffix;
        right.appendChild(suffix);
      }
      row.appendChild(right);
      return row;
    }
    createControl(key, config, value, onChange) {
      switch (config.type) {
       case 'boolean':
        {
          const label = document.createElement('label');
          label.className = `${this.prefix}-switch`;
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = !!value;
          checkbox.onchange = e => onChange(e.target.checked);
          const slider = document.createElement('span');
          slider.className = `${this.prefix}-slider round`;
          label.appendChild(checkbox);
          label.appendChild(slider);
          return label;
        }

       case 'text':
       case 'multiline':
        {
          let input;
          if (config.type === 'text') {
            input = document.createElement('input');
            input.type = 'text';
          } else input = document.createElement('textarea');
          input.className = `${this.prefix}-input-text`;
          input.value = value || '';
          if (config.hint) input.placeholder = config.hint;
          input.oninput = e => onChange(e.target.value);
          return input;
        }

       case 'number':
        {
          const numWrap = document.createElement('div');
          numWrap.className = `${this.prefix}-range-wrap`;
          const numInput = document.createElement('input');
          numInput.type = 'number';
          if (config.step) numInput.step = config.step;
          numInput.value = value || 0;
          numInput.className = `${this.prefix}-input-number`;
          if (config.min !== void 0) numInput.min = config.min;
          if (config.max !== void 0) numInput.max = config.max;
          if (config.min !== void 0 && config.max !== void 0) {
            const range = document.createElement('input');
            range.type = 'range';
            range.className = `${this.prefix}-range-slider`;
            if (config.step) range.step = config.step;
            range.min = config.min;
            range.max = config.max;
            range.value = value || 0;
            range.oninput = e => {
              numInput.value = e.target.value;
              onChange(Number(e.target.value));
            };
            numInput.oninput = e => {
              let val = Number(e.target.value);
              if (val > item.max) val = item.max;
              range.value = val;
              item.value = val;
              onChange(val);
            };
            numInput.onblur = e => {
              let val = Number(e.target.value);
              if (val < item.min) val = item.min;
              if (val > item.max) val = item.max;
              numInput.value = val;
              range.value = val;
              onChange(val);
            };
            numWrap.appendChild(range);
          } else numInput.oninput = e => onChange(Number(e.target.value));
          numWrap.appendChild(numInput);
          return numWrap;
        }

       case 'select':
       case 'multiselect':
        {
          const isMulti = config.type === 'multiselect';
          const options = config.options || [];
          if (!config.style || config.style === 'dropdown') {
            const select = document.createElement('select');
            select.className = `${this.prefix}-select`;
            if (isMulti) select.multiple = true;
            options.forEach(opt => {
              const optVal = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              const option = document.createElement('option');
              option.value = optVal;
              option.textContent = optLabel;
              if (isMulti) {
                if (Array.isArray(value) && value.includes(optVal)) option.selected = true;
              } else if (value == optVal) option.selected = true;
              select.appendChild(option);
            });
            select.onchange = e => {
              if (isMulti) {
                const val = Array.from(e.target.selectedOptions).map(o => o.value);
                onChange(val);
              } else onChange(e.target.value);
            };
            return select;
          } else {
            const listWrap = document.createElement('div');
            listWrap.className = `${this.prefix}-check-group`;
            options.forEach(opt => {
              const optVal = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              const label = document.createElement('label');
              label.className = `${this.prefix}-check-label`;
              const input = document.createElement('input');
              input.type = isMulti ? 'checkbox' : 'radio';
              input.name = `${this.prefix}_radio_${key}`;
              input.value = optVal;
              if (isMulti) input.checked = Array.isArray(value) && value.includes(optVal); else input.checked = value === optVal;
              input.onchange = () => {
                if (isMulti) {
                  const checked = Array.from(listWrap.querySelectorAll('input:checked')).map(i => i.value);
                  onChange(checked);
                } else onChange(optVal);
              };
              label.appendChild(input);
              label.appendChild(document.createTextNode(optLabel));
              listWrap.appendChild(label);
            });
            return listWrap;
          }
        }

       default:
        return document.createTextNode('Unknown Type');
      }
    }
  }
  window.GM_ConfigUI = GM_ConfigUI;
})();
