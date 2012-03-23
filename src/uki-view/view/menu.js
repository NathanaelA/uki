requireCss('./menu/menu.css');

var fun  = require('../../uki-core/function'),
    dom  = require('../../uki-core/dom'),
    view = require('../../uki-core/view'),
    utils = require('../../uki-core/utils'),

    Base = require('../../uki-core/view/base').Base;



var Menu = view.newClass('Menu', Base, {
    _createDom: function() {
        this._dom = dom.createElement('ul', { className: 'uki-menu-horizontal uki-textSelectable_off' });
        this.on('click', this._click);
    },

    _click: function(event) {

      // Find the "Wrapping 'A'" tag.
      var target = event.target;
      while (target.parentNode && target.tagName != "A") {
        target = target.parentNode;
      }

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
      if (target.href == "javascript:void(0)") {
        this.trigger({
          type: "menuClick",
          name: name,
          option: target
        });
      }
    },

    options: fun.newProp('options', function(val) {
      this._options = val;
      this._dom.innerHTML = '';
      appendMenuOptions(this._dom, val, 0);
      return this;
    })

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
    node_a = dom.createElement('a', {
      draggable: false, ondragstart: "return false;",
      href: option.url ? option.url : 'javascript:void(0)',
      html: option.html ? option.html : dom.escapeHTML( option.text ),
      name: option.name ? option.name : option.text,
      tabIndex: -1});

    if (option.visible === false) node_li.style.display="none";
    if (option.accessKey) node_a.accessKey = option.accessKey;
    if (option.className) dom.addClass(node_a, option.className);

    node_li.appendChild(node_a);

    if ( option.options && option.options.length > 0 ) {
      node = dom.createElement( 'ul' );
      if (level > 0) dom.addClass(node_li, 'uki-menu-submenu');
      node_li.appendChild(node);
      appendMenuOptions( node, option.options, level+1 );
    }
    root.appendChild( node_li );
  } );
}

exports.Menu   = Menu;
