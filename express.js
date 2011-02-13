var path = require('path'),
    fs   = require('fs');
    
var examplesPath = path.join(__dirname, 'examples');

exports.init = function(app) {
    app.set('views', path.join(examplesPath, 'views'));
    
    app.get('/', function(req, res) {
        res.redirect('/examples/');
    });
    
    app.get('/examples/', function(req, res) {
        var exampleList = listExamples(examplesPath).map(function(name) {
            var filePath = path.join(examplesPath, name),
                code = getExampleCode(filePath);

            return {
                path: name + '/',
                title: extractExampleTitle(code),
                order: extractExampleOrder(code)
            };
        }).filter(function(a) {
            return a.order > 0;
        }).sort(function(a, b) {
            return o.order - b.order;
        });
        res.render('exampleList.jade', { 
            layout: false,
            locals: { exampleList: exampleList } 
        });
    });
    
    app.get('/examples/:type/:example/', function(req, res) {
        var filePath = path.join(examplesPath, req.param('type'), req.param('example')),
            page = getExamplePage(filePath);
            
        if (page) {
            res.send(page);
        } else {
            var code = getExampleCode(filePath);
            res.render('example.jade', { 
                layout: false,
                locals: {
                    html: extractExampleHtml(code),
                    title: extractExampleTitle(code)
                }
            });
        }
    });
};

function getExamplePage (filePath) {
    name = path.basename(filePath);
    htmlPath = path.join(filePath, name + '.html');
    if (path.existsSync(htmlPath)) {
        return fs.readFileSync(htmlPath);
    } else {
        return false;
    }
}

function listExamples (filePath) {
    var result = [];
    fs.readdirSync(filePath).forEach(function(name) {
        if (path.existsSync(path.join(filePath, name, name + '.js'))) {
            result.push(name);
        } else if ( fs.statSync(path.join(filePath, name)).isDirectory() ) {
            result = result.concat(listExamples(path.join(filePath, name)).map(function(subname) {
                return path.join(name, subname);
            }));
        }
    });
    return result;
}

function getExampleCode (filePath) {
    var name = path.basename(filePath),
        jsPath = path.join(filePath, name + '.js');
    
    return fs.readFileSync(jsPath, 'utf8');
}

function extractExampleHtml (code) {
    var match = code.match(/@example_html((.|[\n\r])*)\*\//);
    return match ? match[1] : '';
}

function extractExampleTitle (code) {
    var match = code.match(/@example_title(.*)/);
    return match ? match[1].trim() : 'Untitled';
}

function extractExampleOrder (code) {
    var match = code.match(/@example_order(.*)/);
    return match ? match[1].trim()*1 : 9e6;
}