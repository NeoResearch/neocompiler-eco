var AVAILABLE_TABS = ["nav-compilers", "nav-contracts", "nav-wallet",
    "nav-rpc", "nav-activity", "nav-conversors", "nav-network", "nav-config"];

function goToTabAndClick(tabToGo) {
    var tabExists = false;
    for (var t = 0; t < AVAILABLE_TABS.length; t++) {
        if (AVAILABLE_TABS[t] === tabToGo) {
            tabExists = true;
            break;
        }
    }
    if (!tabExists) {
        console.error("ERROR LOADING PAGE. TAB DOES NOT EXIST! TRIED TO OBTAIN: " + tabToGo);
        return;
    }

    $('.nav a[href="#' + tabToGo + '"]').tab('show');
    // Simulate on click event as well
    $('.nav a[href="#' + tabToGo + '"]')[0].onclick();
}

$(document).ready(() => {
    let url = location.href.replace(/\/$/, "");

    if (location.hash) {
        const pairSplitByHash = url.split("#");
        goToTabAndClick(pairSplitByHash[1]);

        url = location.href.replace(/\/#/, "#");
        history.replaceState(null, null, url);
        setTimeout(() => {
            $(window).scrollTop(0);
        }, 150);
    } else {
        let newUrl = url;
        newUrl += "/#nav-compilers/";
        history.replaceState(null, null, newUrl);
    }

    $('a[data-toggle="tab"]').on("click", function () {
        let newUrl;
        const hash = $(this).attr("href");
        newUrl = url.split("#")[0] + hash;
        newUrl += "/";
        history.replaceState(null, null, newUrl);
        $(window).scrollTop(0);
    });
});