var urls = {
   login_url: '/user/login/',
   dashboard_url: '/user/dashboard/',
   register_api_url: '/api/v1/register/',
   login_api_url: '/api/v1/login/',
   songs_list_api_url: '/api/v1/songs_list/'
}
// ajax post call method
function ajaxPostCallRequest(url, data, callbackSuccess=null, callbackFailure=null){
    $.ajax({
        url: url,
        method: "POST",
        cache: false,
        dataType: 'json',
        data: data,
        success: function (data){
            if (callbackSuccess){
                callbackSuccess(data);
            }
        },
        error: function (jqXhr, textStatus, errorThrown){
            if (callbackFailure){
                callbackFailure(jqXhr, textStatus, errorThrown);
            }
        }
    })
}
// ajax get call method
function ajaxGetCallRequest(url, callbackSuccess=null, callbackFailure=null){
    $.ajax({
        url: url,
        method: "GET",
        cache: false,
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        success: function (data){
            if (callbackSuccess){
                callbackSuccess(data);
            }
        },
        error: function (jqXhr, textStatus, errorThrown){
            if (callbackFailure){
                callbackFailure(jqXhr, textStatus, errorThrown);
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
           window.location.href = current_url + urls.login_url;
        }

        function failureRegistrationThread(data){
            var data_response = data.responseJSON;
            var current_form = $('#sign_form_id')[0]
            if (data.status==400 && data.responseJSON) {
                $.each(data_response, function( v, k ) {
                        var field = $(current_form).find('#'+v+'_id');
                        field.addClass('inputTxtError').before('<div class="error">'+k+'</div>');
                });
        }
        }

    var formData = $('#sign_form_id').serializeArray();
    ajaxPostCallRequest(current_url + urls.register_api_url, formData, successRegistrationThread, failureRegistrationThread)
    });

    // id of the form for the submit
    $('#login_form_id').submit(function (event){
      event.preventDefault(); // avoid to execute the actual submit of the form.
      var current_url = window.location.origin;
      function successLoginThread(data){
           console.log(data)
//           localStorage.setItem('refreshToken', data['refresh']);
//           localStorage.setItem('accessToken', data['access']);
            $.cookie('access_token', data['access']);
           $.each(data.messages, function (i, m) {
                if (m.extra_tags=='success'){
                    toastr.success(m.message)
                }
                else if (m.extra_tags=='error'){
                    toastr.error(m.message)
                }
            });
            var token = localStorage.getItem('accessToken');
            var payload = JSON.parse(atob(token.split('.')[1]));
            var username = payload.username;
           window.location.href = current_url + urls.dashboard_url;
           event.preventDefault(); // avoid to execute the actual submit of the form.
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

      var formData = $('#login_form_id').serializeArray();
    ajaxPostCallRequest(current_url + urls.login_api_url, formData, successLoginThread, failureLoginThread)
    });

    $("input").on( "focus", function() {
        $(this).parent().children('.error').remove()
        } );

    if($('.songs-list')){
      var current_url = window.location.origin;
        function successLoginThread(data){
           console.log(data)
           $.cookie('access_token');
           debugger;
           $.each(data.results, function (i, m) {
               $('.songs-list').innerHTML = '<b>'+i+'</b>'
            });
//            var token = window.localStorage.getItem('accessToken');
//            var payload = JSON.parse(atob(token.split('.')[1]));
//            var username = payload.username;
//           window.location.href = current_url + urls.dashboard_url;
//           event.preventDefault(); // avoid to execute the actual submit of the form.
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

        ajaxGetCallRequest(current_url + urls.songs_list_api_url, successLoginThread, failureLoginThread)
    }
});
