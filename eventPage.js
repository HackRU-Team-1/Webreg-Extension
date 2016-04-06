chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {	
	
	if (request.Action == "getID") {
	    //call chrome identity API
	    chrome.identity.getProfileUserInfo( function(userInfo) {
	        //userInfo holds email and id
	        //userInfo.id is lifelong and unique
	        sendResponse({Id: userInfo.id});
	    });
	    return true; //necessary for callback
	}

	if (request.Action == "isIdValid") {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = "https://apis.google.com/js/client.js?onload=callbackFunction";
       
        head.appendChild(script);
       
        gapi.client.setApiKey("AIzaSyB3ypAa-ZzGXr_xeihh5Nxxs3WDE3Og92A");
        gapi.client.load('plus', 'v1', function() {
          gapi.client.plus.people.get( {'userId' : request.Id} ).execute(function(resp) {
            // Shows profile information
            sendResponse({Response: resp});
          })
        });
        return true;
    }

	if(request.Action != null && request.Action === "post"){
		var status = post(request.Url, request.Json);
		sendResponse({Data: "No Data", Status: status});
		return;
	}
	//Parameters:
	// request.oldURL
	// request.firstInitial
	// Gets ratingsLink
	var ratingsLink = "not found";
	ratingsLink = findListingProf(request.oldURL, request.lastName, request.firstInitial, request.departmentName);
	
	//If there are no Matches, put X.X
	if (ratingsLink == "not found") {
		sendResponse({mainScore: "X.X", hScore: "0", cScore: "0", eScore: "0", avGrade: "F", fullName: request.lastName, newURL: request.oldURL, isMatch: false});		
	}
	// If there are more than 1 match, put ?.?
	else if (ratingsLink == "multiple matches") {
		sendResponse({mainScore: "?.?", hScore: "0", cScore: "0", eScore: "0", avGrade: "F", fullName: request.lastName, newURL: request.oldURL, isMatch: false});
	}
	
	var responseArr = findScores(ratingsLink);
	
	//If rateMyProf profile exists, but has not been created
	if (responseArr[0] == "not found") {
		sendResponse({mainScore: "X.X", hScore: "0", cScore: "0", eScore: "0", avGrade: "F", fullName: request.lastName, newURL: request.oldURL, isMatch: false});
	}
	/*alert("made it!");
	alert(responseArr[0]);
	alert(responseArr[1]);
	alert(responseArr[2]);
	alert(responseArr[3]);
	alert(responseArr[4]);
	alert(responseArr[5]);*/
	//sendResponse({mainScore: "0", hScore: "0", cScore: "0", eScore: "0", avGrade: "F", isMatch: false}); //for testing
	//Responses:
	// mainScore
	// hScore
	// cScore
	// eScore
	// avGrade
	// isMatch: boolean; true if there's only 1 match, false if there's 0 or multiple matches
	sendResponse({mainScore: responseArr[0], hScore: responseArr[1], cScore: responseArr[2], eScore: responseArr[3], avGrade: responseArr[4], fullName: responseArr[5], newURL: ratingsLink, isMatch: true});
	
});

