var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));
app.use("/", express.static(__dirname + '/ui'));


function get_comments(data){};

// var counter = 0;
// var names = [];

var posts = {
    '1' : {
    	title: 'Man must explore, and this is exploration at its greatest',
    	subtitle: 'Problems look mighty small from 150 miles up',
        author: 'Vishal Gauba',
        date: 'September 24, 2016',
        postContent : `
                    <p>Never in all their history have men been able truly to conceive of the world as one: a single sphere, a globe, having the qualities of a globe, a round earth in which all the directions eventually meet, in which there is no center because every point, or none, is center — an equal earth which all men occupy as equals. The airman's earth, if free men make it, will be truly round: a globe in practice, not in theory.</p>

                    <p>Science cuts two ways, of course; its products can be used for both good and evil. But theres no turning back from science. The early warnings about technological dangers also come from science.</p>

                    <p>What was most significant about the lunar voyage was not that man set foot on the Moon but that they set eye on the earth.</p>

                    <p>A Chinese tale tells of some men sent to harm a young girl who, upon seeing her beauty, become her protectors rather than her violators. Thats how I felt seeing the Earth for the first time. I could not help but love and cherish her.</p>

                    <p>For those who have seen the Earth from space, and for the hundreds and perhaps thousands more who will, the experience most certainly changes your perspective. The things that we share in our world are far more valuable than those which divide us.</p>

                    <h2 class="section-heading">The Final Frontier</h2>

                    <p>There can be no thought of finishing for ‘aiming for the stars.’ Both figuratively and literally, it is a task to occupy the generations. And no matter how much progress one makes, there is always the thrill of just beginning.</p>

                    <p>There can be no thought of finishing for ‘aiming for the stars.’ Both figuratively and literally, it is a task to occupy the generations. And no matter how much progress one makes, there is always the thrill of just beginning.</p>

                    <blockquote>The dreams of yesterday are the hopes of today and the reality of tomorrow. Science has not yet mastered prophecy. We predict too much for the next year and yet far too little for the next ten.</blockquote>

                    <p>Spaceflights cannot be stopped. This is not the work of any one man or even a group of men. It is a historical process which mankind is carrying out in accordance with the natural laws of human development.</p>

                    <h2 class="section-heading">Reaching for the Stars</h2>

                    <p>As we got further and further away, it [the Earth] diminished in size. Finally it shrank to the size of a marble, the most beautiful you can imagine. That beautiful, warm, living object looked so fragile, so delicate, that if you touched it with a finger it would crumble and fall apart. Seeing this has to change a man.</p>
        `},
    '2' : {
        title: 'Man must explore, and this is exploration at its greatest',
        subtitle: 'Problems look mighty small from 150 miles up',
        author: 'Vishal Gauba',
        date: 'September 24, 2016',
        postContent : `
        <p>Never in all their history have men been able truly to conceive of the world as one: a single sphere, a globe, having the qualities of a globe, a round earth in which all the directions eventually meet, in which there is no center because every point, or none, is center — an equal earth which all men occupy as equals. The airman's earth, if free men make it, will be truly round: a globe in practice, not in theory.</p>

                    <p>Science cuts two ways, of course; its products can be used for both good and evil. But theres no turning back from science. The early warnings about technological dangers also come from science.</p>

                    <p>What was most significant about the lunar voyage was not that man set foot on the Moon but that they set eye on the earth.</p>

                    <p>A Chinese tale tells of some men sent to harm a young girl who, upon seeing her beauty, become her protectors rather than her violators. Thats how I felt seeing the Earth for the first time. I could not help but love and cherish her.</p>

                    <p>For those who have seen the Earth from space, and for the hundreds and perhaps thousands more who will, the experience most certainly changes your perspective. The things that we share in our world are far more valuable than those which divide us.</p>

                    <h2 class="section-heading">The Final Frontier</h2>

                    <p>There can be no thought of finishing for ‘aiming for the stars.’ Both figuratively and literally, it is a task to occupy the generations. And no matter how much progress one makes, there is always the thrill of just beginning.</p>

                    <p>There can be no thought of finishing for ‘aiming for the stars.’ Both figuratively and literally, it is a task to occupy the generations. And no matter how much progress one makes, there is always the thrill of just beginning.</p>

                    <blockquote>The dreams of yesterday are the hopes of today and the reality of tomorrow. Science has not yet mastered prophecy. We predict too much for the next year and yet far too little for the next ten.</blockquote>

                    <p>Spaceflights cannot be stopped. This is not the work of any one man or even a group of men. It is a historical process which mankind is carrying out in accordance with the natural laws of human development.</p>

                    <h2 class="section-heading">Reaching for the Stars</h2>

                    <p>As we got further and further away, it [the Earth] diminished in size. Finally it shrank to the size of a marble, the most beautiful you can imagine. That beautiful, warm, living object looked so fragile, so delicate, that if you touched it with a finger it would crumble and fall apart. Seeing this has to change a man.</p>
        `}}

