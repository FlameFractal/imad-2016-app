var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));



var articleone = {
	title: 'Article One',
	content: 'This is article oneeeeeeeeeeeeeeeeeeeeeeeeeee<h1>ONE</h1>lol'
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



app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/article-one', function (req, res) {
  res.send(createPage(articleone));
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
