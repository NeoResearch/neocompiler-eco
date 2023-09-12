function fillNodesList() {
    var boxID = "rpc_nodes_list";
    document.getElementById(boxID).options.length = 0;

    for (c = 0; c < BASE_PATH_CLI_NODES.length; c++)
        addOptionToSelectionBox(BASE_PATH_CLI_NODES[c], BASE_PATH_CLI_NODES[c], boxID, "Selected RPC node: " + BASE_PATH_CLI_NODES[c]);

    document.getElementById(boxID).selectedIndex = 0;
    changeRPCHeaderURL();
}

function updateCompilersList() {
    boxID = "compiler_list";
    document.getElementById(boxID).options.length = 0;

    addOptionToSelectionBox(BASE_PATH_COMPILERS, BASE_PATH_COMPILERS, boxID, "Selected server version is " + BASE_PATH_COMPILERS);

    //Select the latest as default
    document.getElementById(boxID).selectedIndex = 0;
    changeBasePathCompilers();
}

function changeBasePathCompilers() {
    var boxID = "compiler_list";
    var currentIndex = document.getElementById(boxID).selectedIndex;
    var newBasePathCli = document.getElementById(boxID)[currentIndex].value;
    BASE_PATH_COMPILERS = newBasePathCli;
}