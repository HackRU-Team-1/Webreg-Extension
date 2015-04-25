chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	/*
	$.get(request.oldURL, function(responseText) {
		var index = responseText.contains("listing PROFESSOR"); //gets index of first occurrence of this class
		alert(index);
		alert(responseText);
	});
	*/
	/*
	var data1 = 0;
	$.ajax({ url: request.oldURL, success: function(data) {
		alert(data);
		sendResponse({newURL: data});
		data1 = data;
		//myFunction(myArr);
	} });
	*/
	/*
	var xhr = new XMLHttpRequest();
	xhr.open('GET', request.oldURL, true);
	xhr.send(null);
	alert(xhr.responseText); 
	*/
	/*
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			alert(xmlhttp.responseText);
			//return xmlhttp.responseText;
			sender(xmlhttp.responseText);
		}
	};
	xmlhttp.open("GET", request.oldURL, false );
	xmlhttp.send();  
	
	function mySender(data) {
		alert(data);
	}
	*/
	
	var newURL = httpGet(request.oldURL);
	
	//alert(newURL); //THIS ALERT WORKS
	// newURL isn't a string....?
	var index = newURL.contains("listing PROFESSOR");
	//alert(index); 
	//document.write(httpGet(request.oldURL));
	//console.log("We're outside function");
	//console.log(document.getElementsByClassName("listing PROFESSOR"));
	//document.write(httpGet(response.oldURL));
	//console.log(newHTML.getElementsByClassName("listing PROFESSOR"));
	
	//document.write(httpGet(request.oldURL));
	sendResponse({newURL: "hulloh"});
	
});

function httpGet(myURL) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				//alert(xmlhttp.responseText);
				//alert(xmlhttp.responseXML);
				return xmlhttp.responseText;
			}
		}
		xmlhttp.open("GET", myURL, false );
		xmlhttp.send(); 
		return xmlhttp.onreadystatechange();
	}