/**
@example_title Data table
@example_order 70
@example_html
    <script src="/src/pkg/uki.js"></script>
    <script src="dataTable.js"></script>
*/

var Header = null;

// custom formatter for duration column
function formatTime (t) {
   if (isNaN(t)) return ('');
    var m = Math.floor(t/60/1000),
        s = Math.floor(t/1000 - m * 60);

    return m + ':' + (s > 9 ? s : '0' + s);
}

function unformatTime(t) {
  if (t == '' || t == null) return 0;
  var times = t.match(/(\d+):(\d+)/);
  var nt = 0;
  if (times.length == 3) {
    var m = parseInt(times[1]) * 60000;
    var s = parseInt(times[2]) * 1000;
    var nt = m+s;
  }
  return (nt);
}

function styler(row, pos, tbl) {
  if (row[2] > 1200000) {
    Header.setRowStyle(pos, "background-color", "red");
  } else {
    Header.setRowStyle(pos, "background-color", "");
  }
}

function selection(data) {
  "use strict";
  console.log("Selection",data);
}

function buildUki() {
var views = uki([
    { view: 'DataTable', as: 'table', debounce: 1, hasFooter: true,
      filterable: true, sortable: true, hasMenu: true, editInPlace: true, editInPlaceHotkey: 113, styler: styler,
      menuOptions: [ 'Row Count', 'renderSize', 'Reset Sort', 'Reset Filters', 'Reset All', 'Redraw Row', 'Reload', 'Edit Grid [F2]', "Insert Row", "Leak Check", { text: 'Menu 3', options: ['test', 'test2', 'test3']}, { text: 'Menu 4', options: ['test', 'test2', 'test3'] }],
      on: {columnClick: sortit, columnFilter: filterit, menuClick: menuClick, editInPlaceChange: editInPlace, touchstart: DoubleTapEvent, dblclick: dblclicker, destroy: destruct, built: built, selection: selection},
      pos: 't:0 l:0 w:700 h:500', columns: [
        { label: 'ID', width: 40, visible: false },
        { label: 'Name', minWidth: 100, width: 250, maxWidth: 500, resizable: true, editor: {view: "nativeControl.Text"}, footervalue: 'hi' },
        { label: 'Time', width: 50, style: 'text-align:right;', formatter: formatTime, unformatter: unformatTime, validation: validate, filterable: false, resizable: false, sortable: false, editor: true, footer: false, footervalue: 'I am not visible' },
        { label: 'Artist', minWidth: 100, width: 150, editor: {view: "nativeControl.Select", options: ["Hi","Hello"]} },
        { label: 'Album', minWidth: 100, width: 150, editor: true },
        { label: 'Genre', width: 100, editor: true },
        { label: 'Rating', minWidth: 40, width: 50, maxWidth: 80, editor: true },
        { label: 'Play Count', minWidth: 30, width: 50, maxWidth: 80, editor: true }
    ], multiselect: true },

    { view: 'Text', as: 'loading', pos: 't:80px l:85px', text: 'Loading...' }
  ]);
  views.attach();
  Header = views.view("table" ).header();
 // console.log("Views: ",views);

  return views;
}

var views = buildUki();


var raw_data = null, filtered_data = null, last_sort='';
// dynamicly load library json

var async_emulator = function(data) {
  "use strict";
  this._data = data;
  this.length = data.length;
  this._saved = [];
};
async_emulator.prototype.loadRange = function(s, e, callback) {
  "use strict";
   console.log("Loading Range:",s,e);
   var dta = {cb: callback, s: s, e:e};
   if (1) {
     callback(this._data.slice(s,e));
  } else {
     if (this._saved.length <= 2) {
       this._saved.push(dta);
     } else {
       console.log("Returning Rows", s, e, this._data[s]);
       callback(this._data.slice(s,e));
       while (this._saved.length > 0) {
         if (this._saved.length % 2 === 0) {
           dta = this._saved.pop();
         } else {
           dta = this._saved.shift();
  }
         console.log("Returning Rows", dta.s, dta.e, this._data[dta.s]);
         dta.cb(this._data.slice(dta.s, dta.e));
}
     }
   }
};

