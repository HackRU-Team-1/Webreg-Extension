(function refresh() {
    var x = document.getElementsByClassName("instructors");
	var iframe = document.getElementById("iframe2"); // for WebReg
	if (iframe != null) { // if iframe exists (w++ebreg), then get that info
		var iframewindow = iframe.contentWindow? iframe.contentWindow : iframe.contentDocument.defaultView;
		x = iframewindow.document.getElementsByClassName("instructors");
	}
	
	
	//console.log(x.length);
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
		var x = document.getElementsByClassName("instructors");
	}
	
	//Webreg requires access to an iframe
	var aboveiframe;
	
	if(onWR){
		aboveiframe = document;
		var iframe = document.getElementById("iframe2");		
		if (iframe != null) {
			var iframewindow = iframe.contentWindow? iframe.contentWindow : iframe.contentDocument.defaultView;
			x = iframewindow.document.getElementsByClassName("instructors");
		}		
	}
	
	//If on CSP, has to get td elements and filter out non-instructors instead
	if(onCSP){
		var csp = document.getElementsByTagName("td");	
		x = Array.prototype.slice.call(csp);		
		for(var h = 0; h < x.length; h++){
			if(x[h].getAttribute("title") == "Instructor"){
				continue;
			}
			x.splice(h, 1);
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
		if(onWR){
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
	} else {
		if(document.getElementsByTagName("select")[2] != null){
			var a = document.getElementsByTagName("select")[2];
			departmentName = a.options[a.selectedIndex].innerHTML.substring(5,a.length);
		}
		
	}
	
    console.log( "refreshed");	
	//Loop through list that was chosen above
    for (i = 0; (x!=null) && i < x.length; i++) {
	    if (x[i].hasChildNodes() && x[i].childNodes.length < 2) {
			
			//This element will hold the instructors score
			var score = document.createElement("span");
			
			//Determine formatting based on site
			if(onWR || onSOC){
				score.id = "score";
				score.style.width = "50px";
				score.style.height = "24px";
				score.style.background = "#CF1D32";
				score.style.paddingTop = "10px";
				score.style.paddingBottom = "5px";
				score.style.marginLeft = "20px";
			}else if (onCSP){
				score.id = "score";
				score.style.width = "50px";
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
			var lastName = x[i].innerHTML;
			//console.log(lastName);
			//console.log(lastName.length);
			lastName = lastName.toLowerCase();
			
			
			//TBD is used as a placeholder some times
			if (lastName == "tbd"){
				continue;
			}
			
			//This code extracts the last name from a string, based on two rules
			//1. If it is formatted as LASTNAME, FIRSTINITIAL.
			//2. If it is formatted as LASTNAME
			//3. If it is formatted as FIRSTINITIAL. LASTNAME
			//Else, remove all punctuation
			var firstInitial = "";
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
			
			console.log("LAST NAME: " + lastName + ". FIRST INITIAL: " + firstInitial);
			
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
			link.innerHTML = "Search";
			link.style.color = "#FFFFFF";
			link.style.horizontalAlign = "middle";
			link.style.verticalAlign = "middle";
			link.style.textDecoration = "none";
			link.marginBottom = "10px";			
			
			link.href = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=rutgers&queryoption=HEADER&query=" + lastName + "&facetSearch=true";
			
			//alert("right before eventPage");
			
			console.log(lastName + " " + firstInitial + " " + departmentName);
			
			chrome.runtime.sendMessage({oldURL: link.href, lastName: lastName, firstInitial: firstInitial, departmentName: departmentName}, function(response) {
				//alert(showRatingsLink); //should print newURL in console
				//alert("after eventPage");
				//alert(response.mainScore);
				link.innerHTML = response.mainScore;
				link.href = response.newURL;
			});
			
			link.target = "_blank";	
	
			//Add the link to score
			score.appendChild(link);
	
			
			console.log(lastName);
			console.log(lastName.length);
			
			//Add the score to the instructors
			x[i].appendChild(score);
		}
    }	

	
	setTimeout(refresh, 1000);
})();

function httpGet(theUrl) {
	var xmlHttp = null;		
	xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, false);
	xmlHttp.send(null);
	return xmlHttp.responseText; 
}
// MAKE THIS SMARTER
// Right now, get first professor in list
function getProfessorUrl(resultString) {
	var index = resultString.contains("listing PROFESSOR"); //gets index of first occurrence of this class
	if (index == -1) //if there are no professors in the list, return #
		return "#";
		
	var start = index;
	for (start; resultString.charAt(start) != "/"; start++) {} //
	var end = start;
	while(resultString.charAt(end) != "\""){
		end++;
	}
	return resultString.substring(start,end);
	
	
	return newURL; // Returns URL of best 
}
