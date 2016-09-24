var submit = document.getElementById('submit');

var list = document.getElementById('list');

submit.onclick = function(){
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



	var name = document.getElementById('name').value;
	var req2 = new XMLHttpRequest();

	req2.onreadystatechange = function(){
		if(req2.readyState === XMLHttpRequest.DONE && req2.status === 200) {
			var return_names = req2.responseText;
			return_names = JSON.parse(return_names);
			var name_list='';
			for (var i = 0; i<return_names.length; i++) {
				name_list = name_list + "<li>"+return_names[i]+"</li>";
			}
			list.innerHTML = name_list;
		}
	};


	req2.open("GET", document.URL+"submit-name?name="+name, true);
	req2.send(null);	
	
	
}

