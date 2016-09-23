var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));


articles = {
    'article-one': {
    	title: 'Article One',
    	content: 'This is article oneeeeeeeeeeeeeeeeeeeeeeeeeee<h1>ONE</h1>lol'
    },
    
    'article-two': {
    	title: 'Article Tqo',
    	content: `
    	This is article 
    	<h1>TWO</h1>
    	lol
    	`
    },
    
    'article-three': {
    	title: 'Article Three',
    	content: `
    	This is article 
    	<h1>THREE</h1>
    	lol
    	`
    }
};


function createPage(data) {
    
    var title = data.title;
    var content = data.content;
    
	var htmlTemplate = `
	<html>
		<head>
			<title>${title}</title>
		</head>
		<body>
			${content}
		</body>
	</html>
	`;
	return htmlTemplate;
}

var counter = 0;

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/counter', function(req, res){
    counter = counter + 1;
    res.send(counter.toString());
});

app.get('/:articleName', function (req, res) {
    var articleName = req.params.articleName;
    res.send(createPage(articles[articleName]));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
