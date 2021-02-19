//===============================================================
function drawRelayedTXs() {
    var table = document.createElement("tbody");
    //table.setAttribute('class', 'table');
    //table.style.width = '20px';

    var headerRow = document.createElement('tr');
    headerRow.className = "headerrd";
    var headersLabel = document.createElement('td');
    var headersNeoBalance = document.createElement('td');
    var headersAddress = document.createElement('td');

    headersLabel.innerHTML = "<b><center><font size='1'>STATUS</font></b>";
    headerRow.insertCell(-1).appendChild(headersLabel);
    headersAddress.innerHTML = "<b><center><font size='1'>HASH</font></b>";
    headerRow.insertCell(-1).appendChild(headersAddress);
    headersNeoBalance.innerHTML = "<b><center><font size='1'>EXTRA</font></b>";
    headerRow.insertCell(-1).appendChild(headersNeoBalance);

    table.appendChild(headerRow);

    for (rt = 0; rt < RELAYED_TXS.length; rt++) {
        var txRow = table.insertRow(-1);
        //row.insertCell(-1).appendChild(document.createTextNode(i));
        //Insert button that remove rule
        var b = document.createElement('button');
        b.setAttribute('content', 'test content');
        b.setAttribute('class', 'btn btn-danger btn-sm');
        b.setAttribute('value', ka);
        b.onclick = function() {
            removeRelayedTX(this.value);
        };
        b.innerHTML = ECO_WALLET[ka].label;
        txRow.insertCell(-1).appendChild(b);

        var addressBase58 = document.createElement('button');
        addressBase58.setAttribute('content', 'test content');
        addressBase58.setAttribute('class', 'btn btn-success btn-sm');
        addressBase58.setAttribute('value', ka);
        addressBase58.setAttribute('id', "btnGetBalanceAddress" + ka);
        addressBase58.onclick = function() {
            changeDefaultWallet(this.value);
        };
        addressBase58.innerHTML = ECO_WALLET[ka].account.address.slice(0, 4) + "..." + ECO_WALLET[ka].account.address.slice(-4);
        txRow.insertCell(-1).appendChild(addressBase58);
    } //Finishes loop that draws each relayed transaction

    //Clear previous data
    document.getElementById("table").innerHTML = "";
    //Append new table
    document.getElementById("tableWalletStatus").appendChild(table);
} //Finishe DrawWallets function
//===============================================================