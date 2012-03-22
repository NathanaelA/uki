/**
@example_title Data table
@example_order 70
@example_html
    <script src="/src/pkg/uki.js"></script>
    <script src="dataTable.js"></script>
*/

// custom formatter for duration column
function formatTime (t) {
   if (isNaN(t)) return ('');
    var m = Math.floor(t/60/1000),
        s = Math.floor(t/1000 - m * 60);

    return m + ':' + (s > 9 ? s : '0' + s);
}

var views = uki([
    { view: 'DataTable', as: 'table', debounce: 1,
      filterable: true, sortable: true, hasMenu: true,
      menuOptions: [ 'Row Count', 'Reset Sort', 'Reset Filters', 'Reset All'  ],
      on: {columnClick: sortit, columnFilter: filterit, menuClick: menuClick },
      pos: 't:0 l:0 w:100% h:100%', columns: [
        { label: 'ID', width: 40, visible: false },
        { label: 'Name', minWidth: 100, width: 250, maxWidth: 500, resizable: true },
        { label: 'Time', width: 50, formatter: formatTime, filterable: false, resizable: false, sortable: false },
        { label: 'Artist', minWidth: 100, width: 150 },
        { label: 'Album', minWidth: 100, width: 150 },
        { label: 'Genre', width: 100 },
        { label: 'Rating', minWidth: 40, width: 50, maxWidth: 80 },
        { label: 'Play Count', minWidth: 30, width: 50, maxWidth: 80 }
    ], multiselect: true },

    { view: 'Text', as: 'loading', pos: 't:80px l:85px', text: 'Loading...' },
]).attach();


var raw_data = null, filtered_data = null, last_sort='';
// dynamicly load library json
window.onLibraryLoad = function(data) {
    views.view('loading').visible(false);
    views.view('table').data(data);
    raw_data = data;
    views.view('table').focus();

};

// Simple Menu code.  :)
function menuClick(e)
{
  var hc = views.view('table').header().columns();
  switch(e.name) {
    case 'Row Count':
      if (filtered_data == null) {
        alert("Row Count is "+raw_data.length);
      } else {
        alert("Row Count is "+filtered_data.length);
      }
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

    default:
      alert("You clicked on "+e.name);
      break;
  }
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
    views.view('table').data(data);
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

  views.view('table').data(data);
}

// Simple, stupid Filter routine
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

document.getElementsByTagName('head')[0].appendChild(
    uki.createElement('script', { src: 'library.js' }));

