function tag(name) {
  return {
    elem: document.createElement(name),

    id: function(v) {
      this.elem.setAttribute('id', v)
      return this
    },

    attr: function(k, v) {
      this.elem.setAttribute(k, v)
      return this
    },

    style: function(k, v) {
      this.elem.style[k] = v
      return this
    },

    cssClass: function(v) {
      this.elem.classList.add(v)
      return this
    },

    href: function(v) {
      this.elem.setAttribute('href', v)
      return this
    },

    value: function(v) {
      this.elem.value = v
      return this
    },

    checked: function(v) {
      this.elem.checked = !!v
      return this
    },

    text: function(v) {
      this.elem.textContent = v
      return this
    },

    on: function(name, handler, options = {}) {
      this.elem.addEventListener(name, handler, options)
      return this
    },

    append: function(child) {
      this.elem.appendChild(child.elem || child)
      return this
    },

    create: function() {
      return this.elem
    },

    end: function() {
      return this.elem
    },
  }
}
