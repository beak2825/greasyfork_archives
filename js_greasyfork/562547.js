// ==UserScript==
// @name           ChatGPT 代码高亮 + Mermaid 渲染
// @name:en        ChatGPT Code Highlight + Mermaid
// @name:zh-CN     ChatGPT 代码高亮 + Mermaid 渲染
// @namespace      yooyi
// @match          *://chatgpt.com/*
// @grant          GM_addStyle
// @run-at         document-idle
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/1c.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/abnf.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/accesslog.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/actionscript.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/ada.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/angelscript.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/apache.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/applescript.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/arcade.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/arduino.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/armasm.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/asciidoc.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/aspectj.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/autohotkey.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/autoit.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/avrasm.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/awk.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/axapta.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/bash.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/basic.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/bnf.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/brainfuck.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/c.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/cal.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/capnproto.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/ceylon.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/clean.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/clojure.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/clojure-repl.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/cmake.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/coffeescript.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/coq.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/cos.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/cpp.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/crmsh.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/crystal.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/csharp.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/csp.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/css.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/d.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/dart.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/delphi.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/diff.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/django.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/dns.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/dockerfile.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/dos.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/dsconfig.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/dts.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/dust.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/ebnf.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/elixir.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/elm.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/erb.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/erlang.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/erlang-repl.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/excel.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/fix.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/flix.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/fortran.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/fsharp.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/gams.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/gauss.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/gcode.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/gherkin.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/glsl.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/gml.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/go.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/golo.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/gradle.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/graphql.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/groovy.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/haml.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/handlebars.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/haskell.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/haxe.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/hsp.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/http.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/hy.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/inform7.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/ini.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/irpf90.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/isbl.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/java.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/javascript.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/jboss-cli.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/json.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/julia.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/julia-repl.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/kotlin.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/lasso.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/latex.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/ldif.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/leaf.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/less.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/lisp.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/livecodeserver.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/livescript.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/llvm.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/lsl.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/lua.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/makefile.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/markdown.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/mathematica.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/matlab.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/maxima.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/mel.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/mercury.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/mipsasm.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/mizar.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/mojolicious.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/monkey.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/moonscript.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/n1ql.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/nestedtext.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/nginx.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/nim.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/nix.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/node-repl.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/nsis.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/objectivec.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/ocaml.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/openscad.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/oxygene.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/parser3.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/perl.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/pf.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/pgsql.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/php.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/php-template.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/plaintext.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/pony.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/powershell.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/processing.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/profile.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/prolog.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/properties.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/protobuf.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/puppet.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/purebasic.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/python.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/python-repl.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/q.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/qml.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/r.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/reasonml.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/rib.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/roboconf.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/routeros.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/rsl.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/ruby.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/ruleslanguage.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/rust.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/sas.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/scala.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/scheme.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/scilab.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/scss.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/shell.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/smali.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/smalltalk.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/sml.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/sqf.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/sql.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/stan.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/stata.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/step21.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/stylus.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/subunit.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/swift.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/taggerscript.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/tap.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/tcl.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/thrift.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/tp.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/twig.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/typescript.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/vala.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/vbnet.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/vbscript.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/vbscript-html.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/verilog.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/vhdl.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/vim.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/wasm.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/wren.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/x86asm.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/xl.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/xml.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/xquery.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/yaml.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/zephir.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.9.1/mermaid.min.js
// @version        3.0.6
// @author         yooyi
// @license        MIT
// @description:en 为 ChatGPT 添加代码高亮（使用 highlight.js）和 Mermaid 图表渲染
// @description    为 ChatGPT 添加代码高亮（使用 highlight.js）和 Mermaid 图表渲染
// @downloadURL https://update.greasyfork.org/scripts/562547/ChatGPT%20%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE%20%2B%20Mermaid%20%E6%B8%B2%E6%9F%93.user.js
// @updateURL https://update.greasyfork.org/scripts/562547/ChatGPT%20%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE%20%2B%20Mermaid%20%E6%B8%B2%E6%9F%93.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 检查依赖是否已加载
    if (typeof hljs === 'undefined') {
        console.error('highlight.js 未加载');
    }
    if (typeof mermaid === 'undefined') {
        console.error('mermaid 未加载');
        return;
    }

    // 初始化 Mermaid
    mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
    });

    console.log('ChatGPT 代码高亮 + Mermaid 渲染器已启动');

    const processedBlocks = new WeakSet();

    // 判断是否为 mermaid 代码块
    function isMermaidBlock(codeElement) {
        const className = codeElement.className || '';
        return className.includes('language-mermaid') || className.includes('mermaid');
    }

    // 渲染 Mermaid 代码块
    async function renderMermaidBlock(codeElement) {
        if (processedBlocks.has(codeElement)) return;

        const code = codeElement.textContent.trim();
        if (!code) {
            processedBlocks.add(codeElement);
            return;
        }

        const container = codeElement.closest('.overflow-y-auto');
        if (!container) {
            processedBlocks.add(codeElement);
            return;
        }

        try {
            // 先验证语法，避免渲染错误时显示错误信息
            const isValid = await mermaid.parse(code, { suppressErrors: true });
            if (!isValid) {
                console.error('Mermaid 语法错误:', code.substring(0, 100) + '...');
                processedBlocks.add(codeElement);
                return;
            }

            const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const { svg } = await mermaid.render(id, code);

            const renderContainer = document.createElement('div');
            renderContainer.className = 'mermaid-render-container';
            renderContainer.style.cssText = `
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 14px;
                overflow-x: auto;
            `;

            // 修改 SVG 样式，控制字体大小
            const styledSvg = svg.replace(
                /<svg([^>]*)>/,
                '<svg$1 style="font-size: 13px; max-width: 100%;">'
            ).replace(
                /font-size:\s*(\d+(?:\.\d+)?)(px|pt|em)?/gi,
                'font-size: 14px'
            );

            renderContainer.innerHTML = styledSvg;

            container.innerHTML = '';
            container.appendChild(renderContainer);

            processedBlocks.add(codeElement);
        } catch (error) {
            console.error('Mermaid 渲染失败:', error);
            // 渲染失败时也要标记，避免重复尝试
            processedBlocks.add(codeElement);
        }
    }

    // 高亮代码块
    function highlightBlock(codeElement) {
        if (codeElement.dataset.highlighted) return;

        // 跳过 mermaid 代码块
        if (isMermaidBlock(codeElement)) {
            renderMermaidBlock(codeElement);
            return;
        }

        const languageMatch = codeElement.className.match(/language-(\w+)/);
        if (languageMatch && codeElement.children.length > 0) {
            hljs.highlightElement(codeElement.children[0]);
            codeElement.dataset.highlighted = 'true';
        }
    }

    // 处理单个 markdown 块
    function processMarkdownBlock(markdownBlock) {
        if (markdownBlock.dataset.codeProcessed) {
            return;
        }

        const codeBlocks = markdownBlock.querySelectorAll('code');

        // 检查是否包含 mermaid 代码块
        const hasMermaid = Array.from(codeBlocks).some(isMermaidBlock);

        if (hasMermaid) {
            // 处理 mermaid 代码块
            codeBlocks.forEach((codeBlock) => {
                if (isMermaidBlock(codeBlock) && codeBlock.offsetParent !== null) {
                    renderMermaidBlock(codeBlock);
                }
            });
        } else {
            // 处理普通代码高亮
            if (markdownBlock.className.includes('streaming-animation')) {
                const preBlocks = markdownBlock.querySelectorAll('pre');
                preBlocks.forEach((preBlock) => {
                    if (preBlock.nextElementSibling) {
                        preBlock.querySelectorAll('code').forEach(highlightBlock);
                    }
                });
            } else {
                codeBlocks.forEach(highlightBlock);
                markdownBlock.dataset.codeProcessed = 'true';
            }
        }
    }

    // 使用 MutationObserver 监听 DOM 变化
    let scanTimer = null;

    // 检查是否正在流式输出
    function isStreaming(codeBlock) {
        // 检查代码块或其父元素是否包含 streaming 相关的 class
        const markdownBlock = codeBlock.closest('.markdown');
        return markdownBlock && markdownBlock.className.includes('streaming-animation');
    }

    const scheduleScan = () => {
        clearTimeout(scanTimer);
        scanTimer = setTimeout(() => {
            // 扫描所有 mermaid 代码块
            document.querySelectorAll('code.language-mermaid, code[class*="mermaid"]').forEach((codeBlock) => {
                // 检查是否已渲染
                const container = codeBlock.closest('.overflow-y-auto') || codeBlock.closest('pre');
                const hasRendered = container && container.querySelector('.mermaid-render-container');

                // 跳过正在流式输出的
                if (isStreaming(codeBlock)) return;

                if (codeBlock.offsetParent !== null && !hasRendered) {
                    renderMermaidBlock(codeBlock);
                }
            });

            // 处理普通代码高亮
            document.querySelectorAll('.markdown').forEach((markdownBlock) => {
                if (!markdownBlock.dataset.codeProcessed) {
                    const codeBlocks = markdownBlock.querySelectorAll('code');
                    const hasMermaid = Array.from(codeBlocks).some(isMermaidBlock);
                    if (!hasMermaid) {
                        codeBlocks.forEach(highlightBlock);
                        markdownBlock.dataset.codeProcessed = 'true';
                    }
                }
            });
        }, 300);
    };

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // 触发扫描调度
                    scheduleScan();
                    return;
                }
            }
        }
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // 初始处理已存在的元素
    document.querySelectorAll('.markdown').forEach(processMarkdownBlock);
    // 处理已存在的 mermaid 代码块（可能不在 .markdown 中）
    document.querySelectorAll('code.language-mermaid, code[class*="mermaid"]').forEach(renderMermaidBlock);

    // 监听 URL 变化（ChatGPT 是 SPA）
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // 页面切换后重新处理
            setTimeout(() => {
                document.querySelectorAll('.markdown').forEach(processMarkdownBlock);
                document.querySelectorAll('code.language-mermaid, code[class*="mermaid"]').forEach(renderMermaidBlock);
            }, 100);
        }
    });
    urlObserver.observe(document, { subtree: true, childList: true });

})();
