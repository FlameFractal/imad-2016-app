var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');


var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'dfkjsdlfnkjf',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

/* DB init stuff */
var Pool = require('pg').Pool;
var config = {
  user: process.env.IMADUSER || 'flamefractal',
  database: process.env.IMADDB || 'flamefractal',
  password: process.env.IMADPASSWORD || process.env.DB_PASSWORD,
  host: process.env.IMADHOST || 'db.imad.hasura-app.io',
  port: '5432',
};
config=testdb();

/* All the global variables */
var users = [];
var comments = [];
var posts = [];
var counter;
var pool = new Pool(config);

get_posts();
get_comments();
get_users();



/* Define all the routes here*/
app.use("/css", express.static(__dirname+'/ui/css'));
app.use("/img", express.static(__dirname+'/ui/img'));
app.use("/js", express.static(__dirname+'/ui/js'));
app.use("/vendor", express.static(__dirname+'/ui/vendor'));

app.get('/', function (req, res) {
    get_posts();
    res.send(homeTemplate());
});

app.get('/posts', function (req, res) {
    res.redirect('/');
});

app.get('/index.html', function (req, res) {
    res.redirect('/');
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

app.get('/article.js', function (req, res) {
   res.sendFile(path.join(__dirname, 'ui', 'article.js'));
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
                console.log("");
            }
    });

});

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

app.get('/submit-comment/:postID', function(req, res){
    if (req.session && req.session.auth && req.session.auth.userId) {
        var postID = req.params.postID;
        var author = req.session.username;
        var content = escapeHtml(req.query.content);
        
        /* Write to database */
        var query = "INSERT INTO comments (post_id, comment_author, comment_content, comment_date) values ('"+postID+"','"+author+"','"+content+"',now());";
        pool.query(query, function(err, results){
            if (err){
                res.status(403).send(err.toString());
            } else {
                res.send(author);
            }
        });
    }
});


app.get('/posts/:postID', function (req, res) {
    get_posts();
    get_comments();
    get_users();
    res.send(postTemplate(req.params.postID));
});

function hash (input, salt) {
    // How do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 8000, 512, 'sha512');
    return ["pbkdf2", "8000", salt, hashed.toString('hex')].join('$');
}

app.post('/create-user', function (req, res) {
   // username, password
   // {"username": "tanmai", "password": "password"}
   // JSON
   var username = escapeHtml(req.body.username);
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "users" (username, password, displaypic) VALUES ($1, $2, '+(Math.floor(Math.random() * (3)) + 1)+')', [username, dbString], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created: ' + username);
      }
   });
});

app.get('/user/:username', function(req, res){
    var username = req.params.username;
    get_comments();
    var htmlTemplate=`
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
            <link href='//fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
            <link href='//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
            <link href="../css/modal.css" rel="stylesheet">
            <link href="../css/post-comment.css" rel="stylesheet">
        </head>
        <body>
    `;
    for (var i = 0; i < comments.length; i++) {
                if (comments[i].comment_author === username){ 
                  htmlTemplate = htmlTemplate +  `
                   <div class="col-sm-8 col-sm-offset-2">
                        <div class="panel panel-white post panel-shadow">
                            <div class="post-heading">
                                <div class="pull-left image">
                                    <a href=/user/`+comments[i].comment_author+`><img src="http://bootdey.com/img/Content/user_`+findUser(comments[i].comment_author).displaypic+`.jpg" class="img-circle avatar" alt="user profile image"></a>
                                </div>
                                <div class="pull-left meta">
                                    <div class="title h5">
                                        <a href=/user/`+comments[i].comment_author+`><b>`+comments[i].comment_author+`</b></a> made a comment.
                                    </div>
                                    <h6 class="text-muted time">`+(comments[i].comment_date).toGMTString()+`</h6>
                                </div>
                            </div> 
                            <div class="post-description"> 
                                <p>`+comments[i].comment_content+`</p>
                            </div>
                        </div>
                    </div>
                            
                       ` ;
                   }
               }

       htmlTemplate = htmlTemplate + `
</body>
       	            <script src="vendor/jquery/jquery.min.js"></script>
            <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
            <script src="js/clean-blog.min.js"></script>
            <script src="../main.js"></script>
            <script src="../article.js"></script>
        </body>
        </html>

       `;
          res.send(htmlTemplate);
});	

