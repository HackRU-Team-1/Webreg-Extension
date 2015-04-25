chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {	
	var newURL = httpGet(request.oldURL);	
	sendResponse({newURL: newURL});	
});

function httpGet(myURL) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				//alert(xmlhttp.responseText);
				//alert(xmlhttp.responseXML);
				
				/* make fake div, search through it */
				var div = document.createElement('div');
				div.innerHTML = xmlhttp.responseText;
				
				var listingProfs = div.getElementsByClassName("listing PROFESSOR");
				
				var showRatingsLink = listingProfs[0].getElementsByTagName("a")[0].getAttribute("href");
				
				alert(showRatingsLink);
				
				return xmlhttp.responseText;
			}
		}
		xmlhttp.open("GET", myURL, false );
		xmlhttp.send(); 
		return xmlhttp.onreadystatechange();
}