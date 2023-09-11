function fillNodesList() {
    var boxID = "rpc_nodes_list";
    document.getElementById(boxID).options.length = 0;
    for (c = 0; c < BASE_PATH_CLI_NODES.length; c++)
        addOptionToSelectionBox(BASE_PATH_CLI_NODES[c], BASE_PATH_CLI_NODES[c], boxID, "Selected RPC node: " + BASE_PATH_CLI_NODES[c]);

    document.getElementById(boxID).selectedIndex = 0;
    changeRPCHeaderURL();
}