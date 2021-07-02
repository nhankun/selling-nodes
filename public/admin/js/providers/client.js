$(function () {
    $.validator.setDefaults({
        submitHandler: function () {
            let url = $('#form-basic-info-provider').attr('action');
            let method = $('#method').val();
            if (!method){
                method = $("#form-basic-info-provider").attr("method") 
            }
            let form_data = new FormData($('#form-basic-info-provider')[0]);

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
                        // window.location.href = `/providers/basic-infos`;
                        location.reload();
                        $(window).scrollTop(0);
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

    $('#form-basic-info-provider').validate({
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
        $('#form-basic-info-provider').trigger('reset');
        window.location.href = '/providers';
    });

    //setting phone pakage
    var input_phone_ct = document.querySelector("#phone");
    var iti = window.intlTelInput(input_phone_ct, {
        initialCountry: "vn",
    });

    $("#phone").on('change', function(){
        input_phone_ct.value =  iti.getNumber();
        // $("#phone").parent().next().attr('style','color: red;display:none;');
    })
    //reload
    $(document).ready(function() {
        $("#phone").trigger('change');
    });

    // map setting
    // var mymap = L.map('admin-map-provider').setView([16.0669077,108.2137987], 19);
    // var mymap = L.map('admin-map-provider',{zoom: 20, center: L.latLng([16.0669077,108.2137987])});
    // var marker = L.marker([16.0669077,108.2137987]).addTo(mymap);
    const myIcon = L.icon({
        iconUrl: '/assets/upload/defaults/iconmap.png',
        iconSize: [38, 38],
        iconAnchor: [22, 40],
        popupAnchor: [-3, -76],
        shadowUrl: '/assets/upload/defaults/iconmap.png',
        shadowSize: [38, 38],
        shadowAnchor: [22, 40]
    });

    var tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        {
            attribution: false
        });

    const longitude = $("#longitude").val() || 108.22700500488283;
    const latitude = $("#latitude").val() || 16.072537386536663;

    var mymap = L.map('admin-map-provider',
        {
            zoomControl: true,
            layers: [tileLayer]
            // maxZoom: 18,
            // minZoom: 6
        })
        .setView([latitude,longitude], 50);

    setTimeout(function () { mymap.invalidateSize() }, 800);

    var marker = L.marker([latitude,longitude],{
        draggable: true,
        autoPan: true,
        icon: myIcon,
        title: "MyPoint"
    }).addTo(mymap);

    marker.on("dragend",function(e){
        const changedPos = e.target.getLatLng();
        $('#longitude').val(changedPos.lng);
        $('#latitude').val(changedPos.lat);
    });

    mymap.addEventListener("click",function(e){
        const changedPos = e.latlng;
        let latlng = L.latLng(changedPos.lat, changedPos.lng);
        marker.setLatLng(latlng);
        $('#longitude').val(changedPos.lng);
        $('#latitude').val(changedPos.lat);
    });

    $(".longitude, .latitude").on('change', function(e){
        e.preventDefault();
        e.stopPropagation();
        let lon = $("#longitude").val();
        let lat = $("#latitude").val();
        let latlng = L.latLng(lat, lon);
        marker.setLatLng(latlng);
    });

})
