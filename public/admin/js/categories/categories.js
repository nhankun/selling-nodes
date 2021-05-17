$(function () {
    sortDiv();
    
    $('.add_element_property').on("click", function (){
        let max = 0;
        let c = $('.general:last').attr('id');
        $('.properties').find('.general').each((ind,val) => {
                if(val.getAttribute('id') > max)
                    max = val.getAttribute('id');
            }
        );
        c = max;
        if (typeof c === 'undefined')
        {
            c = 0;
        }
        c++;
        let new_property = `<div class="row general" id="${c}">
                <div class="col-1 text-center">
                    <p><i class="fa fa-plus"></i></p>
                </div>
                <div class="col-5">
                    <input name="properties[${c}][name]" type="text" class="form-control" id="name_${c}">
                </div>
                <div class="col-5">
                    <input name="properties[${c}][value]" type="text" class="form-control" id="value_${c}">
                </div>
                <div class="col-1">
                    <p class="btn btn-danger" onclick="deleteProperty(this,null)"><i class="fa fa-trash-alt"></i></p>
                </div>
            </div>`;

        $(".properties").append(new_property);
    })

    $(".widget-icon").on("click", ".icon-lable", function (){
        $(".widget-icon #icon-input").click()
    })

    $(".widget-user").on("click", ".banner-widget", function (){
        $("#banner-input").click()
    })

    $(".widget-user").on("change", "#banner-input",function (){
        let input = $(this)[0];
        if (!input) {
            alert("Um, couldn't find the fileinput element.");
        }
        else if (!input.files) {
            alert("This browser doesn't seem to support the `files` property of file inputs.");
        }
        else if (!input.files[0]) {
            alert("Please select a file before clicking 'Load'");
        }
        let validation = validationFormatImage(input);
        if(validation){
            let reader = new FileReader();
            let file = input.files[0];
            let makeup;
            reader.onload = function(event)
            {
                $(".banner-widget").attr("style",'background: url("'+event.target.result+'") center center');
            };
            reader.readAsDataURL(file);
        }
    })

    $(".widget-icon").on("change", "#icon-input",function (){
        let input = $(this)[0];
        if (!input) {
            alert("Um, couldn't find the fileinput element.");
        }
        else if (!input.files) {
            alert("This browser doesn't seem to support the `files` property of file inputs.");
        }
        else if (!input.files[0]) {
            alert("Please select a file before clicking 'Load'");
        }
        let validation = validationFormatImage(input);
        if(validation){
            let reader = new FileReader();
            let file = input.files[0];
            let makeup;
            reader.onload = function(event)
            {
                makeup = `<img class="icon-lable widget-user-img-full" src="${event.target.result}" alt="User Avatar">`
                $(".widget-icon img").remove();
                $(".widget-icon").append(makeup)
            };
            reader.readAsDataURL(file);
        }
    })

    function sortDiv()
    {
        $(".properties").sortable({
            cancel: ":input",
            items: ".general",
            start: function( event, ui ) {

            },
            stop: function( event, ui ) {

            }
        });
    }
})
