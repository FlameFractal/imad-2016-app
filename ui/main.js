// var path = require('path');
var button = document.getElementById('button');

button.onclick = function(){
	var req = new XMLHttpRequest();

	req.onreadystatechange = function(){
		if(req.readyState === XMLHttpRequest.DONE && req.status === 200) {
	            var count = req.responseText;
	            var counter = document.getElementById('counter');
	            counter.innerHTML = count.toString();
	        }
	};

	req.open("GET", document.URL+"counter", true);
	req.send(null);
}