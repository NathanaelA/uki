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
    evt       = require('../../uki-core/event' ),
    Menu      = require('./menu').Menu;


// This is to allow all defined Tables to have a unique class assigned to them
// The Table will generate CSS for its own Table, and we want to make sure we don't
// Step on another defined Table; so we increment on each table created
var _DataTableCounter = 0;

var DataTable = view.newClass('DataTable', Container, {
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

    // Allow Edit in Place, if this is false the editing in place is disabled.
    editInPlace: fun.newProp("editInPlace", function(val) {
      if (arguments.length) {
        if (val === true) {
          this._editInPlace = true;
          this._EIP_CreateEditors();
        } else {
          this._editInPlace = false;
        }
      }
      return (this._editInPlace);
    }),
    _editInPlace: false,

    menudom: function() {
      return this._menudom;
    },

    _createDom: function(initArgs) {
        _DataTableCounter++;
        this._CSSTableId = _DataTableCounter;
        this._dom = dom.createElement('div', {className: 'uki-dataTable uki-dataTable'+this._CSSTableId});
        var w1 = dom.createElement('div', {className: 'uki-menu-w1'} );
        this._menudom = dom.createElement('div', {className: 'uki-menu-w2'});
        w1.appendChild(this._menudom);
        this._dom.appendChild(w1);

        var c = build([

            { view: initArgs.headerView || DataTableAdvancedHeader, as: 'header',
              addClass: 'uki-dataTable-header-container',
              on: {//  resizeColumn: fun.bind(this._resizeColumn, this) ,
                    scroll: fun.bind(this._scrolledHeader, this) } },

            { view: Container, pos: 't:0 l:0 r:0 b:0',
              addClass: 'uki-dataTable-container', as: 'container',
              on: { scroll: fun.bind(this._scrolledContainer, this) },
              childViews: [
                { view: initArgs.listView || DataTableList, as: 'list',
                  on: { selection: fun.bind(this.trigger, this) } }
              ] },

            { view: initArgs.footerView || DataTableFooter, as: 'footer',
              addClass: 'uki-dataTable-footer-container',
              on: {scroll: fun.bind(this._scrolledFooter, this) }
            }

        ]).appendTo(this);

        this._footer = c.view('footer');
				this._footer.on("render", fun.bindOnce(this._updateContainerHeight, this));
				this._footer.on("render", fun.bindOnce(this._recalculateTableSizes, this));
        this._header = c.view('header');
        this._header.on("keydown", this._keyDown);
        this._header.on('render', fun.bindOnce(this._updateContainerHeight, this));
        this._header.on('recalcTableSize', fun.bindOnce(this._recalculateTableSizes, this));
        this._container = c.view('container');
        this._container.on("keydown", this._keyDown);
        this._container.dom().tabIndex = -1; // Remove tab focusablity
        this._container.on("mousedown", this._EIPClick);
        this._list = c.view('list');
    },

    _recalculateTableSizes: function() {
			this._footer._table.style.width = this._header._table.style.width = this._header.totalWidth() + "px";
    },

    _updateContainerHeight: function() {
        var pos = this._container.pos();
        pos.t = this._header.clientRect().height + 'px';
        if (this._footer.visible()) {
          pos.bottom = this._footer.clientRect().height + 'px';
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

    _handleScroll:function(newLocation) {
      var lastHeader = this._header.scrollLeft();
      if (lastHeader != newLocation) {
        this._header.scrollLeft(newLocation);
        if (this._header._menu != null) {
          this._header._menu.dom().style.marginLeft=-newLocation+"px";
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

       // This event is called from a Child of DataTable, so we have to link back to the parent
       var parent = this.parent();
       if (parent == null) return;
       if (parent._inEditInPlace) return;
       // Can we edit in place?
       if (parent._editInPlace === false) return;

       if (event.keyCode == parent._editInPlaceHotkey) {
         parent.startEditInPlace(parent._list.selectedIndex(),0);
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

      this._EIPMove(row,col,true,true);
    },

    stopEditInPlace: function() {
      if (this._EIP_ClearEditor()) {
        this._inEditInPlace = false;
        this.focus();
      }
    },

    /**
   * Returns TRUE, if the MoveNext/MoveNearest is allowed to continue moving the editor, returns FALSE to stop from moving editor.
   */
    _EIP_ClearEditor: function() {
      if (this._EIPCurrentColumn === -1 || this._EIPCurrentRow === -1) return (true);
      var columns = this._header.columns();
      var col = this._EIPCurrentColumn;
      var row = this._EIPCurrentRow;
      var value = this._Editors[col].value();

      if (this._Editors[col]._dom.parentNode === null) return (true);
      if (columns[col].editor != null) {
        if (columns[col].unformatter != null) {
          value = columns[col].unformatter(value);
        }
        if (columns[col].validation != null) {
          var validated = columns[col].validation(row,col,value);
          if (validated === false) return (false);
        }
      }

      var oldvalue = this._EIPCurrentRowData[0][col];
      var data = this.data();
      if (value === "" && oldvalue === null) oldvalue = "";

      if (oldvalue != value ) {
        if (data.changeData != null) {
          data.changeData(row,col,value);
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
        }
        catch (err) {}
      }
      var parent = this._Editors[col]._dom.parentNode;
      dom.removeElement(this._Editors[col]._dom);
      var newvalue = columns[col].formatter(value);
      this._styler(this._EIPCurrentRowData[0], this._EIPCurrentRow, this );
      parent.innerHTML = newvalue;
      this._EIPCurrentColumn = -1;
      this._EIPCurrentRow = -1;
      this._EIPCurrentRowData = null;
      return (true);
    },

    _EIP_getDomElement: function(row, col) {
      var htmlrow = this._list.dom().querySelector("tr.uki-dataTable-row-"+row);
      if (htmlrow == null) return (null);

      var htmlcol = htmlrow.querySelector("td.uki-dataTable-col-"+col);
      return (htmlcol);
    },

    _EIPMove: function(row,col,nearest,forward) {
      var columns = this._header.columns();
      if (!nearest && col === -1) { col = columns.length; row--; }
      // find the next valid column (maybe the one sent in)


      if (forward) {
        // Go Forwards
        while (col < columns.length && (columns[col].visible() === false || this._Editors[col] === null)) col++;
        if (col >= columns.length) {
          if (nearest) {
            col=columns.length-1;
            while (col >= 0 && (columns[col].visible() === false || this._Editors[col] === null)) col--;
          } else {
            col = 0; row++;
            while (col < columns.length && (columns[col].visible() === false || this._Editors[col] === null)) col++;
          }
        }
      } else {
        // Go Backwards
        while (col >= 0 && (columns[col].visible() === false || this._Editors[col] === null)) col--;
        if (col == -1) {
          col = columns.length-1;
          row--;
          while (col >= 0 && (columns[col].visible() === false || this._Editors[col] === null)) col--;
        }
      }
      var htmlcol = this._EIP_getDomElement(row,col);
      if (htmlcol === null) {
        return (false);
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

      // Set our Tracking Variables
      this._inEditInPlace = true;
      this._EIPCurrentColumn = col;
      this._EIPCurrentRow = row;
      if (this._list.selectedIndex() != row) {
        this._list.selectedIndex(row);
        this._list.triggerSelection();
      }


      if (this.data().loadRange != null) {
        this.data().loadRange(row,row+1,fun.bindOnce(this._EIPStartEditor, this));
      } else {
        this._EIPStartEditor(this.data().slice(row,row+1));
      }

    },

    _EIPStartEditor: function( row ) {
      var columns = this._header.columns();
      var htmlcol = this._EIP_getDomElement(this._EIPCurrentRow, this._EIPCurrentColumn);
      //console.log("EIPS: ",row);
      this._EIPCurrentRowData = row;

      // Assign the Editor
      var beditor = this._Editors[this._EIPCurrentColumn];

      var value = row[0][this._EIPCurrentColumn];
      beditor.value(columns[this._EIPCurrentColumn].formatter(value ? value : ''));
      htmlcol.innerHTML = '';
      htmlcol.appendChild(beditor._dom);
      fun.deferOnce(fun.bindOnce(this._EIPFocus, this));
    },

    _inEditInPlace: false,
    _EIPCurrentColumn: -1,
    _EIPCurrentRow: -1,
    _EIPCurrentRowData: null,

    _EIPFocus: function()
    {
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

       // Check for Already created Editors
       if (this._Editors != null && this._Editors.length > 0) {
         for (var i=0;i<this._Editors.length;i++) {
           if (this._Editors[i] != null) {
             try {
               this._Editors[i].destruct();
             } catch (err) {}
           }

         }
       }

       var cols = this._header.columns();

       // No columns setup
       if (cols == null) return;

       this._Editors = [];
       for (var i=0;i<cols.length;i++) {

         if (cols[i].editor === false || cols[i].editor == null) {
           this._Editors.push(null);
           continue;
         }
         if (cols[i].editor === true) {
           var editor = {view: "nativeControl.Text"};
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
      var col = parseInt(target.className.match(/uki-dataTable-col-(\d+)/)[1],10);

      var row = parent.list().selectedIndex();
      if (col == null || row == null || col < 0 || row < 0) return;
      parent._EIPMove(row,col,true,true);
    },

    _EIPKeyDown: function(event) {
      var parent = this.parent();

      if (event.keyCode === 9 || event.keyCode === 13 || event.keyCode === 27 || event.keyCode === this._editInPlaceHotkey) {
        event.preventDefault();
        event.stopPropagation();
        if (event.keyCode === 9 || event.keyCode === 13) {
          if (event.shiftKey === true) {
            parent._EIPMove(parent._EIPCurrentRow,parent._EIPCurrentColumn-1,false,false);
          } else {
            parent._EIPMove(parent._EIPCurrentRow,parent._EIPCurrentColumn+1,false,true);
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
         if (event.keyCode === 38 && parent._EIPCurrentRow > 0) { // Up Arrow

           parent._EIPMove(parent._EIPCurrentRow-1,parent._EIPCurrentColumn,false,true);

         } else if (event.keyCode == 40)  { // Down Arrow
           var data = parent.data();
           if (data.length <= parent._EIPCurrentRow+1) {
             parent.EIPInsertRow();

           } else {
             parent._EIPMove(parent._EIPCurrentRow+1,parent._EIPCurrentColumn,false,false);
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
        this.trigger({type: "insertedRow",
          table: this,
          row: row,
          rowid: rownum
        });
      } else if (utils.isArray(data)) {
        var cols = [];
        var collen = this.columns().length;
        for (var i=0;i<collen;i++) cols.push("");
        data.push(cols);
        this.trigger({type: "insertedRow",
          table: this,
          row: data.slice(rownum,rownum+1),
          rowid: rownum
        });
      } else {
        // Nothing inserted so, rownum will be invalid
        rownum--;
      }
      this.list()._update();
      this.scrollToIndex(rownum);
      // Gives Dom enough time to draw new row
      fun.deferOnce( fun.bindOnce(this._delayedMoveForInsert, this) );
    },

    _delayedMoveForInsert: function() {
      var rownum = this.data().length-1;
      this._EIPMove(rownum, this._EIPCurrentColumn,false,false);
    },

    isEditing: function() {
      return (this._inEditInPlace);
    },

    editColumn: function(col) {
      if (!this._inEditInPlace) return (-1);
      if (arguments.length && col >= 0 && col < this._header.columns().length) {
        this._EIPMove(this._EIPCurrentRow, col+0, true, true);
      }
      return (this._EIPCurrentColumn);
    },

    editorValue: function(value) {
      if (!this._inEditInPlace) return (null);
      if (arguments.length) {
        this._Editors[this._EIPCurrentColumn].value(value);
      }
      return (this._Editors[this._EIPCurrentColumn].value());
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
        // Search for initfocus
        var found=false;
        for (var i = 0; i < hc.length && !found; i++) {
          if (hc[i].visible() && hc[i].filterable() && dom.hasClass(hc[i]._filter,'initfocus')) {
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
    },

    hasFooter: function(v) {
       if (arguments.length) {
         return (this._footer.visible(v));
       }
       return (this._footer.visible());
    },

		setBodyColStyle: function (col, name, value) {
			this._list.setColStyle(col, name, value);
		},

		setFooterColStyle: function (col, name, value) {
			this._footer.setColStyle(col, name, value);
		}
});

fun.delegateProp(DataTable.prototype, [
    'data', 'throttle', 'debounce', 'template', 'formatter', 'key',
    'selection', 'selectedRows', 'selectedRow',
    'selectedIndexes', 'selectedIndex', 'lastClickIndex', 'multiselect',
		'setRowColStyle', 'setRowStyle',
], 'list');

fun.delegateCall(DataTable.prototype, [
    'scrollToIndex', 'triggerSelection'
], 'list');

fun.delegateCall(DataTable.prototype, ['summary'], 'footer');

fun.delegateProp(DataTable.prototype, ['filterable', 'filterTimeout', 'sortable', 'hasMenu',
  'menuOptions', 'menu', 'menuImage'], 'header');

fun.delegateCall(DataTable.prototype, [ 'setColStyle', 'columnIdByName', 'columnIdByLabel'], 'header');


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
      this._sizeable = this._minWidth != this._maxWidth;
      this._setupResizeable();
    }
    return this._maxWidth;
  } ),
  _maxWidth: 0,
  width: fun.newProp( 'width', function ( v ) {
    if ( arguments.length ) {
      var newWidth = Math.min( Math.max( v, this._minWidth ), this._maxWidth == 0 ? v : this._maxWidth);
      if ( newWidth != this._width ) {
        console.log(this);
        this._width = newWidth;
        if ( this.parent() != null ) {
          //this.parent().updateCSSRules( this._cssRule, 'width', this._width + "px" );
					this.parent().setColStyle(this._pos, 'width', this._width + "px");
          this.parent().trigger({ type: 'recalcTableSize' });
        }
      }
    }
    return (this.width);
  } ),
  _width: 200,
  minWidth: fun.newProp( 'minWidth', function ( v ) {
    if ( arguments.length ) {
      this._minWidth = Math.min( v, this._width );
      this._sizeable = this._minWidth != this._maxWidth;
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
      this._filter.name = "_filter_"+this._name;
    }
    return this._name;
  } ),
  _name: '',
  visible: fun.newProp( 'visible', function ( v ) {
    if ( arguments.length ) {
      this._visible = v;
      if ( this.parent() != null ) {
        if ( v ) {
					this.parent().setColStyle(this._pos, 'visibility', 'visible');
				  this.parent().setColStyle(this._pos, 'width', this.width);
          //this.parent().updateCSSRules( this._cssRule, 'display', '' );
        } else {
					this.parent().setColStyle(this._pos, 'visibility', 'collapse');
					this.parent().setColStyle(this._pos, 'width', '0px');
          //this.parent().updateCSSRules( this._cssRule, 'display', 'none' );
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
        this._lastClicked = new Date().getTime();
      }
    }
    return (this._sort);
  } ),
  _sort: 0,
  getLastClicked: function () {
    return this._lastClicked;
  },
  _lastClicked: 0,

  headerstyle: fun.newProp( 'headerstyle', function ( v ) {
    if ( arguments.length ) {
      this._headerstyle = v;
      this._dom.style.cssText = v;
    }
    return this._headerstyle;
  } ),
  _headerstyle: '',
  style: fun.newProp( 'style', function ( v ) {
    if ( !arguments.length || v == null ) {
      return this._style;
    }
    this._style = v;
    if ( this.parent() != null ) {
      this._parseStyle();
    }
    return this._style;
  } ),
  _style: '',
  formatter: function(value) {
    if (arguments.length) {
      if (typeof value === 'function') {
        this._formatter = value;
      } else {
        return this._formatter(value);
      }
    }
    return this._formatter;
  },
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
  filterValue: function(v) {
      if (arguments.length) {
        if (this._filter.value === v) return;
        this._filter.value = v;
        if (this.parent() != null) this.parent()._handleFilterNotify();
      }
      return (this._filter.value);
  },
  footerValue: function(v) {
    if (arguments.length) {
      return (this.parent().parent().footer().footervalue(this._pos, v));
    }
    return (this.parent().parent().footer().footervalue(this._pos));
  },
  footerVisible: function(v) {
    if (arguments.length) {
      return (this.parent().parent().footer().footervisible(this._pos,v));
    }
    return (this.parent().parent().footer().footervisible(this._pos));
  },


  // _pos is not a changeable property, only can be set at creation, this is because too many things depend on this!
  // it would be a pain to try and make sure things that link via the _pos are updated
  _pos: 0,

  // This gets assigned the rule # in the CSS stylesheet rule that is related to this column so we can modify
  // it and affect all cells in a column, this also is set once when the Column is created
  _cssRule: -1,

  // Used to track if Max/Min Width are equal -- if so, resizabe is disabled also
  _sizeable: true,

  domForEvent: function() {
    return this._filter;
  },

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
    if ('ontouchstart' in window) {
      this._resizer.innerHTML = "&nbsp;<br>&nbsp;";
      this._resizer.style.width = "20px";
      this._resizer.style.right = "-14px";
    } else {
      this._resizer.innerHTML = "|";
    }

    this._filter =
        dom.createElement( 'input', {className: "uki-dataTable-filter" + (initArgs.initfocus ? ' initfocus' : ''), tabIndex: 1, autocomplete: "off", name: "_filter_"+this._name, style: filterStyle} );
    // The focus/blur events keep track of the last focused filter.
    this.on( 'focus', function () {
      this.parent()._lastFocusedFilter && dom.removeClass(this.parent()._lastFocusedFilter, 'initfocus' );
      dom.addClass(this._filter, 'initfocus' );
    } );
    this.on( 'blur', function () {
      this.parent()._lastFocusedFilter = this._filter;
    } );

    this._wrapper =
        dom.createElement( 'div', {className: "uki-dataTable-header-wrap"}, [this._labelElement, this._filter, this._resizer] );
    this._dom =
        dom.createElement( 'td', {className: className}, [this._wrapper] );
    fun.deferOnce( fun.bindOnce( this._finishSetup, this ) );

  },

  destruct: function()  {
      Base.prototype.destruct.call(this);
      this._wrapper = null;
      this._filter = null;
      this._resizer = null;
      this._labelElement = null;
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
        //this.parent().updateCSSRules(this._cssRule, key, this._style[key]);
				this.parent().setColStyle(this._pos, key, this._style[key]);
      }
    } else {
      var exp = this._style.split(';');
      for(var i=0;i<exp.length;i++) {
        var parts = exp[i].split(':');
        if (parts[0].length == 0 || parts.length != 2) continue;
        this.parent().setColStyle(this._pos, parts[0], parts[1]);
      }
    }
  },

  // due to the fact that .parent() is not assigned right away; we need to finish setting up
  // all the rules after the object is fully built
  _finishSetup: function () {
    if ( !this._visible ) {
      this.parent().setColStyle( this._pos, 'visibility', 'collapse' );
			this.parent().setColStyle( this._pos, 'width', "0px" );
    } else {
    	this.parent().setColStyle( this._pos, 'width', this._width + "px" );
		}
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

var DataTableFooter = view.newClass('DataTableFooter', Container, {
  template: fun.newProp('template'),
  _template: requireText('dataTable/footer.html'),

  _createDom: function(initArgs) {
    Base.prototype._createDom.call(this, initArgs);

    // The rowfooter / _table will be replaced by the _render function due to an IE bug
    var rowfooter = dom.createElement('tr', {className: 'uki-dataTable-footer-row'});
    this._table = dom.createElement('table', { className: 'uki-dataTable-footer' }, [rowfooter]);
		this._colgroup = dom.createElement('colgroup');
    // This is the parent static element
    this._dom = dom.createElement('div', { className: 'uki-hidden' }, [this._table]);
  },

  destruct: function() {
    Container.prototype.destruct.call(this);
    this._table = null;
  },

  columns: fun.newProp('columns', function(cols) {
    this._columns = cols;
    this._table.style.width = table.totalWidth(this._columns)+"px";

		for (var i = 0; i < this._columns.length; i++) {
			this._colgroup.appendChild(dom.createElement('col'))
		}

		this._render();
    //fun.deferOnce(fun.bindOnce(this._render, this));
  }),

  visible: fun.newProp('visible', function (vis) {
     if (arguments.length && (vis === true || vis === false) && vis !== this._visible) {
       this._visible = vis;
       if (this._visible) {
         dom.removeClass(this._dom, "uki-hidden");
       } else {
         dom.addClass(this._dom, "uki-hidden");
       }
       this.trigger({ type: 'render' });
     }
     return (this._visible);
  }),
  _visible: false,

  _formatColumn: function(col) {
    return {
      pos: col.pos,
      style: (col.footer === false) ? "display:none" : '',
      value: (col.footervalue ? col.footervalue : '')
    };
  },

	setColStyle: function (col, name, value) {
			var colDom = this._colgroup.childNodes[col];
			if (colDom) {
				colDom.style[name] = value;
			}
	},

  _render: function() {
    this._dom.innerHTML = Mustache.to_html(
        this._template,  {
          columns: this._columns.map(this._formatColumn, this)
        });

    // IE does not allow you to change the innerHTML of a table; so we have to regenerate the entire table and then
    // relink our variable to the new _table so that we can update the width dynamically when need be
    this._table = this._dom.getElementsByClassName("uki-dataTable-footer")[0];
		this._table.insertBefore(this._colgroup, this._table.childNodes[0])
    this._table.style.width = table.totalWidth(this._columns)+"px";

    this.trigger({ type: 'render' });
  },

  footervalue: function(pos, v) {
    if (arguments.length == 2) {
      if (this._columns[pos].footervalue !== v) {
        this._columns[pos].footervalue = v;
        this._render();
      }
    }
    return (this._columns[pos].footervalue);
  },

  footervisible: function(pos, v) {
    if (arguments.length == 2 && (v === true || v === false)) {
      if (this._columns[pos].footer !== v) {
        this._columns[pos].footer = v;
        this._render();
      }
    }
    return (this._columns[pos].footer);
  },

  values: function (v) {
    var changed = false;
    var i;
    if (arguments.length) {
      var len = this._columns.length;
      if (len > v.length) len = v.length;
      for(i=0;i<len;i++) {
        if (this._columns[i].footervalue !== v[i]) {
          this._columns[i].footervalue = v[i];
          changed = true;
        }
      }
      if (changed) this._render();
    }
    var val = [];
    for(i=0;i<this._columns.length;i++) {
      val.push(this._columns[i].footervalue);
    }
    return (val);
  },

  summary: function(v) {
    if (arguments.length) return (this.values(v));
    else return (this.values());
  }

});

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

  /* Menu Related Code */
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
        this._menuOptions = v;
        this._setupMenuOptions();
    }
    return (this._menuOptions);
  }),
  _menuOptions: null,
  _styleSheetElement: null,
  _styleSheet: null,
  _columns: null,


    _createDom: function(initArgs) {
        Container.prototype._createDom.call(this, initArgs);
        this._rowheader = dom.createElement('tr', {className: 'uki-dataTable-header-row'});
				var tbody = dom.createElement('tbody', {}, [this._rowheader]);
				this._colgroup = dom.createElement('colgroup');
        this._table = dom.createElement('table', { className: 'uki-dataTable-header' }, [this._colgroup, tbody]);
        this._dom = dom.createElement('div', null, [this._table]);
				/*
        this._styleSheetElement = dom.createStylesheet(' ');
        if (this._styleSheetElement.sheet && this._styleSheetElement.sheet.cssRules) {
          this._styleSheet = this._styleSheetElement.sheet;
        } else {
          this._styleSheet = this._styleSheetElement.styleSheet; // IE
        }
        */
        this._cssRuleTracking = {};


      this._menu = build([
        { view: 'Menu', as: 'DataTable-Menu',
          addClass: 'uki-dataTable-menu' }
        ]);

        this._draggableColumn = -1;
        this.on('draggesturestart', this._dragStart);
        this.on('draggesture', this._drag);
        this.on('draggestureend', this._dragEnd);
        if ('ontouchstart' in window) {
          this.on('touchend', this._click);
        } else {
          this.on('click', this._click);
        }
        this._setupMenu();
    },

    _setupMenu: function() {
      if (this.parent() == null || this.parent().length == 0 || this._columns == null)  {
        fun.deferOnce( fun.bindOnce( this._setupMenu, this ) );
        return;
      }
      if (this._hasMenu) {
        var found=false;
        if (this._menu.parent() == null || this._menu.parent().length == 0) {

          this._menu.attach(this.parent().menudom(), false);
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

      if (this._menu) {
        this._menu.destruct();
        this._menu = null;
      }
      this._styleSheet = null;
      this._cssRuleTracking = null;

      dom.removeElement(this._styleSheetElement);
      this._styleSheetElement = null;

      for (var i=0;i<this._columns.length;i++) {
        this._columns[i].destruct();
        this._columns[i] = null;
      }

      Container.prototype.destruct.call(this);

      this._table = null;
			this.colgroup = null;
      this._dom = null;
      this._rowheader = null;
      this._lastFocusedFilter = null;
      this._menuOptions = null;
      this._columns = null;
    },

    _cssRuleTracking: null,
    _name: null,
		/*
    hasStyle: function(row, col) {
      var Key = "";
      if (row != null && col != null) Key = "RC"+row+"-"+col;
      else if (row != null) Key = "R"+row;
      else if (col != null) Key = "C"+col;
      else return (false);
      if (this._cssRuleTracking[Key] == null) return (false);
      return (true);
    },
		*/
    setRowStyle: function(row, name, value) {

			/*
      var Key = "R"+row, id;
      if (this._cssRuleTracking[Key] == null) {
        var parentId = this.parent().CSSTableId();
        var CSSKey = 'div.uki-dataTable'+parentId+' tr.uki-dataTable-row-'+row;
        id = this.addCSSRule(CSSKey);
        this._cssRuleTracking[Key] = id;
      } else {
        id = this._cssRuleTracking[Key];
      }
      this.updateCSSRules(id, name, value);
			*/
    },

    setRowColStyle: function(row, col, name, value) {
			/*
      var Key = "RC"+row+"-"+col, id;

      if (this._cssRuleTracking[Key] == null) {
        var parentId = this.parent().CSSTableId();
        var CSSKey = 'div.uki-dataTable'+parentId+' tr.uki-dataTable-row-'+row+' td.uki-dataTable-col-' + col;
        id = this.addCSSRule(CSSKey);
        this._cssRuleTracking[Key] = id;
      } else {
        id = this._cssRuleTracking[Key];
      }
      this.updateCSSRules(id, name, value);
			*/
    },

		setRowColStyle: function (row, col, name, value) {
			this.parent().setRowColStyle(row, col, name, value);
		},

		setRowStyle: function (row, name, value) {
			this.parent().setRowStyle(row, name, value);
		},

    setColStyle: function(col, name, value) {
      var colDom = this._colgroup.childNodes[col];
			colDom.style[name] = value;
			this.parent().setBodyColStyle(col, name, value);
			this.parent().setFooterColStyle(col, name, value);
      /*
			var Key = "C"+col, id;

      if (this._cssRuleTracking[Key] == null) {
        var parentId = this.parent().CSSTableId();
        var CSSKey = 'div.uki-dataTable'+parentId+' td.uki-dataTable-col-' + col;
        id = this.addCSSRule(CSSKey);
        this._cssRuleTracking[Key] = id;
      } else {
        id = this._cssRuleTracking[Key];
      }
      this.updateCSSRules(id, name, value);
			*/
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

    totalWidth: function() {
      var tw=0;
      if (this._columns === null) return (0);
      for(var i=0;i<this._columns.length;i++) {
        tw += (this._columns[i].visible() ? this._columns[i].width() : 0);
      }
      return (tw);
    },

    _click: function(e) {
      if (this._draggableColumn != -1) return;
      e.isDefaultPrevented = fun.FF;

      if (e.target.nodeName === "INPUT") return;
      if (dom.hasClass(e.target,"uki-dataTable-resizer")) return;

      if (this._parent.isEditing()) return;

      // Get Column #
      var target = e.target;
      while (target.nodeName != "TD" && target != null) {
        target = target.parentNode;
      }
      if (target == null) return;

      // Verify this is a Header "CELL" (i.e. a clickable element)
      if (dom.hasClass(target, "uki-dataTable-header-cell")) {
        var index = target.className.match(/uki-dataTable-col-(\d+)/)[1];
        var col = this.columns();
        var sortedlist = '';

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

          var sortfields = [];
          sortedlist = '';
          for ( i = 0; i < col.length; i++ ) {
            if ( col[i].sort() > 0 ) {
              sortfields.push({name:col[i].name(), direction:col[i].sort(),clickTime:col[i].getLastClicked()});
              sortedlist += col[i].sort()+",";
            } else {
              sortedlist += "0,";
            }
          }
        }

        // remove last ","
        if (sortedlist.length > 0) {
          sortedlist = sortedlist.substring(0, sortedlist.length-1);
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

      for (var i=0;i<this._columns.length;i++) {
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
      }
      catch (err) {}
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
        // this "grid" variable is the _list element not the actual "Grid"
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
          // This triggers the selection event.
          grid.triggerSelection();

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
      var width = this._initialWidth;
      if ( e.dragOffset != null) {
          width += e.dragOffset.x;
        } else {
          width += e.clientX;
        }
        if (width < 10) width = 10;


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
        column.width(width);
        try {
          this.trigger({ type: 'recalcTableSize' });
        } catch (err) { }
    },

    _appendChildToDom: function(child) {
      this._rowheader.appendChild(child.dom());
    },

    columns: fun.newProp('columns', function(cols) {
      if (arguments.length) {
        this._clearfilterInterval();
        //this.deleteAllCSSRules();
        this._menu.remove();

        var parentId = this.parent().CSSTableId();

        for(var i=0;i<cols.length;i++) {
          cols[i]["view"] = "DataTableHeaderColumn";
          //var cssRule = this.addCSSRule('div.uki-dataTable'+parentId+' .uki-dataTable-col-' + cols[i].pos);
          cols[i]["init"] = {pos: cols[i].pos, /*cssRule: cssRule,*/ filterable: this._filterable, initfocus: cols[i].initfocus};
        }
        this._childViews = [];

        // Destroy old Columns
        if (this._columns && this._columns.length) {
          for (var i=0;i<this._columns.length;i++) {
            this._columns[i].destruct();
            this._columns[i] = null;
          }
        }

        this._columns = build(cols);
        this._columns.appendTo(this);

				for (var i = 0; i < this._columns.length; i++) {
					this._colgroup.appendChild(dom.createElement('col'))
				}

        this._table.style.width = this.totalWidth()+"px";
        this._setupFilters();
        if (this._hasMenu) this._setupMenu();
        this.trigger({ type: 'render' });
      }
      return this._columns;
    }),

    columnByName: function(name) {
       var id = this.columnIdByName(name);
       if (id != null) return (this._columns[id]);
       if (arguments.length == 2) {
         return this.columnByLabel(name);
       }
       return (null);
    },

    columnByLabel: function(name) {
      var id = this.columnIdByLabel(name);
      if (id != null) return (this._columns[id]);
      if (arguments.length == 2) {
        return this.columnByName(name);
      }
      return (null);
    },

    columnIdByName: function(name) {
      var lname = name.toLowerCase();
       for(var i=0;i<this._columns.length;i++) {
         if (this._columns[i]._name.toLowerCase() == lname ) {
           return (i);
         }
       }
       if (arguments.length == 2) {
         return this.columnIdByLabel(name);
       }
       return (null);
    },

    columnIdByLabel: function(name) {
      var lname = name.toLowerCase();
      for(var i=0;i<this._columns.length;i++) {
        if (this._columns[i]._label.toLowerCase() == lname ) {
          return (i);
        }
      }
      if (arguments.length == 2) {
        return this.columnIdByName(name);
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
    },

    clearFilters: function() {
      if (this._columns == null) return;
      this._skipFilterNotify = true;

      for (var i=0;i<this._columns.length;i++) {
         this._columns[i].filterValue("");
      }

      this._skipFilterNotify = false;
      this._handleFilterNotify();
    }

});



// This code no longer works -- it needs to be updated to be a bit smarter now about visibility
// The pack function no longer "hides" columns.
// Need to add focus/hasFocus/blur code to it

/*
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
        grid._list.triggerSelection();
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

*/

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
    columns: function (cols) {
			if (cols) {
				this._columns = cols;
				this._colgroup = dom.createElement('colgroup');
				for (var i = 0; this._columns.length > i; i++){
					var col = dom.createElement('col', {class:'uki-dataList-column'});
					this._colgroup.appendChild(col);
				}
				return this._columns;
			}
			return this._columns;
		},
    _columns: [],

    _template: requireText('dataTable/pack.html'),

    _createDom: function(initArgs) {
        DataList.prototype._createDom.call(this, initArgs);
        this.addClass('uki-dataTable-list');

    },

    destruct: function() {
      DataList.prototype.destruct.call(this);
			this._colgroup = null;
    },

    _updateColumnSize: function(pos) {
        var column = this.columns()[pos];
				var colDom = this._colgroup.childNodes[pos];
				colDom.style.width = column.width > 0 ? column.width + 'px' : column.width;
				this._setColGroupInPacks();
    },

		_renderPack: function(pack, range, rows) {
				var pack = DataList.prototype._renderPack.call(this, pack, range, rows);
				var table = pack.dom().getElementsByTagName('table')[0];
				this._colgroup = this._colgroup.cloneNode(true);
				table.insertBefore(this._colgroup, table.childNodes[0]);
				return pack;
		},

		_setColGroupInPacks: function() {
			utils.forEach(this.childViews(), function(pack) {
				var table = pack.dom().getElementsByTagName('table')[0];
				table.replaceChild(this._colgroup.cloneNode(true), table.childNodes[0]);
      	//pack.resizeColumn(pos, column.width);
   		}, this);
		},

		setColStyle: function (col, name, value) {
				var colDom = this._colgroup.childNodes[col];
				colDom.style[name] = value;
				this._setColGroupInPacks();
		},

		setRowColStyle: function (row, col, name, value) {
			var rowDom = this._dom.getElementsByClassName('uki-dataTable-row-' + row)[0];
			var cellDom = rowDom.getElementsByClassName('uki-dataTable-col-' + col)[0];
			if (cellDom) cellDom.style[name] = value;
		},

		setRowStyle: function (row, name, value) {
			var rowDom = this._dom.getElementsByClassName('uki-dataTable-row-' + row)[0];
			if (rowDom) rowDom.style[name] = value;
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

exports.DataTable               = DataTable;
exports.DataTableList           = DataTableList;
exports.DataTableAdvancedHeader = DataTableAdvancedHeader;
//exports.DataTableTemplateHeader = DataTableTemplateHeader;
exports.DataTableFooter         = DataTableFooter;
exports.table                   = table;
exports.DataTableHeaderColumn   = DataTableHeaderColumn;
