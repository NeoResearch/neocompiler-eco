function swal2Simple(sTitle, sText, sTimer, sIcon, html = false, sFooter = "") {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
        },
        buttonsStyling: false
    });

    if (sFooter == "" && sIcon == "error")
        sFooter = '<a href="https://github.com/NeoResearch/neocompiler-eco/issues">Open an issue if persists.</a>';

    if (!html) {
        swalWithBootstrapButtons.fire({
            icon: sIcon,
            title: sTitle,
            text: sText,
            timer: sTimer,
            footer: sFooter,
            color: "#00AF92",
            background: "#263A40"
        });
    } else {
        swalWithBootstrapButtons.fire({
            icon: sIcon,
            title: sTitle,
            html: sText,
            timer: sTimer,
            footer: sFooter,
            color: "#00AF92",
            background: "#263A40"
        });
    }
}


