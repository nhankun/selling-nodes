const filesToUpload = new Array();

$(document).on('click', '.provider-image-btn-delete',function(event){
  event.preventDefault();
  event.stopPropagation();
  let image = $(this).data('image');
  let url = $(this).data('url');
  if(typeof url !== 'undefined' && url){
      $.ajax({
          method: 'DELETE',
          url: url,
          data: {image: image},
          // cache: false,
          // contentType: false,
          // contentType: 'application/json',
          // processData: false,
          success: function (res) {
              // console.log(res);
             
          },
          error: function (err) {
              console.log(err)
              Swal.fire("server_issue");
          }
      });
  }
  let divParent = $(this).parent();
  let divId = divParent.attr("id");
  $(this).parent().remove();
  let file_length = filesToUpload.length;
  for (var i = 0; i < file_length; ++i) {
      if (filesToUpload[i].id == divId){
      filesToUpload.splice(i, 1);
      }
  }
});

$('.btn-add-image').on('click', (e)=>{
    e.preventDefault();
    e.stopPropagation();
    $('#imageTmp').click();
})

$('#imageTmp').on('change', (e)=>{
    let input = $('#imageTmp')[0] ?? null;
    let placeToInsertImagePreview = $('#imageTmp').data('preview');
    imagesPreview(input, placeToInsertImagePreview);
})

let imagesPreview = (input, placeToInsertImagePreview) => {
    var validExtensions = ['image/jpg','image/png','image/jpeg']; //array of valid extensions
    if (input.files) {
      var filesAmount = input.files.length;
      var k = $('#'+placeToInsertImagePreview).children('div:last-child').attr('id');
      if (typeof k == "undefined" ) {k = 0}
      for (g = 0; g < filesAmount; g++)
      {
        k++;
        var file= input.files[g];
        var type = input.files[g].type;
        var FileSize = input.files[g].size / 1024 / 1024; // in MB
        if (FileSize > 40) {
          Swal.fire(error_image);
          break;
        }
        if ($.inArray(type, validExtensions) == -1) {
          input.value = '';
          Swal.fire(format_file+validExtensions.join(', '));
          break;
        }
        filesToUpload.push({
            id: k,
            file: file
        });
        readerFileImages(k,placeToInsertImagePreview,file);
      }
    }
    input.value = '';
  
}

let readerFileImages = (k,placeToInsertImagePreview,file)=>{
    var reader = new FileReader();
    reader.onload = function(event)
    {
        // var markup1 = "<div class='col-sm-3' id="+k+"><img src="+event.target.result+" style='height:150px;width:100%;border:1px solid #428bcaa3' onclick='showModal(event, \""+event.target.result+"\")'> <a href='javascript:;' data-url='' onclick='deleteImage(event ,"+k+", null)' class='deleteImage'><p style='text-align: center;padding-top:5px'><em class='fa fa-trash' style='font-size:1.5em'></em>"+ remove +"</p></a></div>";
        let markup1 = `<div class="col-sm-2 contain-provider-image" id="${k}">
        <a href="${event.target.result}" data-toggle="lightbox" data-title="Image" data-gallery="gallery">
          <img src="${event.target.result}" class="img-fluid mb-2 provider-images" alt="black sample">
        </a>
        <p class="btn bg-gradient-danger provider-image-btn-delete" data-url="" data-image=""> <i class="fas fa-trash"></i></p>
      </div>`
        $('#'+placeToInsertImagePreview).append(markup1);
        // changeDisplayIcon()
    };
    reader.readAsDataURL(file);
}