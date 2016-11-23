/*----------------Prevent spaces in inputs ----------------*/

$(document).ready(function(){		
	$("#username").on("keydown", function (e) {
	    return e.which !== 32;
	});
	$("#password").on("keydown", function (e) {
	    return e.which !== 32;
	});
	$("#new_username").on("keydown", function (e) {
	    return e.which !== 32;
	});
	$("#new_password").on("keydown", function (e) {
	    return e.which !== 32;
	});
});

/*-------------------------------Request for the COUNTER API endpoint---------------------------------*/

var counter = document.getElementById('counter');

if (counter) {
	var req = new XMLHttpRequest();	
	req.onreadystatechange = function(){
		if(req.readyState === XMLHttpRequest.DONE && req.status === 200) {
			var count = req.responseText;
			var counter = document.getElementById('counter');
			counter.innerHTML = count.toString();
		}
	};
	req.open("GET", window.location.protocol+"//"+window.location.host+"/counter", true);
	req.send(null);
}




/*-------------------------------Login JS---------------------------------*/


var register_btn = document.getElementById('register_btn');
var login_btn = document.getElementById('login_btn');
var logout_btn = document.getElementById('logout_btn');
var username = document.getElementById('username');
var password = document.getElementById('password');
var new_username = document.getElementById('new_username');
var new_password = document.getElementById('new_password');

if (login_btn) {
	login_btn.onclick = function(){
			username = document.getElementById('username').value;
		password = document.getElementById('password').value;
		if (username.trim() === '' || password.trim() === '') {
			$("#username").val("");
			$("#password").val("");
   					$("#username").attr("placeholder", "Required !");
   					$("#password").attr("placeholder", "Required !");
   				} else {
					var req = new XMLHttpRequest();	
					req.onreadystatechange = function(){
						if(req.readyState === XMLHttpRequest.DONE){
							// Do something
							if (req.status === 200){
								console.log('user logged in');
								console.log(username);
								console.log(password);
								checklogin();
							} else if (req.status === 403) {
								alert('username/password is incorrect or does not exist!');
							} else if (req.status === 500) {
								alert('username does not exist!');
							}
							document.getElementById('login_btn').innerHTML="Log In";
						}
					};
		
		
		req.open("POST", window.location.protocol+"//"+window.location.host+"/login", true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.send(JSON.stringify({username: username, password: password}));
		document.getElementById('login_btn').innerHTML="Logging In...";
		}
	}
}



if (register_btn) {
	register_btn.onclick = function(){
			new_username = escapeHtml(document.getElementById('new_username').value);
		new_password = escapeHtml(document.getElementById('new_password').value);

		var req = new XMLHttpRequest();
		var req2 = new XMLHttpRequest();
		if (new_username.trim() === '' || new_password.trim() === '') {
					$("#new_username").val("");
					$("#new_password").val("");
   					$("#new_username").attr("placeholder", "Required !");
   					$("#new_password").attr("placeholder", "Required !");
   				} else {	
				req.onreadystatechange = function(){
					if(req.readyState === XMLHttpRequest.DONE){
				// Do something
				if (req.status === 200){
							document.getElementById('username').value = document.getElementById('new_username').value;
							document.getElementById('password').value = document.getElementById('new_password').value;
							document.getElementById('new_username').value = '';
							document.getElementById('new_password').value = '';
							alert('New user created!');
							$('#login_btn').click();
				} else if (req.status === 403) {
					alert('username/password is incorrect');
				} else if (req.status === 500) {
					console.log('username = '+new_username);
					console.log('password = '+new_password);
					alert('username already exists!');
				}
				document.getElementById('register_btn').innerHTML="Register";
			}
		};
			console.log(new_username);
		console.log(new_password);
		req.open("POST", window.location.protocol+"//"+window.location.host+"/create-user", true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.send(JSON.stringify({username: new_username, password: new_password}));
		document.getElementById('register_btn').innerHTML="Creating user...";
	}
		
	}
}






if (logout_btn) {
	$('#logout_btn')[0].onclick = logout;
	checklogin();
}


function logout(){
	var req = new XMLHttpRequest();	
		req.onreadystatechange = function(){
			if(req.readyState === XMLHttpRequest.DONE){
				// Do something
				if (req.status === 200){
					console.log('user logged out');
					checklogin();
				} else if (req.status === 403) {
					alert('username/password is incorrect!');
				} else if (req.status === 500) {
					alert('username/password is incorrect!');
				}
			}
		};
		req.open("GET", window.location.protocol+"//"+window.location.host+"/logout", true);
		req.send(null);
}



function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
