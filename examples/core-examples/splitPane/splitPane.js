/**
@example_title Split Pane
@example_order 50
@example_html
    <script src="/src/pkg/uki.js"></script>
    <script src="splitPane.js"></script>
*/

var x = uki({ view: 'SplitPane', pos: 'l:0 t:0 r:0 b:0', init: { vertical: true },
    leftChildViews: [{ view: 'Button', label: 'left' }],
    rightChildViews: [
        { view: 'SplitPane', pos: 'l:0 t:0 r:0 b:0', handlePosition: 300,
            init: { handleWidth: 5 },
            leftChildViews: [ { view: 'Button', label: 'top', on: {click: hi} } ],
            rightChildViews: [ { view: 'Button', label: 'bottom' } ] 
        }
    ]
}).attach();

function hi(e) {
  x.destruct();
}