function findListingProf(myURL, lastName, firstInitial, departmentName) {
		//alert("1 " + lastName);
		var xmlhttp = new XMLHttpRequest();
		var showRatingsLink = "not found";
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				//alert("3 " + lastName);
				// make fake div, search through it 
				var div = document.createElement('div');
				var tempName; //Stores prof's name
				var index = new Array();
				//var index = 0; //Saves the index in which the match takes place
				var numMatches = 0; //Checks if there's multiple profs with same first initial
				div.innerHTML = xmlhttp.responseText;
				
				//alert("1. " + myURL + " " + lastName + " " + firstInitial + " " + departmentName);
				var listingProfs = div.getElementsByClassName("listing PROFESSOR");
				if(listingProfs.length == 0){
					showRatingsLink = "not found";
					return;
				}
				
				// MAKE THIS CHECKER BETTER
				// Traverse through each name and check if first initial of first name and last name matches to instructor's name
				for (var i = 0; i < listingProfs.length; i++) {
					var reComma = listingProfs[i].getElementsByClassName("main")[0].innerHTML.split(", ",2);
					//if (firstInitial.length == 1) {
					//	if (reComma[1].charAt(0).toLowerCase() == firstInitial && reComma[0].toLowerCase() == lastName) {
					//		index.push(i);
					//		numMatches++;
					//	}
					//} 
					if (firstInitial != "not found") {
						if (reComma[1].toLowerCase().indexOf(firstInitial) == 0 && reComma[0].toLowerCase() == lastName) {
							index.push(i);
							numMatches++;
						}
					}
					else {
						if (reComma[0].toLowerCase() == lastName) {
							index.push(i);
							numMatches++;
						}
					}
				}
				
				//alert(numMatches);
				if (numMatches > 1) {
					// Last second check between departmentNames if there are multiple matches
					for (var i = 0; i < index.length; i++) {
						if (listingProfs[index[i]].getElementsByClassName("sub")[0].innerHTML.toLowerCase().indexOf(departmentName.toLowerCase()) != -1) {
							index[0] = index[i];
							numMatches = 1;
							break;
						}
					}
					if (numMatches > 1) {
						showRatingsLink = "multiple matches";
						return; //return not found if there are more than 1 match or there are 0 matches
					}
				}
				
				
				// get first listing PROFESSOR for now
				
				showRatingsLink = listingProfs[index[0]].getElementsByTagName("a")[0].getAttribute("href");
				
				
				showRatingsLink = "http://www.ratemyprofessors.com" + showRatingsLink;
				
				//alert(showRatingsLink);
				//alert("2. " + myURL + " " + lastName + " " + firstInitial + " " + departmentName);
				return; //return ratingsLink URL
			}
		}
		//alert("2 " + lastName);
		xmlhttp.open("GET", myURL, false);
		xmlhttp.send();
		return showRatingsLink;
		//return xmlhttp.onreadystatechange();
}

	

function findScores(myURL) {
	//alert(myURL);
	var xmlhttp = new XMLHttpRequest();
	var responseArr = ["not found", "not found"];
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			
			// make fake div, search through it
			var div = document.createElement('div');
			
			var mainScore; //Stores Overall Quality Score
			var hScore; //Stores Helpfulness Score
			var cScore; //Stores Clarity Score
			var eScore; //Stores Easiness Score
			var avGrade; //Stores Average Grade
			var fullName;
			
			div.innerHTML = xmlhttp.responseText;
			
			// First we get the overall grade and average grade
			var grades = div.getElementsByClassName("grade");
			
			if (grades.length == 0) { // Their page has not been setup yet (no comments, grades, photos, etc
				responseArr = ["not found", "not found"];
				return;
			}
			
			mainScore = grades[0].innerHTML;
			avGrade = grades[1].innerHTML;
			
			// Second, we get the secondary scores
			var ratings = div.getElementsByClassName("rating");
			
			hScore = ratings[0].innerHTML;
			cScore = ratings[1].innerHTML;
			eScore = ratings[2].innerHTML;
			
			// Third, get full name
			fullName = div.getElementsByClassName("pfname")[0].innerHTML.trim() + " " + div.getElementsByClassName("plname")[0].innerHTML.trim();
			
			responseArr = [mainScore, hScore, cScore, eScore, avGrade, fullName];
			
			//alert(mainScore);
			//alert(responseArr[0]);
			
			//var responseArr = [0, 0, 0, 0, 0];
			return; //return responseArr
		}
	}
		xmlhttp.open("GET", myURL, false );
		xmlhttp.send(); 
		return responseArr;

}

function post(url, json){

	var string = json;
	xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onreadystatechange = function () {
		var jsonparsed;
		if (xhr.readyState == 4){
	    	
		}
	};
	xhr.send(string);
	return xhr.status;
}
