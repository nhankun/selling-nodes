$(function () {
    $(document).on('click', '[data-toggle="lightbox"]', function(event) {
        event.preventDefault();
        $(this).ekkoLightbox({
            alwaysShowClose: true
        });
    });
    
    //Initialize Select2 Elements
    $('.select2').select2()
    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    })
})

function validationFormatImage(input)
{
    let valid_extensions = ['image/jpeg','image/png']; //array of valid extensions
    if (input.files) {
        let file_length = input.files.length;
        for (let g = 0; g < file_length; g++)
        {
            let file = input.files[g];
            // let name = input.files[g].name;
            // let file_name_ext = name.substr(name.lastIndexOf('.') + 1);
            let file_type = file.type;
            let file_size = input.files[g].size / 1024 / 1024; // in MB
            if (file_size > 40) {
                Swal.fire(error_image);
                input.value = '';
                return false;
            }
            if ($.inArray(file_type, valid_extensions) == -1) {
                input.value = '';
                Swal.fire('image_file' + valid_extensions.join(', '));
                return false;
            }
        }
    }
    return true;
}
