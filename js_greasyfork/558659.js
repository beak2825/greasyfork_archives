// ==UserScript==
// @name        Quizlet Live Cheat
// @description Allows you to automatically answer questions in Quizlet Live
// @namespace   https://github.com/feketefh/QuizletLiveCheat
// @match       https://quizlet.com/live*
// @run-at      document-start
// @iconURL     https://assets.quizlet.com/a/j/dist/app/i/logo/2021/q-twilight.e27821d9baad165.png
// @author      feketefh
// @version     0.6.2
// @license     MIT
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/558659/Quizlet%20Live%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/558659/Quizlet%20Live%20Cheat.meta.js
// ==/UserScript==
(function () {
	'use strict';

	/** @returns {void} */
	function noop() {}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	/**
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function run_all(fns) {
		fns.forEach(run);
	}

	/**
	 * @param {any} thing
	 * @returns {thing is Function}
	 */
	function is_function(thing) {
		return typeof thing === 'function';
	}

	/** @returns {boolean} */
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
	}

	/** @returns {boolean} */
	function is_empty(obj) {
		return Object.keys(obj).length === 0;
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append(target, node) {
		target.appendChild(node);
	}

	/**
	 * @param {Node} target
	 * @param {string} style_sheet_id
	 * @param {string} styles
	 * @returns {void}
	 */
	function append_styles(target, style_sheet_id, styles) {
		const append_styles_to = get_root_for_style(target);
		if (!append_styles_to.getElementById(style_sheet_id)) {
			const style = element('style');
			style.id = style_sheet_id;
			style.textContent = styles;
			append_stylesheet(append_styles_to, style);
		}
	}

	/**
	 * @param {Node} node
	 * @returns {ShadowRoot | Document}
	 */
	function get_root_for_style(node) {
		if (!node) return document;
		const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
		if (root && /** @type {ShadowRoot} */ (root).host) {
			return /** @type {ShadowRoot} */ (root);
		}
		return node.ownerDocument;
	}

	/**
	 * @param {ShadowRoot | Document} node
	 * @param {HTMLStyleElement} style
	 * @returns {CSSStyleSheet}
	 */
	function append_stylesheet(node, style) {
		append(/** @type {Document} */ (node).head || node, style);
		return style.sheet;
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach(node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	/**
	 * @template {keyof HTMLElementTagNameMap} K
	 * @param {K} name
	 * @returns {HTMLElementTagNameMap[K]}
	 */
	function element(name) {
		return document.createElement(name);
	}

	/**
	 * @param {string} data
	 * @returns {Text}
	 */
	function text(data) {
		return document.createTextNode(data);
	}

	/**
	 * @returns {Text} */
	function space() {
		return text(' ');
	}

	/**
	 * @param {EventTarget} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @returns {() => void}
	 */
	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	/**
	 * @returns {(event: any) => any} */
	function prevent_default(fn) {
		return function (event) {
			event.preventDefault();
			// @ts-ignore
			return fn.call(this, event);
		};
	}

	/**
	 * @returns {(event: any) => any} */
	function stop_propagation(fn) {
		return function (event) {
			event.stopPropagation();
			// @ts-ignore
			return fn.call(this, event);
		};
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
	}

	/**
	 * @param {Element} element
	 * @returns {ChildNode[]}
	 */
	function children(element) {
		return Array.from(element.childNodes);
	}

	/**
	 * @param {Text} text
	 * @param {unknown} data
	 * @returns {void}
	 */
	function set_data(text, data) {
		data = '' + data;
		if (text.data === data) return;
		text.data = /** @type {string} */ (data);
	}

	/**
	 * @returns {void} */
	function set_style(node, key, value, important) {
		if (value == null) {
			node.style.removeProperty(key);
		} else {
			node.style.setProperty(key, value, '');
		}
	}

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @param {{ bubbles?: boolean, cancelable?: boolean }} [options]
	 * @returns {CustomEvent<T>}
	 */
	function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
		return new CustomEvent(type, { detail, bubbles, cancelable });
	}

	/**
	 * @typedef {Node & {
	 * 	claim_order?: number;
	 * 	hydrate_init?: true;
	 * 	actual_end_child?: NodeEx;
	 * 	childNodes: NodeListOf<NodeEx>;
	 * }} NodeEx
	 */

	/** @typedef {ChildNode & NodeEx} ChildNodeEx */

	/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

	/**
	 * @typedef {ChildNodeEx[] & {
	 * 	claim_info?: {
	 * 		last_index: number;
	 * 		total_claimed: number;
	 * 	};
	 * }} ChildNodeArray
	 */

	let current_component;

	/** @returns {void} */
	function set_current_component(component) {
		current_component = component;
	}

	function get_current_component() {
		if (!current_component) throw new Error('Function called outside component initialization');
		return current_component;
	}

	/**
	 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
	 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
	 * it can be called from an external module).
	 *
	 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
	 *
	 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
	 *
	 * https://svelte.dev/docs/svelte#onmount
	 * @template T
	 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
	 * @returns {void}
	 */
	function onMount(fn) {
		get_current_component().$$.on_mount.push(fn);
	}

	/**
	 * Schedules a callback to run immediately before the component is unmounted.
	 *
	 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
	 * only one that runs inside a server-side component.
	 *
	 * https://svelte.dev/docs/svelte#ondestroy
	 * @param {() => any} fn
	 * @returns {void}
	 */
	function onDestroy(fn) {
		get_current_component().$$.on_destroy.push(fn);
	}

	/**
	 * Creates an event dispatcher that can be used to dispatch [component events](https://svelte.dev/docs#template-syntax-component-directives-on-eventname).
	 * Event dispatchers are functions that can take two arguments: `name` and `detail`.
	 *
	 * Component events created with `createEventDispatcher` create a
	 * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
	 * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
	 * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
	 * property and can contain any type of data.
	 *
	 * The event dispatcher can be typed to narrow the allowed event names and the type of the `detail` argument:
	 * ```ts
	 * const dispatch = createEventDispatcher<{
	 *  loaded: never; // does not take a detail argument
	 *  change: string; // takes a detail argument of type string, which is required
	 *  optional: number | null; // takes an optional detail argument of type number
	 * }>();
	 * ```
	 *
	 * https://svelte.dev/docs/svelte#createeventdispatcher
	 * @template {Record<string, any>} [EventMap=any]
	 * @returns {import('./public.js').EventDispatcher<EventMap>}
	 */
	function createEventDispatcher() {
		const component = get_current_component();
		return (type, detail, { cancelable = false } = {}) => {
			const callbacks = component.$$.callbacks[type];
			if (callbacks) {
				// TODO are there situations where events could be dispatched
				// in a server (non-DOM) environment?
				const event = custom_event(/** @type {string} */ (type), detail, { cancelable });
				callbacks.slice().forEach((fn) => {
					fn.call(component, event);
				});
				return !event.defaultPrevented;
			}
			return true;
		};
	}

	// TODO figure out if we still want to support
	// shorthand events, or if we want to implement
	// a real bubbling mechanism
	/**
	 * @param component
	 * @param event
	 * @returns {void}
	 */
	function bubble(component, event) {
		const callbacks = component.$$.callbacks[event.type];
		if (callbacks) {
			// @ts-ignore
			callbacks.slice().forEach((fn) => fn.call(this, event));
		}
	}

	const dirty_components = [];
	const binding_callbacks = [];

	let render_callbacks = [];

	const flush_callbacks = [];

	const resolved_promise = /* @__PURE__ */ Promise.resolve();

	let update_scheduled = false;

	/** @returns {void} */
	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	/** @returns {void} */
	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	// flush() calls callbacks in this order:
	// 1. All beforeUpdate callbacks, in order: parents before children
	// 2. All bind:this callbacks, in reverse order: children before parents.
	// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
	//    for afterUpdates called during the initial onMount, which are called in
	//    reverse order: children before parents.
	// Since callbacks might update component values, which could trigger another
	// call to flush(), the following steps guard against this:
	// 1. During beforeUpdate, any updated components will be added to the
	//    dirty_components array and will cause a reentrant call to flush(). Because
	//    the flush index is kept outside the function, the reentrant call will pick
	//    up where the earlier call left off and go through all dirty components. The
	//    current_component value is saved and restored so that the reentrant call will
	//    not interfere with the "parent" flush() call.
	// 2. bind:this callbacks cannot trigger new flush() calls.
	// 3. During afterUpdate, any updated components will NOT have their afterUpdate
	//    callback called a second time; the seen_callbacks set, outside the flush()
	//    function, guarantees this behavior.
	const seen_callbacks = new Set();

	let flushidx = 0; // Do *not* move this inside the flush() function

	/** @returns {void} */
	function flush() {
		// Do not reenter flush while dirty components are updated, as this can
		// result in an infinite loop. Instead, let the inner flush handle it.
		// Reentrancy is ok afterwards for bindings etc.
		if (flushidx !== 0) {
			return;
		}
		const saved_component = current_component;
		do {
			// first, call beforeUpdate functions
			// and update components
			try {
				while (flushidx < dirty_components.length) {
					const component = dirty_components[flushidx];
					flushidx++;
					set_current_component(component);
					update(component.$$);
				}
			} catch (e) {
				// reset dirty state to not end up in a deadlocked state and then rethrow
				dirty_components.length = 0;
				flushidx = 0;
				throw e;
			}
			set_current_component(null);
			dirty_components.length = 0;
			flushidx = 0;
			while (binding_callbacks.length) binding_callbacks.pop()();
			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			for (let i = 0; i < render_callbacks.length; i += 1) {
				const callback = render_callbacks[i];
				if (!seen_callbacks.has(callback)) {
					// ...so guard against infinite loops
					seen_callbacks.add(callback);
					callback();
				}
			}
			render_callbacks.length = 0;
		} while (dirty_components.length);
		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}
		update_scheduled = false;
		seen_callbacks.clear();
		set_current_component(saved_component);
	}

	/** @returns {void} */
	function update($$) {
		if ($$.fragment !== null) {
			$$.update();
			run_all($$.before_update);
			const dirty = $$.dirty;
			$$.dirty = [-1];
			$$.fragment && $$.fragment.p($$.ctx, dirty);
			$$.after_update.forEach(add_render_callback);
		}
	}

	/**
	 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function flush_render_callbacks(fns) {
		const filtered = [];
		const targets = [];
		render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
		targets.forEach((c) => c());
		render_callbacks = filtered;
	}

	const outroing = new Set();

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} [local]
	 * @returns {void}
	 */
	function transition_in(block, local) {
		if (block && block.i) {
			outroing.delete(block);
			block.i(local);
		}
	}

	/** @typedef {1} INTRO */
	/** @typedef {0} OUTRO */
	/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
	/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

	/**
	 * @typedef {Object} Outro
	 * @property {number} r
	 * @property {Function[]} c
	 * @property {Object} p
	 */

	/**
	 * @typedef {Object} PendingProgram
	 * @property {number} start
	 * @property {INTRO|OUTRO} b
	 * @property {Outro} [group]
	 */

	/**
	 * @typedef {Object} Program
	 * @property {number} a
	 * @property {INTRO|OUTRO} b
	 * @property {1|-1} d
	 * @property {number} duration
	 * @property {number} start
	 * @property {number} end
	 * @property {Outro} [group]
	 */

	/** @returns {void} */
	function mount_component(component, target, anchor) {
		const { fragment, after_update } = component.$$;
		fragment && fragment.m(target, anchor);
		// onMount happens before the initial afterUpdate
		add_render_callback(() => {
			const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
			// if the component was destroyed immediately
			// it will update the `$$.on_destroy` reference to `null`.
			// the destructured on_destroy may still reference to the old array
			if (component.$$.on_destroy) {
				component.$$.on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});
		after_update.forEach(add_render_callback);
	}

	/** @returns {void} */
	function destroy_component(component, detaching) {
		const $$ = component.$$;
		if ($$.fragment !== null) {
			flush_render_callbacks($$.after_update);
			run_all($$.on_destroy);
			$$.fragment && $$.fragment.d(detaching);
			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			$$.on_destroy = $$.fragment = null;
			$$.ctx = [];
		}
	}

	/** @returns {void} */
	function make_dirty(component, i) {
		if (component.$$.dirty[0] === -1) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty.fill(0);
		}
		component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
	}

	// TODO: Document the other params
	/**
	 * @param {SvelteComponent} component
	 * @param {import('./public.js').ComponentConstructorOptions} options
	 *
	 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
	 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
	 * This will be the `add_css` function from the compiled component.
	 *
	 * @returns {void}
	 */
	function init(
		component,
		options,
		instance,
		create_fragment,
		not_equal,
		props,
		append_styles = null,
		dirty = [-1]
	) {
		const parent_component = current_component;
		set_current_component(component);
		/** @type {import('./private.js').T$$} */
		const $$ = (component.$$ = {
			fragment: null,
			ctx: [],
			// state
			props,
			update: noop,
			not_equal,
			bound: blank_object(),
			// lifecycle
			on_mount: [],
			on_destroy: [],
			on_disconnect: [],
			before_update: [],
			after_update: [],
			context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
			// everything else
			callbacks: blank_object(),
			dirty,
			skip_bound: false,
			root: options.target || parent_component.$$.root
		});
		append_styles && append_styles($$.root);
		let ready = false;
		$$.ctx = instance
			? instance(component, options.props || {}, (i, ret, ...rest) => {
					const value = rest.length ? rest[0] : ret;
					if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
						if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
						if (ready) make_dirty(component, i);
					}
					return ret;
			  })
			: [];
		$$.update();
		ready = true;
		run_all($$.before_update);
		// `false` as a special case of no DOM component
		$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
		if (options.target) {
			if (options.hydrate) {
				// TODO: what is the correct type here?
				// @ts-expect-error
				const nodes = children(options.target);
				$$.fragment && $$.fragment.l(nodes);
				nodes.forEach(detach);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.c();
			}
			if (options.intro) transition_in(component.$$.fragment);
			mount_component(component, options.target, options.anchor);
			flush();
		}
		set_current_component(parent_component);
	}

	/**
	 * Base class for Svelte components. Used when dev=false.
	 *
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 */
	class SvelteComponent {
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$ = undefined;
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$set = undefined;

		/** @returns {void} */
		$destroy() {
			destroy_component(this, 1);
			this.$destroy = noop;
		}

		/**
		 * @template {Extract<keyof Events, string>} K
		 * @param {K} type
		 * @param {((e: Events[K]) => void) | null | undefined} callback
		 * @returns {() => void}
		 */
		$on(type, callback) {
			if (!is_function(callback)) {
				return noop;
			}
			const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
			callbacks.push(callback);
			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		/**
		 * @param {Partial<Props>} props
		 * @returns {void}
		 */
		$set(props) {
			if (this.$$set && !is_empty(props)) {
				this.$$.skip_bound = true;
				this.$$set(props);
				this.$$.skip_bound = false;
			}
		}
	}

	/**
	 * @typedef {Object} CustomElementPropDefinition
	 * @property {string} [attribute]
	 * @property {boolean} [reflect]
	 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
	 */

	// generated during release, do not modify

	const PUBLIC_VERSION = '4';

	if (typeof window !== 'undefined')
		// @ts-ignore
		(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

	/* src\hud.svelte generated by Svelte v4.2.20 */

	function add_css(target) {
		append_styles(target, "svelte-1l69rmg", ".hud.svelte-1l69rmg.svelte-1l69rmg{position:absolute;width:300px;height:200px;z-index:999999999999;background-color:rgba(0, 0, 0, 0.9);border-radius:0.5em;display:flex;flex-direction:column;justify-content:space-evenly;align-items:center;color:white;touch-action:none;user-select:none}.hud.svelte-1l69rmg .row.svelte-1l69rmg{display:flex;flex-direction:row;justify-content:space-between;align-items:space-between;width:100%}.hud.svelte-1l69rmg .answer.svelte-1l69rmg{width:70%;height:50px;font-family:Verdana, Geneva, Tahoma, sans-serif;font-size:1em;border-radius:0.5em;background-color:white;color:black;border:none;transition:transform 0.3s ease}.hud.svelte-1l69rmg .answer.svelte-1l69rmg:active{transform:scale(0.93)}.hud.svelte-1l69rmg .help.svelte-1l69rmg{display:flex;flex-direction:column;align-items:center;width:85%}.hud.svelte-1l69rmg .helpControl button.svelte-1l69rmg{width:25px;height:25px;border-radius:0.5em;background-color:white;border:none;transition:transform 0.3s ease;margin:5px;color:black}");
	}

	// (132:4) {#if visible}
	function create_if_block(ctx) {
		let div4;
		let button0;
		let t1;
		let div3;
		let div0;
		let t3;
		let div2;
		let button1;
		let t5;
		let div1;
		let t6_value = /*helpModes*/ ctx[4][/*helpMode*/ ctx[1]] + "";
		let t6;
		let t7;
		let button2;
		let mounted;
		let dispose;

		return {
			c() {
				div4 = element("div");
				button0 = element("button");
				button0.textContent = "Answer Question";
				t1 = space();
				div3 = element("div");
				div0 = element("div");
				div0.textContent = "Help Mode";
				t3 = space();
				div2 = element("div");
				button1 = element("button");
				button1.textContent = "<";
				t5 = space();
				div1 = element("div");
				t6 = text(t6_value);
				t7 = space();
				button2 = element("button");
				button2.textContent = ">";
				attr(button0, "class", "answer svelte-1l69rmg");
				attr(button1, "class", "svelte-1l69rmg");
				attr(div1, "class", "display");
				attr(button2, "class", "svelte-1l69rmg");
				attr(div2, "class", "row helpControl svelte-1l69rmg");
				attr(div3, "class", "help svelte-1l69rmg");
				attr(div4, "class", "hud svelte-1l69rmg");
				set_style(div4, "left", /*x*/ ctx[2] + "px");
				set_style(div4, "top", /*y*/ ctx[3] + "px");
				attr(div4, "role", "button");
				attr(div4, "tabindex", "0");
			},
			m(target, anchor) {
				insert(target, div4, anchor);
				append(div4, button0);
				append(div4, t1);
				append(div4, div3);
				append(div3, div0);
				append(div3, t3);
				append(div3, div2);
				append(div2, button1);
				append(div2, t5);
				append(div2, div1);
				append(div1, t6);
				append(div2, t7);
				append(div2, button2);

				if (!mounted) {
					dispose = [
						listen(button0, "touchstart", stop_propagation(/*touchstart_handler*/ ctx[15])),
						listen(button0, "click", /*handleAnswer*/ ctx[9]),
						listen(button1, "touchstart", stop_propagation(/*touchstart_handler_1*/ ctx[14])),
						listen(button1, "click", /*click_handler*/ ctx[16]),
						listen(button2, "touchstart", stop_propagation(/*touchstart_handler_2*/ ctx[13])),
						listen(button2, "click", /*click_handler_1*/ ctx[17]),
						listen(div4, "mousedown", /*handleStart*/ ctx[5]),
						listen(div4, "touchstart", prevent_default(/*handleStart*/ ctx[5]))
					];

					mounted = true;
				}
			},
			p(ctx, dirty) {
				if (dirty & /*helpMode*/ 2 && t6_value !== (t6_value = /*helpModes*/ ctx[4][/*helpMode*/ ctx[1]] + "")) set_data(t6, t6_value);

				if (dirty & /*x*/ 4) {
					set_style(div4, "left", /*x*/ ctx[2] + "px");
				}

				if (dirty & /*y*/ 8) {
					set_style(div4, "top", /*y*/ ctx[3] + "px");
				}
			},
			d(detaching) {
				if (detaching) {
					detach(div4);
				}

				mounted = false;
				run_all(dispose);
			}
		};
	}

	function create_fragment(ctx) {
		let section;
		let mounted;
		let dispose;
		let if_block = /*visible*/ ctx[0] && create_if_block(ctx);

		return {
			c() {
				section = element("section");
				if (if_block) if_block.c();
			},
			m(target, anchor) {
				insert(target, section, anchor);
				if (if_block) if_block.m(section, null);

				if (!mounted) {
					dispose = [
						listen(window, "keydown", /*onKeyDown*/ ctx[10]),
						listen(window, "mousemove", /*handleMove*/ ctx[6]),
						listen(window, "mouseup", /*handleEnd*/ ctx[7]),
						listen(window, "touchmove", prevent_default(/*handleMove*/ ctx[6])),
						listen(window, "touchend", /*handleEnd*/ ctx[7])
					];

					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				if (/*visible*/ ctx[0]) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block(ctx);
						if_block.c();
						if_block.m(section, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) {
					detach(section);
				}

				if (if_block) if_block.d();
				mounted = false;
				run_all(dispose);
			}
		};
	}

	const TAP_DELAY = 300; // ms between taps
	const RESET_DELAY = 400; // ms to reset tap count

	function instance($$self, $$props, $$invalidate) {
		let { onanswer = undefined } = $$props;
		let { onhelpMode = undefined } = $$props;
		let visible = true;

		const helpModes = [
			'None',
			'Auto Answer (instant)',
			'Auto Answer (wait)',
			'Outline Correct Answer'
		];

		let helpMode = 0;
		let lastHelpMode = 0;
		let tapCount = 0;
		let lastTapTime = 0;
		let tapTimeout = null;
		let x = 10;
		let y = 10;
		let isDragging = false;
		let startX;
		let startY;

		function handleTouchEnd(e) {
			const now = Date.now();
			const timeSinceLastTap = now - lastTapTime;

			if (tapTimeout) {
				clearTimeout(tapTimeout);
			}

			if (timeSinceLastTap < TAP_DELAY) {
				tapCount++;
			} else {
				tapCount = 1;
			}

			lastTapTime = now;

			if (tapCount === 3) {
				multiTouchHandler();
				tapCount = 0;
				lastTapTime = 0;
			} else {
				tapTimeout = setTimeout(
					() => {
						tapCount = 0;
					},
					RESET_DELAY
				);
			}
		}

		onMount(() => {
			document.addEventListener('touchend', handleTouchEnd);
		});

		onDestroy(() => {
			document.removeEventListener('touchend', handleTouchEnd);

			if (tapTimeout) {
				clearTimeout(tapTimeout);
			}
		});

		function handleStart(event) {
			isDragging = true;

			const clientX = event.type === 'mousedown'
			? event.clientX
			: event.touches[0].clientX;

			const clientY = event.type === 'mousedown'
			? event.clientY
			: event.touches[0].clientY;

			startX = clientX - x;
			startY = clientY - y;
		}

		function handleMove(event) {
			if (!isDragging) return;
			event.preventDefault();

			const clientX = event.type === 'mousemove'
			? event.clientX
			: event.touches[0].clientX;

			const clientY = event.type === 'mousemove'
			? event.clientY
			: event.touches[0].clientY;

			$$invalidate(2, x = clientX - startX);
			$$invalidate(3, y = clientY - startY);
		}

		function handleEnd() {
			isDragging = false;
		}

		let dispatch = createEventDispatcher();

		function changeHelpMode(change) {
			$$invalidate(1, helpMode += change);
			if (helpMode < 0) $$invalidate(1, helpMode += helpModes.length);
			$$invalidate(1, helpMode %= helpModes.length);
			dispatch('helpMode', helpMode);
			onhelpMode?.(new CustomEvent('helpMode', { detail: helpMode }));
		}

		function handleAnswer() {
			dispatch('answer');
			onanswer?.();
		}

		function onKeyDown(event) {
			if (event.key !== '\\') return;

			if (visible == true) {
				lastHelpMode = helpMode;
				$$invalidate(1, helpMode = 0);
			} else {
				$$invalidate(1, helpMode = lastHelpMode);
			}

			dispatch('helpMode', helpMode);
			$$invalidate(0, visible = !visible);
		}

		function multiTouchHandler() {
			if (visible == true) {
				lastHelpMode = helpMode;
				$$invalidate(1, helpMode = 0);
			} else {
				$$invalidate(1, helpMode = lastHelpMode);
			}

			dispatch('helpMode', helpMode);
			$$invalidate(0, visible = !visible);
		}

		function touchstart_handler_2(event) {
			bubble.call(this, $$self, event);
		}

		function touchstart_handler_1(event) {
			bubble.call(this, $$self, event);
		}

		function touchstart_handler(event) {
			bubble.call(this, $$self, event);
		}

		const click_handler = () => changeHelpMode(-1);
		const click_handler_1 = () => changeHelpMode(1);

		$$self.$$set = $$props => {
			if ('onanswer' in $$props) $$invalidate(11, onanswer = $$props.onanswer);
			if ('onhelpMode' in $$props) $$invalidate(12, onhelpMode = $$props.onhelpMode);
		};

		return [
			visible,
			helpMode,
			x,
			y,
			helpModes,
			handleStart,
			handleMove,
			handleEnd,
			changeHelpMode,
			handleAnswer,
			onKeyDown,
			onanswer,
			onhelpMode,
			touchstart_handler_2,
			touchstart_handler_1,
			touchstart_handler,
			click_handler,
			click_handler_1
		];
	}

	class Hud extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance, create_fragment, safe_not_equal, { onanswer: 11, onhelpMode: 12 }, add_css);
		}
	}

	var HelpModes;
	(function (HelpModes) {
	    HelpModes[HelpModes["None"] = 0] = "None";
	    HelpModes[HelpModes["AnswerInstant"] = 1] = "AnswerInstant";
	    HelpModes[HelpModes["AnswerDelayed"] = 2] = "AnswerDelayed";
	    HelpModes[HelpModes["Highlight"] = 3] = "Highlight";
	})(HelpModes || (HelpModes = {}));
	const cardSelector = "#__next > div > div:nth-child(3) > div > div:nth-child(2) > div";
	let messageCount = 0;
	let socket = null;
	let helpMode = 0;
	let cards = [];
	window.addEventListener('DOMContentLoaded', () => {
	    new Hud({
	        target: document.body,
	        props: {
	            onanswer: () => {
	                answer();
	            },
	            onhelpMode: (event) => {
	                helpMode = event.detail;
	                if (helpMode === HelpModes.Highlight) {
	                    setCardBorders();
	                }
	                else {
	                    document.querySelectorAll(cardSelector).forEach(card => {
	                        card.style.border = "";
	                    });
	                }
	            }
	        }
	    });
	});
	class NewWebSocket extends WebSocket {
	    constructor(url, protocols) {
	        super(url, protocols);
	        socket = this;
	        this.addEventListener('message', (event) => {
	            const data = event.data.toString();
	            if (!data.startsWith("42"))
	                return;
	            const message = data.substring(data.indexOf('['));
	            const messageObj = JSON.parse(message);
	            console.log("recieved", messageObj);
	            onMessage(messageObj[0], messageObj[1]);
	        });
	    }
	    send(data) {
	        let str = data.toString();
	        if (!str.startsWith("42"))
	            return super.send(data);
	        let message = str.substring(Math.min(str.indexOf('['), str.indexOf('{')));
	        const newMsg = `42${messageCount}${message}`;
	        super.send(newMsg);
	        messageCount++;
	    }
	}
	// override the WebSocket class
	unsafeWindow.WebSocket = NewWebSocket;
	function send(data) {
	    if (socket === null)
	        return;
	    const message = `42${messageCount}${JSON.stringify(data)}`;
	    socket.send(message);
	    messageCount++;
	}
	let streak;
	let streakNum = 0;
	let roundNum = 0;
	let cardAssignments = [];
	function checkAnswer() {
	    if (helpMode === HelpModes.AnswerInstant)
	        answer();
	    else if (helpMode === HelpModes.AnswerDelayed)
	        setTimeout(answer, 1900);
	}
	function onMessage(type, data) {
	    let playerId = getPlayerId();
	    switch (type) {
	        case "current-game-state-and-set":
	        case "current-game-state":
	            onGameState(data);
	            break;
	        case "matchteam.new-answer":
	            roundNum = data.roundNum + 1;
	            streakNum = data.streakNum;
	            cardAssignments = data.cardAssignments[playerId];
	            checkAnswer();
	            break;
	        case "matchteam.new-streak":
	            streak = data.streak;
	            streakNum++;
	            roundNum = 0;
	            cardAssignments = data.streak.cardAssignments[playerId];
	            checkAnswer();
	            break;
	    }
	}
	function onGameState(state) {
	    let playerId = getPlayerId();
	    if (!playerId)
	        return;
	    let team = Object.values(state.teams).find(team => team.playerIds.includes(playerId));
	    if (!team)
	        return;
	    streakNum = team.streak.length - 1;
	    streak = team.streak[streakNum];
	    if (!streak)
	        return;
	    cardAssignments = streak.cardAssignments[playerId];
	    roundNum = streak.answers.length;
	}
	function answer() {
	    let cardId = streak?.prompts?.[roundNum]?.cardId;
	    if (!cardId)
	        return;
	    if (!cardAssignments.includes(cardId))
	        return;
	    send(["gamehub.matchteam.submit-answer", {
	            playerId: getPlayerId(),
	            cardId,
	            roundNum,
	            streakNum
	        }]);
	}
	function setCardBorders() {
	    let correctId = streak?.prompts?.[roundNum]?.cardId;
	    if (!correctId)
	        return;
	    let correctIndex = cardAssignments.indexOf(correctId);
	    cards.forEach((card, index) => {
	        if (index === correctIndex) {
	            card.style.border = "2px solid green";
	        }
	        else {
	            card.style.border = "2px solid red";
	        }
	    });
	}
	// @ts-ignore
	unsafeWindow.answer = answer;
	const cardObserver = new MutationObserver((mutations) => {
	    for (let mutation of mutations) {
	        if (mutation.type !== "childList")
	            continue;
	        for (let i = 0; i < mutation.addedNodes.length; i++) {
	            const node = mutation.addedNodes[i];
	            if (!(node instanceof HTMLElement))
	                continue;
	            let foundCards;
	            if (node.matches(cardSelector)) {
	                foundCards = document.querySelectorAll(cardSelector);
	            }
	            else {
	                foundCards = node.querySelectorAll(cardSelector);
	            }
	            if (foundCards.length === 0)
	                continue;
	            cards = Array.from(foundCards);
	            if (helpMode === HelpModes.Highlight) {
	                setCardBorders();
	            }
	        }
	    }
	});
	window.addEventListener('DOMContentLoaded', () => {
	    cardObserver.observe(document.body, {
	        childList: true,
	        subtree: true
	    });
	});
	let uid;
	function getPlayerId() {
	    if (uid)
	        return uid;
	    let script = document.getElementById("__NEXT_DATA__");
	    let data = JSON.parse(script.textContent);
	    uid = data.props.pageProps.userId || data.props.pageProps.personId;
	    return uid;
	}

})();
