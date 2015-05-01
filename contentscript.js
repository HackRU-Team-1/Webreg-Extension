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
    console.log( "refreshed");	
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
			console.log("1: " + lastName + " " + link.innerHTML + " : " + link.href + " " + linkIndex + " " + firstInitial);
			chrome.runtime.sendMessage({oldURL: link1, lastName: lastName, firstInitial: firstInitial, departmentName: departmentName}, function(response) {
				
        //alert(showRatingsLink); //should print newURL in console
				//alert("after eventPage");
				//alert(response.mainScore);
				console.log(response.fullName + " : " + response.isMatch);
				// I don't think we even need response.isMatch anymore for this part.
				// mainScore stores X.X or ?.? in addition to regular score when needed.
				if(response.isMatch){
					links[linkIndex].innerHTML = response.mainScore;
					//links[linkIndex].innerHTML = response.fullName;
					links[linkIndex].href = response.newURL;
					  //hover window
					  $('span#score'+linkIndex).hover(function(){
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
				
				
				console.log(linkIndex);
				linkIndex++;
				//console.log("2: " + lastName + " " + links[linkIndex].innerHTML + " : " + links[linkIndex].href + " " + linkIndex);
							
				
			});
			//sleep(1000);
			console.log("3: " + lastName + " " + link.innerHTML + " : " + link.href + " " + linkIndex);
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


