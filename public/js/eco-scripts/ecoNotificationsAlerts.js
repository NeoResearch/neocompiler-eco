function createNotificationOrAlert(notifyTitle, notifyBody, notificationTimeout)
{
    if($("#cbx_ecoNotifications")[0].checked){
	  var permission = (Notification.permission === "granted");
     	  if (!permission) {
          	//alert(Notification.permission);
                //console.log(Notification.permission);
	  	Notification.requestPermission();
	  }

	  var options = {
	      body: notifyBody,
	      icon: 'public/images/prototype-icon-eco.png'
	  }

	  if(Notification.permission === "granted"){
		var n = new Notification(notifyTitle, options);
	 	setTimeout(function() {n.close.bind(n)}, notificationTimeout);
	  } else {
		//For devices that do not allow notifications
          	alert(notifyTitle + " : " + notifyBody);
	  }
     }else
     {
	console.log(notifyTitle + " : " + notifyBody);
     }
}
