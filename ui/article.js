function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

/*------------------------------- Article/Post Comment Submission ---------------------------------*/

var submitComment = document.getElementById('submitComment');
var post_id = window.location.pathname.replace('/posts/','');

var commentAuthor;
var commentContent;
var date=new Date();



/* Comment Submit endpoint
   Function 1 - Bind enter key to Submit button click
   Function 2 - Submit the comment on click
   */
   if (submitComment) {

   	$(document).ready(function(){	
   		$(document).bind('keypress', function(e) {
   			if(e.keyCode==13 && !e.shiftKey){
   				// e.preventDefault();
   				commentContent = escapeHtml(document.getElementById('commentContent').value);
   				if (commentContent.trim() === '') {
   					$("#commentContent").val("");
   					$("#commentContent").attr("placeholder", "Comment is required !");
   				} else {
   				$('#submitComment').trigger('click');
   			}
   		}
   		});
   	});




   	submitComment.onclick = function(){
   		commentContent = escapeHtml(document.getElementById('commentContent').value);
   		commentContent = commentContent.trim();
   		var date = new Date();
   		console.log(date);

   		if (commentContent.trim()	 === '') {
   			$(document).bind('keypress', function(e) {
	   			if(e.keyCode==13 && !e.shiftKey){
	   				// e.preventDefault();
	   			}
   			});
   			$("#commentContent").val("");
   			$("#commentContent").attr("placeholder", "Comment is required !");
   		
   		} else {
   			var req2 = new XMLHttpRequest();
   			req2.onreadystatechange = function(){
   				if(req2.readyState === XMLHttpRequest.DONE) {
   					if (req2.status === 400) {
   						alert("You're not logged in!");	
   					} else if (req2.status === 200) {

   						commentAuthor = req2.responseText;
   						
   						var req3 = new XMLHttpRequest();

						req3.onreadystatechange = function(){
							if(req3.readyState === XMLHttpRequest.DONE) {
			   					if (req3.status === 200) {
			   						// console.log(req3.responseText);
			   						var new_comment = document.getElementById('new_comment');
			   						$("#new_comment").removeAttr("style");
			   						$("#commentContent").val("");
			   						$('#commentdone').fadeIn();
			   						setTimeout(function() {
			   							$('#commentdone').fadeOut();
			   						}, 1500);

			   						new_comment.innerHTML = `
			   							<div class="col-sm-8 col-sm-offset-2">
			   								<div class="panel panel-white post panel-shadow">
			   									<div class="post-heading">
			   										<div class="pull-left image">
			   											<img src="http://bootdey.com/img/Content/user_`+JSON.parse(req3.responseText).displaypic+`.jpg" class="img-circle avatar" alt="user profile image">
			   										</div>
				   									<div class="pull-left meta">
				   										<div class="title h5">
				   											<a href="/user/${commentAuthor}" id="author"><b>${commentAuthor}</b></a>
				   										</div>
				   										<h6 class="text-muted time">${date.toGMTString()}</h6>
				   									</div> 
				   									</div>
				   									<div class="post-description"> 
				   										<p>${commentContent}</p>
				   									</div>
				   								</div>
				   							</div>
			   						` + new_comment.innerHTML;
			   					} else {
			   						console.log(req3.status);
			   						$('#commenterror').fadeIn();
			   						setTimeout(function() {
			   							$('#commenterror').fadeOut();
			   						}, 1500);
			   					}
			   				}
		   				}

		   				req3.open("GET", window.location.protocol+"//"+window.location.host+"/getUser/"+commentAuthor, true);
						req3.send(null);

   					}
   					document.getElementById('submitComment').innerHTML="Submit";
   				}
   			};
			req2.open("GET", window.location.protocol+"//"+window.location.host+"/submit-comment/"+post_id+"?content="+escapeHtml(commentContent), true);
			req2.send(null);	
			document.getElementById('submitComment').innerHTML="Submitting..."	
			}
		}
	}



	/*------------------------------- Show comment box only if logged in ---------------------------------*/


function setdisplaypic(username){
		var req = new XMLHttpRequest();	
		req.onreadystatechange = function(){
			if(req.readyState === XMLHttpRequest.DONE){
				if (req.status === 200){
					$('#newdisplaypic').attr("src","http://bootdey.com/img/Content/user_"+JSON.parse(req.responseText).displaypic+".jpg");
					console.log(JSON.parse(req.responseText).displaypic);
				} 
			}
		};
		
		req.open("GET", window.location.protocol+"//"+window.location.host+"/getUser/"+username, true);
		req.send(null);

		// return 
}


	function checklogin() {
		var req = new XMLHttpRequest();	

		req.onreadystatechange = function(){
			if(req.readyState === XMLHttpRequest.DONE){
				// Do something
				if (req.status === 200){
					$("#login-modal").modal("hide");
					$('#asklogin').hide();
					$('#commentbox').show();
					$('#loginnavbar').hide();
					$('#logoutnavbar').show();
					setdisplaypic(req.responseText);
					console.log('user logged in');
				} else {
					$('#logoutnavbar').hide();
					$('#loginnavbar').show();
					$('#asklogin').show();
					$('#commentbox').hide();
				}		
			}
		};

		req.open("GET", window.location.protocol+"//"+window.location.host+"/check-login", true);
		req.send(null);
	}

	$(document).ready(checklogin);