function addCSContractFromLocalMap(value, key, language) {
    var added = false;
    if (value.language === language) {
        var exampleToAdd = document.createElement("option");
        exampleToAdd.setAttribute('id', "userContracts_" + key);
        exampleToAdd.appendChild(document.createTextNode(key));
        document.getElementById("ExampleList").appendChild(exampleToAdd);
        added = true;
    }
    return added;
}

function storeSmartContractExamplesToLocalStorage() {
    var myExamplesStringified = JSON.stringify([...USER_EXAMPLES]);
    setLocalStorage("mycontracts", encodeURIComponent(myExamplesStringified), 100);
}

function getSmartContractExamplesFromLocalStorage() {
    var mapCokies = getLocalStorage("mycontracts");
    if (mapCokies)
        return new Map(JSON.parse(decodeURIComponent(mapCokies)));
    return new Map();
}

function loadSmartContractExamplesFromLocalStorage(){
    USER_EXAMPLES = getSmartContractExamplesFromLocalStorage();
    var cachedSelectedIndex = $("#ExampleList")[0].selectedIndex;
    USER_EXAMPLES.forEach(function (value, key) {
        removeExampleFromList(key);
    });
    USER_EXAMPLES.forEach(function (value, key) {
        addCSContractFromLocalMap(value, key, SELECTED_COMPILER);
    });
    $("#ExampleList")[0].selectedIndex = cachedSelectedIndex;
}

function saveSCExample(fileName) {
    var scToSave = {
        codeArray: getAllSections(),
        language: SELECTED_COMPILER
    };

    var cachedSelectedIndex = $("#ExampleList")[0].selectedIndex;
    USER_EXAMPLES.forEach(function (value, key) {
        removeExampleFromList(key);
    });
    USER_EXAMPLES.set(fileName, scToSave);
    USER_EXAMPLES.forEach(function (value, key) {
        addCSContractFromLocalMap(value, key, SELECTED_COMPILER);
    });
    $("#ExampleList")[0].selectedIndex = cachedSelectedIndex;
    storeSmartContractExamplesToLocalStorage();
}

function removeExampleFromList(key) {
    if (document.getElementById("userContracts_" + key))
        document.getElementById("ExampleList").removeChild(document.getElementById("userContracts_" + key));
}

function deleteAllSCExamples() {
    USER_EXAMPLES.forEach(function (value, key) {
        removeExampleFromList(key);
    });

    USER_EXAMPLES = new Map();
    storeSmartContractExamplesToLocalStorage();
}

function restoreSCFromMapToAceEditor(fileNameKey) {
    if (USER_EXAMPLES.has(fileNameKey)) {
        var codeArray = USER_EXAMPLES.get(fileNameKey).codeArray;

        aceEditor.getSession().setValue(codeArray[0]);
        for (f = 1; f < codeArray.length; f++) {
            Editor.addNewTab("codeSaved_" + f);
            var nameToClick = "#textChildAce" + (Editor.tabs - 1);
            $(nameToClick).click();
            aceEditor.getSession().setValue(codeArray[f]);
        }
        goToACEMainTab();
        //aceEditor.getSession().setValue("ERROR WHILE RESTORING LOCAL CONTRACT! This should not happen. Size of files: " + codeArray.length);
    }
}