var rpcMethod = [
    // =================== Blockchain===========================
    ["getbestblockhash", 0, "Csharp.RpcServer.Blockchain", "Gets the hash of the tallest block in the main chain"],
    // "params": [26536, true] or "params": ["0xd373a9afdbe57d79ad788196aa4ef37dbfb28c7d8f22ffa1ccbc236d56268bca"]
    ["getblock", 2, "Csharp.RpcServer.Blockchain", "<index> <hash> [verbose=0]:	Returns the corresponding block information according to the specified hash value"],
    ["getblockheadercount", 0, "Csharp.RpcServer.Blockchain", "call description"],
    ["getblockcount", 0, "Csharp.RpcServer.Blockchain", "Gets the number of blocks in the main chain"],
    // "params": [10000]
    ["getblockhash", 1, "Csharp.RpcServer.Blockchain", "<index>: 	Returns the hash value of the corresponding block based on the specified index"],
    // "params": [140, true] or "params": ["0x3d87f53c51c93fc08e5ccc09dbd9e21fcfad4dbea66af454bed334824a90262c"],
    ["getblockheader", 2, "Csharp.RpcServer.Blockchain", "<index> <hash>:[verbose=0] 	Returns header"],
    // "params": ["neotoken"] or "params": ["0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5"],
    ["getcontractstate", 1, "Csharp.RpcServer.Blockchain", "Returns information about the contract based on the specified script hash"],
    // "params": [true]
    ["getrawmempool", 1, "Csharp.RpcServer.Blockchain", "Get a list of unconfirmed transactions in memory"],
    // "params": ["0x7da6ae7ff9d0b7af3d32f3a2feb2aa96c2a27ef8b651f9a132cfaad6ef20724c", true],
    ["getrawtransaction", 2, "Csharp.RpcServer.Blockchain", "<txid> [verbose=0]: 	Returns the corresponding transaction information based on the specified hash value"],
    // "params": ["0x99042d380f2b754175717bb932a911bc0bb0ad7d", "aGVsbG8="],
    ["getstorage", 1, "Csharp.RpcServer.Blockchain", "<script_hash> <key>: 	Returns the stored value based on the contract script hash and key"],
    // "params": ["0x99042d380f2b754175717bb932a911bc0bb0ad7d", "aGVsbG8=", int],
    ["findstorage", 3, "Csharp.RpcServer.Blockchain", "call description"],
    //"params": ["0x57280b29c2f9051af6e28a8662b160c216d57c498ee529e0cf271833f90e1a53"],
    ["gettransactionheight", 1, "Csharp.RpcServer.Blockchain", "<txid>: 	Returns the corresponding transaction height information based on the specified txid"],
    ["getnextblockvalidators", 0, "Csharp.RpcServer.Blockchain", "Returns the current NEO consensus nodes information and voting status"],
    ["getcandidates", 0, "Csharp.RpcServer.Blockchain", "call description"],
    ["getcommittee", 0, "Csharp.RpcServer.Blockchain", "call description"],
    ["getnativecontracts", 0, "Csharp.RpcServer.Blockchain", "call description"],
    // =================== Blockchain===========================

    // =================== Node ===========================
    ["getconnectioncount", 0, "Csharp.RpcServer.Node", "Gets the current number of connections for the node"],
    ["getpeers", 0, "Csharp.RpcServer.Node", "Get a list of nodes that are currently connected/disconnected by this node"],
    ["getversion", 0, "Csharp.RpcServer.Node", "Get version information of this node"],
    //"params": ["rawtx eMkLQZVEDXg="],
    ["sendrawtransaction", 1, "Csharp.RpcServer.Node", "<hex>: 	Broadcast a transaction over the network. See the network protocol documentation."],
    //"params": ["rawbloc eMkLQZVEDXg="],
    ["submitblock", 1, "Csharp.RpcServer.Node", "<hex>: 	Submit new blocks (Needs to be a consensus node)"],
    // =================== Node ===========================

    // =================== SmartContract ===========================
    /*"params": [
        "0xa1a375677dded85db80a852c28c2431cab29e2c4",
        "transfer",
        [
                {
                    "type": "Hash160",
                    "value": "0xfa03cb7b40072c69ca41f0ad3606a548f1d59966"
                },
                {
                    "type": "Hash160",
                    "value": "0xebae4ab3f21765e5f604dfdd590fdf142cfb89fa"
                },
                {
                    "type": "Integer",
                    "value": "10000"
                },
                {
                    "type": "String",
                    "value": ""
                }
            ],
            [
                {
                    "account": "0xfa03cb7b40072c69ca41f0ad3606a548f1d59966",
                    "scopes": "CalledByEntry",
                    "allowedcontracts": [],
                    "allowedgroups": []
                }
            ],
        true
      ]*/
    ["invokefunction", 4, "Csharp.RpcServer.SmartContract", "<script_hash> <operation> <params>:	Invokes a smart contract at specified script hash, passing in an operation and its params"],
    /*
    "params": [
    "DAABECcMFPqJ+ywU3w9Z3d8E9uVlF/KzSq7rDBRmmdXxSKUGNq3wQcppLAdAe8sD+hTAHwwIdHJhbnNmZXIMFMTiKascQ8IoLIUKuF3Y3n1ndaOhQWJ9W1I=",
        [
            {
                "account": "0xfa03cb7b40072c69ca41f0ad3606a548f1d59966",
                "scopes": "CalledByEntry",
                "allowedcontracts": [],
                "allowedgroups": []
            }
        ],
    true
    ]
    */
    ["invokescript", 3, "Csharp.RpcServer.SmartContract", "Runs a script through the virtual machine and returns the results"],
    /*
    "params": [
        "c5b628b6-10d9-4cc5-b850-3cfc0b659fcf",
        "593b02c6-138d-4945-846d-1e5974091daa",
        10
    ]
    */
    ["traverseiterator", 3, "Csharp.RpcServer.SmartContract", "call description"],
    // "params": ["c5b628b6-10d9-4cc5-b850-3cfc0b659fcf"]
    ["terminatesession", 1, "Csharp.RpcServer.SmartContract", "call description"],
    // "params": ["NgaiKFjurmNmiRzDRQGs44yzByXuSkdGPF"],
    ["getunclaimedgas", 1, "Csharp.RpcServer.SmartContract", "call description"],
    // =================== SmartContract ===========================

    // =================== UTILITIES ===========================
    ["listplugins", 0, "Csharp.RpcServer.Utilities", "Lists all the plugins loaded in the RPC node"],
    // "params": ["NPvKVTGZapmFWABLsyvfreuqn73jCjJtN1"],
    ["validateaddress", 1, "Csharp.RpcServer.Utilities", "<address>:	Verify that the address is a correct NEO address"],
    // =================== UTILITIES ===========================

    // =================== WALLET ===========================
    ["closewallet", 0, "Csharp.RpcServer.Wallet", "call description"],
    // "params": ["NepVckSSgHJf1szQ6LEibd5NU7Ap67yJrJ"]
    ["dumpprivkey", 1, "Csharp.RpcServer.Wallet", "<address> :	Export the private key of the specified address (Need to open the wallet)"],
    ["getnewaddress", 0, "Csharp.RpcServer.Wallet", "Create a new address (Need to open the wallet)"],
    // "params": ["0xd2a4cff31913016155e38e474a2c06d08be276cf"],
    ["getwalletbalance", 1, "Csharp.RpcServer.Wallet", "call description"],
    // looks like 0 but docs say different
    ["getwalletunclaimedgas", 0, "Csharp.RpcServer.Wallet", "call description"],
    //"params": ["KwYRSjqmEhK4nPuUZZz1LEUSxvSzSRCv3SVePoe67hjcdPGLRJY5"],
    ["importprivkey", 1, "Csharp.RpcServer.Wallet", "call description"],
    // "params": ["AAzUzgl2c4kAAAA] tx: Base64-encoded string of transaction information.
    ["calculatenetworkfee", 1, "Csharp.RpcServer.Wallet", "call description"],
    ["listaddress", 0, "Csharp.RpcServer.Wallet", "Lists all the addresses in the current wallet (Need to open the wallet)"],
    // "params": ["11.db3", "1"],  path: The wallet file path   password: In plain text.
    ["openwallet", 1, "Csharp.RpcServer.Wallet", "call description"],
    /*
    "params": [
        "0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5",
        "NgaiKFjurmNmiRzDRQGs44yzByXuSkdGPF",
        "NikhQp1aAD1YFCiwknhM5LQQebj4464bCJ",
        100000000
    ]
    */
    ["sendfrom", 4, "Csharp.RpcServer.Wallet", "call description"],
    /* from : Optional. The address from which you transfer the asset. 
    outputs_array ：Array, the data structure of each element in the array is as follows: 
    "params": [
        "NikhQp1aAD1YFCiwknhM5LQQebj4464bCJ",
        [
            {
                "asset": "0xf61eebf573ea36593fd43aa150c055ad7906ab83",
                "value": 10,
                "address": "NgaiKFjurmNmiRzDRQGs44yzByXuSkdGPF"
            },
            {
                "asset": "0x70e2301955bf1e74cbb31d18c2f96972abadb328",
                "value": 50000000,
                "address": "NgaiKFjurmNmiRzDRQGs44yzByXuSkdGPF"
            }
        ]
    ]
    */
    ["sendmany", 2, "Csharp.RpcServer.Wallet", "<outputs_array> [fee=0] [change_address]: 	Bulk transfer order (Need to open the wallet)"],
    // "params": [asset_id,address,value],
    // "params": ["0xd2a4cff31913016155e38e474a2c06d08be276cf", "NUuPz4k387bHuySx2e2RWhZj5SpF8V4Csy", 100],
    ["sendtoaddress", 3, "Csharp.RpcServer.Wallet", "<asset_id> <address> <value> [fee=0]: 	Transfer to specified address (Need to open the wallet)"],
    /*
    scripthash: Smart contract scripthash.

    params: The parameters to be passed to the smart contract operation.

    signers: Optional. List of contract signature accounts.
        account: signature account
        scopes: signature's valid scopes, allowed values: FeeOnly, CalledByEntry, CustomContracts, CustomGroups, Global
        allowedcontracts: contracts of the signature can take effect, if scopes is CustomContracts
        allowedgroups: pubkeys of the signature can take effect, if scopes is CustomGroups

    "params": [ 
    "0x92f5c79b88560584a900cfec15b0e00dc4d58b54", 
    [ ],
    [
        {
            "account": "NTpqYncLsNNsMco71d9qrd5AWXdCq8YLAA",
            "scopes": "CalledByEntry"
        }
    ]        
    */
    ["invokecontractverify", 0, "Csharp.RpcServer.Wallet", "call description"],
    // =================== WALLET ===========================


    // =================== LogReader ===========================
    /*
    txid: Transaction ID
    trigger type: Optional. It has the following options:
        OnPersist
        PostPersist
        Application
        Verification
        System: OnPersist | PostPersist
        All: OnPersist | PostPersist | Verification | Application
    */
    ["getapplicationlog", 2, "Csharp.ApplicationLogs.LogReader", "<txid>[verbose=0]: Returns the contract log based on the specified txid (Need to enable logging plugin)"],
    // =================== LogReader ===========================

    // =================== OracleService ===========================
    // OraclePub, txSign, msgSign - All FromBase64String
    ["submitoracleresponse", 3, "Csharp.OracleService", "call description"],
    // =================== OracleService ===========================

    // =================== Nep11Tracker ===========================
    /*
     "params": ["NdUL5oDPD159KeFpD5A9zw5xNF1xLX6nLT",1635146038919],
    address: The address to query the transaction information.
    startTime | endTime: Optional. The UTC timestamp which records the asset start or end time (included).
        If start and end timestamps are specified, transactions occurred in the time range are returned.
        If only one timestamp is specified, transactions occurred since that time are returned.
        If not specified, transactions in recent seven days are returned.
    */
    ["getnep11transfers", 2, "Csharp.Nep11Tracker", "call description"],
    // "params": ["NdUL5oDPD159KeFpD5A9zw5xNF1xLX6nLT"],
    ["getnep11balances", 1, "Csharp.Nep11Tracker", "call description"],
    /*
    contract: The contract hash
    tokenId: The hex string of token id
    "params": ["0xd9e2093de3dc2ef7cf5704ceec46ab7fadd48e7f","452023313032204e6f697a"]
    */
    ["getnep11properties", 2, "Csharp.Nep11Tracker", "call description"],
    // =================== Nep11Tracker ===========================

    // =================== Nep17Tracker ===========================
    // same as getnep11transfers
    ["getnep17transfers", 2, "Csharp.Nep17Tracker", "call description"],
    // "params": ["NgaiKFjurmNmiRzDRQGs44yzByXuSkdGPF"],
    ["getnep17balances", 1, "Csharp.Nep17Tracker", "<script_hash> :	Get Balance of Nep17"],
    // =================== Nep17Tracker ===========================

    // =================== StatePlugin ===========================
    // "params": [160] - index: Block index 
    ["getstateroot", 1, "Csharp.StatePlugin", "<index>:	Get state root from a specific height"],
    /*
    roothash: root hash of state root
    scripthash: Contract script hash
    key: key of the storage; Base64-encoded.
    "params": ["0x7bf925dbd33af0e00d392b92313da59369ed86c82494d0e02040b24faac0a3ca","0x79bcd398505eb779df6e67e4be6c14cded08e2f2","Fw=="]
    */
    ["getproof", 3, "Csharp.StatePlugin", "<state_root,script_hash>: 	Get proof"],
    /*
    roothash: root hash of the state root
    proof: proof data of the state root; Base64-encoded.
    "params": ["0x7bf925dbd33af0e00d392b92313da59369ed86c82494d0e02040b24faac0a3ca", "Bfv///8XBiQBAQ8DRzb6Vkdw0r5nxMBp6Z5nvbyXiupMvffwm0v5GdB6jHvyAAQEBAQEBAQEA7l84HFtRI5V11s58vA+8CZ5GArFLkGUYLO98RLaMaYmA5MEnx0upnVI45XTpoUDRvwrlPD59uWy9aIrdS4T0D2cA6Rwv/l3GmrctRzL1me+iTUFdDgooaz+esFHFXJdDANfA2bdshZMp5ox2goVAOMjvoxNIWWOqjJoRPu6ZOw2kdj6A8xovEK1Mp6cAG9z/jfFDrSEM60kuo97MNaVOP/cDZ1wA1nf4WdI+jksYz0EJgzBukK8rEzz8jE2cb2Zx2fytVyQBANC7v2RaLMCRF1XgLpSri12L2IwL9Zcjz5LZiaB5nHKNgQpAQYPDw8PDw8DggFffnsVMyqAfZjg+4gu97N/gKpOsAK8Q27s56tijRlSAAMm26DYxOdf/IjEgkE/u/CoRL6dDnzvs1dxCg/00esMvgPGioeOqQCkDOTfliOnCxYjbY/0XvVUOXkceuDm1W0FzQQEBAQEBAQEBAQEBAQEBJIABAPH1PnX/P8NOgV4KHnogwD7xIsD8KvNhkTcDxgCo7Ec6gPQs1zD4igSJB4M9jTREq+7lQ5PbTH/6d138yUVvtM8bQP9Df1kh7asXrYjZolKhLcQ1NoClQgEzbcJfYkCHXv6DQQEBAOUw9zNl/7FJrWD7rCv0mbOoy6nLlHWiWuyGsA12ohRuAQEBAQEBAQEBAYCBAIAAgA="],
    */
    ["verifyproof", 2, "Csharp.StatePlugin", "<state_root>: 	Verify Proof"],
    ["getstateheight", 0, "Csharp.StatePlugin", "Get state height"],
    /*
    roothash: The root hash of state root.
    scripthash: The contract hash
    prefix: The prefix of storage key, Base64-encoded.
    key: Optional. Returns the Base64-encoded key at the start of the result, with no information about the key in the result, but the result after the key.
    count: Optional. The count of returned items.
    "params": ["0xec31cdb14da4143e2ab471a8b5812d895b88fc1c12d54e112791491feca9b5f4","0xb1fbb6b0096919071769906bb23b2ca2ec51eea7","AQE="],
    */
    ["findstates", 5, "Csharp.StatePlugin", "call description"],
    /*
    roothash: The root hash of state root.
    scripthash: The contract hash.
    key: The storage key value encoded by Base64.
    "params": ["0xec31cdb14da4143e2ab471a8b5812d895b88fc1c12d54e112791491feca9b5f4","0xb1fbb6b0096919071769906bb23b2ca2ec51eea7","AQFM8QSIkBuHVYOd2kiRmQXXOI833w=="],
    */
    ["getstate", 3, "Csharp.StatePlugin", "call description"],
    // =================== StatePlugin ===========================
];

function addJsonRPCMethodsToSelectionBox() {
    for (m = 0; m < rpcMethod.length; m++)
        addOptionToSelectionBox(rpcMethod[m][0], rpcMethod[m][0], "rpcMethodSelectionBox", rpcMethod[m][3])

    $("#rpcMethodSelectionBox")[0].selectedIndex = 0;
    frmRPCJson();
}