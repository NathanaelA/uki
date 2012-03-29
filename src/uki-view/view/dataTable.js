requireCss('./dataTable/dataTable.css');

var fun   = require('../../uki-core/function'),
    utils = require('../../uki-core/utils'),
    env = require('../../uki-core/env'),
    dom   = require('../../uki-core/dom'),
    view  = require('../../uki-core/view'),
    build = require('../../uki-core/builder').build,

    Pack      = require('./dataTable/pack').Pack,
    DataList  = require('./dataList').DataList,
    Mustache  = require('../../uki-core/mustache').Mustache,
    Base      = require('../../uki-core/view/base').Base,
    Container = require('../../uki-core/view/container').Container,
    evt       = require('../../uki-core/event'),
    Menu      = require('./menu').Menu;


// This is to allow all defined Tables to have a unique class assigned to them
// The Table will generate CSS for its own Table, and we want to make sure we don't
// Step on another defined Table; so we increment on each table created
var _DataTableCounter = 0;

var DataTable = view.newClass('DataTable', Container, {
    columns: function(cols) {
        if (!arguments.length) {
            return this._list.columns();
        }
        if (this.hasFocus()) {
          var _hasFocus = true;
        }
        cols = table.addColumnDefaults(cols);
        this._list.columns(cols);
        this._header.columns(cols);

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

    CSSTableId: fun.newProp("CSSTableId"),
    _CSSTableId: 0,

    _createDom: function(initArgs) {
        _DataTableCounter++;
        this._CSSTableId = _DataTableCounter;
        this._dom = dom.createElement('div', {className: 'uki-dataTable uki-dataTable'+this._CSSTableId});

        var c = build([

            { view: initArgs.headerView || DataTableAdvancedHeader, as: 'header',
              addClass: 'uki-dataTable-header-container',
              on: { resizeColumn: fun.bind(this._resizeColumn, this) ,
                    scroll: fun.bind(this._scrollChild, this) } },

            { view: Container, pos: 't:0 l:0 r:0 b:0',
              addClass: 'uki-dataTable-container', as: 'container',
              on: { scroll: fun.bind(this._scrollHeader, this) },
              childViews: [
                { view: initArgs.listView || DataTableList, as: 'list',
                  on: { selection: fun.bind(this.trigger, this) } }
              ] }

        ]).appendTo(this);

        this._header = c.view('header');
        this._header.on('render', fun.bindOnce(this._updateHeaderHeight, this));
        this._container = c.view('container');
        this._container.dom().tabIndex = -1; // Remove tab focusablity
        this._list = c.view('list');
    },

    _updateHeaderHeight: function() {
        var pos = this._container.pos();
        pos.t = this._header.clientRect().height + 'px';
        this._container.pos(pos);
        if (this._deferFocus === true) {
          this.focus();
        }
    },

    _initLayout: function() {
        this._updateHeaderHeight();
    },

    _scrollHeader: function(e) {
      var lastHeader = this._header.scrollLeft();
      var newHeader = this._container.scrollLeft();
      if (lastHeader != newHeader) {
        this._header.scrollLeft(newHeader);
        if (this._header._menu != null) {
          this._header._menu.dom().style.marginLeft=-newHeader+"px";
        }
      }
    },

    _scrollChild: function(e) {
      var lastHeader = this._container.scrollLeft();
      var newHeader = this._header.scrollLeft();

      if (lastHeader != newHeader) {
        this._container.scrollLeft(newHeader);
        if (this._header._menu != null) {
          this._header._menu.dom().style.marginLeft=-newHeader+"px";
        }
      }
    },

    _resizeColumn: function(e) {
        if (typeof e.column.pos === 'function' ) {
            // Don't have to do anything...
        } else {
          this._list._updateColumnSize(e.column.pos);
        }
    },

    focus: function() {
      if (this._list.columns().length == 0) {
        this._deferFocus = true;
        return;
      }
      if (this._header.filterable) {
        var hc = this._header.columns();
        // Search for initfocus
        var found=false;
        for (var i = 0; i < hc.length && !found; i++) {
          if (hc[i].visible() && hc[i].filterable() && hc[i]._filter.hasClass('initfocus')) {
            hc[i].focus();
            found = true;
          }
        }
        if(!found) {
          for(var i=0;i<hc.length && !found;i++) {
            if (hc[i].visible() && hc[i].filterable()) {
              hc[i].focus();
              found=true;
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
      if (this._list.hasFocus()) return (true);
      if (this._header.hasFocus()) return (true);
      return (false);
    },

    blur: function() {
      this._list.blur();
      this._header.blur();
    }


});

fun.delegateProp(DataTable.prototype, [
    'data', 'throttle', 'debounce', 'template', 'formatter', 'key',
    'selection', 'selectedRows', 'selectedRow',
    'selectedIndexes', 'selectedIndex', 'lastClickIndex', 'multiselect'
], 'list');

fun.delegateCall(DataTable.prototype, [
    'scrollToIndex', 'triggerSelection', 'redrawRow'
], 'list');

fun.delegateProp(DataTable.prototype, ['filterable', 'filterTimeout', 'sortable', 'hasMenu',
  'menuOptions', 'menu', 'menuImage'], 'header');

var DataTableHeaderColumn = view.newClass( 'DataTableHeaderColumn', Base, {

  // Properties for this Class
  className: fun.newProp( 'className', function(v) {
    if (arguments.length) {
        if (this._className === v) return (v);
        if (this._className.length > 0) {
          dom.removeClass( this._dom, this._className );
        }
        this._className = v;
        dom.addClass(this._dom, this._className);
    }
    return (this._className);
  } ),
  _className: '',
  resizable: fun.newProp( 'resizable', function(v) {
    if (arguments.length) {
      this._resizable = v;
      this._setupResizeable();
    }
    return (this._resizable);
  } ),
  _resizable: true,
  sortable: fun.newProp( 'sortable' ),
  _sortable: true,
  filterable: fun.newProp( 'filterable', function(v) {
    if (arguments.length) {
      this._filterable = v;
      if (this.parent() == null) return;
      if (v && this.parent().filterable()) {
        this._filter.style.display = '';
      } else {
        this._filter.style.display = 'none';
      }
    }
    return (this._filterable);
  } ),
  _filterable: true,
  maxWidth: fun.newProp( 'maxWidth', function ( v ) {
    if ( arguments.length ) {
      this._maxWidth = Math.max( v, this._width );
      if (this._minWidth == this._maxWidth) {
        this._sizeable = false;
      } else {
        this._sizeable = true;
      }
      this._setupResizeable();
    }
    return this._maxWidth;
  } ),
  _maxWidth: 0,
  width: fun.newProp( 'width', function ( v ) {
    if ( arguments.length ) {
      var newWidth = Math.min( Math.max( v, this._minWidth ), this._maxWidth == 0 ? v : this._maxWidth);
      if ( newWidth != this._width ) {
        this._width = newWidth;
        if ( this.parent() != null ) {
          this.parent().updateCSSRules( this._cssRule, 'width', this._width + "px" );
        }
      }
    }
    return (this.width);
  } ),
  _width: 200,
  minWidth: fun.newProp( 'minWidth', function ( v ) {
    if ( arguments.length ) {
      this._minWidth = Math.min( v, this._width );
      if (this._minWidth == this._maxWidth) {
        this._sizeable = false;
      } else {
        this._sizeable = true;
      }
      this._setupResizeable();
    }
    return this._minWidth;
  } ),
  _minWidth: 20,
  label: fun.newProp( 'label', function ( v ) {
    if ( arguments.length ) {
      this._label = v;
      this._labelElement.innerHTML = dom.escapeHTML( this._label );
      this._labelElement.title = this._labelElement.innerHTML;
      if (this._hasMenu) {
          this._labelElement.style.marginLeft="16px";
      } else {
          this._labelElement.style.marginLeft="";
      }
      if (this._name.length === 0) this.name(v);
    }
    return (this._label);
  } ),
  _label: '',
  name: fun.newProp( 'name', function ( v ) {
    if ( arguments.length ) {
      this._name = v;
      this._filter.name = this._name;
    }
    return this._name;
  } ),
  _name: '',
  visible: fun.newProp( 'visible', function ( v ) {
    if ( arguments.length ) {
      this._visible = v;
      if ( this.parent() != null ) {
        if ( v ) {
          this.parent().updateCSSRules( this._cssRule, 'display', '' );
        } else {
          this.parent().updateCSSRules( this._cssRule, 'display', 'none' );
        }
      }
    }
    return (this._visible);
  } ),
  _visible: true,
  sort: fun.newProp( 'sort', function(v) {
    if (arguments.length) {
      if (v > 2 || v < 0) v = 0;
      this._sort = v;
      if (this.parent() == null) return (this._sort);

      if (this.parent().sortable()) {
        dom.removeClass( this._labelElement, "uki-dataTable-sort-down uki-dataTable-sort-up" );
        if (v === 1) {
          dom.addClass( this._labelElement, "uki-dataTable-sort-down" );
        } else if (v === 2) {
          dom.addClass( this._labelElement, "uki-dataTable-sort-up" );
        }
      }
    }
    return (this._sort);
  } ),
  _sort: 0,
  headerstyle: fun.newProp( 'headerstyle', function ( v ) {
    if ( arguments.length ) {
      this._headerstyle = v;
      this._dom.style = v;
    }
    return this._headerstyle;
  } ),
  _headerstyle: '',
  style: fun.newProp( 'style', function ( v ) {
    if ( !arguments.length || v == null ) {
      return this._style;
    }
    this._style = v;
    if ( this.Parent() != null ) {
      this._parseStyle();
    }
    return this._style;
  } ),
  _style: '',
  formatter: fun.newProp('formatter'),
  _formatter: dom.escapeHTML,
  hasMenu: fun.newProp('hasMenu', function(v) {
    if (arguments.length) {
      if (this._hasMenu == v) return (this._hasMenu);
      this._hasMenu = v;
      this.label(this._label);
    }
    return (this._hasMenu);
  }),
  _hasMenu: false,
  filterValue: fun.newProp('filterValue', function(v) {
      if (arguments.length) {
        if (this._filter.value === v) return;
        this._filter.value = v;
        if (this.parent() != null) this.parent()._handleFilterNotify();
      }
      return (this._filter.value);
  }),


  // _pos is not a changeable property, only can be set at creation, this is because too many things depend on this!
  // it would be a pain to try and make sure things that link via the _pos are updated
  _pos: 0,

  // This gets assigned the rule # in the CSS stylesheet rule that is related to this column so we can modify
  // it and affect all columns, this also is set once when the Columns are created
  _cssRule: -1,

  // Used to track if Max/Min Width are equal -- if so, resizabe is disabled also
  _sizeable: true,

  _createDom: function ( initArgs ) {
    if ( initArgs.pos != null ) {
      this._pos = initArgs.pos;
    }
    if ( initArgs.cssRule != null ) {
      this._cssRule = initArgs.cssRule;
    }
    var filterStyle='';
    if (initArgs.filterable != null) {
      if (initArgs.filterable === false) {
        filterStyle='display:none';
      }
    }

    var className = 'uki-dataTable-header-cell uki-dataTable-col-' + this._pos;

    this._labelElement =
        dom.createElement( 'div', {className: "uki-dataTable-header-text"} );
    this._resizer =
        dom.createElement('div', {className: "uki-dataTable-resizer uki-dataTable-resizer_pos-"+this._pos});
    this._resizer.innerHTML = "|";
    this._filter =
        dom.createElement( 'input', {className: "uki-dataTable-filter" + (initArgs.initfocus ? ' initfocus' : ''), tabIndex: 1, autocomplete: "off", name: this._name, style: filterStyle} )
    this._wrapper =
        dom.createElement( 'div', {className: "uki-dataTable-header-wrap"}, [this._labelElement, this._filter, this._resizer] );
    this._dom =
        dom.createElement( 'td', {className: className}, [this._wrapper] );
    fun.deferOnce( fun.bindOnce( this._finishSetup, this ) );

  },

  _setupResizeable: function() {
    if (this._resizable && this._sizeable) {
      this._resizer.style.display = '';
      dom.addClass( this._dom, "uki-dataTable-header-cell_resizable" );
    } else {
      this._resizer.style.display = 'none';
      dom.removeClass( this._dom, "uki-dataTable-header-cell_resizable" );
    }
  },

  _parseStyle: function () {
    if (this._style == null) return;
    if ( typeof this._style  === "object" ) {
      for ( var key in this._style ) {
        if ( !this._style.hasOwnProperty( key ) ) {
          continue;
        }
        this.parent().updateCSSRules(this._cssRule, key, this._style[key]);
      }
    } else {
      var exp = this._style.split(';');
      for(var i=0;i<exp.length;i++) {
        var parts = exp[i].split(':');
        if (parts[0].length == 0 || parts.length != 2) continue;
        this.parent().updateCSSRules(this._cssRule, parts[0], parts[1]);
      }
    }
  },

  // do to the fact that .parent() is not assigned right away; we need to finish setting up
  // all the rules after the object is fully built
  _finishSetup: function () {
    if ( !this._visible ) {
      this.parent().updateCSSRules( this._cssRule, 'display', 'none' );
    }
    this.parent().updateCSSRules( this._cssRule, 'width', this._width + "px" );
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
    }
    catch(err) {
 //     console.log("Error on focus",err);
    }
  },

  hasFocus: function() {
    return this._filter == env.doc.activeElement;
  },

  blur: function() {
    try {
      if (this.hasFocus()) this._filter.blur();
    } catch (err) {}
  }

} );

var DataTableAdvancedHeader = view.newClass('DataTableAdvancedHeader', Container, {
  filterable: fun.newProp('filterable', function (v) {
    if (arguments.length) {
      if (this._filterable !== v) {
        this._filterable = v;
        if (this._columns == null) return (this._filterable);
        // Reset Columns Filterable State, since the parent just changed
        for(var i=0;i<this._columns.length;i++) {
          this._columns[i].filterable(this._columns[i].filterable());
        }
        this.trigger({ type: 'render' });
      }
    }
    return (this._filterable);
  }),
  _filterable: false,
  enterFiltered: fun.newProp('enterFiltered'),
  _enterFiltered: false,
  filterTimeout: fun.newProp('filterTimeout'),
  _filterTimeout: 500,
  sortable: fun.newProp('sortable'),
  _sortable: false,
  _intervalId: null,

  hasMenu: fun.newProp('hasMenu', function(v) {
      if (arguments.length) {
        if (this._hasMenu == v) return (v);
        this._hasMenu = v;
        this._setupMenu();
      }
      return (this._hasMenu);
  }),
  _hasMenu: false,
  menu: function () {
    return (this._menu);
  },
  _menu: null,
  menuImage: fun.newProp('menuImage', function(v) {
    if (arguments.length) {
      this._menuImage = v;
      this._setupMenuOptions();
    }
    return (this._menuImage);
  }),
  _menuImage: "data:image/gif;base64,R0lGODlhEAAQAJEAAP39/ebm5ikpKZqamiH5BAAAAAAALAAAAAAQABAAAAIzhI+pqzEBgpwSDTGu2DuzfzgQNSVXxqWDaZAVIkauiWkpxspkUrqQVbt1YA8dBfTxKQMFADs=",
  menuOptions: fun.newProp('menuOptions', function(v) {
    if (arguments.length) {
        //console.log("Menu: ", this._hasMenu, v);
        this._menuOptions = v;
        this._setupMenuOptions();
    }
    return (this._menuOptions);
  }),
  _menuOptions: null,
  _styleSheetElement: null,
  _styleSheet: null,


    _createDom: function(initArgs) {

        Base.prototype._createDom.call(this, initArgs);
        this._rowheader = dom.createElement('tr', {className: 'uki-dataTable-header-row'});
        this._table = dom.createElement('table', { className: 'uki-dataTable-header' }, [this._rowheader]);
        this._dom = dom.createElement('div', null, [this._table]);
        this._styleSheetElement = dom.createStylesheet(' ');
        if (this._styleSheetElement.sheet && this._styleSheetElement.sheet.cssRules) {
          this._styleSheet = this._styleSheetElement.sheet;
        } else {
          this._styleSheet = this._styleSheetElement.styleSheet; // IE
        }


        this._menu = build([
        { view: Menu, as: 'DataTable-Menu',
          addClass: 'uki-dataTable-menu' }
        ]);

        this._draggableColumn = -1;
        this.on('draggesturestart', this._dragStart);
        this.on('draggesture', this._drag);
        this.on('draggestureend', this._dragEnd);
        this.on('click', this._click);
        this._setupMenu();

    },

/*    _finishSetup: function() {
      this._setupMenu();
    }, */

    _setupMenu: function() {
      if (this.parent() == null || this.parent().length == 0 || this._columns == null)  {
        fun.deferOnce( fun.bindOnce( this._setupMenu, this ) );
        return;
      }
      if (this._hasMenu) {
        var found=false;
        if (this._menu.parent() == null || this._menu.parent().length == 0) {
          this._menu.attach(this.parent().dom(), true);
          for(var i=0;i<this._columns.length;i++) {
            if (found || this._columns[i].visible() === false) {
              this._columns[i].hasMenu(false);
            } else if (!found) {
              this._columns[i].hasMenu(true);
              found=true;
            }
          }
        }
      } else {
        this._menu.remove();
          for(var i=0;i<this._columns.length;i++) {
            this._columns[i].hasMenu(false);
          }
      }
    },

    _setupMenuOptions: function() {
      var lmenu = [];
      lmenu[0] = {html: '<img src="'+this._menuImage+'" draggable=false width="12px" height="12px" border=0 ondragstart="return false;">', options: this._menuOptions};
      this._menu.options(lmenu);
    },

    destruct: function() {
      this._styleSheet = null;
      dom.removeElement(this._styleSheetElement);
    },

    deleteAllCSSRules: function() {
      var count=0;

      if (this._styleSheet.cssRules) {
        count=this._styleSheet.cssRules.length;
      }
      else {
        count = this._styleSheet.rules.length;
      }
      for(var i=count-1;i>=0;i--) {
        dom.deleteCSSRule(this._styleSheet, i);
      }
    },

    addCSSRule: function(id) {
        return(dom.addCSSRule(this._styleSheet, id, "display:;"));
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
      } catch (e) {
        //console.log("Error in Update CSSRules ", e);
      }
    },

    _click: function(e) {
      if (this._draggableColumn != -1) return;
      e.isDefaultPrevented = fun.FF;

      if (e.target.nextSibling && e.target.nextSibling.nextSibling && dom.hasClass(e.target.nextSibling.nextSibling, "uki-dataTable-resizer")) {
        var index = e.target.nextSibling.nextSibling.className.match(/uki-dataTable-resizer_pos-(\d+)/)[1];
        var col = this.columns();
        var eles = this._dom.getElementsByClassName("uki-dataTable-header-text");

        if ( this._sortable && col[index].sortable() !== false) {
          // Handle Sorting
          if ( !e.shiftKey ) {
            for ( var i = 0; i < col.length; i++ ) {
              if ( i == index ) {
                continue;
              }
              if ( col[i].sort() != 0 && col[i].sortable() !== false) {
                col[i].sort(0);
              }
            }
          }

          col[index].sort(col[index].sort()+1);

          var sortfields = {};
          var sortedlist = '';
          for ( i = 0; i < col.length; i++ ) {
            if ( col[i].sort() > 0 ) {
              sortfields[col[i].name()] = col[i].sort();
              sortedlist += col[i].sort()+",";
            } else {
              sortedlist += "0,";
            }
          }
        }

        // remove last ","
        sortedlist = sortedlist.substring(0, sortedlist.length-1);

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

    _handleFilterNotify: function() {
      var eles = this._dom.getElementsByClassName("uki-dataTable-filter");
      var values = {};
      var valueid = [];
      for(var i=0;i<eles.length;i++) {
        values[eles[i].name] = eles[i].value;
        valueid[i] = eles[i].value;
      }
      try {
      this.trigger({
        type: "columnFilter",
        fields: values,
        byfieldid: valueid
      });
      }
      catch (err) {};
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
      // We handle normal keys here, Chome doesn't pass "special" keys to onkeypress event


      self._clearfilterInterval();
      self._intervalId = setInterval(
           (function(self, target) { return function() {
                self._clearfilterInterval();
                self._filterpresstimeout(target); } } )(self, e),
           self._filterTimeout);
    },

    _filterkeydown: function(e) {
      // We handle "special" keys here because of Chrome doesn't pass them to onkeypress
      if (e.charCode != 0) return;
      var self = e.target.self;

      //console.log("KeyCode: ", e);

      if (e.keyCode == 13) {
        if( self._enterFiltered ) {
          self._clearfilterInterval();
          self._filterpresstimeout(e);
          e.preventDefault();
          e.cancelBubble = true;
        } else {
          // Simulates pressing enter on the browse
          e.target = self._parent._dom;
          self._parent.trigger( e );
        }
      }
      // Tab Key
      else if (e.keyCode == 9) {
        self._clearfilterInterval();
      }
      // Delete / Backspace key
      else if (e.keyCode == 8 || e.keyCode == 46) {
        self._clearfilterInterval();
        self._intervalId = setInterval(
          (function(self, target) { return function() {
            self._clearfilterInterval();
            self._filterpresstimeout(target); } } )(self, e),
          self._filterTimeout);
      }
      else if (e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 33 || e.keyCode == 34 || e.keyCode == 35 || e.keyCode == 36) {
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
        var idx = grid.selectedIndex();//[0];
        if ( idx == null ) {
          idx = 0;
        }
        var oldIdx = idx;

        // Down Arrow
        if ( e.keyCode == 40 ) {
          idx++;
        }

        // Up Arrow
        else if ( e.keyCode == 38 ) {
          idx--;
        }

        // pgDn
        else if ( e.keyCode == 34) {
          idx += vrows;
        }

        // pgUp
        else if ( e.keyCode == 33 ) {
          idx -= vrows;
        }

        // Home
        else if ( e.keyCode == 36 ) {
            idx = 0;
        }

        // End
        else if ( e.keyCode == 35 ) {
            idx = maxrows;
        }

        if (idx >= maxrows) {
          idx = maxrows-1;
        }
        if (idx < 0) {
          idx = 0;
        }
        if (idx != oldIdx) {
          grid.selectedIndex( idx );
          grid.scrollToIndex(idx);
          // This triggers the selection event.
          self._parent._list.trigger({type: 'selection'});
        }

      }

    },

    _dragEnd: function(e) {
      this._drag(e);
      try {
        this.trigger({
          type: 'resizeColumnEnd',
          column: this.columns()[this._draggableColumn]
        });
      } catch (err) {
        //console.log(err);
      }
      this._draggableColumn = -1;
    },

    _dragStart: function(e) {
        if ((e.target.tagName && e.target.tagName == "INPUT")) {
          e.isDefaultPrevented = fun.FT;
          return;
        }

        if (dom.hasClass(e.target, 'uki-dataTable-resizer')) {
            e.draggbale = e.target;
            e.cursor = dom.computedStyle(e.target, null).cursor;
            var index =
                e.target.className.match(/uki-dataTable-resizer_pos-(\d+)/)[1];
            this._draggableColumn = index;
            this._initialWidth = this.columns()[index].width();
        } else {
           e.preventDefault();
        }
    },

    _drag: function(e) {
        if (this._draggableColumn == -1) return;
        var width = this._initialWidth + e.dragOffset.x;

        this._resizeColumn(this._draggableColumn, width);
        try {
          this.trigger({
            type: 'resizeColumn',
            column: this.columns()[this._draggableColumn]
          });
        }
        catch (err) { }
    },

    _resizeColumn: function(pos, width) {
        var column = this.columns()[pos];
        width = column.width(width);
        this._table.style.width = this._totalWidth(this.columns())+"px";
    },

    _totalWidth: function(columns) {
       return utils.reduce(columns, function(s, col) {
          return s + (col._visible ? (col._width || 200) : 0);
       }, 0);
     },

    _appendChildToDom: function(child) {
      this._rowheader.appendChild(child.dom());
    },

    columns: fun.newProp('columns', function(cols) {
        this._clearfilterInterval();
        this.deleteAllCSSRules();
        this._menu.remove();

        var parentId = this.parent().CSSTableId();

        for(var i=0;i<cols.length;i++) {
          cols[i]["view"] = "DataTableHeaderColumn";
          var cssRule = this.addCSSRule('div.uki-dataTable'+parentId+' .uki-dataTable-col-' + cols[i].pos); //'div.uki-dataTable'+parentId+
          cols[i]["init"] = {pos: cols[i].pos, cssRule: cssRule, filterable: this._filterable,initfocus: cols[i].initfocus};
        }
        this._columns = build(cols);
        this._columns.appendTo(this);
        this._table.style.width = this._totalWidth(this.columns())+"px";
        this._setupFilters();
        if (this._hasMenu) this._setupMenu();
        this.trigger({ type: 'render' });
    }),

    columnByName: function(name) {
      var lname = name.toLowerCase();
       for(var i=0;i<this._columns.length;i++) {
         if (this._columns[i]._name.toLowerCase() == lname ) {
           return this._columns[i];
         }
       }
       if (arguments.length == 2) {
         return this.columnByLabel(name);
       }
       return (null);
    },

    columnByLabel: function(name) {
      var lname = name.toLowerCase();
      for(var i=0;i<this._columns.length;i++) {
        if (this._columns[i]._label.toLowerCase() == lname ) {
          return this._columns[i];
        }
      }
      if (arguments.length == 2) {
        return this.columnByName(name);
      }
      return (null);
    },

    _setupFilters: function() {
      var eles = this._dom.getElementsByClassName("uki-dataTable-filter");
      for(var i=0;i<eles.length;i++) {
        eles[i].self = this;
        evt.addListener(eles[i],"change", this._filter);
        evt.addListener(eles[i],"keypress", this._filterpress);
        evt.addListener(eles[i],"keydown", this._filterkeydown);
      }
    },

    hasFocus: function() {
      if (!this._filterable || this._columns == null) return (false);
      for(var i=0;i<this._columns.length;i++) {
        if (this._columns[i].hasFocus()) return (true);
      }
      return (false);
    },

    focus: function() {
      if (!this._filterable || this._columns == null) return;
      for(var i=0;i<this._columns.length;i++) {
        if (this._columns[i].visible() && this._columns[i].filterable()) {
          this._columns[i].focus();
          return;
        }
      }
    },

    blur: function() {
      if (!this._filterable || this._columns == null) return;
      for(var i=0;i<this._columns.length;i++) {
        this._columns.blur();
      }
    }


});

// This code no longer works -- it needs to be updated to be a bit smarter now about visibility
// The pack function no longer "hides" columns.
// Need to add focus/hasFocus/blur code to it
var DataTableTemplateHeader = view.newClass('DataTableTemplateHeader', Base, {
  template: fun.newProp('template'),
  _template: requireText('dataTable/header.html'),
  hasFilter: fun.newProp('filterable'),
  filterable: fun.newProp('filterable'),
  _filterable: false,
  enterFiltered: fun.newProp('enterFiltered'),
  _enterFiltered: false,
  filterTimeout: fun.newProp('filterTimeout'),
  _filterTimeout: 500,
  sortable: fun.newProp('sortable'),
  _sortable: false,
  _intervalId: null,
  _hasMenu: false,
  hasMenu: fun.newProp('hasMenu'),

  _createDom: function(initArgs) {
    Base.prototype._createDom.call(this, initArgs);

    this._draggableColumn = -1;
    this.on('draggesturestart', this._dragStart);
    this.on('draggesture', this._drag);
    this.on('draggestureend', this._dragEnd);
    this.on('click', this._click);
  },

  _click: function(e) {
    if (this._draggableColumn != -1) return;
    e.isDefaultPrevented = fun.FF;

    if (e.target.nextSibling && e.target.nextSibling.nextSibling && dom.hasClass(e.target.nextSibling.nextSibling, "uki-dataTable-resizer")) {
      var index = e.target.nextSibling.nextSibling.className.match(/uki-dataTable-resizer_pos-(\d+)/)[1];
      var col = this.columns();
      var eles = this._dom.getElementsByClassName("uki-dataTable-header-text");

      if ( this._sortable && col[index].sortable !== false) {
        // Handle Sorting
        if ( !e.shiftKey ) {
          for ( var i = 0; i < col.length; i++ ) {
            if ( i == index ) {
              continue;
            }
            if ( col[i].sort != 0 && col[i].sortable !== false) {
              dom.removeClass( eles[i], "uki-dataTable-sort-down uki-dataTable-sort-up" );
              col[i].sort = 0;
            }
          }
        }

        // Clear old Sort index on this field
        if ( col[index].sort != 0 ) {
          dom.removeClass( eles[index], "uki-dataTable-sort-down uki-dataTable-sort-up" );
        }
        col[index].sort++;
        if ( col[index].sort == 1 ) {
          dom.addClass( eles[index], "uki-dataTable-sort-down" );
        } else if ( col[index].sort == 2 ) {
          dom.addClass( eles[index], "uki-dataTable-sort-up" );
        } else {
          col[index].sort = 0;
        }

        var sortfields = {};
        for ( i = 0; i < col.length; i++ ) {
          if ( col[i].sort > 0 ) {
            sortfields[col[i].name] = col[i].sort;
          }
        }
      }

      this.trigger({
        type: "columnClick",
        column: this.columns()[index],
        sort: sortfields,
        columnIndex: index
      });
    }
  },

  _filter: function(e) {
    var self = e.target.self;
    var eles = self._dom.getElementsByClassName("uki-dataTable-filter");
    var values = {};
    for(var i=0;i<eles.length;i++) {
      values[eles[i].name.substring(6)] = eles[i].value;
    }
    self.trigger({
      type: "columnFilter",
      fields: values
    });
  },

  _filterpresstimeout: function(e)
  {
    this._clearfilterInterval();
    var hasFocus = false;
    if (document.activeElement && document.activeElement == e.target) hasFocus = true;
    e.target.blur();
    if (hasFocus) e.target.focus();
  },

  _clearfilterInterval: function()
  {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  },

  _filterpress: function(e) {
    if (e.charCode == 0) return;
    var self = e.target.self;
    // We handle normal keys here, Chome doesn't pass "special" keys to onkeypress event

    self._clearfilterInterval();
    self._intervalId = setInterval(
        (function(self, target) { return function() {
          self._clearfilterInterval();
          self._filterpresstimeout(target); } } )(self, e),
        self._filterTimeout);
  },

  _filterkeydown: function(e) {
    // We handle "special" keys here because of Chrome doesn't pass them to onkeypress
    if (e.charCode != 0) return;
    var self = e.target.self;

    if (e.keyCode == 13 && self._enterFiltered) {
      self._clearfilterInterval();
      self._filterpresstimeout(e);
      e.preventDefault();
      e.cancelBubble = true;
    }
    // Tab Key
    else if (e.keyCode == 9) {
      self._clearfilterInterval();
    }
    // Delete / Backspace key
    else if (e.keyCode == 8 || e.keyCode == 46) {
      self._clearfilterInterval();
      self._intervalId = setInterval(
          (function(self, target) { return function() {
            self._clearfilterInterval();
            self._filterpresstimeout(target); } } )(self, e),
          self._filterTimeout);
    }
    else if (e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 33 || e.keyCode == 34 || e.keyCode == 35 || e.keyCode == 36) {
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
      if ( idx == null ) {
        idx = 0;
      }
      var oldIdx = idx;

      // Down Arrow
      if ( e.keyCode == 40 ) {
        idx++;
      }

      // Up Arrow
      else if ( e.keyCode == 38 ) {
        idx--;
      }

      // pgDn
      else if ( e.keyCode == 34) {
        idx += vrows;
      }

      // pgUp
      else if ( e.keyCode == 33 ) {
        idx -= vrows;
      }

      // Home
      else if ( e.keyCode == 36 ) {
        idx = 0;
      }

      // End
      else if ( e.keyCode == 35 ) {
        idx = maxrows;
      }

      if (idx >= maxrows) {
        idx = maxrows-1;
      }
      if (idx < 0) {
        idx = 0;
      }
      if (idx != oldIdx) {
        grid.selectedIndex( idx );
        grid.scrollToIndex(idx);
      }

    }

  },

  _dragEnd: function(e) {
    this._drag(e);
    this.trigger({
      type: 'resizeColumnEnd',
      column: this.columns()[this._draggableColumn]
    });
    this._draggableColumn = -1;
  },

  _dragStart: function(e) {
    if ((e.target.tagName && e.target.tagName == "INPUT")) {
      e.isDefaultPrevented = fun.FT;
      return;
    }

    if (dom.hasClass(e.target, 'uki-dataTable-resizer')) {
      e.draggbale = e.target;
      e.cursor = dom.computedStyle(e.target, null).cursor;
      var index =
          e.target.className.match(/uki-dataTable-resizer_pos-(\d+)/)[1];
      this._draggableColumn = index;
      this._initialWidth = this.columns()[index].width;
    } else {
      e.preventDefault();
    }
  },

  _drag: function(e) {
    if (this._draggableColumn == -1) return;
    var width = this._initialWidth + e.dragOffset.x;

    this._resizeColumn(this._draggableColumn, width);
    this.trigger({
      type: 'resizeColumn',
      column: this.columns()[this._draggableColumn]
    });
  },

  _resizeColumn: function(pos, width) {
    var column = this.columns()[pos];
    if (column.maxWidth > 0) {
      width = Math.min(width, column.maxWidth);
    }
    if (column.minWidth > 0) {
      width = Math.max(width, column.minWidth);
    }
    column.width = width;
    var tr = this.dom().firstChild.firstChild.firstChild,
        td = tr.childNodes[column.pos];
    td.style.width = width + 'px';

    this.dom().firstChild.style.width =
        table.totalWidth(this.columns()) + 'px';
  },

  _formatColumn: function(col) {
    var filterable = this._filterable;
    if (filterable && col.filterable === false) filterable = false;
    return {
      pos: col.pos,
      label: col.label,
      style: (col.visible) ? "width:" + col.width + "px" : 'display: none',
      filter: 'filter'+col.label,
      filterstyle: filterable ? '' : 'display:none',
      className: col.className +
          ((col.resizable === false) ? '' :
           (col.width != col.maxWidth || col.width != col.minWidth ?
            ' uki-dataTable-header-cell_resizable' : '')),
      sortClass: (col.sort === 1 ? ' uki-dataTable-sort-down' : (col.sort === 2 ? ' uki-dataTable-sort-up' : '')),
      menuId: col.menuId ? col.menuId : ''
    };
  },

  columns: fun.newProp('columns', function(cols) {
    this._clearfilterInterval();
    this._columns = cols;
    fun.deferOnce(fun.bindOnce(this._render, this));
  }),

  _render: function() {
    this._dom.innerHTML = Mustache.to_html(
        this._template,
        {
          columns: this.columns().map(this._formatColumn, this),
          style: 'width:' + table.totalWidth(this.columns()) + 'px' + (this._visible ? '' : '; display:none;')
        });
    if (this._filterable) {
      this._setupFilters();
    }
    this.trigger({ type: 'render' });
  },

  _setupFilters: function()
  {
    var eles = this._dom.getElementsByClassName("uki-dataTable-filter");
    for(var i=0;i<eles.length;i++) {
      eles[i].self = this;
      evt.addListener(eles[i],"change", this._filter);
      evt.addListener(eles[i],"keypress", this._filterpress);
      evt.addListener(eles[i],"keydown", this._filterkeydown);
    }
  }

});





var DataTableList = view.newClass('DataTableList', DataList, {

    _setup: function(initArgs) {
        initArgs.packView = initArgs.packView || Pack;
        DataList.prototype._setup.call(this, initArgs);
    },

    /**
     * {
     *   key: 'propName',        // optional=index, propName to read from object
     *   className: 'mycls',     // optional='', className to add to a cell
     *   width: 200,             // optional=200, default width in px
     *   minWidth: 100,          // optional=100, minWidth in px
     *   maxWidth: 300,          // optional=-1, maxWidth in px, -1 for now
     *                              maxWidth
     *   visible: true,          // optional=true, should you show the column or
     *                              not
     *   label: 'My Label',      // optional='', used by header
     *   formatter: function(){} // optional, formats value before rendering
     *   sort: 0                 // optional, sort (1 = Asc, 2 = Desc, 0 = none)
     *   sortable: true          // optional, sets sortable on column if sorting is enabled
     *   filterable: true        // optional, sets filterable on column is filtering is enabled
     *                           // (ex: numberFormatter, dateFormatter)
     * }
     */
    columns: fun.newProp('columns'),
    _columns: [],

    _template: requireText('dataTable/pack.html'),

    _createDom: function(initArgs) {
        DataList.prototype._createDom.call(this, initArgs);
        this.addClass('uki-dataTable-list');
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
            return s + (col.visible ? (col.width || 200) : 0);
        }, 0);
    },

    addColumnDefaults: function(columns) {
        return columns.map(function(col, pos) {
            col = utils.extend({
                pos: pos,
                width: 200,
                name: '',
                className: '',
                visible: true,
                sort: 0,
                formatter: dom.escapeHTML,
            }, col);
            col.minWidth = Math.min(col.minWidth || 20, col.width);
            if (col.maxWidth > 0) {
                col.maxWidth = Math.max(col.maxWidth, col.width);
            }
            return col;
        });
    }
};

exports.DataTable               = DataTable;
exports.DataTableList           = DataTableList;
exports.DataTableAdvancedHeader = DataTableAdvancedHeader;
exports.DataTableTemplateHeader = DataTableTemplateHeader;
exports.table                   = table;
exports.DataTableHeaderColumn   = DataTableHeaderColumn;
