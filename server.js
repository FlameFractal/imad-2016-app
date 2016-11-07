var express = require('express');
var morgan = require('morgan');
var path = require('path');
var app = express();
app.use(morgan('combined'));
app.set('etag', false);

/* DB init stuff */
var Pool = require('pg').Pool;
var config = {
  // user: 'postgres',
  // password: 'vishal',

  // user: 'flamefractal',
  // password: process.env.DB_PASSWORD,
  // database: 'flamefractal',
  // host: 'localhost',
  // port: '5432',

  user: 'tjsooxajhxixee',
  password: '4E-4rvokYpmN-16-1U3FFBtvD4',
  database: 'd4e5rlrk922mmk',
  host: 'ec2-54-228-219-40.eu-west-1.compute.amazonaws.com',
  port: '5432',
};

/* All the global variables */
var comments = [];
var posts = [];
var counter;
var pool = new Pool(config);


/* Define all the routes here*/
app.use("/css", express.static(__dirname+'/ui/css'));
app.use("/img", express.static(__dirname+'/ui/img'));
app.use("/js", express.static(__dirname+'/ui/js'));
app.use("/vendor", express.static(__dirname+'/ui/vendor'));

app.get('/', function (req, res) {
    get_posts();
    res.send(homeTemplate());
});

app.get('/index.html', function (req, res) {
    get_posts();
    res.send(homeTemplate());
});

app.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'about.html'));
});

app.get('/contact', function (req, res) {
   res.sendFile(path.join(__dirname, 'ui', 'contact.html'));
});

app.get('/main.js', function (req, res) {
   res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/favicon.ico', function (req, res){
    res.sendFile(path.join(__dirname, 'ui/img', 'favicon.ico'))
});

app.get('/counter', function(req, res){
    /*Increment it and store it back in the DB*/
    counter = counter + 1;
    res.send(counter.toString());
    
    pool.query('UPDATE hitcounter SET counter='+counter, function(err, results){
        if (err){
            return(err.toString());
        } else {
                console.log("loooooooooooooo counter ="+counter);
            }
    });

});

app.get('/submit-name/:postID', function(req, res){

    var postID = req.params.postID;
    var author = req.query.author;
    var content = req.query.content;
    
    /* Write to database */
    var query = "INSERT INTO comments (post_id, comment_author, comment_content) values ('"+postID+"','"+author+"','"+content+"');";
    pool.query(query, function(err, results){
        if (err){
            return(err.toString());
        } else {
                console.log("loooooooo   query = "+query);
            }
    });

    res.send('Succeeded.<br> author='+author+' <br>content='+content);
});

app.get('/:postID', function (req, res) {
    get_posts();
    res.send(postTemplate(req.params.postID));
});


