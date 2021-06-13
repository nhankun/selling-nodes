$(function () {
    $.validator.setDefaults({
        submitHandler: function () {
            let url = $('#form-basic-product').attr('action');
            let method = $('#method').val();
            if (!method){
                method = $("#form-basic-product").attr("method") 
            }
            let form_data = new FormData($('#form-basic-product')[0]);

            for (let i = 0, len = filesToUpload.length; i < len; i++) {
                form_data.append("images[]", filesToUpload[i].file);
            }
            
            $.ajax({
                method: method,
                url: url,
                data: form_data,
                cache: false,
                contentType: false,
                processData: false,
                success: function (res) {
                    // console.log(res);
                    if(res.status == 200){
                        window.location.href = `/providers/products`;
                    }
                },
                error: function (err) {
                    console.log(err)
                    if(err.responseJSON.status == 422)
                        printErrors(err.responseJSON.data.errors);
                    else
                        Swal.fire("server_issue");
                }
            });
        }
    });

    $('#form-basic-product').validate({
        rules: {
            email: {
                required: true,
                email: true,
            },
            password: {
                required: true,
                minlength: 5
            },
            name1: {
                required: true
            },
        },
        messages: {
            email: {
                required: "Please enter a email address",
                email: "Please enter a vaild email address"
            },
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long"
            },
            name1: "Please accept our terms"
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });

    function printErrors(errors) {
        for (let [key, value] of Object.entries(errors)) {
            key = key.replace('[]', '')
            $("#error_"+key).replaceWith(`<p style="color: red;" id="error_${key}">${value}</p>`);
        }      
    }

    $(".cancel-submit").on('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        $('#form-basic-product').trigger('reset');
        window.location.href = '/providers/products';
    });

    $("#category_id").on('select2:select', function(e){
        let {id} = e.params.data;
        let url = `/providers/products/${id}/sub-category`;
        let string = '';
        $.ajax({
            method: 'GET',
            url: url,
            success: function (res) {
                let {status, data, message, view} = res;
                let {subCategories} = data;
                if (status == 200 && data){
                    subCategories.forEach((ele)=>{
                        string += `<option value="${ele._id}">${ele.name}</option>`;
                    })
                    $('#sub_category_id').html(string)
                }
                if (view.properties){
                    $(".flag-properties").html(view.properties)
                }
            },
            error: function (err) {
                console.log(err)
                Swal.fire("server_issue");
            }
        });
    })

    $('#category_id').trigger('change.select2');

    let category_id = $("#category_id").val();
    if (category_id){
        let url = `/providers/products/${category_id}/sub-category`;
        let string = '';
        $.ajax({
            method: 'GET',
            url: url,
            success: function (res) {
                let {status, data, message, view} = res;
                let {subCategories} = data;
                if (status == 200 && data){
                    subCategories.forEach((ele)=>{
                        string += `<option value="${ele._id}">${ele.name}</option>`;
                    })
                    $('#sub_category_id').html(string)
                }
                if (view.properties && editFlat != true){
                    $(".flag-properties").html(view.properties)
                }
            },
            error: function (err) {
                console.log(err)
                Swal.fire("server_issue");
            }
        });
    }

})
