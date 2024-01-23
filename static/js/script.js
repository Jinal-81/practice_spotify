function ajaxPostCallRequest(url, data, callbackSuccess=null, callbackFailure=null){
    $.ajax({
        url: url,
        method: "POST",
        cache: false,
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem('accessToken')}`
        },
        data: data,
        success: function (data){
            if (callbackSuccess){
                callbackSuccess(data);
            }
        },
        error: function (data){
            if (callbackFailure){
                callbackFailure(data);
            }
        }
    })
}
// user registration
$(document).ready(function (){
    // id of the form for the submit
    $('#sign_form_id').submit(function (event){
      event.preventDefault(); // avoid to execute the actual submit of the form.
      var current_url = window.location.origin;
      function successRegistrationThread(data){
           console.log(data)

           $.each(data.messages, function (i, m) {
                if (m.extra_tags=='success'){
                    toastr.success(m.message)
                }
                else if (m.extra_tags=='error'){
                    toastr.error(m.message)
                }
            });
           window.location.href = current_url + '/user/login/';
        }

        function failureRegistrationThread(data){
            var data_response = data.responseJSON;
            var current_form = $('#sign_form_id')[0]
            if (data.status==400 && data.responseJSON) {
                $.each(data_response, function( v, k ) {
                        debugger
                        var field = $(current_form).find('#'+v+'_id');
                        field.addClass('inputTxtError').before('<div class="error">'+k+'</div>');
                });
        }
        }

      var formData = {
      username: $("#username_id").val(),
      email: $("#email_id").val(),
      first_name: $("#first_name_id").val(),
      last_name: $('#last_name_id').val(),
      password: $("#password_id").val(),
      password2: $('#confirm_password_id').val(),
    };
    ajaxPostCallRequest(current_url + '/api/v1/register/', formData, successRegistrationThread, failureRegistrationThread)
    });
});

// user login
$(document).ready(function (){
    // id of the form for the submit
    $('#login_form_id').submit(function (event){
      event.preventDefault(); // avoid to execute the actual submit of the form.
      var current_url = window.location.origin;

      function successLoginThread(data){
           console.log(data)
           window.localStorage.setItem('refreshToken', data['refresh']);
           window.localStorage.setItem('accessToken', data['access']);
           $.each(data.messages, function (i, m) {
                if (m.extra_tags=='success'){
                    toastr.success(m.message)
                }
                else if (m.extra_tags=='error'){
                    toastr.error(m.message)
                }
            });
            var token = window.localStorage.getItem('accessToken');
            var payload = JSON.parse(atob(token.split('.')[1]));
            var username = payload.username;
           window.location.href = current_url + '/user/dashboard/';
           event.preventDefault(); // avoid to execute the actual submit of the form.
           document.getElementById('username').innerText = username;
        }

        function failureLoginThread(data){
            var data_response = data.responseJSON;
            var current_form = $('#login_form_id')[0]
            if (data.status==400 && data.responseJSON) {
                $.each(data_response, function( v, k ) {
                        var field = $(current_form).find('#'+v+'_id');
                        field.addClass('inputTxtError').before('<div class="error">'+k+'</div>');
                });
        }
        }

      var formData = {
      username: $("#username_id").val(),
      password: $("#password_id").val(),
    };
    ajaxPostCallRequest(current_url + '/api/v1/login/', formData, successLoginThread, failureLoginThread)
    });
});

// remove the errors
$(document).ready(function(){
    $("input").on( "focus", function() {
        $(this).parent().children('.error').remove()
    } );
});
