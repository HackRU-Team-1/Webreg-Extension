var realid = null;

(function refresh() {

    var instructors = document.getElementsByClassName("instructors");
	var iframe = document.getElementById("iframe2"); // for WebReg
	if (iframe != null) { // if iframe exists (w++ebreg), then get that info
		var iframewindow = iframe.contentWindow? iframe.contentWindow : iframe.contentDocument.defaultView;
		instructors = iframewindow.document.getElementsByClassName("instructors");
	}
	
	
	//console.log(instructors.length);
	var csp = document.getElementsByTagName("td");
	
	//Checks what website we're on
	var onCSP = false;
	var onSOC = false;
	var onWR = false;
	
	if(window.location.href.indexOf("/webreg/") > -1){
		onWR = true;
	}	
	if(window.location.href.indexOf("/soc/") > -1){
		onSOC = true;
	}
	if(window.location.href.indexOf("/csp/") > -1){
		onCSP = true;
	}
	
	
	//Creates list based on current website
	if(onSOC){
		var instructors = document.getElementsByClassName("instructors");
	}
	
	//Webreg requires access to an iframe
	var aboveiframe;
	
	if(onWR){
		aboveiframe = document;
		var iframe = document.getElementById("iframe2");		
		if (iframe != null) {
			var iframewindow = iframe.contentWindow? iframe.contentWindow : iframe.contentDocument.defaultView;
			instructors = iframewindow.document.getElementsByClassName("instructors");
		}
	}
	
	//If on CSP, has to get td elements and filter out non-instructors instead
	if(onCSP){
		var csp = document.getElementsByTagName("td");	
		instructors = Array.prototype.slice.call(csp);		
		for(var h = 0; h < instructors.length; h++){
			if(instructors[h].getAttribute("title") == "Instructor"){
				continue;
			}
			instructors.splice(h, 1);
			if(h>0){
				h--;
			}
		}
	}
	
    var i;
	//Extracts department name from SOC.
	var currentDoc = document;
	var departmentName;
	if(onWR || onSOC){
		if(iframewindow != null && onWR){
			currentDoc = iframewindow.document;
		}		
		var department = currentDoc.getElementById("subjectTitle");
		if(department != null){
			//Gets the HTML and looks through it for the department name. The name starts at the 45th character
			department = department.innerHTML;			
			var semic = 45;
			var paren;
			for(paren = 0; paren < department.length; paren++){
				//Go until the first paren, which occurs so we know the department name is over. Then take a substring.
				if(department.charAt(paren) == '('){					
					departmentName = department.substring(semic,paren - 1);
					//Replace ampersand code with actual ampersands					
					departmentName = departmentName.split("&amp;").join("&");
					break;
				}
			}
		}
	} else if(onCSP){
		if(document.getElementsByTagName("select")[2] != null){
			var a = document.getElementsByTagName("select")[2];
			departmentName = a.options[a.selectedIndex].innerHTML.substring(5,a.length);
		}
		
	}
	var check = 0;
    //console.log( "refreshed");	
	//Loop through list that was chosen above
	var links = new Array();
	var linkIndex = 0;
	var scoreIndex = 0;
    for (i = 0; (instructors!=null) && i < instructors.length; i++) {
	    if (instructors[i].hasChildNodes() && instructors[i].childNodes.length < 2) {
			
			//This element will hold the instructors score
			var score = document.createElement("span");
			//Determine formatting based on site
			if(onWR || onSOC){
				score.id = "score";
				score.style.width = "24px";
				//score.style.width = "50px";
				score.style.height = "24px";
				score.style.background = "#CF1D32";
				score.style.paddingTop = "10px";
				score.style.paddingBottom = "5px";
				score.style.marginLeft = "20px";
			}else if (onCSP){
				score.id = "score";
				score.style.width = "24px";
				//score.style.width = "50px";
				score.style.height = "24px";
				score.style.background = "#CF1D32";
				score.style.paddingTop = "10px";
				score.style.paddingBottom = "12px";
				score.style.paddingLeft= "10px";
				score.style.paddingRight = "10px";
				score.style.marginLeft = "10px";
			}
      
			
			score.style.fontSize = "15px";
			
			//Get lastname from current element
			var lastName = instructors[i].innerHTML;

			var profname1 = lastName;
			//console.log(lastName);
			//console.log(lastName.length);
			lastName = lastName.toLowerCase();
			
			
			//TBD is used as a placeholder some times
			if (lastName == "tbd" || lastName == "."){
				continue;
			}
			
			//This code extracts the last name from a string, based on two rules
			//1. If it is formatted as LASTNAME, FIRSTINITIAL.
			//2. If it is formatted as LASTNAME
			//3. If it is formatted as FIRSTINITIAL. LASTNAME
			//Else, remove all punctuation
			var firstInitial = "not found";
			var reComma = lastName.split(",");
			
			//reComma is now an array, holding the two halves of the lastName, split around a comma. We use [0] in the next line to access the first half
			//Case 3
			if (reComma[0].indexOf(".") != -1) {
				var rePeriod = lastName.split(".",2); //split on period and space
				firstInitial = rePeriod[0];
				lastName = rePeriod[1]; //This will hold the last name after period and space
			}
			//Case 1,2
			else {
				if(reComma.length > 1){
					firstInitial = reComma[1].split('.')[0].trim();
				}
				lastName = reComma[0]; //This will hold the last name before comma (if exists)
			}			
			if (lastName.charAt(0) == " ") {  //To prevent inconsistencies from Webreg
				lastName = lastName.substring(1, lastName.length);
			}
			
			//console.log("LAST NAME: " + lastName + ". FIRST INITIAL: " + firstInitial);
			
			//Remove excess punctuation
			var stringInc;
			for(stringInc = 0; stringInc < lastName.length; stringInc++){
				var lex = lastName.charAt(stringInc)-'a';
				if(lex <0 || lex >= 26){
					lastName = lastName.slice(0, stringInc) + lastName.slice(stringInc+1, lastName.length);
					if(stringInc>0){
						stringInc--;
					}
				}
			}			
			
			//Create the link to the ratemyprofessors search
			var link = document.createElement("a");
			link.innerHTML = ".....";
			link.style.color = "#FFFFFF";
			link.style.horizontalAlign = "middle";
			link.style.verticalAlign = "middle";
			link.style.textDecoration = "none";
			link.marginBottom = "10px";
			
			var link1 = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=rutgers&queryoption=HEADER&query=" + lastName + "&facetSearch=true";
			link.href = link1;
			links.push(link);
			score.id = "score" + scoreIndex;
			scoreIndex++;
			//scores.push(score);
			//alert("right before eventPage");
			
			//console.log(lastName + " " + firstInitial + " " + departmentName);
			//console.log("1: " + lastName + " " + link.innerHTML + " : " + link.href + " " + linkIndex + " " + firstInitial);
			chrome.runtime.sendMessage({oldURL: link1, lastName: lastName, firstInitial: firstInitial, departmentName: departmentName}, function(response) {
				
        //alert(showRatingsLink); //should print newURL in console
				//alert("after eventPage");
				//alert(response.mainScore);
				//console.log(response.fullName);
				// I don't think we even need response.isMatch anymore for this part.
				// mainScore stores X.X or ?.? in addition to regular score when needed.
				if(response.isMatch){
					links[linkIndex].innerHTML = response.mainScore;
					//links[linkIndex].innerHTML = response.fullName;
					links[linkIndex].href = response.newURL;
					  //hover window
					  $('span#score'+linkIndex).hover(function(){
						//console.log("We're in WEBREG!!!!");
						if($(this).hasClass("hovered")){
						}else{
						  var scorePos = getPosition(this);
						  var xOffset = -67;
						  var yOffset = -113;
						  var yPos = scorePos.y+yOffset;
						  var xPos = scorePos.x+xOffset;
						  //var yPos = scorePos.y;
						  //var xPos = scorePos.x;
						  //score color code
						  if(parseFloat(response.hScore) >= 3.5){
							var hColor = "#66CC00";
						  }else if(parseFloat(response.hScore) >= 2.5){
							var hColor = "#E0C92A";
						  }else{
							var hColor = "#CF1D32";
						  }
						  if(response.eScore >= 3.5){
							var eColor = "#66CC00";
						  }else if(response.eScore >= 2.5){
							var eColor = "#E0C92A";
						  }else{
							var eColor = "#CF1D32";
						  }
						  if(response.cScore >= 3.5){
							var cColor = "#66CC00";
						  }else if(response.cScore >= 2.5){
							var cColor = "#E0C92A";
						  }else{
							var cColor = "#CF1D32";
						  }
						  var gColor;
						  if(response.avGrade.charAt(0) == 'A'){
							  gColor = "#66CC00";
						  } else if(response.avGrade.charAt(0) == 'B'){
							  gColor = "#66CC00";
						  } else if (response.avGrade.charAt(0) == 'C'){
							  gColor = "#E0C92A";
						  } else if (response.avGrade.charAt(0) == 'D' || response.avGrade.charAt(0) == 'E' || response.avGrade.charAt(0) == 'F'){
							  gColor = "#CF1D32";
						  } else {
							  gColor = "#A15595";
						  }
						  $(this).prepend("<div class=\"fpo-info-bubble\" style=\"left:" + xPos + "px;top:" + yPos +"px;\"> <div class=\"text\"> <div id=\"professor-name\"> <center> <a href=\"\" style=\"color:#C20F2F;\">" + response.fullName + "</a> </center> </div> <div id=\"helpfulness\"> Helpfulness <div id=\"help-score\" class=\"score\" style=\"background-color:" + hColor + ";\"><center>"+ response.hScore+"</center></div> </div> <div id=\"clarity\"> Clarity <div id=\"clarity-score\" class=\"score\" style=\"background-color:"+cColor+";\"><center>"+response.cScore+"</center></div> </div> <div id=\"easiness\"> Easiness <div id=\"easy-score\" class=\"score\" style=\"background-color:"+eColor+";\"><center>"+response.eScore+"</center></div> </div> <div id=\"average-grade\"> Average Grade <div id=\"average-grade-score\" class=\"score\" style=\"background-color:"+gColor+";\"><center>"+response.avGrade+"</center></div> </div> </div> </div>");
						  $(this).toggleClass("hovered");
						}
					  }, function(){
						  $('.fpo-info-bubble').remove();
						  $(this).toggleClass("hovered");
					  });
				} else {
					links[linkIndex].href = response.newURL;
					links[linkIndex].innerHTML = response.mainScore; // Will store X.X or ?.? accordingly
				}
				//console.log("precolor: " + links[linkIndex].innerText + " " + links[linkIndex].parentNode.innerHTML);
				
				// We could use isMatch for this if statement to simplify it. Since we don't need it for the above any more
				if(links[linkIndex].innerText!= "X.X" && links[linkIndex].innerText != "?.?"){
					if(parseFloat(links[linkIndex].innerText) >= 3.5){
						//console.log("1=");
						links[linkIndex].parentNode.style.background = "#66CC00";
					} else if(parseFloat(links[linkIndex].innerText) >= 2.5){
						//console.log("2=");
						links[linkIndex].parentNode.style.background = "#E0C92A";
					} else {
						//console.log("3=");
						links[linkIndex].parentNode.style.background = "#CF1D32";
					}
				} else {
					if(links[linkIndex].innerText != "X.X"){
						links[linkIndex].parentNode.style.background = "#892A7A";
					} else {
						links[linkIndex].parentNode.style.background = "#2A3A89";
					}
				}
				
				
				//console.log(linkIndex);
				linkIndex++;
				//console.log("2: " + lastName + " " + links[linkIndex].innerHTML + " : " + links[linkIndex].href + " " + linkIndex);
							
				
			});
			//sleep(1000);
			//console.log("3: " + lastName + " " + link.innerHTML + " : " + link.href + " " + linkIndex);
			link.target = "_blank";	
	
			//Add the link to score
			score.appendChild(link);
	
			
			//console.log(lastName);
			//console.log(lastName.length);
			
			//Add the score to the instructors
			var attach = instructors[i];
			if(onCSP){
				attach = instructors[i].previousSibling.previousSibling;
				instructors[i].appendChild(document.createElement("scoreAdded"));
			}
			attach.appendChild(score);
			instructors[i].style += "margin-right: 80px;";

		 	var url = "http://raritan.herokuapp.com/fpo/1/Rutgers%20University%20-%20New%20Brunswick/";
		 	var deptname = encodeURIComponent(toTitleCase(departmentName));
		 	url += deptname + "/";
		 	var profname = encodeURIComponent(toTitleCase(profname1));
		 	url += profname;
			/*
		 	chrome.runtime.sendMessage({Action: "post", Json: null, Url: url}, function(response){
				
			});
			*/



			var vote = document.createElement("input");
			vote.type = "image";
			vote.src = "http://i.imgur.com/pdAqymT.png";
			vote.width="40";
			vote.height="28";
			vote.style="margin-left: 10px; top: 7px; margin-right: 20px; position: relative;";
	
			vote.profname = lastName;
			vote.fullname = profname1;

			vote.onclick= function(){
				var form = document.createElement("div");
				form.id="myModal";
				form.class = "modal";
				document.body.appendChild(form);

				document.getElementById("myModal").innerHTML = "<div class=\"modal-content\">    	<span class=\"close\">X</span>    <div class=\"rating\">	    <div class=\"titlerow\">				  <div class =\"title\"><div id=\"profname\" class=\"prof\"></div><div id=\"deptname\" class=\"dept\"></div></div>		    </div>		<div class=\"ratings\">			<div class = \"tagsexplan unselectable\">Rate this professor:</div>				  	<div class =\"score1 unselectable\">Easiness</div>			<div class = \"ratings-row-1\">					<form id=\"form1\" action=\"\">					<!--					<img src = \"http://i.imgur.com/zl9ShM2.png\" width = \"15\" height = \"15\" title = \"Clear\" class=\"reseti\"></img>					<input class = \"reset\" type=\"reset\" value=\"Reset\" id=\"reset1\">					-->					<span class=\"starRating\">												<input id=\"rating5\" type=\"radio\" name=\"rating1\" value=\"5\">							<label for=\"rating5\">5</label>							<input id=\"rating4\" type=\"radio\" name=\"rating1\" value=\"4\">							<label for=\"rating4\">4</label>							<input id=\"rating3\" type=\"radio\" name=\"rating1\" value=\"3\">							<label for=\"rating3\">3</label>							<input id=\"rating2\" type=\"radio\" name=\"rating1\" value=\"2\">							<label for=\"rating2\">2</label>							<input id=\"rating1\" type=\"radio\" name=\"rating1\" value=\"1\">							<label for=\"rating1\">1</label>										</span>					</form>			</div>			</br>		  	<div class =\"score1 unselectable\">Clarity</div>			<div class = \"ratings-row-2\">				<form id=\"form2\" action=\"\">					<!--					<img src = \"http://i.imgur.com/zl9ShM2.png\" width = \"15\" height = \"15\" title = \"Clear\" class=\"reseti\"></img>					<input class = \"reset\" type=\"reset\" value=\"Reset\" id=\"reset2\">					-->					<span class=\"starRating\">												<input id=\"rating5-1\" type=\"radio\" name=\"rating2\" value=\"5\">							<label for=\"rating5-1\">5</label>							<input id=\"rating4-1\" type=\"radio\" name=\"rating2\" value=\"4\">							<label for=\"rating4-1\">4</label>							<input id=\"rating3-1\" type=\"radio\" name=\"rating2\" value=\"3\">							<label for=\"rating3-1\">3</label>							<input id=\"rating2-1\" type=\"radio\" name=\"rating2\" value=\"2\">							<label for=\"rating2-1\">2</label>							<input id=\"rating1-1\" type=\"radio\" name=\"rating2\" value=\"1\">							<label for=\"rating1-1\">1</label>										</span>						</form>			</div>			</br>		  	<div class =\"score1 unselectable\">Helpfulness</div>			<div class = \"ratings-row-3\">				<form id=\"form3\" action=\"\">					<!--					<img src = \"http://i.imgur.com/zl9ShM2.png\" width = \"15\" height = \"15\" title = \"Clear\" class=\"reseti\"></img>					<input class = \"reset\" type=\"reset\" value=\"Reset\" id=\"reset3\">					-->					<span class=\"starRating\">												<input id=\"rating5-2\" type=\"radio\" name=\"rating3\" value=\"5\">							<label for=\"rating5-2\">5</label>							<input id=\"rating4-2\" type=\"radio\" name=\"rating3\" value=\"4\">							<label for=\"rating4-2\">4</label>							<input id=\"rating3-2\" type=\"radio\" name=\"rating3\" value=\"3\">							<label for=\"rating3-2\">3</label>							<input id=\"rating2-2\" type=\"radio\" name=\"rating3\" value=\"2\">							<label for=\"rating2-2\">2</label>							<input id=\"rating1-2\" type=\"radio\" name=\"rating3\" value=\"1\">							<label for=\"rating1-2\">1</label>										</span>					</form>			</div>					</div>		</br>		<div class = \"tagsexplan unselectable\">Tag some traits that match this professor (optional):</div>		<div class = \"tags\">			<form id=\"form4\">						<input name='trait1' type='radio' id=\"interesting1\"/><label class=\"unselectable\" for=\"interesting1\">Boring</label>				<input name='trait1' type='radio' id=\"interesting2\"/><label class=\"unselectable\" for=\"interesting2\">Interesting</label>			</form>				<hr width=\"20%\">			<form id=\"form5\">				<input name='trait2' type='radio' id=\"work1\"/><label class=\"unselectable\" for=\"work1\">Manageable Work</label>					<input name='trait2' type='radio' id=\"work2\"/><label class=\"unselectable\" for=\"work2\">A Lot Of Work</label>			</form>				<hr width=\"20%\">			<form id=\"form6\">				<input name='trait3' type='radio' id=\"organization1\"/><label class=\"unselectable\" for=\"organization1\">Disorganized</label>				<input name='trait3' type='radio' id=\"organization2\"/><label class=\"unselectable\" for=\"organization2\">Organized</label>			</form>				<hr width=\"20%\">			<form id=\"form7\">				<input name='trait4' type='radio' id=\"pacing1\"/><label class=\"unselectable\" for=\"pacing1\">Too Slow</label>				<input name='trait4' type='radio' id=\"pacing2\"/><label class=\"unselectable\" for=\"pacing2\">Well Paced</label>				<input name='trait4' type='radio' id=\"pacing3\"/><label class=\"unselectable\" for=\"pacing3\">Too Fast</label>			</form>		</div><!--		<div class = \"review unselectable\">			Enter your review here:</br>			<textarea type=\"text\" name=\"reviewtext\" class=\"reviewtext\" maxlength=\"140\" rows=\"10\" cols=\"80\" spellcheck=\"false\"></textarea>		</div>-->		<p>		<div class = \"submitbutton\">		<button id=\"submitButton\" type=\"button\">Submit</button>		</div>	    <div id=\"status\"></div>	    <img id=\"image-result\" hidden>	</div>		<script type=\"text/javascript\">        var allRadios = document.getElementsByName('trait1');        var booRadio1;        var x = 0;        for(x = 0; x < allRadios.length; x++){            allRadios[x].onclick = function() {                if(booRadio1 == this){                    this.checked = false;                    booRadio1 = null;                }else{                    booRadio1 = this;                }            };        }        var allRadios = document.getElementsByName('trait2');        var booRadio2;        var x = 0;        for(x = 0; x < allRadios.length; x++){            allRadios[x].onclick = function() {                if(booRadio2 == this){                    this.checked = false;                    booRadio2 = null;                }else{                    booRadio2 = this;                }            };        }        var allRadios = document.getElementsByName('trait3');        var booRadio3;        var x = 0;        for(x = 0; x < allRadios.length; x++){            allRadios[x].onclick = function() {                if(booRadio3 == this){                    this.checked = false;                    booRadio3 = null;                }else{                    booRadio3 = this;                }            };        }        var allRadios = document.getElementsByName('trait4');        var booRadio4;        var x = 0;        for(x = 0; x < allRadios.length; x++){            allRadios[x].onclick = function() {                if(booRadio4 == this){                    this.checked = false;                    booRadio4 = null;                }else{                    booRadio4 = this;                }            };        }    </script>        </div>";

				var scr = document.createElement("script");
				scr.innerHTML="var allRadios = document.getElementsByName('trait1');        var booRadio1;        var x = 0;        for(x = 0; x < allRadios.length; x++){            allRadios[x].onclick = function() {                if(booRadio1 == this){                    this.checked = false;                    booRadio1 = null;                }else{                    booRadio1 = this;                }            };        }        var allRadios = document.getElementsByName('trait2');        var booRadio2;        var x = 0;        for(x = 0; x < allRadios.length; x++){            allRadios[x].onclick = function() {                if(booRadio2 == this){                    this.checked = false;                    booRadio2 = null;                }else{                    booRadio2 = this;                }            };        }        var allRadios = document.getElementsByName('trait3');        var booRadio3;        var x = 0;        for(x = 0; x < allRadios.length; x++){            allRadios[x].onclick = function() {                if(booRadio3 == this){                    this.checked = false;                    booRadio3 = null;                }else{                    booRadio3 = this;                }            };        }        var allRadios = document.getElementsByName('trait4');        var booRadio4;        var x = 0;        for(x = 0; x < allRadios.length; x++){            allRadios[x].onclick = function() {                if(booRadio4 == this){                    this.checked = false;                    booRadio4 = null;                }else{                    booRadio4 = this;                }            };        }";

				document.body.appendChild(scr);
				document.getElementById("submitButton").addEventListener("click", submit);

				var modal = document.getElementById('myModal');
				var span = document.getElementsByClassName("close")[0];
				
				modal.style = ".starRating:not(old){  position       : relative;  display        : inline-block;  width          : 7.5em;  height         : 1.5em;  overflow       : hidden;  vertical-align : bottom;}.starRating:not(old) > input{  position     : relative;  margin-right : -100%;  opacity      : 0;}.starRating:not(old) > label{  display         : block;  float           : right;  position        : relative;  background      : url('https://i.imgur.com/pjWlNKp.png');  background-size : contain;}.starRating:not(old) > label:before{  content         : '';  display         : block;  width           : 1.5em;  height          : 1.5em;  background      : url('https://i.imgur.com/Orryxmx.png');  background-size : contain;  opacity         : 0;  transition      : opacity 0.2s linear;}.starRating:not(old) > label:hover:before,.starRating:not(old) > label:hover ~ label:before,.starRating:not(:hover) > :checked ~ label:before{  opacity : 1;} display: none;    position: fixed; /* Stay in place */    z-index: 1; /* Sit on top */    left: 0;    top: 0;    width: 100%; /* Full width */    height: 100%; /* Full height */    overflow: auto; /* Enable scroll if needed */    background-color: rgb(0,0,0); /* Fallback color */    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */";

				modal.style.display = "block";
				
				document.getElementById("profname").innerHTML = toTitleCase(this.fullname).replace(/&Amp;/g, '&');

				document.getElementById("deptname").innerHTML = toTitleCase(departmentName).replace(/&Amp;/g, '&');
			

				
				span.onclick = function() {
					modal.remove();
				}
				
				window.onclick = function(event) {
					if (event.target == modal) {
						modal.remove();
					}
				}
			};

			vote.alt="Rate this professor";
			attach.appendChild(vote);
						
						
		}
    } 
    
    
    
	setTimeout(refresh, 10);
})();

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function getPosition(element) {
  var xPosition = 0;
  var yPosition = 0;

  while(element) {
      xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
      yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
      element = element.offsetParent;
  }
  return { x: xPosition, y: yPosition };

}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function submit(){

 	var form1 = document.getElementsByName('rating1');
 	var form2 = document.getElementsByName('rating2');
 	var form3 = document.getElementsByName('rating3');
 	var trait1 = document.getElementsByName('trait1');
 	var trait2 = document.getElementsByName('trait2');
 	var trait3 = document.getElementsByName('trait3');
 	var trait4 = document.getElementsByName('trait4');

 	var string = "{\"score\": {" ;

 	var check = 0;
 	var i;
 	//jank central
 	var last = false;
 	for (i = 0; i < form1.length; i++) {
 		if(form1[i].checked){
 			check++;
 			if(last){
 				string+=",";
 			}
 			last = true;
 			string+= "\"easiness\": " + (5-i).toString();
 		}
 	}
 	for (i = 0; i < form2.length; i++) {
 		if(form2[i].checked){
 			check++;
 			if(last){
 				string+=",";
 			}
 			last = true;
 			string+= "\"clarity\": " + (5-i).toString();
 		}
 	}
 	for (i = 0; i < form3.length; i++) {
 		if(form3[i].checked){
 			check++;
 			if(last){
 				string+=",";
 			}
 			last = true;
 			string+= "\"helpfulness\": " + (5-i).toString();
 		}
 	}

 	if(check < 3){
 		if(document.getElementById("lessThanThreeCheck") != null){
 			return false;
 		}
		var para1 = document.createElement("p");
		para1.id = "lessThanThreeCheck";
		para1.innerHTML = "<div class = \"tagsexplan unselectable\">Please fill in all of the star ratings.</div>";
		document.getElementById("submitButton").parentNode.appendChild(para1);
		return false;
 	}

	var loadinggif = document.createElement("img");
	loadinggif.src = "https://i.imgur.com/OYqoFS3.gif";
	loadinggif.alt = "Submitting...";
	loadinggif.id = "loadinggif";
	loadinggif.height = "50";
	loadinggif.width = "50";

	var para = document.createElement("p");

	document.getElementById("submitButton").parentNode.appendChild(para);
	document.getElementById("submitButton").parentNode.appendChild(loadinggif);

 	for (i = 0; i < trait1.length; i++) {
 		if(trait1[i].checked){
 			if(last){
 				string+=",";
 			}
 			last = true;
 			string+= "\"interesting\": ";
 			if(trait1[i].id == "interesting1"){
 				string+="1";
 			} else if(trait1[i].id == "interesting2"){
 				string+="2";
 			}
 		}
 	}
 	for (i = 0; i < trait2.length; i++) {
 		if(trait2[i].checked){
 			if(last){
 				string+=",";
 			}
 			last = true;
 			string+= "\"work\": ";
 			if(trait2[i].id == "work1"){
 				string+="2";
 			} else if(trait2[i].id == "work2"){
 				string+="3";
 			}
 		}
 	}
 	for (i = 0; i < trait3.length; i++) {
 		if(trait3[i].checked){
 			if(last){
 				string+=",";
 			}
 			last = true;
 			string+= "\"organization\": ";
 			if(trait3[i].id == "organization1"){
 				string+="1";
 			} else if(trait3[i].id == "organization2"){
 				string+="2";
 			}
 		}
 	}
 	for (i = 0; i < trait4.length; i++) {
 		if(trait4[i].checked){
 			if(last){
 				string+=",";
 			}
 			last = true;
 			string+= "\"pacing\": ";
 			if(trait4[i].id == "pacing1"){
 				string+="1";
 			} else if(trait4[i].id == "pacing2"){
 				string+="2";
 			} else if(trait4[i].id == "pacing3"){
 				string+="3";
 			}
 		}
 	}

 	string += "}, \"user_id\":\"";

	var id = null;

	if(realid != null){   
	 	post(string);		
	} else {
		chrome.runtime.sendMessage({Action: "getID"}, function(response) {
		    id = response.Id;
		    chrome.runtime.sendMessage({Action: "isIdValid", Id: id}, function(response) {
		    	if(!response){
		    	}
		        if(response.Response.code != '404'){	
					realid = id;        
				 	post(string);
		        } else {
		        }
		    });
		});
	}
}

function post(string){
	string += realid + "\"}";
 	var url = "http://raritan.herokuapp.com/fpo/1/Rutgers%20University%20-%20New%20Brunswick/";
 	var deptname = encodeURIComponent(document.getElementsByClassName("dept")[0].innerText);
 	url += deptname + "/";
 	var profname = encodeURIComponent(document.getElementsByClassName("prof")[0].innerText);
 	url += profname + "/";
 	url += "scores";
 	//url += document.getElementsByClass("title").innerText;

	chrome.runtime.sendMessage({Action: "post", Json: string, Url: url}, function(response){
		document.getElementById("loadinggif").remove();
		document.getElementById("myModal").remove();
	});
}