window.onLibraryLoad = function(data) {
    views.view('loading').visible(false);
    var dta = new async_emulator(data);
    console.log(dta);
    views.view('table').data(dta);
    raw_data = data;
    views.view('table').focus();
    console.log("ODL");
 //   views.view("table").setRowColStyle(2,2,"background-color","#FFD396");
 //   views.view("table").setRowStyle(10,"background-color","#8AF7DD");
 //   views.view("table").setColStyle(5, "background-color","#0DC8E5");

};

function destruct(e) {
  console.log("%c Destruction", 'background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(245,246,246,1)), color-stop(21%,rgba(219,220,226,1)), color-stop(49%,rgba(57,134,229,1)), color-stop(80%,rgba(221,223,227,1)), color-stop(100%,rgba(245,246,246,1)));',
      e._targetView.typeName, e);

//      '-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(30,87,153,0)), color-stop(15%,rgba(30,87,153,0.8)), color-stop(19%,rgba(30,87,153,1)), color-stop(20%,rgba(30,87,153,1)), color-stop(50%,rgba(41,137,216,1)), color-stop(80%,rgba(30,87,153,1)), color-stop(81%,rgba(30,87,153,1)), color-stop(85%,rgba(30,87,153,0.8)), color-stop(100%,rgba(30,87,153,0)));', e._targetView.typeName, e);
}

function init(e) {
  "use strict";
  console.log("Inited", e._targetView.typeName);
}

function built(e) {
  "use strict";
  console.log("Built", e._targetView.typeName);
}

function dblclicker(e) {
  alert("Double Click");
}

function rebuild() {
  views.destruct();
  filtered_data = null;
  last_sort='';
  views = null;
  //views = buildUki();
  //views.view('table').data(raw_data);
}

var _lastTouchTime;
function DoubleTapEvent(event) {
  if (event.baseEvent) {
    var e = event.baseEvent;
  } else {
    var e = event;
  }

  var t2 = e.timeStamp
      , t1 = _lastTouchTime || t2
      , dt = t2 - t1
      , fingers = e.touches.length;
  var touch = e.touches[0];

 //console.log("DoubleTap Event Catcher");
  if (!touch) return (true);
  _lastTouchTime = t2;
  if (!dt || dt > 500 || fingers > 1) return (true); // not double-tap
  console.log("Attempting a Double Click on IPAD");
  var evtObj = document.createEvent('MouseEvents');

  evtObj.initMouseEvent("dblclick", true, true, window, 1,
      touch.screenX, touch.screenY,
      touch.clientX, touch.clientY, false,
      false, false, false, 0, null);

  touch.target.dispatchEvent(evtObj);
  e.preventDefault(); // double tap - prevent the zoom
  e.stopPropagation();
}


function timeEditor (name) {
  var fieldId = "timeeditor"+math.floor(math.Random()*10000,1);
  var editor = {
    fieldId: fieldId,
    createDom: function () {

    },
    setValue: function(value) { var ptr = document.getElementsById(rnd); ptr.value = value;},
    getValue: function() {var ptr = document.getElementsById(rnd); return (ptr.value); }
  };
  return (editor);
}

function editInPlace(data) {
 console.log("Edit in Place",data);
}

function validate(row, col, data) {
  console.log("Validate",data);
  return (true);
}

