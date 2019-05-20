class Contact {
    private static controls = {
        supportLink: "address a:first"
    }

    public initialize(): void {
        let email: string = "larry.tran@starixsoft.com";

        $(Contact.controls.supportLink).attr("href", "mailto:" + email);
        $(Contact.controls.supportLink).text(email);
    }
}

$(document).ready(function () {
    let contact = new Contact();

    contact.initialize();
});