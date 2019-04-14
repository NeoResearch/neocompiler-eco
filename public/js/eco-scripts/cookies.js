function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    console.log("going to save " + cvalue);
    console.log("going to save " + encodeURIComponent(cvalue));

    document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
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

function checkCookie(came) {
    var result = getCookie(came);
    if (result != "")
        return true;
    return false;
}

function saveSCExample(){
    var scToSave = {
            code: ace.edit("aceEditor").getSession().getValue(),
	    language: SELECTED_COMPILER
    };

    USER_EXAMPLES.set($("#cbx_example_name")[0].value, scToSave);
}

function deleteSCExample(){
    USER_EXAMPLES.delete($("#cbx_example_name")[0].value);
}


    function addCSContractFromLocalMap(value, key, language)
    {
      if(value.language === language)
      {
          var exampleToAdd = document.createElement("li");
          exampleToAdd.setAttribute('value', i);
          var onClickFunction = 'setExampleFromCookies("' + key + '");';
          exampleToAdd.setAttribute('onClick', onClickFunction)
          exampleToAdd.appendChild(document.createTextNode(key));
          document.getElementById("ExampleList").appendChild(exampleToAdd);
      }
    }							