// Simple Menu code.  :)
function menuClick(e) {
  console.log("Menu Click");
  var hc = views.view('table').header().columns();
  switch(e.name) {
    case 'Row Count':
      if (filtered_data == null) {
        alert("Row Count is "+raw_data.length);
      } else {
        alert("Row Count is "+filtered_data.length);
      }
      break;

    case 'renderSize':
      var a = views.view('table').renderingRows();
      alert(a);
      break;

    case 'Reset Sort':
      for(var i=0;i<hc.length;i++) {
        hc[i].sort(0);
      }
      last_sort = "0";
      break;

    case 'Reset Filters':
        try
        {
      for(var i=0;i<hc.length;i++) {
        hc[i].filterValue("");
      }
        } catch (err) { console.log(err);}
      break;

    case 'Reset All':
      for(var i=0;i<hc.length;i++) {
        hc[i].sort(0);
      }
      last_sort = "0";
      for(var i=0;i<hc.length;i++) {
        hc[i].filterValue("");
      }
      break;

    case 'Leak Check':
      setTimeout(rebuild, 1000);
      break;

    case 'Reload':
        var sI = views.view('table' ).selectedIndexes();
        console.log(sI);
        reload(sI);
      break;

    case 'Redraw Row':
      var i = views.view('table' ).list().selectedIndex();
      views.view('table').redrawRow(i);
      break;

    case 'Edit Grid [F2]':
      if (views.view('table').isEditing()) {
        views.view('table').stopEditInPlace();
      } else {
        views.view('table' ).startEditInPlace();
      }
      break;

    case 'Insert Row':
      if (views.view('table').isEditing()) {
        views.view('table').EIPInsertRow();
      } else {
        alert("You must be in Grid Edit mode, to insert -- Press the (F2) Key.");
      }

    default:
      alert("You clicked on "+e.name);
      break;
  }
}

function reload()
{
  "use strict";
  var dta = new async_emulator(raw_data);
  console.log(dta);
  console.log(views.view('table'));
  views.view('table').dataReload(dta);

}

// Simple Stupid Sort routine
function sortit(e)
{
  var exp;
  if (typeof e == "string") {
    exp = e.split(",");
    last_sort = e;
  } else {
    exp = e.sortedlist.split(",");
    last_sort = e.sortedlist;
  }

  var sorter = [];
  var order=[];
  for(var i=0;i<exp.length;i++) {
    if (exp[i] === "0") continue;
    if (exp[i] === "1") {
      sorter.push(i);
      order.push(1);
    }
    else if (exp[i] == "2") {
      sorter.push(i);
      order.push(-1);
    }
  }

  var data;
  if (filtered_data == null) {
    data = raw_data.slice();
  } else {
    data = filtered_data.slice();
  }

  if (sorter.length == 0) {
    var dta = new async_emulator(data);
    views.view('table').data(dta);
    return;
  }

  // Do the Sort
  data.sort(function(a,b) {
    for(var i=0;i<sorter.length;i++) {
      var s = sorter[i];
      if ((a[s] == null && b[s] != null) || a[s] < b[s]) {
        if (order[i] > 0) return (-1)
        else return (1);
      } else if ((b[s] == null && a[s] != null) || a[s] > b[s]) {
        if (order[i] > 0) return (1);
        else return (-1);
      }
    }
    return (0);
  });

  var dta = new async_emulator(data);
  views.view('table').data(dta);
}

// Simple, stupid Filter routine
// not using "array.filter" because it isn't supported on all browsers
function filterit(e)
{
  var data = [];
  var sorted = [];
  var values = [];
  for (var i=0;i<e.byfieldid.length;i++) {
    if (e.byfieldid[i].length === 0) continue;
    sorted.push(i);
    values.push(e.byfieldid[i].toLowerCase());
  }

  if (sorted.length == 0) {
    filtered_data = null;
    sortit(last_sort);
    return;
  }

  var new_data = [], found;

  for (var row=0;row < raw_data.length;row++) {
    found = true;
    for(i=0;i<sorted.length;i++) {
      if (raw_data[row][sorted[i]] == null || raw_data[row][sorted[i]].toLowerCase().indexOf(values[i]) == -1) {
        found=false; i=sorted.length;
      }
    }
    if (found) {
      new_data.push(raw_data[row]);
    }
  }

  filtered_data = new_data;
  if (new_data.length == 0) {
    new_data[0] = [];
    for(i=0;i<raw_data[0].length;i++) new_data[0][i] = "No Data Found";
  }

  sortit(last_sort);
}

// Emulate Loading a dynamic data source
document.getElementsByTagName('head')[0].appendChild(
    uki.createElement('script', { src: 'library.js' }));

