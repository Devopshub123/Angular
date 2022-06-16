$("#header").load("header.html");
$("#footer").load("footer.html");

$(document).on('ready', function() {
  $("#input-44").fileinput({
    uploadUrl: 'file-upload-batch',
    maxFilePreviewSize: 10240
  });


});
