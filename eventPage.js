chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {	
<<<<<<< HEAD
	var newURL = httpGet(request.oldURL);	
	sendResponse({newURL: newURL});	
=======
	//Parameters:
	// request.oldURL
	// request.firstInitial
	
	//alert("hulloh");
	// Gets ratingsLink
	//alert(request.firstInitial);
	
	var ratingsLink = findListingProf(request.oldURL, request.firstInitial);
	alert(ratingsLink);
	
	//sendResponse({mainScore: "0", hScore: "0", cScore: "0", eScore: "0", avGrade: "F", isMatch: false}); //for testing
	
	//If ratingsLink is empty
	if (!ratingsLink) {
		alert("It's empty");
		sendResponse({mainScore: "0", hScore: "0", cScore: "0", eScore: "0", avGrade: "F", fullName: "NaN", isMatch: false});
	}
	
	var responseArr = findScores(ratingsLink);
	alert("made it!");
	alert(responseArr[0]);
	alert(responseArr[1]);
	alert(responseArr[2]);
	alert(responseArr[3]);
	alert(responseArr[4]);
	alert(responseArr[5]);
	//sendResponse({mainScore: "0", hScore: "0", cScore: "0", eScore: "0", avGrade: "F", isMatch: false}); //for testing
	//Responses:
	// mainScore
	// hScore
	// cScore
	// eScore
	// avGrade
	// isMatch: boolean; true if there's only 1 match, false if there's 0 or multiple matches
	sendResponse({mainScore: responseArr[0], hScore: responseArr[1], cScore: responseArr[2], eScore: responseArr[3], avGrade: responseArr[4], fullName: responseArr[5], isMatch: true});
	
>>>>>>> 6721efc2a9e4755766d67316371c05561cd0da00
});

function findListingProf(myURL, firstInitial) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				// make fake div, search through it 
				var div = document.createElement('div');
				var tempName; //Stores prof's name
				var index; //Saves the index in which the match takes place
				var numMatches = 0; //Checks if there's multiple profs with same first initial
				div.innerHTML = xmlhttp.responseText;
				
				var listingProfs = div.getElementsByClassName("listing PROFESSOR");
				
				// Traverse through each name and check if first initial of first name matches to instructor's name
				for (var i = 0; i < listingProfs.length; i++) {
					var reComma = listingProfs[i].getElementsByClassName("main")[0].innerHTML.split(", ",2);
					if (reComma[1].charAt(0).toLowerCase() == firstInitial) {
						index = i;
						numMatches++;
					}
				}
				//alert(numMatches);
				if (numMatches != 1) {
					return ""; //return null if there are more than 1 match or there are 0 matches
				}
				
				
				// get first listing PROFESSOR for now
				var showRatingsLink = listingProfs[index].getElementsByTagName("a")[0].getAttribute("href");
				
				showRatingsLink = "http://www.ratemyprofessors.com" + showRatingsLink;
				
				//alert(showRatingsLink);
				
				return showRatingsLink; //return ratingsLink URL
			}
		}
		xmlhttp.open("GET", myURL, false );
		xmlhttp.send(); 
		return xmlhttp.onreadystatechange();
<<<<<<< HEAD
}
=======
	}

function findScores(myURL) {
	var xmlhttp = new XMLHttpRequest();
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
			mainScore = grades[0].innerHTML;
			avGrade = grades[1].innerHTML;
			
			// Second, we get the secondary scores
			var ratings = div.getElementsByClassName("rating");
			
			hScore = ratings[0].innerHTML;
			cScore = ratings[1].innerHTML;
			eScore = ratings[2].innerHTML;
			
			// Third, get full name
			fullName = div.getElementsByClassName("pfname")[0].innerHTML.trim() + " " + div.getElementsByClassName("plname")[0].innerHTML.trim();
			
			var responseArr = [mainScore, hScore, cScore, eScore, avGrade, fullName];
			
			//alert(mainScore);
			//alert(responseArr[0]);
			
			//var responseArr = [0, 0, 0, 0, 0];
			return responseArr; //return responseArr
		}
	}
		xmlhttp.open("GET", myURL, false );
		xmlhttp.send(); 
		return xmlhttp.onreadystatechange();

	}
>>>>>>> 6721efc2a9e4755766d67316371c05561cd0da00
