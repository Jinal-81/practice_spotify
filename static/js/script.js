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
           localStorage.setItem('refreshToken', data['refresh']);
           localStorage.setItem('accessToken', data['access']);
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
           console.log(data.results.length)
           localStorage.getItem('accessToken')
           $.each(data.results, function (i, m) {
                console.log(i, m)
                elem = "<div class='col-xs-12 col-sm-6 col-md-4' bis_skin_checked='1'><div class='image-flip' bis_skin_checked='1'><div class='mainflip flip-0' bis_skin_checked='1'><div class='frontside' bis_skin_checked='1'><div class='card' bis_skin_checked='1'><div class='card-body text-center' bis_skin_checked='1'><p><img src='http://0.0.0.0:8000/static/images/Spotify-Logo.wine.svg' alt='Girl in a jacket' width='242' height='180'></p><h4 class='card-title'></h4><p class='card-text'>"+m.title+"</p><a href='https://www.fiverr.com/share/qb8D02' class='btn btn-primary btn-sm'><i class='fa fa-plus'></i></a></div></div></div><div class='backside' bis_skin_checked='1'><div class='card' bis_skin_checked='1'><div class='card-body text-center mt-4' bis_skin_checked='1'><h4 class='card-title'></h4><p class='card-text'><img src="+m.profile_pic+" alt='Girl in a jacket' width='442' height='180'></p><p><span><i class='bi bi-hand-thumbs-up'></i></span><span><i class='bi bi-hand-thumbs-down'></i></span><span><i class='bi bi-heart'></i></span></p></div></div></div></div></div></div><h1>"+m.title+"</h1>"
                $(".songs-list").append(elem)
            });
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
