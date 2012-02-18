requireCss('./dataTable/dataTable.css');

var fun   = require('../../uki-core/function'),
    utils = require('../../uki-core/utils'),
    dom   = require('../../uki-core/dom'),
    view  = require('../../uki-core/view'),
    build = require('../../uki-core/builder').build,

    Pack      = require('./dataTable/pack').Pack,
    DataList  = require('./dataList').DataList,
    Mustache  = require('../../uki-core/mustache').Mustache,
    Base      = require('../../uki-core/view/base').Base,
    Container = require('../../uki-core/view/container').Container,
    Focusable = require('./focusable').Focusable;
    evt       = require('../../uki-core/event');


var DataTable = view.newClass('DataTable', Container, {
    columns: function(cols) {
        if (!arguments.length) {
            return this._list.columns();
        }
        cols = table.addColumnDefaults(cols);
        this._list.columns(cols);
        this._header.columns(cols);
        return this;
    },

    header: function() {
      return this._header;
    },

    columnWidths: function(v) {
        if (!arguments.length) {
            return utils.pluck(this.columns(), 'width');
        }
        this.columns().forEach(function(col, i) {
            if (v[i]) { col.width = v[i]; }
        }, this);
        this._header.columns(this.columns());
        return this;
    },

    list: function() {
        return this._list;
    },

    _createDom: function(initArgs) {
        this._dom = dom.createElement('div', {className: 'uki-dataTable'});

        var c = build([

            { view: initArgs.headerView || DataTableHeader, as: 'header',
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
    },

    _initLayout: function() {
        this._updateHeaderHeight();
    },

    _scrollHeader: function(e) {
      var lastHeader = this._header.scrollLeft();
      var newHeader = this._container.scrollLeft();
      if (lastHeader != newHeader) {
        this._header.scrollLeft(newHeader);
      }
    },

    _scrollChild: function(e) {
      var lastHeader = this._container.scrollLeft();
      var newHeader = this._header.scrollLeft();
      if (lastHeader != newHeader) {
        this._container.scrollLeft(newHeader);
      }

    },

    _resizeColumn: function(e) {
        this._list._updateColumnSize(e.column.pos);
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

fun.delegateProp(DataTable.prototype, ['hasFilter', 'filterTimeout', 'sortable'], 'header');



var DataTableHeader = view.newClass('DataTableHeader', Base, {
    template: fun.newProp('template'),
    _template: requireText('dataTable/header.html'),
    hasFilter: fun.newProp('hasFilter'),
    _hasFilter: false,
    filterTimeout: fun.newProp('filterTimeout'),
    _filterTimeout: 1500,
    sortable: fun.newProp('sortable'),
    _sortable: false,
    _intervalId: null,

    _createDom: function(initArgs) {
        Base.prototype._createDom.call(this, initArgs);
        this._draggableColumn = -1;
        this.on('draggesturestart', this._dragStart);
        this.on('draggesture', this._drag);
        this.on('draggestureend', this._dragEnd);
        this.on('click', this._click);
    },

    scrollTo: function(offset) {
        this._dom.firstChild.style.marginLeft = -offset + 'px';
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
              sortfields[col[i].label] = col[i].sort;
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
      var self = e.target.self;
      if (e.keyCode == 13) {
         self._clearfilterInterval();
         self._filterpresstimeout(e);
         e.preventDefault();
         e.cancelBubble = true;
      }
      else if (e.keyCode == 9) {
        self._clearfilterInterval();
      }
      if (e.charCode == 0 && e.keyCode != 8) return;

      self._clearfilterInterval();
      self._intervalId = setInterval(
           (function(self, target) { return function() {
                self._clearfilterInterval();
                self._filterpresstimeout(target); } } )(self, e),
           self._filterTimeout);
    },

    _dragEnd: function(e) {
      this._drag(e);
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
        var filterable = this._hasFilter;
        if (filterable && col.filterable === false) filterable = false;
        return {
            pos: col.pos,
            label: col.label,
            style: (col.visible) ? "width:" + col.width + "px" : 'display: none',
            filter: 'filter'+col.label,
            filterstyle: filterable ? '' : 'display:none',
            className: col.className +
                (col.width != col.maxWidth || col.width != col.minWidth ?
                    ' uki-dataTable-header-cell_resizable' : ''),
            sortClass: (col.sort === 1 ? ' uki-dataTable-sort-down' : (col.sort === 2 ? ' uki-dataTable-sort-up' : ''))
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
                style: 'width:' + table.totalWidth(this.columns()) + 'px'
            });
        if (this._hasFilter) {
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
        //evt.addListener(eles[i],"blur", this._filter);
        evt.addListener(eles[i],"keypress", this._filterpress);
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
            pack.resizeColumn(column.visiblePos, column.width);
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
        var visiblePos = 0;
        return columns.map(function(col, pos) {
            col = utils.extend({
                visiblePos: visiblePos,
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
            if (col.visible) {
                visiblePos++;
            }
            return col;
        });
    }
};

exports.DataTable       = DataTable;
exports.DataTableList   = DataTableList;
exports.DataTableHeader = DataTableHeader;
exports.table           = table;