app.get('/login.html', function(req, res){
    res.sendFile(path.join(__dirname, 'ui', 'login.html'));
});

app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "users" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                
                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                req.session.username = req.body.username;
                console.log(req.session.auth);
                console.log(req.session.username);
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});

app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "users" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout', function (req, res) {
   delete req.session.auth;
   delete req.session.username;
   res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});


// Make this into a app.get !!!
function get_comments(){
     pool.query('SELECT * from comments ORDER BY comment_id desc', function(err, results){
        if (err){
            return(err.toString());
        } else {
                comments = results.rows;
        }
    });
}

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

app.get('/getUser/:username', function (req, res) {
   var username = req.params.username;
   pool.query("SELECT username, displaypic FROM users WHERE username=$1", [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(result.rows[0]);
      }
   });
});

function get_users() {
    pool.query('SELECT username, displaypic from users ', function(err, results){
        if (err){
            return(err.toString());
        } else {
            if (results.rows.length === 0 ) {
                // return(err.toString());
            } else {
                users = results.rows;
            }
        }
    });
}

function findUser(username) {
    get_users();
    console.log("username = "+username);
    var found = null;
    for (var i = 0; i < users.length; i++) {
        var element = users[i];

        if (element.username == username) {
           found = element;
       } 
    }
    console.log(found);
    return found;
}

