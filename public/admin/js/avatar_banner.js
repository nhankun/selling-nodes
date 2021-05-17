$(function () {

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
    
})
