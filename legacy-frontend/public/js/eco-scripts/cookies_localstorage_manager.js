function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    //console.log("going to save " + cvalue);
    //console.log("going to save " + encodeURIComponent(cvalue));
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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

function checkCookie(cname) {
    var result = getCookie(cname);
    if (result != "")
        return true;
    return false;
}

function setLocalStorage(cname, cvalue) {
    localStorage.setItem(cname, cvalue);
}

function getLocalStorage(cname) {
    return localStorage.getItem(cname);
}