function get_posts(){
    pool.query('SELECT * from posts ORDER BY post_id DESC', function(err, results){
        if (err){
            return(err.toString());
        } else {
            if (results.rows.length === 0 ) {
                return(err.toString());
            } else {
                posts = results.rows;
            }
        }
    });
}


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
                        <a class="navbar-brand" href="/">Vishal Gauba</a>
                    </div>
                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul class="nav navbar-nav navbar-right">
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>
                                <a href="about">About</a>
                            </li>
                            <li>
                                <a href="contact">Contact</a>
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

            
            for (var postID=0; postID<posts.length; postID++){
                var title = posts[postID].post_title;
                var subtitle = posts[postID].post_subtitle;
                var author = posts[postID].post_author;
                var date = (posts[postID].post_date).toDateString();

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
                                    <a href="https://twitter.com/vishal_gauba">
                                        <span class="fa-stack fa-lg">
                                            <i class="fa fa-circle fa-stack-2x"></i>
                                            <i class="fa fa-twitter fa-stack-1x fa-inverse"></i>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.facebook.com/vishal.gauba">
                                        <span class="fa-stack fa-lg">
                                            <i class="fa fa-circle fa-stack-2x"></i>
                                            <i class="fa fa-facebook fa-stack-1x fa-inverse"></i>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://github.com/flamefractal">
                                        <span class="fa-stack fa-lg">
                                            <i class="fa fa-circle fa-stack-2x"></i>
                                            <i class="fa fa-github fa-stack-1x fa-inverse"></i>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                            <p class="copyright text-muted">This website has been visited <b><span id="counter">2016</span></b> times since inception.</p>
                        </div>
                    </div>
                </div>
            </footer>
            <script src="main.js"></script>
            <script src="vendor/jquery/jquery.min.js"></script>
            <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
            <script src="js/jqBootstrapValidation.js"></script>
            <script src="js/contact_me.js"></script>
            <script src="js/clean-blog.min.js"></script>
        </body>
        </html>`
    return htmlTemplate;
};

function postTemplate(data){
    
    var postID = data;
    var title = posts[postID].post_title;
    var subtitle = posts[postID].post_subtitle;
    var author = posts[postID].post_author;
    var date = (posts[postID].post_date).toDateString();
    var postContent = posts[postID].post_content;


     pool.query('SELECT * from comments WHERE post_id ='+postID+' ORDER BY comment_id', function(err, results){
        if (err){
            return(err.toString());
        } else {
            comments = results.rows;
        }
    });

    console.log("lllllllllllll len = "+comments.length);
    var htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${title}</title>
            <link href="css/post-comment.css" rel="stylesheet">
            <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
            <link href="css/clean-blog.min.css" rel="stylesheet">
            <link href="vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
            <link href='https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
            <link href='https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
            <link href="css/post-comment.css" rel="stylesheet">
        </head>
        <body>
            <nav class="navbar navbar-default navbar-custom navbar-fixed-top">
                <div class="container-fluid">
                    <div class="navbar-header page-scroll">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span class="sr-only">Toggle navigation</span>
                            Menu <i class="fa fa-bars"></i>
                        </button>
                        <a class="navbar-brand" href="/">Vishal Gauba</a>
                    </div>
                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul class="nav navbar-nav navbar-right">
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>
                                <a href="about">About</a>
                            </li>
                            <li>
                                <a href="contact">Contact</a>
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
            <br><br>
            <hr>

            <!-- Comments of the Post -->
            <!-- Fetch comment from DB -->
            <div class="container">
            `;

            for (var i = 0; i < comments.length; i++) {
              htmlTemplate = htmlTemplate +  `
                <div class="row"> 
                        <div class="col-md-8 col-md-offset-2">
                            <div class="panel panel-white post panel-shadow">
                                <div class="post-heading">
                                    <div class="pull-left image">
                                        <img src="http://bootdey.com/img/Content/user_`+(Math.floor(Math.random() * (3)) + 1)+`.jpg" class="img-circle avatar" alt="user profile image">
                                    </div>
                                    <div class="pull-left meta">
                                        <div class="title h5">
                                            <a href="#" id="author"><b>`+comments[i].comment_author+`</b></a>
                                            commented.
                                        </div>
                                    </div> 
                                    <div class="post-description"> 
                                        <p>`+comments[i].comment_content+`</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                   </div>
                   ` ;
               }

            htmlTemplate = htmlTemplate + `
            </div>
            <div class="container">
                <!-- <div class="row"> <h2> Comments: </h2> </div> -->

                <div class="row" style="visibility:hidden" id="new_comment">
                    <!-- space for new comment -->
                </div>
            
            </div>

       <!-- Comment box -->
            <div class="container">
                <div class="row">
                    <div class="col-md-8 col-md-offset-2">
                        <div class="panel panel-white post panel-shadow">
                            <div class="post-heading" style="height: 280px; min-height: 200px; overflow: hidden;">
                                <div class="pull-left image">
                                    <img src="http://bootdey.com/img/Content/user_1.jpg" class="img-circle avatar" alt="user profile image">
                                </div>
                                <div class="col-xs-8 meta">
                                    <form>
                                        <div class="form-group">
                                            <input class="form-control input-md" id="commentAuthor" type="text" placeholder="Name">
                                         </div>
                                         <div class="form-group"> 
                                           <textarea class="form-control" rows="5" id="commentContent" placeholder="Your comment here"></textarea>
                                         </div>
                                         <button type="button" id="submitComment" class="btn btn-default">Submit</button>
                                    </form>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>




            <hr>
            <footer>
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                            <ul class="list-inline text-center">
                                <li>
                                    <a href="https://twitter.com/vishal_gauba">
                                        <span class="fa-stack fa-lg">
                                            <i class="fa fa-circle fa-stack-2x"></i>
                                            <i class="fa fa-twitter fa-stack-1x fa-inverse"></i>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.facebook.com/vishal.gauba">
                                        <span class="fa-stack fa-lg">
                                            <i class="fa fa-circle fa-stack-2x"></i>
                                            <i class="fa fa-facebook fa-stack-1x fa-inverse"></i>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://github.com/flamefractal">
                                        <span class="fa-stack fa-lg">
                                            <i class="fa fa-circle fa-stack-2x"></i>
                                            <i class="fa fa-github fa-stack-1x fa-inverse"></i>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                            <p class="copyright text-muted">This website has been visited <b><span id="counter">2016</span></b> times since inception.</p>
                        </div>
                    </div>
                </div>
            </footer>
            <script src="main.js"></script>
            <script src="vendor/jquery/jquery.min.js"></script>
            <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
            <script src="js/jqBootstrapValidation.js"></script>
            <script src="js/contact_me.js"></script>
            <script src="js/clean-blog.min.js"></script>
        </body>
        </html>`;
        comments = [];
    return htmlTemplate;
};


/*Query the DB for counter value*/
    pool.query('SELECT counter from hitcounter', function(err, results){
        if (err){
            return(err.toString());
        } else {
            if (results.rows.length === 0 ) {
                return(err.toString());
            } else {
                counter = results.rows[0].counter;
            }
        }
    });


var port = process.env.PORT || 8080;  // Use 8080 for local development because you might already have apache running on 80
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
