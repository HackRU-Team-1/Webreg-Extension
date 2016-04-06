/*
function submit(){

 	var form1 = document.getElementsByName('rating1');
 	var form2 = document.getElementsByName('rating2');
 	var form3 = document.getElementsByName('rating3');
 	var trait1 = document.getElementsByName('trait1');
 	var trait2 = document.getElementsByName('trait2');
 	var trait3 = document.getElementsByName('trait3');
 	var trait4 = document.getElementsByName('trait4');

 	var string = "{'score':{" ;

 	var i;
 	//jank central
 	var last = false;
 	for (i = 0; i < form1.length; i++) {
 		if(form1[i].checked){
 			if(last){
 				string+=",";
 			}
 			last = true;
 			string+= "easiness: " + (5-i).toString();
 		}
 	}
 	for (i = 0; i < form2.length; i++) {
 		if(form2[i].checked){
 			if(last){
 				string+=",";
 			}
 			last = true;
 			string+= "clarity: " + (5-i).toString();
 		}
 	}
 	for (i = 0; i < form3.length; i++) {
 		if(form3[i].checked){
 			if(last){
 				string+=",";
 			}
 			last = true;
 			string+= "helpfulness: " + (5-i).toString();
 		}
 	}
 	for (i = 0; i < trait1.length; i++) {
 		if(trait1[i].checked){
 			if(last){
 				string+=",";
 			}
 			last = true;
 			string+= "interesting: ";
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
 			string+= "work: ";
 			if(trait2[i].id == "work1"){
 				string+="1";
 			} else if(trait2[i].id == "work2"){
 				string+="2";
 			}
 		}
 	}
 	for (i = 0; i < trait3.length; i++) {
 		if(trait3[i].checked){
 			if(last){
 				string+=",";
 			}
 			last = true;
 			string+= "organization: ";
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
 			string+= "pacing: ";
 			if(trait4[i].id == "pacing1"){
 				string+="1";
 			} else if(trait4[i].id == "pacing2"){
 				string+="2";
 			} else if(trait4[i].id == "pacing3"){
 				string+="3";
 			}
 		}
 	}

 	string += "}, 'user_id': 666}";
 	//alert(string);
 	var url = "http://www.raritan.herokuapp.com/fpo/1/Rutgers%20University%20-%20New%20Brunswick/";
 	var deptname = encodeURIComponent(document.getElementsByClassName("dept")[0].innerText);
 	url += deptname + "/";
 	var profname = encodeURIComponent(document.getElementsByClassName("prof")[0].innerText);
 	url += profname + "/";
 	url += "scores";
 	//url += document.getElementsByClass("title").innerText;

	

}
*/