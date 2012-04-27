/**
@example_title Menu
@example_order 31
@example_html
 <script src="/src/pkg/uki.js"></script>
 <script src="menu.js"></script>
*/

//var uki = require('uki');

var menu = uki(
    { view: 'Menu', on: { menuClick: menuClicker}, options: [
          { html: '<img border=0 src="../button/settings.png">', options: [ 'Hi', 'Hello'] },
                { text: 'Menu 2', options: [
                  { html: '<font color=red>Red</font>', name: 'red'},
                  { html: '<font color=blue>Blue</font>', name: 'blue'},
                  { html: '<font color=green>Green</font>', name: 'green'}
                ]},
                { text: 'Menu 3', options: [
                    { text: 'Menu 3-1', options: [
                      {text: 'Menu 3-1-1', name: 'Menu311'},
                      {text: 'Menu 3-1-2', accessKey: 'c'},
                      {text: 'Menu 3-1-3'}] },
                    { text: 'Menu 3-2' },
                    { text: 'Menu 3-3', options: [
                      {text: 'Menu 3-3-1'},
                      {text: 'Menu 3-3-2'},
                      {text: 'Menu 3-3-3', options: [
                        {text: 'Menu 3-3-3-1'},
                        {text: 'Menu 3-3-3-2'},
                        {text: 'Menu 3-3-3-3'}

                      ]}
                    ]}
                ]},
                { text: 'Click to Change', name: 'ChangeName' },
                { text: 'Back to Examples', url: '../../' }
            ] }
).attach();


function menuClicker(event)
{

  if (event.name == "ChangeName") {
    event.menu.options()[3].setText("The name changed!");
  }
  else alert("You clicked on the "+event.name+" menu item");
}
var options = menu[0].options();

