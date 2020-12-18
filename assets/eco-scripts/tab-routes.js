$(document).ready(() => {
    let url = location.href.replace(/\/$/, "");

    if (location.hash) {
        const pairSplitByHash = url.split("#");
        console.log("url is:" + pairSplitByHash)
        $('.nav a[href="#' + pairSplitByHash[1] + '"]').tab('show');
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

    $('a[data-toggle="tab"]').on("click", function() {
        let newUrl;
        const hash = $(this).attr("href");
        newUrl = url.split("#")[0] + hash;
        newUrl += "/";
        history.replaceState(null, null, newUrl);
    });
});