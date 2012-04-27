requireCss('./menu/menu.css');

var fun  = require('../../uki-core/function'),
    dom  = require('../../uki-core/dom'),
    view = require('../../uki-core/view'),
    utils = require('../../uki-core/utils'),
    evt = require('../../uki-core/event'),
    env = require('../../uki-core/env'),

    Base = require('../../uki-core/view/base').Base;



var Menu = view.newClass('Menu', Base, {
    _createDom: function() {
        this._dom = dom.createElement('ul', { className: 'uki-menu-horizontal uki-menu-horizontal-no-touch uki-textSelectable_off' });
        this._hasTouch = false,
        this.on('click', fun.bind(this._click, this));
        this.on('touchstart', fun.bind(this._touchstart,this));
        this._bindedTouchOut = fun.bindOnce(this._touchout, this);

        this.on('touchend', this._touchprevent);
        this.on('touchmove', this._touchprevent);
    },
    destruct: function() {
      if (this._hasTouch) {
        evt.removeListener(env.doc, "click", this._bindedTouchOut);
      }
      Base.prototype.destruct.call(this);
    },
    _touchout: function(event)
    {
      // Catch any errors in our handler, in case we are being destroyed and "this" is no longer valid...
      try {
        var eles = this._dom.getElementsByClassName("uki-menu-focus");
        for (var i=0;i<eles.length;i++) {
          dom.removeClass(eles[i], "uki-menu-focus");
        }
        this._closeMenu(this._dom);
      } catch (err) { };
    },
    _touchprevent: function(event)
    {
      event.stopPropagation();
      event.preventDefault();


      return (false);
    },

    _lastElement: null,
    _touchstart: function(event) {
       // This is to allow us to short circuit the "Click Event", and remove "hover" events since this is a touch device
      if (!this._hasTouch) {
        dom.removeClass(this._dom, 'uki-menu-horizontal-no-touch');
        evt.addListener(env.doc, "click", this._bindedTouchOut);
        this._hasTouch = true;
      }
       event.stopPropagation();
       event.preventDefault();

      if (event.baseEvent) {
        var e = event.baseEvent;
      } else {
        var e = event;
      }

      if (e.touches) {
        var touch = e.touches[0];
      } else {
        touch = e;
      }

      // Find the "A" tag that we clicked on
      var target = touch.target;
      while (target.parentNode && target.tagName != "A") {
        target = target.parentNode;
      }
      var clickedItem = target;
      if (target == null) return;

      // Find any other elements that have the focus and clear the focus
      var eles = this._dom.getElementsByClassName("uki-menu-focus");
      for(var i=0;i<eles.length;i++) {
        if (eles[i] != target) {
          dom.removeClass(eles[i], "uki-menu-focus");
        }
      }
      // Set the focus to the new element if it doesn't already have focus
      if (!dom.hasClass(target, "uki-menu-focus")){
          dom.addClass(target, "uki-menu-focus");
      } else {
        if (dom.hasClass(target.parentNode, "uki-menu-primary")) {
          dom.removeClass(target,"uki-menu-focus");
          this._closeMenu(this._dom);
          return;
        }
      }



      // Find the Next UL tag to see if we need to show it
      target = target.nextSibling;
      while (target != null && target.nodeName == "#text") {
        target = target.nextSibling;
      }

      // We have a Sub-Menu, show it.
      if (target != null) {
        this._closeMenu(target);
        dom.addClass(target,"uki-menu-visible");
      } else {
        // NO Sub-menu, this is a clicked element
        this._closeMenu(this._dom);

        var name = clickedItem.name;
        if (clickedItem.href == "javascript:void(0);") {

          this.trigger({
            type: "menuClick",
            name: name,
            option: clickedItem,
            menu: this
          });
          try {
            clickedItem.blur();
          } catch (err){ /* console.log(err); */ };
        }

      }

    },
    _closeMenu: function(domElement) {
        var eles = this._dom.getElementsByClassName("uki-menu-visible");
        for (var i=0;i<eles.length;i++) {
          if (!dom.isAChild(domElement, eles[i], this._dom) || this._dom === domElement) {
            dom.removeClass(eles[i],"uki-menu-visible");
          }
        }

    },

    _click: function(event) {
      event.preventDefault();
      event.stopPropagation();
      if (this._hasTouch === true) return;

      // Find the "Wrapping 'A'" tag.
      var target = event.target;
      while (target.parentNode && target.tagName != "A") {
        target = target.parentNode;
      }


      /*
      if (this._lastElement != target) {
        this._lastElement = target;
        return;
      } */

      // Find the Parent "UL" to make it hide
      var parentUl = target;
      while (parentUl.parentNode && parentUl.tagName != "UL") {
        parentUl = parentUl.parentNode;
      }

      // As long as this isn't the "main" menu, we will do this code
      if (!dom.hasClass(parentUl, "uki-menu-horizontal")) {
        parentUl.style.display="none";
        // We have to give the ui enough time to make the menu disappear, before we allow the normal css to handle open/closing again
        setTimeout(function() {parentUl.style.display="";}, 200);
      }

      // Publish event
      var name = target.name;
      if (target.href == "javascript:void(0);") {
        this.trigger({
          type: "menuClick",
          name: name,
          option: target,
          menu: this
        });
      }
    },

    options: fun.newProp('options', function(val) {
      if (arguments.length === 0) return (this._options);
      this._options = val;
      this._menuitems = [];
      this._dom.innerHTML = '';
      appendMenuOptions(this._dom, val, this._menuitems, 0);
      return this;
    }),
    _options: [],


});




function appendMenuOptions ( root, options, level ) {
  var node, node_li, node_a;

  utils.forEach( options, function ( option ) {

    if (typeof option === 'string' || typeof option === 'number') {
        option = { text: option };
    }

    if (level == 0) className = "uki-menu-primary";
    else className = "uki-menu";

    node_li = dom.createElement('li', {className: className});

    if (option.text === '-' || option.text === '---' || option.text === '--') {
      node_a = dom.createElement('hr');
    } else {
      node_a = dom.createElement('a', {
        draggable: false, ondragstart: "return false;",
        href: option.url ? option.url :'javascript:void(0);',
        html: option.html ? option.html : dom.escapeHTML( option.text ),
        name: option.name ? option.name : option.text,
        tabIndex: -1});
      if (option.accessKey) node_a.accessKey = option.accessKey;
      if (option.className) dom.addClass(node_a, option.className);
    }
    option.element = node_a;
    if (option.visible === false) node_li.style.display="none";
    option.setText = function(value) {
      this.element.innerHTML = dom.escapeHTML(value);
      this.text = value;
    };
    option.setHTML = function(value) {
      this.element.innerHTML = value;
      this.html = value;
    };
    option.value = function()
    {
      return this.html ? this.html : this.text;
    };
    option.visibility = function(value) {
      var e = this.element.parentNode.style;

       if (value === true) {
          e.display = "";
       } else if (value === false) {
         e.display = "none";
       } else {
         if (e.display == "none") return (false);
         return (true);
       }
    };

    node_li.appendChild(node_a);

    if ( option.options && option.options.length > 0 ) {
      node = dom.createElement( 'ul' );
      if (level > 0) dom.addClass(node_li, 'uki-menu-submenu');
      node_li.appendChild(node);
      appendMenuOptions( node, option.options,  level+1 );
    }
    root.appendChild( node_li );
  } );
}

exports.Menu   = Menu;
