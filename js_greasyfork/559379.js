const console = {};
for (let name of ['log', 'debug', 'info', 'warn', 'error']) {
  console[name] = function (...args) {
    const prefix = `[${GM_info.script.name}]`;
    window.console[name](prefix, ...args);
  };
}
