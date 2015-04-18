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
    var i;
    console.log( "refreshed" );
    for (i = 0; i < x.length; i++) {
	    if (x[i].hasChildNodes() && x[i].childNodes.length < 2) {
			//x[i].style.backgroundColor = "red";
			//var head = document.getElementsByTagName('head')[0];
			//var link = document.createElement('link');
			//link.rel = "stylesheet";
			//link.href = "stylesheet.css";
			var score = document.createElement("span");
			score.style.width = "20px";
			score.style.height = "25px";
			//score.style.border = "1px";
			score.style.color = "white";
			score.style.background = "#CF1D32";
			score.style.horizontalAlign = "middle";
			score.style.verticalAlign = "middle";
			score.style.paddingTop = "10px";
			score.style.marginLeft = "30px";
			//score.style.font-size = "15px";
			//score.href = "#";
			//score.style = "width:50px;height:50px;border:1px solid #000";
			score.innerHTML = "5.0";
			score.style.fontSize = "20px";
			//score.style.fontFamily = "Alternate-Gothic";
			//score.innerHTML.font-style = "bold";
			// score.value = value from API
			var lastName = x[i].value.toLowerCase;
			var i;
			for(i = 0; i < lastName.length; i++){
				if(lastName.charAt(i) == ','){
					lastName = lastName.substring(0,i);
					break;
				}
			}
			
			x[i].appendChild(score);
		}
    }
	setTimeout(refresh, 1000);
})();

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

    
