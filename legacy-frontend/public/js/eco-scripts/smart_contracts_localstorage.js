function storeSmartContractExamplesToLocalStorage() {
    var myExamplesStringified = JSON.stringify([...USER_EXAMPLES]);
    //console.log(myExamplesStringified);
    //console.log(encodeURIComponent(myExamplesStringified));
    //setCookie("myexamples", encodeURIComponent(myExamplesStringified), 100);
    setLocalStorage("myexamples", encodeURIComponent(myExamplesStringified), 100);
}

function getSmartContractExamplesFromLocalStorage() {
    var mapCokies = getLocalStorage("myexamples");
    if(mapCokies)
      return new Map(JSON.parse(decodeURIComponent(mapCokies)));

    return new Map();	
}

function saveSCExample() {
    var fileName = $("#cbx_example_name")[0].value;
    if (fileName == "") {
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
    storeSmartContractExamplesToLocalStorage();
}

// Remove Contract Examples for UL list
function removeExampleFromList(key) {
    document.getElementById("ExampleList").removeChild(document.getElementById("cookiesExample" + key));
}

function deleteSCExample() {
    var key = $("#cbx_example_name")[0].value;
    if (USER_EXAMPLES.has(key)) {
        document.getElementById("ExampleList").removeChild(document.getElementById("cookiesExample" + key))
        USER_EXAMPLES.delete($("#cbx_example_name")[0].value);
        storeSmartContractExamplesToLocalStorage();
    } else {
        console.error("Deleting SC that do not exist in local cookies: " + key);
    }
}

function deleteAllSCExamples() {
    USER_EXAMPLES.forEach(function(value, key) {
        removeExampleFromList(key);
    });

    USER_EXAMPLES = new Map();
    storeSmartContractExamplesToLocalStorage();
}

function addCSContractFromLocalMap(value, key, language) {
    if (value.language === language) {
        var exampleToAdd = document.createElement("li");
        exampleToAdd.setAttribute('value', i);
        exampleToAdd.setAttribute('id', "cookiesExample" + key);
        var onClickFunction = 'SetExampleFromCookies("' + key + '");';
        exampleToAdd.setAttribute('onClick', onClickFunction)
        exampleToAdd.appendChild(document.createTextNode(key));
        document.getElementById("ExampleList").appendChild(exampleToAdd);
    }
}
