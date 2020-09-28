class Contact {
    initialize() {
        let email = "larry.tran@starixsoft.com";
        $(Contact.controls.supportLink).attr("href", "mailto:" + email);
        $(Contact.controls.supportLink).text(email);
    }
}
Contact.controls = {
    supportLink: "address a:first"
};
$(document).ready(function () {
    let contact = new Contact();
    contact.initialize();
});
//# sourceMappingURL=Contact.js.map