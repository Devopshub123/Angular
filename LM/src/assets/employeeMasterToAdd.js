$("#header").load("header.html");
$("#footer").load("footer.html");

function toggler(divId) {
  $("#" + divId).toggle();
}

$(document).ready(function(){

  var multipleCancelButton = new Choices('#choices-multiple-remove-button', {
    removeItemButton: true,
    maxItemCount:5,
    searchResultLimit:5,
    renderChoiceLimit:5
  });

  var MaxInputs       = 2; //maximum extra input boxes allowed
  var InputsWrapper   = $("#InputsWrapper"); //Input boxes wrapper ID
  var AddButton       = $("#AddMoreFileBox"); //Add button ID

  var x = InputsWrapper.length; //initlal text box count
  var FieldCount=1; //to keep track of text box added

  //on add input button click
  $(AddButton).click(function (e) {
    //max input box allowed
    if(x <= MaxInputs) {
      FieldCount++; //text box added ncrement
      //add input box
      $(InputsWrapper).append('<div class="form-row col-sm-12"><div class="form-group col-md-6"><label for="">Children 2</label><input class="form-control" type="text" name="mytext[]" id="field_'+ FieldCount +'"/></div><div class="form-group col-md-6"><label for="">Date of Birth</label><input type="date" class="form-control" id="" placeholder=""></div><a href="#" class="removeclass">Remove</a></div>');
      x++; //text box increment

      $("#AddMoreFileId").show();

      $('AddMoreFileBox').html("Add field");

      // Delete the "add"-link if there is 3 fields.
      if(x == 3) {
        $("#AddMoreFileId").hide();
        $("#lineBreak").html("<br>");
      }
    }
    return false;
  });

  $("body").on("click",".removeclass", function(e){ //user click on remove text
    if( x > 1 ) {
      $(this).parent('div').remove(); //remove text box
      x--; //decrement textbox

      $("#AddMoreFileId").show();

      $("#lineBreak").html("");

      // Adds the "add" link again when a field is removed.
      $('AddMoreFileBox').html("Add field");
    }
    return false;
  })


});

function EnableDisableTextBox(chkAddress) {
  var txtAddress = document.getElementById("txtAddress");
  txtAddress.disabled = chkAddress.checked ? true : false;
  if (!txtAddress.disabled) {
    txtAddress.focus();
  }
}
