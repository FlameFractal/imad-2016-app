var submitComment = document.getElementById('submitComment');
var post_id = window.location.pathname;
var commentAuthor = document.getElementById('commentAuthor');
var commentContent = document.getElementById('commentContent');


var list = document.getElementById('list');
var return_names;
var name_list;

// window.onload=function(){
	//Request for the COUNTER API endpoint
	var req = new XMLHttpRequest();	
	req.onreadystatechange = function(){
		if(req.readyState === XMLHttpRequest.DONE && req.status === 200) {
			var count = req.responseText;
			var counter = document.getElementById('counter');
			counter.innerHTML = count.toString();
		}
	};
	req.open("GET", "https://"+window.location.host+"/counter", true);
	req.send(null);

// }

submitComment.onclick = function(){
	//Comment Submit endpoint

	post_id = window.location.pathname;
	commentAuthor = document.getElementById('commentAuthor').value;
	commentContent = document.getElementById('commentContent').value;

	if (commentAuthor === '' || commentContent === '') {
		if (commentAuthor === '') {
			$("#commentAuthor").attr("placeholder", "Name is required !");
		}
		if (commentContent === '') {
			$("#commentContent").attr("placeholder", "Comment is required !");
		}

	} else {
	var req2 = new XMLHttpRequest();
	req2.onreadystatechange = function(){
		if(req2.readyState === XMLHttpRequest.DONE && req2.status === 200) {
			var new_comment = document.getElementById('new_comment');
			$("#new_comment").removeAttr("style");
			$("#commentAuthor").val("");
			$("#commentContent").val("");
			new_comment.outerHTML = `
                   <div class="row"> 
                    <div class="col-md-8 col-md-offset-2">
                        <div class="panel panel-white post panel-shadow">
                            <div class="post-heading">
                                <div class="pull-left image">
                                    <img src="http://bootdey.com/img/Content/user_`+(Math.floor(Math.random() * (3)) + 1)+`.jpg" class="img-circle avatar" alt="user profile image">
                                </div>
                                <div class="pull-left meta">
                                    <div class="title h5">
                                        <a href="#" id="author"><b>${commentAuthor}</b></a>
                                        commented.
                                    </div>
                                </div> 
                                <div class="post-description"> 
                                    <p>${commentContent}</p>
                                </div>
                            </div>
                        </div>
                    </div>
               </div>

            <div class="row" style="visibility:hidden" id="new_comment">
                <!-- space for new comment -->
          

			`

		}
	};
	req2.open("GET", "http://"+window.location.host+"/submit-name"+post_id+"?author="+encodeURI(commentAuthor)+"&content"+encodeURI(commentContent), true);
	req2.send(null);		
	}
}