function testdb(){
  var config = {
    user: process.env.IMADUSER || 'tjsooxajhxixee',
    database: process.env.IMADDB || 'd4e5rlrk922mmk',
    password: process.env.IMADPASSWORD || '4E-4rvokYpmN-16-1U3FFBtvD4',
    host: process.env.IMADHOST || 'ec2-54-228-219-40.eu-west-1.compute.amazonaws.com',
    port: '5432',
    ssl: true
  };
  return config;
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
            <link href='//fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
            <link href='//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
            <link href="../css/modal.css" rel="stylesheet">
        </head>
        <body>
            <nav class="navbar navbar-default navbar-custom navbar-fixed-top">
                <div class="container-fluid">
                    <div class="navbar-header page-scroll">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span class="sr-only">Toggle navigation</span>    <i class="fa fa-bars"></i>
                        </button>
                        <a class="navbar-brand" href="/">Vishal</a>
                    </div>
                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul class="nav navbar-nav navbar-right">
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>
                                <a href="/about">About</a>
                            </li>
                            <li>
                                <a href="/contact">Contact</a>
                            </li>
                            <li>
                                <a id="loginnavbar" data-toggle="modal" data-target="#login-modal" href="#">Login/Register</a>
                            </li>
                            <li>
                                <a id="logoutnavbar" onclick="logout()" href="">Logout</a>
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

            
            for (var postID=posts.length-1; postID>=0; postID--){
                var title = posts[postID].post_title;
                var subtitle = posts[postID].post_subtitle;
                var author = posts[postID].post_author;
                var date = (posts[postID].post_date).toDateString();

                htmlTemplate = htmlTemplate + `

                 <div class="post-preview">
                            <a href="posts/${postID}">
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

            <!-- Ask to login/register -->
                <!-- Modal -->
                <div id="login-modal" class="modal fade" role="dialog">
                  <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content">
                      <div class="modal-body">
                        <div class="container-fluid">
                             <div class="row">
                                 <div class="">
                                        <div class="form-body">
                                            <ul class="nav nav-tabs final-login">
                                                <li class="active"><a class="btn btn-sm" data-toggle="tab" href="#sectionA">Existing User</a></li>
                                                <li><a class="btn btn-sm" data-toggle="tab" href="#sectionB">New User</a></li>
                                            </ul>
                                            <div class="tab-content">
                                                <div id="sectionA" class="tab-pane fade in active">
                                                    <div class="innter-form">
                                                        <form class="sa-innate-form" method="post">
                                                            <label>Username</label>
                                                            <input type="text" id="username">
                                                            <label>Password</label>
                                                            <input type="password" id="password">
                                                            <button type="button" class="btn btn-info btn-sm" id="login_btn">Sign In</button>
                                                        </form>
                                                    </div>
                                                    <div class="clearfix"></div>
                                                </div>
                                                <div id="sectionB" class="tab-pane fade">
                                                    <div class="innter-form">
                                                        <form class="sa-innate-form" method="post">
                                                            <label>New Username</label>
                                                            <input type="text" id="new_username">
                                                            <label>New Password</label>
                                                            <input type="password" id="new_password">
                                                            <button type="button" class="btn btn-info btn-sm" id="register_btn">Register</button>
                                                        </form>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                      </div>
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
                            <p class="copyright text-muted">This website has been visited <b><span id="counter"></span></b> times since inception.</p>
                        </div>
                    </div>
                </div>
            </footer>
            <script src="vendor/jquery/jquery.min.js"></script>
            <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
            <script src="js/clean-blog.min.js"></script>
            <script src="../main.js"></script>
            <script src="../article.js"></script>
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

    var htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${title}</title>
            <link href="../vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
            <link href="../css/clean-blog.min.css" rel="stylesheet">
            <link href="../vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
            <link href='//fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
            <link href='//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
            <link href="../css/post-comment.css" rel="stylesheet">
            <link href="../css/modal.css" rel="stylesheet">
        </head>
        <body>
            <nav class="navbar navbar-default navbar-custom navbar-fixed-top">
                <div class="container-fluid">
                    <div class="navbar-header page-scroll">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span class="sr-only">Toggle navigation</span>
                            <i class="fa fa-bars"></i>
                        </button>
                        <a class="navbar-brand" href="/">Vishal</a>
                    </div>
                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul class="nav navbar-nav navbar-right">
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>
                                <a href="/about">About</a>
                            </li>
                            <li>
                                <a href="/contact">Contact</a>
                            </li>
                            <li>
                                <a id="loginnavbar" data-toggle="modal" data-target="#login-modal" href="#">Login/Register</a>
                            </li>
                            <li>
                              <a id="logoutnavbar" onclick="logout()" href="">Logout</a>
                          </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <header class="intro-header" style="background-image: url('../img/post-bg.jpg')">
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
            `;

            if (postID == 0) {
            htmlTemplate = htmlTemplate +   
                ` 
                <div class="container">
                    <ul class="pager">
                        <li class="previous">
                            <a href="${parseInt(postID)+1}">&larr; Newer Post </a>
                        </li>
                        </ul>
                </div>
                `;
            }
            else if (postID == posts.length - 1) {
                htmlTemplate = htmlTemplate +
                `
                <div class="container">
                    <ul class="pager">
                        <li class="next">
                            <a style="overflow-wrap: break-word;" href="${parseInt(postID)-1}">Older Post &rarr;</a>
                        </li>
                    </ul>
                </div>    
                `;
            }
            else{
                htmlTemplate = htmlTemplate +
                `
                <div class="container">
                    <ul class="pager">
                        <li class="previous">
                            <a href="${parseInt(postID)+1}">&larr; Newer Post </a>
                        </li>
                        <li class="next">
                            <a href="${parseInt(postID)-1}">Older Post &rarr;</a>
                        </li>
                    </ul>
                </div> 
                `;
            }
            <!-- Comments of the Post -->
            <!-- Fetch comment from DB -->

            htmlTemplate = htmlTemplate +
            `
                <!-- Ask to login/register -->
                <!-- Modal -->
                <div id="login-modal" class="modal fade" role="dialog">
                  <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content">
                      <div class="modal-body">
                        <div class="container-fluid">
                             <div class="row">
                                 <div class="">
                                        <div class="form-body">
                                            <ul class="nav nav-tabs final-login">
                                                <li class="active"><a class="btn btn-sm" data-toggle="tab" href="#sectionA">Existing User</a></li>
                                                <li><a class="btn btn-sm"  data-toggle="tab" href="#sectionB">New User</a></li>
                                            </ul>
                                            <div class="tab-content">
                                                <div id="sectionA" class="tab-pane fade in active">
                                                    <div class="innter-form">
                                                        <form class="sa-innate-form" method="post">
                                                            <label>Username</label>
                                                            <input type="text" id="username">
                                                            <label>Password</label>
                                                            <input type="password" id="password">
                                                            <button type="button" class="btn btn-info btn-sm" id="login_btn">Sign In</button>
                                                        </form>
                                                    </div>
                                                    <div class="clearfix"></div>
                                                </div>
                                                <div id="sectionB" class="tab-pane fade">
                                                    <div class="innter-form">
                                                        <form class="sa-innate-form" method="post">
                                                            <label>New Username</label>
                                                            <input type="text" id="new_username">
                                                            <label>New Password</label>
                                                            <input type="password" id="new_password">
                                                            <button type="button" class="btn btn-info btn-sm" id="register_btn">Register</button>
                                                        </form>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                      </div>
                    </div>

                  </div>
                </div>
                

                <!-- Trigger the modal with a button -->

                <div class="container" id="asklogin">
                    <div class="row">
                        <div class="col-sm-8 col-sm-offset-2">            
                            <br><br>
                            <button type="button" class="btn btn-info btn-sm btn-block" data-toggle="modal" data-target="#login-modal">Login<span class="hide"> to comment!</span></button>
                            <br><br>
                        </div>
                    </div>
                </div>


           <!-- Comment box -->
                <div class="container" id="commentbox">
                    <div class="row">
                        <div class="col-md-8 col-md-offset-2">
                            <div class="panel panel-white post panel-shadow">
                                <div class="post-heading" style="height: 280px; min-height: 250px; overflow-wrap: break-word;">
                                    <div class="pull-left image">
                                        <img id="newdisplaypic" src="http://bootdey.com/img/Content/user_1.jpg" class="img-circle avatar" alt="user profile image">
                                    </div>
                                    <div class="col-xs-8 meta">
                                        <form>
                                             <div class="form-group"> 
                                               <textarea class="form-control" rows="5" id="commentContent" placeholder="Your comment here"></textarea>
                                             </div>
                                             <button type="button" id="submitComment" class="btn btn-default">Submit</button>
                                             <button type="button" id="logout_btn" class="btn btn-default">LogOut</button>
                                        </form>
                                    </div> 
                                </div>
                            
	                            <div class="container" id="commentdone" style="display: none">
									<div class="row">
										<div class="col-sm-4 col-sm-offset-1 alert alert-info alert-dismissible fade in" role="alert" style="padding-top: 5px; padding-bottom: 5px;">
											<button type="button" class="close" data-dismiss="alert" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
											<strong>Done!</strong> Posted successfully.
										</div>
	                        		</div>
	                    		</div>
	                    		<div class="container" id="commenterror" style="display: none">
									<div class="row">
										<div class="col-sm-4 col-sm-offset-1 alert alert-danger alert-dismissible fade in" role="alert" style="padding-top: 5px; padding-bottom: 5px;">
											<button type="button" class="close" data-dismiss="alert" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
											<strong>Error!</strong> Could not post.
										</div>
	                        		</div>
	                    		</div>
	                   		</div>
                   		</div>
                   	</div>
                   </div> 

                   <div class="container">
                    <div class="row" id="new_comment">
                     
            `;
            for (var i = 0; i < comments.length; i++) {
                if (comments[i].post_id === parseInt(postID)){ 
                  htmlTemplate = htmlTemplate +  `
                   <div class="col-sm-8 col-sm-offset-2">
                        <div class="panel panel-white post panel-shadow">
                            <div class="post-heading">
                                <div class="pull-left image">
                                    <a href=/user/`+comments[i].comment_author+`><img src="http://bootdey.com/img/Content/user_`+findUser(comments[i].comment_author).displaypic+`.jpg" class="img-circle avatar" alt="user profile image"></a>
                                </div>
                                <div class="pull-left meta">
                                    <div class="title h5">
                                        <a href=/user/`+comments[i].comment_author+`><b>`+comments[i].comment_author+`</b></a> made a comment.
                                    </div>
                                    <h6 class="text-muted time">`+(comments[i].comment_date).toGMTString()+`</h6>
                                </div>
                            </div> 
                            <div class="post-description"> 
                                <p>`+comments[i].comment_content+`</p>
                            </div>
                        </div>
                    </div>
                            
                       ` ;
                   }
               }

                htmlTemplate = htmlTemplate + `
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
                                <p class="copyright text-muted">This website has been visited <b><span id="counter"></span></b> times since inception.</p>
                            </div>
                        </div>
                    </div>
                </footer>
                <script src="../vendor/jquery/jquery.min.js"></script>
                <script src="../vendor/bootstrap/js/bootstrap.min.js"></script>
                <script src="../js/clean-blog.min.js"></script>
                <script src="../article.js"></script>
                <script src="../main.js"></script>
            </body>
            </html>`;
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
        // config.password = 
        console.log(`DB details : `+config.user, config.host, config.port);
        console.log(`IMAD course app listening on port ${port}!`);
});
