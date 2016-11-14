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
			}
		};
		username = document.getElementById('username').value;
		password = document.getElementById('password').value;
		req.open("POST", window.location.protocol+"//"+window.location.host+"/login", true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.send(JSON.stringify({username: username, password: password}));
	}
}



if (register_btn) {
	register_btn.onclick = function(){
		var req = new XMLHttpRequest();
		var req2 = new XMLHttpRequest();	
		req.onreadystatechange = function(){
			if(req.readyState === XMLHttpRequest.DONE){
				// Do something
				if (req.status === 200){
					// req2.open("POST", window.location.protocol+"//"+window.location.host+"/login", true);
					// req2.setRequestHeader('Content-Type', 'application/json');
					// req2.send(JSON.stringify({username: username, password: password}));
					// if(req2.readyState === XMLHttpRequest.DONE){
					// 	// Do something
					// 	if (req2.status === 200){
					// 		console.log('New user created!');
							document.getElementById('username').value = document.getElementById('new_username').value;
							document.getElementById('password').value = document.getElementById('new_password').value;
							document.getElementById('new_username').value = '';
							document.getElementById('new_password').value = '';
							alert('New user created!');
							$('#login_btn').click();
					// 		checklogin();
					// 	}
					// }
				} else if (req.status === 403) {
					alert('username/password is incorrect');
				} else if (req.status === 500) {
					console.log('username = '+new_username);
					console.log('password = '+new_password);
					alert('username already exists!');
				}
			}
		};
		new_username = document.getElementById('new_username').value;
		new_password = document.getElementById('new_password').value;
		console.log(new_username);
		console.log(new_password);
		req.open("POST", window.location.protocol+"//"+window.location.host+"/create-user", true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.send(JSON.stringify({username: new_username, password: new_password}));
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