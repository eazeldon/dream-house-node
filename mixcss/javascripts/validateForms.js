

//<!----new ejs- and edit ejs------>

//new ejs
//<!----new ejs- and edit ejs------>

//new ejs
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    ///File form uploads image
    bsCustomFileInput.init()


    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()


