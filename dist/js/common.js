"use strict";

$(function(){
  //date input init
  $('#date').datetimepicker();

  //file size
  function findSize() {
    var fileInput = $("#zip")[0];
    return fileInput.files[0].size; // Size returned in bytes.
  }

  // function check email input
  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }

  //hide error msg
  $("input, select, textarea").focus(function(){
    $(this).removeClass("error");
    $(this).parent().find("div.error").hide();
  });

  $("#comment-form button[type=submit]").click(function(){
    var eflag = false;
    //validate blog review form
    $("#comment-form input, #comment-form textarea").each(function(){

      eflag = is_error($(this));
      //check captcha
      if(grecaptcha.getResponse() == ""){
        eflag = true;
        $("#g-recaptcha").parent().find("div.error")
            .css({
                "left": '10px',
                "display": 'block',
                "right": 'auto',
                "top": '2px',
                "z-index": '2'
            });
      }
    });

    if(eflag){
      return false;
    }else{
      return true;
    }
  });

  function is_error(elem){
    var eflag = false;
    if(elem.prop('required')){
      if(elem.val().trim() == ""){
        eflag = true;
        elem.addClass("error").prev(".error").show();
      }
      if(elem.attr("type") == "email"){
        if(!isEmail($("#email").val())){
          eflag = true;
          elem.addClass("error").prev(".error").show();
        }
      }
    }
    return eflag;
  }

  //check inputs
  $("#partyform button[type=submit]").on("click", function(e){
    e.preventDefault();
    var form = $("form#partyform");
    var eflag = false;

    //validate partyform
    $("#partyform input, #partyform select").each(function(){
      eflag = is_error($(this));
    });

    // check resume textarea
    if($("#howsend1").prop("checked")){
      if($("#resume-text").val().length < 50 || $("#resume-text").val().length > 20000){
        eflag = true;
        $("#resume-text").css("border","1px solid #ff0000");
        $("#resume-text + span").show();
      }
    }

    // check url
    if($("#howsend2").prop("checked")){
      if(!isUrlValid($("#url").val())){
        eflag = true;
        $("#url").css("border","1px solid #ff0000");
        $("#url + span").show();
      }
    }

    // check file size
    if(findSize() > 30000000){
      eflag = true;
      $("#file").css("border","1px solid #ff0000");
      $(".error.filemaxsize").show();
    }
    var parts = $("#zip").val().split('.');
    var filesExt = ['zip']; // массив расширений
    if(filesExt.join().search(parts[parts.length - 1]) == -1){
      eflag = true;
      $("#zip").css("border","1px solid #ff0000");
      $(".error.filetype").show();
    }


    //check captcha
    // if(grecaptcha.getResponse() == ""){
    //   eflag = true;
    //   $("#g-recaptcha").css("border","1px solid #ff0000");
    //   $(".error.captcha").show();
    // }

    //send email if no error
    if(!eflag){

      var form = $("#partyform")[0];
      var data = new FormData(form);

      $.ajax({
        url				 : 'email.php',
        data			 :  data,
        type			 : 'post',
        contentType: false,
        processData: false,

        beforeSend: function(){
          $('#careers input[type=submit]').attr('disabled', 'disabled');
        },
        success		: function(){
          $("#careers").fadeOut().delay(3200).fadeIn();
          $("#careers").trigger( 'reset' );
          $(".success-career").fadeIn().delay(3000).fadeOut();

        },
        error			: function(){
          $("#careers").fadeOut().delay(3200).fadeIn();
          $("#careers").trigger( 'reset' );
          $(".error-career").fadeIn().delay(3000).fadeOut();
        },
        complete	: function(){
          $('#careers input[type=submit]').removeAttr("disabled");
        }
      });
      // form.submit();
    }
  });

});