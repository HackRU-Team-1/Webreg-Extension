//if(document.getElementById('span').classList.contains("instructors")) {
    
//}
//var list is every span element in the document
/*
var x = document.getElementsByClassName("instructors");
var i;
alert( x.length );
for (i = 0; i < x.length; i++) {
    x[i].style.backgroundColor = "red";
	alert( x.length );
}
*/
(function refresh() {
    var x = document.getElementsByClassName("instructors");
	var iframe = document.getElementById("iframe2"); // for WebReg
	if (iframe != null) { // if iframe exists (webreg), then get that info
		var iframewindow = iframe.contentWindow? iframe.contentWindow : iframe.contentDocument.defaultView;
		x = iframewindow.document.getElementsByClassName("instructors");
	}
	//console.log(x.length);
	var csp = document.getElementsByTagName("td");
	
	var onCSP = false;
	var onSOC = false;
	var onWR = false;
	
	var cspArr = Array.prototype.slice.call(csp);
	
	if(window.location.href.indexOf("/webreg/") > -1){
		onWR = true;
	}	
	if(window.location.href.indexOf("/soc/") > -1){
		onSOC = true;
	}
	if(window.location.href.indexOf("/csp/") > -1){
		onCSP = true;
	}
	
	for(var h = 0; h < cspArr.length; h++){
		if(cspArr[h].getAttribute("title") == "Instructor"){
			//console.log("found instructor");
			continue;
		}
		cspArr.splice(h, 1);
		if(h>0){
			h--;
		}
	}
	//console.log("post splice:" + cspArr.length);
	/*
	if(cspArr.length <= 0){
		console.log( "onCSP" );		
		onCSP = true;
	}*/
    var i;
    console.log( "refreshed" );
    for (i = 0; i < x.length && !onCSP; i++) {
	    if (x[i].hasChildNodes() && x[i].childNodes.length < 2) {
			//x[i].style.backgroundColor = "red";
			//var head = document.getElementsByTagName('head')[0];
			//var link = document.createElement('link');
			//link.rel = "stylesheet";
			//link.href = "stylesheet.css";
			var score = document.createElement("span");
			score.id = "score";
			//score.style.width = "23px";
			score.style.width = "50px";
			score.style.height = "24px";
			//score.style.border = "1px";
			//score.style.color = "white";
			score.style.background = "#CF1D32";
			//score.style.horizontalAlign = "middle";
			//score.style.verticalAlign = "middle";
			score.style.paddingTop = "10px";
			score.style.paddingBottom = "5px";
			score.style.marginLeft = "20px";
			//score.innerHTML = "5.0";
			
			score.style.fontSize = "15px";
			//score.style.fontFamily = "Alternate-Gothic";
			//score.innerHTML.font-style = "bold";
			// score.value = value from API
			var lastName = x[i].innerHTML;
			console.log(lastName);
			console.log(lastName.length);
			lastName = lastName.toLowerCase();
			
			if (lastName == "TBD")
				continue;
			
			var reComma = lastName.split(",",1);
			if (reComma[0].indexOf(".") != -1) {
				var rePeriod = lastName.split(".",2); //split on period and space
				lastName = rePeriod[1]; //This will hold the last name after period and space
			}
			else {
				lastName = reComma[0]; //This will hold the last name before comma (if exists)
			}
			
			if (lastName.charAt(0) == " ") {  //To prevent inconsistencies from Webreg
				lastName = lastName.substring(1, lastName.length);
			}
			
			var link = document.createElement("a");
			//link.innerHTML = "5.0";
			link.innerHTML = "Search";
			link.style.color = "#FFFFFF";
			link.style.horizontalAlign = "middle";
			link.style.verticalAlign = "middle";
			link.style.textDecoration = "none";
			link.marginBottom = "10px";
			
			
			
			
			link.href = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=rutgers&queryoption=HEADER&query=" + lastName + "&facetSearch=true";
			/*$.ajax({
				url: link.href,
			 
				// The name of the callback parameter, as specified by the YQL service
				jsonp: "callback",
			 
				// Tell jQuery we're expecting JSONP
				dataType: "jsonp",
			 
				// Tell YQL what we want and that we want JSON
				data: {
					q: "select title,abstract,url from search.news where query=\"cat\"",
					format: "json"
				},
			 
				// Work with the response
				success: function( response ) {
					console.log( response ); // server response
				}
			});
			*/
			// This command will go to eventPage and send oldURL
					
			chrome.runtime.sendMessage({oldURL: link.href}, function(response) {
				console.log(response.newURL); //should print newURL in console
			});
			
			link.target = "_blank";
			/*chrome.runtime.sendMessage({url: link.href}, function(response) {
				console.log(response.result);
				console.log("Inside chrome.runtime.sendMessage");
			});
			*/
			/*
			chrome.runtime.sendMessage({
				method: 'POST',
				action: 'xhttp',
				url: link.href,
				data: 'q=something'
			}, function(responseText) {
				// Callback function to deal with the response
				link.href = "http://www.ratemyprofessors.com" + responseText;
				console.log(responseText);
				score.appendChild(link);
			});
			*/
			/*var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("GET",link.href, false);
			
			xmlhttp.onreadystatechange=function() {
			  if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			  // do stuff here
			    console.log("Inside onreadystatechange");
			    var resultString = httpGet(link.href); //holds String of html at href
				var profUrl = getProfessorUrl(resultString);
			
				link.href = "http://www.ratemyprofessors.com" + profURL;
			  }
			}
			*/
			/*var resultString = httpGet(link.href); //holds String of html at href
			var profUrl = getProfessorUrl(resultString);
			
			link.href = "https://www.ratemyprofessors.com" + responseText;
			*/
			score.appendChild(link);
			
			
			/*score.onclick=function(){
				var win = window.open(text.getchild.href); //PROBLEM HERE: opens link to last professor on page
				if (win) {
					win.focus();
				} else {
					console.log("heyyyyy");
				}
			};*/
			
			console.log(lastName);
			console.log(lastName.length);
			
			x[i].appendChild(score);
		}
    }
	
	
	for (i = 0; i < cspArr.length && onCSP; i++) {		
	    if (cspArr[i].hasChildNodes() && cspArr[i].childNodes.length < 2) {
			//x[i].style.backgroundColor = "red";
			//var head = document.getElementsByTagName('head')[0];
			//var link = document.createElement('link');
			//link.rel = "stylesheet";
			//link.href = "stylesheet.css";
			var score = document.createElement("span");
			score.id = "score";
			//score.style.width = "23px";
			score.style.width = "50px";
			score.style.height = "24px";
			//score.style.border = "1px";
			//score.style.color = "white";
			score.style.background = "#CF1D32";
			//score.style.horizontalAlign = "middle";
			//score.style.verticalAlign = "middle";
			score.style.paddingTop = "10px";
			score.style.paddingBottom = "12px";
			score.style.paddingLeft= "10px";
			score.style.paddingRight = "10px";
			score.style.marginLeft = "10px";
			
			//score.innerHTML = "5.0";
			
			score.style.fontSize = "15px";
			//score.style.fontFamily = "Alternate-Gothic";
			//score.innerHTML.font-style = "bold";
			// score.value = value from API
			var lastName = cspArr[i].innerHTML;
			console.log(lastName);
			console.log(lastName.length);
			lastName = lastName.toLowerCase();
			
			if (lastName == "TBD")
				continue;
			
			var reComma = lastName.split(",",1);
			if (reComma[0].indexOf(".") != -1) {
				var rePeriod = lastName.split(".",2); //split on period and space
				lastName = rePeriod[1]; //This will hold the last name after period and space
			}
			else {
				lastName = reComma[0]; //This will hold the last name before comma (if exists)
			}
			
			if (lastName.charAt(0) == " ") {  //To prevent inconsistencies from Webreg
				lastName = lastName.substring(1, lastName.length);
			}
			
			var link = document.createElement("a");
			//link.innerHTML = "5.0";
			link.innerHTML = "Search";
			link.style.color = "#FFFFFF";
			link.style.horizontalAlign = "middle";
			link.style.verticalAlign = "middle";
			link.style.textDecoration = "none";
			link.marginBottom = "10px";
			
			
			
			
			link.href = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=rutgers&queryoption=HEADER&query=" + lastName + "&facetSearch=true";
			link.target = "_blank";
			/*chrome.runtime.sendMessage({url: link.href}, function(response) {
				console.log(response.result);
				console.log("Inside chrome.runtime.sendMessage");
			});
			*/
			/*
			chrome.runtime.sendMessage({
				method: 'POST',
				action: 'xhttp',
				url: link.href,
				data: 'q=something'
			}, function(responseText) {
				// Callback function to deal with the response
				link.href = "http://www.ratemyprofessors.com" + responseText;
				console.log(responseText);
				score.appendChild(link);
			});
			*/
			/*var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("GET",link.href, false);
			
			xmlhttp.onreadystatechange=function() {
			  if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			  // do stuff here
			    console.log("Inside onreadystatechange");
			    var resultString = httpGet(link.href); //holds String of html at href
				var profUrl = getProfessorUrl(resultString);
			
				link.href = "http://www.ratemyprofessors.com" + profURL;
			  }
			}
			*/
			/*var resultString = httpGet(link.href); //holds String of html at href
			var profUrl = getProfessorUrl(resultString);
			
			link.href = "https://www.ratemyprofessors.com" + responseText;
			*/
			score.appendChild(link);
			
			
			/*score.onclick=function(){
				var win = window.open(text.getchild.href); //PROBLEM HERE: opens link to last professor on page
				if (win) {
					win.focus();
				} else {
					console.log("heyyyyy");
				}
			};*/
			
			console.log(lastName);
			console.log(lastName.length);
			
			cspArr[i].appendChild(score);
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
/*
var list = document.getElementByClassName("tabmenu");
alert( list.length );
//This loop traverses the list variable	
list.item(0).style.color = "red";
for(var i = 0; i < list.length; i++){
	//chrome.extension.sendRequest('alert, alert, u r the coolest. beep boop', function(response_str) {alert(response_str);});
	//This if statement checks if the span element is an instructor
		var name = list.item(i).innerText;
		//Checks if the name is empty
		if(name){
			//if(name.toLowerCase = "kelly"){
			//chrome.extension.sendRequest('alert, alert, u r the coolest. beep boop', function(response_str) {alert(response_str);});
				list.item(i).innerText = "5.0";
			//}			
		}
	}
}
*/

    
