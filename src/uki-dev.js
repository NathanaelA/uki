(function() {
    var global = this;
    function require(index) {
        if (!require_cache[index]) {
            var module = require_cache[index] = {
                exports: {}
            };
            require_modules[index].call(module.exports, global, module, require);
        }
        return require_cache[index].exports;
    }
    var require_modules = require.modules = [];
    var require_cache = require.cache = [];
    var __requiredCss = ".uki-textSelectable_off {-moz-user-select: -moz-none; -webkit-user-select: none; -o-user-select: none; user-select: none;}\n.uki-textSelectable_off::selection {background: transparent;}\n.uki-draggable_off {-webkit-user-drag: none;}\n\n.uki-attaching {font-size: 12px; font-family: Arial, Helvetica, sans-serif;}\n.uki-attaching-relative {position: relative;}\n.uki-hidden {display: none;}\n\n.uki-button {border: 1px solid #999; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-bottom-color: #777; border-radius: 3px; background: #D7DAE4 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAADwCAIAAAB5d1ZWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzFBNzRBRjgzMUMxMTFFMDk4MTVBMTVDMDE2MEQyRTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzFBNzRBRjkzMUMxMTFFMDk4MTVBMTVDMDE2MEQyRTMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4OTY5QTk2MTMxQzAxMUUwOTgxNUExNUMwMTYwRDJFMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4OTY5QTk2MjMxQzAxMUUwOTgxNUExNUMwMTYwRDJFMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PipBo48AAAKSSURBVHja7N1BTsMwEAXQOun9DwQbJJZcBLFD7KBpuMKfxSiy9eYIT3/Gdpw243ieN5XVHVUB60Yrx9KFBazjgFDAopW3oT4srIbnk0LehrAKbWhmFbAky2rYkixYktWDZcBLlpllU2pTamZJlh08LFiwJsI6T09K82QxiGtDAAvW5TOLl2TBggULFiwEsGDBgrVmDc+zCmdDWLB6sLyAW8GSLMlqwnJlIVmSJVnzYB2SVUjWIVmSZWZZDSVLsmBJVo7lqUOOdUqWZPUkC1ZcrsJgwYIFa9XV8DYgxFhjo5VjiZaZBQsWLFiwFCxYsGCtedx5f3ulEJ8Nh7NhjLVtOhEWrKux9p1CirVvsArJ0oZ5srShNpQsWLYOkiVZBnxlNbTPsintwBoDVmFmwYKlDa/G8jJbAcvLbJU2hBVjCVYFi1ZclsLagFdmlpllZsGCBUvBggULFixYKq3x+e0DtvHZ0B/3aMOuZEGIsXRhAevXP+DmWA+LYaENGVSShSvH8p+uOdYBy2rYgvVnNSwk6yFZhWTBshpaDc2siZLFSrLMrOtXQ8nKsezgDfgWLJ+SqWCxisu9ISxY188sPzeULFiwYMGChQAWLFiw1qzx9eNRaXw29M3tCpbXlXMsV2GlZEGIsdwbVrAshjmWXJlZXW1Iy9ahZzWEYOugDQ14W4c12xCWNtSGsGY6SMOSrI5yFQYLFixYsJRXuytYPo6iDWHBggULFgJYsGDBWvS48/H+QiE/GzocOkh3YO2+I51jbR5o5Vj3faeQY2lDbagNtaE2XDNZd22YJ8sW3szShtpwpoO0NpQsyboaS7BKWLTMLMkys6YpS6E2lCxYsOyzlGTBggULFiwFCxYsWDPVvwADALDE/Hh4isZ/AAAAAElFTkSuQmCC) repeat-x 0 0; white-space: nowrap; vertical-align: top; text-align: center; font-size: 12px; font-family: Arial, Helvetica, sans-serif; color: #111; padding: 0; height: 22px; text-shadow: rgba(255, 255, 255, 0.5) 0 1px 0px; position: relative; z-index: 10; outline: 0; _zoom: 1; _display: inline; -webkit-box-shadow: rgba(255, 255, 255, 0.3) 0px -1px 1px inset; -moz-box-shadow: rgba(255, 255, 255, 0.3) 0px -1px 1px inset; box-shadow: rgba(255, 255, 255, 0.3) 0px -1px 1px inset; *background-image: url(-view\\view\\button\\button.png);}\n.uki-button::-moz-focus-inner {padding: 0; border: 0;}\n.uki-button:hover {background-color: #F5F7FD; background-position: 0 -40px;}\n.uki-button:active {border-color: #666; background-color: #C5C7CD; background-position: 0 -80px; -webkit-box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 3px inset; -moz-box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 3px inset; box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 3px inset;}\n.uki-button__text {margin: 0 5px;}\n.uki-button:focus {border-color: #7594D2; -webkit-box-shadow: rgba(255, 255, 255, 0.3) 0px -1px 1px inset, #7594D2 0 0 3px; -moz-box-shadow: rgba(255, 255, 255, 0.3) 0px -1px 1px inset, #7594D2 0 0 3px; box-shadow: rgba(255, 255, 255, 0.3) 0px -1px 1px inset, #7594D2 0 0 3px;}\n.uki-button__icon {vertical-align: top; margin-top: -1px; margin-bottom: -1px;}\n.uki-button_disabled,\r\n.uki-button_disabled:active,\r\n.uki-button_disabled:hover {color: #999; background-color: #eee; background-image: none; -webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; border-color: #AAA;}\n.uki-button_disabled .uki-button__icon {opacity: 0.5;}\n.uki-button_image-only .uki-button__text {display: none;}\n.uki-button_confirm {background-position: 0 -120px; border-color: #999; border-bottom-color: #779;}\n.uki-button_confirm:hover {background-position: 0 -160px;}\n.uki-button_confirm:active {background-position: 0 -200px; border-color: #77A;}\n.uki-button_confirm.uki-button_disabled,\r\n.uki-button_confirm.uki-button_disabled:active,\r\n.uki-button_confirm.uki-button_disabled:hover {background-color: #EEEEFA; border-color: #AAC;}\n\n.uki-flow {display: block; padding: 0; margin: 0;}\n.uki-flow-item {display: block; padding: 0; margin: 0;}\n.uki-flow_horizontal:after {clear: both; content: '.'; display: block; height: 0px; line-height: 0; visibility: hidden;}\n.uki-flow_horizontal {*zoom: 1;}\n.uki-flow_horizontal > .uki-flow-item {float: left;}\n.uki-flow_spacing-small {margin: 0;}\n.uki-flow_spacing-small > .uki-flow-item {margin: 5px 0 0 0;}\n.uki-flow_spacing-medium > .uki-flow-item {margin: 10px 0 0 0;}\n.uki-flow_spacing-large > .uki-flow-item {margin: 20px 0 0 0;}\n.uki-flow .uki-flow-item:first-child {margin-top: 0;}\n.uki-flow_horizontal.uki-flow_spacing-small > .uki-flow-item {margin: 0 0 0 5px;}\n.uki-flow_horizontal.uki-flow_spacing-medium > .uki-flow-item {margin: 0 0 0 10px;}\n.uki-flow_horizontal.uki-flow_spacing-large > .uki-flow-item {margin: 0 0 0 20px;}\n.uki-flow_horizontal.uki-flow > .uki-flow-item:first-child {margin-left: 0;}\n\n.uki-nc-select {margin: 0;}\n.uki-nc-svg-wrapper {border: #000 solid thin; overflow: auto; display: inline-block; padding: 1px;}\n.uki-nc-svg {overflow: visible !important;}\n.uki-nc-text, .uki-nc-textarea {display: inline-block; *display: inline; *zoom: 1;}\n.uki-nc-text__input, .uki-nc-textarea__input {margin: 0; width: 100%; *width: auto; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box;}\n.uki-nc-text_with-placeholder, .uki-nc-textarea_with-placeholder {position: relative;}\n.uki-nc-text__placholder, .uki-nc-textarea__placholder {position: absolute; color: #888; opacity: 0.5; pointer-events: none;}\n\n.uki-text-p {line-height: 1.3; margin: 0 0 1em 0;}\n.uki-header {margin: 0 0 5px 0; font-weight: normal;}\n.uki-header_size_large {font-size: 18px;}\n.uki-header_size_medium {font-size: 15px;}\n.uki-header_size_small {font-size: 12px; font-weight: bold;}\n\n.uki-menu-horizontal {list-style: none; padding: 0; margin: 0; -webkit-user-drag: none;}\n.uki-menu-horizontal li {color: black; background-color: white; position: relative;}\n.uki-menu-horizontal li ul {z-index: 500; position: absolute; left: 0; width: 10em;}\n.uki-menu-horizontal ul {padding: 0; margin: 0px -1px; list-style: none; border: 1px solid black; background-color: white;}\n.uki-menu-horizontal > li {position: relative; float: left; text-align: left;}\n.uki-menu-horizontal a {display: block; padding: 0px 4px; color: black; text-decoration: none;}\n.uki-menu-horizontal-no-touch :hover > a {background-color: black; color: white;}\n.uki-menu-horizontal-no-touch :focus > a, a.uki-menu-focus, .uki-menu-focus {background-color: black; color: #FFFFFF;}\n.uki-menu-horizontal ul {display: none;}\n.uki-menu-horizontal ul.uki-menu-visible {display: block;}\n.uki-menu-horizontal-no-touch :hover > ul {display: block;}\n.uki-menu-horizontal ul ul {position: absolute; top: 0px; left: 10em;}\n.uki-menu-horizontal .uki-menu-submenu {background: url(data:image/gif;base64,R0lGODlhBwARALMAAAAAAP8AAP///////////////////////////////////////////////////////yH5BAEAAAEALAAAAAAHABEAAAQUMMhJq704AAs27Z4EhuAXilmqZhEAOw==) no-repeat 98% center; *background-image: url(-view\\view\\menu\\horiz_arrow.gif);}\n.uki-menu-vertical .uki-menu-submenu {background: url(data:image/gif;base64,R0lGODlhEQAHAPMAAAAAAP8AAP///////////////////////////////////////////////////////yH5BAEAAAEALAAAAAARAAcAAwQTMMhJq714gs1Blp33gdtIieYYAQA7) no-repeat 98% center; *background-image: url(-view\\view\\menu\\vert_arrow.gif);}\n\n.uki-splitPane-handle,\r\n.uki-splitPane-handle-bar {z-index: 200; position: absolute;}\n.uki-splitPane-handle {background: #999;}\n.uki-splitPane-handle-bar {display: none; background: #999; overflow: hidden;}\n.uki-splitPane-handle-ext {background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAyCAYAAACZDmG3AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNXG14zYAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTIvMjEvMTCej/OTAAAAJklEQVQokWMoLi7+////f4b///8zMPHw8DDAABMDEhjljHJozAEAwzEI2ZZEXDIAAAAASUVORK5CYII=); position: absolute; *background-image: url(-view\\view\\splitPane\\extv.png);}\n.uki-splitPane-handle_h {cursor: row-resize; width: 100%;}\n.uki-splitPane-handle-bar_h {width: 100%; height: 1px; left: 0px; top: 2px;}\n.uki-splitPane-handle_v {cursor: col-resize; height: 100%;}\n.uki-splitPane-handle-bar_v {height: 100%; width: 1px; top: 0px; left: 2px;}\n.uki-splitPane-handle_thin .uki-splitPane-handle-bar {display: block;}\n.uki-splitPane-handle_thin.uki-splitPane-handle {background: url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEHAAEALAAAAAABAAEAAAICTAEAOw==); *background-image: url(-view\\view\\splitPane\\x.gif);}\n.uki-splitPane-handle_thin.uki-splitPane-handle_v {width: 5px !important; margin-left: -2px;}\n.uki-splitPane-handle_thin.uki-splitPane-handle_h {height: 5px !important; margin-top: -2px;}\n\n.uki-dataList {position: relative; outline: none;}\n.uki-dataList-pack {left: 0; width: 100%; display: block; list-style: none; position: absolute; padding: 0; margin: 0;}\n.uki-dataList-row {cursor: default; display: block; padding: 5px; margin: 0; height: 14px; font-size: 11px; line-height: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; background-color: #FFFFFF;}\n.uki-dataList-row_odd {background-color: #EDF3FE;}\n.uki-dataList-row_selected {background-color: #3875D7; color: #FFF; padding-top: 4px; padding-bottom: 4px; border: 1px solid #2760C0; border-left: none; border-right: none;}\n.uki-dataList-row_selected + .uki-dataList-row_selected {border-top: none; padding-top: 5px;}\n.uki-dataList_blured .uki-dataList-row_selected {background-color: #CCC; border-color: #AAA; color: #000;}\n\n.uki-dataTable-container {overflow: auto; -webkit-overflow-scrolling: touch;}\n.uki-dataTable {position: relative; height: 100%; width: 100%;}\n.uki-dataTable-menu {margin-left: 0px; margin-top: 2px; width: 12px; height: 12px; cursor: pointer; position: absolute; top: 0; left: 0;}\n.uki-dataTable-menu .uki-menu-primary, .uki-dataTable-menu .uki-menu-primary > a {background-color: transparent;}\n.uki-dataTable-sort-down {background: url(data:image/gif;base64,R0lGODlhCgAJAIABAF9fX////yH5BAEAAAEALAAAAAAKAAkAAAINjI+py50AI0ByPsgsKgA7) no-repeat 100% center; *background-image: url(-view\\view\\dataTable\\down.gif);}\n.uki-dataTable-sort-up {background: url(data:image/gif;base64,R0lGODlhCgAJAIABAF9fX////yH5BAEAAAEALAAAAAAKAAkAAAINjGGZwHrcFoSu2ovzLQA7) no-repeat 100% center; *background-image: url(-view\\view\\dataTable\\up.gif);}\n.uki-dataTable-header, .uki-dataTable-footer,\r\n.uki-dataTable-pack {border-spacing: 0; table-layout: fixed;}\n.uki-dataTable-pack {width: 100%;}\n.uki-dataTable-row {display: table-row;}\n.uki-dataTable-cell {border: none; padding: 2px 5px; margin: 0; height: 14px; font-size: 11px; line-height: 14px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; cursor: default;}\n.uki-dataTable-row_selected {background-color: #3875D7; color: #FFF;}\n.uki-dataTable-row_selected .uki-dataTable-cell {padding-top: 1px; padding-bottom: 1px; border-top: 1px solid #2760C0; border-bottom: 1px solid #2760C0;}\n.uki-dataTable-row_selected + .uki-dataTable-row_selected .uki-dataTable-cell {border-top: none; padding-top: 2px;}\n.uki-dataList_blured .uki-dataTable-row_selected {background-color: #CCC; color: #000;}\n.uki-dataList_blured .uki-dataTable-row_selected .uki-dataTable-cell {border-color: #AAA;}\n.uki-dataTable-wrap {width: 100%;}\n.uki-dataTable-cell_number {text-align: right;}\n.uki-dataTable-header-container, .uki-dataTable-footer-container {box-shadow: 0 1px 0 rgba(0, 0, 0, .1); -moz-box-shadow: 0 1px 0 rgba(0, 0, 0, .1); -webkit-box-shadow: 0 1px 0 rgba(0, 0, 0, .1); position: relative; background-color: #EFEFEF; overflow: hidden; cursor: default;}\n.uki-dataTable-header-container {border-bottom: 1px solid #999;}\n.uki-dataTable-footer-container {border-top: 1px solid #999;}\n.uki-dataTable-footer-container {position: absolute; bottom: 0px; left: 0px; right: 0px;}\ntable.uki-dataTable-header tr.uki-dataTable-header-row td {text-align: left;}\n.uki-dataTable-header-cell, .uki-dataTable-footer-cell {margin: 0; border-right: 1px solid #CCC; padding: 0 4px 0 5px; vertical-align: top;}\n.uki-dataTable-header-wrap, .uki-dataTable-footer-wrap {position: relative; margin-right: 3px;}\n.uki-dataTable-header-text {text-overflow: ellipsis; white-space: nowrap; overflow: hidden; padding: 2px 0; height: 14px; font-size: 11px; line-height: 14px;}\n.uki-dataTable-footer-text {text-overflow: ellipsis; white-space: nowrap; overflow: hidden; padding: 2px 0; height: 14px; font-size: 10px; font-weight: bolder; line-height: 14px; text-align: right;}\n.uki-dataTable-resizer {display: none; overflow: hidden; position: absolute; width: 5px; top: 0; right: -7px; height: 100%; text-indent: 1em; cursor: col-resize;}\n.uki-dataTable-header-cell_resizable .uki-dataTable-resizer {display: block;}\n.uki-dataTable-spacer {padding-left: 0; padding-right: 0;}\n.uki-dataTable-filter, .uki-dataTable-footer-field {margin-left: -2px; padding: 1px; width: 100%;}\n.uki-dataTable-footer-field {background-color: #CCC;}\n";
    require_modules[0] = function(global, module, require) {
        var exports = this;
        global.uki = require(1);
    };
    require_modules[1] = function(global, module, require) {
        var exports = this;
        module.exports = require(2);
        require(21);
        module.exports.createStylesheet(__requiredCss);
    };
    require_modules[2] = function(global, module, require) {
        var exports = this;
        var env = require(3), utils = require(4), builder = require(6), selector = require(9), collection = require(8);
        function uki(val, context) {
            if (typeof val === "string") {
                return selector.find(val, context);
            }
            if (val.length === undefined) {
                val = [ val ];
            }
            if (val.length > 0 && utils.isFunction(val[0].typeName)) {
                return new collection.Collection(val);
            }
            return builder.build(val);
        }
        uki.version = "0.4.0a4";
        utils.extend(uki, env, utils, selector, collection, {
            builder: builder
        }, require(7), require(13), require(12), require(17), require(18), require(16), require(11), require(19));
        var view = require(10);
        uki.view = view;
        builder.namespaces.unshift(view);
        utils.extend(view, require(15), require(14), require(20));
        module.exports = uki;
    };
    require_modules[3] = function(global, module, require) {
        var exports = this;
        exports.root = global;
        exports.doc = exports.root.document || {};
        exports.docElem = exports.doc.documentElement;
        exports.nav = exports.root.navigator || {};
        exports.ua = exports.nav.userAgent || "";
        exports.guid = 1;
        exports.expando = "uki" + +(new Date);
    };
    require_modules[4] = function(global, module, require) {
        var exports = this;
        var toString = Object.prototype.toString, arrayPrototype = Array.prototype, slice = arrayPrototype.slice, utils = exports, _compat = require(5), forEach = arrayPrototype.forEach || _compat.forEach;
        var marked = "__marked";
        function inheritance() {}
        utils.prop = function(obj, prop, value, extra) {
            var exp = prop.split(".");
            if (exp.length > 1) {
                var dobj = obj;
                for (var i = 0; i < exp.length - 1; i++) {
                    dobj = obj[exp[i]];
                }
                obj = dobj;
                prop = exp[i];
            }
            if (arguments.length > 2) {
                if (obj[prop] && obj[prop].apply) {
                    obj[prop](value, extra);
                } else {
                    obj[prop] = value;
                }
                return obj;
            } else {
                if (obj[prop] && obj[prop].apply) {
                    return obj[prop]();
                } else {
                    return obj[prop];
                }
            }
        };
        utils.isFunction = function(obj) {
            return toString.call(obj) === "[object Function]";
        };
        utils.isArray = function(obj) {
            return toString.call(obj) === "[object Array]";
        };
        utils.toArray = function(array) {
            return slice.call(array, 0);
        };
        utils.pluck = function(array, prop) {
            function reader(v) {
                return utils.prop(v, prop);
            }
            return array.map ? array.map(reader) : utils.map(array, reader);
        };
        utils.without = function(array, value) {
            function filter(v) {
                return v !== value;
            }
            return array.filter ? array.filter(filter) : utils.filter(array, filter);
        };
        utils.invoke = function(array, method) {
            var args = slice.call(arguments, 2), invoke = method ? function(item) {
                return item[method].apply(item, args);
            } : function(item) {
                return item.apply(null, args);
            };
            return array.forEach ? array.forEach(invoke) : utils.forEach(array, invoke);
        };
        utils.forEach = function(object, callback, context) {
            var name, i = 0, length = object.length;
            if (length === undefined) {
                for (name in object) {
                    if (!name || object[name] === undefined || !object.hasOwnProperty(name)) {
                        continue;
                    }
                    if (callback.call(context || object[name], object[name], name) === false) {
                        break;
                    }
                }
            } else {
                forEach.call(object, callback, context);
            }
            return object;
        };
        utils.unique = function(array) {
            var result = [], i, length;
            if (array.length && (typeof array[0] == "object" || typeof array[0] == "function")) {
                for (i = 0; i < array.length; i++) {
                    if (!array[i][marked]) {
                        result[result.length] = array[i];
                    }
                    array[i][marked] = true;
                }
                for (i = 0; i < result.length; i++) {
                    delete result[i][marked];
                }
                return result;
            } else {
                var done = {};
                for (i = 0, length = array.length; i < length; i++) {
                    var id = array[i];
                    if (!done[id]) {
                        done[id] = true;
                        result.push(array[i]);
                    }
                }
                return result;
            }
        };
        utils.extend = function() {
            var target = arguments[0] || {}, i = 1, length = arguments.length, options;
            for (; i < length; i++) {
                if ((options = arguments[i]) != null) {
                    for (var name in options) {
                        if (!options.hasOwnProperty(name)) {
                            continue;
                        }
                        var copy = options[name];
                        if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }
            return target;
        };
        utils.binarySearch = function(array, value, low, high) {
            low = low === undefined ? 0 : low;
            high = high === undefined ? array.length : high;
            var mid;
            while (low < high) {
                mid = low + high >> 1;
                array[mid] < value ? low = mid + 1 : high = mid;
            }
            return low;
        };
        utils.camelize = function(string) {
            return string.replace(/[_-]\S/g, function(v) {
                return v.substr(1).toUpperCase();
            });
        };
        utils.dasherize = function(string) {
            return string.replace(/[A-Z]/g, function(v) {
                return "-" + v.toLowerCase();
            });
        };
        utils.path2obj = function(path, context) {
            var parts = path.split(".");
            context = context || global;
            for (var i = 0, l = parts.length; context && i < l; i++) {
                context = context[parts[i]];
            }
            return context;
        };
        utils.range = function(from, to) {
            var result = new Array(to - from);
            for (var idx = 0; from <= to; from++, idx++) {
                result[idx] = from;
            }
            return result;
        };
        utils.applyCompat = _compat.applyCompat;
        utils.forEach(_compat.arrayFunctions, function(name) {
            if (!utils[name]) {
                var method = Array.prototype[name] || _compat[name];
                utils[name] = function(array, a, b) {
                    return method.call(array, a, b);
                };
            }
        });
        utils.keys = Object.keys || _compat.keys;
        var trim = String.prototype.trim || _compat.trim;
        utils.trim = function(s) {
            return trim.call(s);
        };
    };
    require_modules[5] = function(global, module, require) {
        var exports = this;
        var arrayPrototype = Array.prototype;
        var arrayFunctions = [ "indexOf", "lastIndexOf", "forEach", "map", "filter", "reduce", "reduceRight", "every", "some" ];
        exports.arrayFunctions = arrayFunctions;
        exports.applyCompat = function() {
            exports.forEach.call(arrayFunctions, function(name) {
                if (!arrayPrototype[name]) {
                    arrayPrototype[name] = exports[name];
                }
            });
            if (!Object.keys) {
                Object.keys = exports.keys;
            }
        };
        exports.indexOf = function(searchElement, i) {
            var len = this.length;
            if (i === undefined) {
                i = 0;
            }
            if (i < 0) {
                i += len;
            }
            if (i < 0) {
                i = 0;
            }
            for (; i < len; i++) {
                if (i in this && this[i] === searchElement) {
                    return i;
                }
            }
            return -1;
        };
        exports.lastIndexOf = function(searchElement, i) {
            var len = this.length;
            if (i === undefined) {
                i = len - 1;
            }
            if (i < 0) {
                i += len;
            }
            if (i >= len) {
                i = len - 1;
            }
            while (i >= 0) {
                if (i in this && this[i--] === searchElement) {
                    return i;
                }
            }
            return -1;
        };
        exports.forEach = function(fun, context) {
            for (var i = 0, n = this.length; i < n; i++) {
                if (i in this) {
                    fun.call(context, this[i], i, this);
                }
            }
        };
        exports.every = function(fun, context) {
            for (var i = 0, n = this.length; i < n; i++) {
                if (i in this && !fun.call(context, this[i], i, this)) {
                    return false;
                }
            }
            return true;
        };
        exports.some = function(fun, context) {
            for (var i = 0, n = this.length; i < n; i++) {
                if (i in this && fun.call(context, this[i], i, this)) {
                    return true;
                }
            }
            return false;
        };
        exports.map = function(mapper, context) {
            var other = new Array(this.length);
            for (var i = 0, n = this.length; i < n; i++) {
                if (i in this) {
                    other[i] = mapper.call(context, this[i], i, this);
                }
            }
            return other;
        };
        exports.filter = function(filter, context) {
            var other = [], v;
            for (var i = 0, n = this.length; i < n; i++) {
                if (i in this && filter.call(context, v = this[i], i, this)) {
                    other.push(v);
                }
            }
            return other;
        };
        exports.reduce = function(fun, accumulator) {
            if (accumulator === undefined) {
                accumulator = this[0];
            }
            for (var i = 0, n = this.length; i < n; i++) {
                accumulator = fun.call(undefined, accumulator, this[i], i, this);
            }
            return accumulator;
        };
        exports.reduceRight = function(fun, accumulator) {
            var len = this.length;
            if (accumulator === undefined) {
                accumulator = this[len - 1];
            }
            for (var i = len - 1; i >= 0; i--) {
                accumulator = fun.call(undefined, accumulator, this[i], i, this);
            }
            return accumulator;
        };
        exports.keys = function(o) {
            var ret = [], p;
            for (p in o) {
                if (o.hasOwnProperty(p)) {
                    ret.push(p);
                }
            }
            return ret;
        };
        exports.trim = function() {
            return this.replace(/^\s*|\s*$/g, "");
        };
    };
    require_modules[6] = function(global, module, require) {
        var exports = this;
        var utils = require(4), fun = require(7), Collection = require(8).Collection;
        var Builder = fun.newClass({
            init: function(ns) {
                this.namespaces = ns || [ global ];
                this.build = fun.bind(this.build, this);
                this._stack = 0;
            },
            build: function(markup) {
                if (!(this._stack++)) {
                    this._references = {};
                }
                var collection = withBuilder(this, function() {
                    if (markup.length === undefined) {
                        markup = [ markup ];
                    }
                    return new Collection(utils.map(markup, function(mRow) {
                        return this.buildOne(mRow);
                    }, this), this._references);
                }, this);
                if (!(this._stack--)) {
                    this._references = null;
                }
                return collection;
            },
            buildOne: function(mRow) {
                if (mRow.typeName) {
                    return mRow;
                }
                var klass = mRow.view, initArgs = mRow.init || {}, result;
                if (typeof klass === "string") {
                    klass = this.resolvePath(klass);
                }
                if (!klass) {
                    throw "builder: Can't find view with type '" + mRow.view + "'";
                } else {
                    result = new klass(initArgs);
                }
                if (mRow.as) {
                    this._references[mRow.as] = result;
                }
                copyAttrs(result, mRow);
                result.trigger({
                    type: "built",
                    control: result,
                    args: initArgs
                });
                return result;
            },
            resolvePath: function(path) {
                for (var i = 0, ns = this.namespaces, length = ns.length, res; i < length; i++) {
                    res = utils.path2obj(path, ns[i]);
                    if (res) {
                        return res;
                    }
                }
                return false;
            }
        });
        function copyAttrs(view, mRow) {
            utils.forEach(mRow, function(value, name) {
                if (name === "view" || name === "init" || name === "as") {
                    return;
                }
                utils.prop(view, name, value);
            });
            return view;
        }
        var defaultBuilder;
        function setDefault(builder) {
            exports.build = builder.build;
            exports.namespaces = builder.namespaces;
            defaultBuilder = builder;
        }
        function withBuilder(builder, callback, context) {
            var oldBuilder = defaultBuilder;
            setDefault(builder);
            var result = callback.call(context || global);
            setDefault(oldBuilder);
            return result;
        }
        exports.Builder = Builder;
        exports.withBuilder = withBuilder;
        setDefault(new Builder);
    };
    require_modules[7] = function(global, module, require) {
        var exports = this;
        var env = require(3), utils = require(4), arrayPrototype = Array.prototype;
        function inheritance() {}
        var fun = exports;
        fun.bind = function(fn, context) {
            var args = arrayPrototype.slice.call(arguments, 2), result = args.length ? function() {
                return fn.apply(context || this, args.concat(utils.toArray(arguments)));
            } : function() {
                return fn.apply(context || this, arguments);
            };
            result.bound = true;
            return result;
        };
        fun.bindOnce = function(fn, context) {
            if (fn.bound) {
                return fn;
            }
            fn.huid = fn.huid || env.guid++;
            var bindingName = "__bind_" + fn.huid;
            context[bindingName] = context[bindingName] || fun.bind(fn, context);
            return context[bindingName];
        };
        fun.newClass = function() {
            var i, length = arguments.length, first = arguments[0], last = arguments[length - 1], init, desc, descArgs, klass, baseClass = length > 1 && first.prototype && first;
            if (utils.isFunction(last)) {
                descArgs = [];
                klass = function() {
                    init.apply(this, arguments);
                };
            } else if (last && last.init) {
                klass = last.init;
            } else if (baseClass) {
                klass = function() {
                    baseClass.apply(this, arguments);
                };
            } else {
                klass = function() {};
            }
            if (baseClass) {
                inheritance.prototype = baseClass.prototype;
                klass.prototype = new inheritance;
                descArgs && descArgs.push(baseClass.prototype);
                for (var staticMember in baseClass) {
                    if (!klass[staticMember]) {
                        klass[staticMember] = baseClass[staticMember];
                    }
                }
            }
            for (i = baseClass ? 1 : 0; i < length - 1; i++) {
                utils.extend(klass.prototype, arguments[i]);
                descArgs && descArgs.push(arguments[i]);
            }
            if (last) {
                if (utils.isFunction(last)) {
                    desc = {};
                    last.apply(desc, descArgs);
                    init = desc.init || fun.FS;
                } else {
                    desc = last;
                }
                utils.extend(klass.prototype, desc);
            }
            klass.prototype.constructor = klass;
            return klass;
        };
        function newProp(prop, setter) {
            prop = prop || "_p" + env.guid++;
            var propName = "_" + prop;
            if (setter) {
                return function(value) {
                    if (!arguments.length) {
                        return this[propName];
                    }
                    setter.apply(this, arguments);
                    return this;
                };
            } else {
                return function(value) {
                    if (!arguments.length) {
                        return this[propName];
                    }
                    this[propName] = value;
                    return this;
                };
            }
        }
        fun.newProp = newProp;
        fun.addProp = fun.addProps = function(source, prop, setter) {
            if (utils.isArray(prop)) {
                for (var i = 0, len = prop.length; i < len; i++) {
                    source[prop[i]] = newProp(prop[i], setter && setter[i]);
                }
            } else {
                source[prop] = newProp(prop, setter);
            }
        };
        function newDelegateProp(target, targetName) {
            return function(value) {
                var targetObj = utils.prop(this, target);
                if (!arguments.length) {
                    return targetObj ? utils.prop(targetObj, targetName) : null;
                }
                targetObj && utils.prop(targetObj, targetName, value);
                return this;
            };
        }
        fun.newDelegateProp = newDelegateProp;
        fun.delegateProp = function(source, name, target, targetName) {
            if (utils.isArray(name)) {
                utils.forEach(name, function(n, i) {
                    fun.delegateProp(source, n, target, targetName && targetName[i]);
                });
            } else {
                targetName = targetName || name;
                source[name] = newDelegateProp(target, targetName);
            }
        };
        function newDelegateCall(target, targetName) {
            return function() {
                var obj = utils.prop(this, target);
                return obj[targetName].apply(obj, arguments);
            };
        }
        fun.newDelegateCall = newDelegateCall;
        fun.delegateCall = function(source, name, target, targetName) {
            if (utils.isArray(name)) {
                utils.forEach(name, function(n, i) {
                    fun.delegateCall(source, n, target, targetName && targetName[i]);
                });
            } else {
                targetName = targetName || name;
                source[name] = newDelegateCall(target, targetName);
            }
        };
        function timer(fn, timeout, debounce) {
            var running;
            return function() {
                var context = this, args = arguments;
                if (debounce && running) {
                    running = clearTimeout(running);
                }
                running = running || setTimeout(function() {
                    running = null;
                    fn.apply(context, args);
                }, timeout);
            };
        }
        fun.throttle = function(fn, timeout) {
            return timer(fn, timeout);
        };
        fun.debounce = function(fn, timeout) {
            return timer(fn, timeout, true);
        };
        fun.defer = function(callback) {
            return global.setTimeout(callback, 0);
        };
        var deferOnceBound = {}, deferOnceQueue = [];
        fun.deferOnce = function(callback, context) {
            if (context) {
                callback = fun.bindOnce(callback, context);
            }
            callback.huid = callback.huid || env.guid++;
            if (deferOnceBound[callback.huid]) {
                return;
            }
            deferOnceBound[callback.huid] = true;
            deferOnceQueue.push(callback);
            if (deferOnceQueue.length === 1) {
                fun.defer(runAfterCallbacks);
            }
        };
        function runAfterCallbacks() {
            var queue = deferOnceQueue;
            deferOnceQueue = [];
            deferOnceBound = {};
            utils.invoke(queue);
        }
        fun.FF = function() {
            return false;
        };
        fun.FT = function() {
            return true;
        };
        fun.FS = function() {
            return this;
        };
    };
    require_modules[8] = function(global, module, require) {
        var exports = this;
        var fun = require(7), utils = require(4), arrayPrototype = Array.prototype;
        var Collection = fun.newClass({
            init: function(views, references) {
                this.length = 0;
                this._references = references || {};
                arrayPrototype.push.apply(this, views);
            },
            view: function(name) {
                return this._references[name];
            },
            forEach: function(callback, context) {
                return utils.forEach(this, callback, context);
            },
            filter: function(callback, context) {
                return new Collection(utils.filter(this, callback, context));
            },
            map: function(callback, context) {
                return utils.map(this, callback, context);
            },
            prop: function(name, value) {
                if (arguments.length > 1) {
                    for (var i = this.length - 1; i >= 0; i--) {
                        utils.prop(this[i], name, value);
                    }
                    return this;
                } else {
                    return this[0] ? utils.prop(this[0], name) : "";
                }
            },
            find: function(selector) {
                return require(9).find(selector, this);
            },
            appendTo: function(target) {
                target = require(6).build(target)[0];
                this.forEach(function(view) {
                    target.appendChild(view);
                });
                return this;
            },
            attach: function(dom, insertIt) {
                this.forEach(function(view) {
                    require(11).Attaching.attach(dom, view, insertIt);
                });
                return this;
            },
            remove: function() {
                this.forEach(function(view) {
                    if (view.parent()) {
                        view.parent().removeChild(view);
                    }
                });
            }
        });
        var proto = Collection.prototype;
        utils.forEach([ [ "parent", "parent" ], [ "next", "nextView" ], [ "prev", "prevView" ] ], function(desc, i) {
            proto[desc[0]] = function() {
                return new Collection(utils.unique(utils.filter(utils.pluck(this, desc[1]), function(v) {
                    return !!v;
                })));
            };
        });
        Collection.addMethods = function(methods) {
            utils.forEach(methods, function(name) {
                if (!proto[name]) {
                    proto[name] = function() {
                        for (var i = this.length - 1; i >= 0; i--) {
                            this[i][name].apply(this[i], arguments);
                        }
                        return this;
                    };
                }
            });
            return this;
        };
        Collection.addProps = function(props) {
            utils.forEach(props, function(name) {
                if (!proto[name]) {
                    proto[name] = function(value) {
                        return arguments.length ? this.prop(name, value) : this.prop(name);
                    };
                }
            });
            return this;
        };
        Collection.addMethods([ "addListener", "removeListener", "trigger", "on", "addClass", "removeClass", "toggleClass", "destruct", "layout", "scroll", "clear" ]);
        Collection.addProps([ "id", "dom", "text", "html", "pos", "visible", "style", "model", "bindings", "clientRect" ]);
        exports.Collection = Collection;
    };
    require_modules[9] = function(global, module, require) {
        var exports = this;
        var utils = require(4), Collection = require(8).Collection, idRegexp = /^#((?:[\w\u00c0-\uFFFF_-]|\\.)+)$/, chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g, regexps = [ {
            name: "ID",
            regexp: /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/
        }, {
            name: "INST",
            regexp: /\[\s*instanceof\s+((?:[\w\u00c0-\uFFFF_.-]|\\.)+)\s*\]/
        }, {
            name: "PROP",
            regexp: /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/
        }, {
            name: "TYPE",
            regexp: /^((?:[\w\u00c0-\uFFFF\*_\.-]|\\.)+)/
        }, {
            name: "POS",
            regexp: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/
        } ], posRegexp = regexps.POS, posFilters = {
            first: function(i) {
                return i === 0;
            },
            last: function(i, match, array) {
                return i === array.length - 1;
            },
            even: function(i) {
                return i % 2 === 0;
            },
            odd: function(i) {
                return i % 2 === 1;
            },
            lt: function(i, match) {
                return i < match[2] - 0;
            },
            gt: function(i, match) {
                return i > match[2] - 0;
            },
            nth: function(i, match) {
                return match[2] - 0 == i;
            },
            eq: function(i, match) {
                return match[2] - 0 == i;
            }
        }, reducers = {
            TYPE: function(view, match) {
                var expected = match[1];
                if (expected == "*") {
                    return true;
                }
                var typeName = utils.prop(view, "typeName");
                return typeName && typeName.length >= expected.length && ("." + typeName).indexOf("." + expected) == typeName.length - expected.length;
            },
            INST: function(view, match) {
                var obj = utils.path2obj(match[1]);
                return obj && view instanceof obj;
            },
            PROP: function(view, match) {
                var result = utils.prop(view, match[1]), value = result + "", type = match[2], check = match[4];
                return result == null ? type === "!=" : type === "=" ? value === check : type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false : type === "!=" ? value != check : type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check : false;
            },
            ID: function(view, match) {
                return reducers.PROP(view, [ "", "id", "=", "", match[1] ]);
            },
            POS: function(view, match, i, array) {
                var filter = posFilters[match[1]];
                return filter ? filter(i, match, array) : false;
            }
        }, mappers = {
            "+": function(context) {
                return utils.unique(utils.pluck(context, "nextView"));
            },
            ">": function(context) {
                return utils.unique(flatten(utils.pluck(context, "childViews")));
            },
            "": function(context) {
                return utils.unique(recChildren(flatten(utils.pluck(context, "childViews"))));
            },
            "~": function(context) {
                return utils.unique(flatten(utils.map(context, function(view) {
                    return view.parent().childViews().slice((view._viewIndex || 0) + 1);
                })));
            }
        };
        function recChildren(views) {
            return flatten(utils.map(views, function(view) {
                return [ view ].concat(recChildren(utils.prop(view, "childViews")));
            }));
        }
        function flatten(array) {
            return utils.reduce(array, function(x, e) {
                return x.concat(e);
            }, []);
        }
        var Selector = {
            find: function(selector, context, skipFiltering) {
                var match;
                if (!context && (match = selector.match(idRegexp))) {
                    var element = require(10).byId(match[1]);
                    return new Collection(element ? [ element ] : []);
                }
                context = context || require(11).Attaching.instances();
                if (context.length === undefined) {
                    context = [ context ];
                }
                var tokens = Selector.tokenize(selector), expr = tokens[0], extra = tokens[1], result = context, mapper;
                while (expr.length > 0) {
                    mapper = mappers[expr[0]] ? mappers[expr.shift()] : mappers[""];
                    result = mapper(result);
                    if (expr.length === 0) {
                        break;
                    }
                    result = Selector.reduce(expr.shift(), result);
                }
                if (extra) {
                    result = result.concat(Selector.find(extra, context, true));
                }
                return skipFiltering ? result : new Collection(utils.unique(result));
            },
            reduce: function(exprItem, context) {
                if (!context || !context.length) {
                    return [];
                }
                var match, found;
                while (exprItem) {
                    found = false;
                    utils.forEach(regexps, function(row, index) {
                        if (!found && (match = exprItem.match(row.regexp))) {
                            found = true;
                            context = utils.filter(context, function(view, index) {
                                return reducers[row.name](view, match, index, context);
                            });
                            exprItem = exprItem.replace(row.regexp, "");
                            return false;
                        }
                    });
                    if (!found) {
                        break;
                    }
                }
                return context;
            },
            tokenize: function(expr) {
                var parts = [], match, extra;
                chunker.lastIndex = 0;
                while ((match = chunker.exec(expr)) !== null) {
                    parts.push(match[1]);
                    if (match[2]) {
                        extra = RegExp.rightContext;
                        break;
                    }
                }
                return [ parts, extra ];
            }
        };
        exports.find = Selector.find;
    };
    require_modules[10] = function(global, module, require) {
        var exports = this;
        var utils = require(4), fun = require(7), env = require(3);
        var registry = {}, ids = {};
        module.exports = {
            register: function(view) {
                registry[view.dom()[env.expando]] = view;
            },
            unregister: function(view) {
                delete registry[view.dom()[env.expando]];
            },
            registerId: function(view) {
                ids[utils.prop(view, "id")] = view;
            },
            unregisterId: function(view) {
                delete ids[utils.prop(view, "id")];
            },
            byId: function(id) {
                return ids[id];
            },
            closest: function(element) {
                while (element) {
                    var e = element[env.expando];
                    if (registry[e]) {
                        return registry[e];
                    }
                    element = element.parentNode;
                }
                return null;
            },
            contains: function(parent, child) {
                while (child) {
                    if (child == parent) {
                        return true;
                    }
                    child = child.parent();
                }
                return false;
            },
            newClass: function(typeName) {
                var View = fun.newClass.apply(fun, utils.toArray(arguments).slice(1));
                View.prototype.typeName = typeName;
                return View;
            },
            newToggleClassProp: function(className) {
                return function(state) {
                    if (!arguments.length) {
                        return this.hasClass(className);
                    }
                    return this.toggleClass(className, state);
                };
            },
            newClassMapProp: function(classMap) {
                return function(state) {
                    if (!arguments.length) {
                        var res = "";
                        utils.forEach(classMap, function(clasName, enumName) {
                            if (this.hasClass(clasName)) {
                                res = enumName;
                                return false;
                            }
                        }, this);
                        return res;
                    }
                    utils.forEach(classMap, function(className, enumName) {
                        this.toggleClass(className, state === enumName);
                    }, this);
                    return this;
                };
            }
        };
    };
    require_modules[11] = function(global, module, require) {
        var exports = this;
        var utils = require(4), env = require(3), evt = require(12), dom = require(13), fun = require(7), Container = require(14).Container;
        var Attaching = fun.newClass(Container, {
            typeName: "Attaching",
            _setup: function(initArgs) {
                this._dom = initArgs.dom;
                dom.addClass(this.dom(), "uki-attaching");
                Container.prototype._setup.call(this, initArgs);
            },
            _createDom: fun.FS,
            parent: function() {
                return null;
            }
        });
        var instances = null;
        Attaching.attach = function(dom, view, insertIt) {
            dom = dom || env.doc.body;
            var id = dom[env.expando] = dom[env.expando] || env.guid++;
            if (!instances || !instances[id]) {
                register(new Attaching({
                    dom: dom
                }));
            }
            if (insertIt === true) {
                instances[id].insertChild(view);
            } else {
                instances[id].appendChild(view);
            }
            view.layout();
        };
        Attaching.removeInstance = function(id) {
            if (instances[id]) {
                instances[id] = null;
                delete instances[id];
            }
        };
        Attaching.instances = function() {
            var atts = [];
            utils.forEach(instances || {}, function(a) {
                atts.push(a);
            });
            return atts;
        };
        function register(a) {
            if (!instances) {
                instances = {};
                var timeout = false;
                evt.on(env.root, "resize", function() {
                    if (!timeout) {
                        timeout = true;
                        fun.defer(function(i, len) {
                            timeout = false;
                            utils.forEach(instances, function(a) {
                                a.layout();
                            });
                        });
                    }
                });
            }
            var el = a.dom(), id = el[env.expando] = el[env.expando] || env.guid++;
            a._instanceId = id;
            return instances[id] = a;
        }
        exports.Attaching = Attaching;
    };
    require_modules[12] = function(global, module, require) {
        var exports = this;
        var utils = require(4), fun = require(7), dom = require(13), env = require(3), expando = env.expando;
        function EventWrapper() {}
        var EventMethods = {
            targetView: function() {
                if (!this._targetView) {
                    this._targetView = require(10).closest(this.target);
                }
                return this._targetView;
            },
            preventDefault: function() {
                var e = this.baseEvent;
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
                this.isDefaultPrevented = fun.FT;
            },
            stopPropagation: function() {
                var e = this.baseEvent;
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = true;
                }
                this.isPropagationStopped = fun.FT;
            },
            isDefaultPrevented: fun.FF,
            isPropagationStopped: fun.FF
        };
        function DomEventWrapper() {}
        utils.extend(DomEventWrapper.prototype, EventMethods);
        function normalize(e) {
            if (!e.target) {
                e.target = e.srcElement || env.doc;
            }
            if (e.target.nodeType === 3) {
                e.target = e.target.parentNode;
            }
            if (!e.relatedTarget && e.fromElement) {
                e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
            }
            if (e.pageX == 0 && e.baseEvent != null) {
                if (e.baseEvent.changedTouches != null) {
                    e.pageX = e.baseEvent.changedTouches[0].pageX;
                    e.pageY = e.baseEvent.changedTouches[0].pageY;
                }
                if (e.pageX == 0 && e.baseEvent.touches != null) {
                    e.pageX = e.baseEvent.touches[0].pageX;
                    e.pageY = e.baseEvent.touches[0].pageY;
                }
            }
            if (e.pageX == null && e.clientX != null) {
                var doc = env.doc, body = doc.body;
                e.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                e.pageY = e.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
            }
            if (e.which == null && (e.charCode != null || e.keyCode != null)) {
                e.which = e.charCode != null ? e.charCode : e.keyCode;
            }
            e.metaKey = e.metaKey || e.ctrlKey;
            if (!e.which && e.button !== undefined) {
                e.which = e.button & 1 ? 1 : e.button & 2 ? 3 : e.button & 4 ? 2 : 0;
            }
            return e;
        }
        var listeners = {};
        var domHandlers = {};
        var eventProps = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY clipboardData ctrlKey currentTarget data dataTransfer detail eventPhase fromElement handler keyCode metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement type view wheelDelta which".split(" ");
        function domHandler(e) {
            e = e || env.root.event;
            var wrapped = wrapDomEvent(e);
            evt.trigger(this, normalize(wrapped));
        }
        function wrapDomEvent(baseEvent) {
            e = new DomEventWrapper;
            e.baseEvent = baseEvent;
            for (var i = eventProps.length, prop; i >= -1; i--) {
                prop = eventProps[i];
                e[prop] = baseEvent[prop];
            }
            e.simulatePropagation = false;
            return e;
        }
        function createEvent(baseEvent, options) {
            EventWrapper.prototype = baseEvent;
            e = new EventWrapper;
            utils.extend(e, EventMethods);
            e.baseEvent = baseEvent;
            e.simulatePropagation = baseEvent.simulatePropagation === undefined ? true : baseEvent.simulatePropagation;
            utils.extend(e, options);
            return e;
        }
        function destroyEvent(event) {
            for (var prop in event.prototype) {
                if (event.prototype.hasOwnProperty(prop)) {
                    if (dom.isDOMElement(event.prototype[prop])) {
                        event.prototype[prop] = null;
                    }
                }
            }
            for (var prop in event) {
                if (event.hasOwnProperty(prop)) {
                    if (dom.isDOMElement(event[prop])) {
                        event[prop] = null;
                    }
                }
            }
            if (event.baseEvent) {
                for (var prop in event.baseEvent) {
                    if (event.baseEvent.hasOwnProperty(prop)) {
                        if (dom.isDOMElement(event.baseEvent[prop])) {
                            event.baseEvent[prop] = null;
                        }
                    }
                }
            }
        }
        var evt = module.exports = {
            wrapDomEvent: wrapDomEvent,
            createEvent: createEvent,
            destroyEvent: destroyEvent,
            special: {},
            listeners: listeners,
            domHandlers: domHandlers,
            EventMethods: EventMethods,
            trigger: function(el, e) {
                var listenerForEl = listeners[el[expando]] || {}, listenersForType = listenerForEl[e.type];
                if (!e.target) {
                    e.target = el;
                }
                listenersForType && utils.forEach(listenersForType, function(l) {
                    l.call(el, e);
                });
                if (e.simulatePropagation && !e.isPropagationStopped() && el.parentNode) {
                    evt.trigger(el.parentNode, e);
                }
            },
            addListener: function(el, types, listener) {
                var id = el[expando] = el[expando] || env.guid++;
                utils.forEach(types.split(" "), function(type) {
                    listeners[id] = listeners[id] || {};
                    if (!listeners[id][type]) {
                        if (evt.special[type]) {
                            evt.special[type].setup(el);
                        } else {
                            domHandlers[id] = domHandlers[id] || fun.bind(domHandler, el);
                            el.addEventListener ? el.addEventListener(type, domHandlers[id], false) : el.attachEvent("on" + type, domHandlers[id]);
                        }
                    }
                    listeners[id][type] = listeners[id][type] || [];
                    listeners[id][type].push(listener);
                });
            },
            removeListener: function(el, types, listener) {
                var id = el[expando];
                if (!id || !listeners[id]) return;
                types || (types = utils.keys(listeners[id]).join(" "));
                utils.forEach(types.split(" "), function(type) {
                    if (!listeners[id][type]) return;
                    listeners[id][type] = listener ? utils.without(listeners[id][type], listener) : [];
                    if (!listeners[id][type].length) {
                        if (evt.special[type]) {
                            evt.special[type].teardown(el);
                        } else {
                            el.removeEventListener ? el.removeEventListener(type, domHandlers[id], false) : el.detachEvent("on" + type, domHandlers[id]);
                        }
                        delete domHandlers[id];
                        delete listeners[id][type];
                        var cnt = 0;
                        for (var a in listeners[id]) {
                            if (listeners[id].hasOwnProperty(a)) {
                                cnt++;
                                break;
                            }
                        }
                        if (cnt === 0) {
                            delete listeners[id];
                        }
                    }
                });
            },
            preventDefaultHandler: function(e) {
                e && e.preventDefault();
                return false;
            }
        };
        evt.on = evt.addListener;
        utils.forEach({
            mouseover: "mouseenter",
            mouseout: "mouseleave"
        }, function(specialName, origName) {
            function handler(e) {
                var parent = e.relatedTarget;
                try {
                    while (parent && parent !== this) {
                        parent = parent.parentNode;
                    }
                    if (parent !== this) {
                        var wrapped = createEvent(e, {
                            type: specialName,
                            simulatePropagation: true
                        });
                        evt.trigger(this, wrapped);
                    }
                } catch (err) {}
                evt.destroyEvent(wrapped);
            }
            evt.special[specialName] = {
                setup: function(el, listener) {
                    evt.on(el, origName, handler);
                },
                teardown: function(el, listener) {
                    evt.removeListener(el, origName, handler);
                }
            };
        });
    };
    require_modules[13] = function(global, module, require) {
        var exports = this;
        var env = require(3), utils = require(4);
        var trans = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;"
        };
        module.exports = {
            createElement: function(tagName, options, children) {
                var e = env.doc.createElement(tagName);
                utils.forEach(options || {}, function(value, name) {
                    if (name == "style") {
                        e.style.cssText = value;
                    } else if (name == "html") {
                        e.innerHTML = value;
                    } else if (name == "className") {
                        e.className = value;
                    } else {
                        e.setAttribute(name, value);
                    }
                });
                children && utils.forEach(children, function(c) {
                    e.appendChild(c);
                });
                return e;
            },
            removeElement: function(element) {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            },
            createStylesheet: function(code) {
                var style = env.doc.createElement("style");
                style.type = "text/css";
                var ss = env.doc.getElementsByTagName("head")[0];
                if (style.styleSheet) {
                    style.styleSheet.cssText = code;
                } else {
                    style.appendChild(env.doc.createTextNode(code));
                }
                if (ss.firstChild) {
                    ss.insertBefore(style, ss.firstChild);
                } else {
                    ss.appendChild(style);
                }
                return style;
            },
            addCSSRule: function(stylesheet, name, value) {
                if (stylesheet.insertRule) {
                    return stylesheet.insertRule(name + " { " + value + " }", stylesheet.cssRules.length);
                } else {
                    return stylesheet.addRule(name, value, -1);
                }
            },
            deleteCSSRule: function(stylesheet, ruleId) {
                if (stylesheet.deleteRule) {
                    stylesheet.deleteRule(ruleId);
                } else {
                    stylesheet.removeRule(ruleId);
                }
            },
            computedStyle: function(element) {
                if (env.doc.defaultView && env.doc.defaultView.getComputedStyle) {
                    return env.doc.defaultView.getComputedStyle(element, null);
                } else if (element.currentStyle) {
                    return element.currentStyle;
                }
            },
            fromHTML: function(html) {
                var fragment = env.doc.createElement("div");
                fragment.innerHTML = html;
                return fragment.firstChild;
            },
            getOffset: function(element, toParent) {
                var _x = 0;
                var _y = 0;
                while (element && element != toParent && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
                    _x += element.offsetLeft - element.scrollLeft;
                    _y += element.offsetTop - element.scrollTop;
                    element = element.offsetParent;
                }
                return {
                    top: _y,
                    left: _x
                };
            },
            clientRect: function(elem, ignoreScroll) {
                var rect = elem.getBoundingClientRect();
                var result = {
                    top: rect.top | 0,
                    left: rect.left | 0,
                    right: rect.right | 0,
                    bottom: rect.bottom | 0,
                    width: rect.right - rect.left | 0,
                    height: rect.bottom - rect.top | 0
                };
                if (ignoreScroll) {
                    return result;
                }
                var body = env.doc.body;
                result.top += env.root.pageYOffset || body.scrollTop;
                result.top += env.root.pageXOffset || body.scrollLeft;
                return result;
            },
            hasClass: function(elem, className) {
                return (" " + elem.className + " ").indexOf(" " + className + " ") > -1;
            },
            addClass: function(elem, classNames) {
                var string = elem.className;
                utils.forEach(classNames.split(/\s+/), function(className) {
                    if (!this.hasClass(elem, className)) {
                        string += (string ? " " : "") + className;
                    }
                }, this);
                elem.className = string;
            },
            removeClass: function(elem, classNames) {
                var string = elem.className;
                utils.forEach(classNames.split(/\s+/), function(className) {
                    string = utils.trim(string.replace(new RegExp("(^|\\s)" + className + "(?:\\s|$)", "g"), " ").replace(/\s{2,}/g, " "));
                }, this);
                elem.className = string;
            },
            toggleClass: function(elem, className, condition) {
                if (arguments.length < 3) {
                    condition = !this.hasClass(elem, className);
                }
                condition ? this.addClass(elem, className) : this.removeClass(elem, className);
            },
            escapeHTML: function(html) {
                return (html + "").replace(/[&<>\"\']/g, function(c) {
                    return trans[c];
                });
            },
            isAChild: function(elem, parent, stopat) {
                var target = elem.parentNode;
                while (target != null && target != parent && target != stopat) {
                    target = target.parentNode;
                }
                if (target == parent) return true;
                return false;
            },
            getParent: function(item, parentType) {
                var cur = item.parentNode;
                if (typeof parentType === "string" && parentType.length > 0) {
                    while (cur !== null) {
                        if (cur.tagName === parentType) return cur;
                        cur = cur.parentNode;
                    }
                }
                return cur;
            },
            isDOMElement: function(o) {
                return typeof HTMLElement === "object" ? o instanceof HTMLElement : o && typeof o === "object" && o.nodeType > 0 && typeof o.nodeName === "string";
            },
            getChildren: function(item, childType) {
                var i, cur = [], child = item.children || [];
                if (typeof childType === "string" && childType.length > 0 && child !== null) {
                    for (i = 0; i < child.length; i++) {
                        if (child[i].tagName === childType) {
                            cur.push(child[i]);
                        }
                    }
                    if (cur.length === 0) {
                        cur = item.querySelectorAll(childType);
                    }
                } else {
                    return child;
                }
                return cur;
            }
        };
    };
    require_modules[14] = function(global, module, require) {
        var exports = this;
        var view = require(10), utils = require(4), fun = require(7), dom = require(13), Base = require(15).Base;
        var Container = view.newClass("Container", Base, {
            _setup: function(initArgs) {
                this._childViews = [];
            },
            destruct: function() {
                utils.invoke(this.childViews(), "destruct");
                Base.prototype.destruct.call(this);
            },
            _layout: function() {
                utils.invoke(this.childViews(), "layout");
                return this;
            },
            childViews: function(val, destruct) {
                if (!arguments.length) return this._childViews;
                utils.forEach(this.childViews(), function(child) {
                    this.removeChild(child);
                    if (destruct !== false) {
                        child.destruct();
                    }
                }, this);
                require(6).build(val).forEach(function(child) {
                    this.appendChild(child);
                }, this);
                return this;
            },
            firstChild: function() {
                return this.childViews()[0];
            },
            lastChild: function() {
                return this.childViews()[this.childViews().length - 1];
            },
            removeChild: function(child) {
                child.parent(null);
                var index = child._viewIndex, i, l;
                for (i = index + 1, l = this._childViews.length; i < l; i++) {
                    this._childViews[i]._viewIndex--;
                }
                this._childViews = utils.without(this._childViews, child);
                this._removeChildFromDom(child);
                this._childrenChanged();
                if (this._childViews.length === 0 && this.typeName === "Attaching") {
                    this._dom = null;
                    require(11).Attaching.removeInstance(this._instanceId);
                }
                return this;
            },
            _removeChildFromDom: function(child) {
                dom.removeElement(child.dom());
            },
            insertChild: function(child) {
                child._viewIndex = this._childViews.length;
                this._childViews.push(child);
                child.parent(this);
                if (this.domForChild(child).firstChild) {
                    this._insertBeforeInDom(child, this.domForChild(child).firstChild);
                } else {
                    this._appendChildToDom(child);
                }
                this._childrenChanged();
                return this;
            },
            appendChild: function(child) {
                child._viewIndex = this._childViews.length;
                this._childViews.push(child);
                child.parent(this);
                this._appendChildToDom(child);
                this._childrenChanged();
                return this;
            },
            _appendChildToDom: function(child) {
                this.domForChild(child).appendChild(child.dom());
            },
            insertBefore: function(child, beforeChild) {
                var i = beforeChild._viewIndex, l = this._childViews.length;
                child._viewIndex = beforeChild._viewIndex;
                for (; i < l; i++) {
                    this._childViews[i]._viewIndex++;
                }
                this._childViews.splice(beforeChild._viewIndex - 1, 0, child);
                child.parent(this);
                this._insertBeforeInDom(child, beforeChild);
                this._childrenChanged();
                return this;
            },
            _insertBeforeInDom: function(child, beforeChild) {
                this.domForChild(child).insertBefore(child.dom(), beforeChild.dom ? beforeChild.dom() : beforeChild);
            },
            _childrenChanged: function() {},
            domForChild: function(child) {
                return this.dom();
            }
        });
        exports.Container = Container;
    };
    require_modules[15] = function(global, module, require) {
        var exports = this;
        1;
        var view = require(10), utils = require(4), fun = require(7), env = require(3), dom = require(13), evt = require(12), Binding = require(16).Binding;
        var POS_RULES = [ "top", "right", "left", "bottom", "wiidth", "height", "marginLeft", "marginTop", "marginBottom", "marginRight", "max-width", "max-height" ], POS_MAP = {
            t: "top",
            r: "right",
            l: "left",
            b: "bottom",
            w: "width",
            h: "height",
            ml: "marginLeft",
            mr: "marginRight",
            mt: "marginTop",
            mb: "marginBottom",
            mw: "max-width",
            mh: "max-height",
            p: "position"
        };
        function styleToString(style) {
            if (typeof style === "string") return style;
            var result = [];
            utils.forEach(style, function(value, key) {
                result.push(utils.dasherize(key) + ":" + value);
            });
            return result.join(";");
        }
        var Base = view.newClass("Base", {
            init: function(initArgs) {
                initArgs = initArgs || {};
                this._setup(initArgs);
                this._createDom(initArgs);
                this.dom()[env.expando] = this.dom()[env.expando] || env.guid++;
                view.register(this);
            },
            destruct: function() {
                view.unregisterId(this);
                view.unregister(this);
                this.removeListener();
                this.bindings([]);
                this.destructed = true;
                var parent = this.parent();
                if (parent && parent.removeChild) {
                    parent.removeChild(this);
                }
                this._dom = null;
            },
            _setup: fun.FS,
            _createDom: function(initArgs) {
                this._dom = dom.createElement(initArgs.tagName || "div");
            },
            _initLayout: fun.FS,
            _layout: fun.FS,
            layout: function() {
                if (this.visible()) {
                    if (!this._layoutBefore) {
                        this._layoutBefore = true;
                        this._initLayout();
                    }
                    this._layout();
                }
                return this;
            },
            layoutIfVisible: function() {
                if (this.dom() && this.dom().offsetWidth) {
                    this.layout();
                }
                return this;
            },
            dom: function() {
                return this._dom;
            },
            visible: fun.newProp("visible", function(state) {
                var origState = this.visible();
                this._visible = state;
                this.dom().style.display = state ? "" : "none";
                if (state && !origState) {
                    this.layoutIfVisible();
                }
                return this;
            }),
            _visible: true,
            html: fun.newDelegateProp("dom", "innerHTML"),
            text: function(v) {
                return arguments.length ? this.html(dom.escapeHTML(v)) : this.html();
            },
            id: function(id) {
                if (!arguments.length) {
                    return this.dom().id;
                }
                if (this.dom().id) {
                    view.unregisterId(this);
                }
                this.dom().id = id;
                view.registerId(this);
                return this;
            },
            className: fun.newDelegateProp("dom", "className"),
            addClass: function(className) {
                dom.addClass(this.dom(), className);
                return this;
            },
            hasClass: function(className) {
                return dom.hasClass(this.dom(), className);
            },
            removeClass: function(className) {
                dom.removeClass(this.dom(), className);
                return this;
            },
            toggleClass: function(className, condition) {
                dom.toggleClass(this.dom(), className, condition);
                return this;
            },
            scrollTop: fun.newDelegateProp("dom", "scrollTop"),
            scrollLeft: fun.newDelegateProp("dom", "scrollLeft"),
            scroll: function(dx, dy) {
                dx && this.scrollLeft(this.scrollLeft() + dx);
                dy && this.scrollTop(this.scrollTop() + dy);
            },
            title: fun.newDelegateProp("dom", "title"),
            style: function(value) {
                if (!arguments.length) {
                    return this.dom().style;
                }
                this.dom().style.cssText = styleToString(value);
                return this;
            },
            addStyle: function(value) {
                this.dom().style.cssText += ";" + styleToString(value);
                return this;
            },
            textSelectable: fun.newProp("textSelectable", function(state) {
                this._textSelectable = state;
                this.toggleClass("uki-textSelectable_off", !state);
                this[state ? "removeListener" : "addListener"]("selectstart", evt.preventDefaultHandler);
            }),
            domForEvent: function(type) {
                return this.dom();
            },
            addListener: function(names, callback) {
                if (typeof names === "object") {
                    utils.forEach(names, function(callback, name) {
                        this.addListener(name, callback);
                    }, this);
                } else {
                    var wrapper = typeof callback === "string" ? Base.controllerCallback(callback) : fun.bindOnce(callback, this);
                    this._eventNames || (this._eventNames = {});
                    utils.forEach(names.split(" "), function(name) {
                        this._eventNames[name] = true;
                        evt.addListener(this.domForEvent(name), name, wrapper);
                    }, this);
                }
                return this;
            },
            removeListener: function(names, callback) {
                var wrapper = callback && fun.bindOnce(callback, this);
                names || (names = utils.keys(this._eventNames || {}).join(" "));
                utils.forEach(names.split(" "), function(name) {
                    evt.removeListener(this.domForEvent(name), name, wrapper);
                }, this);
                return this;
            },
            trigger: function(e) {
                var node = this.domForEvent(e.type);
                var wrapped = evt.createEvent(e, {
                    _targetView: this
                });
                var result = evt.trigger(node, wrapped);
                evt.destroyEvent(wrapped);
                return result;
            },
            parent: function(parent) {
                if (!arguments.length) {
                    return this._parent;
                }
                this._parent = parent;
                return this;
            },
            prevView: function() {
                if (!this.parent()) {
                    return null;
                }
                return this.parent().childViews()[this._viewIndex - 1] || null;
            },
            nextView: function() {
                if (!this.parent()) {
                    return null;
                }
                return this.parent().childViews()[this._viewIndex + 1] || null;
            },
            childViews: function() {
                return [];
            },
            pos: function(pos) {
                if (!arguments.length) {
                    return this._styleToPos(this.dom().style);
                }
                pos = this._expandPos(pos);
                this.addStyle(pos);
                return this;
            },
            _styleToPos: function(style) {
                var res = {};
                utils.forEach(POS_RULES, function(rule) {
                    if (style[rule]) {
                        res[rule] = style[rule];
                    }
                });
                return res;
            },
            _expandPos: function(pos) {
                if (typeof pos === "string") {
                    var p = pos;
                    pos = {};
                    utils.forEach(p.split(/\s+/), function(rule) {
                        var parts = rule.split(":");
                        parts[1].match(/\D/) || (parts[1] += "px");
                        pos[parts[0]] = parts[1];
                    });
                }
                utils.forEach(POS_MAP, function(longRule, shortRule) {
                    if (pos[shortRule]) pos[longRule] = pos[shortRule];
                });
                if (!pos.position) pos.position = "absolute";
                return pos;
            },
            clientRect: function(ignoreScroll) {
                return dom.clientRect(this.dom(), ignoreScroll);
            },
            bindingOptions: fun.newProp("bindingOptions"),
            bindings: fun.newProp("bindings", function(val) {
                val = val || [];
                utils.invoke(this.bindings() || [], "destruct");
                this._bindings = utils.map(val, this._createBinding, this);
            }),
            _createBinding: function(options) {
                options = utils.extend(this.bindingOptions(), options);
                options.view = this;
                return new Binding(options);
            },
            binding: function(val) {
                if (val === "undefined") {
                    return this.bindings()[0];
                }
                return this.bindings(val && [ val ]);
            }
        });
        Base.prototype.on = Base.prototype.addListener;
        exports.Base = Base;
    };
    require_modules[16] = function(global, module, require) {
        var exports = this;
        var fun = require(7), utils = require(4);
        var Binding = fun.newClass({
            view: null,
            model: null,
            modelProp: "value",
            viewProp: "value",
            modelEvent: "",
            viewEvent: "blur",
            init: function(options) {
                utils.extend(this, options);
                if (!this.modelEvent) {
                    this.modelEvent = "change." + this.modelProp;
                }
                if (this.model && this.view) {
                    this.view.on(this.viewEvent, fun.bindOnce(this.updateModel, this));
                    this.model.on(this.modelEvent, fun.bindOnce(this.updateView, this));
                    if (this.sync !== false) {
                        this.updateView();
                    }
                }
            },
            destruct: function() {
                if (this.model && this.view) {
                    this.view.removeListener(this.viewEvent, fun.bindOnce(this.updateModel, this));
                    this.model.removeListener(this.modelEvent, fun.bindOnce(this.updateView, this));
                }
            },
            viewValue: function(value) {
                return arguments.length ? utils.prop(this.view, this.viewProp, value) : utils.prop(this.view, this.viewProp);
            },
            modelValue: function(value) {
                return arguments.length ? utils.prop(this.model, this.modelProp, value) : utils.prop(this.model, this.modelProp);
            },
            updateModel: function(e) {
                this._lockUpdate(function() {
                    this.modelValue(this.viewValue());
                });
            },
            updateView: function(e) {
                this._lockUpdate(function() {
                    this.viewValue(this.modelValue());
                });
            },
            _lockUpdate: function(callback) {
                if (!this._updating && this.viewValue() != this.modelValue()) {
                    this._updating = true;
                    try {
                        callback.call(this);
                    } catch (e) {
                        this._updating = false;
                        throw e;
                    }
                    this._updating = false;
                }
            }
        });
        exports.Binding = Binding;
    };
    require_modules[17] = function(global, module, require) {
        var exports = this;
        var utils = require(4), env = require(3), evt = require(12);
        var gesture = {
            draggable: null,
            position: null,
            cursor: null
        };
        var handlers = {}, mark = "__draggesturebound";
        var addDraggestures = {
            setup: function(el) {
                if (el[mark]) {
                    el[mark]++;
                } else {
                    el[mark] = 1;
                    evt.on(el, "mousedown touchstart", dragGestureStart);
                }
            },
            teardown: function(el) {
                el[mark]--;
                if (!el[mark]) {
                    evt.removeListener(el, "mousedown touchstart", dragGestureStart);
                }
            }
        };
        utils.extend(evt.special, {
            draggesturestart: addDraggestures,
            draggestureend: addDraggestures,
            draggesture: addDraggestures
        });
        function startGesture(el, e) {
            if (gesture.draggable) return;
            gesture.draggable = e.draggable || el;
            if (e.cursor) {
                gesture.cursor = env.doc.body.style.cursor;
                env.doc.body.style.cursor = e.cursor;
            }
            evt.on(env.doc, "mousemove scroll touchmove", dragGesture);
            evt.on(env.doc, "mouseup dragend touchend touchcancel", dragGestureEnd);
            evt.on(env.doc, "selectstart mousedown touchstart", evt.preventDefaultHandler);
        }
        function stopGesture() {
            gesture.draggable = null;
            env.doc.body.style.cursor = gesture.cursor;
            gesture.cursor = null;
            evt.removeListener(env.doc, "mousemove scroll touchmove", dragGesture);
            evt.removeListener(env.doc, "mouseup dragend touchend touchcancel", dragGestureEnd);
            evt.removeListener(env.doc, "selectstart mousedown touchstart", evt.preventDefaultHandler);
        }
        function addOffset(e) {
            e.dragOffset = {
                x: e.pageX - gesture.position.x,
                y: e.pageY - gesture.position.y
            };
        }
        function dragGestureStart(e) {
            e = evt.createEvent(e, {
                type: "draggesturestart",
                simulatePropagation: true
            });
            e.dragOffset = {
                x: 0,
                y: 0
            };
            evt.trigger(this, e);
            if (!e.isDefaultPrevented()) {
                gesture.position = {
                    x: e.pageX,
                    y: e.pageY
                };
                startGesture(this, e);
            }
            evt.destroyEvent(e);
        }
        function dragGesture(e) {
            e = evt.createEvent(e, {
                type: "draggesture",
                simulatePropagation: true
            });
            addOffset(e);
            evt.trigger(gesture.draggable, e);
            if (e.isDefaultPrevented()) stopGesture(gesture.draggable);
            evt.destroyEvent(e);
        }
        function dragGestureEnd(e) {
            e = evt.createEvent(e, {
                type: "draggestureend",
                simulatePropagation: true
            });
            addOffset(e);
            evt.trigger(gesture.draggable, e);
            stopGesture(gesture.draggable);
            evt.destroyEvent(e);
        }
        module.exports = gesture;
    };
    require_modules[18] = function(global, module, require) {
        var exports = this;
        var utils = require(4), fun = require(7);
        var Observable = {
            addListener: function(names, callback) {
                utils.forEach(names.split(" "), function(name) {
                    if (!this._listeners) {
                        this._listeners = {};
                    }
                    if (!this._listeners[name]) {
                        this._listeners[name] = [];
                    }
                    this._listeners[name].push(callback);
                }, this);
                return this;
            },
            removeListener: function(names, callback) {
                if (!names) {
                    delete this._listeners;
                } else {
                    var listeners = this._listeners;
                    if (listeners) {
                        utils.forEach(names.split(" "), function(name) {
                            if (listeners[name]) {
                                listeners[name] = callback ? utils.without(listeners[name], callback) : [];
                            }
                        }, this);
                    }
                }
                return this;
            },
            trigger: function(e) {
                var type = e.type, listeners = this._listeners;
                if (listeners && listeners[type]) {
                    utils.forEach(listeners[type], function(callback) {
                        callback.call(this, e);
                    }, this);
                }
                return this;
            },
            destruct: function() {
                delete this._listeners;
            },
            triggerChanges: function(name) {
                this.trigger({
                    type: "change." + name,
                    model: this
                });
                this.trigger({
                    type: "change",
                    name: name,
                    model: this
                });
                return this;
            },
            muteEvents: function(value) {
                if (!arguments.length) {
                    return this._originalTrigger && this.trigger !== this._originalTrigger;
                }
                if (!this._originalTrigger) {
                    this._originalTrigger = this.trigger;
                }
                this.trigger = value ? fun.FS : this._originalTrigger;
                return this;
            }
        };
        Observable.on = Observable.addListener;
        function newProp(prop, setter) {
            var propName = "_" + prop;
            return function(value) {
                if (!arguments.length) {
                    return this[propName];
                }
                var oldValue = this[prop](), newValue;
                if (setter) {
                    setter.call(this, value);
                } else {
                    this[propName] = value;
                }
                newValue = this[prop]();
                if (oldValue !== newValue) {
                    this.triggerChanges(prop);
                }
                return this;
            };
        }
        Observable.newProp = newProp;
        Observable.addProps = Observable.addProp = function(proto, prop, setter) {
            if (utils.isArray(prop)) {
                for (var i = 0, len = prop.length; i < len; i++) {
                    proto[prop[i]] = newProp(prop[i], setter && setter[i]);
                }
            } else {
                proto[prop] = newProp(prop, setter);
            }
        };
        exports.Observable = Observable;
    };
    require_modules[19] = function(global, module, require) {
        var exports = this;
        var utils = require(4), dom = require(13);
        var Renderer = function() {};
        var otag = "{{", ctag = "}}", sectionRegex = new RegExp(otag + "(\\^|\\#)\\s*(.+)\\s*" + ctag + "\n*([\\s\\S]+?)" + otag + "\\/\\s*\\2\\s*" + ctag + "\\s*", "mg"), tagRegex = new RegExp(otag + "(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?" + ctag + "+", "g"), is_array = utils.isArray, trim = utils.trim;
        function includes(needle, haystack) {
            return haystack.indexOf(otag + needle) != -1;
        }
        function is_kinda_truthy(bool) {
            return bool === false || bool === 0 || bool;
        }
        function is_object(a) {
            return a && typeof a == "object";
        }
        Renderer.prototype = {
            buffer: [],
            context: {},
            render: function(template, context, partials, in_recursion) {
                if (!in_recursion) {
                    this.context = context;
                    this.buffer = [];
                }
                if (!includes("", template)) {
                    if (in_recursion) {
                        return template;
                    } else {
                        this.send(template);
                        return;
                    }
                }
                var html = this.render_section(template, context, partials);
                if (in_recursion) {
                    return this.render_tags(html, context, partials, in_recursion);
                }
                this.render_tags(html, context, partials, in_recursion);
            },
            send: function(line) {
                if (line != "") {
                    this.buffer.push(line);
                }
            },
            render_partial: function(name, context, partials) {
                name = trim(name);
                if (!partials || partials[name] === undefined) {
                    throw {
                        message: "unknown_partial '" + name + "'"
                    };
                }
                if (typeof context[name] != "object") {
                    return this.render(partials[name], context, partials, true);
                }
                return this.render(partials[name], context[name], partials, true);
            },
            render_section: function(template, context, partials) {
                if (!includes("#", template) && !includes("^", template)) {
                    return template;
                }
                var that = this;
                return template.replace(sectionRegex, function(match, type, name, content) {
                    var value = that.find(name, context);
                    if (type == "^") {
                        if (!value || is_array(value) && value.length === 0) {
                            return that.render(content, context, partials, true);
                        } else {
                            return "";
                        }
                    } else if (type == "#") {
                        if (is_array(value)) {
                            return utils.map(value, function(row) {
                                return that.render(content, that.create_context(row), partials, true);
                            }).join("");
                        } else if (is_object(value)) {
                            return that.render(content, that.create_context(value), partials, true);
                        } else if (typeof value === "function") {
                            return value.call(context, content, function(text) {
                                return that.render(text, context, partials, true);
                            });
                        } else if (value) {
                            return that.render(content, context, partials, true);
                        } else {
                            return "";
                        }
                    }
                });
            },
            render_tags: function(template, context, partials, in_recursion) {
                var that = this;
                var tag_replace_callback = function(match, operator, name) {
                    switch (operator) {
                      case "!":
                        return "";
                      case ">":
                        return that.render_partial(name, context, partials);
                      case "{":
                        return that.find(name, context);
                      default:
                        return dom.escapeHTML(that.find(name, context));
                    }
                };
                var lines = template.split("\n");
                for (var i = 0; i < lines.length; i++) {
                    lines[i] = lines[i].replace(tagRegex, tag_replace_callback, this);
                    if (!in_recursion) {
                        this.send(lines[i]);
                    }
                }
                if (in_recursion) {
                    return lines.join("\n");
                }
            },
            find: function(name, context) {
                name = trim(name);
                var value;
                if (is_kinda_truthy(context[name])) {
                    value = context[name];
                } else if (is_kinda_truthy(this.context[name])) {
                    value = this.context[name];
                }
                if (typeof value === "function") {
                    return value.apply(context);
                }
                if (value !== undefined) {
                    return value;
                }
                return "";
            },
            create_context: function(_context) {
                if (is_object(_context)) {
                    return _context;
                } else {
                    var iterator = ".";
                    var ctx = {};
                    ctx[iterator] = _context;
                    return ctx;
                }
            }
        };
        var Mustache = {
            version: "0.3.1-uki",
            to_html: function(template, view, partials, send_fun) {
                var renderer = new Renderer;
                if (send_fun) {
                    renderer.send = send_fun;
                }
                renderer.render(template, view, partials);
                if (!send_fun) {
                    return renderer.buffer.join("\n");
                }
            }
        };
        exports.Mustache = Mustache;
    };
    require_modules[20] = function(global, module, require) {
        var exports = this;
        var env = require(3), dom = require(13), fun = require(7);
        var Focusable = {};
        Focusable.focusableDom = function() {
            return this.dom();
        };
        Focusable._domForEvent = function(type) {
            if (type == "focus" || type == "blur") {
                return this.focusableDom();
            }
            return false;
        };
        fun.delegateProp(Focusable, "tabIndex", "focusableDom");
        Focusable.focus = function() {
            this.focusableDom().focus();
            return this;
        };
        Focusable.blur = function() {
            this.focusableDom().blur();
            return this;
        };
        Focusable.hasFocus = function() {
            return this.focusableDom() == env.doc.activeElement;
        };
        Focusable.nextFocusable = function(wrapping, sameLevelOnly) {
            var p = this.parent();
            if (p === null) return;
            p = p._childViews;
            sameLevelOnly = !!sameLevelOnly;
            wrapping = !!wrapping;
            var length = p.length;
            var control = getNextControl(p, this._viewIndex + 1, length, sameLevelOnly);
            if (!control && wrapping) {
                control = getNextControl(p, 0, this._viewIndex, sameLevelOnly);
            }
            return control;
        };
        function getNextControl(views, start, end, sameLevelOnly) {
            var found = false, control = null;
            for (var i = start; i < end; i++) {
                if (views[i].focus && views[i].visible && views[i].visible() && !views[i].disabled()) {
                    found = views[i];
                    break;
                } else if (!sameLevelOnly) {
                    if (views[i]._childViews.length > 0) {
                        found = getNextControl(views[i]._childViews, 0, views[i]._childViews.length, sameLevelOnly);
                        if (found) break;
                    }
                }
            }
            return found;
        }
        Focusable.priorFocusable = function(wrapping, sameLevelOnly) {
            var p = this.parent();
            if (p === null) return;
            p = p._childViews;
            sameLevelOnly = !!sameLevelOnly;
            wrapping = !!wrapping;
            var length = p.length;
            var control = getPriorControl(p, this._viewIndex - 1, 0, sameLevelOnly);
            if (!control && wrapping) control = getPriorControl(p, length - 1, this._viewIndex + 1, sameLevelOnly);
            return control;
        };
        function getPriorControl(views, start, end, sameLevelOnly) {
            var found = false, control = null;
            for (var i = start; i >= end; i--) {
                if (views[i].focus && views[i].visible && views[i].visible() && !views[i].disabled()) {
                    found = views[i];
                    break;
                } else if (!sameLevelOnly) {
                    if (views[i]._childViews.length > 0) {
                        found = getPriorControl(views[i]._childViews, views[i]._childViews.length - 1, 0, sameLevelOnly);
                        if (found) break;
                    }
                }
            }
            return found;
        }
        exports.Focusable = Focusable;
    };
    require_modules[21] = function(global, module, require) {
        var exports = this;
        1;
        var view = require(10), utils = require(4);
        utils.extend(view, require(22), require(23), require(24), require(25), require(26), require(27), require(28), require(29), {
            dataList: utils.extend({}, require(30), require(33), require(31), require(32))
        }, require(34), {
            dataTable: utils.extend({}, require(35))
        });
        module.exports = view;
    };
    require_modules[22] = function(global, module, require) {
        var exports = this;
        1;
        var fun = require(7), view = require(10), dom = require(13), Base = require(15).Base, Focusable = require(20).Focusable;
        var Button = view.newClass("Button", Base, Focusable, {
            labelHtml: function(value) {
                if (!arguments.length) {
                    return this._text.innerHTML;
                }
                this._text.innerHTML = value;
                updateImageOnly.call(this);
                return this;
            },
            label: function(value) {
                return arguments.length ? this.labelHtml(dom.escapeHTML(value)) : this.labelHtml();
            },
            disabled: function(state) {
                if (!arguments.length) {
                    return this.dom().disabled;
                }
                this.dom().disabled = state ? "disabled" : "";
                this.toggleClass("uki-button_disabled", state);
                return this;
            },
            confirm: view.newToggleClassProp("uki-button_confirm"),
            iconSrc: fun.newProp("iconSrc", function(src) {
                dom.removeElement(this._iconDom);
                this._iconSrc = src;
                if (src) {
                    this._iconDom = dom.createElement("img", {
                        className: "uki-button__icon",
                        src: src
                    });
                    this.dom().insertBefore(this._iconDom, this._text);
                }
                updateImageOnly.call(this);
            }),
            _createDom: function() {
                this._text = dom.createElement("span", {
                    className: "uki-button__text"
                });
                this._dom = dom.createElement("button", {
                    className: "uki-button",
                    tabIndex: -1
                }, [ this._text ]);
            },
            destruct: function() {
                Base.prototype.destruct.call(this);
                this._text = null;
                this._iconDom = null;
            }
        });
        function updateImageOnly() {
            this.toggleClass("uki-button_image-only", !!(this.iconSrc() && !this.labelHtml()));
        }
        require(8).Collection.addProps([ "labelHTML", "label", "disabled", "confirm", "iconSrc" ]);
        exports.Button = Button;
    };
    require_modules[23] = function(global, module, require) {
        var exports = this;
        1;
        var fun = require(7), utils = require(4), view = require(10), dom = require(13), Container = require(14).Container;
        var Flow = view.newClass("Flow", Container, {
            spacing: view.newClassMapProp({
                none: "uki-flow_spacing-none",
                small: "uki-flow_spacing-small",
                medium: "uki-flow_spacing-medium",
                large: "uki-flow_spacing-large"
            }),
            horizontal: view.newToggleClassProp("uki-flow_horizontal"),
            _createDom: function() {
                this._dom = dom.createElement("ul", {
                    className: "uki-flow uki-flow_spacing-small"
                });
            },
            _removeChildFromDom: function(child) {
                this.dom().removeChild(child.dom().parentNode);
            },
            _appendChildToDom: function(child) {
                var flowClass = utils.prop(child, "flowRowClass");
                var li = dom.createElement("li", {
                    className: "uki-flow-item" + (flowClass ? " " + flowClass : "")
                });
                li.appendChild(child.dom());
                this.dom().appendChild(li);
            },
            _insertBeforeInDom: function(child, beforeChild) {
                this.dom().insertBefore(child.dom().parentNode, beforeChild.dom().parentNode);
            }
        });
        require(8).Collection.addProps([ "horizontal" ]);
        exports.Flow = Flow;
    };
    require_modules[24] = function(global, module, require) {
        var exports = this;
        1;
        var fun = require(7), view = require(10), utils = require(4), dom = require(13), env = require(3), evt = require(12), Focusable = require(20).Focusable, Base = require(15).Base;
        var ieResize = env.ua.match(/MSIE 6|7/);
        var NativeControl = view.newClass("NativeControl", Base, Focusable, {
            focusableDom: function() {
                return this._input;
            },
            domForEvent: function(type) {
                return Focusable._domForEvent.call(this, type) || Base.prototype.domForEvent.call(this, type);
            },
            destruct: function() {
                Base.prototype.destruct.call(this);
                this._input = null;
                this._label = null;
            }
        });
        fun.delegateProp(NativeControl.prototype, [ "name", "checked", "disabled", "value", "type", "accessKey", "id", "autocomplete", "autofocus", "required", "pattern", "readonly", "maxlength", "spellcheck" ], "_input");
        fun.delegateProp(NativeControl.prototype, [ "width", "height" ], "_input", [ "style.width", "style.height" ]);
        var Output = view.newClass("nativeControl.Output", NativeControl, {
            _createDom: function(initArgs) {
                this._input = dom.createElement("output", {
                    className: "uki-nc-output__output",
                    type: "text"
                });
                this._dom = dom.createElement(initArgs.tagName || "span", {
                    className: "uki-nc-output"
                });
                this.dom().appendChild(this._input);
            }
        });
        fun.delegateProp(Output.prototype, "for", "_input");
        var Radio = view.newClass("nativeControl.Radio", NativeControl, {
            _createDom: function(initArgs) {
                this._input = dom.createElement("input", {
                    className: "uki-nc-radio__input",
                    type: "radio"
                });
                this._label = dom.createElement("span", {
                    className: "uki-nc-radio__label"
                });
                this._dom = dom.createElement(initArgs.tagName || "label", {
                    className: "uki-nc-radio"
                }, [ this._input, this._label ]);
            },
            _bindingOptions: {
                viewEvent: "click",
                viewProp: "checked",
                commitChangesViewEvent: "click"
            }
        });
        fun.delegateProp(Radio.prototype, "html", "_label", "innerHTML");
        var Checkbox = view.newClass("nativeControl.Checkbox", NativeControl, {
            _createDom: function(initArgs) {
                this._input = dom.createElement("input", {
                    className: "uki-nc-checkbox__input",
                    type: "checkbox"
                });
                this._label = dom.createElement("span", {
                    className: "uki-nc-checkbox__label"
                });
                this._dom = dom.createElement(initArgs.tagName || "label", {
                    className: "uki-nc-checkbox"
                }, [ this._input, this._label ]);
            },
            _bindingOptions: Radio.prototype._bindingOptions
        });
        fun.delegateProp(Checkbox.prototype, "html", "_label", "innerHTML");
        var Text = view.newClass("nativeControl.Text", NativeControl, {
            _createDom: function(initArgs) {
                this._input = dom.createElement("input", {
                    className: "uki-nc-text__input",
                    type: "text"
                });
                initArgs.focus && this._input.addClass("initfocus");
                this._dom = dom.createElement(initArgs.tagName || "span", {
                    className: "uki-nc-text"
                });
                this.dom().appendChild(this._input);
            },
            destruct: function() {
                NativeControl.prototype.destruct.call(this);
                this._placeholderDom = null;
            },
            placeholder: fun.newProp("placeholder", function(v) {
                this._placeholder = v;
                this._initPlaceholder();
                this._placeholderDom.innerHTML = dom.escapeHTML(v);
            }),
            _layout: function() {
                this._updatePlaceholderHeight();
                if (ieResize) {
                    this._input.style.width = this.dom().offsetWidth - 6;
                }
            },
            _initPlaceholder: function() {
                if (this._initedPlaceholder) return;
                this._initedPlaceholder = true;
                this.addClass("uki-nc-text_with-placeholder");
                this._placeholderDom = dom.createElement("span", {
                    className: "uki-nc-text__placholder"
                });
                this.textSelectable(false);
                this.dom().insertBefore(this._placeholderDom, this.dom().firstChild);
                evt.on(this._placeholderDom, "click", fun.bindOnce(function() {
                    this.focus();
                }, this));
                if (this._input.offsetHeight) {
                    this._updatePlaceholderHeight();
                }
            },
            _updatePlaceholderVis: function() {
                this._placeholderDom.style.display = this.hasFocus() || this.value() ? "none" : "";
            },
            _updatePlaceholderHeight: function() {
                if (!this._placeholderDom) return;
                var targetStyle = this._placeholderDom.style, sourceStyle = dom.computedStyle(this._input);
                utils.forEach([ "font", "fontFamily", "fontSize", "paddingLeft", "paddingTop", "padding" ], function(name) {
                    if (sourceStyle[name] !== undefined) {
                        targetStyle[name] = sourceStyle[name];
                    }
                });
                targetStyle.lineHeight = this._input.offsetHeight + (parseInt(sourceStyle.marginTop, 10) || 0) * 2 + "px";
                targetStyle.marginLeft = (parseInt(sourceStyle.marginLeft, 10) || 0) + (parseInt(sourceStyle.borderLeftWidth, 10) || 0) + "px";
                targetStyle.width = "98%";
                targetStyle.textAlign = "right";
            },
            width: function(v) {
                if (arguments.length) {
                    this._dom.style.width = v;
                    this._input.style.width = "100%";
                }
                return this._dom.style.width;
            },
            height: function(v) {
                if (arguments.length) {
                    this._dom.style.height = v;
                    this._input.style.height = "100%";
                }
                return this._input.style.height;
            }
        });
        var TextArea = view.newClass("nativeControl.TextArea", NativeControl, {
            _createDom: function(initArgs) {
                this._input = dom.createElement("textarea", {
                    className: "uki-nc-textarea__input",
                    type: "text"
                });
                initArgs.focus && this._input.addClass("initfocus");
                this._dom = dom.createElement(initArgs.tagName || "span", {
                    className: "uki-nc-textarea"
                });
                this.dom().appendChild(this._input);
                if (initArgs["id"] != null) {
                    this._input.id = "textarea" + initArgs["id"];
                }
            },
            destruct: function() {
                NativeControl.prototype.destruct.call(this);
                this._placeholderDom = null;
            },
            _placeHolderAutoHide: true,
            placeHolderAutoHide: fun.newProp("placeHolderAutoHide"),
            rows: fun.newProp("rows", function(v) {
                this._input.rows = v;
            }),
            cols: fun.newProp("cols", function(v) {
                this._input.style.width = "auto";
                this._dom.style.width = "auto";
                this._input.cols = v;
            }),
            width: function(v) {
                if (arguments.length) {
                    this._dom.style.width = v;
                    this._input.style.width = "100%";
                }
                return this._dom.style.width;
            },
            height: function(v) {
                if (arguments.length) {
                    this._dom.style.height = v;
                    this._input.style.height = "100%";
                    this._updatePlaceholderHeight();
                }
                return this._dom.style.height;
            },
            placeholder: fun.newProp("placeholder", function(v) {
                this._placeholder = v;
                this._initPlaceholder();
                this._placeholderDom.innerHTML = dom.escapeHTML(v);
            }),
            _layout: function() {
                this._updatePlaceholderHeight();
                if (ieResize) {
                    this._input.style.width = this.dom().offsetWidth - 6;
                }
            },
            _initPlaceholder: function() {
                if (this._initedPlaceholder) return;
                this._initedPlaceholder = true;
                this.addClass("uki-nc-textarea_with-placeholder");
                this._placeholderDom = dom.createElement("div", {
                    className: "uki-nc-textarea__placholder"
                });
                this.textSelectable(false);
                this.dom().insertBefore(this._placeholderDom, this.dom().firstChild);
                evt.on(this._placeholderDom, "click", fun.bindOnce(function() {
                    this.focus();
                }, this));
                this.on("mouseup", this._updatePlaceholderHeight);
            },
            _updatePlaceholderVis: function() {
                if (this._placeHolderAutoHide) {
                    this._placeholderDom.style.display = this.hasFocus() || this.value() ? "none" : "";
                }
            },
            _updatePlaceholderHeight: function() {
                if (!this._placeholderDom) return;
                var targetStyle = this._placeholderDom.style, sourceStyle = dom.computedStyle(this._input);
                utils.forEach([ "font", "fontFamily", "fontSize", "paddingLeft", "paddingTop", "padding" ], function(name) {
                    if (sourceStyle[name] !== undefined) {
                        targetStyle[name] = sourceStyle[name];
                    }
                });
                targetStyle.marginTop = this._input.offsetHeight + (parseInt(sourceStyle.marginTop, 10) || 0) * 2 - 16 + "px";
                targetStyle.width = "99%";
                targetStyle.marginLeft = (parseInt(sourceStyle.marginLeft, 10) || 0) + (parseInt(sourceStyle.borderLeftWidth, 10) || 0) + "px";
                targetStyle.textAlign = "right";
            }
        });
        var Image = view.newClass("nativeControl.Image", NativeControl, {
            _createDom: function(initArgs) {
                this._dom = this._input = dom.createElement("img", {
                    className: "uki-nc-image"
                });
            },
            height: fun.newProp("height", function(val) {
                if (arguments.length) this._input.style.height = val;
                return this._input.style.height;
            })
        });
        fun.delegateProp(NativeControl.prototype, [ "src" ], "_input");
        var SVG = view.newClass("nativeControl.SVG", NativeControl, {
            _createDom: function(initArgs) {
                this._input = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                this._input.setAttribute("xmlns", "http://www.w3.org/2000/svg/");
                this._input.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
                this._input.setAttribute("class", "uki-nc-svg");
                this._input.setAttribute("version", "1.1");
                this._dom = dom.createElement("div", {
                    className: "uki-nc-svg-wrapper",
                    tabIndex: -1
                }, [ this._input ]);
                this.on("click", this.focus);
            },
            focus: function() {
                try {
                    this._dom.focus();
                } catch (err) {}
            },
            destruct: function() {
                this.trigger({
                    type: "destruction"
                });
                NativeControl.prototype.destruct.call(this);
            },
            hasFocus: function() {
                return this._dom == env.doc.activeElement;
            },
            blur: function() {
                try {
                    if (this.hasFocus()) this._dom.blur();
                } catch (err) {}
            }
        });
        var Canvas = view.newClass("nativeControl.Canvas", NativeControl, {
            _createDom: function(initArgs) {
                this._dom = this._input = dom.createElement("canvase", {
                    className: "uki-nc-canvas"
                });
            },
            destruct: function() {
                this.trigger({
                    type: "destruction"
                });
                NativeControl.prototype.destruct.call(this);
            }
        });
        var Button = view.newClass("nativeControl.Button", NativeControl, {
            _createDom: function(initArgs) {
                this._dom = this._input = dom.createElement("input", {
                    className: "uki-nc-button",
                    type: "button"
                });
            }
        });
        var Select = view.newClass("nativeControl.Select", NativeControl, {
            _createDom: function(initArgs) {
                this._input = this._dom = dom.createElement("select", {
                    className: "uki-nc-select uki-nc-select__input"
                });
            },
            options: fun.newProp("options", function(val) {
                this._options = val;
                this._input.innerHTML = "";
                appendOptions(this._input, val);
                return this;
            })
        });
        fun.delegateProp(NativeControl.prototype, [ "selectedIndex" ], "_input");
        function appendOptions(root, options) {
            var node;
            utils.forEach(options, function(option) {
                if (typeof option === "string" || typeof option === "number") {
                    option = {
                        text: option,
                        value: option
                    };
                }
                if (option.options) {
                    node = dom.createElement("optgroup", {
                        label: option.html ? option.html : dom.escapeHTML(option.text)
                    });
                    appendOptions(node, option.options);
                } else {
                    node = dom.createElement("option", {
                        html: option.html ? option.html : dom.escapeHTML(option.text),
                        value: option.value,
                        selected: option.selected
                    });
                }
                root.appendChild(node);
            });
        }
        require(8).Collection.addProps([ "name", "checked", "disabled", "value", "type", "placeholder", "disabled", "options", "selectedIndex", "src" ]);
        exports.nativeControl = {
            NativeControl: NativeControl,
            Radio: Radio,
            Checkbox: Checkbox,
            Text: Text,
            Button: Button,
            Select: Select,
            TextArea: TextArea,
            Image: Image,
            SVG: SVG,
            Canvas: Canvas,
            Output: Output
        };
    };
    require_modules[25] = function(global, module, require) {
        var exports = this;
        1;
        var fun = require(7), dom = require(13), view = require(10), Base = require(15).Base;
        var Text = view.newClass("Text", Base, {
            _createDom: function() {
                this._dom = dom.createElement("div", {
                    className: "uki-text"
                });
            }
        });
        var P = view.newClass("P", Base, {
            _createDom: function() {
                this._dom = dom.createElement("p", {
                    className: "uki-text-p"
                });
            }
        });
        var Label = view.newClass("Label", Base, {
            _createDom: function(initArgs) {
                this._dom = dom.createElement(initArgs.tagName || "label", {
                    className: "uki-label"
                });
            },
            "for": fun.newDelegateProp("for", "dom")
        });
        var Header = view.newClass("Header", Base, {
            _createDom: function() {
                this._dom = dom.createElement("h1", {
                    className: "uki-header uki-header_size_medium"
                });
            },
            size: view.newClassMapProp({
                small: "uki-header_size_small",
                medium: "uki-header_size_medium",
                large: "uki-header_size_large"
            })
        });
        require(8).Collection.addProps([ "for" ]);
        exports.Text = Text;
        exports.P = P;
        exports.Label = Label;
        exports.Header = Header;
    };
    require_modules[26] = function(global, module, require) {
        var exports = this;
        "use strict";
        1;
        var fun = require(7), dom = require(13), view = require(10), utils = require(4), evt = require(12), env = require(3), Base = require(15).Base;
        var Menu = view.newClass("Menu", Base, {
            _createDom: function() {
                this._dom = dom.createElement("ul", {
                    className: "uki-menu-horizontal uki-menu-horizontal-no-touch uki-textSelectable_off"
                });
                this._hasTouch = false;
                this._options = [];
                this.on("click", fun.bindOnce(this._click, this));
                this.on("touchstart", fun.bindOnce(this._touchstart, this));
                this._bindedTouchOut = fun.bindOnce(this._touchout, this);
                this.on("touchend", this._touchprevent);
                this.on("touchmove", this._touchprevent);
            },
            destruct: function() {
                this._clearOptions(this._options);
                this._clearChildren(this._dom);
                if (this._hasTouch) {
                    evt.removeListener(env.doc, "click", this._bindedTouchOut);
                }
                Base.prototype.destruct.call(this);
                this._options = null;
            },
            _clearChildren: function(domNode, level) {
                try {
                    if (domNode.params) {
                        domNode.params = null;
                        delete domNode.params;
                    }
                    if (domNode.ondragstart) domNode.ondragstart = null;
                    if (domNode.childNodes) {
                        for (var i = domNode.childNodes.length - 1; i >= 0; i--) {
                            if (domNode.childNodes[i] == null) continue;
                            this._clearChildren(domNode.childNodes[i], level + 1);
                        }
                    }
                } catch (Err) {
                    console.error("Error", Err);
                }
            },
            _clearOptions: function(options) {
                for (var i = 0; i < options.length; i++) {
                    options[i].element = null;
                    if (options[i].options) {
                        this._clearOptions(options[i].options);
                        delete options[i].options;
                    }
                }
            },
            _touchout: function(event) {
                try {
                    var eles = this._dom.getElementsByClassName("uki-menu-focus");
                    for (var i = 0; i < eles.length; i++) {
                        dom.removeClass(eles[i], "uki-menu-focus");
                    }
                    this._closeMenu(this._dom);
                } catch (err) {}
            },
            _touchprevent: function(event) {
                event.stopPropagation();
                event.preventDefault();
                return false;
            },
            _lastElement: null,
            _touchstart: function(event) {
                if (!this._hasTouch) {
                    dom.removeClass(this._dom, "uki-menu-horizontal-no-touch");
                    evt.addListener(env.doc, "click", this._bindedTouchOut);
                    this._hasTouch = true;
                }
                event.stopPropagation();
                event.preventDefault();
                var e = event;
                if (event.baseEvent) {
                    e = event.baseEvent;
                }
                if (e.touches) {
                    var touch = e.touches[0];
                } else {
                    touch = e;
                }
                var target = touch.target;
                while (target.parentNode && target.tagName != "A") {
                    target = target.parentNode;
                }
                var clickedItem = target;
                if (target == null) return;
                var eles = this._dom.getElementsByClassName("uki-menu-focus");
                for (var i = 0; i < eles.length; i++) {
                    if (eles[i] != target) {
                        dom.removeClass(eles[i], "uki-menu-focus");
                    }
                }
                if (!dom.hasClass(target, "uki-menu-focus")) {
                    dom.addClass(target, "uki-menu-focus");
                } else {
                    if (dom.hasClass(target.parentNode, "uki-menu-primary")) {
                        dom.removeClass(target, "uki-menu-focus");
                        this._closeMenu(this._dom);
                        return;
                    }
                }
                target = target.nextSibling;
                while (target != null && target.nodeName == "#text") {
                    target = target.nextSibling;
                }
                if (target != null) {
                    this._closeMenu(target);
                    dom.addClass(target, "uki-menu-visible");
                } else {
                    this._closeMenu(this._dom);
                    var name = clickedItem.name;
                    if (clickedItem.href == "javascript:void(0);") {
                        this.trigger({
                            type: "menuClick",
                            name: name,
                            menu: this
                        });
                        try {
                            clickedItem.blur();
                        } catch (err) {
                            if (console.error) console.error(err);
                        }
                    }
                }
            },
            _closeMenu: function(domElement) {
                var eles = this._dom.getElementsByClassName("uki-menu-visible");
                for (var i = 0; i < eles.length; i++) {
                    if (!dom.isAChild(domElement, eles[i], this._dom) || this._dom === domElement) {
                        dom.removeClass(eles[i], "uki-menu-visible");
                    }
                }
            },
            _click: function(event) {
                event.preventDefault();
                event.stopPropagation();
                if (this._hasTouch === true) return;
                var target = event.target;
                while (target.parentNode && target.tagName != "A") {
                    target = target.parentNode;
                }
                var parentUl = target;
                while (parentUl.parentNode && parentUl.tagName != "UL") {
                    parentUl = parentUl.parentNode;
                }
                if (!dom.hasClass(parentUl, "uki-menu-horizontal")) {
                    parentUl.style.display = "none";
                    setTimeout(function() {
                        parentUl.style.display = "";
                    }, 500);
                }
                var name = target.name;
                if (target.href == "javascript:void(0);") {
                    this.trigger({
                        type: "menuClick",
                        name: name,
                        menu: this,
                        params: target.params
                    });
                }
            },
            options: fun.newProp("options", function(val) {
                if (arguments.length === 0) return this._options;
                this._options = val;
                this._dom.innerHTML = "";
                appendMenuOptions(this._dom, val, 0);
                return this;
            }),
            _options: []
        });
        function appendMenuOptions(root, options, level) {
            var node, node_li, node_a, className;
            utils.forEach(options, function(option) {
                if (typeof option === "string" || typeof option === "number") {
                    option = {
                        text: option
                    };
                }
                if (level == 0) className = "uki-menu-primary"; else className = "uki-menu";
                node_li = dom.createElement("li", {
                    className: className
                });
                if (option.text === "-" || option.text === "---" || option.text === "--") {
                    node_a = dom.createElement("hr");
                } else {
                    node_a = dom.createElement("a", {
                        draggable: false,
                        ondragstart: "return false;",
                        href: option.url ? option.url : "javascript:void(0);",
                        html: option.html ? option.html : dom.escapeHTML(option.text),
                        name: option.name ? option.name : option.text,
                        tabIndex: -1
                    });
                    if (option.params != null) node_a.params = option.params; else node_a.params = null;
                    if (option.accessKey) node_a.accessKey = option.accessKey;
                    if (option.className) dom.addClass(node_a, option.className);
                }
                option.element = node_a;
                if (option.visible === false) node_li.style.display = "none";
                option.setText = function(value) {
                    this.element.innerHTML = dom.escapeHTML(value);
                    this.text = value;
                };
                option.setHTML = function(value) {
                    this.element.innerHTML = value;
                    this.html = value;
                };
                option.value = function() {
                    return this.html ? this.html : this.text;
                };
                option.visibility = function(value) {
                    var e = this.element.parentNode.style;
                    if (value === true) {
                        e.display = "";
                    } else if (value === false) {
                        e.display = "none";
                    } else {
                        if (e.display == "none") return false;
                        return true;
                    }
                };
                node_li.appendChild(node_a);
                if (option.options && option.options.length > 0) {
                    node = dom.createElement("ul");
                    if (level > 0) dom.addClass(node_li, "uki-menu-submenu");
                    node_li.appendChild(node);
                    appendMenuOptions(node, option.options, level + 1);
                }
                root.appendChild(node_li);
            });
        }
        exports.Menu = Menu;
    };
    require_modules[27] = function(global, module, require) {
        var exports = this;
        1;
        var fun = require(7), utils = require(4), view = require(10), evt = require(12), dom = require(13), build = require(6).build, Mustache = require(19).Mustache, Container = require(14).Container, Focusable = require(20).Focusable;
        var SplitPane = view.newClass("SplitPane", Container, Focusable, {}), proto = SplitPane.prototype;
        proto._throttle = 0;
        proto._handlePosition = 200;
        proto._leftSpeed = 0;
        proto._rightSpeed = 1;
        proto._handleWidth = 1;
        proto._leftMin = 100;
        proto._rightMin = 100;
        proto._vertical = false;
        proto._setup = function(initArgs) {
            this._vertical = initArgs.vertical || this._vertical;
            this._handleWidth = initArgs.handleWidth || this._handleWidth;
            this._originalWidth = 0;
            this._exts = [];
            Container.prototype._setup.call(this, initArgs);
        };
        fun.addProps(proto, [ "leftMin", "rightMin", "leftSpeed", "rightSpeed", "throttle" ]);
        proto.topMin = proto.leftMin;
        proto.bottomMin = proto.rightMin;
        proto.topSpeed = proto.leftSpeed;
        proto.bottomSpeed = proto.rightSpeed;
        fun.addProp(proto, "handlePosition", function(val) {
            if (this._x_width()) {
                this._prevWidth = this._x_width();
                this._prevPosition = this._handlePosition = this._normalizeHandlePosition(val);
                this.layout();
            } else {
                this._handlePosition = val;
            }
        });
        proto._normalizeHandlePosition = function(pos) {
            pos = Math.min(pos, this._x_width() - this.rightMin() - this.handleWidth());
            pos = Math.max(pos, this.leftMin());
            return pos;
        };
        proto._moveHandle = function() {
            this._handle.style[this._x_leftName()] = this.handlePosition() + "px";
        };
        proto.extPositions = function(positions) {
            if (!arguments.length) {
                return utils.map(this._exts, function(ext) {
                    return this._styleToPos(ext.style);
                }, this);
            }
            utils.forEach(this._exts, function(ext) {
                this._handle.removeChild(ext);
            }, this);
            this._exts = positions.map(function(pos) {
                var ext = dom.createElement("div", {
                    className: "uki-splitPane-handle-ext"
                });
                pos = this._expandPos(pos);
                this._applyPosToStyle(pos, ext.style);
                this._handle.appendChild(ext);
                return ext;
            }, this);
            return this;
        };
        proto.handleWidth = function() {
            return this._handleWidth;
        };
        proto.vertical = function() {
            return this._vertical;
        };
        proto._x_width = function() {
            return this.vertical() ? this.dom().offsetWidth : this.dom().offsetHeight;
        };
        proto._x_widthName = function() {
            return this.vertical() ? "width" : "height";
        };
        proto._x_leftName = function() {
            return this.vertical() ? "left" : "top";
        };
        proto._x_type = function() {
            return this.vertical() ? "v" : "h";
        };
        proto._x_xName = function() {
            return this.vertical() ? "x" : "y";
        };
        proto._createHandle = function() {
            var handle = dom.fromHTML(Mustache.to_html('<div class="uki-splitPane-handle uki-splitPane-handle_{{type}}"><div class="uki-splitPane-handle-bar uki-splitPane-handle-bar_{{type}}"></div></div>', {
                type: this._x_type()
            }));
            if (this.handleWidth() > 1) {
                handle.style[this._x_widthName()] = this.handleWidth() + "px";
            } else {
                handle.className += " " + "uki-splitPane-handle_thin";
            }
            utils.forEach([ "draggesturestart", "draggesture", "draggestureend" ], function(name) {
                evt.on(handle, name, fun.bind(this["_" + name], this));
            }, this);
            return handle;
        };
        proto._createDom = function() {
            this._dom = dom.createElement("div", {
                className: "splitPane"
            });
            build([ {
                view: "Container",
                addClass: "uki-splitPane-container uki-splitPane-container_left"
            }, {
                view: "Container",
                addClass: "uki-splitPane-container uki-splitPane-container_right"
            } ]).appendTo(this);
            this._dom.appendChild(this._handle = this._createHandle());
        };
        proto.destruct = function() {
            utils.forEach(this._exts, function(ext) {
                this._handle.removeChild(ext);
            }, this);
            Container.prototype.destruct.call(this);
            this._handle = null;
        };
        proto._throttledChildResize = function() {
            this._resizeChildViews();
        };
        proto._layout = function() {
            this._moveHandle();
            if (!this._prevWidth) {
                this._prevWidth = this._x_width();
                this._prevPosition = this.handlePosition();
            } else {
                this._handlePosition = this._normalizeHandlePosition(this._calcDesiredPosition());
                this._moveHandle();
            }
            this._throttledChildResize();
        };
        proto._calcDesiredPosition = function() {
            var newWidth = this._x_width(), diff = newWidth - this._prevWidth, totalSpeed = this.leftSpeed() + this.rightSpeed(), leftDiff = this.leftSpeed() / (totalSpeed || 1) * diff;
            return this._prevPosition + leftDiff;
        };
        proto._draggesturestart = function(e) {
            e.cursor = dom.computedStyle(this._handle, null).cursor;
            this._positionBeforeDrag = this.handlePosition();
            this._updatePositionOnDrag(e);
        };
        proto._draggesture = function(e) {
            this._updatePositionOnDrag(e);
        };
        proto._draggestureend = function(e) {
            this._updatePositionOnDrag(e, true);
            this._prevPosition = this.handlePosition();
            this._prevWidth = this._x_width();
        };
        proto._updatePositionOnDrag = function(e, stop) {
            var pos = this._positionBeforeDrag + e.dragOffset[this._x_xName()];
            this._handlePosition = this._normalizeHandlePosition(pos);
            this._moveHandle();
            this._throttledChildResize();
            this.trigger({
                type: stop ? "handleStop" : "handleMove",
                target: this,
                handlePosition: this._handlePosition,
                dragPosition: pos
            });
        };
        proto.topChildViews = proto.leftChildViews = function(views) {
            return this._childViewsAt(0, views);
        };
        proto.bottomChildViews = proto.rightChildViews = function(views) {
            return this._childViewsAt(1, views);
        };
        proto._childViewsAt = function(i, views) {
            if (arguments.length < 2) return this._childViews[i].childViews();
            this._childViews[i].childViews(views);
            return this;
        };
        proto._leftPos = function() {
            var pos = {
                left: "0px",
                top: "0px"
            };
            pos[this._x_widthName()] = this.handlePosition() + "px";
            pos[this.vertical() ? "bottom" : "right"] = "0px";
            return pos;
        };
        proto._rightPos = function() {
            var pos = {
                bottom: "0px",
                right: "0px"
            };
            pos[this._x_leftName()] = this.handlePosition() + this.handleWidth() + "px";
            pos[this.vertical() ? "top" : "left"] = "0px";
            return pos;
        };
        proto._resizeChildViews = function() {
            this._childViews[0].pos(this._leftPos()).layout();
            this._childViews[1].pos(this._rightPos()).layout();
        };
        require(8).Collection.addProps([ "leftMin", "rightMin", "leftSpeed", "rightSpeed", "throttle", "handlePosition", "extPositions", "handleWidth", "vertical" ]);
        exports.SplitPane = SplitPane;
    };
    require_modules[28] = function(global, module, require) {
        var exports = this;
        var fun = require(7), dom = require(13), utils = require(4), view = require(10), build = require(6).build, Container = require(14).Container, Mustache = require(19).Mustache;
        var PLACEHOLDER_CLASSNAME = "__HTMLLayout__";
        var HTMLLayout = view.newClass("HTMLLayout", Container, {
            template: fun.newProp("template"),
            _template: "",
            data: fun.newProp("data", function(data) {
                this._data = this._data2views(data);
                this.dom().innerHTML = Mustache.to_html(this.template(), this._data2mustache(this.data()));
                this._replacePlaceholders();
            }),
            _data: {},
            childViews: fun.newProp("childViews"),
            _childViews: [],
            _data2views: function(data) {
                var result = utils.isArray(data) ? [] : {};
                utils.forEach(data, function(value, key) {
                    if (typeof value === "object") {
                        result[key] = value.typeName ? value : value.view ? build(value)[0] : this._data2views(value);
                    } else {
                        result[key] = value;
                    }
                }, this);
                return result;
            },
            _data2mustache: function(data, prefix) {
                var result = utils.isArray(data) ? [] : {};
                prefix = prefix ? prefix + "." : "";
                utils.forEach(data, function(value, key) {
                    if (typeof value === "object") {
                        if (value.typeName) {
                            result[key] = '<div class="' + PLACEHOLDER_CLASSNAME + '" data-path="' + dom.escapeHTML(prefix + key) + '"></div>';
                            result[key + "__view"] = value;
                        } else {
                            result[key] = this._data2mustache(value, prefix + key);
                        }
                    } else {
                        result[key] = value;
                    }
                }, this);
                return result;
            },
            _replacePlaceholders: function() {
                this.childViews([]);
                var count = 0, placeholders = byClassName(this.dom(), PLACEHOLDER_CLASSNAME);
                utils.forEach(placeholders, function(el) {
                    var key = el.getAttribute("data-path"), child = utils.path2obj(key, this.data());
                    child._viewIndex = count++;
                    child.parent(this);
                    el.parentNode.replaceChild(child.dom(), el);
                    this._childViews.push(child);
                }, this);
            }
        });
        function byClassName(dom, className) {
            return utils.toArray(dom.getElementsByClassName(className));
        }
        require(8).Collection.addProps([ "data", "template" ]);
        exports.HTMLLayout = HTMLLayout;
    };
    require_modules[29] = function(global, module, require) {
        var exports = this;
        1;
        var fun = require(7), utils = require(4), dom = require(13), view = require(10), build = require(6).build, Metrics = require(30).Metrics, Selection = require(31).Selection, Pack = require(32).Pack, SelectionController = require(33).SelectionController, Container = require(14).Container, Focusable = require(20).Focusable;
        var DataList = view.newClass("DataList", Container, Focusable, {
            _setup: function(initArgs) {
                this._metrics = initArgs.metrics || new Metrics;
                this._packView = initArgs.packView || Pack;
                this._selectionController = initArgs.selectionController || new SelectionController;
                this._selection = new Selection;
                this._data = [];
                this._rendered = {};
                Container.prototype._setup.call(this, initArgs);
                this._selection.on("update", fun.bind(this._updateSelection, this));
                this._metrics.on("change.totalHeight", fun.bind(this._updateHeight, this));
            },
            selection: function() {
                return this._selection;
            },
            metrics: function() {
                return this._metrics;
            },
            selectionController: function() {
                return this._selectionController;
            },
            _createDom: function(initArgs) {
                this._dom = dom.createElement("div", {
                    className: "uki-dataList uki-dataList_blured"
                });
                this.tabIndex(1);
                this.metrics().initWithView(this);
                this.selectionController().initWithView(this);
                this.textSelectable(false);
            },
            destruct: function() {
                Container.prototype.destruct.call(this);
                this._data = null;
            },
            layout: function() {
                if (this._layoutBefore) {
                    this._wrappedUpdate();
                } else {
                    this._initLayout();
                }
                return this;
            },
            _initLayout: function() {
                if (this.data().length) {
                    this.metrics().update();
                    this.scrollableParent(this.scrollableParent() || this.parent());
                    this._update();
                    this._layoutBefore = true;
                }
            },
            _reset: function() {
                this.childViews([]);
                this.selectedIndexes([]);
                this._layoutBefore = false;
                this.scrollableParent(null);
                fun.deferOnce(fun.bindOnce(this.layoutIfVisible, this));
            },
            data: fun.newProp("data", function(data) {
                this._data = data;
                this._reset();
            }),
            scrollToIndex: function(index) {
                var range = this._visibleRange(), dm = this.metrics().rowDimensions(index), maxY = dm.top + dm.height, minY = dm.top;
                if (maxY >= range.to) {
                    this.scrollableParent().scroll(0, maxY - range.to + (index === this.data().length - 1 ? 100 : 0));
                } else if (minY < range.from) {
                    this.scrollableParent().scroll(0, minY - range.from);
                }
                this._wrappedUpdate();
                return this;
            },
            template: fun.newProp("template"),
            _template: '{{#rows}}<li class="uki-dataList-row{{^even}} uki-dataList-row_odd{{/even}}">{{{value}}}</li>{{/rows}}',
            formatter: fun.newProp("formatter"),
            _formatter: dom.escapeHTML,
            key: fun.newProp("key"),
            _key: null,
            throttle: fun.newProp("throttle", function(v) {
                this._throttle = v;
                wrapVisChanged.call(this, v, "throttle");
            }),
            _throttle: 0,
            debounce: fun.newProp("debounce", function(v) {
                this._debounce = v;
                wrapVisChanged.call(this, v, "debounce");
            }),
            _debounce: 0,
            prerender: fun.newProp("prerender"),
            _prerender: 1,
            deduceRowHeight: function() {
                var data = this.data(), sample = utils.prop(data, "sampleRow") || data.slice && data.slice(0, 1)[0] || "", pack = this._createPack();
                if (sample.length === 0) sample = "sampleRow";
                this.appendChild(pack);
                pack.render([ sample ], [], 0);
                var rowHeight = pack.dom().offsetHeight;
                this.removeChild(pack);
                return rowHeight;
            },
            redrawRow: function(index) {
                var pack = this._packFor(index);
                if (pack) {
                    function rerender(rows) {
                        if (pack.destructed) {
                            return;
                        }
                        pack.updateRow(index - pack.from, rows, index);
                        pack.setSelected(index - pack.from, this.isSelected(index));
                    }
                    if (this.data().loadRange) {
                        this.data().loadRange(index, index + 1, fun.bind(rerender, this));
                    } else {
                        rerender.call(this, this.data().slice(index, index + 1));
                    }
                }
            },
            _updateHeight: function() {
                this.dom().style.height = this.metrics().totalHeight() + "px";
            },
            _scroll: function() {
                this._wrappedUpdate();
            },
            scrollableParent: fun.newProp("scrollableParent", function(v) {
                if (this._scrollableParent) {
                    this._scrollableParent.removeListener("scroll", fun.bindOnce(this._scroll, this));
                }
                this._scrollableParent = v;
                if (this._scrollableParent) {
                    this._scrollableParent.on("scroll", fun.bindOnce(this._scroll, this));
                }
            }),
            _visibleRange: function() {
                if (!this.scrollableParent()) {
                    return null;
                }
                var rect = this.clientRect(true), parentRect = this.scrollableParent().clientRect(true), topOffset = rect.top - parentRect.top, height = parentRect.height - Math.max(0, topOffset), top = -Math.min(0, topOffset);
                return {
                    from: top,
                    to: top + height
                };
            },
            _renderingRange: function() {
                var range = this._visibleRange();
                if (!range) {
                    return null;
                }
                var h = (range.to - range.from) * this.prerender();
                range.from = Math.max(0, range.from - h);
                range.to = Math.min(this.metrics().totalHeight(), range.to + h);
                return range;
            },
            _update: function() {
                var range = this._renderingRange();
                if (!range) {
                    return;
                }
                var packs = this.childViews(), fromPX = packs[0] && packs[0].fromPX, toPX = packs[0] && packs[packs.length - 1].toPX, i, h = range.to - range.from;
                if (packs.length && fromPX <= range.from && toPX >= range.to) {
                    return;
                } else if (packs.length && fromPX <= range.from) {
                    i = 0;
                    while (packs[i] && packs[i].toPX < range.from) {
                        this.removeChild(packs[i++]);
                    }
                    packs = packs.slice(i);
                    range.from = packs.length ? packs[packs.length - 1].toPX : range.from;
                    range.to = Math.min(range.from + h, this.metrics().totalHeight());
                } else if (packs.length && toPX >= range.to) {
                    i = packs.length - 1;
                    while (packs[i] && packs[i].fromPX > range.to) {
                        this.removeChild(packs[i--]);
                    }
                    packs = packs.slice(0, i + 1);
                    range.to = packs.length ? packs[0].fromPX : range.to;
                    range.from = Math.max(range.to - h, 0);
                } else {
                    i = 0;
                    while (packs[i]) {
                        this.removeChild(packs[i++]);
                    }
                    packs = [];
                }
                if (range.to > range.from) {
                    var rowsRange = this.metrics().rowsForRange(range), pack = this._scheduleRenderPack(rowsRange), d = this.metrics().rowDimensions(rowsRange.to - 1);
                    pack.fromPX = this.metrics().rowDimensions(rowsRange.from).top;
                    pack.toPX = d.top + d.height;
                    packs.push(pack);
                    this._childViews = packs.sort(function(a, b) {
                        return a.from - b.from;
                    });
                }
            },
            _scheduleRenderPack: function(range) {
                var pack = this._createPack();
                pack.from = range.from;
                pack.to = range.to;
                this.appendChild(pack);
                function render(rows) {
                    if (pack.destructed) {
                        return;
                    }
                    this._renderPack(pack, range, rows);
                }
                if (this.data().loadRange) {
                    this.data().loadRange(range.from, range.to, fun.bind(render, this));
                } else {
                    render.call(this, this.data().slice(range.from, range.to));
                }
                return pack;
            },
            _createPack: function() {
                var pack = new this._packView;
                return pack.template(this.template()).formatter(this.formatter()).key(this.key());
            },
            _renderPack: function(pack, range, rows) {
                var selectedInPack = this.selection().selectedInRange(range.from, range.to);
                pack.render(rows, selectedInPack, range.from);
                pack.dom().style.top = this.metrics().rowDimensions(range.from).top + "px";
                if (rows.length > 0 && this.selectedIndex() === -1) {
                    this.selectedIndex(0);
                    this.triggerSelection();
                }
                return pack;
            },
            domForEvent: function(type) {
                return Focusable._domForEvent.call(this, type) || Container.prototype.domForEvent.call(this, type);
            },
            isSelected: fun.newDelegateCall("_selection", "isSelected"),
            selectedIndexes: fun.newDelegateProp("_selection", "indexes"),
            selectedIndex: fun.newDelegateProp("_selection", "index"),
            lastClickIndex: fun.newProp("lastClickIndex"),
            multiselect: fun.newProp("multiselect"),
            selectedRow: function() {
                var index = this.selection().index();
                return index > -1 && this._data.slice(index, index + 1)[0];
            },
            selectedRows: function() {
                var result = [], indexes = this.selection().indexes();
                for (var i = 0, l = indexes.length; i < l; i++) {
                    var item = this._data.slice(indexes[i], indexes[i] + 1)[0];
                    if (item) result.push(item);
                }
                return result;
            },
            _updateSelection: function(e) {
                var packs = this.childViews(), from = packs[0] ? packs[0].from : -1, to = packs.length ? packs[packs.length - 1].to : this.data().length, state = e.action == "add";
                from = Math.max(from, e.from);
                to = Math.min(to, e.to);
                for (var i = to; i >= from; i--) {
                    this._setSelected(i, state);
                }
            },
            _setSelected: function(index, state) {
                var pack = this._packFor(index);
                if (pack) {
                    pack.setSelected(index - pack.from, state);
                }
            },
            _packFor: function(index) {
                var packs = this.childViews(), pack, i, l;
                for (i = 0, l = packs.length; i < l; i++) {
                    pack = packs[i];
                    if (pack.from <= index && pack.to > index) {
                        return pack;
                    }
                }
                return null;
            },
            editSelection: function(e) {},
            triggerSelection: function() {
                this.trigger({
                    type: "selection",
                    target: this
                });
                return this;
            }
        });
        var proto = DataList.prototype;
        proto._wrappedUpdate = proto._update;
        function wrapVisChanged(v, method) {
            if (v > 0) {
                this._wrappedUpdate = fun[method](this._update, v);
            } else {
                this._wrappedUpdate = this._update;
            }
        }
        require(8).Collection.addProps([ "data", "throttle", "debounce", "template", "formatter", "key", "selection", "selectedRows", "selectedRow", "selectedIndexes", "selectedIndex", "lastClickIndex", "multiselect" ]).addMethods([ "scrollToIndex", "triggerSelection", "redrawRow" ]);
        exports.DataList = DataList;
    };
    require_modules[30] = function(global, module, require) {
        var exports = this;
        var fun = require(7), utils = require(4), Observable = require(18).Observable;
        var Metrics = fun.newClass(Observable, {
            initWithView: function(view) {
                this._view = view;
            },
            _rowHeight: 0,
            update: function() {
                this._rowHeight = this._view.deduceRowHeight();
                this.triggerChanges("totalHeight");
            },
            rowsForRange: function(range) {
                return {
                    from: range.from / this._rowHeight << 0,
                    to: range.to / this._rowHeight + .5 << 0
                };
            },
            rowForPosition: function(px) {
                return px / this._rowHeight << 0;
            },
            rowDimensions: function(index) {
                return {
                    top: this._rowHeight * index,
                    height: this._rowHeight
                };
            },
            totalHeight: function() {
                return this._rowHeight * this._view.data().length;
            }
        });
        exports.Metrics = Metrics;
    };
    require_modules[31] = function(global, module, require) {
        var exports = this;
        var fun = require(7), utils = require(4), Observable = require(18).Observable;
        var Selection = fun.newClass(Observable, {
            init: function(indexes) {
                this._indexes = indexes || [];
            },
            indexes: fun.newProp("indexes", function(indexes) {
                this.clear();
                this._indexes = indexes || [];
                if (this._indexes.length) {
                    this._triggerUpdate(false, indexes[0], indexes[indexes.length - 1]);
                }
            }),
            index: function(value) {
                if (!arguments.length) {
                    return this.indexes().length ? this.indexes()[0] : -1;
                }
                return this.indexes(value < 0 ? [] : [ value ]);
            },
            empty: function() {
                return this.indexes().length === 0;
            },
            addRange: function(from, to) {
                spliceRange(this.indexes(), from, to, utils.range(from, to));
                this._triggerUpdate(false, from, to);
                return this;
            },
            removeRange: function(from, to) {
                spliceRange(this.indexes(), from, to, []);
                this._triggerUpdate(true, from, to);
                return this;
            },
            selectedInRange: function(from, to) {
                var fromPos = utils.binarySearch(this.indexes(), from), toPos = utils.binarySearch(this.indexes(), to, fromPos);
                return this.indexes().slice(fromPos, toPos);
            },
            isSelected: function(index) {
                var pos = utils.binarySearch(this.indexes(), index);
                return this.indexes()[pos] === index;
            },
            toggle: function(index) {
                if (this.isSelected(index)) {
                    this.removeRange(index, index);
                } else {
                    this.addRange(index, index);
                }
                return this;
            },
            clear: function() {
                var indexes = this.indexes();
                if (indexes.length > 0) {
                    this._triggerUpdate(true, indexes[0], indexes[indexes.length - 1]);
                }
                this._indexes = [];
                return this;
            },
            _triggerUpdate: function(isRemove, from, to) {
                this.trigger({
                    type: "update",
                    action: isRemove ? "remove" : "add",
                    from: from,
                    to: to
                });
            }
        });
        function spliceRange(indexes, from, to, range) {
            var fromPos = utils.binarySearch(indexes, from), toPos = utils.binarySearch(indexes, to, fromPos);
            if (indexes[toPos] === to) {
                toPos++;
            }
            if (range) {
                indexes.splice.apply(indexes, [ fromPos, toPos - fromPos ].concat(range));
            } else {
                if (toPos > fromPos) {
                    indexes.splice(fromPos, toPos - fromPos);
                }
            }
        }
        exports.Selection = Selection;
    };
    require_modules[32] = function(global, module, require) {
        var exports = this;
        var fun = require(7), utils = require(4), view = require(10), dom = require(13), Mustache = require(19).Mustache, Base = require(15).Base;
        var Pack = view.newClass("dataList.Pack", Base, {
            template: fun.newProp("template"),
            formatter: fun.newProp("formatter"),
            key: fun.newProp("key"),
            render: function(rows, selectedInPack, globalIndex) {
                this._dom.innerHTML = this._toHTML(rows, globalIndex);
                this._restorePackSelection(selectedInPack || [], globalIndex);
            },
            updateRow: function(index, rows, globalIndex) {
                var tmp = dom.createElement("div", {
                    html: this._toHTML(rows, globalIndex)
                });
                var item = this._rowAt(index);
                item.parentNode.replaceChild(tmp.childNodes[0], item);
            },
            setSelected: function(index, state) {
                if (this.dom()) {
                    var row = this._rowAt(index);
                    if (row) {
                        dom.toggleClass(row, "uki-dataList-row_selected", state);
                    }
                }
            },
            _toHTML: function(rows, globalIndex) {
                var formated = utils.map(rows, function(r, i) {
                    i = i + globalIndex;
                    return {
                        value: this._formatRow(r, i),
                        row: r,
                        index: i,
                        even: i & 1
                    };
                }, this);
                return Mustache.to_html(this.template(), {
                    rows: formated
                });
            },
            _formatRow: function(row, index) {
                return this.formatter()(this.key() ? utils.prop(row, this.key()) : row, row, index);
            },
            _createDom: function(initArgs) {
                this._dom = dom.createElement("ul", {
                    className: "uki-dataList-pack"
                });
            },
            _restorePackSelection: function(selectedInPack, globalIndex) {
                for (var i = selectedInPack.length - 1; i >= 0; i--) {
                    this.setSelected(selectedInPack[i] - globalIndex, true);
                }
            },
            _rowAt: function(index) {
                return this.dom().childNodes[index];
            }
        });
        exports.Pack = Pack;
    };
    require_modules[33] = function(global, module, require) {
        var exports = this;
        var fun = require(7), evt = require(12), env = require(3), Observable = require(18).Observable;
        var SelectionController = fun.newClass(Observable, {
            initWithView: function(view) {
                this._view = view;
                this._view.on({
                    mousedown: fun.bind(this._onmousedown, this),
                    mouseup: fun.bind(this._onmouseup, this),
                    focus: fun.bind(this._onfocus, this),
                    blur: fun.bind(this._onblur, this),
                    keydown: fun.bind(this._onkeydown, this)
                });
                this._view.on(this.keyRepeatEvent(), fun.bind(this._onkeyrepeat, this));
            },
            keyRepeatEvent: function() {
                var useKeyPress = env.root.opera || /mozilla/i.test(env.ua) && !/(compatible|webkit)/i.test(env.ua);
                return useKeyPress ? "keypress" : "keydown";
            },
            _onmousedown: function(e) {
                var index = this._eventToIndex(e), selection = this._view.selection();
                this._hadFocusOnSelectionStart = this._view.hasFocus() && selection.isSelected(index);
                if (this._view.multiselect()) {
                    this._selectionInProcess = false;
                    if (e.shiftKey && !selection.empty()) {
                        if (selection.isSelected(index)) {
                            selection.removeRange(Math.min(index + 1, this._view.lastClickIndex()), Math.max(index - 1, this._view.lastClickIndex()));
                        } else {
                            var indexes = selection.indexes();
                            selection.clear().addRange(Math.min(index, indexes[0]), Math.max(index, indexes[indexes.length - 1]));
                        }
                        this._triggerSelection();
                        e.preventDefault();
                    } else if (e.metaKey) {
                        selection.toggle(index);
                        this._triggerSelection();
                    } else {
                        if (selection.isSelected(index)) {
                            this._selectionInProcess = true;
                            this._hadFocusOnSelectionStart = this._view.hasFocus();
                        } else {
                            selection.indexes([ index ]);
                            this._triggerSelection();
                        }
                    }
                } else {
                    selection.index(index);
                    this._triggerSelection();
                }
                this._view.lastClickIndex(index);
            },
            _onmouseup: function(e) {
                var index = this._eventToIndex(e), selection = this._view.selection();
                if (!this._view.multiselect() || !this._selectionInProcess) {
                    if (this._view.lastClickIndex() === index && !this._view.multiselect()) {
                        if (this._hadFocusOnSelectionStart) {
                            this._view.editSelection();
                        }
                    }
                    return;
                }
                if (this._view.lastClickIndex() === index && selection.isSelected(index)) {
                    if (selection.indexes().length === 1) {
                        if (this._hadFocusOnSelectionStart) {
                            this._view.editSelection();
                        }
                    } else {
                        selection.indexes([ index ]);
                        this._triggerSelection();
                    }
                }
                this._selectionInProcess = false;
            },
            _onkeydown: function(e) {
                if (this._view.multiselect() && (e.which == 97 || e.which == 65) && e.metaKey) {
                    this._view.selection().clear().addRange(0, this._view.data().length);
                    this._triggerSelection();
                }
            },
            _onkeyrepeat: function(e) {
                if (!this._view.hasFocus()) return;
                var selection = this._view.selection(), indexes = selection.indexes(), nextIndex = -1;
                if (e.which == 38 || e.keyCode == 38) {
                    nextIndex = Math.max(0, this._view.lastClickIndex() - 1);
                    e.preventDefault();
                } else if (e.which == 40 || e.keyCode == 40) {
                    nextIndex = Math.min(this._view.data().length - 1, this._view.lastClickIndex() + 1);
                    e.preventDefault();
                }
                if (nextIndex > -1 && nextIndex != this._view.lastClickIndex()) {
                    if (e.shiftKey && this._view.multiselect()) {
                        if (selection.isSelected(nextIndex)) {
                            selection.toggle(this._view.lastClickIndex());
                        } else {
                            selection.toggle(nextIndex);
                        }
                    } else {
                        selection.index(nextIndex);
                    }
                    this._triggerSelection();
                    this._view.scrollToIndex(nextIndex);
                    this._view.lastClickIndex(nextIndex);
                }
            },
            _onfocus: function(e) {
                var selection = this._view.selection();
                this._view.removeClass("uki-dataList_blured");
                if (selection.empty() && this._view.data().length > 0) {
                    selection.index(0);
                    this._view.lastClickIndex(0).scrollToIndex(0);
                    this._triggerSelection();
                } else {
                    if (this._deferedTriggerSelection) {
                        this._triggerSelection();
                    }
                }
            },
            _onblur: function(e) {
                this._view.addClass("uki-dataList_blured");
            },
            _triggerSelection: function() {
                if (this._view.hasFocus()) {
                    this._view.triggerSelection();
                    this._deferedTriggerSelection = false;
                } else {
                    this._deferedTriggerSelection = true;
                }
            },
            _eventToIndex: function(e) {
                var o = this._view.clientRect(), y = e.pageY - o.top;
                return this._view.metrics().rowForPosition(y);
            }
        });
        exports.SelectionController = SelectionController;
    };
    require_modules[34] = function(global, module, require) {
        var exports = this;
        1;
        var fun = require(7), utils = require(4), env = require(3), dom = require(13), view = require(10), build = require(6).build, Pack = require(35).Pack, DataList = require(29).DataList, Mustache = require(19).Mustache, Base = require(15).Base, Container = require(14).Container, evt = require(12), Menu = require(26).Menu;
        var _DataTableCounter = 0;
        var DataTable = view.newClass("DataTable", Container, {
            columns: function(cols) {
                if (!arguments.length) {
                    return this._header.columns();
                }
                if (this.hasFocus()) {
                    var _hasFocus = true;
                }
                cols = table.addColumnDefaults(cols);
                cols[0].styler = this._styler;
                this._list.columns(cols);
                this._header.columns(cols);
                this._footer.columns(cols);
                if (_hasFocus) {
                    this.focus();
                }
                return this;
            },
            header: function() {
                return this._header;
            },
            list: function() {
                return this._list;
            },
            footer: function() {
                return this._footer;
            },
            styler: fun.newProp("styler"),
            _styler: fun.FF,
            CSSTableId: fun.newProp("CSSTableId"),
            _CSSTableId: 0,
            editInPlaceHotkey: fun.newProp("editInPlaceHotkey"),
            _editInPlaceHotkey: 113,
            editInPlace: fun.newProp("editInPlace", function(val) {
                if (arguments.length) {
                    if (val === true) {
                        this._editInPlace = true;
                        this._EIP_CreateEditors();
                    } else {
                        this._editInPlace = false;
                    }
                }
                return this._editInPlace;
            }),
            _editInPlace: false,
            _createDom: function(initArgs) {
                _DataTableCounter++;
                this._CSSTableId = _DataTableCounter;
                this._dom = dom.createElement("div", {
                    className: "uki-dataTable uki-dataTable" + this._CSSTableId
                });
                var c = build([ {
                    view: initArgs.headerView || DataTableAdvancedHeader,
                    as: "header",
                    addClass: "uki-dataTable-header-container",
                    on: {
                        scroll: fun.bind(this._scrolledHeader, this)
                    }
                }, {
                    view: Container,
                    pos: "t:0 l:0 r:0 b:0",
                    addClass: "uki-dataTable-container",
                    as: "container",
                    on: {
                        scroll: fun.bind(this._scrolledContainer, this)
                    },
                    childViews: [ {
                        view: initArgs.listView || DataTableList,
                        as: "list",
                        on: {
                            selection: fun.bind(this.trigger, this)
                        }
                    } ]
                }, {
                    view: initArgs.footerView || DataTableFooter,
                    as: "footer",
                    addClass: "uki-dataTable-footer-container",
                    on: {
                        scroll: fun.bind(this._scrolledFooter, this)
                    }
                } ]).appendTo(this);
                this._footer = c.view("footer");
                this._footer.on("render", fun.bindOnce(this._updateContainerHeight, this));
                this._footer.on("render", fun.bindOnce(this._recalculateTableSizes, this));
                this._header = c.view("header");
                this._header.on("keydown", this._keyDown);
                this._header.on("render", fun.bindOnce(this._updateContainerHeight, this));
                this._header.on("recalcTableSize", fun.bindOnce(this._recalculateTableSizes, this));
                this._container = c.view("container");
                this._container.on("keydown", this._keyDown);
                this._container.dom().tabIndex = -1;
                this._container.on("mousedown", this._EIPClick);
                this._list = c.view("list");
            },
            _recalculateTableSizes: function() {
                var mwidth = this._header.totalWidth() + "px";
                this._header._table.style.width = mwidth;
                this._footer._table.style.width = dom.computedStyle(this._header._table).width;
                this._header.scrollLeft(0);
            },
            _updateContainerHeight: function() {
                var pos = this._container.pos();
                pos.t = this._header.clientRect().height + "px";
                if (this._footer.visible()) {
                    pos.bottom = this._footer.clientRect().height + "px";
                } else {
                    pos.bottom = "0px";
                }
                this._container.pos(pos);
                if (this._deferFocus === true) {
                    this.focus();
                }
            },
            _initLayout: function() {
                this._updateContainerHeight();
            },
            _handleScroll: function(newLocation) {
                var lastHeader = this._header.scrollLeft();
                if (lastHeader != newLocation) {
                    this._header.scrollLeft(newLocation);
                    if (this._header._menu != null) {
                        this._header._menu.dom().style.marginLeft = -newLocation + "px";
                    }
                }
                lastHeader = this._container.scrollLeft();
                if (lastHeader != newLocation) {
                    this._container.scrollLeft(newLocation);
                }
                lastHeader = this._footer.scrollLeft();
                if (lastHeader != newLocation) {
                    this._footer.scrollLeft(newLocation);
                }
            },
            _scrolledFooter: function() {
                var lastLocation = this._footer.scrollLeft();
                this._handleScroll(lastLocation);
            },
            _scrolledContainer: function() {
                var newHeader = this._container.scrollLeft();
                this._handleScroll(newHeader);
            },
            _scrolledHeader: function() {
                var newHeader = this._header.scrollLeft();
                this._handleScroll(newHeader);
            },
            _keyDown: function(event) {
                var parent = this.parent();
                if (parent == null) return;
                if (parent._inEditInPlace) return;
                if (parent._editInPlace === false) return;
                if (event.keyCode == parent._editInPlaceHotkey) {
                    parent.startEditInPlace(parent._list.selectedIndex(), 0);
                }
            },
            startEditInPlace: function(row, col) {
                if (!this._editInPlace) return;
                if (row == null) row = this._list.selectedIndex();
                if (col == null) col = 0;
                var columns = this._header.columns();
                if (columns == null) return;
                if (this._Editors === null || this._Editors.length !== columns.length) {
                    this._EIP_CreateEditors();
                }
                this._EIPMove(row, col, true, true);
            },
            stopEditInPlace: function() {
                if (this._EIP_ClearEditor()) {
                    this._inEditInPlace = false;
                    this.focus();
                }
            },
            _EIP_ClearEditor: function() {
                if (this._EIPCurrentColumn === -1 || this._EIPCurrentRow === -1) return true;
                var columns = this._header.columns();
                var col = this._EIPCurrentColumn;
                var row = this._EIPCurrentRow;
                var value = this._Editors[col].value();
                if (this._Editors[col]._dom.parentNode === null) return true;
                if (columns[col].editor != null) {
                    if (columns[col].unformatter != null) {
                        value = columns[col].unformatter(value);
                    }
                    if (columns[col].validation != null) {
                        var validated = columns[col].validation(row, col, value);
                        if (validated === false) return false;
                    }
                }
                var oldvalue = this._EIPCurrentRowData[0][col];
                var data = this.data();
                if (value === "" && oldvalue === null) oldvalue = "";
                if (oldvalue != value) {
                    if (data.changeData != null) {
                        data.changeData(row, col, value);
                    } else if (utils.isArray(data)) {
                        data[row][col] = value;
                    }
                    this._EIPCurrentRowData[0][col] = value;
                    try {
                        this.trigger({
                            type: "editInPlaceChange",
                            original: oldvalue,
                            value: value,
                            row: row,
                            column: col
                        });
                    } catch (err) {}
                }
                var parent = this._Editors[col]._dom.parentNode;
                dom.removeElement(this._Editors[col]._dom);
                var newvalue = columns[col].formatter(value);
                this._styler(this._EIPCurrentRowData[0], this._EIPCurrentRow, this);
                parent.innerHTML = newvalue;
                this._EIPCurrentColumn = -1;
                this._EIPCurrentRow = -1;
                this._EIPCurrentRowData = null;
                return true;
            },
            _EIP_getDomElement: function(row, col) {
                var htmlrow = this._list.dom().querySelector("tr.uki-dataTable-row-" + row);
                if (htmlrow == null) return null;
                var htmlcol = htmlrow.querySelector("td.uki-dataTable-col-" + col);
                return htmlcol;
            },
            _EIPMove: function(row, col, nearest, forward) {
                var columns = this._header.columns();
                if (!nearest && col === -1) {
                    col = columns.length;
                    row--;
                }
                if (forward) {
                    while (col < columns.length && (columns[col].visible() === false || this._Editors[col] === null)) col++;
                    if (col >= columns.length) {
                        if (nearest) {
                            col = columns.length - 1;
                            while (col >= 0 && (columns[col].visible() === false || this._Editors[col] === null)) col--;
                        } else {
                            col = 0;
                            row++;
                            while (col < columns.length && (columns[col].visible() === false || this._Editors[col] === null)) col++;
                        }
                    }
                } else {
                    while (col >= 0 && (columns[col].visible() === false || this._Editors[col] === null)) col--;
                    if (col == -1) {
                        col = columns.length - 1;
                        row--;
                        while (col >= 0 && (columns[col].visible() === false || this._Editors[col] === null)) col--;
                    }
                }
                var htmlcol = this._EIP_getDomElement(row, col);
                if (htmlcol === null) {
                    return false;
                }
                if (this._inEditInPlace) {
                    if (this._EIP_ClearEditor() === false) {
                        if (this._list.selectedIndex() != this._EIPCurrentRow) {
                            this._list.selectedIndex(this._EIPCurrentRow);
                            this._list.triggerSelection();
                        }
                        return;
                    }
                }
                this._inEditInPlace = true;
                this._EIPCurrentColumn = col;
                this._EIPCurrentRow = row;
                if (this._list.selectedIndex() != row) {
                    this._list.selectedIndex(row);
                    this._list.triggerSelection();
                }
                if (this.data().loadRange != null) {
                    this.data().loadRange(row, row + 1, fun.bindOnce(this._EIPStartEditor, this));
                } else {
                    this._EIPStartEditor(this.data().slice(row, row + 1));
                }
            },
            _EIPStartEditor: function(row) {
                var columns = this._header.columns();
                var htmlcol = this._EIP_getDomElement(this._EIPCurrentRow, this._EIPCurrentColumn);
                this._EIPCurrentRowData = row;
                var beditor = this._Editors[this._EIPCurrentColumn];
                var value = row[0][this._EIPCurrentColumn];
                beditor.value(columns[this._EIPCurrentColumn].formatter(value ? value : ""));
                htmlcol.innerHTML = "";
                htmlcol.appendChild(beditor._dom);
                fun.deferOnce(fun.bindOnce(this._EIPFocus, this));
            },
            _inEditInPlace: false,
            _EIPCurrentColumn: -1,
            _EIPCurrentRow: -1,
            _EIPCurrentRowData: null,
            _EIPFocus: function() {
                if (this._Editors[this._EIPCurrentColumn].focus) {
                    this._Editors[this._EIPCurrentColumn].focus();
                } else if (this._Editors[this._EIPCurrentColumn]._input && this._Editors[this._EIPCurrentColumn]._input.focus) {
                    this._Editors[this._EIPCurrentColumn]._input.focus();
                } else if (this._Editors[this._EIPCurrentColumn]._dom.focus) {
                    this._Editors[this._EIPCurrentColumn]._dom.focus();
                }
                if (this._Editors[this._EIPCurrentColumn].select) {
                    this._Editors[this._EIPCurrentColumn].select();
                } else if (this._Editors[this._EIPCurrentColumn]._input && this._Editors[this._EIPCurrentColumn]._input.select) {
                    this._Editors[this._EIPCurrentColumn]._input.select();
                } else if (this._Editors[this._EIPCurrentColumn]._dom.select) {
                    this._Editors[this._EIPCurrentColumn]._dom.select();
                }
            },
            _EIP_CreateEditors: function() {
                if (!this._editInPlace) return;
                if (this._Editors != null && this._Editors.length > 0) {
                    for (var i = 0; i < this._Editors.length; i++) {
                        if (this._Editors[i] != null) {
                            try {
                                this._Editors[i].destruct();
                            } catch (err) {}
                        }
                    }
                }
                var cols = this._header.columns();
                if (cols == null) return;
                this._Editors = [];
                for (var i = 0; i < cols.length; i++) {
                    if (cols[i].editor === false || cols[i].editor == null) {
                        this._Editors.push(null);
                        continue;
                    }
                    if (cols[i].editor === true) {
                        var editor = {
                            view: "nativeControl.Text"
                        };
                    } else {
                        var editor = cols[i].editor;
                    }
                    editor["pos"] = "w:100% h:14pt p:relative";
                    try {
                        var beditor = build(editor);
                        beditor[0].on("keydown", this._EIPKeyDown);
                        beditor[0]._editInPlaceHotkey = this._editInPlaceHotkey;
                        beditor[0]._parent = this;
                        this._Editors.push(beditor[0]);
                    } catch (Err) {
                        this._Editors.push(null);
                    }
                }
            },
            _Editors: null,
            _EIPClick: function(event) {
                var parent = this.parent();
                if (parent == null || !parent._inEditInPlace) return;
                var target = event.srcElement ? event.srcElement : event.target;
                var pos = target.className.indexOf("uki-dataTable-col-");
                if (pos === -1) {
                    if (parent.list().selectedIndex() != parent._EIPCurrentRow) {
                        parent.list().selectedIndex(parent._EIPCurrentRow);
                        parent.list().triggerSelection();
                    }
                    return;
                }
                var col = parseInt(target.className.match(/uki-dataTable-col-(\d+)/)[1], 10);
                var row = parent.list().selectedIndex();
                if (col == null || row == null || col < 0 || row < 0) return;
                parent._EIPMove(row, col, true, true);
            },
            _EIPKeyDown: function(event) {
                var parent = this.parent();
                if (event.keyCode === 9 || event.keyCode === 13 || event.keyCode === 27 || event.keyCode === this._editInPlaceHotkey) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.keyCode === 9 || event.keyCode === 13) {
                        if (event.shiftKey === true) {
                            parent._EIPMove(parent._EIPCurrentRow, parent._EIPCurrentColumn - 1, false, false);
                        } else {
                            parent._EIPMove(parent._EIPCurrentRow, parent._EIPCurrentColumn + 1, false, true);
                        }
                    }
                    if (event.keyCode === 27 || event.keyCode === this._editInPlaceHotkey) {
                        if (parent._EIP_ClearEditor()) {
                            parent._inEditInPlace = false;
                            parent.focus();
                        }
                    }
                }
                if ((event.keyCode === 38 || event.keyCode === 40) && parent._inEditInPlace) {
                    if (event.keyCode === 38 && parent._EIPCurrentRow > 0) {
                        parent._EIPMove(parent._EIPCurrentRow - 1, parent._EIPCurrentColumn, false, true);
                    } else if (event.keyCode == 40) {
                        var data = parent.data();
                        if (data.length <= parent._EIPCurrentRow + 1) {
                            parent.EIPInsertRow();
                        } else {
                            parent._EIPMove(parent._EIPCurrentRow + 1, parent._EIPCurrentColumn, false, false);
                        }
                    }
                }
            },
            EIPInsertRow: function() {
                if (!this._inEditInPlace) return;
                var data = this.data();
                var rownum = data.length;
                if (data.insertRow) {
                    var row = data.insertRow();
                    this.trigger({
                        type: "insertedRow",
                        table: this,
                        row: row,
                        rowid: rownum
                    });
                } else if (utils.isArray(data)) {
                    var cols = [];
                    var collen = this.columns().length;
                    for (var i = 0; i < collen; i++) cols.push("");
                    data.push(cols);
                    this.trigger({
                        type: "insertedRow",
                        table: this,
                        row: data.slice(rownum, rownum + 1),
                        rowid: rownum
                    });
                } else {
                    rownum--;
                }
                this.list()._update();
                this.scrollToIndex(this.rownum);
                fun.deferOnce(fun.bindOnce(this._delayedMoveForInsert, this));
            },
            _delayedMoveForInsert: function() {
                var rownum = this.data().length - 1;
                this._EIPMove(rownum, this._EIPCurrentColumn, false, false);
            },
            isEditing: function() {
                return this._inEditInPlace;
            },
            editColumn: function(col) {
                if (!this._inEditInPlace) return -1;
                if (arguments.length && col >= 0 && col < this._header.columns().length) {
                    this._EIPMove(this._EIPCurrentRow, col + 0, true, true);
                }
                return this._EIPCurrentColumn;
            },
            editorValue: function(value) {
                if (!this._inEditInPlace) return null;
                if (arguments.length) {
                    this._Editors[this._EIPCurrentColumn].value(value);
                }
                return this._Editors[this._EIPCurrentColumn].value();
            },
            redrawRow: function(row) {
                this._list.redrawRow(row);
                if (!this._inEditInPlace) return;
                if (this._EIPCurrentRow == row) {
                    this._EIPMove(this._EIPCurrentRow, this._EIPCurrentColumn, true, true);
                }
            },
            focus: function() {
                if (this._list.columns().length == 0) {
                    this._deferFocus = true;
                    return;
                }
                if (this._header.filterable) {
                    var hc = this._header.columns();
                    var found = false;
                    for (var i = 0; i < hc.length && !found; i++) {
                        if (hc[i].visible() && hc[i].filterable() && dom.hasClass(hc[i]._filter, "initfocus")) {
                            hc[i].focus();
                            found = true;
                        }
                    }
                    if (!found) {
                        for (var i = 0; i < hc.length && !found; i++) {
                            if (hc[i].visible() && hc[i].filterable()) {
                                hc[i].focus();
                                found = true;
                            }
                        }
                    }
                    if (!found) {
                        this._list.focus();
                    }
                } else {
                    this._list.focus();
                }
            },
            hasFocus: function() {
                if (this._list.hasFocus()) return true;
                if (this._header.hasFocus()) return true;
                return false;
            },
            blur: function() {
                this._list.blur();
                this._header.blur();
            },
            hasFooter: function(v) {
                if (arguments.length) {
                    return this._footer.visible(v);
                }
                return this._footer.visible();
            }
        });
        fun.delegateProp(DataTable.prototype, [ "data", "throttle", "debounce", "template", "formatter", "key", "selection", "selectedRows", "selectedRow", "selectedIndexes", "selectedIndex", "lastClickIndex", "multiselect" ], "list");
        fun.delegateCall(DataTable.prototype, [ "scrollToIndex", "triggerSelection" ], "list");
        fun.delegateCall(DataTable.prototype, [ "summary" ], "footer");
        fun.delegateProp(DataTable.prototype, [ "filterable", "filterTimeout", "sortable", "hasMenu", "menuOptions", "menu", "menuImage" ], "header");
        fun.delegateCall(DataTable.prototype, [ "setRowColStyle", "setRowStyle", "setColStyle", "columnIdByName", "columnIdByLabel" ], "header");
        var DataTableHeaderColumn = view.newClass("DataTableHeaderColumn", Base, {
            className: fun.newProp("className", function(v) {
                if (arguments.length) {
                    if (this._className === v) return v;
                    if (this._className.length > 0) {
                        dom.removeClass(this._dom, this._className);
                    }
                    this._className = v;
                    dom.addClass(this._dom, this._className);
                }
                return this._className;
            }),
            _className: "",
            resizable: fun.newProp("resizable", function(v) {
                if (arguments.length) {
                    this._resizable = v;
                    this._setupResizeable();
                }
                return this._resizable;
            }),
            _resizable: true,
            sortable: fun.newProp("sortable"),
            _sortable: true,
            filterable: fun.newProp("filterable", function(v) {
                if (arguments.length) {
                    this._filterable = v;
                    if (this.parent() == null) return;
                    if (v && this.parent().filterable()) {
                        this._filter.style.display = "";
                    } else {
                        this._filter.style.display = "none";
                    }
                }
                return this._filterable;
            }),
            _filterable: true,
            maxWidth: fun.newProp("maxWidth", function(v) {
                if (arguments.length) {
                    this._maxWidth = Math.max(v, this._width);
                    if (this._minWidth == this._maxWidth) {
                        this._sizeable = false;
                    } else {
                        this._sizeable = true;
                    }
                    this._setupResizeable();
                }
                return this._maxWidth;
            }),
            _maxWidth: 0,
            width: fun.newProp("width", function(v) {
                if (arguments.length) {
                    var newWidth = Math.min(Math.max(v, this._minWidth), this._maxWidth == 0 ? v : this._maxWidth);
                    if (newWidth != this._width) {
                        this._width = newWidth;
                        if (this.parent() != null) {
                            this.parent().updateCSSRules(this._cssRule, "width", this._width + "px");
                            this.parent().trigger({
                                type: "recalcTableSize"
                            });
                        }
                    }
                }
                return this.width;
            }),
            _width: 200,
            minWidth: fun.newProp("minWidth", function(v) {
                if (arguments.length) {
                    this._minWidth = Math.min(v, this._width);
                    if (this._minWidth == this._maxWidth) {
                        this._sizeable = false;
                    } else {
                        this._sizeable = true;
                    }
                    this._setupResizeable();
                }
                return this._minWidth;
            }),
            _minWidth: 20,
            label: fun.newProp("label", function(v) {
                if (arguments.length) {
                    this._label = v;
                    this._labelElement.innerHTML = dom.escapeHTML(this._label);
                    this._labelElement.title = this._labelElement.innerHTML;
                    if (this._hasMenu) {
                        this._labelElement.style.marginLeft = "16px";
                    } else {
                        this._labelElement.style.marginLeft = "";
                    }
                    if (this._name.length === 0) this.name(v);
                }
                return this._label;
            }),
            _label: "",
            name: fun.newProp("name", function(v) {
                if (arguments.length) {
                    this._name = v;
                    this._filter.name = "_filter_" + this._name;
                }
                return this._name;
            }),
            _name: "",
            visible: fun.newProp("visible", function(v) {
                if (arguments.length) {
                    this._visible = v;
                    if (this.parent() != null) {
                        if (v) {
                            this.parent().updateCSSRules(this._cssRule, "display", "");
                        } else {
                            this.parent().updateCSSRules(this._cssRule, "display", "none");
                        }
                    }
                }
                return this._visible;
            }),
            _visible: true,
            sort: fun.newProp("sort", function(v) {
                if (arguments.length) {
                    if (v > 2 || v < 0) v = 0;
                    this._sort = v;
                    if (this.parent() == null) return this._sort;
                    if (this.parent().sortable()) {
                        dom.removeClass(this._labelElement, "uki-dataTable-sort-down uki-dataTable-sort-up");
                        if (v === 1) {
                            dom.addClass(this._labelElement, "uki-dataTable-sort-down");
                        } else if (v === 2) {
                            dom.addClass(this._labelElement, "uki-dataTable-sort-up");
                        }
                    }
                }
                return this._sort;
            }),
            _sort: 0,
            headerstyle: fun.newProp("headerstyle", function(v) {
                if (arguments.length) {
                    this._headerstyle = v;
                    this._dom.style.cssText = v;
                }
                return this._headerstyle;
            }),
            _headerstyle: "",
            style: fun.newProp("style", function(v) {
                if (!arguments.length || v == null) {
                    return this._style;
                }
                this._style = v;
                if (this.parent() != null) {
                    this._parseStyle();
                }
                return this._style;
            }),
            _style: "",
            formatter: function(value) {
                if (arguments.length) {
                    if (typeof value === "function") {
                        this._formatter = value;
                    } else {
                        return this._formatter(value);
                    }
                }
                return this._formatter;
            },
            _formatter: dom.escapeHTML,
            hasMenu: fun.newProp("hasMenu", function(v) {
                if (arguments.length) {
                    if (this._hasMenu == v) return this._hasMenu;
                    this._hasMenu = v;
                    this.label(this._label);
                }
                return this._hasMenu;
            }),
            _hasMenu: false,
            filterValue: function(v) {
                if (arguments.length) {
                    if (this._filter.value === v) return;
                    this._filter.value = v;
                    if (this.parent() != null) this.parent()._handleFilterNotify();
                }
                return this._filter.value;
            },
            footerValue: function(v) {
                if (arguments.length) {
                    return this.parent().parent().footer().footervalue(this._pos, v);
                }
                return this.parent().parent().footer().footervalue(this._pos);
            },
            footerVisible: function(v) {
                if (arguments.length) {
                    return this.parent().parent().footer().footervisible(this._pos, v);
                }
                return this.parent().parent().footer().footervisible(this._pos);
            },
            _pos: 0,
            _cssRule: -1,
            _sizeable: true,
            domForEvent: function() {
                return this._filter;
            },
            _createDom: function(initArgs) {
                if (initArgs.pos != null) {
                    this._pos = initArgs.pos;
                }
                if (initArgs.cssRule != null) {
                    this._cssRule = initArgs.cssRule;
                }
                var filterStyle = "";
                if (initArgs.filterable != null) {
                    if (initArgs.filterable === false) {
                        filterStyle = "display:none";
                    }
                }
                var className = "uki-dataTable-header-cell uki-dataTable-col-" + this._pos;
                this._labelElement = dom.createElement("div", {
                    className: "uki-dataTable-header-text"
                });
                this._resizer = dom.createElement("div", {
                    className: "uki-dataTable-resizer uki-dataTable-resizer_pos-" + this._pos
                });
                if ("ontouchstart" in window) {
                    this._resizer.innerHTML = "&nbsp;<br>&nbsp;";
                    this._resizer.style.width = "20px";
                    this._resizer.style.right = "-14px";
                } else {
                    this._resizer.innerHTML = "|";
                }
                this._filter = dom.createElement("input", {
                    className: "uki-dataTable-filter" + (initArgs.initfocus ? " initfocus" : ""),
                    tabIndex: 1,
                    autocomplete: "off",
                    name: "_filter_" + this._name,
                    style: filterStyle
                });
                this.on("focus", function() {
                    this.parent()._lastFocusedFilter && dom.removeClass(this.parent()._lastFocusedFilter, "initfocus");
                    dom.addClass(this._filter, "initfocus");
                });
                this.on("blur", function() {
                    this.parent()._lastFocusedFilter = this._filter;
                });
                this._wrapper = dom.createElement("div", {
                    className: "uki-dataTable-header-wrap"
                }, [ this._labelElement, this._filter, this._resizer ]);
                this._dom = dom.createElement("td", {
                    className: className
                }, [ this._wrapper ]);
                fun.deferOnce(fun.bindOnce(this._finishSetup, this));
            },
            destruct: function() {
                Base.prototype.destruct.call(this);
                this._wrapper = null;
                this._filter = null;
                this._resizer = null;
                this._labelElement = null;
            },
            _setupResizeable: function() {
                if (this._resizable && this._sizeable) {
                    this._resizer.style.display = "";
                    dom.addClass(this._dom, "uki-dataTable-header-cell_resizable");
                } else {
                    this._resizer.style.display = "none";
                    dom.removeClass(this._dom, "uki-dataTable-header-cell_resizable");
                }
            },
            _parseStyle: function() {
                if (this._style == null) return;
                if (typeof this._style === "object") {
                    for (var key in this._style) {
                        if (!this._style.hasOwnProperty(key)) {
                            continue;
                        }
                        this.parent().updateCSSRules(this._cssRule, key, this._style[key]);
                    }
                } else {
                    var exp = this._style.split(";");
                    for (var i = 0; i < exp.length; i++) {
                        var parts = exp[i].split(":");
                        if (parts[0].length == 0 || parts.length != 2) continue;
                        this.parent().updateCSSRules(this._cssRule, parts[0], parts[1]);
                    }
                }
            },
            _finishSetup: function() {
                if (!this._visible) {
                    this.parent().updateCSSRules(this._cssRule, "display", "none");
                }
                this.parent().updateCSSRules(this._cssRule, "width", this._width + "px");
                this._parseStyle();
                this.resizable(this._resizable);
                this.filterable(this._filterable);
                this.sort(this._sort);
                this.label(this._label);
            },
            focus: function() {
                try {
                    if (this._visible && this._filterable && this.parent().filterable()) {
                        this._filter.focus();
                    }
                } catch (err) {}
            },
            hasFocus: function() {
                return this._filter == env.doc.activeElement;
            },
            blur: function() {
                try {
                    if (this.hasFocus()) this._filter.blur();
                } catch (err) {}
            }
        });
        var DataTableFooter = view.newClass("DataTableFooter", Container, {
            template: fun.newProp("template"),
            _template: '<table class="uki-dataTable-footer"><tbody><tr class="uki-dataTable-footer-row">{{#columns}}<td class="uki-dataTable-footer-cell uki-dataTable-col-{{pos}}"><div class="uki-dataTable-footer-text" name="footer_{{pos}}" style="{{style}}">{{value}}</div></td>{{/columns}}</td></table>\r\n\r\n',
            _createDom: function(initArgs) {
                Base.prototype._createDom.call(this, initArgs);
                var rowfooter = dom.createElement("tr", {
                    className: "uki-dataTable-footer-row"
                });
                this._table = dom.createElement("table", {
                    className: "uki-dataTable-footer"
                }, [ rowfooter ]);
                this._dom = dom.createElement("div", {
                    className: "uki-hidden"
                }, [ this._table ]);
            },
            destruct: function() {
                Container.prototype.destruct.call(this);
                this._table = null;
            },
            columns: fun.newProp("columns", function(cols) {
                this._columns = cols;
                this._table.style.width = table.totalWidth(this._columns) + "px";
                fun.deferOnce(fun.bindOnce(this._render, this));
            }),
            visible: fun.newProp("visible", function(vis) {
                if (arguments.length && (vis === true || vis === false) && vis !== this._visible) {
                    this._visible = vis;
                    if (this._visible) {
                        dom.removeClass(this._dom, "uki-hidden");
                    } else {
                        dom.addClass(this._dom, "uki-hidden");
                    }
                    this.trigger({
                        type: "render"
                    });
                }
                return this._visible;
            }),
            _visible: false,
            _formatColumn: function(col) {
                return {
                    pos: col.pos,
                    style: col.footer === false ? "display:none" : "",
                    value: col.footervalue ? col.footervalue : ""
                };
            },
            _render: function() {
                this._dom.innerHTML = Mustache.to_html(this._template, {
                    columns: this._columns.map(this._formatColumn, this)
                });
                this._table = this._dom.getElementsByClassName("uki-dataTable-footer")[0];
                this._table.style.width = table.totalWidth(this._columns) + "px";
                this.trigger({
                    type: "render"
                });
            },
            footervalue: function(pos, v) {
                if (arguments.length == 2) {
                    if (this._columns[pos].footervalue !== v) {
                        this._columns[pos].footervalue = v;
                        this._render();
                    }
                }
                return this._columns[pos].footervalue;
            },
            footervisible: function(pos, v) {
                if (arguments.length == 2 && (v === true || v === false)) {
                    if (this._columns[pos].footer !== v) {
                        this._columns[pos].footer = v;
                        this._render();
                    }
                }
                return this._columns[pos].footer;
            },
            values: function(v) {
                var changed = false;
                var i;
                if (arguments.length) {
                    var len = this._columns.length;
                    if (len > v.length) len = v.length;
                    for (i = 0; i < len; i++) {
                        if (this._columns[i].footervalue !== v[i]) {
                            this._columns[i].footervalue = v[i];
                            changed = true;
                        }
                    }
                    if (changed) this._render();
                }
                var val = [];
                for (i = 0; i < this._columns.length; i++) {
                    val.push(this._columns[i].footervalue);
                }
                return val;
            },
            summary: function(v) {
                if (arguments.length) return this.values(v); else return this.values();
            }
        });
        var DataTableAdvancedHeader = view.newClass("DataTableAdvancedHeader", Container, {
            filterable: fun.newProp("filterable", function(v) {
                if (arguments.length) {
                    if (this._filterable !== v) {
                        this._filterable = v;
                        if (this._columns == null) return this._filterable;
                        for (var i = 0; i < this._columns.length; i++) {
                            this._columns[i].filterable(this._columns[i].filterable());
                        }
                        this.trigger({
                            type: "render"
                        });
                    }
                }
                return this._filterable;
            }),
            _filterable: false,
            enterFiltered: fun.newProp("enterFiltered"),
            _enterFiltered: false,
            filterTimeout: fun.newProp("filterTimeout"),
            _filterTimeout: 500,
            sortable: fun.newProp("sortable"),
            _sortable: false,
            _intervalId: null,
            hasMenu: fun.newProp("hasMenu", function(v) {
                if (arguments.length) {
                    if (this._hasMenu == v) return v;
                    this._hasMenu = v;
                    this._setupMenu();
                }
                return this._hasMenu;
            }),
            _hasMenu: false,
            menu: function() {
                return this._menu;
            },
            _menu: null,
            menuImage: fun.newProp("menuImage", function(v) {
                if (arguments.length) {
                    this._menuImage = v;
                    this._setupMenuOptions();
                }
                return this._menuImage;
            }),
            _menuImage: "data:image/gif;base64,R0lGODlhEAAQAJEAAP39/ebm5ikpKZqamiH5BAAAAAAALAAAAAAQABAAAAIzhI+pqzEBgpwSDTGu2DuzfzgQNSVXxqWDaZAVIkauiWkpxspkUrqQVbt1YA8dBfTxKQMFADs=",
            menuOptions: fun.newProp("menuOptions", function(v) {
                if (arguments.length) {
                    this._menuOptions = v;
                    this._setupMenuOptions();
                }
                return this._menuOptions;
            }),
            _menuOptions: null,
            _styleSheetElement: null,
            _styleSheet: null,
            _columns: null,
            _createDom: function(initArgs) {
                Container.prototype._createDom.call(this, initArgs);
                this._rowheader = dom.createElement("tr", {
                    className: "uki-dataTable-header-row"
                });
                this._table = dom.createElement("table", {
                    className: "uki-dataTable-header"
                }, [ this._rowheader ]);
                this._dom = dom.createElement("div", null, [ this._table ]);
                this._styleSheetElement = dom.createStylesheet(" ");
                if (this._styleSheetElement.sheet && this._styleSheetElement.sheet.cssRules) {
                    this._styleSheet = this._styleSheetElement.sheet;
                } else {
                    this._styleSheet = this._styleSheetElement.styleSheet;
                }
                this._cssRuleTracking = {};
                this._menu = build([ {
                    view: "Menu",
                    as: "DataTable-Menu",
                    addClass: "uki-dataTable-menu"
                } ]);
                this._draggableColumn = -1;
                this.on("draggesturestart", this._dragStart);
                this.on("draggesture", this._drag);
                this.on("draggestureend", this._dragEnd);
                if ("ontouchstart" in window) {
                    this.on("touchend", this._click);
                } else {
                    this.on("click", this._click);
                }
                this._setupMenu();
            },
            _setupMenu: function() {
                if (this.parent() == null || this.parent().length == 0 || this._columns == null) {
                    fun.deferOnce(fun.bindOnce(this._setupMenu, this));
                    return;
                }
                if (this._hasMenu) {
                    var found = false;
                    if (this._menu.parent() == null || this._menu.parent().length == 0) {
                        this._menu.attach(this.parent().dom(), false);
                        for (var i = 0; i < this._columns.length; i++) {
                            if (found || this._columns[i].visible() === false) {
                                this._columns[i].hasMenu(false);
                            } else if (!found) {
                                this._columns[i].hasMenu(true);
                                found = true;
                            }
                        }
                    }
                } else {
                    this._menu.remove();
                    for (var i = 0; i < this._columns.length; i++) {
                        this._columns[i].hasMenu(false);
                    }
                }
            },
            _setupMenuOptions: function() {
                var lmenu = [];
                lmenu[0] = {
                    html: '<img src="' + this._menuImage + '" draggable=false width="12px" height="12px" border=0 ondragstart="return false;">',
                    options: this._menuOptions
                };
                this._menu.options(lmenu);
            },
            destruct: function() {
                if (this._menu) {
                    this._menu.destruct();
                    this._menu = null;
                }
                this._styleSheet = null;
                this._cssRuleTracking = null;
                dom.removeElement(this._styleSheetElement);
                this._styleSheetElement = null;
                for (var i = 0; i < this._columns.length; i++) {
                    this._columns[i].destruct();
                    this._columns[i] = null;
                }
                Container.prototype.destruct.call(this);
                this._table = null;
                this._dom = null;
                this._rowheader = null;
                this._lastFocusedFilter = null;
                this._menuOptions = null;
                this._columns = null;
            },
            _cssRuleTracking: null,
            _name: null,
            hasStyle: function(row, col) {
                var Key = "";
                if (row != null && col != null) Key = "RC" + row + "-" + col; else if (row != null) Key = "R" + row; else if (col != null) Key = "C" + col; else return false;
                if (this._cssRuleTracking[Key] == null) return false;
                return true;
            },
            setRowStyle: function(row, name, value) {
                var Key = "R" + row, id;
                if (this._cssRuleTracking[Key] == null) {
                    var parentId = this.parent().CSSTableId();
                    var CSSKey = "div.uki-dataTable" + parentId + " tr.uki-dataTable-row-" + row;
                    id = this.addCSSRule(CSSKey);
                    this._cssRuleTracking[Key] = id;
                } else {
                    id = this._cssRuleTracking[Key];
                }
                this.updateCSSRules(id, name, value);
            },
            setRowColStyle: function(row, col, name, value) {
                var Key = "RC" + row + "-" + col, id;
                if (this._cssRuleTracking[Key] == null) {
                    var parentId = this.parent().CSSTableId();
                    var CSSKey = "div.uki-dataTable" + parentId + " tr.uki-dataTable-row-" + row + " td.uki-dataTable-col-" + col;
                    id = this.addCSSRule(CSSKey);
                    this._cssRuleTracking[Key] = id;
                } else {
                    id = this._cssRuleTracking[Key];
                }
                this.updateCSSRules(id, name, value);
            },
            setColStyle: function(col, name, value) {
                var Key = "C" + col, id;
                if (this._cssRuleTracking[Key] == null) {
                    var parentId = this.parent().CSSTableId();
                    var CSSKey = "div.uki-dataTable" + parentId + " td.uki-dataTable-col-" + col;
                    id = this.addCSSRule(CSSKey);
                    this._cssRuleTracking[Key] = id;
                } else {
                    id = this._cssRuleTracking[Key];
                }
                this.updateCSSRules(id, name, value);
            },
            deleteAllCSSRules: function() {
                var count = 0;
                if (this._styleSheet.cssRules) {
                    count = this._styleSheet.cssRules.length;
                } else {
                    count = this._styleSheet.rules.length;
                }
                for (var i = count - 1; i >= 0; i--) {
                    dom.deleteCSSRule(this._styleSheet, i);
                }
            },
            addCSSRule: function(id) {
                return dom.addCSSRule(this._styleSheet, id, "display:;");
            },
            updateCSSRules: function(cssRule, name, value) {
                var theRules;
                if (this._styleSheet.cssRules) {
                    theRules = this._styleSheet.cssRules;
                } else {
                    theRules = this._styleSheet.rules;
                }
                try {
                    if (theRules[cssRule].style.setProperty) {
                        theRules[cssRule].style.setProperty(name, value, null);
                    } else {
                        theRules[cssRule].style[name] = value;
                    }
                } catch (e) {}
            },
            totalWidth: function() {
                var tw = 0;
                if (this._columns === null) return 0;
                for (var i = 0; i < this._columns.length; i++) {
                    tw += this._columns[i].visible() ? this._columns[i].width() : 0;
                }
                return tw;
            },
            _click: function(e) {
                if (this._draggableColumn != -1) return;
                e.isDefaultPrevented = fun.FF;
                if (e.target.nodeName === "INPUT") return;
                if (dom.hasClass(e.target, "uki-dataTable-resizer")) return;
                if (this._parent.isEditing()) return;
                var target = e.target;
                while (target.nodeName != "TD" && target != null) {
                    target = target.parentNode;
                }
                if (target == null) return;
                if (dom.hasClass(target, "uki-dataTable-header-cell")) {
                    var index = target.className.match(/uki-dataTable-col-(\d+)/)[1];
                    var col = this.columns();
                    var sortedlist = "";
                    if (this._sortable && col[index].sortable() !== false) {
                        if (!e.shiftKey) {
                            for (var i = 0; i < col.length; i++) {
                                if (i == index) {
                                    continue;
                                }
                                if (col[i].sort() != 0 && col[i].sortable() !== false) {
                                    col[i].sort(0);
                                }
                            }
                        }
                        col[index].sort(col[index].sort() + 1);
                        var sortfields = {};
                        sortedlist = "";
                        for (i = 0; i < col.length; i++) {
                            if (col[i].sort() > 0) {
                                sortfields[col[i].name()] = col[i].sort();
                                sortedlist += col[i].sort() + ",";
                            } else {
                                sortedlist += "0,";
                            }
                        }
                    }
                    if (sortedlist.length > 0) {
                        sortedlist = sortedlist.substring(0, sortedlist.length - 1);
                    }
                    this.trigger({
                        type: "columnClick",
                        column: this.columns()[index],
                        sort: sortfields,
                        sortedlist: sortedlist,
                        columnIndex: index
                    });
                }
            },
            _filter: function(e) {
                var self = e.target.self;
                self._handleFilterNotify();
            },
            _skipFilterNotify: false,
            _handleFilterNotify: function() {
                if (this._skipFilterNotify === true) return;
                if (this._columns == null || this._columns.length == 0) return;
                if (this._parent.isEditing()) {
                    this._parent.stopEditInPlace();
                }
                var values = {};
                var valueid = [];
                for (var i = 0; i < this._columns.length; i++) {
                    var fieldvalue = this._columns[i].filterValue();
                    values[this._columns[i].name()] = fieldvalue;
                    valueid[i] = fieldvalue;
                }
                try {
                    this.trigger({
                        type: "columnFilter",
                        fields: values,
                        byfieldid: valueid
                    });
                } catch (err) {}
            },
            _filterpresstimeout: function(e) {
                this._clearfilterInterval();
                var hasFocus = false;
                if (document.activeElement && document.activeElement == e.target) hasFocus = true;
                e.target.blur();
                if (hasFocus) e.target.focus();
            },
            _clearfilterInterval: function() {
                if (this._intervalId) {
                    clearInterval(this._intervalId);
                    this._intervalId = null;
                }
            },
            _filterpress: function(e) {
                if (e.charCode == 0) return;
                var self = e.target.self;
                self._clearfilterInterval();
                self._intervalId = setInterval(function(self, target) {
                    return function() {
                        self._clearfilterInterval();
                        self._filterpresstimeout(target);
                    };
                }(self, e), self._filterTimeout);
            },
            _filterkeydown: function(e) {
                if (e.charCode != 0) return;
                var self = e.target.self;
                if (e.keyCode == 13) {
                    if (self._enterFiltered) {
                        self._clearfilterInterval();
                        self._filterpresstimeout(e);
                        e.preventDefault();
                        e.cancelBubble = true;
                    } else {
                        e.target = self._parent._dom;
                        self._parent.trigger(e);
                    }
                } else if (e.keyCode == 9) {
                    self._clearfilterInterval();
                } else if (e.keyCode == 8 || e.keyCode == 46) {
                    self._clearfilterInterval();
                    self._intervalId = setInterval(function(self, target) {
                        return function() {
                            self._clearfilterInterval();
                            self._filterpresstimeout(target);
                        };
                    }(self, e), self._filterTimeout);
                } else if (e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 33 || e.keyCode == 34 || e.keyCode == 35 || e.keyCode == 36) {
                    var grid = self.parent().childViews()[1].childViews()[0];
                    var data = grid.data();
                    var maxrows = 0;
                    if (data != null) {
                        maxrows = data.length;
                    }
                    var range = grid._visibleRange();
                    var size = grid.metrics()._rowHeight;
                    var vrows = 1;
                    if (size > 0) {
                        vrows = (range.to - range.from) / size;
                    }
                    var idx = grid.selectedIndex();
                    if (idx == null) {
                        idx = 0;
                    }
                    var oldIdx = idx;
                    if (e.keyCode == 40) {
                        idx++;
                    } else if (e.keyCode == 38) {
                        idx--;
                    } else if (e.keyCode == 34) {
                        idx += vrows;
                    } else if (e.keyCode == 33) {
                        idx -= vrows;
                    } else if (e.keyCode == 36) {
                        idx = 0;
                    } else if (e.keyCode == 35) {
                        idx = maxrows;
                    }
                    if (idx >= maxrows) {
                        idx = maxrows - 1;
                    }
                    if (idx < 0) {
                        idx = 0;
                    }
                    if (idx != oldIdx) {
                        grid.selectedIndex(idx);
                        grid.scrollToIndex(idx);
                        grid.triggerSelection();
                    }
                }
            },
            _dragEnd: function(e) {
                this._drag(e);
                try {
                    this.trigger({
                        type: "resizeColumnEnd",
                        column: this.columns()[this._draggableColumn]
                    });
                } catch (err) {}
                this._draggableColumn = -1;
            },
            _dragStart: function(e) {
                if (e.target.tagName && e.target.tagName == "INPUT") {
                    e.isDefaultPrevented = fun.FT;
                    return;
                }
                if (dom.hasClass(e.target, "uki-dataTable-resizer")) {
                    e.draggbale = e.target;
                    e.cursor = dom.computedStyle(e.target, null).cursor;
                    var index = e.target.className.match(/uki-dataTable-resizer_pos-(\d+)/)[1];
                    this._draggableColumn = index;
                    this._initialWidth = this.columns()[index].width();
                } else {
                    e.preventDefault();
                }
            },
            _drag: function(e) {
                if (this._draggableColumn == -1) return;
                var width = this._initialWidth;
                if (e.dragOffset != null) {
                    width += e.dragOffset.x;
                } else {
                    width += e.clientX;
                }
                if (width < 10) width = 10;
                this._resizeColumn(this._draggableColumn, width);
                try {
                    this.trigger({
                        type: "resizeColumn",
                        column: this.columns()[this._draggableColumn]
                    });
                } catch (err) {}
            },
            _resizeColumn: function(pos, width) {
                var column = this.columns()[pos];
                column.width(width);
                try {
                    this.trigger({
                        type: "recalcTableSize"
                    });
                } catch (err) {}
            },
            _appendChildToDom: function(child) {
                this._rowheader.appendChild(child.dom());
            },
            columns: fun.newProp("columns", function(cols) {
                if (arguments.length) {
                    this._clearfilterInterval();
                    this.deleteAllCSSRules();
                    this._menu.remove();
                    var parentId = this.parent().CSSTableId();
                    for (var i = 0; i < cols.length; i++) {
                        cols[i]["view"] = "DataTableHeaderColumn";
                        var cssRule = this.addCSSRule("div.uki-dataTable" + parentId + " .uki-dataTable-col-" + cols[i].pos);
                        cols[i]["init"] = {
                            pos: cols[i].pos,
                            cssRule: cssRule,
                            filterable: this._filterable,
                            initfocus: cols[i].initfocus
                        };
                    }
                    this._childViews = [];
                    this._columns = build(cols);
                    this._columns.appendTo(this);
                    this._table.style.width = this.totalWidth() + "px";
                    this._setupFilters();
                    if (this._hasMenu) this._setupMenu();
                    this.trigger({
                        type: "render"
                    });
                }
                return this._columns;
            }),
            columnByName: function(name) {
                var id = this.columnIdByName(name);
                if (id != null) return this._columns[id];
                if (arguments.length == 2) {
                    return this.columnByLabel(name);
                }
                return null;
            },
            columnByLabel: function(name) {
                var id = this.columnIdByLabel(name);
                if (id != null) return this._columns[id];
                if (arguments.length == 2) {
                    return this.columnByName(name);
                }
                return null;
            },
            columnIdByName: function(name) {
                var lname = name.toLowerCase();
                for (var i = 0; i < this._columns.length; i++) {
                    if (this._columns[i]._name.toLowerCase() == lname) {
                        return i;
                    }
                }
                if (arguments.length == 2) {
                    return this.columnIdByLabel(name);
                }
                return null;
            },
            columnIdByLabel: function(name) {
                var lname = name.toLowerCase();
                for (var i = 0; i < this._columns.length; i++) {
                    if (this._columns[i]._label.toLowerCase() == lname) {
                        return i;
                    }
                }
                if (arguments.length == 2) {
                    return this.columnIdByName(name);
                }
                return null;
            },
            _setupFilters: function() {
                var eles = this._dom.getElementsByClassName("uki-dataTable-filter");
                for (var i = 0; i < eles.length; i++) {
                    eles[i].self = this;
                    evt.addListener(eles[i], "change", this._filter);
                    evt.addListener(eles[i], "keypress", this._filterpress);
                    evt.addListener(eles[i], "keydown", this._filterkeydown);
                }
            },
            hasFocus: function() {
                if (!this._filterable || this._columns == null) return false;
                for (var i = 0; i < this._columns.length; i++) {
                    if (this._columns[i].hasFocus()) return true;
                }
                return false;
            },
            focus: function() {
                if (!this._filterable || this._columns == null) return;
                for (var i = 0; i < this._columns.length; i++) {
                    if (this._columns[i].visible() && this._columns[i].filterable()) {
                        this._columns[i].focus();
                        return;
                    }
                }
            },
            blur: function() {
                if (!this._filterable || this._columns == null) return;
                for (var i = 0; i < this._columns.length; i++) {
                    this._columns.blur();
                }
            },
            clearFilters: function() {
                if (this._columns == null) return;
                this._skipFilterNotify = true;
                for (var i = 0; i < this._columns.length; i++) {
                    this._columns[i].filterValue("");
                }
                this._skipFilterNotify = false;
                this._handleFilterNotify();
            }
        });
        var DataTableList = view.newClass("DataTableList", DataList, {
            _setup: function(initArgs) {
                initArgs.packView = initArgs.packView || Pack;
                DataList.prototype._setup.call(this, initArgs);
            },
            columns: fun.newProp("columns"),
            _columns: [],
            _template: '<table class="uki-dataTable-pack"><tbody>{{#rows}}<tr class="uki-dataList-row uki-dataTable-row-{{index}} uki-dataTable-row{{^even}} uki-dataList-row_odd{{/even}}">{{#columns}}<td class="uki-dataTable-cell {{className}}" style="{{style}}">{{{value}}}</td>{{/columns}}<td class="uki-dataTable-cell uki-dataTable-spacer"></td></tr>{{/rows}}</tbody></table>',
            _createDom: function(initArgs) {
                DataList.prototype._createDom.call(this, initArgs);
                this.addClass("uki-dataTable-list");
            },
            _updateColumnSize: function(pos) {
                var column = this.columns()[pos];
                utils.forEach(this.childViews(), function(pack) {
                    pack.resizeColumn(pos, column.width);
                }, this);
            }
        });
        var table = {
            totalWidth: function(columns) {
                return utils.reduce(columns, function(s, col) {
                    return s + (col.visible ? col.width || 200 : 0);
                }, 0);
            },
            addColumnDefaults: function(columns) {
                return columns.map(function(col, pos) {
                    col = utils.extend({
                        pos: pos,
                        width: 200,
                        name: "",
                        className: "",
                        visible: true,
                        sort: 0,
                        formatter: dom.escapeHTML
                    }, col);
                    col.minWidth = Math.min(col.minWidth || 20, col.width);
                    if (col.maxWidth > 0) {
                        col.maxWidth = Math.max(col.maxWidth, col.width);
                    }
                    return col;
                });
            }
        };
        exports.DataTable = DataTable;
        exports.DataTableList = DataTableList;
        exports.DataTableAdvancedHeader = DataTableAdvancedHeader;
        exports.DataTableFooter = DataTableFooter;
        exports.table = table;
        exports.DataTableHeaderColumn = DataTableHeaderColumn;
    };
    require_modules[35] = function(global, module, require) {
        var exports = this;
        var fun = require(7), utils = require(4), dom = require(13), Mustache = require(19).Mustache, Base = require(32).Pack;
        var Pack = fun.newClass(Base, {
            render: function(rows, selectedInPack, globalIndex) {
                this._dom.innerHTML = this._toHTML(rows, globalIndex);
                this._tbody = this._dom.getElementsByTagName("tbody")[0];
                this._restorePackSelection(selectedInPack || [], globalIndex);
            },
            updateRow: function(index, rows, globalIndex) {
                var tmp = dom.createElement("div", {
                    html: this._toHTML(rows, globalIndex)
                });
                var item = this._rowAt(index);
                var replaceWith = tmp.getElementsByTagName("tbody")[0].childNodes[0];
                item.parentNode.replaceChild(replaceWith, item);
            },
            resizeColumn: function(visiblePos, width) {
                var tr = this._rowAt(0), td = tr && tr.childNodes[visiblePos];
                if (td) {
                    td.style.width = width + "px";
                }
            },
            setSelected: function(position, state) {
                var row = this._rowAt(position);
                if (row) {
                    dom.toggleClass(row, "uki-dataTable-row_selected", state);
                }
            },
            _toHTML: function(rows, globalIndex) {
                var parentGrid = null;
                if (this.parent() && this.parent().parent()) {
                    parentGrid = this.parent().parent().parent();
                }
                var formated = utils.map(rows, function(row, i) {
                    var pos = i + globalIndex;
                    return {
                        columns: this._formatColumns(row, pos, parentGrid),
                        row: row,
                        index: pos,
                        even: pos & 1
                    };
                }, this);
                return Mustache.to_html(this.template(), {
                    rows: formated
                });
            },
            _createDom: function(initArgs) {
                this._dom = dom.createElement("div", {
                    className: "uki-dataList-pack"
                });
            },
            _rowAt: function(pos) {
                return this._tbody && this._tbody.childNodes[pos];
            },
            _formatColumns: function(row, pos, parentGrid) {
                var cols = [];
                if (this.parent() == null) return;
                this.parent().columns()[0].styler(row, pos, parentGrid);
                this.parent().columns().forEach(function(col, i) {
                    var val = col.key ? utils.prop(row, col.key) : row[i];
                    cols[i] = {
                        value: col.formatter(val || "", row, i, pos),
                        className: "uki-dataTable-col-" + i + (col.className ? " " + col.className : "")
                    };
                });
                return cols;
            }
        });
        exports.Pack = Pack;
    };
    require(0);
})();