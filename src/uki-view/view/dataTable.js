requireCss( './dataTable/dataTable.css' );

var fun = require( '../../uki-core/function' ),
  utils = require( '../../uki-core/utils' ),
  env = require( '../../uki-core/env' ),
  dom = require( '../../uki-core/dom' ),
  view = require( '../../uki-core/view' ),
  build = require( '../../uki-core/builder' ).build,

  Pack = require( './dataTable/pack' ).Pack,
  DataList = require( './dataList' ).DataList,
  Mustache = require( '../../uki-core/mustache' ).Mustache,
  Base = require( '../../uki-core/view/base' ).Base,
  Container = require( '../../uki-core/view/container' ).Container,
  evt = require( '../../uki-core/event' );
  //Menu = require( './menu' ).Menu;

// This is to allow all defined Tables to have a unique class assigned to them
// The Table will generate CSS for its own Table, and we want to make sure we don't
// Step on another defined Table; so we increment on each table created
var _DataTableCounter = 0;

var FauxCSSStyleSheet = function () {
  "use strict";
  this.cssRules = [];
};

FauxCSSStyleSheet.prototype.addRule = function ( name, value, index ) {
  "use strict";
  var newRule = {name: name, value: value, style: []};
  if ( index < 0 ) {
    index = this.cssRules.push( newRule ) - 1;
  } else {
    this.cssRules.splice( index, 0, newRule );
  }
  return index;
};

FauxCSSStyleSheet.prototype.removeRule = function ( index ) {
  "use strict";
  this.cssRules.splice( index, 1 );
};

FauxCSSStyleSheet.prototype.getInnerHTML = function () {
  "use strict";
  var finalText = '';
  for ( var i = 0; i < this.cssRules.length; i++ ) {
    var rule = this.cssRules[i];
    var ruleValue = rule.value;
    for ( var styleName in rule.style ) {
      if ( rule.style.hasOwnProperty( styleName ) ) {
        ruleValue += styleName + ": " + rule.style[styleName] + ';';
      }
    }

    finalText += rule.name + ' { ' + ruleValue + ' }\n';
  }
  return finalText;
};

