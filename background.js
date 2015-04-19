chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	if(message.method == 'setCheck')
		checkToggle = message.check;
	
	console.log("Inside onMessage Listener");
	if (request.action == "xhttp") {
		var xhttp = new XMLHttpRequest();
		var method = request.method ? request.method.toUperrCase() : 'GET';
		
		xhttp.onload = function() {
			callback(xhttp.responseText);
		};
		xhttp.onerror = function() {
            // Do whatever you want on error. Don't forget to invoke the
            // callback to clean up the communication port.
            callback();
        };
        xhttp.open(method, request.url, true);
        if (method == 'POST') {
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
		var resultString = xhttp.responseText;
		var index = resultString.contains("listing PROFESSOR"); //gets index of first occurrence of this class
		if (index == -1) //if there are no professors in the list, return #
			return "#";
			
		var start = index;
		for (start; resultString.charAt(start) != "/"; start++) {} //
		var end = start;
		while(resultString.charAt(end) != "\""){
			end++;
		}
		
        xhttp.send(resultString.substring(start,end));
		sendresponse({result: resultString.substring(start,end)}); //sends back to the call in contentscript
        return true; // prevents the callback from being called too early on return
    }
});