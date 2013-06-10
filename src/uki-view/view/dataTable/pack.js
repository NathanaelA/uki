var fun   = require('../../../uki-core/function'),
    utils = require('../../../uki-core/utils'),
    dom   = require('../../../uki-core/dom'),

    Mustache = require('../../../uki-core/mustache').Mustache,
    Base     = require('../dataList/pack').Pack;


var Pack = fun.newClass(Base, {

    render: function(rows, selectedInPack, globalIndex) {
        this._dom.innerHTML = this._toHTML(rows, globalIndex);
        this._tbody = this._dom.getElementsByTagName('tbody')[0];
        this._restorePackSelection(selectedInPack || [], globalIndex);
    },

    updateRow: function(index, rows, globalIndex) {
        var tmp = dom.createElement('div', {
            html: this._toHTML(rows, globalIndex)
        });
        var item = this._rowAt(index);
        var replaceWith = tmp.getElementsByTagName('tbody')[0].childNodes[0];
        item.parentNode.replaceChild(replaceWith, item);
    },

    resizeColumn: function(visiblePos, width) {
        var tr = this._rowAt(0),
            td = tr && tr.childNodes[visiblePos];
        if (td) { td.style.width = width + 'px'; }
    },

    setSelected: function(position, state) {
        var row = this._rowAt(position);
        if (row) { dom.toggleClass(row, 'uki-dataTable-row_selected', state); }
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

        return Mustache.to_html(
            this.template(), { rows: formated }
        );
    },

    _createDom: function(initArgs) {
        this._dom = dom.createElement('div', {
            className: 'uki-dataList-pack'
        });
    },

    destruct: function() {
      Base.prototype.destruct.call(this);
      this._tbody = null;
    },

    _rowAt: function(pos) {
        return this._tbody && this._tbody.childNodes[pos];
    },

    _formatColumns: function(row, pos, parentGrid) {
        var cols = [];
        if (this.parent() == null) return;
        // Call the styler
        if (parentGrid) parentGrid.styleColumn(row, pos, parentGrid);

        // Build the columns
        this.parent().columns().forEach(function(col, i) {
            var originalPos = col.oPos != undefined ? col.oPos : i;
            var val = col.key ? utils.prop(row, col.key) : row[originalPos];
            cols[i] = {
                value: col.formatter(val || '', row, i, pos),
                className: 'uki-dataTable-col-' + i +
                    (col.className ? ' ' + col.className : '')
            };
        });
        return cols;
    }

});



exports.Pack = Pack;
