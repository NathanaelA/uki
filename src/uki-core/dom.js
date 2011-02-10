importScripts('const.js');
importScripts('uki.js');
importScripts('utils.js');

/**
 * Basic utils to work with the dom tree
 * @namespace
 * @author voloko
 */
uki.dom = {
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
        var e = doc.createElement(tagName);
        uki.forEach(options || {}, function(value, name) {
            if (name == 'style') e.style.cssText = value;
            else if (name == 'html') e.innerHTML = value;
            else if (name == 'className') e.className = value;
            else e.setAttribute(name, value);
        });
        children && children.forEach(function(c) {
            e.appendChild(c);
        });
        return e;
    },

    removeElement: function(element) {
        if (element && element.parentNode) element.parentNode.removeChild(element);
    },

    createStylesheet: function(code) {
        var style = doc.createElement('style');
        doc.getElementsByTagName('head')[0].appendChild(style);
        style.appendChild(document.createTextNode(code));
        return style;
    },

    fromHTML: function(html) {
        var fragment = document.createElement('div');
        fragment.innerHTML = html;
        return fragment.firstChild;
    },

    // client rect adjugested to window scroll
    clientRect: function(elem, ignoreScroll) {
        var rect = elem.getBoundingClientRect();
        if (ignoreScroll) return rect;

        var body = doc.body,
            scrollTop  = root.pageYOffset || body.scrollTop,
            scrollLeft = root.pageXOffset || body.scrollLeft;
        return {
            top: rect.top  + scrollTop,
            left: rect.left + scrollLeft,
            width: rect.width,
            height: rect.height
        };
    },

    hasClass: function(elem, className) {
        return (' ' + elem.className + ' ').indexOf(' ' + className + ' ') > -1;
    },

    addClass: function(elem, className) {
        if (!this.hasClass(elem, className))
            elem.className += (elem.className ? ' ' : '') + className;
    },

    removeClass: function(elem, className) {
        elem.className = elem.className
            .replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)', 'g'), ' ')
            .replace(/\s{2,}/g, ' ');
    },

    toggleClass: function(elem, className, condition) {
        if (condition === undefined) condition = !this.hasClass(elem, className);
        condition ? this.addClass(elem, className) : this.removeClass(elem, className);
    }

};

uki.extend(uki, uki.dom);
