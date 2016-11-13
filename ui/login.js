var login_btn = document.getElementById('login_btn');
var username = document.getElementById('username');
var password = document.getElementById('password');

if (login_btn) {
	login_btn.onclick = function(){
		var req = new XMLHttpRequest();	
		req.onreadystatechange = function(){
			if(req.readyState === XMLHttpRequest.DONE){
				// Do something
				if (req.status === 200){
					console.log('user logged in');
					alert('user logged in');
				} else if (req.status === 403) {
					alert('username/password is incorrect');
				} else if (req.status === 500) {
					alert('something went wrong!');
				}
			}
		};
		username = document.getElementById('username').value;
		password = document.getElementById('password').value;
		console.log(username);
		console.log(password);
		req.open("POST", window.location.protocol+"//"+window.location.host+"/login", true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.send(JSON.stringify({username: username, password: password}));
	}
}