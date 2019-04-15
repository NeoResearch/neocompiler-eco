function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    //console.log("going to save " + cvalue);
    //console.log("going to save " + encodeURIComponent(cvalue));

    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(cname) {
    var result = getCookie(cname);
    if (result != "")
        return true;
    return false;
}

function setLocalStorage(cname, cvalue) {
    localStorage.setItem(cname, cvalue);
}

function getLocalStorage(cname) {
    return localStorage.getItem(cname);
}

function storeCookiesExamples() {
        var myExamplesStringified = JSON.stringify([...USER_EXAMPLES]);
        console.log(myExamplesStringified);
        console.log(encodeURIComponent(myExamplesStringified));
        //setCookie("myexamples", encodeURIComponent(myExamplesStringified), 100);
	setLocalStorage("myexamples", encodeURIComponent(myExamplesStringified), 100);
}

function saveSCExample(){
    var fileName = $("#cbx_example_name")[0].value;
    if(fileName == "")
    {
	alert("Choose a file name for your Smart Contract to be saved.");
	return;
    }
    var scToSave = {
            code: ace.edit("aceEditor").getSession().getValue(),
	    language: SELECTED_COMPILER
    };

    USER_EXAMPLES.forEach(function(value, key) {
            removeExampleFromList(key);
    });
    USER_EXAMPLES.set(fileName, scToSave);
    USER_EXAMPLES.forEach(function(value, key) {
            addCSContractFromLocalMap(value, key, SELECTED_COMPILER);
    });
    storeCookiesExamples();
}

function deleteSCExample(){  
    var key = $("#cbx_example_name")[0].value;
    if(USER_EXAMPLES.has(key))
    {
	    document.getElementById("ExampleList").removeChild(document.getElementById("cookiesExample" + key))
	    USER_EXAMPLES.delete($("#cbx_example_name")[0].value);
	    storeCookiesExamples(); 
    }else{
	console.error("Deleting SC that do not exist in local cookies: " + key);	
    } 
}

function removeExampleFromList(key){
    document.getElementById("ExampleList").removeChild(document.getElementById("cookiesExample" + key));
}

function deleteAllSCExamples(){
    USER_EXAMPLES.forEach(function(value, key) {
            removeExampleFromList(key);
    });

    USER_EXAMPLES = new Map();
    storeCookiesExamples();
}

function addCSContractFromLocalMap(value, key, language)
{
      if(value.language === language)
      {
          var exampleToAdd = document.createElement("li");
          exampleToAdd.setAttribute('value', i);
	  exampleToAdd.setAttribute('id', "cookiesExample" + key);
          var onClickFunction = 'setExampleFromCookies("' + key + '");';
          exampleToAdd.setAttribute('onClick', onClickFunction)
          exampleToAdd.appendChild(document.createTextNode(key));
          document.getElementById("ExampleList").appendChild(exampleToAdd);
      }
}							