var DataTable = view.newClass( 'DataTable', Container, {
  columns: function ( cols ) {
    "use strict";
    if ( !arguments.length ) {
      return this._header.columns();
    }
    var _hasFocus = false;
    if ( this.hasFocus() ) {
      _hasFocus = true;
    }
    //        this._stylerfunction = fun.bindOnce(this._styler, this);

    cols = table.addColumnDefaults( cols );
    //        cols[0].styler = this._stylerfunction;
    this._list.columns( cols );
    this._header.columns( cols );
    this._footer.columns( cols );

    if ( _hasFocus ) {
      this.focus();
    }

    return this;
  },

  header: function () {
    return this._header;
  },

  list: function () {
    return this._list;
  },

  footer: function () {
    return this._footer;
  },
  scrollContainer: function () {
    return this._scrollContainer;
  },
  scrollBar: function () {
    return this._scrollBar;
  },
  styleColumn: function ( row, col, grid ) {
    return this._styler( row, col, grid );
  },

  styler: fun.newProp( "styler" ),
  _styler: fun.FF,

  CSSTableId: fun.newProp( "CSSTableId" ),
  _CSSTableId: 0,

  editInPlaceHotkey: fun.newProp( "editInPlaceHotkey" ),
  _editInPlaceHotkey: 113,

  // Allow Edit in Place, if this is false the editing in place is disabled.
  editInPlace: fun.newProp( "editInPlace", function ( val ) {
    if ( arguments.length ) {
      if ( val === true ) {
        this._editInPlace = true;
        this._EIP_CreateEditors();
      } else {
        this._editInPlace = false;
      }
    }
    return (this._editInPlace);
  } ),
  _editInPlace: false,

  menudom: function () {
    return this._menudom;
  },

  _createDom: function ( initArgs ) {
    _DataTableCounter++;
    this._CSSTableId = _DataTableCounter;
    this._dom = dom.createElement( 'div', {className: 'uki-dataTable uki-dataTable' + this._CSSTableId} );
    this._stylesheet = dom.createStylesheet( ' ', this._dom );
    var w1 = dom.createElement( 'div', {className: 'uki-menu-w1'} );
    this._menudom = dom.createElement( 'div', {className: 'uki-menu-w2'} );
    w1.appendChild( this._menudom );
    this._dom.appendChild( w1 );

    var c = build( [

      { view: initArgs.headerView || DataTableAdvancedHeader, as: 'header',
        addClass: 'uki-dataTable-header-container', pos:{position:'relative'},
        on: {scroll: fun.bind( this._scrolledHeader, this ) },
        init: {stylesheet: this._stylesheet}
      },

      { view: Container, pos: 'top:0 left:0 right:0 bottom:0',
        addClass: 'uki-dataTable-container', as: 'container',
        childViews: [
          { view: initArgs.listView || DataTableList, as: 'list',
            on: { selection: fun.bind( this.trigger, this ) } }
        ] },

      { view: Container, pos: 'left:0 right:0 bottom:0 height:15',
        addClass: 'uki-dataTable-scrollbar-container', as: 'scrollContainer',
        on: { scroll: fun.bind( this._scrolledScrollbar, this ) },
        childViews:  [
          {view: Container, pos: 'height:15',
            addClass: 'uki-dataTable-scrollbar', as: 'scrollBar' }
        ]
      },

      { view: initArgs.footerView || DataTableFooter, as: 'footer',
        addClass: 'uki-dataTable-footer-container',
        on: {scroll: fun.bind( this._scrolledFooter, this ) }
      }

    ] ).appendTo( this );
    this._list = c.view( 'list');
    this._footer = c.view( 'footer' );
    this._footer.on( "render", fun.bindOnce( this._updateContainerHeight, this ) );
    this._footer.on( "render", fun.bindOnce( this._recalculateTableSizes, this ) );
    this._footer.on('keydown', this._keyDown);
    this._header = c.view( 'header' );
    this._header.on( "keydown", this._keyDown );
    this._header.on( 'render', fun.bindOnce( this._updateContainerHeight, this ) );
    this._header.on( 'recalcTableSize', fun.bindOnce( this._recalculateTableSizes, this ) );
    this._container = c.view( 'container' );
    this._container.on( "keydown", this._keyDown );
    this._container.dom().tabIndex = -1; // Remove tab focusablity
    this._container.on( "mousedown", this._EIPClick );
    this._scrollContainer = c.view('scrollContainer');
    this._scrollBar = c.view('scrollBar');
    this._list = c.view( 'list' );
    if (typeof window.ontouchstart !== 'undefined') {
      // THESE MUST BE TOUCHxxxx and not dragGesture events; the DG system does not allow the event to propagate down to the lower
      // html elements which are needed for scrolling up/down and selecting items.
      this._container.on('touchstart', fun.bind(this._detectSwipeStart, this), false);
      this._container.on('touchmove', fun.bind(this._detectSwipeMove, this), false);
      this._container.on('touchend', fun.bind(this._detectSwipeEnd, this), false);
    } else {
      this._container.on('mousewheel', fun.bindOnce(this._redirectHorizontalScroll, this));
      this._container.on('wheel', fun.bind(this._redirectHorizontalScroll, this), false); // FF on Mac
    }
  },

  destruct: function () {
    Container.prototype.destruct.call( this );
    this._menudom = null;
    this._list = null;
    this._container = null;
    this._scrollContainer = null;
    this._header = null;
    this._footer = null;
    this._styler = null;
    this._stylerfunction = null;
  },
  _recalculateTableSizes: function () {
    var headerUnpinnedWidth = this._header.getTotalUnpinnedWidth();
    if (headerUnpinnedWidth == 0) { return; }
    var headerPinnedWidth = this._header.getTotalPinnedWidth();
    this._footer._table.style.width = this._header._table.style.width = (this._header.totalWidth() - headerPinnedWidth) + "px";
    this.setStyle('uki-dataList-pack', 'width', headerUnpinnedWidth + 'px');
    var scrollbarPos = this._scrollBar.pos();
    var totalWidth = (headerPinnedWidth + headerUnpinnedWidth) + 'px';
    if (scrollbarPos.width != totalWidth) {
      scrollbarPos.width = totalWidth;
      this._scrollBar.pos(scrollbarPos);
    }
  },
  _lastClientX: false,
  _detectSwipeStart: function (event) {
      this._lastClientX = event.pageX;
      this._lastClientY = event.pageY;
  },
  _detectSwipeEnd: function() {
      this._lastClientX = false;
      this._lastClientY = false;
  },
  _detectSwipeMove: function (event) {
      if (this._lastClientX !== false) {
        var x = this._lastClientX - event.baseEvent.touches[0].clientX;
        var y = this._lastClientY - event.baseEvent.touches[0].clientY;
        if (Math.abs(x) > Math.abs(y)) {
          var left = this._scrollContainer.scrollLeft();
          this._scrollContainer.scrollLeft(left+x);
          event.preventDefault();
          event.stopPropagation();
        }
        this._lastClientX = event.baseEvent.touches[0].clientX;
        this._lastClientY = event.baseEvent.touches[0].clientY;

      }
  },
  _redirectHorizontalScroll: function (event) {
    var x = event && (event.deltaX || (event.baseEvent && event.baseEvent.wheelDeltaX));
    if (x) {
      var left = this._scrollContainer.scrollLeft();
      if (this.isTouchDevice()) {
        this._scrollContainer.scrollLeft(left+x);
      } else {
        this._scrollContainer.scrollLeft(left-x);
      }
    }
  },
  _isTouchDevice: undefined,
  isTouchDevice: function() {
    if (this._isTouchDevice == undefined) {
      this._isTouchDevice = !!(typeof window.ontouchstart !== 'undefined');
    }
    return this._isTouchDevice;
  },

  pinColumn: function (index) {
    this._header.pinColumn(index);
  },
  setStyle: function (styleName, name, value ) {
    if (this._header && this._header.setStyle) {
      return this._header.setStyle(styleName, name, value);
    }
  },
  getStyle: function (styleName, name ) {
    if (this._header && this._header.getStyle) {
      return this._header.getStyle(styleName, name);
    }
  },
  _updateContainerHeight: function () {
    if (!this._dom.clientHeight && !this._dom.clientWidth) { return; }
    var pos = this._container.pos();
    // .clientRect() is very expensive; so we are going to cache the results once we have valid results
    var headerHeight = 0;
    if ( this._header._rectHeight ) {
      headerHeight = this._header._rectHeight;
    }
    else {
      headerHeight = this._header.clientRect().height;
      if ( headerHeight !== 0 ) {
        this._header._rectHeight = headerHeight;
      }
    }
    //force the height of the header since when a column is moved and all the columns are set to position:absolute
    // the header disappears because it is empty
    var headerPos = this._header.pos();
    var headerHeightPx = headerHeight + 'px';
    if (headerPos.height !== headerHeightPx) {
      headerPos.height = headerHeightPx;
      this._header.pos(headerPos);
    }
    var posChange = false;
    if (pos.top !== headerHeightPx) {
      pos.top = headerHeightPx;
      posChange = true;
    }
    this.setStyle('uki-dataTable-header-wrap', 'height', headerHeightPx);

    var footerHeight;
    if ( this._footer.visible() ) {
      if ( this._footer._rectHeight ) {
        footerHeight = this._footer._rectHeight;
      }
      else {
        footerHeight = this._footer.clientRect().height - 1;//removing one pixel here because of the top border style
        if ( footerHeight > 1 ) {
          this._footer._rectHeight = footerHeight;
        }
      }
    }
    var footerHeightPx = footerHeight + 'px';

    var scrollbarHeight = 0;
    var tableDataWidth = this._footer._dom.scrollWidth;
    var tableContainerWidth = this._dom.clientWidth;
    if (tableContainerWidth < tableDataWidth) {
      var scrolledPos = this._scrollContainer.pos();
      var scrollChange = false;
      if (scrolledPos.height !== '15px') {
        scrolledPos.height = '15px';
        scrollChange = true;
      }
      if (typeof window.ontouchstart !== 'undefined') {
        if (scrolledPos.bottom !== '0px') {
          scrolledPos.bottom = '0px';
          if (!scrollChange) { scrollChange = true; }
        }
      } else {
        if (scrolledPos.bottom !== footerHeightPx) {
          scrolledPos.bottom = footerHeightPx;
          if (!scrollChange) { scrollChange = true; }
        }
        scrollbarHeight = 15;
      }
      if (scrollChange) { this._scrollContainer.pos(scrolledPos); }
    }

    //force the height of the footer since when a column is moved and all the columns are set to position:absolute
    // the footer disappears because it is empty
    var footerPos = this._footer.pos();
    if (footerHeight > 4 && footerPos.height !== footerHeightPx ) { //anything under 5 pixels is probably bogus while things are building out
      footerPos.height = footerHeightPx;
      this._footer.pos(footerPos);
    }

    if (pos.bottom !== (footerHeight + scrollbarHeight ) + 'px') {
      pos.bottom = (footerHeight + scrollbarHeight ) + 'px';
      if (!posChange) { posChange = true; }
    }
    if (posChange) { this._container.pos( pos ); }

    if ( this._deferFocus === true ) {
      this.focus();
    }
  },

  _initLayout: function () {
    this._updateContainerHeight();
  },

  _handleScroll: function ( newLocation ) {
    if ( this._header._menu != null ) {
      this._header._menu.dom().style.marginLeft = -newLocation + "px";
    }
    //Scroll the main rows first
    this._header.setStyle('table.uki-dataTable-pack', 'margin-left', '-' + newLocation + 'px');
    //Scroll the header and footer
    var totalPinnedWidth = this._header.getTotalPinnedWidth();
    this._footer._table.style.marginLeft = this._header._table.style.marginLeft = (totalPinnedWidth - newLocation) + "px";
  },

  _scrolledFooter: function () {
    var lastLocation = this._footer.scrollLeft();
    this._handleScroll( lastLocation );
  },

  _scrolledScrollbar: function () {
    var newHeader = this._scrollContainer.scrollLeft();
    this._handleScroll( newHeader );
  },

  _scrolledHeader: function () {
    var newHeader = this._header.scrollLeft();
    this._handleScroll( newHeader );
  },

  _keyDown: function ( event ) {

    // This event is called from a Child of DataTable, so we have to link back to the parent
    var parent = this.parent();
    if ( parent == null ) {
      return;
    }
    if ( parent._inEditInPlace ) {
      return;
    }
    // Can we edit in place?
    if ( parent._editInPlace === false ) {
      return;
    }

    if ( event.keyCode === parent._editInPlaceHotkey ) {
      parent.startEditInPlace( parent._list.selectedIndex(), 0 );
    }
  },

  startEditInPlace: function ( row, col ) {
    if ( !this._editInPlace ) {
      return;
    }
    if ( row == null ) {
      row = this._list.selectedIndex();
    }
    if ( col == null ) {
      col = 0;
    }

    var columns = this._header.columns();
    if ( columns == null ) {
      return;
    }

    if ( this._Editors === null || this._Editors.length !== columns.length ) {
      this._EIP_CreateEditors();
    }

    this._EIPMove( row, col, true, true );
  },

  stopEditInPlace: function () {
    if ( this._EIP_ClearEditor() ) {
      this._inEditInPlace = false;
      this.focus();
    }
  },

  /**
   * Returns TRUE, if the MoveNext/MoveNearest is allowed to continue moving the editor, returns FALSE to stop from moving editor.
   */
  _EIP_ClearEditor: function () {
    if ( this._EIPCurrentColumn === -1 || this._EIPCurrentRow === -1 ) {
      return (true);
    }
    var columns = this._header.columns();
    var col = this._EIPCurrentColumn;
    var row = this._EIPCurrentRow;
    var value = this._Editors[col].value();

    if ( this._Editors[col]._dom.parentNode === null ) {
      return (true);
    }
    if ( columns[col].editor != null ) {
      if ( columns[col].unformatter != null ) {
        value = columns[col].unformatter( value );
      }
      if ( columns[col].validation != null ) {
        var validated = columns[col].validation( row, col, value );
        if ( validated === false ) {
          return (false);
        }
      }
    }

    var oldvalue = this._EIPCurrentRowData[0][col];
    var data = this.data();
    if ( value === "" && oldvalue === null ) {
      oldvalue = "";
    }

    if ( oldvalue != value ) {
      if ( data.changeData != null ) {
        data.changeData( row, col, value );
      } else if ( utils.isArray( data ) ) {
        data[row][col] = value;
      }
      this._EIPCurrentRowData[0][col] = value;

      try {
        this.trigger( {
          type: "editInPlaceChange",
          original: oldvalue,
          value: value,
          row: row,
          column: col
        } );
      }
      catch( err ) {
      }
    }
    var parent = this._Editors[col]._dom.parentNode;
    dom.removeElement( this._Editors[col]._dom );
    var newvalue = columns[col].formatter( value );
    this._styler( this._EIPCurrentRowData[0], this._EIPCurrentRow, this );
    parent.innerHTML = newvalue;
    this._EIPCurrentColumn = -1;
    this._EIPCurrentRow = -1;
    this._EIPCurrentRowData = null;
    return (true);
  },

  _EIP_getDomElement: function ( row, col ) {
    var htmlrow = this._list.dom().querySelector( "tr.uki-dataTable-row-" + row );
    if ( htmlrow == null ) {
      return (null);
    }

    var htmlcol = htmlrow.querySelector( "td.uki-dataTable-col-" + col );
    return (htmlcol);
  },

  _EIPMove: function ( row, col, nearest, forward ) {
    var columns = this._header.columns();
    if ( !nearest && col === -1 ) {
      col = columns.length;
      row--;
    }
    // find the next valid column (maybe the one sent in)

    if ( forward ) {
      // Go Forwards
      while ( col < columns.length && (columns[col].visible() === false || this._Editors[col] === null) ) {
        col++;
      }
      if ( col >= columns.length ) {
        if ( nearest ) {
          col = columns.length - 1;
          while ( col >= 0 && (columns[col].visible() === false || this._Editors[col] === null) ) {
            col--;
          }
        } else {
          col = 0;
          row++;
          while ( col < columns.length && (columns[col].visible() === false || this._Editors[col] === null) ) {
            col++;
          }
        }
      }
    } else {
      // Go Backwards
      while ( col >= 0 && (columns[col].visible() === false || this._Editors[col] === null) ) {
        col--;
      }
      if ( col === -1 ) {
        col = columns.length - 1;
        row--;
        while ( col >= 0 && (columns[col].visible() === false || this._Editors[col] === null) ) {
          col--;
        }
      }
    }
    var htmlcol = this._EIP_getDomElement( row, col );
    if ( htmlcol === null ) {
      return (false);
    }

    if ( this._inEditInPlace ) {
      if ( this._EIP_ClearEditor() === false ) {
        if ( this._list.selectedIndex() !== this._EIPCurrentRow ) {
          this._list.selectedIndex( this._EIPCurrentRow );
          this._list.triggerSelection();
        }
        return;
      }
    }

    // Set our Tracking Variables
    this._inEditInPlace = true;
    this._EIPCurrentColumn = col;
    this._EIPCurrentRow = row;
    if ( this._list.selectedIndex() !== row ) {
      this._list.selectedIndex( row );
      this._list.triggerSelection();
    }

    if ( this.data().loadRange != null ) {
      this.data().loadRange( row, row + 1, fun.bindOnce( this._EIPStartEditor, this ) );
    } else {
      this._EIPStartEditor( this.data().slice( row, row + 1 ) );
    }

  },

  _EIPStartEditor: function ( row ) {
    var columns = this._header.columns();
    var htmlcol = this._EIP_getDomElement( this._EIPCurrentRow, this._EIPCurrentColumn );
    //console.log("EIPS: ",row);
    this._EIPCurrentRowData = row;

    // Assign the Editor
    var beditor = this._Editors[this._EIPCurrentColumn];

    var value = row[0][this._EIPCurrentColumn];
    beditor.value( columns[this._EIPCurrentColumn].formatter( value ? value : '' ) );
    htmlcol.innerHTML = '';
    htmlcol.appendChild( beditor._dom );
    this._EIPFocus();
  },

  _inEditInPlace: false,
  _EIPCurrentColumn: -1,
  _EIPCurrentRow: -1,
  _EIPCurrentRowData: null,

  _EIPFocus: function () {
    if ( this._Editors[this._EIPCurrentColumn].focus ) {
      this._Editors[this._EIPCurrentColumn].focus();
    } else if ( this._Editors[this._EIPCurrentColumn]._input && this._Editors[this._EIPCurrentColumn]._input.focus ) {
      this._Editors[this._EIPCurrentColumn]._input.focus();
    } else if ( this._Editors[this._EIPCurrentColumn]._dom.focus ) {
      this._Editors[this._EIPCurrentColumn]._dom.focus();
    }

    if ( this._Editors[this._EIPCurrentColumn].select ) {
      this._Editors[this._EIPCurrentColumn].select();
    } else if ( this._Editors[this._EIPCurrentColumn]._input && this._Editors[this._EIPCurrentColumn]._input.select ) {
      this._Editors[this._EIPCurrentColumn]._input.select();
    } else if ( this._Editors[this._EIPCurrentColumn]._dom.select ) {
      this._Editors[this._EIPCurrentColumn]._dom.select();
    }
  },

  _EIP_CreateEditors: function () {

    if ( !this._editInPlace ) {
      return;
    }

    // Check for Already created Editors
    if ( this._Editors != null && this._Editors.length > 0 ) {
      for ( var i = 0; i < this._Editors.length; i++ ) {
        if ( this._Editors[i] != null ) {
          try {
            this._Editors[i].destruct();
          }
          catch( err ) {
          }
        }

      }
    }

    var cols = this._header.columns();

    // No columns setup
    if ( cols == null ) {
      return;
    }

    this._Editors = [];
    for ( var i = 0; i < cols.length; i++ ) {

      if ( cols[i].editor === false || cols[i].editor == null ) {
        this._Editors.push( null );
        continue;
      }
      if ( cols[i].editor === true ) {
        var editor = {view: "nativeControl.Text"};
      } else {
        var editor = cols[i].editor;
      }
      editor["pos"] = "width:100% height:14pt position:relative";
      try {
        var beditor = build( editor );
        beditor[0].on( "keydown", this._EIPKeyDown );
        beditor[0]._editInPlaceHotkey = this._editInPlaceHotkey;
        beditor[0]._parent = this;
        this._Editors.push( beditor[0] );
      }
      catch( Err ) {
        this._Editors.push( null );
      }
    }
  },
  _Editors: null,

  _EIPClick: function ( event ) {
    var parent = this.parent();
    if ( parent == null || !parent._inEditInPlace ) {
      return;
    }
    var target = event.srcElement ? event.srcElement : event.target;
    var pos = target.className.indexOf( "uki-dataTable-col-" );
    if ( pos === -1 ) {
      if ( parent.list().selectedIndex() !== parent._EIPCurrentRow ) {
        parent.list().selectedIndex( parent._EIPCurrentRow );
        parent.list().triggerSelection();
      }
      return;
    }
    var col = parseInt( target.className.match( /uki-dataTable-col-(\d+)/ )[1], 10 );

    var row = parent.list().selectedIndex();
    if ( col == null || row == null || col < 0 || row < 0 ) {
      return;
    }
    parent._EIPMove( row, col, true, true );
  },

  _EIPKeyDown: function ( event ) {
    var parent = this.parent();

    if ( event.keyCode === 9 || event.keyCode === 13 || event.keyCode === 27 ||
      event.keyCode === this._editInPlaceHotkey ) {
      event.preventDefault();
      event.stopPropagation();
      if ( event.keyCode === 9 || event.keyCode === 13 ) {
        if ( event.shiftKey === true ) {
          parent._EIPMove( parent._EIPCurrentRow, parent._EIPCurrentColumn - 1, false, false );
        } else {
          parent._EIPMove( parent._EIPCurrentRow, parent._EIPCurrentColumn + 1, false, true );
        }
      }
      if ( event.keyCode === 27 || event.keyCode === this._editInPlaceHotkey ) {
        if ( parent._EIP_ClearEditor() ) {
          parent._inEditInPlace = false;
          parent.focus();
        }
      }
    }
    if ( (event.keyCode === 38 || event.keyCode === 40) && parent._inEditInPlace ) {
      if ( event.keyCode === 38 && parent._EIPCurrentRow > 0 ) { // Up Arrow

        parent._EIPMove( parent._EIPCurrentRow - 1, parent._EIPCurrentColumn, false, true );

      } else if ( event.keyCode == 40 ) { // Down Arrow
        var data = parent.data();
        if ( data.length <= parent._EIPCurrentRow + 1 ) {
          parent.EIPInsertRow();

        } else {
          parent._EIPMove( parent._EIPCurrentRow + 1, parent._EIPCurrentColumn, false, false );
        }
      }
    }
  },

  EIPInsertRow: function () {
    if ( !this._inEditInPlace ) {
      return;
    }
    var data = this.data();
    var rownum = data.length;
    if ( data.insertRow ) {
      var row = data.insertRow();
      this.trigger( {type: "insertedRow",
        table: this,
        row: row,
        rowid: rownum
      } );
    } else if ( utils.isArray( data ) ) {
      var cols = [];
      var collen = this.columns().length;
      for ( var i = 0; i < collen; i++ ) {
        cols.push( "" );
      }
      data.push( cols );
      this.trigger( {type: "insertedRow",
        table: this,
        row: data.slice( rownum, rownum + 1 ),
        rowid: rownum
      } );
    } else {
      // Nothing inserted so, rownum will be invalid
      rownum--;
    }
    this.list()._update();
    this.scrollToIndex( rownum );
    // Gives Dom enough time to draw new row
    this._delayedMoveForInsert();
  },

  _delayedMoveForInsert: function () {
    var rownum = this.data().length - 1;
    this._EIPMove( rownum, this._EIPCurrentColumn, false, false );
  },

  isEditing: function () {
    return (this._inEditInPlace);
  },

  editColumn: function ( col ) {
    if ( !this._inEditInPlace ) {
      return (-1);
    }
    if ( arguments.length && col >= 0 && col < this._header.columns().length ) {
      this._EIPMove( this._EIPCurrentRow, col + 0, true, true );
    }
    return (this._EIPCurrentColumn);
  },

  editorValue: function ( value ) {
    if ( !this._inEditInPlace ) {
      return (null);
    }
    if ( arguments.length ) {
      this._Editors[this._EIPCurrentColumn].value( value );
    }
    return (this._Editors[this._EIPCurrentColumn].value());
  },

  redrawRow: function ( row ) {
    this._list.redrawRow( row , function() {
      if ( !this._inEditInPlace ) {
        return;
      }
      if ( this._EIPCurrentRow === row ) {
        this._EIPMove( this._EIPCurrentRow, this._EIPCurrentColumn, true, true );
      }
    }.bind(this));
  },

  focus: function () {
    if ( this._list.columns().length === 0 ) {
      this._deferFocus = true;
      return;
    }
    if ( this._header.filterable ) {
      var hc = this._header.columns();
      // Search for initfocus
      var found = false;
      for ( var i = 0; i < hc.length && !found; i++ ) {
        if ( hc[i].visible() && hc[i].filterable() && hc[i]._filter && dom.hasClass( hc[i]._filter, 'initfocus' ) ) {
          hc[i].focus();
          found = true;
        }
      }
      if ( !found ) {
        for ( var i = 0; i < hc.length && !found; i++ ) {
          if ( hc[i].visible() && hc[i].filterable() ) {
            hc[i].focus();
            found = true;
          }
        }
      }
      if ( !found ) {
        this._list.focus();
      }
    } else {
      this._list.focus();
    }
  },

  hasFocus: function () {
    if ( this._list.hasFocus() ) {
      return (true);
    }
    if ( this._header.hasFocus() ) {
      return (true);
    }
    return (false);
  },

  blur: function () {
    this._list.blur();
    this._header.blur();
  },

  hasFooter: function ( v ) {
    if ( arguments.length ) {
      return (this._footer.visible( v ));
    }
    return (this._footer.visible());
  }

} );

