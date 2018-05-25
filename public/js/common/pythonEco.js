//===============================================================
$("#formdeploy").submit(function (e) {
        $("#deploybtn")[0].disabled = true;
        //$("#searchbtn")[0].disabled = true;
        $("#invokebtn")[0].disabled = true;
        $("#contractmessages").text("");
        $("#contractmessagesnotify").text("");
        e.preventDefault(); // Prevents the page from refreshing
        var $this = $(this); // `this` refers to the current form element
        var indata = $('#formdeploy, #formCompile').serialize();


        //TODO NEOCOMPILER - This ajax is for Jquery 1.8+
        //Current, it seems to be the most suitable  template for this project
        $.ajax({
         cache:false,
         type:"POST",
         url:BASE_ANGULARJS_PATH + $this.attr("action"), // Gets the URL to sent the post to
         data:indata,
         timeout:300000 // we chose 3 min secs for kicks on deploy - Current nodes with 15s sync
        }).done(function(data){
           $("#deploybtn")[0].disabled = false;
           $("#invokebtn")[0].disabled = false;

           //$("#contractmessages").val(data);
           $("#contractmessages").text(data);

           if($("#contractmessages").text().indexOf("insufficient funds for asset id") != -1)
              alert("Not enough GAS in wallet to perform deploy!");

           //Let's try to get the last relayed TX hash
           updateTXTableOfAPythonRelayedTX($("#contractmessages").text());
        }).fail(function(jqXHR, textStatus){
           //if(textStatus === 'timeout')
           //{
             //alert('Failed from timeout');
             //do something. Try again perhaps?
           //}
           //alert(textStatus);
           //alert(jqXHR);
           $("#deploybtn")[0].disabled = false;
           $("#invokebtn")[0].disabled = false;
           $("#contractmessages").text("Some unexpected error happened when calling POST for deploying!\n" + textStatus + "\n" + jqXHR);
        }); //End of ajax for POST deploy

	/*
        $.post(
            $this.attr("action"), // Gets the URL to sent the post to
            indata, // Serializes form data in standard format
            function (data) {
               $("#deploybtn")[0].disabled = false;
               $("#invokebtn")[0].disabled = false;
	       $("#contractmessages").val(data.replace(/[^\x00-\x7F]/g, ""));
               //Let's try to get the last relayed TX hash
               updateTXTable($("#contractmessages").text());
            },
            "json" // The format the response should be in
        );*/

}); //End of formdeploy function
//===============================================================



//===============================================================
$("#forminvoke").submit(function (e) {
      $("#deploybtn")[0].disabled = true;
      //$("#searchbtn")[0].disabled = true;
      $("#invokebtn")[0].disabled = true;
        $("#contractmessages").text("");
        $("#contractmessagesnotify").text("");
        e.preventDefault(); // Prevents the page from refreshing
        var $this = $(this); // `this` refers to the current form element
        var indata = $(this).serialize();

        //test invoke
        //Invoke('AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y', $("#invokehash").val(), 'Main');

        $.ajax({
         cache:false,
         type:"POST",
         url:BASE_ANGULARJS_PATH + $this.attr("action"), // Gets the URL to sent the post to
         data:indata,
        timeout:300000  // we chose 3 min secs for kicks on invokes - Current nodes with 15s sync
        }).done(function(data){
             $("#deploybtn")[0].disabled = false;
             $("#invokebtn")[0].disabled = false;


	         $("#contractmessages").text(data);

	         //TODO - FIX NOTIFY LOOP
	         updateNotifyReports($("#contractmessages").text());

             //Let's try to get the last relayed TX hash
             updateTXTableOfAPythonRelayedTX($("#contractmessages").text());
        }).fail(function(jqXHR, textStatus){
           $("#deploybtn")[0].disabled = false;
           $("#invokebtn")[0].disabled = false;
           $("#contractmessages").text("Some unexpected error happened when calling POST for invoke!\n" + textStatus + "\n" + jqXHR);
        }); //End of ajax for POST invoke

        /*
        $.post(
            $this.attr("action"), // Gets the URL to sent the post to
            indata, // Serializes form data in standard format
            function (data) {
              $("#deploybtn")[0].disabled = false;
              $("#searchbtn")[0].disabled = false;
              $("#invokebtn")[0].disabled = false;
                //console.log("output="+data);
                var deploymsg = atob(data.output);
                $("#contractmessages").text(deploymsg);
                $("#contractmessagesnotify").text("");
                var indexNotify = $("#contractmessages").text().indexOf("SmartContract.Runtime.Notify");
                while (indexNotify != -1) {
                    var i = 0;
                    var snotify = "";
                    //console.log("found Notiy at "+indexNotify);
                    while ($("#contractmessages").text()[indexNotify + "SmartContract.Runtime.Notify".length + 40 + 6 + i] != '\n') {
                        snotify += $("#contractmessages").text()[indexNotify + "SmartContract.Runtime.Notify".length + 40 + 6 + i];
                        i++;
                    }
                    //console.log("NOTIFY:"+snotify);
                    $("#contractmessagesnotify").text($("#contractmessagesnotify").text() + snotify + "\n");
                    indexNotify = $("#contractmessages").text().indexOf("SmartContract.Runtime.Notify", indexNotify + 1);
                }
            },
            "json" // The format the response should be in
        ); */
});//End of invoke function
//===============================================================

//===============================================================
function updateNotifyReports(contractMessagesBox){
             //----------------------------------------------------
             //Procedure for filtering notify messages and showing on events specify textnofity box
             $("#contractmessagesnotify").text("");
             var indexNotify = contractMessagesBox.indexOf("SmartContract.Runtime.Notify");
             while (indexNotify != -1) {
                 var i = 0;
                 var snotify = "";
                 //console.log("found Notiy at "+indexNotify);
                 while (contractMessagesBox[indexNotify + "SmartContract.Runtime.Notify".length + 40 + 6 + i] != ']') {
                     snotify += contractMessagesBox[indexNotify + "SmartContract.Runtime.Notify".length + 40 + 6 + i];
                     i++;
                 }
                 //console.log("NOTIFY:"+snotify);
                 $("#contractmessagesnotify").text($("#contractmessagesnotify").text() + snotify + "\n");
                 indexNotify = contractMessagesBox.indexOf("SmartContract.Runtime.Notify", indexNotify + 1);
             }

             //----------------------------------------------------
}
//===============================================================


//===============================================================
function updateTXTableOfAPythonRelayedTX(contractMessagesBox){
     var indexRelayedTx = contractMessagesBox.indexOf("Relayed Tx");
     var relayedTX = "";
     if(indexRelayedTx != -1)
     {
           //relayedTX = $("#contractmessages").text()[indexRelayedTx, 64];
           for(var i = 0; i<= 64; i++)
                 relayedTX += contractMessagesBox[indexRelayedTx + 12 + i];
           //console.log("Relayed tx is:"+relayedTX);
           vecRelayedTXs.push({tx:relayedTX, note:"Personal tx note"});
           drawRelayedTXs();
     }
}
//===============================================================