function homeTemplate(){

    var htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>IMAD Blog WebApp</title>
            <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
            <link href="css/clean-blog.min.css" rel="stylesheet">
            <link href="vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
            <link href='https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
            <link href='https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
        </head>
        <body>
            <nav class="navbar navbar-default navbar-custom navbar-fixed-top">
                <div class="container-fluid">
                    <div class="navbar-header page-scroll">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span class="sr-only">Toggle navigation</span>
                            Menu <i class="fa fa-bars"></i>
                        </button>
                        <a class="navbar-brand" href="">Vishal Gauba</a>
                    </div>
                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul class="nav navbar-nav navbar-right">
                            <li>
                                <a href="index.html">Home</a>
                            </li>
                            <li>
                                <a href="about.html">About</a>
                            </li>
                            <li>
                                <a href="contact.html">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <header class="intro-header" style="background-image: url('img/home-bg.jpg')">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                            <div class="site-heading">
                                <h1>Blog</h1>
                                <hr class="small">
                                <span class="subheading">All Posts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div class="container">
                <div class="row">
                    <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">

            `;

            
            for (var postID in posts){
                var title = posts[postID].title;
                var subtitle = posts[postID].subtitle;
                var author = posts[postID].author;
                var date = posts[postID].date;

                htmlTemplate = htmlTemplate + `

                 <div class="post-preview">
                            <a href="${postID}">
                                <h2 class="post-title">
                                    ${title}
                                </h2>
                                <h3 class="post-subtitle">
                                    ${subtitle}
                                </h3>
                            </a>
                            <p class="post-meta">Posted by <a href="#">${author}</a> on ${date}</p>
                        </div>
                        <hr>
                `
            }

            htmlTemplate = htmlTemplate + `
            </div>
                </div>
            </div>
            <footer>
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                            <ul class="list-inline text-center">
                                <li>
                                    <a href="#">
                                        <span class="fa-stack fa-lg">
                                            <i class="fa fa-circle fa-stack-2x"></i>
                                            <i class="fa fa-twitter fa-stack-1x fa-inverse"></i>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span class="fa-stack fa-lg">
                                            <i class="fa fa-circle fa-stack-2x"></i>
                                            <i class="fa fa-facebook fa-stack-1x fa-inverse"></i>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span class="fa-stack fa-lg">
                                            <i class="fa fa-circle fa-stack-2x"></i>
                                            <i class="fa fa-github fa-stack-1x fa-inverse"></i>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                            <p class="copyright text-muted">Visit Counter =  <span>2016</span></p>
                        </div>
                    </div>
                </div>
            </footer>
            <script
            <script src="vendor/jquery/jquery.min.js"></script>
            <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
            <script src="js/jqBootstrapValidation.js"></script>
            <script src="js/contact_me.js"></script>
            <script src="js/clean-blog.min.js"></script>
        </body>
        </html>`
    return htmlTemplate;};

function postTemplate(data){
    var title = data.title;
    var subtitle = data.subtitle;
    var author = data.author;
    var date = data.date;
    var postContent = data.postContent;

    var htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${title}</title>
            <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
            <link href="css/clean-blog.min.css" rel="stylesheet">
            <link href="vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
            <link href='https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
            <link href='https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
        </head>
        <body>
            <nav class="navbar navbar-default navbar-custom navbar-fixed-top">
                <div class="container-fluid">
                    <div class="navbar-header page-scroll">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span class="sr-only">Toggle navigation</span>
                            Menu <i class="fa fa-bars"></i>
                        </button>
                        <a class="navbar-brand" href="index.html">Home</a>
                    </div>
                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul class="nav navbar-nav navbar-right">
                            <li>
                                <a href="index.html">Home</a>
                            </li>
                            <li>
                                <a href="about.html">About</a>
                            </li>
                            <li>
                                <a href="contact.html">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <header class="intro-header" style="background-image: url('img/post-bg.jpg')">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                            <div class="post-heading">
                                <h1>${title}</h1>
                                <h2 class="subheading">${subtitle}</h2>
                                <span class="meta">Posted by <a href="#">${author}</a> on ${date}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <article>
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                            ${postContent}
                        </div>
                    </div>
                </div>
            </article>
            <hr>
            <footer>
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                            <ul class="list-inline text-center">
                                <li>
                                    <a href="#">
                                        <span class="fa-stack fa-lg">
                                            <i class="fa fa-circle fa-stack-2x"></i>
                                            <i class="fa fa-twitter fa-stack-1x fa-inverse"></i>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span class="fa-stack fa-lg">
                                            <i class="fa fa-circle fa-stack-2x"></i>
                                            <i class="fa fa-facebook fa-stack-1x fa-inverse"></i>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span class="fa-stack fa-lg">
                                            <i class="fa fa-circle fa-stack-2x"></i>
                                            <i class="fa fa-github fa-stack-1x fa-inverse"></i>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                            <p class="copyright text-muted">Visit Counter =  <span>2016</span></p>
                        </div>
                    </div>
                </div>
            </footer>
            <script src="vendor/jquery/jquery.min.js"></script>
            <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
            <script src="js/jqBootstrapValidation.js"></script>
            <script src="js/contact_me.js"></script>
            <script src="js/clean-blog.min.js"></script>
        </body>
        </html>`
    return htmlTemplate;};






// app.get('/submit-name', function(req, res){
// 	console.log(req);
// 	console.log(req.query.name);
//     var new_name = req.query.name;
//     if (new_name==null)
//         new_name="default";
//     names.push(new_name);
//     res.send(JSON.stringify(names));
// });



app.get('/', function (req, res) {
    res.send(homeTemplate(posts));
});

app.get('/index.html', function (req, res) {
    res.send(homeTemplate(posts));
});

app.get('/counter', function(req, res){
    counter = counter + 1;
    res.send(counter.toString());
});

app.get('/:postID', function (req, res) {
  var postID = req.params.postID;
  res.send(postTemplate(posts[postID]));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