fun.delegateProp( DataTable.prototype, [
  'data', 'dataReload', 'throttle', 'debounce', 'template', 'formatter', 'key',
  'selection', 'selectedRows', 'selectedRow',
  'selectedIndexes', 'selectedIndex', 'lastClickIndex', 'multiselect'
], 'list' );

fun.delegateCall( DataTable.prototype, [
  'scrollToIndex', 'triggerSelection', 'renderingRows'
], 'list' );

fun.delegateCall( DataTable.prototype, ['summary'], 'footer' );

fun.delegateProp( DataTable.prototype, [
  'filterable', 'filterTimeout', 'sortable', 'hasMenu',
  'menuOptions', 'menu', 'menuImage'
], 'header' );

fun.delegateCall( DataTable.prototype, [
  'setRowColStyle', 'setRowStyle', 'setColStyle', 'columnIdByName', 'columnIdByLabel', 'pinColumn'
], 'header' );

var DataTableHeaderColumn = view.newClass( 'DataTableHeaderColumn', Base, {

  // Properties for this Class
  className: fun.newProp( 'className', function ( v ) {
    if ( arguments.length && this._dom) {
      if ( this._className === v ) {
        return (v);
      }
      if ( this._className.length > 0 ) {
        dom.removeClass( this._dom, this._className );
      }
      this._className = v;
      dom.addClass( this._dom, this._className );
    }
    return (this._className);
  } ),
  _className: '',
  resizable: fun.newProp( 'resizable', function ( v ) {
    if ( arguments.length ) {
      this._resizable = v;
      this._setupResizeable();
    }
    return (this._resizable);
  } ),
  _resizable: true,
  sortable: fun.newProp( 'sortable' ),
  _sortable: true,
  filterable: fun.newProp( 'filterable', function ( v ) {
    if ( arguments.length ) {
      this._filterable = v;
      if ( this.parent() == null ) {
        return;
      }
      if ( v && this.parent().filterable() ) {
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
      this._sizeable = this._minWidth !== this._maxWidth;
      this._setupResizeable();
    }
    return this._maxWidth;
  } ),
  _maxWidth: 0,
  width: fun.newProp( 'width', function ( v ) {
    if ( arguments.length ) {
      var newWidth = Math.min( Math.max( v, this._minWidth ), this._maxWidth == 0 ? v : this._maxWidth );
      if ( newWidth !== this._width ) {
        this._width = newWidth;
        this._filter.style.width = (newWidth - this.pinWidth()) + 'px';
        if ( this.parent() != null ) {
          this._parent.setColStyle(this._pos, 'width', this._width + 'px');
          this.parent().trigger( { type: 'recalcTableSize' } );
        }
      } else if (!this._filter.style.width) {
        this._filter.style.width = (newWidth - this.pinWidth()) + 'px';
      }

    }
    return (this._width);
  } ),
  pinWidth: function () {
    if (this._parent) {
      var showAdvanced = this._parent._showAdvancedLayoutCustomization;
    } else {
      var showAdvanced = false;
    }
    if (showAdvanced) {
      return ((typeof window.ontouchstart !== 'undefined') ? 35 : 15);
    } else {
      return ((typeof window.ontouchstart !== 'undefined') ? 10 : 0);
    }
  },
  _width: 200,
  minWidth: fun.newProp( 'minWidth', function ( v ) {
    if ( arguments.length ) {
      this._minWidth = Math.min( v, this._width );
      this._sizeable = this._minWidth !== this._maxWidth;
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
      if ( this._hasMenu ) {
        this._labelElement.style.marginLeft = "16px";
      } else {
        this._labelElement.style.marginLeft = "";
      }
      if ( this._name.length === 0 ) {
        this.name( v );
      }
    }
    return (this._label);
  } ),
  _label: '',
  name: fun.newProp( 'name', function ( v ) {
    if ( arguments.length ) {
      this._name = v;
      this._filter.name = "_filter_" + this._name;
    }
    return this._name;
  } ),
  _name: '',
  visible: fun.newProp( 'visible', function ( v ) {
    if ( arguments.length ) {
      this._visible = v;
      if ( this.parent() != null ) {
        if ( v ) {
          this._parent.setColStyle(this._pos, 'display', '');
        } else {
          this._parent.setColStyle(this._pos, 'display', 'none');

        }
      }
    }
    return (this._visible);
  } ),
  _visible: true,
  sort: fun.newProp( 'sort', function ( v ) {
    if ( arguments.length ) {
      if ( v > 2 || v < 0 ) {
        v = 0;
      }
      this._sort = v;
      if ( this.parent() == null ) {
        return (this._sort);
      }

      if ( this.parent().sortable() && this._labelElement) {
        dom.removeClass( this._labelElement, "uki-dataTable-sort-down uki-dataTable-sort-up" );
        if ( v === 1 ) {
          dom.addClass( this._labelElement, "uki-dataTable-sort-down" );
        } else if ( v === 2 ) {
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
  formatter: function ( value ) {
    if ( arguments.length ) {
      if ( typeof value === 'function' ) {
        this._formatter = value;
      } else {
        return this._formatter( value );
      }
    }
    return this._formatter;
  },
  _formatter: dom.escapeHTML,
  hasMenu: fun.newProp( 'hasMenu', function ( v ) {
    if ( arguments.length ) {
      if ( this._hasMenu == v ) {
        return (this._hasMenu);
      }
      this._hasMenu = v;
      this.label( this._label );
    }
    return (this._hasMenu);
  } ),
  _hasMenu: false,
  filterValue: function ( v ) {
    if ( arguments.length ) {
      if ( this._filter.value === v ) {
        return;
      }
      this._prevFilterValue = this._filter.value;
      this._filter.value = v;
      if ( this.parent() != null ) {
        this.parent()._handleFilterNotify();
      }
    }
    return (this._filter.value);
  },
  footerValue: function ( v ) {
    if ( arguments.length ) {
      return (this.parent().parent().footer().footervalue( this._pos, v ));
    }
    return (this.parent().parent().footer().footervalue( this._pos ));
  },
  footerVisible: function ( v ) {
    if ( arguments.length ) {
      return (this.parent().parent().footer().footervisible( this._pos, v ));
    }
    return (this.parent().parent().footer().footervisible( this._pos ));
  },
  pinned: fun.newProp( 'pinned', function ( v ) {
    if ( arguments.length ) {
      this._pinned = v;
    }
    return this._pinned;
  } ),
  _pinned: false,

  // _pos is not a changeable property, only can be set at creation, this is because too many things depend on this!
  // it would be a pain to try and make sure things that link via the _pos are updated
  _pos: 0,

  //This property tracks the actual position/order of the columns.
  //It does not take into account the pinned columns pinned order, just its order if it becomes unpinned.
  _aPos: undefined,

  // Used to track if Max/Min Width are equal -- if so, resizabe is disabled also
  _sizeable: true,

  domForEvent: function () {
    return this._filter;
  },

  _createDom: function ( initArgs ) {
    if ( initArgs.pos != null ) {
      this._pos = this._aPos = initArgs.pos;
    }
    var filterStyle = '';
    if ( initArgs.filterable != null ) {
      if ( initArgs.filterable === false ) {
        filterStyle = 'display:none';
      }
    }

    var className = 'uki-dataTable-header-cell uki-dataTable-col-' + this._pos;

    this._labelElement =
      dom.createElement( 'div', {className: "uki-dataTable-header-text uki-dataTable-header-text-col-" + this._pos} );
    this._resizer =
      dom.createElement( 'div', {className: "uki-dataTable-resizer uki-dataTable-resizer_pos-" + this._pos} );

    var pinClasses = "uki-dataTable-pin uki-dataTable-pin-col-" + this._pos;
    if ( typeof window.ontouchstart  !== 'undefined') {
      this._resizer.innerHTML = "&nbsp;<br>&nbsp;";
      this._resizer.style.width = "20px";
      this._resizer.style.right = "-14px";
      pinClasses += ' uki-dataTable-unpinned';
    } else {
      this._resizer.innerHTML = "";
    }

    this._pin = dom.createElement( 'div', {className: pinClasses  } );
    this._filter =
      dom.createElement( 'input', {className: "uki-dataTable-filter" +
        (initArgs.initfocus ? ' initfocus' : ''), tabIndex: 1, autocomplete: "off", name: "_filter_" +
        this._name, style: filterStyle} );
    // The focus/blur events keep track of the last focused filter.
    this.on( 'focus', function () {
      this.parent()._lastFocusedFilter && dom.removeClass( this.parent()._lastFocusedFilter, 'initfocus' );
      dom.addClass( this._filter, 'initfocus' );
      var advHeader = this.parent();
      var mainContainer = advHeader && advHeader.parent();
      if (mainContainer) {
        var visWidth = mainContainer._dom.clientWidth;
        var colLeft = this._dom.offsetLeft;
        var colWidth = this.width();
        var right = colLeft + colWidth;
        if (right > visWidth) {
          mainContainer._scrollContainer && mainContainer._scrollContainer.scrollLeft(right - visWidth + 20);
        } else {
          var scrolledLeft = mainContainer._scrollContainer.scrollLeft();
          if (colLeft < scrolledLeft) {
            mainContainer._scrollContainer && mainContainer._scrollContainer.scrollLeft(colLeft - scrolledLeft - 20);
          }
        }
      }
    } );
    this.on( 'blur', function () {
      this.parent()._lastFocusedFilter = this._filter;
    } );

    this._wrapper =
      dom.createElement( 'div', {className: "uki-dataTable-header-wrap uki-dataTable-header-wrap-col-" + this._pos}, [
        this._labelElement, this._filter, this._pin, this._resizer
      ] );
    this._dom =
    dom.createElement( 'td', {className: className}, [this._wrapper] );

    if (typeof window.ontouchstart !== 'undefined') {
      this._pin.style.width = '25px';
      this._pin.style.height = '25px';
      this._pin.style.right = '0px';
    } else {
      this._wrapper.onmouseover = fun.bind(this._showPin, this);
      this._wrapper.onmouseout =  fun.bind(this._removePin, this);
    }
  },

  destruct: function () {
    Base.prototype.destruct.call( this );
    this._wrapper = null;
    this._filter = null;
    this._resizer = null;
    this._labelElement = null;
    this._formatter = null;

  },
  _showPin: function () {
    if (this._pin && dom.hasClass(this._pin, 'uki-dataTable-pinned')) return;
    dom.addClass(this._pin, 'uki-dataTable-unpinned');
  },
  _removePin: function () {
    if (!this._pin || dom.hasClass(this._pin, 'uki-dataTable-pinned')) return;
    dom.removeClass(this._pin, 'uki-dataTable-unpinned');
  },
  _setupResizeable: function () {
    if (!this._dom) return;
    if ( this._resizable && this._sizeable ) {
      this._resizer.style.display = '';
      dom.addClass( this._dom, "uki-dataTable-header-cell_resizable" );
    } else {
      this._resizer.style.display = 'none';
      dom.removeClass( this._dom, "uki-dataTable-header-cell_resizable" );
    }
  },

  _built: function () {
    if(this.destructed) {return;}
    this.resizable( this._resizable );
    this.filterable( this._filterable );
    this.sort( this._sort );
    this.label( this._label );
    this.pinned(this._pinned);
  },

  focus: function () {
    try {
      if ( this._visible && this._filterable && this.parent().filterable() ) {
        this._filter.focus();
      }
    } catch( err ) {  }
  },

  hasFocus: function () {
    return this._filter === env.doc.activeElement;
  },

  blur: function () {
    try {
      if ( this.hasFocus() ) {
        this._filter.blur();
      }
    } catch( err ) {  }
  }

} );

var DataTableFooter = view.newClass( 'DataTableFooter', Container, {
  template: fun.newProp( 'template' ),
  _template: requireText( 'dataTable/footer.html' ),

  _createDom: function ( initArgs ) {
    Base.prototype._createDom.call( this, initArgs );

    // The rowfooter / _table will be replaced by the _render function due to an IE bug
    var rowfooter = dom.createElement( 'tr', {className: 'uki-dataTable-footer-row'} );
    this._table = dom.createElement( 'table', { className: 'uki-dataTable-footer' }, [rowfooter] );

    // This is the parent static element
    this._dom = dom.createElement( 'div', { className: 'uki-hidden' }, [this._table] );
  },

  destruct: function () {
    Container.prototype.destruct.call( this );
    this._table = null;
  },

  columns: fun.newProp( 'columns', function ( cols ) {
    this._columns = cols;
    this._table.style.width = table.totalWidth( this._columns ) + "px";
    this._render();
  } ),

  visible: fun.newProp( 'visible', function ( vis ) {
    if ( arguments.length && (vis === true || vis === false) && vis !== this._visible && this._dom) {
      this._visible = vis;
      if ( this._visible ) {
        dom.removeClass( this._dom, "uki-hidden" );
      } else {
        dom.addClass( this._dom, "uki-hidden" );
      }
      this.trigger( { type: 'render' } );
    }
    return (this._visible);
  } ),
  _visible: false,

  _formatColumn: function ( col ) {
    return {
      pos: col.pos,
      style: (col.footer === false) ? "display:none" : '',
      value: (col.footervalue ? col.footervalue : '')
    };
  },

  _render: function () {
    this._dom.innerHTML = Mustache.to_html(
      this._template, {
        columns: this._columns.map( this._formatColumn, this )
      } );

    // IE does not allow you to change the innerHTML of a table; so we have to regenerate the entire table and then
    // relink our variable to the new _table so that we can update the width dynamically when need be
    this._table = this._dom.getElementsByClassName( "uki-dataTable-footer" )[0];
    this._table.style.width = table.totalWidth( this._columns ) + "px";

    this.trigger( { type: 'render' } );
  },

  footervalue: function ( pos, v ) {
    if ( arguments.length === 2 ) {
      if ( this._columns[pos].footervalue !== v ) {
        this._columns[pos].footervalue = v;
        this._render();
      }
    }
    return (this._columns[pos].footervalue);
  },

  footervisible: function ( pos, v ) {
    if ( arguments.length === 2 && (v === true || v === false) ) {
      if ( this._columns[pos].footer !== v ) {
        this._columns[pos].footer = v;
        this._render();
      }
    }
    return (this._columns[pos].footer);
  },

  values: function ( v ) {
    var changed = false;
    var i;
    if ( arguments.length ) {
      var len = this._columns.length;
      if ( len > v.length ) {
        len = v.length;
      }
      for ( i = 0; i < len; i++ ) {
        if ( this._columns[i].footervalue !== v[i] ) {
          this._columns[i].footervalue = v[i];
          changed = true;
        }
      }
      if ( changed ) {
        this._rectHeight = null;
        this._render();
      }
    }
    var val = [];
    for ( i = 0; i < this._columns.length; i++ ) {
      val.push( this._columns[i].footervalue );
    }
    return (val);
  },

  summary: function ( v ) {
    if ( arguments.length ) {
      return (this.values( v ));
    }
    else {
      return (this.values());
    }
  }

} );

var DataTableAdvancedHeader = view.newClass( 'DataTableAdvancedHeader', Container, {
  filterable: fun.newProp( 'filterable', function ( v ) {
    if ( arguments.length ) {
      if ( this._filterable !== v ) {
        this._filterable = v;
        if ( this._columns == null ) {
          return (this._filterable);
        }
        // Reset Columns Filterable State, since the parent just changed
        for ( var i = 0; i < this._columns.length; i++ ) {
          this._columns[i].filterable( this._columns[i].filterable() );
        }
        this.trigger( { type: 'render' } );
      }
    }
    return (this._filterable);
  } ),
  _filterable: false,
  enterFiltered: fun.newProp( 'enterFiltered' ),
  _enterFiltered: false,
  filterTimeout: fun.newProp( 'filterTimeout' ),
  _filterTimeout: 500,
  sortable: fun.newProp( 'sortable' ),
  _sortable: false,
  _intervalId: null,

  /* Menu Related Code */
  hasMenu: fun.newProp( 'hasMenu', function ( v ) {
    if ( arguments.length ) {
      if ( this._hasMenu === v ) {
        return (v);
      }
      this._hasMenu = v;
      this._setupMenu();
    }
    return (this._hasMenu);
  } ),
  _hasMenu: false,
  menu: function () {
    return (this._menu);
  },
  _menu: null,
  menuImage: fun.newProp( 'menuImage', function ( v ) {
    if ( arguments.length ) {
      this._menuImage = v;
      this._setupMenuOptions();
    }
    return (this._menuImage);
  } ),
  _menuImage: "data:image/gif;base64,R0lGODlhEAAQAJEAAP39/ebm5ikpKZqamiH5BAAAAAAALAAAAAAQABAAAAIzhI+pqzEBgpwSDTGu2DuzfzgQNSVXxqWDaZAVIkauiWkpxspkUrqQVbt1YA8dBfTxKQMFADs=",
  menuOptions: fun.newProp( 'menuOptions', function ( v ) {
    if ( arguments.length ) {
      this._menuOptions = v;
      this._setupMenuOptions();
    }
    return (this._menuOptions);
  } ),
  _menuOptions: null,
  _showAdvancedLayoutCustomization : false,
  showAdvancedLayoutCustomization: function (show) {
    if (arguments.length) {
      var cols = this._columns;
      this._showAdvancedLayoutCustomization = show;
      if (cols && cols.length) {
        for (var i = 0, count = cols.length; i < count; ++i) {
          var col = cols[i];
          col._pin.style.display = (show ? 'block' : 'none');
          col._filter.style.width = (col._width - col.pinWidth()) + 'px';
        }
      }
    }
    return this._showAdvancedLayoutCustomization;
  },

  _styleSheetElement: null,
  _styleSheet: null,
  _columns: null,
  _leftPinnedColumns: {},
  _filteredColumnCount: 0,
  filteredColumnCount: function() { return this._filteredColumnCount; },

  _buildMenu: function() {
    "use strict";
      this._menu = build( [
        { view: 'Menu', as: 'DataTable-Menu',
          addClass: 'uki-dataTable-menu' }
      ] );
      this._setupMenu();
  },

  _createDom: function ( initArgs ) {
    Container.prototype._createDom.call( this, initArgs );
    this._rowheader = dom.createElement( 'tr', {className: 'uki-dataTable-header-row'} );
    this._table = dom.createElement( 'table', { className: 'uki-dataTable-header' }, [this._rowheader] );
    this._dom = dom.createElement( 'div', null, [this._table] );
    this._styleSheetElement = initArgs.stylesheet || dom.createStylesheet( ' ' );
    if ( this._styleSheetElement.sheet && this._styleSheetElement.sheet.cssRules ) {
      this._styleSheet = this._styleSheetElement.sheet;
    } else if ( this._styleSheetElement.styleSheet ) {
      this._styleSheet = this._styleSheetElement.styleSheet; // IE
    } else {
      this._styleSheet = new FauxCSSStyleSheet();
    }
    this._cssRuleTracking = {};

    if(this._hasMenu) {
      this._buildMenu();
    }

    this._draggableColumn = -1;
    this.on( 'draggesturestart', this._dragStart );
    this.on( 'draggesture', this._drag );
    this.on( 'draggestureend', this._dragEnd );
    if ( typeof window.ontouchstart !== 'undefined' ) {
      this.on( 'touchend', this._click );
    } else {
      this.on( 'click', this._click );
    }
    this.on('resizedColumn', this._resizePinnedColumn);
  },

  _isTouchDevice: undefined,
  isTouchDevice: function() {
    if (this._isTouchDevice == undefined) {
      this._isTouchDevice = !!(typeof window.ontouchstart !== 'undefined');
    }
    return this._isTouchDevice;
  },

  _setupMenu: function () {
    if ( this.parent() == null || this.parent().length == 0 || this._columns == null ) {
      fun.deferOnce( fun.bindOnce( this._setupMenu, this ) );
      return;
    }
    if ( this._hasMenu ) {
      var found = false;
      if ( this._menu.parent() == null || this._menu.parent().length == 0 ) {

        this._menu.attach( this.parent().menudom(), false );
        for ( var i = 0; i < this._columns.length; i++ ) {
          if ( found || this._columns[i].visible() === false ) {
            this._columns[i].hasMenu( false );
          } else if ( !found ) {
            this._columns[i].hasMenu( true );
            found = true;
          }
        }
      }
    } else {
      this._menu.remove();
      for ( var i = 0; i < this._columns.length; i++ ) {
        this._columns[i].hasMenu( false );
      }
    }
  },

  _setupMenuOptions: function () {
    var lmenu = [];
    lmenu[0] = {html: '<img src="' + this._menuImage +
      '" draggable=false width="12px" height="12px" border=0 ondragstart="return false;">', options: this._menuOptions};
    if (this._menu == null) {
      this._buildMenu();
    }
    this._menu.options( lmenu );
  },

  destruct: function () {

    if ( this._menu ) {
      this._menu.destruct();
      this._menu = null;
    }
    this._styleSheet = null;
    this._cssRuleTracking = null;

    dom.removeElement( this._styleSheetElement );
    this._styleSheetElement = null;

    for ( var i = 0; i < this._columns.length; i++ ) {
      this._columns[i].destruct();
      this._columns[i] = null;
    }

    Container.prototype.destruct.call( this );

    this._table = null;
    this._dom = null;
    this._rowheader = null;
    this._lastFocusedFilter = null;
    this._menuOptions = null;
    this._columns = null;
  },

// Functions for setting and getting styles
  _cssRuleTracking: null,
  _name: null,

  hasStyle: function ( row, col ) {
    var Key = "";
    if ( row != null && col != null ) {
      Key = "RC" + row + "-" + col;
    }
    else if ( row != null ) {
      Key = "R" + row;
    }
    else if ( col != null ) {
      Key = "C" + col;
    }
    else {
      return (false);
    }
    if ( this._cssRuleTracking[Key] == null ) {
      return (false);
    }
    return (true);
  },

  setRowStyle: function ( row, name, value ) {
    var Key = "R" + row, id;
    if ( this._cssRuleTracking[Key] == null ) {
      //if the style does not exist and has not been set before then ignore it
      if (value == undefined || value === '') {return;}
      var parentId = this.parent().CSSTableId();
      var CSSKey = 'div.uki-dataTable' + parentId + ' tr.uki-dataTable-row-' + row;
      id = this.addCSSRule( CSSKey, name, value );
      this._cssRuleTracking[Key] = id;
    } else {
      if (value == undefined || value === '') {
        this.deleteStyle(Key, name);
      } else {
        id = this._cssRuleTracking[Key];
        this.updateCSSRules( id, name, value );
      }
    }
  },

  setRowColStyle: function ( row, col, name, value ) {
    var Key = "RC" + row + "-" + col, id;

    if ( this._cssRuleTracking[Key] == null ) {
      //if the style does not exist and has not been set before then ignore it
      if (value == undefined || value === '') {return;}
      var parentId = this.parent().CSSTableId();
      var CSSKey = 'div.uki-dataTable' + parentId + ' tr.uki-dataTable-row-' + row + ' td.uki-dataTable-col-' + col;
      id = this.addCSSRule( CSSKey, name, value );
      this._cssRuleTracking[Key] = id;
    } else {
      if (value == undefined || value === '') {
        this.deleteStyle(Key, name);
      } else {
        id = this._cssRuleTracking[Key];
        this.updateCSSRules( id, name, value );
      }
    }
  },

  setColStyle: function ( col, name, value ) {
    var Key = "C" + col, id;

    if ( this._cssRuleTracking[Key] == null ) {
      //if the style does not exist and has not been set before then ignore it
      if (value == undefined || value === '') return;
      var parentId = this.parent().CSSTableId();
      var CSSKey = 'div.uki-dataTable' + parentId + ' td.uki-dataTable-col-' + col;
      id = this.addCSSRule( CSSKey,name, value );
      this._cssRuleTracking[Key] = id;
    } else {
      if (value == undefined || value === '') {
        this.deleteStyle(Key, name);
      } else {
        id = this._cssRuleTracking[Key];
        this.updateCSSRules( id, name, value );
      }
    }
  },

  setStyle: function ( styleName, name, value ) {
    var id;
    if ( this._cssRuleTracking[styleName] == null ) {
      //if the style does not exist and has not been set before then ignore it
      if (value == undefined || value === '') return;
      var parentId = this.parent().CSSTableId();
      var prefix = styleName.indexOf('.') > -1 ? '' : 'div.';
      var CSSKey = 'div.uki-dataTable' + parentId + ' ' + prefix + styleName;
      id = this.addCSSRule( CSSKey, name, value );
      this._cssRuleTracking[styleName] = id;
    } else {
      if (value == undefined || value === '') {
        this.deleteStyle(styleName, name);
      } else {
        id = this._cssRuleTracking[styleName];
        this.updateCSSRules( id, name, value );
      }
    }
  },

  getColStyle: function ( col, name) {
    var Key = "C" + col, id;
    id = this.getStyleId(Key);

    var theRule = this.getCSSRule(id);
    if (theRule) {
      if (theRule.style.getPropertyValue) {
        return theRule.style.getPropertyValue(name);
      } else {
        return theRule.style[name];
      }
    }
  },

  getColStyleId: function ( col) {
    var Key = "C" + col, id;
    return this.getStyleId(Key);
  },

  getStyleId: function (styleName) {
    return this._cssRuleTracking[styleName];
  },

  getCSSRule: function (id) {
    if (!id) return;
    if ( this._styleSheet.cssRules ) {
      var rules = this._styleSheet.cssRules;
    } else {
      var rules = this._styleSheet.rules;
    }
    return rules && rules[id];
  },

  getStyle: function (styleName, name) {
    var id = this.getStyleId(styleName);
    var theRule = this.getCSSRule(id);
    if (theRule && theRule.style.getPropertyValue) {
      var ret = theRule.style.getPropertyValue(name);
    } else {
      var ret = theRule.style[name];
    }
    return ret;
  },

  deleteStyle: function (styleName, name) {
    var theRule = this.getCSSRule(this.getStyleId(styleName));
    if (theRule && theRule.style.removeProperty) {
      theRule.style.removeProperty(name);
    }
  },

  deleteAllCSSRules: function () {
    var count = 0;

    if ( this._styleSheet.cssRules ) {
      count = this._styleSheet.cssRules.length;
    } else {
      count = this._styleSheet.rules.length;
    }
    for ( var i = count - 1; i >= 0; i-- ) {
      dom.deleteCSSRule( this._styleSheet, i );
    }

    this._cssRuleTracking = {};

    if ( this._styleSheet.getInnerHTML ) {
      this._styleSheetElement.innerHTML = this._styleSheet.getInnerHTML();
    }
  },

  addCSSRule: function ( id, name, value ) {
    if (!name) name = 'display';
    if (value == undefined) value = '';
    var index = (dom.addCSSRule( this._styleSheet, id, name + ':' + value + ';' ));
    if ( this._styleSheet.getInnerHTML ) {
      this._styleSheetElement.innerHTML = this._styleSheet.getInnerHTML();
      this._styleSheet = this._styleSheetElement.sheet || this._styleSheet;
    }
    return index;
  },

  updateCSSRules: function ( id, name, value ) {
    var theRule = this.getCSSRule(id);
    if (!theRule) return;
    //Check the previous value and see if it needs to be set
    if (theRule.style.getPropertyValue) {
      var prevVal = theRule.style.getPropertyValue(name);
    } else {
      var prevVal = theRule.style[name];
    }

    if (prevVal !== value) {
      if ( theRule.style.setProperty ) {
        theRule.style.setProperty( name, value, null );
      } else {
        theRule.style[name] = value;
      }

      if ( this._styleSheet.getInnerHTML ) {
        this._styleSheetElement.innerHTML = this._styleSheet.getInnerHTML();
        this._styleSheet = this._styleSheetElement.sheet || this._styleSheet;
      }
    }
  },

  forceUpdateCSSRules: function ( id, name, value ) {
    var theRule = this.getCSSRule(id);
    if (!theRule) return;
    if ( theRule.style.setProperty ) {
      theRule.style.setProperty( name, value, null );
    } else {
      theRule.style[name] = value;
    }

    if ( this._styleSheet.getInnerHTML ) {
      this._styleSheetElement.innerHTML = this._styleSheet.getInnerHTML();
      this._styleSheet = this._styleSheetElement.sheet || this._styleSheet;
    }
  },

  totalWidth: function () {
    var tw = 0;
    if ( this._columns === null ) {
      return (0);
    }
    for ( var i = 0; i < this._columns.length; i++ ) {
      tw += ((this._columns[i].visible() && !this._columns[i]._isColumnMoving) ? this._columns[i].width() : 0);
    }
    return tw;
  },
  _orderedColumnList: [],
  getOrderedColumnList: function () {
    if (this._orderedColumnList.length) {
      return this._orderedColumnList;
    }
    var cols = this.columns();
    var orderedList = [];
    for (var i = 0, count = cols.length; i < count; ++i) {
      var col = cols[i];
      var newObj = {index:col._pos, actualPos:(col._aPos || col._pos), name:col._name}
      orderedList.push(newObj);
    }
    orderedList.sort(function (colA, colB) {
      if (colA.actualPos < colB.actualPos) return -1;
      if (colA.actualPos > colB.actualPos) return 1;
      return 0;
    } );
    for (var i = 0, count = orderedList.length; i < count; ++i) {
      orderedList[i].actualPos = i;
      cols[orderedList[i].index]._aPos = i;
    }
    this._orderedColumnList = orderedList;

    return orderedList;
  },
  _resizePinnedColumn: function (event) {
    var change = event.curWidth - event.prevWidth;
    this._leftPinnedColumns[event.index].width = this.columns()[event.index]._dom.offsetWidth;
    this._setupPinnedColumn(event.index, change, true);
  },

  //pinnedValue can be false, true (sequence will be assumed as 1) or a sequence number (1 based) if there are multiple columns pinned
  pinColumn: function (index, pinnedValue) {
    if (index == undefined) return;
    if (pinnedValue === false || this._leftPinnedColumns[index] !== undefined) {
      if (this._leftPinnedColumns[index] == undefined) return; // it was never actually pinned so return
      var colName = this._leftPinnedColumns[index].name;
      var colSeq = this._leftPinnedColumns[index].sequence;
      this._setupPinnedColumn(index);
      //delete this._leftPinnedColumns[index];
      this.columns()[index]._pinned = false;
      var pinned = false;
    } else if (pinnedValue || this._leftPinnedColumns[index] === undefined){
      var col = this.columns()[index];
      var colWidth = col._dom.offsetWidth;
      var colName = col.name();
      this._leftPinnedColumns[index] = {width:colWidth, index:index, name:colName};
      this._leftPinnedColumns[index].sequence = (pinnedValue !== true && pinnedValue != undefined) ? pinnedValue : Object.keys(this._leftPinnedColumns).length;
      var colSeq = this._leftPinnedColumns[index].sequence;
      this._setupPinnedColumn(index, null, true);
      this.columns()[index]._pinned = colSeq;
      var pinned = true;
    }
    try {
      this.trigger( {
        type: "columnPinned",
        name: colName,
        pinned: pinned,
        index: index,
        sequence: colSeq,
        allPinnedColumns: this._leftPinnedColumns
      }  );
      this.trigger ( { type:'recalcTableSize'});
    } catch (err) {};

  },
  getTotalPinnedWidth: function () {
    var totalPinnedWidth = 0;
    var cols = this.columns();
    for (var i in this._leftPinnedColumns) {
      if (!this._leftPinnedColumns.hasOwnProperty(i)) continue;
      totalPinnedWidth += cols[this._leftPinnedColumns[i].index]._dom.offsetWidth;
    };
    return totalPinnedWidth;
  },

  getTotalUnpinnedWidth: function () {
    var cols = this.columns();
    if (!cols) return 0;
    var totalWidth = 0;
    for (var i = 0, count = cols.length; i < count; ++i) {
      if (this._leftPinnedColumns[i]) continue;
      var col = cols[i];
      if (col._isColumnMoving) continue;
      totalWidth += col._dom && col._dom.offsetWidth;
    }
    return totalWidth;
  },
  _setupPinnedColumn: function (index, widthChange, pinned) {
    if (!this._leftPinnedColumns[index]) return;
    this.setColStyle(index, 'z-index', pinned ? 1 : 0);
    this.setColStyle(index, 'position', pinned ? 'absolute' : 'initial');
    this.setStyle('div.uki-dataTable-header-container td.uki-dataTable-col-' + index, 'background-color', pinned ? 'lightgray' : 'initial');
    this.setStyle('div.uki-dataTable-footer-container td.uki-dataTable-col-' + index, 'background-color', pinned ? '#EFEFEF' : 'initial');
    if (!pinned) {
      this.deleteStyle('div.uki-dataTable-header-container td.uki-dataTable-col-' + index, 'left');
      this.deleteStyle('div.uki-dataTable-footer-container td.uki-dataTable-col-' + index, 'left');
      this.deleteStyle('div.uki-dataList td.uki-dataTable-col-' + index, 'left');
    }
    //var colWidth = this._leftPinnedColumns[index].width;
    var pinnedCount = Object.keys(this._leftPinnedColumns).length;
    if (!pinned) --pinnedCount;
    var allSeq = {};
    var highestSeq = 0;
    var totalWidth = 0;
    var orderedList = {};
    var deletedSeq = this._leftPinnedColumns[index].sequence;
    for (var i in this._leftPinnedColumns) {
      if (!this._leftPinnedColumns.hasOwnProperty(i)) continue;
      var seq = this._leftPinnedColumns[i].sequence;
      if (allSeq[seq]) { //This is a duplicate
        seq++;
        this._leftPinnedColumns[i].sequence = seq;
      }
      allSeq[seq] = this._leftPinnedColumns[i].index;
      if (highestSeq < seq) highestSeq = seq;
      if (!pinned) {
        if (this._leftPinnedColumns[i].sequence == deletedSeq) continue;
        if (this._leftPinnedColumns[i].sequence > deletedSeq) this._leftPinnedColumns[i].sequence--;
      }
      totalWidth += this._leftPinnedColumns[i].width;
      orderedList[this._leftPinnedColumns[i].sequence] = {width:this._leftPinnedColumns[i].width, index:this._leftPinnedColumns[i].index};
    }

    //Do a fixup if there are some holes in the sequence
    var gaps = 0;
    for (var i = 1; i <= highestSeq; ++i) {
      if (!orderedList[i]) {
        //We have a gap;
        for (var next = i; next <= highestSeq; ++next) {
          if (orderedList[next]) {
            this._leftPinnedColumns[orderedList[next].index].sequence = i;
            orderedList[i] = orderedList[next];
            delete orderedList[next];
            ++gaps;
            break;
          }
        }
      }
    }
    highestSeq -= gaps;
    var offset = 0;
    for (var i = highestSeq; i > 0; --i) {
      if (!orderedList[i]) continue;
      offset += orderedList[i].width;
      this._leftPinnedColumns[orderedList[i].index].offset = offset;
      this.setStyle('div.uki-dataList td.uki-dataTable-col-' + orderedList[i].index, 'left', '-' + offset + 'px');
    }
    var leftOffset = 0;
    for (var i = 1; i <= highestSeq; ++i) {
      if (!orderedList[i]) continue;
      this.setStyle('div.uki-dataTable-header-container td.uki-dataTable-col-' + orderedList[i].index, 'left', (leftOffset) + 'px');
      this.setStyle('div.uki-dataTable-footer-container td.uki-dataTable-col-' + orderedList[i].index, 'left', (leftOffset) + 'px');
      leftOffset += orderedList[i].width;
    }

    if (!pinned) delete this._leftPinnedColumns[index];
    var pinnedWidth = this.getTotalPinnedWidth();
    var scrolledLeft = this._parent._scrollContainer.scrollLeft();
    this._parent._footer._table.style.marginLeft = this._parent._header._table.style.marginLeft = (pinnedWidth - scrolledLeft) + "px";
    this.setStyle('uki-dataList-pack', 'margin-left', (pinnedWidth ) + 'px');
  },

  _click: function ( e ) {

    if ( this._draggableColumn != -1 || this._initialPosition != undefined) {
      return;
    }
    e.isDefaultPrevented = fun.FF;

    if ( e.target.nodeName === "INPUT" ) {
      return;
    }
    if ( e.target && dom.hasClass( e.target, "uki-dataTable-resizer" ) ) {
      return;
    }

    if ( this._parent.isEditing() ) {
      return;
    }

    // Get Column #
    var target = e.target;
    if ( target === null ) {
      return;
    }
    // Verify this is a Header "CELL" (i.e. a clickable element)
    if ( target && dom.hasClass(target, "uki-dataTable-header-text" ) ) {
      var index = target.className.match( /uki-dataTable-header-text-col-(\d+)/ )[1];
      var col = this.columns();
      if (col[index]._hasMoved) return;
      var sortedlist = '';

      if ( e.altKey ) {
        this.pinColumn(index);
      } else {

        if ( this._sortable && col[index].sortable() !== false ) {
          // Handle Sorting
          if ( !e.shiftKey ) {
            for ( var i = 0; i < col.length; i++ ) {
              if ( i == index ) {
                continue;
              }
              if ( col[i].sort() != 0 && col[i].sortable() !== false ) {
                col[i].sort( 0 );
              }
            }
          }

          col[index].sort( col[index].sort() + 1 );

          var sortfields = [];
          sortedlist = '';
          for ( i = 0; i < col.length; i++ ) {
            if ( col[i].sort() > 0 ) {
              sortfields.push( {name: col[i].name(), direction: col[i].sort(), clickTime: col[i].getLastClicked()} );
              sortedlist += col[i].sort() + ",";
            } else {
              sortedlist += "0,";
            }
          }
        }

        // remove last ","
        if ( sortedlist.length > 0 ) {
          sortedlist = sortedlist.substring( 0, sortedlist.length - 1 );
        }

        this.trigger( {
          type: "columnClick",
          column: this.columns()[index],
          sort: sortfields,
          sortedlist: sortedlist,
          columnIndex: index
        } );
      }
    } else if (target && dom.hasClass(target, 'uki-dataTable-pin')) {
      var index = target.className.match( /uki-dataTable-pin-col-(\d+)/ )[1];
      var col = this.columns()[index];
      if (!dom.hasClass(target, 'uki-dataTable-pinned')) {
        dom.removeClass(target, 'uki-dataTable-unpinned');
        dom.addClass(target, 'uki-dataTable-pinned');
      } else {
        dom.removeClass(target, 'uki-dataTable-pinned');
        if (typeof window.ontouchstart !== 'undefined') {
          dom.addClass(target, 'uki-dataTable-unpinned');
        }
      }
      this.pinColumn(index);
    }
  },

  _filter: function ( e ) {
    var self = e.target.self;
    self._handleFilterNotify();
  },

  _skipFilterNotify: false,
  _handleFilterNotify: function () {
    if ( this._skipFilterNotify === true ) {
      return;
    }
    if ( this._columns == null || this._columns.length == 0 ) {
      return;
    }
    if ( this._parent.isEditing() ) {
      this._parent.stopEditInPlace();
    }

    var values = {};
    var valueid = [];
    var count = 0;

    for ( var i = 0; i < this._columns.length; i++ ) {
      var fieldvalue = this._columns[i].filterValue();
      values[this._columns[i].name()] = fieldvalue;
      valueid[i] = fieldvalue;
      if (fieldvalue.length > 0) { count++; }
    }
    this._filteredColumnCount = count;
    try {
      this.trigger( {
        type: "columnFilter",
        fields: values,
        byfieldid: valueid,
        filteredCount: count
      } );
    }
    catch( err ) {
    }
  },

  _filterpresstimeout: function ( target ) {
    this._clearfilterInterval();
    this._enterFiltered = false;
    var hasFocus = false;
    if ( document.activeElement && document.activeElement == target ) {
      hasFocus = true;
    }
    target.blur();
    if ( hasFocus ) {
      target.focus();
    }
  },
  _clearfilterInterval: function () {
    if ( this._intervalId ) {
      clearTimeout( this._intervalId );
      this._intervalId = null;
    }
  },
  _filterpress: function ( e ) {
    if ( e.charCode == 0 ) {
      return;
    }

    var self = e.target.self;
    // We handle normal keys here, Chome doesn't pass "special" keys to onkeypress event
    var myTarget = e.target;
    self._enterFiltered = true;
    self._clearfilterInterval();
    self._intervalId = setTimeout(
      (function ( self, target ) {
        return function () {
          self._clearfilterInterval();
          self._filterpresstimeout( target );
        }
      })( self, myTarget ),
      self._filterTimeout );
  },
  _filterkeydown: function ( e ) {
    // We handle "special" keys here because of Chrome doesn't pass them to onkeypress
    if ( e.charCode != 0 ) {
      return;
    }
    var self = e.target.self;
    var myTarget = e.target;

    //console.log("KeyCode: ", e);

    if ( e.keyCode == 13 ) {
      if ( self._enterFiltered ) {
        self._clearfilterInterval();
        self._filterpresstimeout( myTarget );
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;
      }
    }
    // Tab Key
    else if ( e.keyCode == 9 ) {
      self._clearfilterInterval();
    }
    // Delete / Backspace key
    else if ( e.keyCode == 8 || e.keyCode == 46 ) {
      self._clearfilterInterval();
      self._intervalId = setTimeout(
        (function ( self, target ) {
          return function () {
            self._clearfilterInterval();
            self._filterpresstimeout( target );
          }
        })( self, myTarget ),
        self._filterTimeout );
    }
    else if ( e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 33 || e.keyCode == 34 || e.keyCode == 35 ||
      e.keyCode == 36 ) {
      // this "grid" variable is the _list element not the actual "Grid"
      var grid = self.parent().childViews()[1].childViews()[0];
      var data = grid.data();
      var maxrows = 0;
      if ( data != null ) {
        maxrows = data.length;
      }
      var range = grid._visibleRange();
      if ( range === null ) {
        return;
      } // No valid range yet
      var size = grid.metrics()._rowHeight;
      var vrows = 1;
      if ( size > 0 ) {
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
      else if ( e.keyCode == 34 ) {
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

      if ( idx >= maxrows ) {
        idx = maxrows - 1;
      }
      if ( idx < 0 ) {
        idx = 0;
      }
      if ( idx != oldIdx ) {
        grid.selectedIndex( idx );
        grid.scrollToIndex( idx );
        // This triggers the selection event.
        grid.triggerSelection();
      }
    }
  },

  _copyColumns: function () {
    var newCols = [];
    var cols = this.columns();
    var keysToDrop = { '_labelElement':1, '_resizer':1, '_pin':1, '_dom':1,
      '_eventNames':1, '_wrapper':1, '_lastClicked':1, '_parent':1,
      '_layoutBefore':1, '_viewIndex':1};

    for (var i = 0, count = cols.length; i < count; ++i) {
      var col = cols[i];
      if (typeof col != 'object') continue;
      var colKeys = Object.keys(col);
      var newCol = {};
      for (var j = 0, jCount = colKeys.length; j < jCount; ++j) {
        var key = colKeys[j];
        if (keysToDrop[key] || key.substr(0,2) == '__') continue;
        var newKey = key;
        if (newKey.substr(0,1) == '_') newKey = newKey.substr(1);
        newCol[newKey] = col[key];
      }
      if (!Object.keys(newCol).length) return;
      newCol.oPos = newCol.oPos || newCol.pos;
      newCol.pos = newCol.aPos;
      delete newCol.aPos;
      newCol.filtervalue = col.filterValue();
      newCol.footervalue = col.footerValue();

      newCols.push(newCol);
    }
    newCols.sort(function(aCol, bCol) {
      if (aCol.pos < bCol.pos) return -1;
      if (aCol.pos > bCol.pos) return 1;
      return 0;
    });
    return newCols;
  },

  _dragStart: function ( e ) {
    if ( (e.target.tagName && e.target.tagName == "INPUT") ) {
      e.isDefaultPrevented = fun.FT;
      return;
    }
     var index;
     if ( e.target && dom.hasClass( e.target, 'uki-dataTable-resizer' ) ) {
       e.draggable = e.target;
       e.cursor = dom.computedStyle( e.target, null ).cursor;
       index = e.target.className.match( /uki-dataTable-resizer_pos-(\d+)/ )[1];
       this._draggableColumn = index;
       this._initialWidth = this.columns()[index].width();
     }
  },
  _drag: function ( e ) {
    var index;
    if (this._draggableColumn != -1) {
      var width = Math.max((this._initialWidth + (e.dragOffset != null ? e.dragOffset.x : e.clientX)), 10);
      this._resizeColumn( this._draggableColumn, width );
      try {
        this.trigger( {
          type: 'resizeColumn',
          column: this.columns()[this._draggableColumn]
        } );
      } catch( err ) { }
    }
    else if (this._showAdvancedLayoutCustomization && (this._initialPosition != undefined ||
        ((index = this._isTargetMovable(e.target)) != undefined && index != false &&
        this._draggableColumn == -1 && !this._leftPinnedColumns[index]))) {
      var x = e.movementSinceLastEvent && e.movementSinceLastEvent.x;
      if (x) {
        if (index == undefined) {
          index = this._initialPosition;
        } else {
          this._setupMovingColumn(index);
        }
        var options = {};
        options.scrolledLeft = this._parent._scrollContainer.scrollLeft();
        var hasPinnedColumns = false;
        if (this._leftPinnedColumns && Object.keys(this._leftPinnedColumns).length) {
          var curHeaderLeft = (parseInt(this.getStyle('div.uki-dataTable-header-container td.uki-dataTable-col-' + index, 'left')) || 0) + x;
          hasPinnedColumns = true;
        } else {
          var curHeaderLeft = this.columns()[index]._dom.offsetLeft + x;
        }
        options.hasPinnedColumns = hasPinnedColumns;
        options.colOffsetLeft = curHeaderLeft;
        if (x > 0) {
          this._startRightScrollIfNeeded(index, options);
        } else if (x < 0) {
          this._startLeftScrollIfNeeded(index, options);
        }

        //Set the indicator that shows where the column will be inserted if released
        this._setMovingMarker(index, options);
        //move the actual column
        if (!this._movingColumnCache) this._movingColumnCache = {};
        if (this._movingColumnCache.colStyleId == undefined) {
          this._movingColumnCache.colStyleId = this.getColStyleId(index);
        }
        var curColLeft = this.getColStyle(index, 'left') || 0;
        if (this._movingColumnCache.colStyleId != undefined) {
          this.forceUpdateCSSRules(this._movingColumnCache.colStyleId, 'left', (parseInt(curColLeft) + x) + 'px');
        } else {
          this.setColStyle(index, 'left', (parseInt(curColLeft) + x) + 'px');
        }
        if (hasPinnedColumns) {
          //Set the header left position
          if (this._movingColumnCache.headerColStyleId == undefined) {
            this._movingColumnCache.headerColStyleId = this.getStyleId('div.uki-dataTable-header-container td.uki-dataTable-col-' + index);
          }
          if (this._movingColumnCache.headerColStyleId) {
            this.forceUpdateCSSRules(this._movingColumnCache.headerColStyleId, 'left', curHeaderLeft + 'px');
          } else {
            this.setStyle('div.uki-dataTable-header-container td.uki-dataTable-col-' + index, 'left', curHeaderLeft + 'px');
          }
          //Set the footer left position
          if (this._movingColumnCache.footerColStyleId == undefined) {
            this._movingColumnCache.footerColStyleId = this.getStyleId('div.uki-dataTable-footer-container td.uki-dataTable-col-' + index);
          }
          if (this._movingColumnCache.footerColStyleId) {
            this.forceUpdateCSSRules(this._movingColumnCache.footerColStyleId, 'left', curHeaderLeft + 'px');
          } else {
            this.setStyle('div.uki-dataTable-footer-container td.uki-dataTable-col-' + index, 'left', curHeaderLeft + 'px');
          }
        }
      }
    }
  },
  _dragEnd: function ( e ) {
    if (this._draggableColumn != -1 ) {
      this._drag( e );
      try {
        this.trigger( {
          type: 'resizeColumnEnd',
          column: this.columns()[this._draggableColumn]
        } );
      } catch( err ) {}
    } else if (this._initialPosition != undefined) {
      //get an ordered array with the new column positions

      var index = parseInt(this._initialPosition);
      var orderedList = this.getOrderedColumnList()
      var cols = this.columns();
      for (var i = 0, count = orderedList.length; i < count; ++i) {
        if (orderedList[i].index == index) continue;
        var col = cols[orderedList[i].index];
        if (col._dom.style.borderLeftColor == this.movingMarkerColor ) {
          cols[index]._aPos = col._aPos - .1;
          this._turnOffLeftMovingColumnMarker(col);
        } else if (col._dom.style.borderRightColor == this.movingMarkerColor) {
          cols[index]._aPos = col._aPos + .1;
          this._turnOffRightMovingColumnMarker(col);
        }
      }
      this._orderedColumnList = [];
      orderedList = this.getOrderedColumnList();
      delete cols[index]._isColumnMoving;

      //Send off the info as soon as possible
      try {
        this.trigger( {
          type: 'columnsReordered',
          columnOrder: orderedList
        } );
      } catch( err ) {}
      var showAdvancedLayout = this._showAdvancedLayoutCustomization;
      delete this.packMarginLeftId;
      this._leftPinnedColumns = {};
      var newColumns = this._copyColumns();
      this._parent.columns(newColumns);
      this._parent._list.dataReload(this._parent._list._data);
      this._parent._handleScroll(this._parent._scrollContainer.scrollLeft());
      this.showAdvancedLayoutCustomization(showAdvancedLayout);
    }
    this._draggableColumn = -1;
    this._initialWidth = undefined;
    this._initialLeft = undefined;
    this._initialPosition = undefined;
    this._movingColumnCache = undefined;
  },

  _isTargetMovable: function (target) {
    if (!target) return false;
    if (dom.hasClass(target, 'uki-dataTable-cell_resizable')) return false;

    if (dom.hasClass( target, 'uki-dataTable-header-wrap' )) {
      return target.className.match( /uki-dataTable-header-wrap-col-(\d+)/ )[1];
    }
    if (dom.hasClass( target, 'uki-dataTable-header-text' )) {
      return target.className.match( /uki-dataTable-header-text-col-(\d+)/ )[1];
    }
    if (dom.hasClass( target, 'uki-dataTable-header-cell' )) {
      return target.className.match( /uki-dataTable-col-(\d+)/ )[1];
    }
    return false;
  },
  _startLeftScrollIfNeeded: function (index, options) {
    var scrolledLeft = (options && options.scrolledLeft) || this._parent._scrollContainer.scrollLeft();
    if (scrolledLeft == 0) return;
    if (!this._movingColumnCache) {
      this._movingColumnCache = {};
    }
    var cache = this._movingColumnCache;
    if (cache.totalPinnedWidth == undefined) cache.totalPinnedWidth = this.getTotalPinnedWidth();
    //We know there is room to scroll left so let's see how close we are
    var colOffsetLeft = (options && options.colOffsetLeft) || this.columns()[index]._dom.offsetLeft;
    var distance = (colOffsetLeft - 30);
    if (distance < cache.totalPinnedWidth) {
      this._parent._scrollContainer.scrollLeft(scrolledLeft - 4);
      setTimeout(uki.bind(function() {this._startLeftScrollIfNeeded(index)}, this), 100);
    }
  },

  _startRightScrollIfNeeded: function (index, options) {

    if (!this._movingColumnCache) {
      this._movingColumnCache = {};
    }
    var cache = this._movingColumnCache;
    if (!cache.scrollWidth) cache.scrollWidth = this._dom.scrollWidth;
    if (!cache.clientWidth) cache.clientWidth = this._dom.offsetWidth;
    if (cache.scrollWidth <= cache.clientWidth) return;

    var scrolledLeft = (options && options.scrolledLeft) || this._parent._scrollContainer.scrollLeft();
    if (scrolledLeft + cache.clientWidth >= cache.scrollWidth) return;
    //We know there is room to scroll right so let's see how close we are
    if (!cache.columnWidth) cache.columnWidth = this.columns()[index]._dom.offsetWidth;
    var colOffsetLeft = (options && options.colOffsetLeft) || this.columns()[index]._dom.offsetLeft;
    var distance = cache.clientWidth - (colOffsetLeft + cache.columnWidth + 30);
    if (distance < 0) {
      this._parent._scrollContainer.scrollLeft(scrolledLeft + 4);

      setTimeout(uki.bind(function() {this._startRightScrollIfNeeded(index)}, this), 100);
    }
  },

  _setupMovingColumn: function (index, options) {
    this.columns()[index]._isColumnMoving = true;
    this._initialPosition = index;
    this._initialLeft = this.columns()[index]._dom.offsetLeft - this._parent._scrollContainer.scrollLeft();

    this.setColStyle(index, 'z-index', '2');
    this.setColStyle(index, 'background-color', 'lightgray');
    this.setColStyle(index, 'opacity', '.6');
    this.setColStyle(index, 'position', 'absolute');
    this.setColStyle(index, 'left', this._initialLeft + 'px');
    var pinnedWidth = this.getTotalPinnedWidth();
    if (pinnedWidth) {
      var leftOffset = (pinnedWidth + this._initialLeft) + 'px';
      this.setStyle('div.uki-dataTable-header-container td.uki-dataTable-col-' + index, 'left', leftOffset);
      this.setStyle('div.uki-dataTable-footer-container td.uki-dataTable-col-' + index, 'left', leftOffset);
    }
    this.trigger({type:'recalcTableSize'});
  },

  movingMarkerColor: 'gray',

  _setMovingMarker: function (index, options) {
    var cols = this.columns();

    //Utilize cached info if available, if not, cache it
    if (!this._movingColumnCache) {
      this._movingColumnCache = {};
    }
    var cache = this._movingColumnCache;
    if (!cache.columnWidth) cache.columnWidth = cols[index]._dom.offsetWidth;
    if (!cache.totalWidth) cache.totalWidth = this.totalWidth();
    if (!cache.visibleOrderedList) {
      var orderedList = this.getOrderedColumnList();
      var visibleOrderedList = [];
      for (var i = 0, count = orderedList.length; i < count; ++i) {
        var oIndex = orderedList[i].index;
        if (index == oIndex || !cols[oIndex]._visible || this._leftPinnedColumns[oIndex]) continue;
        visibleOrderedList.push(orderedList[i]);
      }
      cache.visibleOrderedList = visibleOrderedList;
    }
    if (cache.totalPinnedWidth == undefined) cache.totalPinnedWidth = this.getTotalPinnedWidth();
    //loop through the visible fields and figure out which one is the closest to the movable column
    var scrolledLeft = (options && options.scrolledLeft) || this._parent._scrollContainer.scrollLeft();
    var colOffsetLeft = (options && options.colOffsetLeft) || cols[index]._dom.offsetLeft;
    var actualOffset = scrolledLeft + colOffsetLeft;
    var closestResizer = {distance:undefined};
    var blueBorder;
    var lastVisibleIndex;

    for (var i = 0, count = cache.visibleOrderedList.length; i< count; ++i) {
      var oIndex = cache.visibleOrderedList[i].index;
      var col = cols[oIndex];
      if (col._dom.style.borderLeftColor == this.movingMarkerColor) blueBorder = oIndex;
      var left = (parseInt(col._dom.offsetLeft) || 0) + cache.totalPinnedWidth;
      var difference = Math.abs((actualOffset + (cache.columnWidth/2)) - (left));
      if (closestResizer.distance == undefined || difference < closestResizer.distance) {
        closestResizer = {index:oIndex, distance:difference};
      }
      lastVisibleIndex = oIndex;
    };
    if (cols[lastVisibleIndex]._dom.style.borderRightColor == this.movingMarkerColor) var rightBlueBorder = lastVisibleIndex;

    if (Math.abs(actualOffset - cache.totalWidth) < closestResizer.distance || colOffsetLeft > cache.totalWidth) {
      var lastCol = cols[lastVisibleIndex];
      if (lastCol._dom.style.borderRightColor != this.movingMarkerColor) {
        if (blueBorder) this._turnOffLeftMovingColumnMarker(cols[blueBorder])
        if (rightBlueBorder) this._turnOffRightMovingColumnMarker(cols[rightBlueBorder]);
        this._turnOnRightMovingColumnMarker(lastCol);
      } else {
        this._turnOnRightMovingColumnMarker(cols[lastVisibleIndex]);
      }
    } else if (blueBorder !== closestResizer.index) {
      this._turnOnLeftMovingColumnMarker(cols[closestResizer.index]);
      if (blueBorder) this._turnOffLeftMovingColumnMarker(cols[blueBorder]);
      if (rightBlueBorder) this._turnOffRightMovingColumnMarker(cols[rightBlueBorder]);
    }
  },

  _turnOffLeftMovingColumnMarker: function (col) {
    col._dom.style.borderLeft = '';
  },
  _turnOnLeftMovingColumnMarker: function (col) {
    col._dom.style.borderLeft = '4px solid ' + this.movingMarkerColor;
  },
  _turnOffRightMovingColumnMarker: function (col) {
    col._dom.style.borderRightColor = 'rgb(204, 204,204)';
    col._dom.style.borderRightWidth = '1px';
  },
  _turnOnRightMovingColumnMarker: function (col) {
    col._dom.style.borderRightColor = this.movingMarkerColor;
    col._dom.style.borderRightWidth = '4px';
  },

  _resizeColumn: function ( pos, width ) {
    var column = this.columns()[pos];
    var prevWidth = column.width();
    column.width( width );
    var newWidth = column.width();
    if (prevWidth !== newWidth) {
      try {
        this.trigger( { type: 'recalcTableSize' } );
        if (this._leftPinnedColumns[column._pos]) {
          this.trigger( {type: 'resizedColumn', prevWidth: prevWidth, curWidth: newWidth, index:column._pos});
        }
      } catch( err ) { }
    }
  },

  _appendChildToDom: function ( child ) {
    this._rowheader.appendChild( child.dom() );
  },

  columns: fun.newProp( 'columns', function ( cols ) {
    var self = this;
    if ( arguments.length ) {
      this._clearfilterInterval();
      this.deleteAllCSSRules();
      this._menu && this._menu.remove();

      //var parentId = this.parent().CSSTableId();

      // Destroy old Columns
      if ( this._columns && this._columns.length ) {
        for ( var i = 0; i < this._columns.length; i++ ) {
          this._columns[i].destruct();
          this._columns[i] = null;
        }
      }

      for ( var i = 0; i < cols.length; i++ ) {
        var col = cols[i];
        col.view = 'DataTableHeaderColumn';
        col.init = {pos: cols[i].pos, filterable: this._filterable, initfocus: cols[i].initfocus};
        col.on = col.on || {};
        col.on.built = function() {
          var parent = self;

          // Visibility
          if ( !this._visible ) {
            parent.setColStyle(this._pos, 'display', 'none');
          }

          // Width
          parent.setColStyle(this._pos, 'width', this._width + 'px');

          // Pin
          var pinned = this.pinned && this.pinned();
          if (pinned && this._pin) {
            parent.pinColumn(this._pos, pinned);
            dom.addClass(this._pin, 'uki-dataTable-pinned');
            dom.removeClass(this._pin, 'uki-dataTable-unpinned');
          }

          // Handle any custom styles
          if (!this._style) {
            if ( typeof this._style === "object" ) {
              for ( var key in this._style ) {
                if ( !this._style.hasOwnProperty( key ) ) {
                  continue;
                }
                parent.setColStyle( this._pos, key, this._style[key]);
              }
            } else {
              var exp = this._style.split( ';' );
              for ( var i = 0; i < exp.length; i++ ) {
                var parts = exp[i].split( ':' );
                if ( parts[0].length === 0 || parts.length !== 2 ) {
                  continue;
                }
                parent.setColStyle( this._pos, parts[0], parts[1] );
              }
            }
          }
        };
      }
      this._childViews = [];

      this._columns = build( cols );
      this._columns.appendTo( this );
      this.showAdvancedLayoutCustomization(this._showAdvancedLayoutCustomization);
      this._table.style.width = this.totalWidth() + "px";
      this._setupFilters();
      if ( this._hasMenu ) {
        this._setupMenu();
      }
      this.trigger( { type: 'render' } );
    }
    return this._columns;
  } ),

  columnByName: function ( name ) {
    var id = this.columnIdByName( name );
    if ( id != null ) {
      return (this._columns[id]);
    }
    if ( arguments.length == 2 ) {
      return this.columnByLabel( name );
    }
    return (null);
  },

  columnByLabel: function ( name ) {
    var id = this.columnIdByLabel( name );
    if ( id != null ) {
      return (this._columns[id]);
    }
    if ( arguments.length == 2 ) {
      return this.columnByName( name );
    }
    return (null);
  },

  columnIdByName: function ( name ) {
    var lname = name.toLowerCase();
    for ( var i = 0; i < this._columns.length; i++ ) {
      if ( this._columns[i]._name.toLowerCase() == lname ) {
        return (i);
      }
    }
    if ( arguments.length == 2 ) {
      return this.columnIdByLabel( name );
    }
    return (null);
  },

  columnIdByLabel: function ( name ) {
    var lname = name.toLowerCase();
    for ( var i = 0; i < this._columns.length; i++ ) {
      if ( this._columns[i]._label.toLowerCase() == lname ) {
        return (i);
      }
    }
    if ( arguments.length == 2 ) {
      return this.columnIdByName( name );
    }
    return (null);
  },

  _setupFilters: function () {
    var eles = this._dom.getElementsByClassName( "uki-dataTable-filter" );
    for ( var i = 0; i < eles.length; i++ ) {
      eles[i].self = this;
      evt.addListener( eles[i], "change", this._filter );
      evt.addListener( eles[i], "keypress", this._filterpress );
      evt.addListener( eles[i], "keydown", this._filterkeydown );
    }
  },

  hasFocus: function () {
    if ( !this._filterable || this._columns == null ) {
      return (false);
    }
    for ( var i = 0; i < this._columns.length; i++ ) {
      if ( this._columns[i].hasFocus() ) {
        return (true);
      }
    }
    return (false);
  },

  focus: function () {
    if ( !this._filterable || this._columns == null ) {
      return;
    }
    for ( var i = 0; i < this._columns.length; i++ ) {
      if ( this._columns[i].visible() && this._columns[i].filterable() ) {
        this._columns[i].focus();
        return;
      }
    }
  },

  blur: function () {
    if ( !this._filterable || this._columns == null ) {
      return;
    }
    for ( var i = 0; i < this._columns.length; i++ ) {
      this._columns.blur();
    }
  },

  clearFilters: function () {
    if ( this._columns == null ) {
      return;
    }
    this._skipFilterNotify = true;

    for ( var i = 0; i < this._columns.length; i++ ) {
      this._columns[i].filterValue( "" );
    }

    this._skipFilterNotify = false;
    this._handleFilterNotify();
  }

} );


var DataTableList = view.newClass( 'DataTableList', DataList, {

  _setup: function ( initArgs ) {
    initArgs.packView = initArgs.packView || Pack;
    DataList.prototype._setup.call( this, initArgs );
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
  columns: fun.newProp( 'columns' ),
  _columns: [],

  _template: requireText( 'dataTable/pack.html' ),

  _createDom: function ( initArgs ) {
    DataList.prototype._createDom.call( this, initArgs );
    this.addClass( 'uki-dataTable-list' );
    this._placeholder = dom.createElement( 'div', {class: 'uki-dataList-placeholder'} );
    this._placeholder.innerHTML = '&nbsp'; // The width property won't take w/o contents... haha
    this._dom.appendChild( this._placeholder );
  },

  destruct: function () {
    DataList.prototype.destruct.call( this );
    this._placeholder = null;
  },

  _updateColumnSize: function ( pos ) {
    var column = this.columns()[pos];
    utils.forEach( this.childViews(), function ( pack ) {
      pack.resizeColumn( pos, column.width );
    }, this );
  },

  renderingRows: function () {
    "use strict";
    var range = DataList.prototype._renderingRange.call( this );
    if ( !range ) {
      return {from: 0, to: 1};
    }
    var rowsRange = this.metrics().rowsForRange( range );
    return rowsRange;

  },

  _renderPack: function ( pack, range, rows ) {
    var pack = DataList.prototype._renderPack.call( this, pack, range, rows );

    // Needs to get the header for the "proper" size of the placeholder.
    //var headerTable = this._parent._parent._childViews[0]._table;
    //this._placeholder.style.width = headerTable.offsetWidth + 'px';

    return pack;
  }
} );

var table = {
  totalWidth: function ( columns ) {
    return utils.reduce( columns, function ( s, col ) {
      return s + (col.visible ? (col.width || 200) : 0);
    }, 0 );
  },

  addColumnDefaults: function ( columns ) {
    return columns.map( function ( col, pos ) {
      col = utils.extend( {
        pos: pos,
        width: 200,
        name: '',
        className: '',
        visible: true,
        sort: 0,
        formatter: dom.escapeHTML
      }, col );
      col.minWidth = Math.min( col.minWidth || 20, col.width );
      if ( col.maxWidth > 0 ) {
        col.maxWidth = Math.max( col.maxWidth, col.width );
      }
      return col;
    } );
  }
};

exports.DataTable = DataTable;
exports.DataTableList = DataTableList;
exports.DataTableAdvancedHeader = DataTableAdvancedHeader;
//exports.DataTableTemplateHeader = DataTableTemplateHeader;
exports.DataTableFooter = DataTableFooter;
exports.table = table;
exports.DataTableHeaderColumn = DataTableHeaderColumn;
