var env = require('./env'),
    utils = require('./utils');


var trans = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
};

/**
 * Basic utils to work with the dom tree
 * @namespace
 * @author voloko
 */
module.exports = {
    /**
     * Convenience wrapper around document.createElement
     * Creates dom element with given tagName, cssText and innerHTML
     *
     * @param {string} tagName
     * @param {string=} cssText
     * @param {string=} innerHTML
     * @returns {Element} created element
     */
    createElement: function(tagName, options, children) {
        var e = env.doc.createElement(tagName);
        utils.forEach(options || {}, function(value, name) {
            if (name == 'style') { e.style.cssText = value; }
            else if (name == 'html') { e.innerHTML = value; }
            else if (name == 'className') { e.className = value; }
            else { e.setAttribute(name, value); }
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
        var style = env.doc.createElement('style');
        style.type = "text/css";
        var ss = env.doc.getElementsByTagName('head')[0];
        if (style.styleSheet) { //IE
              style.styleSheet.cssText = code;
        } else {
              style.appendChild(env.doc.createTextNode(code));
        }
        if (ss.firstChild) {
          ss.insertBefore(style, ss.firstChild);
        }
        else {
          ss.appendChild(style);
        }
        return style;
    },

    addCSSRule: function(stylesheet, name, value) {
      if (stylesheet.insertRule) {
        return (stylesheet.insertRule(name+" { "+value+" }",stylesheet.cssRules.length));
      } else {
        return (stylesheet.addRule(name,value,-1));
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
        var fragment = env.doc.createElement('div');
        fragment.innerHTML = html;
        return fragment.firstChild;
    },

    getOffset: function( element, toParent ) {
      var _x = 0;
      var _y = 0;
      while( element && element != toParent && !isNaN( element.offsetLeft ) && !isNaN( element.offsetTop ) ) {
        _x += element.offsetLeft - element.scrollLeft;
        _y += element.offsetTop - element.scrollTop;
        element = element.offsetParent;
      }
      return { top: _y, left: _x };
    },

    // client rect adjusted to window scroll
    clientRect: function(elem, ignoreScroll) {
        var rect = elem.getBoundingClientRect();
        var result = {
          top:    rect.top | 0,
          left:   rect.left | 0,
          right:  rect.right | 0,
          bottom: rect.bottom | 0,
          width:  (rect.right - rect.left) | 0,
          height: (rect.bottom - rect.top) | 0
        };

        if (ignoreScroll) { return result; }

        var body = env.doc.body;
        result.top += env.root.pageYOffset || body.scrollTop;
        result.top += env.root.pageXOffset || body.scrollLeft;
        return result;
    },

    hasClass: function(elem, className) {
        return (' ' + elem.className + ' ').indexOf(' ' + className + ' ') > -1;
    },

    addClass: function(elem, classNames) {
        var string = elem.className;
        utils.forEach(classNames.split(/\s+/), function(className) {
            if (!this.hasClass(elem, className)) {
                string += (string ? ' ' : '') + className;
            }
        }, this);
        elem.className = string;
    },

    removeClass: function(elem, classNames) {
        var string = elem.className;
        utils.forEach(classNames.split(/\s+/), function(className) {
            string = utils.trim(string
                .replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)', 'g'), ' ')
                .replace(/\s{2,}/g, ' '));
        }, this);
        elem.className = string;
    },

    toggleClass: function(elem, className, condition) {
        if (arguments.length < 3) {
            condition = !this.hasClass(elem, className);
        }
        condition ? this.addClass(elem, className) :
            this.removeClass(elem, className);
    },

    /**
     * Converts unsafe symbols to entities
     *
     * @param {string} html
     * @returns {string} escaped html
     */
    escapeHTML: function(html) {
        return (html + '').replace(/[&<>\"\']/g, function(c) { return trans[c]; });
    }
};
