// ==============================================================================================
// ======================= INITIALIZING BASE PATHS ==============================================
//COMPILERS EXPRESS RPC PATH
var BASE_PATH_COMPILERS = getFirstAvailableService("ecocompilers",ecoNodes);
//CSHARP RPC BASE PATH (On the main and testnet some python RPC are running - Check TODO)
var BASE_PATH_CLI = getFirstAvailableService("RPC",ecoNodes);
// ECO SERVICES RPC PATH - [SOCKETIO - CSHARPNODESLOGS - PYTHON-NOTIFICATIONS]
var BASE_PATH_ECOSERVICES = getFirstAvailableService("ecoservices",ecoNodes);
// NEOSCAN PATH PATH 
var BASE_PATH_NEOSCAN = getFirstAvailableService("neoscan",ecoNodes);
// PYTHON REST NOTIFICATIONS
var BASE_PATH_PY_REST = getFirstAvailableService("RESTNotifications",ecoNodes);

var LOCAL_DEVELOPMENT = false;
if(this.window.location.href.indexOf("localhost")  != -1)
	LOCAL_DEVELOPMENT = true;

if(LOCAL_DEVELOPMENT){
	BASE_PATH_COMPILERS = getFirstAvailableService("ecocompilers",localHostNodes);
        BASE_PATH_CLI = getFirstAvailableService("RPC",localHostNodes);
	BASE_PATH_ECOSERVICES = getFirstAvailableService("ecoservices",localHostNodes);
	BASE_PATH_NEOSCAN = getFirstAvailableService("neoscan",localHostNodes);
	BASE_PATH_PY_REST = getFirstAvailableService("RESTNotifications",localHostNodes);
}
// ==============================================================================================

//Initializating socket var
var socket = io.connect();

function getServiceURLByTypeAndNetwork(serviceType,networkService){
          var serviceUrlToAdd = '';

          if( (serviceType == "RPC") && ( (networkService.type == serviceType) || (networkService.type+"-Python" == serviceType+"-Python") ) )
          {
            if(networkService.protocol)
              serviceUrlToAdd = networkService.protocol + "://"+networkService.url;
            if(networkService.port)
              serviceUrlToAdd += ":"+networkService.port;

	    return serviceUrlToAdd;
          }

          if( networkService.type == serviceType)
          {
              serviceUrlToAdd = networkService.url;
          }

          return serviceUrlToAdd;
}

function getFirstAvailableService(serviceType,networkServicesObj){
          for(var kn = 0; kn < networkServicesObj.length; kn++)
          {
            var serviceUrlToAdd = getServiceURLByTypeAndNetwork(serviceType,networkServicesObj[kn]);

            if(serviceUrlToAdd !== '')
              return serviceUrlToAdd;
          }
}
