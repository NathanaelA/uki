/**
@example_title Native Controls
@example_order 30
@example_html
 <div id='test' style='width: 100%; background: #EEE; position: relative; background: -webkit-gradient(linear, 0 0,0 100%, from(#E6E6E6), color-stop(80%,#ccc), to(#cfcfcf));'>
 <input type="button" onclick="createview();" value="Create"><input type="button" onclick="destroyview();" value="Destroy">
 </div>
 <div id='attach' style='width: 100%; position: relative;'></div>
 <script src="/src/pkg/uki.js"></script>
    <script src="nativeControl.js"></script>
*/

var view = { view: 'Flow', horizontal: true, spacing: 'large', pos: 'l:10px t:10px',
  childViews: [
    { view: 'Flow', childViews: [
      { view: 'Label', text: 'Radio group' },
      { view: 'nativeControl.Radio', name: 'group_1', text: 'Red' },
      { view: 'nativeControl.Radio', name: 'group_1', text: 'Blue',
        checked: true },
      { view: 'nativeControl.Radio', name: 'group_1', text: 'Green' }
    ]},
    { view: 'Flow', childViews: [
      { view: 'Label', text: 'Checkbox group' },
      { view: 'nativeControl.Checkbox', name: 'group_2', text: 'Red' },
      { view: 'nativeControl.Checkbox', name: 'group_2', text: 'Blue',
        checked: true },
      { view: 'nativeControl.Checkbox', name: 'group_2', text: 'Green',
        checked: true },
      { view: 'nativeControl.SVG', name: 'svg_1', width: "100px", height: "100px"}
    ]},
    { view: 'Flow', childViews: [
      { view: 'Label', text: 'Other' },
      { view: 'nativeControl.Button', value: 'Button', on: {click: function() { destroyview(); createview(); }}, width: "140px", height: '40px' },
      { view: 'nativeControl.Text', value: '', placeholder: 'Name?', maxLength: 10, datalist: ["Hi", "this", "is", "test", "Datalist"] },
      { view: 'nativeControl.Select', options: [
        { text: 'Default', options: [
          'Red',
          'Blue',
          'Green'
        ]},
        { text: 'User', options: [
          { text: 'Favorite', value: 1234522 },
          { text: 'Less favorite', value: 1264522 }
        ]},
        { text: 'Custom', value: '' }
      ], value: '1264522' }
    ]},
    { view: 'Flow', childViews: [
      { view: 'Label', text: 'Text Area' },
      { view: 'nativeControl.TextArea', value: 'TextArea', maxLength: 10, rows: 3, placeholder: 'textarea' },
    ]}
]};

var views  = null;

function createview()
{
  "use strict";
  if (views === null) {
    views = uki(
      view
    ).attach( document.getElementById('attach'));
  }
}

function destroyview()
{
  "use strict";
  if (views !== null) {
    views.destruct();
    views = null;
  }
}
