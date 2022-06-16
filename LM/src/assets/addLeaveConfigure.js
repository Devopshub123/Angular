$("#header").load("header.html");
$("#footer").load("footer.html");

function addLeaveConfigure() {
  if (document.getElementById('show-hide-table')) {

    if (document.getElementById('show-hide-table').style.display == 'none') {
      document.getElementById('show-hide-table').style.display = 'block';
      document.getElementById('myCompanyForm').style.display = 'none';
    }
    else {
      document.getElementById('show-hide-table').style.display = 'none';
      document.getElementById('myCompanyForm').style.display = 'block';
    }
  }
}

$(document).ready(function(){
  $('.js-edit, .js-save').on('click', function(){
    var $form = $(this).closest('form');
    $form.toggleClass('is-readonly is-editing');
    var isReadonly  = $form.hasClass('is-readonly');
    $form.find('input,textarea,select').prop('disabled', isReadonly);
  });
});

$(document).ready(function(){

  var current_fs, next_fs, previous_fs; //fieldsets
  var opacity;

  $(".next").click(function(){

    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    //Add Class Active
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
      step: function(now) {
        // for making fielset appear animation
        opacity = 1 - now;

        current_fs.css({
          'display': 'none',
          'position': 'relative'
        });
        next_fs.css({'opacity': opacity});
      },
      duration: 600
    });
  });

  $(".previous").click(function(){

    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    //Remove class active
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

    //show the previous fieldset
    previous_fs.show();

    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
      step: function(now) {
        // for making fielset appear animation
        opacity = 1 - now;

        current_fs.css({
          'display': 'none',
          'position': 'relative'
        });
        previous_fs.css({'opacity': opacity});
      },
      duration: 600
    });
  });

  $('.radio-group .radio').click(function(){
    $(this).parent().find('.radio').removeClass('selected');
    $(this).addClass('selected');
  });

  $(".submit").click(function(){
    return false;
  })

});

$('input[type="radio"]').click(function(){
  var inputValue = $(this).attr("value");
  var targetBox = $("." + inputValue);
  $(".required-condition").not(targetBox).hide();
  $(targetBox).show();
});

$('.cmn-checkbox input[type="checkbox"]').on('change', function() {
  $(this).siblings('.cmn-checkbox input[type="checkbox"]').not(this).prop('checked', false);
});

$('input[type="radio"][name="customRadioInlineyesss"]').on('change',function(){
  var ThisIt = $(this);
  if(ThisIt.val() == "no"){
    // when user select yes
    $('#delegateapprove').fadeOut();
  }else{
    // when user select no
    $('#delegateapprove').fadeIn();
    $('#delegateapprove').find("input").val("");
    $('#delegateapprove').find('select option:first').prop('selected',true);
  }
});

$(".second-approver").hide();
$(".second-approver-permision").click(function() {
  if($(this).is(":checked")) {
    $(".second-approver").show();
  } else {
    $(".second-approver").hide();
  }
});

$('input[type="radio"][name="secondcustomRadioInlineyesss"]').on('change',function(){
  var ThisIt = $(this);
  if(ThisIt.val() == "no"){
    // when user select yes
    $('#seconddelegateapprove').fadeOut();
  }else{
    // when user select no
    $('#seconddelegateapprove').fadeIn();
    $('#seconddelegateapprove').find("input").val("");
    $('#seconddelegateapprove').find('select option:first').prop('selected',true);
  }
});

$(".third-approver").hide();
$(".third-approver-permision").click(function() {
  if($(this).is(":checked")) {
    $(".third-approver").show();
  } else {
    $(".third-approver").hide();
  }
});

$('input[type="radio"][name="thirdcustomRadioInlineyesss"]').on('change',function(){
  var ThisIt = $(this);
  if(ThisIt.val() == "no"){
    // when user select yes
    $('#thirddelegateapprove').fadeOut();
  }else{
    // when user select no
    $('#thirddelegateapprove').fadeIn();
    $('#thirddelegateapprove').find("input").val("");
    $('#thirddelegateapprove').find('select option:first').prop('selected',true);
  }
});

$("select").change(function(){
  $(this).find("option:selected").each(function(){
    var optionValue = $(this).attr("value");
    if(optionValue){
      $(".box").not("." + optionValue).hide();
      $("." + optionValue).show();
    } else{
      $(".box").hide();
    }

    if(optionValue){
      $(".box1").not("." + optionValue).hide();
      $("." + optionValue).show();
    } else{
      $(".box1").show();
    }
  });
}).change();
